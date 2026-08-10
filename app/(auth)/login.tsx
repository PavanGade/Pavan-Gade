import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { useTheme } from '@/lib/theme';
import { useSessionStore } from '@/stores/session';

export default function LoginScreen() {
  const theme = useTheme();
  const signInMock = useSessionStore((s) => s.signInMock);
  const [email, setEmail] = useState('alex@acmegrowth.example');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const onSubmit = async () => {
    setError(undefined);
    if (!email.includes('@') || password.length < 6) {
      setError('Enter a valid email and password (min 6 characters).');
      return;
    }
    setLoading(true);
    try {
      // Supabase Auth wires here when env is configured; mock keeps local demos unblocked.
      signInMock({ email, fullName: 'Alex Rivera' });
      router.replace('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={{ paddingTop: 48, gap: 8, marginBottom: 28 }}>
        <Text style={[theme.typography.display, { color: theme.colors.text }]}>PRSPCT</Text>
        <Text style={[theme.typography.body, { color: theme.colors.textSecondary }]}>
          Discover, qualify, and close — fast.
        </Text>
      </View>

      <View style={{ gap: 14 }}>
        <TextField
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholder="you@company.com"
        />
        <TextField
          label="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          error={error}
        />
        <Button title="Sign in" loading={loading} onPress={onSubmit} />
        <Link href="/(auth)/forgot-password" style={{ marginTop: 4 }}>
          <Text style={[theme.typography.caption, { color: theme.colors.primary }]}>
            Forgot password?
          </Text>
        </Link>
      </View>

      <View style={{ marginTop: 28, gap: 8 }}>
        <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
          New here?
        </Text>
        <Button title="Create account" variant="secondary" onPress={() => router.push('/(auth)/signup')} />
      </View>
    </Screen>
  );
}
