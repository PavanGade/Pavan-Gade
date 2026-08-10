import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { useTheme } from '@/lib/theme';
import { useSessionStore } from '@/stores/session';

export default function SignupScreen() {
  const theme = useTheme();
  const signInMock = useSessionStore((s) => s.signInMock);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const onSubmit = async () => {
    setError(undefined);
    if (!fullName.trim() || !email.includes('@') || password.length < 8) {
      setError('Name, valid email, and password (min 8) are required.');
      return;
    }
    setLoading(true);
    try {
      signInMock({ email, fullName });
      // Force onboarding for new signups in mock mode
      useSessionStore.setState({
        onboardingComplete: false,
        organizationId: null,
        organizationName: null,
      });
      router.replace('/(onboarding)/profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={{ paddingTop: 36, gap: 8, marginBottom: 24 }}>
        <Text style={[theme.typography.title, { color: theme.colors.text }]}>Create account</Text>
        <Text style={[theme.typography.body, { color: theme.colors.textSecondary }]}>
          Structured for email now — Google, Apple, and phone OTP later.
        </Text>
      </View>
      <View style={{ gap: 14 }}>
        <TextField label="Full name" value={fullName} onChangeText={setFullName} />
        <TextField
          label="Work email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextField
          label="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          error={error}
        />
        <Button title="Continue" loading={loading} onPress={onSubmit} />
        <Button title="Back to sign in" variant="ghost" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}
