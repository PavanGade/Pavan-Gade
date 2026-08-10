import { Pressable, StyleSheet, Text, View, type ViewProps } from 'react-native';

import { useTheme } from '@/lib/theme';

type Props = ViewProps & {
  onPress?: () => void;
};

export function Card({ onPress, style, children, ...rest }: Props) {
  const theme = useTheme();
  const content = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.bgElevated,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.lg,
          ...theme.shadows.sm,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.92 : 1 })}>
        {content}
      </Pressable>
    );
  }
  return content;
}

export function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const theme = useTheme();
  return (
    <View style={styles.sectionHeader}>
      <Text style={[theme.typography.heading, { color: theme.colors.text }]}>{title}</Text>
      {actionLabel && onAction ? (
        <Text onPress={onAction} style={[theme.typography.caption, { color: theme.colors.primary }]}>
          {actionLabel}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    padding: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 8,
  },
});
