import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { useTheme } from '@/lib/theme';
import { useMockRepository } from '@/stores/mock-repository';

export default function NewProspectScreen() {
  const theme = useTheme();
  const addProspect = useMockRepository((s) => s.addProspect);
  const addCompany = useMockRepository((s) => s.addCompany);
  const companies = useMockRepository((s) => s.companies);
  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState<string | undefined>();

  const onSave = () => {
    if (!fullName.trim()) {
      setError('Name is required');
      return;
    }
    let companyId: string | null = null;
    let companyName: string | null = company.trim() || null;
    if (companyName) {
      const existing = companies.find((c) => c.name.toLowerCase() === companyName!.toLowerCase());
      if (existing) {
        companyId = existing.id;
        companyName = existing.name;
      } else {
        const created = addCompany({ name: companyName, industry: industry || null });
        companyId = created.id;
      }
    }
    const created = addProspect({
      full_name: fullName.trim(),
      job_title: title || null,
      email: email || null,
      phone: phone || null,
      industry: industry || null,
      location: location || null,
      company_id: companyId,
      company_name: companyName,
    });
    router.replace(`/(app)/prospects/${created.id}`);
  };

  return (
    <Screen>
      <Button title="Back" variant="ghost" size="sm" onPress={() => router.back()} />
      <Text style={[theme.typography.title, { color: theme.colors.text, marginVertical: 12 }]}>
        Add prospect
      </Text>
      <View style={{ gap: 12 }}>
        <TextField label="Full name" value={fullName} onChangeText={setFullName} error={error} />
        <TextField label="Job title" value={title} onChangeText={setTitle} />
        <TextField label="Company" value={company} onChangeText={setCompany} />
        <TextField label="Email" autoCapitalize="none" value={email} onChangeText={setEmail} />
        <TextField label="Phone" value={phone} onChangeText={setPhone} />
        <TextField label="Industry" value={industry} onChangeText={setIndustry} />
        <TextField label="Location" value={location} onChangeText={setLocation} />
        <Button title="Save prospect" onPress={onSave} />
      </View>
    </Screen>
  );
}
