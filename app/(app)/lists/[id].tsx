import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { ProspectCard } from '@/features/prospects/ProspectCard';
import { useTheme } from '@/lib/theme';
import { useMockRepository } from '@/stores/mock-repository';

export default function ListDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const list = useMockRepository((s) => s.lists.find((l) => l.id === id));
  const prospects = useMockRepository((s) => s.prospects);
  const archiveList = useMockRepository((s) => s.archiveList);
  const removeFromList = useMockRepository((s) => s.removeFromList);
  const addToList = useMockRepository((s) => s.addToList);

  if (!list) {
    return (
      <Screen>
        <ErrorState title="List not found" onRetry={() => router.back()} />
      </Screen>
    );
  }

  const members = prospects.filter((p) => list.member_ids.includes(p.id));
  const candidates = prospects.filter((p) => !list.member_ids.includes(p.id)).slice(0, 5);

  return (
    <Screen>
      <Button title="Back" variant="ghost" size="sm" onPress={() => router.back()} />
      <Text style={[theme.typography.title, { color: theme.colors.text, marginTop: 8 }]}>{list.name}</Text>
      <Text style={[theme.typography.body, { color: theme.colors.textSecondary, marginBottom: 12 }]}>
        {list.description ?? `${members.length} members`}
      </Text>
      <Button
        title="Archive list"
        variant="secondary"
        size="sm"
        onPress={() => {
          archiveList(list.id);
          router.back();
        }}
      />
      {members.length === 0 ? (
        <EmptyState title="No prospects in this list" />
      ) : (
        members.map((p) => (
          <View key={p.id} style={{ marginTop: 10 }}>
            <ProspectCard prospect={p} onPress={() => router.push(`/(app)/prospects/${p.id}`)} />
            <Text
              onPress={() => removeFromList(list.id, p.id)}
              style={[theme.typography.caption, { color: theme.colors.danger, marginTop: 4 }]}
            >
              Remove
            </Text>
          </View>
        ))
      )}
      <Text style={[theme.typography.heading, { color: theme.colors.text, marginTop: 20, marginBottom: 8 }]}>
        Add prospects
      </Text>
      {candidates.map((p) => (
        <View key={p.id} style={{ marginBottom: 8 }}>
          <ProspectCard prospect={p} />
          <Button title="Add to list" size="sm" variant="secondary" onPress={() => addToList(list.id, p.id)} />
        </View>
      ))}
    </Screen>
  );
}
