import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { TASK_PRIORITIES, TASK_TYPES, type TaskPriority, type TaskType } from '@/constants/domain';
import { useTheme } from '@/lib/theme';
import { DEMO_ORG_ID, DEMO_USER_ID } from '@/lib/mock/demo-data';
import { useMockRepository } from '@/stores/mock-repository';

export default function NewTaskScreen() {
  const theme = useTheme();
  const params = useLocalSearchParams<{ prospectId?: string }>();
  const addTask = useMockRepository((s) => s.addTask);
  const prospects = useMockRepository((s) => s.prospects);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [taskType, setTaskType] = useState<TaskType>('FOLLOW_UP');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [prospectId, setProspectId] = useState(params.prospectId ?? prospects[0]?.id ?? '');

  return (
    <Screen>
      <Button title="Back" variant="ghost" size="sm" onPress={() => router.back()} />
      <Text style={[theme.typography.title, { color: theme.colors.text, marginVertical: 12 }]}>
        Create task
      </Text>
      <View style={{ gap: 12 }}>
        <TextField label="Title" value={title} onChangeText={setTitle} />
        <TextField label="Notes" value={notes} onChangeText={setNotes} multiline />
        <Text style={[theme.typography.label, { color: theme.colors.textSecondary }]}>Type</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {TASK_TYPES.map((t) => (
            <Button
              key={t}
              title={t}
              size="sm"
              variant={taskType === t ? 'primary' : 'secondary'}
              onPress={() => setTaskType(t)}
            />
          ))}
        </View>
        <Text style={[theme.typography.label, { color: theme.colors.textSecondary }]}>Priority</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {TASK_PRIORITIES.map((p) => (
            <Button
              key={p}
              title={p}
              size="sm"
              variant={priority === p ? 'primary' : 'secondary'}
              onPress={() => setPriority(p)}
            />
          ))}
        </View>
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
          title="Save task"
          onPress={() => {
            if (!title.trim()) return;
            addTask({
              organization_id: DEMO_ORG_ID,
              prospect_id: prospectId || null,
              company_id: prospects.find((p) => p.id === prospectId)?.company_id ?? null,
              deal_id: null,
              assignee_id: DEMO_USER_ID,
              created_by: DEMO_USER_ID,
              task_type: taskType,
              title: title.trim(),
              notes: notes || null,
              due_at: new Date().toISOString(),
              priority,
              status: 'OPEN',
            });
            router.replace('/(app)/(tabs)/tasks');
          }}
        />
      </View>
    </Screen>
  );
}
