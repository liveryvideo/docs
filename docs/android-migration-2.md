
# [Livery Video Android SDK](/android-sdk#migration-guide)

### Migration from 1.7 to 2.0

#### LiverySDK initialization

With version 2.0 we provide more control over LiverySDK initialization and more feedback.

The method in LiverySDK:

```java
public void updateRemoteConfig(String streamID);
```

was replaced with

```java
public void initialize(String streamId, StateListener listener)
```

where initialization feedback is given via the `LiverySDK.StateListener` callback.

Although you can call `initialize(String, StateListener)` regardless of LiverySDK being automatic or manually initialized
it is adviced to setup LiverySDK manually by setting the boolean resource `livery_sdk_auto_init` to `false` like as it is
in [Manual SDK Configuration](#manual-sdk-configuration) section.

The methods

```java
LiverySDK.getPlayerOptions()
```

where removed. Please use LiveryControlsOptions and LiveryPlayerOptions builders as is explained in
[LiveryPlayerView options](#liveryplayerview-options)

#### LiveryPlayerView

Version 2.0 adds a few `createPlayer` overload methods. It is adviced to use the default method:

```java
LiveryPlayerView playerView = ...
playerView.createPlayer();
// or
playerView.createPlayer(this::onPlayerCreated, this::onCreatePlayerError);
```

although the `createPlayer(LiveryPlayerOptions)` still [exist](#liveryplayerview-options).

The method

```java
LiveryPlayerView.loadInteractiveLayer(String);
```

was renamed to

```java
LiveryPlayerView.setInteractiveUrl(String);
```

#### LiveryPlayerOptions and LiveryControlsOptions

`LiveryPlayerOptions` and `LiveryControlsOptions` should now be defined with the corresponding Builder class.
See [LiveryPlayerView options](#liveryplayerview-options) section as an example.

#### LiveryPlayerListener

LiveryPlayerListener now have a no-op default implementation so there is no need to implement all methods.

LiveryPlayerListener.onProgressChanged was changed from

```java
onProgressChanged(long buffer, long bufferEnd, long latency)
```

to

```java
onProgressChanged(long buffer, long latency)
```

The methods `onDurationChanged` and `onVolumeChanged` were also removed.