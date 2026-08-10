import { router, useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card, SectionHeader } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/States';
import { ProspectCard } from '@/features/prospects/ProspectCard';
import { useTheme } from '@/lib/theme';
import { useMockRepository } from '@/stores/mock-repository';

export default function CompanyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const company = useMockRepository((s) => s.companies.find((c) => c.id === id));
  const employees = useMockRepository((s) => s.prospects.filter((p) => p.company_id === id));

  if (!company) {
    return (
      <Screen>
        <ErrorState title="Company not found" onRetry={() => router.back()} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Button title="Back" variant="ghost" size="sm" onPress={() => router.back()} />
      <Text style={[theme.typography.title, { color: theme.colors.text, marginTop: 8 }]}>
        {company.name}
      </Text>
      <Card style={{ marginTop: 12, gap: 6 }}>
        <Text style={{ color: theme.colors.textSecondary }}>Industry: {company.industry ?? '—'}</Text>
        <Text style={{ color: theme.colors.textSecondary }}>HQ: {company.headquarters ?? '—'}</Text>
        <Text style={{ color: theme.colors.textSecondary }}>
          Employees: {company.employee_count ?? '—'}
        </Text>
        <Text style={{ color: theme.colors.textSecondary }}>
          Revenue: {company.revenue_range ?? '—'}
        </Text>
        <Text style={{ color: theme.colors.textSecondary }}>Website: {company.website ?? '—'}</Text>
        <Text style={{ color: theme.colors.textSecondary }}>
          Technologies: {company.technologies.join(', ') || '—'}
        </Text>
        <Text style={{ color: theme.colors.text, marginTop: 6 }}>{company.description}</Text>
      </Card>
      <SectionHeader title="People" />
      {employees.map((p) => (
        <ProspectCard key={p.id} prospect={p} onPress={() => router.push(`/(app)/prospects/${p.id}`)} />
      ))}
    </Screen>
  );
}
