import React, { Component, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button';
//import { Button } from './Button';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onReset?: () => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        if (this.props.onReset) {
            this.props.onReset();
        }
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <ThemedView style={styles.container}>
                    <Ionicons name="warning-outline" size={48} color="#ef4444" style={styles.icon} />
                    <ThemedText type="subtitle" style={styles.title}>
                        Something went wrong
                    </ThemedText>
                    <ThemedText style={styles.message}>
                        {this.state.error?.message || 'An unexpected error occurred while rendering this component.'}
                    </ThemedText>
                    <Button
                        title="Try Again"
                        onPress={this.handleReset}
                        style={styles.button}
                    />
                </ThemedView>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        minHeight: 200,
    },
    icon: {
        marginBottom: 16,
    },
    title: {
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        textAlign: 'center',
        opacity: 0.7,
        marginBottom: 24,
    },
    button: {
        minWidth: 150,
    },
});
