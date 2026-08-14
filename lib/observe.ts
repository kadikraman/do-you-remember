import Constants from 'expo-constants';
import { Observe } from 'expo-observe';

// Attributes attached to every metric and event. The Observe Lab screen
// re-applies these after its "clear global attributes" test.
export function setBaseGlobalAttributes() {
  Observe.setGlobalAttributes({
    appVersion: Constants.expoConfig?.version ?? 'unknown',
  });
}
