import React, { ReactNode } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { Ionicons } from '@expo/vector-icons';
//import { Button } from './Button';
import { ErrorBoundary } from './ErrorBoundary';
import Button from './Button';

interface DataViewStateProps<T> {
  // Data States
  isLoading?: boolean;
  isError?: boolean;
  data: T | undefined | null;
  error?: Error | null;

  // Customization
  loadingMessage?: ReactNode;          // Accepts string or custom component
  loadingComponent?: ReactNode;        // Accepts a custom skeleton component
  emptyMessage?: ReactNode;            // Accepts string or custom component
  emptyIcon?: keyof typeof Ionicons.glyphMap;

  // Actions
  onRetry?: () => void;

  // Checks
  isEmpty?: (data: T) => boolean;

  // Render prop
  render: (data: T) => React.ReactNode;
}

export function DataViewState<T>({
  isLoading,
  isError,
  data,
  error,
  loadingMessage = 'Loading...',
  loadingComponent,
  emptyMessage = 'No data found.',
  emptyIcon = 'folder-open-outline',
  onRetry,
  isEmpty,
  render
}: DataViewStateProps<T>) {

  // 1. Loading State
  if (isLoading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }

    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0a7ea4" style={styles.spinner} />
        {typeof loadingMessage === 'string' ? (
          <ThemedText style={styles.text}>{loadingMessage}</ThemedText>
        ) : (
          loadingMessage
        )}
      </ThemedView>
    );
  }

  // 2. Error State from Query
  if (isError) {
    return (
      <ThemedView style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" style={styles.icon} />
        <ThemedText type="subtitle" style={styles.title}>Oops! Something went wrong.</ThemedText>
        <ThemedText style={styles.text}>
          {error?.message || 'We encountered an error while fetching your data.'}
        </ThemedText>
        {onRetry && (
          <Button title="Try Again" onPress={onRetry} style={styles.button} />
        )}
      </ThemedView>
    );
  }

  // 3. Empty State
  const checkIsEmpty = isEmpty
    ? isEmpty(data as T)
    : (
      data === null ||
      data === undefined ||
      (Array.isArray(data) && data.length === 0) ||
      (typeof data === 'object' && Object.keys(data as object).length === 0)
    );

  if (checkIsEmpty) {
    return (
      <ThemedView style={styles.centerContainer}>
        <Ionicons name={emptyIcon} size={48} color="#9ca3af" style={styles.icon} />
        {typeof emptyMessage === 'string' ? (
          <ThemedText style={styles.text}>{emptyMessage}</ThemedText>
        ) : (
          emptyMessage
        )}
        {onRetry && (
          <Button title="Refresh" onPress={onRetry} style={styles.button} />
        )}
      </ThemedView>
    );
  }

  // 4. Success State wrapped in ErrorBoundary
  // We guarantee data is T here, not undefined/null, but we pass it as T to the render prop
  return (
    <ErrorBoundary onReset={onRetry}>
      {render(data as T)}
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    minHeight: 200,
  },
  spinner: {
    marginBottom: 16,
  },
  icon: {
    marginBottom: 16,
    opacity: 0.8,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
  },
  button: {
    minWidth: 150,
  },
});
