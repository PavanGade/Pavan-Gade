import { ScrollView, StyleSheet, View, type ScrollViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/lib/theme';

type Props = ScrollViewProps & {
  scroll?: boolean;
  padded?: boolean;
};

export function Screen({ scroll = true, padded = true, style, children, ...rest }: Props) {
  const theme = useTheme();
  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[
        padded && styles.pad,
        { backgroundColor: theme.colors.bg, flexGrow: 1 },
        style,
      ]}
      keyboardShouldPersistTaps="handled"
      {...rest}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, padded && styles.pad, { backgroundColor: theme.colors.bg }, style]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: theme.colors.bg }]} edges={['top', 'left', 'right']}>
      {body}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  pad: { paddingHorizontal: 16, paddingBottom: 32, paddingTop: 8 },
});
