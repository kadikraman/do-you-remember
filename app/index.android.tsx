import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import {
  Button,
  Card,
  Column,
  Host,
  LazyColumn,
  Row,
  Text,
} from '@expo/ui/jetpack-compose';
import {
  fillMaxWidth,
  paddingAll,
  padding,
} from '@expo/ui/jetpack-compose/modifiers';
import { CATEGORIES, getQuestionsForCategory, type CategoryId } from '@/constants/questions';

const CATEGORY_ICONS: Record<CategoryId, string> = {
  'git': '\u{1F33F}',
  'http': '\u{1F310}',
  'js-quirks': '\u2728',
  'css': '\u{1F3A8}',
  'typescript': '\u{1F537}',
  'terminal': '\u{1F5A5}\uFE0F',
};

const version = Constants.expoConfig?.version ?? '-';
const buildNumber =
  Constants.expoConfig?.android?.versionCode?.toString() ?? '-';
const updateId = Updates.updateId
  ? Updates.updateId
  : Updates.isEmbeddedLaunch
    ? 'embedded'
    : 'dev';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <Host style={{ flex: 1 }}>
      <LazyColumn
        verticalArrangement={{ spacedBy: 12 }}
        contentPadding={{ start: 20, end: 20, top: 48, bottom: 40 }}
      >
        <Text
          style={{ typography: 'headlineLarge', fontWeight: 'bold' }}
        >
          Do You Remember?
        </Text>
        <Text
          color="#78716C"
          style={{ typography: 'bodyLarge' }}
          modifiers={[padding(0, 0, 0, 20)]}
        >
          Pick a category and test your memory.
        </Text>

        {CATEGORIES.map((category) => {
          const count = getQuestionsForCategory(category.id).length;
          return (
            <Card
              key={category.id}
              variant="outlined"
              modifiers={[fillMaxWidth()]}
            >
              <Button
                variant="borderless"
                onPress={() => router.push(`/category/${category.id}`)}
                modifiers={[fillMaxWidth()]}
              >
                <Row
                  horizontalArrangement="start"
                  verticalAlignment="center"
                  modifiers={[fillMaxWidth(), paddingAll(4)]}
                >
                  <Text style={{ fontSize: 28 }} modifiers={[padding(0, 0, 12, 0)]}>
                    {CATEGORY_ICONS[category.id]}
                  </Text>
                  <Column>
                    <Text style={{ typography: 'bodyLarge', fontWeight: 'bold' }}>
                      {category.label}
                    </Text>
                    <Text color="#78716C" style={{ typography: 'bodySmall' }}>
                      {count} questions
                    </Text>
                  </Column>
                </Row>
              </Button>
            </Card>
          );
        })}

        <Text
          color="#A8A29E"
          style={{ typography: 'labelSmall', fontSize: 11 }}
        >
          v{version} ({buildNumber}) · {updateId}
        </Text>
      </LazyColumn>
    </Host>
  );
}
