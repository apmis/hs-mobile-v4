import React from 'react';
import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { LogOut } from 'lucide-react-native';
import { useLogout } from '@/app/shared/api/auth';

interface LogoutButtonProps {
    onPress?: () => void;
    styles: any;
    text?: string;
}

export const LogoutButton = ({
    onPress,
    styles,
    text = "Logout from System"
}: LogoutButtonProps) => {
    const { mutate: logout, isPending } = useLogout();

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            logout();
        }
    };

    return (
        <TouchableOpacity
            style={[styles.logoutButton, isPending && { opacity: 0.7 }]}
            onPress={handlePress}
            disabled={isPending}
        >
            {isPending ? (
                <ActivityIndicator size="small" color="#DC2626" />
            ) : (
                <LogOut size={moderateScale(20)} color="#DC2626" />
            )}
            <Text style={styles.logoutText}>
                {isPending ? 'Logging out...' : text}
            </Text>
        </TouchableOpacity>
    );
};
