import ExpoModulesCore

// Deliberate native crash for the Observe Lab screen. A Swift frame on the
// stack lets us check how llvm-symbolizer handles Swift names (ENG-27640).
public class NativeCrashModule: Module {
  public func definition() -> ModuleDefinition {
    Name("NativeCrash")

    Function("crash") { (reason: String) in
      NativeCrashModule.explode(reason: reason)
    }
  }

  // Separate, non-inlined function so the crash has its own frame.
  @inline(never)
  private static func explode(reason: String) -> Never {
    fatalError("Observe Lab native crash: \(reason)")
  }
}
