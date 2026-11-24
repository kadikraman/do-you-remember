# Without this, R8 merges the exception into an unrelated class, and retrace
# then reports that class as the exception type. The name is still obfuscated.
-keep,allowobfuscation class expo.modules.nativecrash.QuizArchiveCorruptedException
