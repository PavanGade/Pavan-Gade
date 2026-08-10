import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TextField } from '@/components/ui/TextField';
import { useTheme } from '@/lib/theme';
import { useMockRepository } from '@/stores/mock-repository';

export default function ListsScreen() {
  const theme = useTheme();
  const lists = useMockRepository((s) => s.lists.filter((l) => !l.is_archived));
  const addList = useMockRepository((s) => s.addList);
  const [name, setName] = useState('');

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={[theme.typography.title, { color: theme.colors.text }]}>Lists</Text>
        <Button title="Back" size="sm" variant="ghost" onPress={() => router.back()} />
      </View>
      <View style={{ flexDirection: 'row', gap: 8, marginVertical: 14, alignItems: 'flex-end' }}>
        <View style={{ flex: 1 }}>
          <TextField label="New list" value={name} onChangeText={setName} placeholder="Hot Prospects" />
        </View>
        <Button
          title="Create"
          onPress={() => {
            if (!name.trim()) return;
            const list = addList(name.trim());
            setName('');
            router.push(`/(app)/lists/${list.id}`);
          }}
        />
      </View>
      {lists.map((list) => (
        <Card
          key={list.id}
          style={{ marginBottom: 10 }}
          onPress={() => router.push(`/(app)/lists/${list.id}`)}
        >
          <Text style={[theme.typography.bodyMedium, { color: theme.colors.text }]}>{list.name}</Text>
          <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
            {list.member_ids.length} prospects
          </Text>
        </Card>
      ))}
    </Screen>
  );
}
