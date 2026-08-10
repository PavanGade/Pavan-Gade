import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card, SectionHeader } from '@/components/ui/Card';
import { ProspectCard } from '@/features/prospects/ProspectCard';
import { formatCurrency } from '@/lib/format';
import { useTheme } from '@/lib/theme';
import { getDashboardMetrics, useMockRepository } from '@/stores/mock-repository';
import { useSessionStore } from '@/stores/session';

function Metric({ label, value }: { label: string; value: string | number }) {
  const theme = useTheme();
  return (
    <View
      style={{
        width: '48%',
        backgroundColor: theme.colors.bgElevated,
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderRadius: theme.radius.md,
        padding: 12,
        marginBottom: 10,
      }}
    >
      <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>{label}</Text>
      <Text style={[theme.typography.heading, { color: theme.colors.text, marginTop: 4 }]}>
        {value}
      </Text>
    </View>
  );
}

export default function HomeScreen() {
  const theme = useTheme();
  const orgName = useSessionStore((s) => s.organizationName) ?? 'Workspace';
  const fullName = useSessionStore((s) => s.fullName) ?? 'there';
  const repo = useMockRepository();
  const metrics = getDashboardMetrics(repo);

  return (
    <Screen>
      <Text style={[theme.typography.label, { color: theme.colors.primary }]}>PRSPCT</Text>
      <Text style={[theme.typography.title, { color: theme.colors.text, marginTop: 4 }]}>
        {orgName}
      </Text>
      <Text style={[theme.typography.body, { color: theme.colors.textSecondary, marginBottom: 16 }]}>
        Good to see you, {fullName.split(' ')[0]}.
      </Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <Metric label="Total prospects" value={metrics.totalProspects} />
        <Metric label="New" value={metrics.newProspects} />
        <Metric label="Contacted" value={metrics.contacted} />
        <Metric label="Replies" value={metrics.replies} />
        <Metric label="Qualified" value={metrics.qualified} />
        <Metric label="Meetings" value={metrics.meetings} />
        <Metric label="Opportunities" value={metrics.opportunities} />
        <Metric label="Won deals" value={metrics.wonDeals} />
      </View>

      <SectionHeader title="Quick actions" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
        <Button title="Find prospects" size="sm" onPress={() => router.push('/(app)/(tabs)/prospects')} />
        <Button
          title="Add prospect"
          size="sm"
          variant="secondary"
          onPress={() => router.push('/(app)/prospects/new')}
        />
        <Button
          title="Import CSV"
          size="sm"
          variant="secondary"
          onPress={() => router.push('/(app)/import')}
        />
        <Button
          title="Create list"
          size="sm"
          variant="secondary"
          onPress={() => router.push('/(app)/lists')}
        />
        <Button
          title="Create task"
          size="sm"
          variant="secondary"
          onPress={() => router.push('/(app)/tasks/new')}
        />
      </View>

      <SectionHeader title="Due today" actionLabel="All tasks" onAction={() => router.push('/(app)/(tabs)/tasks')} />
      {metrics.tasksDueToday.length === 0 ? (
        <Card>
          <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
            No tasks due today.
          </Text>
        </Card>
      ) : (
        metrics.tasksDueToday.map((t) => (
          <Card key={t.id} style={{ marginBottom: 8 }}>
            <Text style={[theme.typography.bodyMedium, { color: theme.colors.text }]}>{t.title}</Text>
            <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
              {t.task_type} · {t.priority}
            </Text>
          </Card>
        ))
      )}

      <SectionHeader title="Overdue follow-ups" />
      {metrics.overdueTasks.length === 0 ? (
        <Card>
          <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>You are caught up.</Text>
        </Card>
      ) : (
        metrics.overdueTasks.map((t) => (
          <Card key={t.id} style={{ marginBottom: 8 }}>
            <Text style={[theme.typography.bodyMedium, { color: theme.colors.danger }]}>{t.title}</Text>
          </Card>
        ))
      )}

      <SectionHeader title="Pipeline snapshot" />
      <Card style={{ marginBottom: 12 }}>
        <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>Open pipeline value</Text>
        <Text style={[theme.typography.heading, { color: theme.colors.text }]}>
          {formatCurrency(metrics.pipelineValue)}
        </Text>
      </Card>

      <SectionHeader
        title="Recently added"
        actionLabel="Search"
        onAction={() => router.push('/(app)/search')}
      />
      {metrics.recentProspects.map((p) => (
        <ProspectCard
          key={p.id}
          prospect={p}
          onPress={() => router.push(`/(app)/prospects/${p.id}`)}
        />
      ))}
    </Screen>
  );
}
