import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/format';
import { useTheme } from '@/lib/theme';
import { useMockRepository } from '@/stores/mock-repository';

export default function PipelineScreen() {
  const theme = useTheme();
  const stages = useMockRepository((s) => s.stages);
  const deals = useMockRepository((s) => s.deals);
  const prospects = useMockRepository((s) => s.prospects);
  const moveDeal = useMockRepository((s) => s.moveDeal);

  return (
    <Screen scroll={false} padded={false}>
      <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={[theme.typography.title, { color: theme.colors.text }]}>Pipeline</Text>
        <Button title="New deal" size="sm" onPress={() => router.push('/(app)/deals/new')} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, gap: 10 }}>
        {stages.filter((s) => !s.is_lost).map((stage) => {
          const stageDeals = deals.filter((d) => d.stage_id === stage.id);
          return (
            <View
              key={stage.id}
              style={{
                width: 260,
                backgroundColor: theme.colors.bgMuted,
                borderRadius: theme.radius.lg,
                padding: 10,
                maxHeight: '100%',
              }}
            >
              <Text style={[theme.typography.bodyMedium, { color: theme.colors.text, marginBottom: 4 }]}>
                {stage.name}
              </Text>
              <Text style={[theme.typography.caption, { color: theme.colors.textMuted, marginBottom: 10 }]}>
                {stageDeals.length} · {stage.probability}%
              </Text>
              <ScrollView>
                {stageDeals.map((deal) => {
                  const prospect = prospects.find((p) => p.id === deal.prospect_id);
                  const next = stages.find((s) => s.position === stage.position + 1 && !s.is_lost);
                  return (
                    <Card
                      key={deal.id}
                      style={{ marginBottom: 8 }}
                      onPress={() => router.push(`/(app)/deals/${deal.id}`)}
                    >
                      <Text style={[theme.typography.bodyMedium, { color: theme.colors.text }]}>
                        {deal.title}
                      </Text>
                      <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
                        {prospect?.full_name ?? 'No prospect'} · {formatCurrency(deal.value_cents, deal.currency)}
                      </Text>
                      {next ? (
                        <Text
                          onPress={() => moveDeal(deal.id, next.id)}
                          style={[theme.typography.caption, { color: theme.colors.primary, marginTop: 8 }]}
                        >
                          Move to {next.name} →
                        </Text>
                      ) : null}
                    </Card>
                  );
                })}
              </ScrollView>
            </View>
          );
        })}
      </ScrollView>
    </Screen>
  );
}
