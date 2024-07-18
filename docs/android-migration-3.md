# [Livery Video Android SDK](/android-sdk#migration-guide)

### Migration from 2.4 to 3.0

#### Livery SDK Package name

The Livery SDK package name changed to `com.liveryvideo.sdk` in the 3.0.0 release.

It should be safe to replace `tv.exmg.livery` with `com.liveryvideo.sdk` everywhere in the project.

### LiverySDK

LiverySDK now implements DefaultLifecycleObserver. The LiverySDK registers itself on the Aplication's LifecycleOwner.

The `Lifecycle getListenerLifecycle()` method was added to LiverySDK.StateListener interface to get the Lifecycle that the LiverySDK should take into account when calling the initialization listener. The getter implementation is options and the default return null. It is advised to return a valid Lifecycle via this method to prevent accessing to a destroyed Activity/Fragment. See [Manual SDK Configuration](#manual-sdk-configuration) for mode details.

### LiveryPlayerView

The methods

```java
LiveryPlayerView.onStop()
LiveryPlayerView.getTimeOffset()
LiveryPlayerView.getPlaybackRate()
```

were removed.

LiveryPlayerView now implements `DefaultLifecycleObserver` meaning that the methods

```java
   liveryPlayer.onResume()
   liveryPlayer.onPause()
   liveryPlayer.onDestroy()
```

now receive a `LifecycleOwner`

```java
   liveryPlayer.onResume(@NonNull LifecycleOwner owner)
   liveryPlayer.onPause(@NonNull LifecycleOwner owner)
   liveryPlayer.onDestroy(@NonNull LifecycleOwner owner)
```

It is recommended to register the LiveryPlayerView in a `LifecycleOwner` like an `Activity` or `Fragment`.

```java
   getLifecycle().addObserver(inlinePlayerView);
   // or
```

#### LiveryPlayerState

The state LiveryPlayerState.STATE_IDLE was removed.

#### LiveryPlayerListener

Version 3.0 removes the deprecated method from `LiveryPlayerListener`:

Replace:

```java
LiveryPlayerListener.onActiveQualityChanged(LiveryQuality quality)
```

with:

```java
LiveryPlayerListener.onActiveQualityChanged(LiveryQuality quality, Boolean auto)
```

And the method

```java
LiveryPlayerListener.onPlaybackRateChanged(float rate)
```

was also removed.

#### LiveryQuality

LiveryQuality no longer has a `track`property.
From 3.0.0 there are 2 static properties `AUTO_ID` and `AUDIO_ONLY_ID` which can be used to `setQuality` in LiveryPlayerView.

```java
   liveryPlayer.setQuality(LiveryQuality.AUTO_ID)
   // ...
   liveryPlayer.setQuality(LiveryQuality.AUDIO_ONLY_ID)
```

#### LiveryPlayerOptions

The properties of LiveryPlayerOptions are now final.

The method

```java
LiveryPlayerOptions.setAkamaiToken(String token)
```

was renamed to

```java
LiveryPlayerOptions.setAkamaiLongToken(@Nullable String token)
```

#### LiveryControlsOptions

The play and scrubber are now hidden regarding of any value defined in `LiveryControlsOptions.showPlay` and `LiveryControlsOptions.showScrubber`.
A new `showContact` setter method was added to `LiveryControlsOptions`

#### Error Overlay

The IDs used to customize the error overlay

```java
   R.id.livery_error_header
   R.id.livery_error_overlay_text
   R.id.livery_error_overlay_button
```

were replaced with

```java
   R.id.livery_error_text    -> TextView
   R.id.livery_error_button   -> View
```

#### Player Controls

The interface `TimeBar` was replaced with `LiveryProgressBar`

The IDs used to customize the player's controls

```java
   R.id.livery_quality
   R.id.livery_quality_indicator_background
   R.id.livery_time_separator
   R.id.livery_live_circle
   R.id.livery_live_text
```

were remove.

#### Nullability changes

`@NonNull` and `@Nullable` annotations were added to some methods in the 3.0.0 release:

- `LiveryPlayerListener.onActiveQualityChanged`
- `LiveryPlayerListener.onPlayerStateChanged`

#### Interactive Bridge

It is no longer possible to subscribe to orientation changes via Interactive Bridge.