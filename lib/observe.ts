import Constants from 'expo-constants';
import { Observe } from 'expo-observe';
import * as Updates from 'expo-updates';

// Attributes attached to every metric and event. The Observe Lab screen
// re-applies these after its "clear global attributes" test.
export function setBaseGlobalAttributes() {
  Observe.setGlobalAttributes({
    appVersion: Constants.expoConfig?.version ?? 'unknown',
    updateId: Updates.updateId ?? (Updates.isEmbeddedLaunch ? 'embedded' : 'dev'),
  });
}
