import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/States';
import { useTheme } from '@/lib/theme';
import { useMockRepository } from '@/stores/mock-repository';

type Filter = 'today' | 'upcoming' | 'overdue' | 'completed';

export default function TasksScreen() {
  const theme = useTheme();
  const tasks = useMockRepository((s) => s.tasks);
  const completeTask = useMockRepository((s) => s.completeTask);
  const [filter, setFilter] = useState<Filter>('today');

  const filtered = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const startMs = start.getTime();
    const endMs = startMs + 86400000;
    return tasks.filter((t) => {
      if (filter === 'completed') return t.status === 'COMPLETED';
      if (t.status === 'COMPLETED') return false;
      if (!t.due_at) return filter === 'upcoming';
      const due = new Date(t.due_at).getTime();
      if (filter === 'today') return due >= startMs && due < endMs;
      if (filter === 'overdue') return due < startMs;
      return due >= endMs;
    });
  }, [tasks, filter]);

  const tabs: Filter[] = ['today', 'upcoming', 'overdue', 'completed'];

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={[theme.typography.title, { color: theme.colors.text }]}>Tasks</Text>
        <Button title="Add" size="sm" onPress={() => router.push('/(app)/tasks/new')} />
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 14 }}>
        {tabs.map((t) => (
          <Pressable
            key={t}
            onPress={() => setFilter(t)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: theme.radius.md,
              backgroundColor: filter === t ? theme.colors.primaryMuted : theme.colors.bgElevated,
              borderWidth: 1,
              borderColor: theme.colors.border,
            }}
          >
            <Text
              style={[
                theme.typography.caption,
                { color: filter === t ? theme.colors.primary : theme.colors.textSecondary, textTransform: 'capitalize' },
              ]}
            >
              {t}
            </Text>
          </Pressable>
        ))}
      </View>
      {filtered.length === 0 ? (
        <EmptyState title="Nothing here" description="Create a follow-up to stay on track." />
      ) : (
        filtered.map((task) => (
          <Card key={task.id} style={{ marginBottom: 8 }}>
            <Text style={[theme.typography.bodyMedium, { color: theme.colors.text }]}>{task.title}</Text>
            <Text style={[theme.typography.caption, { color: theme.colors.textMuted, marginTop: 4 }]}>
              {task.task_type} · {task.priority}
              {task.due_at ? ` · ${new Date(task.due_at).toLocaleString()}` : ''}
            </Text>
            {task.status !== 'COMPLETED' ? (
              <Text
                onPress={() => completeTask(task.id)}
                style={[theme.typography.caption, { color: theme.colors.primary, marginTop: 10 }]}
              >
                Mark complete
              </Text>
            ) : null}
          </Card>
        ))
      )}
    </Screen>
  );
}
