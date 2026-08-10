import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/States';
import { formatCurrency } from '@/lib/format';
import { useTheme } from '@/lib/theme';
import { useMockRepository } from '@/stores/mock-repository';

export default function DealDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const deal = useMockRepository((s) => s.deals.find((d) => d.id === id));
  const stages = useMockRepository((s) => s.stages);
  const prospect = useMockRepository((s) => s.prospects.find((p) => p.id === deal?.prospect_id));
  const moveDeal = useMockRepository((s) => s.moveDeal);

  if (!deal) {
    return (
      <Screen>
        <ErrorState title="Deal not found" onRetry={() => router.back()} />
      </Screen>
    );
  }

  const stage = stages.find((s) => s.id === deal.stage_id);

  return (
    <Screen>
      <Button title="Back" variant="ghost" size="sm" onPress={() => router.back()} />
      <Text style={[theme.typography.title, { color: theme.colors.text, marginTop: 8 }]}>{deal.title}</Text>
      <Card style={{ marginTop: 12, gap: 6 }}>
        <Text style={{ color: theme.colors.textSecondary }}>
          Value: {formatCurrency(deal.value_cents, deal.currency)}
        </Text>
        <Text style={{ color: theme.colors.textSecondary }}>Stage: {stage?.name}</Text>
        <Text style={{ color: theme.colors.textSecondary }}>
          Probability: {deal.probability ?? stage?.probability ?? 0}%
        </Text>
        <Text style={{ color: theme.colors.textSecondary }}>
          Prospect: {prospect?.full_name ?? '—'}
        </Text>
        {deal.notes ? <Text style={{ color: theme.colors.text }}>{deal.notes}</Text> : null}
      </Card>
      <Text style={[theme.typography.heading, { color: theme.colors.text, marginTop: 20, marginBottom: 8 }]}>
        Move stage
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {stages.map((s) => (
          <Button
            key={s.id}
            title={s.name}
            size="sm"
            variant={s.id === deal.stage_id ? 'primary' : 'secondary'}
            onPress={() => moveDeal(deal.id, s.id)}
          />
        ))}
      </View>
    </Screen>
  );
}
