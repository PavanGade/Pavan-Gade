import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { useTheme } from '@/lib/theme';

export default function OnboardingProfileScreen() {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [industry, setIndustry] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [goal, setGoal] = useState('');

  return (
    <Screen>
      <Text style={[theme.typography.label, { color: theme.colors.primary }]}>STEP 1 OF 2</Text>
      <Text style={[theme.typography.title, { color: theme.colors.text, marginTop: 8 }]}>
        Welcome to PRSPCT
      </Text>
      <Text style={[theme.typography.body, { color: theme.colors.textSecondary, marginBottom: 20 }]}>
        Tell us about you and your workspace.
      </Text>
      <View style={{ gap: 12 }}>
        <TextField label="Your name" value={name} onChangeText={setName} />
        <TextField label="Company" value={company} onChangeText={setCompany} />
        <TextField label="Role" value={role} onChangeText={setRole} placeholder="AE, SDR, Founder…" />
        <TextField label="Industry" value={industry} onChangeText={setIndustry} />
        <TextField label="Team size" value={teamSize} onChangeText={setTeamSize} placeholder="1–5, 6–20…" />
        <TextField
          label="Primary sales goal"
          value={goal}
          onChangeText={setGoal}
          placeholder="Book 20 meetings / month"
        />
        <Button
          title="Continue"
          onPress={() => {
            if (!name.trim() || !company.trim()) return;
            router.push({
              pathname: '/(onboarding)/icp',
              params: { name, company, role, industry, teamSize, goal },
            });
          }}
        />
      </View>
    </Screen>
  );
}
