import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { useTheme } from '@/lib/theme';
import { DEMO_ORG_ID, DEMO_PIPELINE_ID, DEMO_USER_ID } from '@/lib/mock/demo-data';
import { useMockRepository } from '@/stores/mock-repository';

export default function NewDealScreen() {
  const theme = useTheme();
  const prospects = useMockRepository((s) => s.prospects);
  const stages = useMockRepository((s) => s.stages);
  const addDeal = useMockRepository((s) => s.addDeal);
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('10000');
  const [prospectId, setProspectId] = useState(prospects[0]?.id ?? '');

  return (
    <Screen>
      <Button title="Back" variant="ghost" size="sm" onPress={() => router.back()} />
      <Text style={[theme.typography.title, { color: theme.colors.text, marginVertical: 12 }]}>
        New deal
      </Text>
      <View style={{ gap: 12 }}>
        <TextField label="Title" value={title} onChangeText={setTitle} />
        <TextField
          label="Value (USD)"
          keyboardType="numeric"
          value={value}
          onChangeText={setValue}
        />
        <Text style={[theme.typography.label, { color: theme.colors.textSecondary }]}>Prospect</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {prospects.slice(0, 6).map((p) => (
            <Button
              key={p.id}
              title={p.full_name}
              size="sm"
              variant={prospectId === p.id ? 'primary' : 'secondary'}
              onPress={() => setProspectId(p.id)}
            />
          ))}
        </View>
        <Button
          title="Create deal"
          onPress={() => {
            if (!title.trim() || !prospectId) return;
            const prospect = prospects.find((p) => p.id === prospectId);
            const stage = stages.find((s) => s.position === 0) ?? stages[0];
            if (!stage) return;
            const deal = addDeal({
              organization_id: DEMO_ORG_ID,
              pipeline_id: DEMO_PIPELINE_ID,
              stage_id: stage.id,
              prospect_id: prospectId,
              company_id: prospect?.company_id ?? null,
              owner_id: DEMO_USER_ID,
              title: title.trim(),
              value_cents: Math.round(Number(value || 0) * 100),
              currency: 'USD',
              probability: stage.probability,
              expected_close_date: null,
              notes: null,
              created_by: DEMO_USER_ID,
            });
            router.replace(`/(app)/deals/${deal.id}`);
          }}
        />
      </View>
    </Screen>
  );
}
