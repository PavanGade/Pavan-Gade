import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Avatar, Badge, ScoreBadge } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card, SectionHeader } from '@/components/ui/Card';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { TextField } from '@/components/ui/TextField';
import { bandForScore } from '@/features/scoring/score-prospect';
import { openEmail, openPhone, openWhatsApp } from '@/lib/comms';
import { useTheme } from '@/lib/theme';
import { DEMO_ORG_ID } from '@/lib/mock/demo-data';
import { useMockRepository } from '@/stores/mock-repository';

export default function ProspectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const prospect = useMockRepository((s) => s.prospects.find((p) => p.id === id));
  const notes = useMockRepository((s) => s.notes.filter((n) => n.prospect_id === id));
  const activities = useMockRepository((s) => s.activities.filter((a) => a.prospect_id === id));
  const tasks = useMockRepository((s) => s.tasks.filter((t) => t.prospect_id === id));
  const deals = useMockRepository((s) => s.deals.filter((d) => d.prospect_id === id));
  const stages = useMockRepository((s) => s.stages);
  const addNote = useMockRepository((s) => s.addNote);
  const updateProspect = useMockRepository((s) => s.updateProspect);
  const deleteProspect = useMockRepository((s) => s.deleteProspect);
  const [note, setNote] = useState('');

  if (!prospect) {
    return (
      <Screen>
        <ErrorState title="Prospect not found" onRetry={() => router.back()} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Button title="Back" variant="ghost" size="sm" onPress={() => router.back()} />
      <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center', marginTop: 8 }}>
        <Avatar name={prospect.full_name} size={56} />
        <View style={{ flex: 1 }}>
          <Text style={[theme.typography.title, { color: theme.colors.text }]}>{prospect.full_name}</Text>
          <Text style={[theme.typography.body, { color: theme.colors.textSecondary }]}>
            {[prospect.job_title, prospect.company_name].filter(Boolean).join(' · ')}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 14 }}>
        <ScoreBadge score={prospect.lead_score} band={bandForScore(prospect.lead_score)} />
        <Badge label={prospect.lead_status} tone="primary" />
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {prospect.phone ? (
          <Button title="Call" size="sm" onPress={() => openPhone(prospect.phone!)} />
        ) : null}
        {prospect.email ? (
          <Button
            title="Email"
            size="sm"
            variant="secondary"
            onPress={() => openEmail(prospect.email!, 'Quick note from PRSPCT')}
          />
        ) : null}
        {prospect.phone ? (
          <Button
            title="WhatsApp"
            size="sm"
            variant="secondary"
            onPress={() => openWhatsApp(prospect.phone!)}
          />
        ) : null}
        <Button title="Create task" size="sm" variant="secondary" onPress={() => router.push({ pathname: '/(app)/tasks/new', params: { prospectId: prospect.id } })} />
      </View>

      <SectionHeader title="Overview" />
      <Card style={{ gap: 6, marginBottom: 12 }}>
        <Text style={{ color: theme.colors.textSecondary }}>Location: {prospect.location ?? '—'}</Text>
        <Text style={{ color: theme.colors.textSecondary }}>Industry: {prospect.industry ?? '—'}</Text>
        <Text style={{ color: theme.colors.textSecondary }}>Source: {prospect.source ?? '—'}</Text>
        <Text style={{ color: theme.colors.textSecondary }}>
          Email: {prospect.email ?? 'Not available'}
        </Text>
        <Text style={{ color: theme.colors.textSecondary }}>
          Phone: {prospect.phone ?? 'Not available'}
        </Text>
      </Card>

      <SectionHeader title="Lead status" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
        {(['NEW', 'CONTACTED', 'ENGAGED', 'QUALIFIED', 'NURTURING', 'UNQUALIFIED'] as const).map(
          (status) => (
            <Button
              key={status}
              title={status}
              size="sm"
              variant={prospect.lead_status === status ? 'primary' : 'secondary'}
              onPress={() => updateProspect(prospect.id, { lead_status: status })}
            />
          ),
        )}
      </View>

      <SectionHeader title="Notes" />
      <TextField
        placeholder="Add a note…"
        value={note}
        onChangeText={setNote}
        multiline
        style={{ minHeight: 80, textAlignVertical: 'top' }}
      />
      <Button
        title="Save note"
        style={{ marginTop: 8, marginBottom: 12 }}
        onPress={() => {
          if (!note.trim()) return;
          addNote({
            organization_id: DEMO_ORG_ID,
            entity_type: 'PROSPECT',
            prospect_id: prospect.id,
            company_id: null,
            deal_id: null,
            body: note.trim(),
            author_id: null,
          });
          setNote('');
        }}
      />
      {notes.length === 0 ? (
        <EmptyState title="No notes yet" />
      ) : (
        notes.map((n) => (
          <Card key={n.id} style={{ marginBottom: 8 }}>
            <Text style={{ color: theme.colors.text }}>{n.body}</Text>
            <Text style={[theme.typography.caption, { color: theme.colors.textMuted, marginTop: 6 }]}>
              {new Date(n.created_at).toLocaleString()}
            </Text>
          </Card>
        ))
      )}

      <SectionHeader title="Tasks" />
      {tasks.map((t) => (
        <Card key={t.id} style={{ marginBottom: 8 }}>
          <Text style={{ color: theme.colors.text }}>{t.title}</Text>
          <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>{t.status}</Text>
        </Card>
      ))}

      <SectionHeader title="Deals" />
      {deals.map((d) => (
        <Card key={d.id} style={{ marginBottom: 8 }} onPress={() => router.push(`/(app)/deals/${d.id}`)}>
          <Text style={{ color: theme.colors.text }}>{d.title}</Text>
          <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
            {stages.find((s) => s.id === d.stage_id)?.name}
          </Text>
        </Card>
      ))}

      <SectionHeader title="Activity" />
      {activities.map((a) => (
        <Card key={a.id} style={{ marginBottom: 8 }}>
          <Text style={{ color: theme.colors.text }}>{a.title}</Text>
          <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
            {new Date(a.created_at).toLocaleString()}
          </Text>
        </Card>
      ))}

      <Button
        title="Delete prospect"
        variant="danger"
        style={{ marginTop: 20 }}
        onPress={() => {
          Alert.alert('Delete prospect?', 'This removes the prospect from the workspace.', [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => {
                deleteProspect(prospect.id);
                router.back();
              },
            },
          ]);
        }}
      />
    </Screen>
  );
}
