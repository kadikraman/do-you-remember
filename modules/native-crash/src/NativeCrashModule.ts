import { NativeModule, requireOptionalNativeModule } from 'expo';

declare class NativeCrashModule extends NativeModule<{}> {
  /** Terminates the process: Swift fatalError on iOS, uncaught Kotlin exception on Android. */
  crash(reason: string): void;
}

// Null on web.
export default requireOptionalNativeModule<NativeCrashModule>('NativeCrash');
