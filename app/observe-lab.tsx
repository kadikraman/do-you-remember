import { Observe, ObserveErrorBoundary, useObserve } from 'expo-observe';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { setBaseGlobalAttributes } from '@/lib/observe';

const SEVERITIES = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'] as const;
type Severity = (typeof SEVERITIES)[number];

class QuizDataCorruptedError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'QuizDataCorruptedError';
  }
}

// Three frames deep, so the recorded stack has some shape to inspect.
function loadQuizData(): never {
  throw new QuizDataCorruptedError('Quiz data checksum mismatch', {
    cause: new Error('underlying storage read failed'),
  });
}
function parseQuizData(): never {
  loadQuizData();
}
function deepThrow(): never {
  parseQuizData();
}

// Throws during render while `armed` is true.
function Bomb({ armed, label }: { armed: boolean; label: string }) {
  if (armed) {
    throw new Error(`Render error: ${label}`);
  }
  return null;
}

export default function ObserveLabScreen() {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const { markInteractive } = useObserve();

  const [boundaryArmed, setBoundaryArmed] = useState(false);
  const [unguardedArmed, setUnguardedArmed] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const [eventName, setEventName] = useState('lab.custom');
  const [eventBody, setEventBody] = useState('');
  const [severity, setSeverity] = useState<Severity>('info');

  useEffect(() => {
    markInteractive();
  }, [markInteractive]);

  const note = (message: string) => {
    const time = new Date().toISOString().slice(11, 19);
    setLog((prev) => [`${time}  ${message}`, ...prev].slice(0, 10));
  };

  const actions: { title: string; hint: string; onPress: () => void }[] = [
    {
      title: 'Uncaught exception',
      hint: 'throw inside setTimeout; hits the global handler',
      onPress: () => {
        note('throwing in setTimeout');
        setTimeout(() => {
          throw new Error('Uncaught exception from Observe Lab (setTimeout)');
        }, 50);
      },
    },
    {
      title: 'Unhandled promise rejection',
      hint: 'rejected promise with no catch handler',
      onPress: () => {
        note('rejecting promise without a catch');
        void Promise.reject(new Error('Unhandled rejection from Observe Lab'));
      },
    },
    {
      title: 'reportError(Error)',
      hint: 'caught error, reported as non-fatal',
      onPress: () => {
        try {
          throw new Error('Handled error from Observe Lab');
        } catch (e) {
          Observe.reportError(e);
          note('reportError(Error) sent');
        }
      },
    },
    {
      title: 'reportError(custom error, deep stack)',
      hint: 'custom class, cause chain, 3 stack frames',
      onPress: () => {
        try {
          deepThrow();
        } catch (e) {
          Observe.reportError(e);
          note('reportError(QuizDataCorruptedError) sent');
        }
      },
    },
    {
      title: 'reportError(string)',
      hint: 'non-Error value, tests normalization',
      onPress: () => {
        Observe.reportError('a plain string reported as an error');
        note('reportError(string) sent');
      },
    },
    {
      title: 'reportError(object)',
      hint: 'non-Error value, tests normalization',
      onPress: () => {
        Observe.reportError({ code: 'E_LAB', detail: 'plain object error' });
        note('reportError(object) sent');
      },
    },
    {
      title: "logEvent severity 'error'",
      hint: 'error-level event, not an exception',
      onPress: () => {
        Observe.logEvent('lab.error_event', {
          severity: 'error',
          body: 'An error-severity user-defined event.',
          attributes: { source: 'observe-lab' },
        });
        note("logEvent severity 'error' sent");
      },
    },
    {
      title: "logEvent severity 'fatal'",
      hint: 'fatal-level event, not an exception',
      onPress: () => {
        Observe.logEvent('lab.fatal_event', {
          severity: 'fatal',
          body: 'A fatal-severity user-defined event.',
          attributes: { source: 'observe-lab' },
        });
        note("logEvent severity 'fatal' sent");
      },
    },
  ];

  const utilities: { title: string; hint: string; onPress: () => void }[] = [
    {
      title: 'Flush events now',
      hint: 'Observe.dispatchEvents()',
      onPress: () => {
        note('dispatching…');
        Observe.dispatchEvents()
          .then(() => note('dispatchEvents resolved'))
          .catch((e) => note(`dispatchEvents failed: ${String(e)}`));
      },
    },
    {
      title: 'Add global attribute',
      hint: "merges { labSession: '<timestamp>' } into all metrics",
      onPress: () => {
        const labSession = new Date().toISOString();
        Observe.setGlobalAttributes({ labSession });
        note(`global attribute labSession=${labSession}`);
      },
    },
    {
      title: 'Clear global attributes',
      hint: 'clears all, then re-applies the base set',
      onPress: () => {
        Observe.setGlobalAttributes(null);
        setBaseGlobalAttributes();
        note('global attributes reset to base');
      },
    },
    {
      title: 'Rapid fire 20 events',
      hint: 'lab.rapid_fire with an index attribute',
      onPress: () => {
        for (let i = 0; i < 20; i++) {
          Observe.logEvent('lab.rapid_fire', { attributes: { index: i } });
        }
        note('20 lab.rapid_fire events logged');
      },
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText style={[styles.intro, { color: colors.icon }]}>
            Every button exercises one expo-observe API. Recent actions show at
            the bottom.
          </ThemedText>

          {/* Render errors */}
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Render errors
          </ThemedText>

          <ObserveErrorBoundary
            fallback={({ error, resetError }) => (
              <View style={[styles.fallback, { borderColor: colors.incorrect }]}>
                <ThemedText style={{ color: colors.incorrect }}>
                  ObserveErrorBoundary caught:{' '}
                  {error instanceof Error ? error.message : String(error)}
                </ThemedText>
                <LabButton
                  title="Reset boundary"
                  hint="resetError() re-renders the subtree"
                  color={colors.incorrect}
                  onPress={() => {
                    setBoundaryArmed(false);
                    resetError();
                    note('error boundary reset');
                  }}
                />
              </View>
            )}
          >
            <Bomb armed={boundaryArmed} label="inside ObserveErrorBoundary" />
            <LabButton
              title="Throw render error (in boundary)"
              hint="recorded as a non-fatal exception with component stack"
              color={colors.tint}
              onPress={() => {
                note('arming bomb inside boundary');
                setBoundaryArmed(true);
              }}
            />
          </ObserveErrorBoundary>

          <Bomb armed={unguardedArmed} label="no boundary on this screen" />
          <LabButton
            title="Throw render error (no boundary)"
            hint="bubbles to the router / root handler"
            color={colors.tint}
            onPress={() => {
              note('arming bomb outside boundary');
              setUnguardedArmed(true);
            }}
          />

          {/* Thrown and reported errors */}
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Exceptions and reports
          </ThemedText>
          {actions.map((a) => (
            <LabButton key={a.title} color={colors.tint} {...a} />
          ))}

          {/* Custom event form */}
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Custom event
          </ThemedText>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            value={eventName}
            onChangeText={setEventName}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="event.name"
            placeholderTextColor={colors.icon}
          />
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            value={eventBody}
            onChangeText={setEventBody}
            placeholder="Optional body text"
            placeholderTextColor={colors.icon}
          />
          <View style={styles.severityRow}>
            {SEVERITIES.map((s) => (
              <Pressable
                key={s}
                onPress={() => setSeverity(s)}
                style={[
                  styles.severityChip,
                  { borderColor: colors.border },
                  severity === s && { backgroundColor: colors.tint, borderColor: colors.tint },
                ]}
              >
                <ThemedText
                  style={[styles.severityText, severity === s && styles.severityTextActive]}
                >
                  {s}
                </ThemedText>
              </Pressable>
            ))}
          </View>
          <LabButton
            title="Log custom event"
            hint="attributes: string, number, boolean, array, nested object"
            color={colors.tint}
            onPress={() => {
              Observe.logEvent(eventName, {
                severity,
                body: eventBody.length > 0 ? eventBody : undefined,
                attributes: {
                  source: 'observe-lab',
                  count: log.length,
                  fromForm: true,
                  tags: ['manual', severity],
                  nested: { screen: 'observe-lab', platform: 'react-native' },
                },
              });
              note(`logEvent ${eventName} (${severity}) sent`);
            }}
          />

          {/* Utilities */}
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Utilities
          </ThemedText>
          {utilities.map((a) => (
            <LabButton key={a.title} color={colors.tint} {...a} />
          ))}

          {/* Action log */}
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Recent actions
          </ThemedText>
          {log.length === 0 ? (
            <ThemedText style={{ color: colors.icon }}>Nothing yet.</ThemedText>
          ) : (
            log.map((line, i) => (
              <ThemedText key={i} type="mono" style={[styles.logLine, { color: colors.icon }]}>
                {line}
              </ThemedText>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function LabButton({
  title,
  hint,
  color,
  onPress,
}: {
  title: string;
  hint: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, { borderColor: color }, pressed && { opacity: 0.7 }]}
    >
      <ThemedText style={styles.buttonTitle}>{title}</ThemedText>
      <ThemedText style={styles.buttonHint}>{hint}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  intro: {
    fontSize: 14,
    marginBottom: 8,
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 10,
  },
  button: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  buttonTitle: {
    fontWeight: '600',
    fontSize: 15,
  },
  buttonHint: {
    fontSize: 12,
    opacity: 0.6,
  },
  fallback: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    gap: 8,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    fontSize: 15,
  },
  severityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  severityChip: {
    borderWidth: 1.5,
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  severityText: {
    fontSize: 13,
  },
  severityTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  logLine: {
    fontSize: 12,
    marginBottom: 2,
  },
});
