import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Text } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card, SectionHeader } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/States';
import { TextField } from '@/components/ui/TextField';
import { ProspectCard } from '@/features/prospects/ProspectCard';
import { formatCurrency } from '@/lib/format';
import { useTheme } from '@/lib/theme';
import { useMockRepository } from '@/stores/mock-repository';

export default function SearchScreen() {
  const theme = useTheme();
  const search = useMockRepository((s) => s.search);
  const [q, setQ] = useState('');
  const results = useMemo(() => search(q), [q, search]);

  const empty = !q.trim();
  const noHits =
    !empty &&
    results.prospects.length === 0 &&
    results.companies.length === 0 &&
    results.lists.length === 0 &&
    results.deals.length === 0;

  return (
    <Screen>
      <Button title="Back" variant="ghost" size="sm" onPress={() => router.back()} />
      <Text style={[theme.typography.title, { color: theme.colors.text, marginVertical: 12 }]}>
        Search
      </Text>
      <TextField
        placeholder="Prospects, companies, lists, deals…"
        value={q}
        onChangeText={setQ}
        autoFocus
      />
      {empty ? (
        <EmptyState title="Start typing" description="Instant search across your workspace." />
      ) : null}
      {noHits ? <EmptyState title="No matches" description="Try another keyword." /> : null}

      {results.prospects.length > 0 ? (
        <>
          <SectionHeader title="Prospects" />
          {results.prospects.map((p) => (
            <ProspectCard key={p.id} prospect={p} onPress={() => router.push(`/(app)/prospects/${p.id}`)} />
          ))}
        </>
      ) : null}
      {results.companies.length > 0 ? (
        <>
          <SectionHeader title="Companies" />
          {results.companies.map((c) => (
            <Card key={c.id} style={{ marginBottom: 8 }} onPress={() => router.push(`/(app)/companies/${c.id}`)}>
              <Text style={{ color: theme.colors.text }}>{c.name}</Text>
            </Card>
          ))}
        </>
      ) : null}
      {results.lists.length > 0 ? (
        <>
          <SectionHeader title="Lists" />
          {results.lists.map((l) => (
            <Card key={l.id} style={{ marginBottom: 8 }} onPress={() => router.push(`/(app)/lists/${l.id}`)}>
              <Text style={{ color: theme.colors.text }}>{l.name}</Text>
            </Card>
          ))}
        </>
      ) : null}
      {results.deals.length > 0 ? (
        <>
          <SectionHeader title="Deals" />
          {results.deals.map((d) => (
            <Card key={d.id} style={{ marginBottom: 8 }} onPress={() => router.push(`/(app)/deals/${d.id}`)}>
              <Text style={{ color: theme.colors.text }}>{d.title}</Text>
              <Text style={{ color: theme.colors.textMuted }}>{formatCurrency(d.value_cents)}</Text>
            </Card>
          ))}
        </>
      ) : null}
    </Screen>
  );
}
