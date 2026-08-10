import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { useTheme } from '@/lib/theme';

type Props = TextInputProps & {
  label?: string;
  error?: string;
};

export function TextField({ label, error, style, ...rest }: Props) {
  const theme = useTheme();
  return (
    <View style={styles.wrap}>
      {label ? (
        <Text style={[theme.typography.label, { color: theme.colors.textSecondary, marginBottom: 6 }]}>
          {label}
        </Text>
      ) : null}
      <TextInput
        placeholderTextColor={theme.colors.textMuted}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.bgElevated,
            borderColor: error ? theme.colors.danger : theme.colors.border,
            color: theme.colors.text,
            borderRadius: theme.radius.md,
          },
          style,
        ]}
        {...rest}
      />
      {error ? (
        <Text style={[theme.typography.caption, { color: theme.colors.danger, marginTop: 4 }]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  input: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
});
