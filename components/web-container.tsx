import { Platform, StyleSheet, View, type ViewProps } from 'react-native';

export function WebContainer({ style, children, ...rest }: ViewProps) {
  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }
  return (
    <View style={styles.outer}>
      <View style={[styles.inner, style]} {...rest}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    alignItems: 'center',
  },
  inner: {
    flex: 1,
    width: '100%',
    maxWidth: 520,
  },
});
