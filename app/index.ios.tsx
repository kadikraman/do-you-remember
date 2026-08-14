import { CATEGORIES, getQuestionsForCategory } from '@/constants/questions';
import {
  Button,
  Form,
  Host,
  HStack,
  Image,
  Section,
  Spacer,
  Text,
  VStack,
} from '@expo/ui/swift-ui';
import {
  buttonStyle,
  font,
  foregroundStyle,
  headerProminence,
  padding,
} from '@expo/ui/swift-ui/modifiers';
import Constants from 'expo-constants';
import { ObserveInteractiveMarker } from 'expo-observe';
import { useRouter } from 'expo-router';
import * as Updates from 'expo-updates';

const version = Constants.expoConfig?.version ?? '-';
const buildNumber = Constants.expoConfig?.ios?.buildNumber ?? '-';
const updateId = Updates.updateId
  ? Updates.updateId
  : Updates.isEmbeddedLaunch
    ? 'embedded'
    : 'dev';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <>
      {/* Declarative variant of markInteractive(); fires once on mount. */}
      <ObserveInteractiveMarker params={{ surface: 'swift-ui' }} />
      <Host style={{ flex: 1 }}>
      <Form>
        <Section
          header={
            <VStack alignment="leading" spacing={4} modifiers={[padding({ top: 24, bottom: 8 })]}>
              <Text modifiers={[font({ size: 32, weight: 'bold' })]}>
              {process.env.EXPO_PUBLIC_HEADING}
              </Text>
              <Text modifiers={[foregroundStyle('secondaryLabel')]}>
                Pick a category and test your memory.
              </Text>
            </VStack>
          }
          modifiers={[headerProminence('increased')]}
        >
          {CATEGORIES.map((category) => {
            const count = getQuestionsForCategory(category.id).length;
            return (
              <Button
                key={category.id}
                onPress={() => router.push(`/category/${category.id}`)}
                modifiers={[buttonStyle('plain')]}
              >
                <HStack spacing={12}>
                  <Image systemName={category.iconName as any} size={28} color={category.color} />
                  <VStack alignment="leading" spacing={2}>
                    <Text>{category.label}</Text>
                    <Text
                      modifiers={[
                        foregroundStyle('secondaryLabel'),
                        font({ size: 13 }),
                      ]}
                    >
                      {count} questions
                    </Text>
                  </VStack>
                  <Spacer />
                  <Image systemName="chevron.right" size={14} color="secondary" />
                </HStack>
              </Button>
            );
          })}
        </Section>

        <Section>
          <Button onPress={() => router.push('/observe-lab')} modifiers={[buttonStyle('plain')]}>
            <HStack spacing={12}>
              <Image systemName="waveform.path.ecg" size={22} color="#F59E0B" />
              <Text>Observe Lab</Text>
              <Spacer />
              <Image systemName="chevron.right" size={14} color="secondary" />
            </HStack>
          </Button>
        </Section>

        <Section>
          <Text
            modifiers={[
              foregroundStyle('quaternaryLabel'),
              font({ size: 11, design: 'monospaced' }),
            ]}
          >
            v{version} ({buildNumber}) · {updateId}
          </Text>
        </Section>
      </Form>
      </Host>
    </>
  );
}
