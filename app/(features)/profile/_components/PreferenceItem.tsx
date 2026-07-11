import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { ChevronRight } from 'lucide-react-native';

interface PreferenceItemProps {
    title: string;
    subtitle: string;
    icon: ReactNode;
    iconBgColor: string;
    onPress?: () => void;
    styles: any;
    textColor: string;
    textSecondaryColor: string;
    showDivider?: boolean;
    borderColor?: string;
}

export const PreferenceItem = ({
    title,
    subtitle,
    icon,
    iconBgColor,
    onPress,
    styles,
    textColor,
    textSecondaryColor,
    showDivider = true,
    borderColor
}: PreferenceItemProps) => {
    return (
        <>
            <TouchableOpacity
                style={styles.preferenceRow}
                onPress={onPress}
                disabled={!onPress}
            >
                <View style={[styles.prefIconBox]}>
                    {icon}
                </View>
                <View style={styles.prefTextCol}>
                    <Text style={[styles.prefTitle, { color: textColor }]}>{title}</Text>
                    <Text style={[styles.prefSub, { color: textSecondaryColor }]}>{subtitle}</Text>
                </View>
                <ChevronRight size={moderateScale(20)} color={textSecondaryColor} />
            </TouchableOpacity>
            {showDivider && borderColor && (
                <View style={[styles.divider, { backgroundColor: borderColor }]} />
            )}
        </>
    );
};
