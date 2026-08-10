import { StyleSheet, Text, View } from 'react-native';

import { Avatar, Badge, ScoreBadge } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { bandForScore } from '@/features/scoring/score-prospect';
import { useTheme } from '@/lib/theme';
import type { DemoProspect } from '@/lib/mock/demo-data';

type Props = {
  prospect: DemoProspect;
  onPress?: () => void;
};

export function ProspectCard({ prospect, onPress }: Props) {
  const theme = useTheme();
  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.row}>
        <Avatar name={prospect.full_name} />
        <View style={styles.meta}>
          <Text style={[theme.typography.bodyMedium, { color: theme.colors.text }]}>
            {prospect.full_name}
          </Text>
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
            {[prospect.job_title, prospect.company_name].filter(Boolean).join(' · ')}
          </Text>
          <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
            {[prospect.location, prospect.industry].filter(Boolean).join(' · ')}
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <ScoreBadge score={prospect.lead_score} band={bandForScore(prospect.lead_score)} />
        <Badge label={prospect.lead_status.replace('_', ' ')} tone="primary" />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 10, gap: 12 },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  meta: { flex: 1, gap: 2 },
  footer: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
});
