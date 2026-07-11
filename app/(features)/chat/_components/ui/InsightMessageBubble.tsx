import React from 'react';
import { View, Text } from 'react-native';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { Activity } from 'lucide-react-native';

interface InsightMessageBubbleProps {
  msg: {
    id: string;
    title: string;
    desc: string;
  };
}

export function InsightMessageBubble({ msg }: InsightMessageBubbleProps) {
  return (
    <View style={styles.insightCard}>
      <View style={styles.insightIconBox}>
        <Activity size={moderateScale(24)} color="#065F46" />
      </View>
      <View style={styles.insightContent}>
        <Text style={styles.insightTitle}>{msg.title}</Text>
        <Text style={styles.insightDesc}>{msg.desc}</Text>
      </View>
    </View>
  );
}

const styles = ScaledSheet.create({
  insightCard: {
    backgroundColor: '#D1FAE5',
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(20),
  },
  insightIconBox: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: '#A7F3D0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(12),
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: moderateScale(11),
    fontWeight: '800',
    color: '#065F46',
    letterSpacing: 0.5,
    marginBottom: moderateScale(2),
  },
  insightDesc: {
    fontSize: moderateScale(14),
    color: '#065F46',
    fontWeight: '500',
  },
});
