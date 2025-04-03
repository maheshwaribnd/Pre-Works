# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:
-keep class com.yourpackage.** { *; }
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Preserve class names for React Native
-keep public class com.facebook.react.** { *; }

# Keep native method names for React Native
-keep public class com.facebook.jni.** { *; }

# Keep required classes for Hermes (if enabled)
-keep class com.facebook.hermes.unicode.** { *; }

# Preserve class names for JSC (if not using Hermes)
-keep class com.facebook.react.bridge.** { *; }

# Avoid obfuscating React Native views
-keep class com.facebook.react.uimanager.** { *; }

# Keep JSON models (if using any JSON-based libraries)
-keep class com.google.gson.** { *; }
-keep class com.fasterxml.jackson.** { *; }

# General rule to prevent stripping annotations
-keepattributes *Annotation*

# Keep the names of native methods
-keepclassmembers class * {
    native <methods>;
}

# Keep enum values
-keepclassmembers enum * { 
    public static **[] values(); 
    public static ** valueOf(java.lang.String); 
}

