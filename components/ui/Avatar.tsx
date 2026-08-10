import { Text, View } from 'react-native';

import { useTheme } from '@/lib/theme';
import { initials } from '@/lib/format';
import type { ScoreBand } from '@/features/scoring/score-prospect';

export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const theme = useTheme();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: theme.colors.primaryMuted,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          color: theme.colors.primary,
          fontWeight: '700',
          fontSize: size * 0.34,
        }}
      >
        {initials(name)}
      </Text>
    </View>
  );
}

export function Badge({
  label,
  tone = 'neutral',
}: {
  label: string;
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'primary';
}) {
  const theme = useTheme();
  const map = {
    neutral: { bg: theme.colors.bgMuted, fg: theme.colors.textSecondary },
    success: { bg: theme.colors.successMuted, fg: theme.colors.success },
    warning: { bg: theme.colors.warningMuted, fg: theme.colors.warning },
    danger: { bg: theme.colors.dangerMuted, fg: theme.colors.danger },
    primary: { bg: theme.colors.primaryMuted, fg: theme.colors.primary },
  } as const;
  const c = map[tone];
  return (
    <View
      style={{
        backgroundColor: c.bg,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: theme.radius.sm,
        alignSelf: 'flex-start',
      }}
    >
      <Text style={[theme.typography.label, { color: c.fg, textTransform: 'uppercase' }]}>
        {label}
      </Text>
    </View>
  );
}

export function ScoreBadge({ score, band }: { score: number; band: ScoreBand }) {
  const tone = band === 'HOT' ? 'danger' : band === 'WARM' ? 'warning' : 'neutral';
  return <Badge label={`${band} · ${score}`} tone={tone} />;
}
