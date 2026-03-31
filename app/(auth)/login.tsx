import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { Shield, Mail, Lock, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography } from '../../constants/Theme';
import Button from '../../components/Button';
import Input from '../../components/Input';

export default function LoginScreen() {
  const router = useRouter();

  const handleSignIn = () => {
    // Navigate to the tabs dashboard
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Shield size={moderateScale(32)} color={Colors.primary} fill={Colors.primary} />
          </View>
          <Text style={styles.title}>Healthstack</Text>
          <Text style={styles.subtitle}>Access your clinical workspace.</Text>
        </View>

        <View style={styles.formCard}>
          <Input 
            label="Email Address" 
            placeholder="name@medical-center.com"
            icon={<Mail size={20} color={Colors.textSecondary} />}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          
          <View style={styles.passwordHeader}>
            <Text style={styles.label}>Password</Text>
            <TouchableOpacity>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
          <Input 
            placeholder="••••••••••••"
            secureTextEntry
            icon={<Lock size={20} color={Colors.textSecondary} />}
          />

          <View style={styles.rememberRow}>
            <View style={styles.checkboxPlaceholder} />
            <Text style={styles.rememberText}>Remember this device</Text>
          </View>

          <Button 
            title="Sign In" 
            onPress={handleSignIn}
            icon={<ArrowRight size={20} color={Colors.white} />}
            style={styles.signInButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Button 
            title="Request Access" 
            type="outline" 
            onPress={() => {}} 
            style={styles.requestButton}
            textStyle={styles.requestButtonText}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles: any = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    borderRadius: '16@ms',
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '16@vs',
    // Logo card shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  title: {
    ...Typography.h1,
    color: '#0047AB', // Specific deep blue from design
    marginBottom: '8@vs',
  },
  subtitle: {
    ...Typography.subtitle,
    textAlign: 'center',
  },
  formCard: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: '24@ms',
    padding: '24@ms',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
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
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  forgotText: {
    fontSize: '12@ms',
    fontWeight: '600',
    color: Colors.primary,
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
    borderColor: Colors.border,
    marginRight: '10@s',
    backgroundColor: '#F5F5F5',
  },
  rememberText: {
    fontSize: '14@ms',
    color: Colors.textSecondary,
  },
  signInButton: {
    marginTop: '10@vs',
  },
  footer: {
    marginTop: 'auto',
    width: '100%',
    alignItems: 'center',
    paddingTop: '40@vs',
    paddingBottom: '20@vs',
  },
  footerText: {
    fontSize: '14@ms',
    color: Colors.textSecondary,
    marginBottom: '12@vs',
  },
  requestButton: {
    width: '100%',
  },
  requestButtonText: {
    color: '#0047AB',
  },
});
