# [Livery Video Android SDK](/android-sdk#migration-guide)

### Migration from 3.2 to 4.0

Livery SDK now uses AndroidX Media3, the package `com.google.android.exoplayer2` was replaced by `androidx.media3`.

### LiveryPlayerView

The Controls, Loading and Error layers are no longer used to customize the player.

The methods

```java
LiveryPlayerView.setVolume()
LiveryPlayerView.getVolume()
```

were removed.

The methods

```java
LiveryPlayerView.setAutoSwitchToAudioOnlyMode()
LiveryPlayerView.setShowAudioOnlyModeInQualitiesList()
```

were removed and Audio Only now is enabled/disabled via `LiveryPlayerOptions` `setAudioOnly` method when creating the Player.

The second argument of `sendInteractiveBridgeCustomCommand` is now an `Object`.

The second argument of the listener `LiveryInteractiveBridge.CustomCommandListener` is now an `Object`.


### LiveryPlayerOptions

The `LiveryControlsOptions` option was moved to `LiveryPlayerView` via `setControlsOptions` method.
