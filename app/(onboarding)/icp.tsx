import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { useTheme } from '@/lib/theme';
import { useSessionStore } from '@/stores/session';

export default function OnboardingIcpScreen() {
  const theme = useTheme();
  const params = useLocalSearchParams<{ name: string; company: string }>();
  const completeOnboarding = useSessionStore((s) => s.completeOnboarding);
  const [industries, setIndustries] = useState('SaaS, D2C');
  const [geo, setGeo] = useState('Hyderabad, Bengaluru, India');
  const [size, setSize] = useState('50–200');
  const [revenue, setRevenue] = useState('$5M–$50M');
  const [titles, setTitles] = useState('Founder, CEO, CMO, Head of Growth');
  const [seniority, setSeniority] = useState('C-Level, VP, Director');
  const [keywords, setKeywords] = useState('B2B, outbound, pipeline');

  return (
    <Screen>
      <Text style={[theme.typography.label, { color: theme.colors.primary }]}>STEP 2 OF 2</Text>
      <Text style={[theme.typography.title, { color: theme.colors.text, marginTop: 8 }]}>
        Ideal Customer Profile
      </Text>
      <Text style={[theme.typography.body, { color: theme.colors.textSecondary, marginBottom: 20 }]}>
        Stored for recommendations later — not sent to any AI yet.
      </Text>
      <View style={{ gap: 12 }}>
        <TextField label="Target industries" value={industries} onChangeText={setIndustries} />
        <TextField label="Target geography" value={geo} onChangeText={setGeo} />
        <TextField label="Company size" value={size} onChangeText={setSize} />
        <TextField label="Revenue range" value={revenue} onChangeText={setRevenue} />
        <TextField label="Job titles" value={titles} onChangeText={setTitles} />
        <TextField label="Seniority" value={seniority} onChangeText={setSeniority} />
        <TextField label="Keywords" value={keywords} onChangeText={setKeywords} />
        <Button
          title="Finish setup"
          onPress={() => {
            completeOnboarding({
              fullName: params.name || 'User',
              organizationName: params.company || 'Workspace',
            });
            // ICP fields persist to Supabase in connected mode; mock keeps them local to scoring defaults.
            router.replace('/(app)/(tabs)');
          }}
        />
      </View>
    </Screen>
  );
}
