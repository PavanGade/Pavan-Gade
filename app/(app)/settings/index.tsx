import { router } from 'expo-router';
import { Alert, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card, SectionHeader } from '@/components/ui/Card';
import { useTheme } from '@/lib/theme';
import { useSessionStore, useThemeStore } from '@/stores/session';

export default function SettingsScreen() {
  const theme = useTheme();
  const preference = useThemeStore((s) => s.preference);
  const setPreference = useThemeStore((s) => s.setPreference);
  const email = useSessionStore((s) => s.email);
  const fullName = useSessionStore((s) => s.fullName);
  const orgName = useSessionStore((s) => s.organizationName);
  const role = useSessionStore((s) => s.role);
  const signOut = useSessionStore((s) => s.signOut);

  return (
    <Screen>
      <Button title="Back" variant="ghost" size="sm" onPress={() => router.back()} />
      <Text style={[theme.typography.title, { color: theme.colors.text, marginVertical: 12 }]}>
        Settings
      </Text>

      <SectionHeader title="Profile" />
      <Card style={{ gap: 4, marginBottom: 12 }}>
        <Text style={{ color: theme.colors.text }}>{fullName}</Text>
        <Text style={{ color: theme.colors.textSecondary }}>{email}</Text>
        <Text style={{ color: theme.colors.textMuted }}>
          {orgName} · {role}
        </Text>
      </Card>

      <SectionHeader title="Appearance" />
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
        {(['system', 'light', 'dark'] as const).map((mode) => (
          <Button
            key={mode}
            title={mode}
            size="sm"
            variant={preference === mode ? 'primary' : 'secondary'}
            onPress={() => setPreference(mode)}
          />
        ))}
      </View>

      <SectionHeader title="Privacy" />
      <Card style={{ gap: 12 }}>
        <Text style={[theme.typography.body, { color: theme.colors.textSecondary }]}>
          Export workspace data and account deletion run through secure Edge Functions when Supabase
          is connected. Demo mode shows the control surface only.
        </Text>
        <Button
          title="Export workspace data"
          variant="secondary"
          onPress={() =>
            Alert.alert('Export queued', 'Connect Supabase Edge Function `export-workspace` to generate a download.')
          }
        />
        <Button
          title="Delete account"
          variant="danger"
          onPress={() =>
            Alert.alert(
              'Delete account?',
              'Requires transfer of ownership if you are the last OWNER.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Continue',
                  style: 'destructive',
                  onPress: () => {
                    signOut();
                    router.replace('/(auth)/login');
                  },
                },
              ],
            )
          }
        />
      </Card>
    </Screen>
  );
}
