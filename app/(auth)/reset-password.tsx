import { Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { useTheme } from '@/lib/theme';

/** Deep-link target for Supabase password recovery / email verification. */
export default function ResetPasswordScreen() {
  const theme = useTheme();
  return (
    <Screen>
      <View style={{ paddingTop: 48, gap: 8 }}>
        <Text style={[theme.typography.title, { color: theme.colors.text }]}>Set new password</Text>
        <Text style={[theme.typography.body, { color: theme.colors.textSecondary }]}>
          This screen accepts recovery tokens from auth email links once Supabase is configured.
        </Text>
      </View>
    </Screen>
  );
}
