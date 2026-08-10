import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { useTheme } from '@/lib/theme';

export default function ForgotPasswordScreen() {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <Screen>
      <View style={{ paddingTop: 36, gap: 8, marginBottom: 24 }}>
        <Text style={[theme.typography.title, { color: theme.colors.text }]}>Reset password</Text>
        <Text style={[theme.typography.body, { color: theme.colors.textSecondary }]}>
          We will email a secure reset link when Supabase Auth is connected.
        </Text>
      </View>
      {sent ? (
        <View style={{ gap: 16 }}>
          <Text style={[theme.typography.body, { color: theme.colors.success }]}>
            If an account exists for {email}, reset instructions were queued.
          </Text>
          <Button title="Back to sign in" onPress={() => router.replace('/(auth)/login')} />
        </View>
      ) : (
        <View style={{ gap: 14 }}>
          <TextField
            label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Button
            title="Send reset link"
            onPress={() => {
              if (email.includes('@')) setSent(true);
            }}
          />
          <Button title="Cancel" variant="ghost" onPress={() => router.back()} />
        </View>
      )}
    </Screen>
  );
}
