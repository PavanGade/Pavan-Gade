import { router } from 'expo-router';
import { Text, View } from 'react-native';
import {
  Building2,
  Download,
  ListFilter,
  LogOut,
  Search,
  Settings,
  Upload,
} from 'lucide-react-native';

import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/lib/theme';
import { useSessionStore } from '@/stores/session';

const links = [
  { title: 'Companies', href: '/(app)/companies', icon: Building2 },
  { title: 'Lists', href: '/(app)/lists', icon: ListFilter },
  { title: 'Global search', href: '/(app)/search', icon: Search },
  { title: 'Import CSV', href: '/(app)/import', icon: Upload },
  { title: 'Settings', href: '/(app)/settings', icon: Settings },
] as const;

export default function MoreScreen() {
  const theme = useTheme();
  const signOut = useSessionStore((s) => s.signOut);

  return (
    <Screen>
      <Text style={[theme.typography.title, { color: theme.colors.text, marginBottom: 16 }]}>More</Text>
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Card
            key={link.href}
            style={{ marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12 }}
            onPress={() => router.push(link.href)}
          >
            <Icon color={theme.colors.primary} size={20} />
            <Text style={[theme.typography.bodyMedium, { color: theme.colors.text }]}>{link.title}</Text>
          </Card>
        );
      })}
      <Card
        style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}
        onPress={() => {
          signOut();
          router.replace('/(auth)/login');
        }}
      >
        <LogOut color={theme.colors.danger} size={20} />
        <Text style={[theme.typography.bodyMedium, { color: theme.colors.danger }]}>Log out</Text>
      </Card>
      <View style={{ marginTop: 20, flexDirection: 'row', gap: 8, alignItems: 'center' }}>
        <Download color={theme.colors.textMuted} size={16} />
        <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
          Export & account deletion live under Settings → Privacy.
        </Text>
      </View>
    </Screen>
  );
}
