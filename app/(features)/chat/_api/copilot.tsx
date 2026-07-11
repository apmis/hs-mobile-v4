import { useUser } from "@/app/shared/api/auth";
import feathersClient from "@/app/shared/api/feathers";
import { useMutation, useQuery } from "@tanstack/react-query";

export const copilotKeys = {
    session: ['copilot', 'session'] as const,
};

const API_BASE_URL = "https://healthstack-ai.onrender.com/api/v1";

export const useCopilotSession = () => {
    const { data: user } = useUser();
    const facilityId = user?.facilityDetail?._id;
    return useQuery({
        queryKey: copilotKeys.session,
        queryFn: async () => {
            if (!facilityId) return null;
            const token = await feathersClient.authentication.getAccessToken();
            const response = await fetch(`${API_BASE_URL}/session/resolve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ active_facility_id: facilityId }),
            });
            if (!response.ok) throw new Error('Failed to resolve session');
            const data = await response.json();
            return data;
        },
        enabled: !!facilityId,
        staleTime: 1000 * 60 * 60, // Cache session for 1 hour
    });
};

export const useSendCopilotMessage = () => {
    return useMutation({
        mutationFn: async ({
            question,
            chatHistory,
            sessionId,
        }: {
            question: string;
            chatHistory: { role: string; content: string }[];
            sessionId: any;
        }) => {
            const token = await feathersClient.authentication.getAccessToken();
            const payload = {
                question,
                active_facility_id: sessionId?.active_facility_id,
                mode: "admin", // Standard default, can be extended later if needed
                notes_limit: 5,
                history: chatHistory,
            };

            const response = await fetch(`${API_BASE_URL}/copilot/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Could not connect to the API.');
            }

            const data = await response.json();

            // Parse dynamic response shapes based on HealthStack web implementation
            let responseText = "Sorry, I couldn't understand that request.";
            if (data) {
                if (typeof data === 'string') {
                    responseText = data;
                } else if (data.answer) {
                    responseText = typeof data.answer === 'string' ? data.answer : JSON.stringify(data.answer);
                } else if (typeof data.response === 'string') {
                    responseText = data.response;
                } else if (data.response?.text) {
                    responseText = data.response.text;
                } else if (typeof data.message === 'string') {
                    responseText = data.message;
                } else if (data.message?.content) {
                    responseText = data.message.content;
                } else if (data.content) {
                    responseText = typeof data.content === 'string' ? data.content : JSON.stringify(data.content);
                } else {
                    try {
                        responseText = JSON.stringify(data);
                    } catch (e) { }
                }
            }

            return responseText;
        }
    });
};
