import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Platform, StatusBar } from 'react-native';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Monitor, Moon, Sun, Type, Eye } from 'lucide-react-native';
import { useThemeColor } from '@/app/shared/hooks/useThemeColor';
import { useThemeStore } from '@/app/shared/store/useThemeStore';

export default function AppearanceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const themePreference = useThemeStore((state) => state.themePreference);
  const setThemePreference = useThemeStore((state) => state.setThemePreference);

  // const [highContrast, setHighContrast] = useState(false);
  // const [reduceMotion, setReduceMotion] = useState(false);

  // Semantic Colors
  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');

  const ThemeOption = ({ label, icon: Icon, value }: any) => {
    const isSelected = themePreference === value;
    return (
      <TouchableOpacity
        style={[styles.themeOption, { backgroundColor: cardColor, borderColor: isSelected ? primaryColor : borderColor }]}
        onPress={() => setThemePreference(value)}
        activeOpacity={0.7}
      >
        <View style={[styles.themeIconBox, { backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.1)' : 'transparent' }]}>
          <Icon size={moderateScale(24)} color={isSelected ? primaryColor : textSecondaryColor} />
        </View>
        <Text style={[styles.themeOptionLabel, { color: isSelected ? primaryColor : textColor }]}>{label}</Text>
        <View style={[styles.radioCircle, { borderColor: isSelected ? primaryColor : textSecondaryColor }]}>
          {isSelected && <View style={[styles.radioInner, { backgroundColor: primaryColor }]} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={moderateScale(24)} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Appearance</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + moderateScale(40) }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: textSecondaryColor }]}>THEME</Text>
        <View style={styles.themeOptionsRow}>
          <ThemeOption label="Light" icon={Sun} value="light" />
          <ThemeOption label="Dark" icon={Moon} value="dark" />
          <ThemeOption label="System" icon={Monitor} value="system" />
        </View>
        <Text style={[styles.footerText, { color: textSecondaryColor }]}>
          System theme automatically adjusts based on your device's display settings.
        </Text>

        {/* <Text style={[styles.sectionTitle, { color: textSecondaryColor, marginTop: moderateScale(32) }]}>ACCESSIBILITY</Text>
        
        <View style={[styles.settingsCard, { backgroundColor: cardColor, borderColor }]}>
         
          <TouchableOpacity style={[styles.settingRow, { borderBottomColor: borderColor }]} activeOpacity={0.7}>
            <View style={[styles.settingIconBox, { backgroundColor: 'rgba(124, 58, 237, 0.1)' }]}>
              <Type size={moderateScale(20)} color="#7C3AED" />
            </View>
            <View style={styles.settingTextCol}>
              <Text style={[styles.settingTitle, { color: textColor }]}>Text Size</Text>
              <Text style={[styles.settingSub, { color: textSecondaryColor }]}>Medium (Default)</Text>
            </View>
          </TouchableOpacity>

         
          <View style={[styles.settingRow, { borderBottomColor: borderColor }]}>
            <View style={[styles.settingIconBox, { backgroundColor: 'rgba(234, 88, 12, 0.1)' }]}>
              <Eye size={moderateScale(20)} color="#EA580C" />
            </View>
            <View style={styles.settingTextCol}>
              <Text style={[styles.settingTitle, { color: textColor }]}>High Contrast</Text>
              <Text style={[styles.settingSub, { color: textSecondaryColor }]}>Increase color distinction</Text>
            </View>
            <Switch 
              value={highContrast} 
              onValueChange={setHighContrast}
              trackColor={{ false: '#D1D5DB', true: primaryColor }}
              thumbColor="#FFFFFF"
            />
          </View>

         
          <View style={styles.settingRow}>
            <View style={[styles.settingIconBox, { backgroundColor: 'rgba(5, 150, 105, 0.1)' }]}>
              <Monitor size={moderateScale(20)} color="#059669" />
            </View>
            <View style={styles.settingTextCol}>
              <Text style={[styles.settingTitle, { color: textColor }]}>Reduce Motion</Text>
              <Text style={[styles.settingSub, { color: textSecondaryColor }]}>Limit UI animations</Text>
            </View>
            <Switch 
              value={reduceMotion} 
              onValueChange={setReduceMotion}
              trackColor={{ false: '#D1D5DB', true: primaryColor }}
              thumbColor="#FFFFFF"
            />
          </View> 
        </View>*/}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(16),
    borderBottomWidth: 1,
  },
  backButton: {
    width: moderateScale(40),
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
  },
  headerRight: {
    width: moderateScale(40),
  },
  scrollContent: {
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateScale(24),
  },
  sectionTitle: {
    fontSize: moderateScale(12),
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: moderateScale(16),
    marginLeft: moderateScale(4),
  },
  themeOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: moderateScale(12),
  },
  themeOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: moderateScale(20),
    paddingHorizontal: moderateScale(12),
    borderRadius: moderateScale(16),
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  themeIconBox: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: moderateScale(12),
  },
  themeOptionLabel: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    marginBottom: moderateScale(16),
  },
  radioCircle: {
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(10),
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: moderateScale(5),
  },
  footerText: {
    fontSize: moderateScale(13),
    lineHeight: moderateScale(20),
    marginTop: moderateScale(16),
    marginLeft: moderateScale(4),
  },
  settingsCard: {
    borderRadius: moderateScale(16),
    paddingHorizontal: moderateScale(20),
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(16),
    borderBottomWidth: 1,
  },
  settingIconBox: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(16),
  },
  settingTextCol: {
    flex: 1,
    paddingRight: moderateScale(10),
  },
  settingTitle: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    marginBottom: moderateScale(2),
  },
  settingSub: {
    fontSize: moderateScale(13),
  },
});
