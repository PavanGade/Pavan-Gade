import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/States';
import { useTheme } from '@/lib/theme';
import { useMockRepository } from '@/stores/mock-repository';

export default function CompaniesScreen() {
  const theme = useTheme();
  const companies = useMockRepository((s) => s.companies);
  const prospects = useMockRepository((s) => s.prospects);

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={[theme.typography.title, { color: theme.colors.text }]}>Companies</Text>
        <Button title="Back" size="sm" variant="ghost" onPress={() => router.back()} />
      </View>
      {companies.length === 0 ? (
        <EmptyState title="No companies" />
      ) : (
        companies.map((c) => {
          const employees = prospects.filter((p) => p.company_id === c.id).length;
          return (
            <Card
              key={c.id}
              style={{ marginTop: 10 }}
              onPress={() => router.push(`/(app)/companies/${c.id}`)}
            >
              <Text style={[theme.typography.bodyMedium, { color: theme.colors.text }]}>{c.name}</Text>
              <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
                {[c.industry, c.headquarters].filter(Boolean).join(' · ')}
              </Text>
              <Text style={[theme.typography.caption, { color: theme.colors.textMuted, marginTop: 4 }]}>
                {employees} prospects
              </Text>
            </Card>
          );
        })
      )}
    </Screen>
  );
}
