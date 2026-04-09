import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { Category } from '@/constants/questions';

interface CategoryCardProps {
  category: Category;
  questionCount: number;
  onPress: () => void;
}

export function CategoryCard({ category, questionCount, onPress }: CategoryCardProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      }}
      onPress={onPress}
    >
      <Animated.View
        style={[
          styles.card,
          animatedStyle,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderLeftColor: category.color,
          },
        ]}
      >
        <View style={styles.iconWrap}>
          <IconSymbol name={category.iconName as any} size={28} color={category.color} />
        </View>
        <View style={styles.content}>
          <ThemedText type="defaultSemiBold" style={styles.label}>
            {category.label}
          </ThemedText>
          <ThemedText style={[styles.count, { color: colors.icon }]}>
            {questionCount} questions
          </ThemedText>
        </View>
        <IconSymbol name="chevron.right" size={18} color={colors.icon} style={{ marginRight: 16 }} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderLeftWidth: 4,
    marginBottom: 12,
  },
  iconWrap: {
    paddingHorizontal: 14,
    paddingVertical: 18,
  },
  content: {
    flex: 1,
    paddingVertical: 16,
  },
  label: {
    fontSize: 17,
  },
  count: {
    fontSize: 13,
    marginTop: 2,
  },
});
