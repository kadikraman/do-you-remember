import { Pressable, StyleSheet, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type OptionState = 'idle' | 'correct' | 'incorrect';

interface OptionButtonProps {
  label: string;
  state: OptionState;
  onPress: () => void;
  disabled: boolean;
}

export function OptionButton({ label, state, onPress, disabled }: OptionButtonProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  const bgColor =
    state === 'correct'
      ? colors.correct + '22'
      : state === 'incorrect'
        ? colors.incorrect + '22'
        : colors.card;

  const borderColor =
    state === 'correct'
      ? colors.correct
      : state === 'incorrect'
        ? colors.incorrect
        : colors.border;

  const textColor =
    state === 'correct'
      ? colors.correct
      : state === 'incorrect'
        ? colors.incorrect
        : colors.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bgColor, borderColor },
        pressed && state === 'idle' && styles.pressed,
      ]}
    >
      <ThemedText type="mono" style={[styles.label, { color: textColor }]}>
        {label}
      </ThemedText>
      {state !== 'idle' && (
        <View style={styles.icon}>
          <IconSymbol
            name={state === 'correct' ? 'checkmark' : 'xmark'}
            size={16}
            color={textColor}
          />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    flex: 1,
  },
  icon: {
    marginLeft: 8,
  },
});
