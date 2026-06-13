import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { Colors, Spacing } from '@/app/shared/constants/Theme';
import { useThemeColor } from '../shared/hooks/useThemeColor';

// Icons
import { ArrowLeft } from 'iconsax-react-native';
import {
  MoreVertical,
  Send,
  CheckCheck,
  Building2,
  MapPin,
  User,
  ShieldCheck
} from 'lucide-react-native';

const SIGNUP_STEPS = [
  // STEP 1: Organization Detail
  { field: 'orgName', label: 'Organization Name', step: 1, prompt: "👋 Welcome to Healthstack! Let's get your organization set up. First, what is your Organization's Name?" },
  { field: 'orgCEO', label: 'Organization CEO', step: 1, prompt: "Excellent! Who is the current CEO of the organization?" },
  { field: 'orgType', label: 'Organization Type', step: 1, prompt: "What type of organization is it (e.g. Hospital, Clinic, Diagnostic Center)?" },
  { field: 'orgCategory', label: 'Organization Category', step: 1, prompt: "Under what category does it fall?" },
  { field: 'cacNumber', label: 'CAC Number', step: 1, prompt: "Please provide your CAC registration number." },

  // STEP 2: Official Address
  { field: 'officialAddress', label: 'Official Address', step: 2, prompt: "Moving to Step 2: Official Details. What's the Official Address?" },
  { field: 'lga', label: 'LGA', step: 2, prompt: "Which Local Government Area (LGA)?" },
  { field: 'city', label: 'City', step: 2, prompt: "In which City is it located?" },
  { field: 'state', label: 'State', step: 2, prompt: "Which State?" },
  { field: 'country', label: 'Country', step: 2, prompt: "And the Country?" },
  { field: 'phone', label: 'Phone Number', step: 2, prompt: "What is the official Phone Number?" },
  { field: 'email', label: 'Email Address', step: 2, prompt: "And the official Email Address?" },

  // STEP 3: Admin
  { field: 'adminFirstName', label: 'First Name', step: 3, prompt: "Great! Step 3 is for the ADMIN. What is your First Name?" },
  { field: 'adminLastName', label: 'Last Name', step: 3, prompt: "And your Last Name?" },
  { field: 'adminEmail', label: 'Admin Email', step: 3, prompt: "What's your personal Admin Email Address?" },
  { field: 'adminPhone', label: 'Admin Phone', step: 3, prompt: "Your Phone Number?" },
  { field: 'adminProfession', label: 'Profession', step: 3, prompt: "What is your Profession?" },
  { field: 'adminPosition', label: 'Position', step: 3, prompt: "What is your current Position?" },
  { field: 'adminDepartment', label: 'Department', step: 3, prompt: "Which Department do you belong to?" },
  { field: 'adminDeptUnit', label: 'Department Unit', step: 3, prompt: "And the Department Unit?" },
  { field: 'password', label: 'Password', step: 3, prompt: "Finally, set a secure password for your account.", isPassword: true },
];

export default function SignupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    {
      id: 'welcome',
      isMe: false,
      sender: 'ASSISTANT',
      time: 'Just now',
      text: SIGNUP_STEPS[0].prompt,
    }
  ]);

  const getTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const mins = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMins = mins < 10 ? `0${mins}` : mins;
    return `${formattedHours < 10 ? '0' : ''}${formattedHours}:${formattedMins} ${ampm}`;
  };

  const handleSend = () => {
    if (!inputText.trim() || isTyping) return;

    const userMessageText = inputText.trim();
    const currentStep = SIGNUP_STEPS[currentStepIndex];
    const timeStr = getTime();

    // Store the data
    const newFormData = { ...formData, [currentStep.field]: userMessageText };
    setFormData(newFormData);

    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      isMe: true,
      sender: 'You',
      time: timeStr,
      text: userMessageText,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Progress to next question or complete
    if (currentStepIndex < SIGNUP_STEPS.length - 1) {
      const nextIndex = currentStepIndex + 1;
      const nextStep = SIGNUP_STEPS[nextIndex];

      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const botMessage = {
          id: `bot-${Date.now()}`,
          isMe: false,
          sender: 'ASSISTANT',
          time: getTime(),
          text: nextStep.prompt,
          stepChange: nextStep.step !== currentStep.step ? nextStep.step : null
        };
        setMessages(prev => [...prev, botMessage]);
        setCurrentStepIndex(nextIndex);

        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }, 1200);
    } else {
      // Signup complete!
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const finalMessage = {
          id: `bot-final`,
          isMe: false,
          sender: 'ASSISTANT',
          time: getTime(),
          text: "Registration successful! Welcome to the Healthstack family. Redirecting you to login...",
        };
        setMessages(prev => [...prev, finalMessage]);

        setTimeout(() => {
          router.replace('/(auth)/chat-login');
        }, 2500);
      }, 1500);
    }
  };

  const currentProgress = ((currentStepIndex + 1) / SIGNUP_STEPS.length) * 100;
  const currentStepNum = SIGNUP_STEPS[currentStepIndex].step;

  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');
  //const tintColor = useThemeColor({}, 'tint');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <Stack.Screen options={{ headerShown: false }} />

        {/* Header */}
        <View style={[styles.headerContainer, { backgroundColor: cardColor, borderBottomColor: borderColor }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={moderateScale(24)} color={textColor} variant="Linear" />
          </TouchableOpacity>

          <View style={styles.avatarContainer}>
            <Image
              source={require('@/assets/images/Healthstack.png')}
              style={styles.headerAvatar}
            />
            <View style={[styles.onlineDot, { borderColor: cardColor }]} />
          </View>

          <View style={styles.headerTitleContainer}>
            <Text style={[styles.headerTitle, { color: textColor }]} numberOfLines={1}>Healthstack Copilot</Text>
            <View style={styles.statusRow}>
              <View style={styles.statusInner}>
                <Text style={styles.onlineText}>Active Now</Text>
                <View style={styles.divider} />
                <Text style={styles.stepText}>Step {currentStepNum} of 3</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.iconButton}>
            <MoreVertical size={moderateScale(22)} color={textSecondaryColor} />
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${currentProgress}%`, backgroundColor: primaryColor }]} />
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.chatArea}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          <View style={[styles.welcomeBanner, { backgroundColor: cardColor, borderColor }]}>
            <View style={[styles.welcomeIconCircle, { backgroundColor: primaryColor + '20' }]}>
              <ShieldCheck size={moderateScale(32)} color={primaryColor} />
            </View>
            <Text style={[styles.welcomeTitle, { color: textColor }]}>Create Organization</Text>
            <Text style={[styles.welcomeSubtitle, { color: textSecondaryColor }]}>Complete these 3 steps to launch your digital clinical workspace.</Text>
          </View>

          {messages.map((msg, index) => {
            if (msg.isMe) {
              return (
                <View key={msg.id} style={styles.groupMessageRowRight}>
                  <View style={styles.groupMsgContentColRight}>
                    <View style={[styles.bubbleRightGroup, { backgroundColor: primaryColor }]}>
                      <Text style={styles.messageTextRight}>{msg.text}</Text>
                    </View>
                    <View style={styles.timeStatusContainerRight}>
                      <Text style={[styles.groupTimeLabelRight, { color: textSecondaryColor }]}>{msg.time}</Text>
                      <CheckCheck size={moderateScale(14)} color={primaryColor} style={{ marginLeft: 4 }} />
                    </View>
                  </View>
                </View>
              );
            }

            return (
              <View key={msg.id} style={styles.messageGroupLeft}>
                {msg.stepChange && (
                  <View style={styles.stepTransition}>
                    <View style={[styles.stepLine, { backgroundColor: borderColor }]} />
                    <View style={[styles.stepLabelContainer, { backgroundColor: backgroundColor, borderColor }]}>
                      {msg.stepChange === 2 ? (
                        <MapPin size={12} color={textSecondaryColor} style={{ marginRight: 4 }} />
                      ) : (
                        <User size={12} color={textSecondaryColor} style={{ marginRight: 4 }} />
                      )}
                      <Text style={[styles.stepLabelText, { color: textSecondaryColor }]}>
                        {msg.stepChange === 2 ? "STEP 2: OFFICIAL ADDRESS" : "STEP 3: ADMIN DETAILS"}
                      </Text>
                    </View>
                    <View style={[styles.stepLine, { backgroundColor: borderColor }]} />
                  </View>
                )}

                <View style={styles.senderHeader}>
                  <View style={[styles.senderBadge, { backgroundColor: borderColor }]}>
                    <Text style={[styles.senderBadgeText, { color: textSecondaryColor }]}>COPILOT</Text>
                  </View>
                  <Text style={[styles.timeLabel, { color: textSecondaryColor }]}>{msg.time}</Text>
                </View>
                <View style={[styles.bubbleLeft, { backgroundColor: cardColor, borderColor }]}>
                  <Text style={[styles.messageTextLeft, { color: textColor }]}>{msg.text}</Text>
                </View>
              </View>
            );
          })}

          {isTyping && (
            <View style={styles.typingContainer}>
              <View style={[styles.bubbleLeftTyping, { backgroundColor: borderColor }]}>
                <ActivityIndicator size="small" color={primaryColor} />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={[styles.inputContainer, { paddingBottom: insets.bottom || moderateScale(20), backgroundColor: cardColor, borderTopColor: borderColor }]}>
          <View style={[styles.inputWrapper, { backgroundColor: backgroundColor, borderColor }]}>
            <TextInput
              style={[styles.textInput, { color: textColor }]}
              placeholder={SIGNUP_STEPS[currentStepIndex].label + "..."}
              placeholderTextColor="#9CA3AF"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSend}
              autoFocus
              secureTextEntry={SIGNUP_STEPS[currentStepIndex].isPassword}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={[styles.sendButton, { backgroundColor: primaryColor }, !inputText.trim() && { backgroundColor: borderColor }]}
              onPress={handleSend}
              disabled={!inputText.trim() || isTyping}
            >
              <Send
                size={moderateScale(18)}
                color="#FFFFFF"
                strokeWidth={2.5}
                opacity={inputText.trim() ? 1 : 0.5}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = ScaledSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: moderateScale(10),
    zIndex: 10,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: Spacing.sm,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Spacing.sm,
  },
  headerAvatar: {
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(21),
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: moderateScale(5),
    backgroundColor: '#10B981',
    borderWidth: 2,
  },
  headerTitleContainer: {
    flex: 1,
    paddingLeft: moderateScale(4),
  },
  headerTitle: {
    fontSize: moderateScale(17),
    fontWeight: '800',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateScale(1),
  },
  statusInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineText: {
    fontSize: moderateScale(11),
    fontWeight: '700',
    color: '#10B981',
  },
  divider: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#D1D5DB',
    marginHorizontal: moderateScale(6),
  },
  stepText: {
    fontSize: moderateScale(11),
    fontWeight: '600',
    color: '#6B7280',
  },
  iconButton: {
    padding: Spacing.xs,
  },
  progressTrack: {
    height: moderateScale(3),
    backgroundColor: '#E5E7EB',
    width: '100%',
  },
  progressFill: {
    height: '100%',
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    padding: Spacing.md,
    paddingBottom: moderateScale(40),
  },
  welcomeBanner: {
    alignItems: 'center',
    paddingVertical: moderateScale(30),
    borderRadius: moderateScale(24),
    marginBottom: moderateScale(24),
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  welcomeIconCircle: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(32),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: moderateScale(16),
  },
  welcomeTitle: {
    fontSize: moderateScale(20),
    fontWeight: '800',
    marginBottom: moderateScale(4),
  },
  welcomeSubtitle: {
    fontSize: moderateScale(13),
    textAlign: 'center',
    paddingHorizontal: moderateScale(30),
    lineHeight: moderateScale(18),
  },
  messageGroupLeft: {
    marginBottom: moderateScale(20),
    alignItems: 'flex-start',
    maxWidth: '88%',
  },
  stepTransition: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: moderateScale(24),
    paddingHorizontal: moderateScale(10),
  },
  stepLine: {
    flex: 1,
    height: 1,
  },
  stepLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(12),
    borderWidth: 1,
  },
  stepLabelText: {
    fontSize: moderateScale(10),
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  senderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(6),
  },
  senderBadge: {
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(2),
    borderRadius: moderateScale(4),
    marginRight: moderateScale(8),
  },
  senderBadgeText: {
    fontSize: moderateScale(10),
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  timeLabel: {
    fontSize: moderateScale(10),
    fontWeight: '500',
  },
  bubbleLeft: {
    padding: moderateScale(16),
    borderTopLeftRadius: 0,
    borderTopRightRadius: moderateScale(18),
    borderBottomRightRadius: moderateScale(18),
    borderBottomLeftRadius: moderateScale(18),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
  },
  messageTextLeft: {
    fontSize: moderateScale(15),
    lineHeight: moderateScale(22),
    fontWeight: '500',
  },
  groupMessageRowRight: {
    flexDirection: 'row',
    marginBottom: moderateScale(20),
    justifyContent: 'flex-end',
  },
  groupMsgContentColRight: {
    maxWidth: '85%',
    alignItems: 'flex-end',
  },
  bubbleRightGroup: {
    padding: moderateScale(16),
    borderRadius: moderateScale(18),
    borderTopRightRadius: moderateScale(4),
    shadowColor: '#0059B2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  messageTextRight: {
    fontSize: moderateScale(15),
    color: Colors.white,
    lineHeight: moderateScale(22),
    fontWeight: '500',
  },
  timeStatusContainerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: moderateScale(6),
    marginRight: moderateScale(4),
  },
  groupTimeLabelRight: {
    fontSize: moderateScale(10),
    fontWeight: '500',
  },
  typingContainer: {
    marginBottom: moderateScale(20),
  },
  bubbleLeftTyping: {
    padding: moderateScale(12),
    borderRadius: moderateScale(16),
    alignSelf: 'flex-start',
    width: moderateScale(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: moderateScale(16),
    borderTopWidth: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: moderateScale(30),
    borderWidth: 1.5,
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(4),
  },
  textInput: {
    flex: 1,
    minHeight: moderateScale(48),
    fontSize: moderateScale(15),
    fontWeight: '500',
  },
  sendButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: moderateScale(8),
  },
  sendButtonDisabled: {
  },
});
