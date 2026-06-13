import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { Shield, Mail, Lock, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography } from '@/app/shared/constants/Theme';
import Button from '@/app/shared/components/ui/Button';
import Input from '@/app/shared/components/ui/Input';
import { useThemeColor } from '../shared/hooks/useThemeColor';

export default function LoginScreen() {
  const router = useRouter();

  const handleSignIn = () => {
    // Navigate to the tabs dashboard
    router.replace('/(tabs)');
  };

  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');
  const whiteColor = useThemeColor({}, 'white');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image source={require('@/assets/images/healthstack-logo.png')} style={styles.logo} />
          </View>
          <Text style={[styles.title, { color: primaryColor }]}>Healthstack</Text>
          {/* <Text style={styles.subtitle}>Access your clinical workspace.</Text> */}
        </View>

        <View style={[styles.formCard, { backgroundColor: cardColor, borderColor }]}>
          <Input
            label="Email Address"
            placeholder="name@medical-center.com"
            icon={<Mail size={20} color={textSecondaryColor} />}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <View style={styles.passwordHeader}>
            <Text style={[styles.label, { color: textSecondaryColor }]}>Password</Text>
            <TouchableOpacity>
              <Text style={[styles.forgotText, { color: primaryColor }]}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
          <Input
            placeholder="••••••••••••"
            secureTextEntry
            icon={<Lock size={20} color={textSecondaryColor} />}
          />

          <View style={styles.rememberRow}>
            <View style={[styles.checkboxPlaceholder, { borderColor }]} />
            <Text style={[styles.rememberText, { color: textSecondaryColor }]}>Remember this device</Text>
          </View>

          <Button
            title="Sign In"
            onPress={handleSignIn}
            icon={<ArrowRight size={20} color={whiteColor} />}
            style={styles.signInButton}
          />
          <TouchableOpacity
            style={styles.chatLoginLink}
            onPress={() => router.push('/(auth)/chat-login')}
          >
            <Text style={[styles.chatLoginText, { color: primaryColor }]}>Or chat to login</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: textSecondaryColor }]}>Don't have an account?</Text>
          <Button
            title="Create An Organization"
            type="outline"
            onPress={() => router.push('/(auth)/signup')}
            style={styles.requestButton}
            textStyle={[styles.requestButtonText, { color: primaryColor }]}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles: any = ScaledSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: '24@ms',
    paddingTop: '60@vs',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: '40@vs',
  },
  logoContainer: {
    width: '64@ms',
    height: '64@ms',
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  title: {
    ...Typography.h1,
    marginBottom: '8@vs',
  },
  subtitle: {
    ...Typography.subtitle,
    textAlign: 'center',
  },
  formCard: {
    width: '100%',
    borderRadius: '24@ms',
    padding: '12@ms',
    borderWidth: 1,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '10@vs',
    marginBottom: '4@vs',
  },
  label: {
    fontSize: '12@ms',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  forgotText: {
    fontSize: '12@ms',
    fontWeight: '600',
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: '16@vs',
  },
  checkboxPlaceholder: {
    width: '20@ms',
    height: '20@ms',
    borderRadius: '4@ms',
    borderWidth: 1.5,
    marginRight: '10@s',
    backgroundColor: 'transparent',
  },
  rememberText: {
    fontSize: '14@ms',
  },
  signInButton: {
    marginTop: '10@vs',
  },
  footer: {
    marginTop: 'auto',
    width: '100%',
    alignItems: 'center',
    paddingTop: '10@vs',
    paddingBottom: '40@vs',
  },
  footerText: {
    fontSize: '14@ms',
    marginBottom: '12@vs',
  },
  requestButton: {
    width: '100%',
  },
  requestButtonText: {
  },
  chatLoginLink: {
    marginTop: moderateScale(16),
    alignItems: 'center',
  },
  chatLoginText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
});
