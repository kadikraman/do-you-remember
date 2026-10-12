import { NativeModule, requireOptionalNativeModule } from 'expo';

declare class NativeCrashModule extends NativeModule<{}> {
  /** Terminates the process with a Swift fatalError. Never returns. */
  crash(reason: string): never;
}

// Only built for Apple platforms. Null on Android and web.
export default requireOptionalNativeModule<NativeCrashModule>('NativeCrash');
