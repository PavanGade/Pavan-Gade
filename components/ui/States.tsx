import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/lib/theme';

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  const theme = useTheme();
  return (
    <View style={styles.center} accessibilityLabel={label}>
      <ActivityIndicator color={theme.colors.primary} size="large" />
      <Text style={[theme.typography.caption, { color: theme.colors.textMuted, marginTop: 12 }]}>
        {label}
      </Text>
    </View>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  const theme = useTheme();
  return (
    <View style={styles.center}>
      <Text style={[theme.typography.heading, { color: theme.colors.text, textAlign: 'center' }]}>
        {title}
      </Text>
      {description ? (
        <Text
          style={[
            theme.typography.body,
            { color: theme.colors.textSecondary, textAlign: 'center', marginTop: 8 },
          ]}
        >
          {description}
        </Text>
      ) : null}
    </View>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  description,
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  const theme = useTheme();
  return (
    <View style={styles.center}>
      <Text style={[theme.typography.heading, { color: theme.colors.danger, textAlign: 'center' }]}>
        {title}
      </Text>
      {description ? (
        <Text
          style={[
            theme.typography.body,
            { color: theme.colors.textSecondary, textAlign: 'center', marginTop: 8 },
          ]}
        >
          {description}
        </Text>
      ) : null}
      {onRetry ? (
        <Text
          onPress={onRetry}
          style={[theme.typography.bodyMedium, { color: theme.colors.primary, marginTop: 16 }]}
        >
          Try again
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    minHeight: 180,
  },
});
