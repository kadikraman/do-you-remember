package expo.modules.nativecrash

import android.os.Handler
import android.os.Looper
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

// Deliberate native crash for the Observe Lab screen. R8 renames these classes
// in release builds, so the stack trace needs mapping.txt to read (ENG-29398).
class NativeCrashModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("NativeCrash")

    Function("crash") { reason: String ->
      // An exception thrown in this body becomes a JS error, not a crash.
      Handler(Looper.getMainLooper()).post { QuizArchive(reason).restore() }
    }
  }
}

internal class QuizArchiveCorruptedException(reason: String) :
  RuntimeException("Observe Lab native crash: $reason")

internal class QuizArchive(private val reason: String) {
  fun restore(): Nothing = readEntries()

  private fun readEntries(): Nothing = verifyChecksum()

  private fun verifyChecksum(): Nothing = throw QuizArchiveCorruptedException(reason)
}
