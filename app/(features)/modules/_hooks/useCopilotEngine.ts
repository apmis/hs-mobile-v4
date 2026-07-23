import { useState, useRef } from 'react';
import { useCopilotSession, useSendCopilotMessage } from '@/src/features/chat/_api/copilot';
import { formatMessageTime } from '@/src/features/chat/utils';
import { Message } from '../_components/generic/ChatInterface';

interface UseCopilotEngineOptions {
  moduleName: string;
  initialMessages?: Message[];
  actionHandlers?: Record<string, (payload?: any) => Promise<Message>>;
}

export function useCopilotEngine({ moduleName, initialMessages = [], actionHandlers = {} }: UseCopilotEngineOptions) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: sessionId } = useCopilotSession();
  const sendMessageMutation = useSendCopilotMessage();

  const handleSendText = async (text: string, isRetry: boolean = false) => {
    if (!text.trim()) return;

    if (text === 'Try again' && !isRetry) {
      const lastUserMsg = messages.slice().reverse().find(m => m.isMe);
      if (lastUserMsg && lastUserMsg.text) {
        if (actionHandlers[lastUserMsg.text]) {
          return handleAction(lastUserMsg.text, undefined, true);
        }
        return handleSendText(lastUserMsg.text, true);
      }
      return;
    }

    let validMessages = messages;
    if (!isRetry) {
      const timeStr = formatMessageTime(new Date());
      const userMsg: Message = {
        id: Date.now().toString(),
        isMe: true,
        sender: 'You',
        time: timeStr,
        text: text.trim(),
      };
      setMessages(prev => [...prev, userMsg]);
      validMessages = [...messages, userMsg];
    }

    setIsTyping(true);
    setError(null);

    // Build history
    validMessages = validMessages.filter(m => !m.isError);
    const chatHistory: { role: string; content: string }[] = [];
    let userCount = 0;
    let assistantCount = 0;

    for (let i = validMessages.length - 1; i >= 0; i--) {
      const m = validMessages[i];
      const isCopilot = !m.isMe;

      if (isCopilot && assistantCount < 5 && m.text) {
        chatHistory.unshift({ role: "assistant", content: m.text });
        assistantCount++;
      } else if (!isCopilot && userCount < 5 && m.text) {
        chatHistory.unshift({ role: "user", content: m.text });
        userCount++;
      }

      if (userCount >= 5 && assistantCount >= 5) break;
    }

    try {
      const responseText = await sendMessageMutation.mutateAsync({
        question: text.trim(),
        chatHistory,
        sessionId,
      });

      const aiTime = formatMessageTime(new Date());
      const isErrorResponse = responseText.includes("Sorry, I couldn't understand that request.");
      
      const aiMsg: Message = {
        id: Date.now().toString(),
        isMe: false,
        sender: `${moduleName} Copilot`,
        time: aiTime,
        text: responseText,
        isError: isErrorResponse,
        avatar: require('@/assets/images/Healthstack.png'),
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error("Copilot Error:", err);
      const aiTime = formatMessageTime(new Date());
      const errorMsg: Message = {
        id: Date.now().toString(),
        isMe: false,
        sender: `${moduleName} Copilot`,
        time: aiTime,
        text: `Sorry, I encountered an error: ${err.message || "Could not connect to the API."}`,
        isError: true,
        avatar: require('@/assets/images/Healthstack.png'),
        suggestedActions: ['Try again'],
      };
      setMessages(prev => [...prev, errorMsg]);
      setError(err.message || "Could not connect to the API.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleAction = async (actionId: string, payload?: any, isRetry: boolean = false) => {
    const handler = actionHandlers[actionId];
    if (!handler) {
      console.warn(`No handler found for action: ${actionId}`);
      return;
    }

    if (!isRetry) {
      const timeStr = formatMessageTime(new Date());
      const userMsg: Message = {
        id: Date.now().toString() + '-action',
        isMe: true,
        sender: 'You',
        time: timeStr,
        text: actionId,
      };
      setMessages(prev => [...prev, userMsg]);
    }
    
    setIsTyping(true);
    setError(null);

    try {
      const responseMsg = await handler(payload);
      setMessages(prev => [...prev, responseMsg]);
    } catch (err: any) {
      console.error(`Action ${actionId} Error:`, err);
      const errorMsg: Message = {
        id: Date.now().toString(),
        isMe: false,
        sender: `${moduleName} Copilot`,
        time: formatMessageTime(new Date()),
        text: `Action failed: ${err.message || "Unknown error occurred."}`,
        isError: true,
        avatar: require('@/assets/images/Healthstack.png'),
        suggestedActions: ['Try again'],
      };
      setMessages(prev => [...prev, errorMsg]);
      setError(err.message || "Action failed.");
    } finally {
      setIsTyping(false);
    }
  };

  const appendMessage = (message: Message) => {
    setMessages(prev => {
      const last = prev[prev.length - 1];
      if (last && last.text === message.text && last.sender === message.sender) {
        // Prevent immediate duplicate messages
        return prev;
      }
      return [...prev, message];
    });
  };

  return {
    messages,
    isTyping,
    error,
    handleSendText,
    handleAction,
    appendMessage,
  };
}
