import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/States';
import { TextField } from '@/components/ui/TextField';
import { ProspectCard } from '@/features/prospects/ProspectCard';
import { useTheme } from '@/lib/theme';
import { useMockRepository } from '@/stores/mock-repository';

export default function ProspectsScreen() {
  const theme = useTheme();
  const prospects = useMockRepository((s) => s.prospects);
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return prospects;
    return prospects.filter((p) =>
      [p.full_name, p.job_title, p.company_name, p.industry, p.location]
        .join(' ')
        .toLowerCase()
        .includes(needle),
    );
  }, [prospects, q]);

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={[theme.typography.title, { color: theme.colors.text }]}>Prospects</Text>
        <Button title="Add" size="sm" onPress={() => router.push('/(app)/prospects/new')} />
      </View>
      <View style={{ marginVertical: 12 }}>
        <TextField
          placeholder="Search name, title, company…"
          value={q}
          onChangeText={setQ}
        />
      </View>
      {filtered.length === 0 ? (
        <EmptyState title="No prospects" description="Add manually or import a CSV." />
      ) : (
        filtered.map((p) => (
          <ProspectCard
            key={p.id}
            prospect={p}
            onPress={() => router.push(`/(app)/prospects/${p.id}`)}
          />
        ))
      )}
    </Screen>
  );
}
