import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
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
import { CATEGORIES, getQuestionsForCategory } from '@/constants/questions';

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
    <Host style={{ flex: 1 }}>
      <Form>
        <Section
          header={
            <VStack alignment="leading" spacing={4} modifiers={[padding({ top: 24, bottom: 8 })]}>
              <Text modifiers={[font({ size: 32, weight: 'bold' })]}>
                Do You Remember?
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
                  <Text modifiers={[font({ size: 28 })]}>{category.emoji}</Text>
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
  );
}
