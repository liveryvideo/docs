# Livery Video Android SDK

[![Revision History](https://img.shields.io/badge/doc-Revision%20History-blue)](android-sdk-changelog.md)

More information can be found at: [liveryvideo.com](https://liveryvideo.com).

## Installation

### Compatibility

Livery Android SDK is compatible with Android 5.0 (API level 21) or higher.

### Configure Gradle

From version 2.0.0 onwards Livery SDK is published via [jitpack.io](https://jitpack.io).

You can still use bintray repository and credentials, please follow the steps in [here](/android-installation-bintray#installation-from-bintray).

To install Livery SDK into your project, follow these steps below.

#### Resolve Repositories

For new projects created with Android Studio Arctic Fox 2020.3.1 go to settings.gradle and add:

```groovy
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        .....
        maven {
            url "https://jitpack.io"
            credentials { username authToken }
        }
    }
}
```

For existing projects go to your project level build.gradle file, add these closures to **allprojects** > **repositories**.

```groovy
allprojects {
   repositories {
      //...
      google()
      jcenter()
      maven {
         url 'https://jitpack.io'
         credentials { username '<your access token>' }
      }
   }
}
```

To retrieve your access token log into <http://jitpack.io> with your GitHub account and go to <https://jitpack.io/w/user>.

Your GitHub account has to be granted access to the packages.
If you are unable to access the packages please ask your support contact to grant you access.

#### Add Implementations

Add these implementations inside **dependencies** to your app-level build.gradle.

```groovy
dependencies {
   //...
   implementation "com.liveryvideo:livery-sdk-android:4.2.4"
   //...
}
```

#### Set Java Version of Project

Then add this compileOptions inside **android** closure on your app level build.gradle, like shown below.

```groovy
android {
//...
  compileOptions {
     sourceCompatibility JavaVersion.VERSION_17
     targetCompatibility JavaVersion.VERSION_17
  }
}
```

## Usage

For basic usage of the SDK following minimal steps are needed:

### Configure SDK streamId

Add `livery_stream_id` to your strings and pass the streamId as the value.

```xml
<resources>
   <!--...-->
   <string name="livery_stream_id">insert_stream_id_here</string>
</resources>
```

The `LiverySDK` will initialize itself using the string resource `livery_stream_id` when the application starts.

It is possible to know the LiverySDK State by calling:

```java
LiverySDK.State state = LiverySDK.getInstance().getState();
```

### Add LiveryPlayerView

Add the player view into the layout that your activity or fragment is using.

Please note that **keepScreenOn** attribute is optional and it defines whether
screen can turn off after an amount of time or not.

```xml
<tv.exmg.livery.LiveryPlayerView
   android:id="@+id/liveryPlayer"
   android:layout_width="match_parent"
   android:layout_height="wrap_content"
   android:keepScreenOn="true" />
```

Due to the Cast feature the Player's Activity Theme needs to have a `colorPrimary` defined without opacity.

### Setup LiveryPlayerView

Bind LiveryPlayerView to your layout file, then call `createPlayer` to setup the LiveryPlayerView.

```java
LiveryPlayerView playerView;

@Override
public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
   super.onViewCreated(view, savedInstanceState);

   playerView = view.findViewById(R.id.liveryPlayer);
   playerView.createPlayer();
}
```

The player might not be initializaed right after `createPlayer` call. For example, it may be defer to after `LiverySDK`
initialization finishes. [LiveryPlayerView.CreatePlayerListener and LiveryPlayerView.CreatePlayerErrorListener](#createplayer-feedback)
provide more information if the player was initialized or there was an error during initialization.

### Register in a LifecycleOwner

`LiveryPlayerView` implements `DefaultLifecycleObserver` and is must be registered in a `LifecycleOwner`, for example when using a `Fragment`:

```java
public void onViewCreated(@NonNull View view, Bundle savedInstanceState) {
   super.onViewCreated(view, savedInstanceState);
   ...
   LiveryPlayerView playerView = view.findViewById(R.id.livery_player_view);
   getLifecycle().addObserver(playerView);
   ...
}
```

#### 🎉 Done

Congratulations! You have implemented Livery SDK successfully.

To have more control over Livery SDK, next sections should provide you more knowledge.

## Advanced configuration

### Manual SDK Configuration

Defining the `streamId` via the resource string `livery_stream_id` as it is in [Configure SDK streamId](#configure-sdk-streamid)
automatically initializes the SDK when the application starts.

It is possible defer this initialization to a later point by doing it manually by defining the boolean
resource `livery_sdk_auto_init` with `false` instead of `livery_stream_id`:

```xml
<resources>
   <!--...-->
    <bool name="livery_sdk_auto_init">false</bool>
</resources>
```

and then use the `LiverySDK.initialize` method that allows to define a desied `streamId` and to have some feedback
about the SDK initization process:

```java
   String streamId = ...
   LiverySDK.getInstance().initialize(streamId, new LiverySDK.StateListener() {
      @Override
      public void stateChanged(LiverySDK.State state) {

      }

      @Override
      public Lifecycle getListenerLifecycle() {
         return getLifecycle();
      }
   });
```

When choosing the manual initialization neither LiverySDK nor LiveryPlayerView will automatically retry to initialize in
case or errors. Error handling and retry needs to be done manually.

```java
void initializeSdk(String streamId) {
   LiverySDK.getInstance().initialize(streamId, new LiverySDK.StateListener() {
      @Override
      public void stateChanged(LiverySDK.State state) {
         if (LiverySDK.State.INITIALIZED.equals(state)) {
               // continue
         } else {
               // handle error
               Exception error = state.error;
               // retry
               requireView().post(() -> initializeSdk(streamId));
         }
      }

      @Override
      public Lifecycle getListenerLifecycle() {
         return getLifecycle();
      }
   });
}
```

LiveryPlayerView `createPlayer` should only be called after LiverySDK is initialized, otherwise this method will fail.

### Configure LiveryPlayerView

#### CreatePlayer feedback

It is possible to have more control of the LiveryPlayerView initialization. There are 2 interfaces in
`LiveryPlayerView` that allow to know when the player was configured or if there was an error during configuration:

```java
   LiveryPlayerView playerView = ...
   playerView.createPlayer(new LiveryPlayerView.CreatePlayerListener() {
      @Override
      public void finished() {

      }
   }, new LiveryPlayerView.CreatePlayerErrorListener() {
      @Override
      public void onError(Exception error) {

      }
   });
```

#### LiveryPlayerView options

The LiveryPlayerView can be configured with either remote or local configurations. When local configurations are set
they will override the corresponding remote configurations.

```java
   LiveryPlayerView playerView = ...

   LiveryPlayerOptions playerOptions = new LiveryPlayerOptions.Builder()
            .setAutoPlay(true)
            .setAudioOnly(true)
            .setResizeMode(LiveryResizeMode.DEFAULT)
            .setPrePoster("prePoster url")
            .setPoster("poster url")
            .setPostPoster("postPoster url")
            .setAkamaiLongToken("akamai_token")
            .build();

   playerView.createPlayer(playerOptions);
   // or
   playerView.createPlayer(playerOptions, this::onPlayerCreated, this::onCreatePlayerError);

```


#### LiveryPlayerView controls options

The LiveryPlayerView controls can also be configured with either remote or local configurations. When local configurations are set


```java
   LiveryPlayerView playerView = ...

   LiveryControlsOptions controlsOptions = new LiveryControlsOptions.Builder()
            .showFullscreen(true)
            .showMute(true)
            .showQuality(true)
            .showPlay(true)
            .showScrubber(true)
            .showCast(true)
            .showError(true)
            .build();

   playerView.setControlsOptions(controlsOptions);

```


## SDK Methods

> To access the SDK class, ‘LiverySDK’ should be used.

### SDK Instance

In order to call some methods, instance of the SDK must be used.
You can get the instance with the line below:

```java
LiverySDK.getInstance();
```

### Pinpoint User ID

In some cases, getting the pinpoint user ID can be useful, i.e.: You would like to show the user their pinpoint user ID for analysis based on a specific user. To do so, here is how to get the pinpoint user ID:

```java
String pinpointUserId = LiverySDK.getInstance().getPinpointUserId();
```

## Player Methods

> To access these methods, use the reference to your LiveryPlayerView from your fragment or activity.

### Create Player

By calling `createPlayer()` on LiveryPlayerView reference, a player instance will be created and initialized.

### Current Time

#### Get Current playback time since the stream has started

```java
long currentTime = playerView.getCurrentTime();
```

### Duration

#### Get the duration of the stream. For Live streams returns the duration since the start of the stream

```java
long duration = playerView.getDuration();
```

### Mute/Unmute

#### Set Muted/Unmuted State

```java
boolean shouldMute = true;
playerView.setMuted(shouldMute);
```

#### Get Muted/Unmuted State

```java
boolean isMuted = playerView.isMuted();
```

### Latency

#### Set Target Latency

```java
int targetLatencyInMilliseconds = 5000;
playerView.setTargetLatency(targetLatencyInMilliseconds);
```

#### Get Target Latency

```java
long currentLatency = playerView.getLatency();
```

### Media Quality

#### Get Available Qualities

```java
List<LiveryQuality> qualities = playerView.getQualities();
```

#### Get Active Quality

```java
LiveryQuality activeQuality = playerView.getActiveQuality();
```

#### Set Quality

```java
playerView.setQuality(liveryQuality.qualityId);
```

When you want to set quality to **automatic** mode or **audio-only** mode,
you need to make a call with a specific id that does not return in getQuality method.

For that, you can use the methods below.

```java
//Sets the quality automatically for the rest of the media,
//until a quality id is specified.
playerView.setQuality(LiveryQuality.AUTO_ID);

//Sets the quality to audio only.
playerView.setQuality(LiveryQuality.AUDIO_ONLY_ID);
```

### Audio Only Mode

Audio Only mode can be enabled when creating the player via `LiveryPlayerOptions`:

```java
   LiveryPlayerView playerView = ...

   LiveryPlayerOptions playerOptions = new LiveryPlayerOptions.Builder()
            ...
            .setAudioOnly(true)
            ...
            .build();

   playerView.createPlayer(playerOptions);
```

### Akamai long token

Defines a access token to use to be able to see a stream that uses Akamai’s Token Auth feature.

```java
playerView.setAkamaiLongToken("akamai_token");
```

### Debug Mode

#### Set Debug Mode Status

This will create an info dialog on the top right corner of the player and output all logs of SDK.

```java
boolean isDebugMode = true;
playerView.setDebugModeEnabled(isDebugMode);
```

#### Get Debug Mode Status

```java
boolean isDebugModeEnabled = playerView.isDebugModeEnabled();
```

## Classes

### LiverySDK State

LiverySDK.State is used to provide LiverySDK state feedback either with [automatic initalization](#configure-sdk-streamid)
or [manual initialization](#manual-sdk-configuration).

LiverySDK.State can be one of 3 values:

- `LiverySDK.State.NOT_INITIALIZED`
- `LiverySDK.State.INITIALIZED`
- `LiverySDK.State.ERROR` where you can access the inner Exception via `LiverySDK.State.error` member.

### Player Options

LiveryPlayerOptions has these properties listed on the table below. These options take effect only after [createPlayer](#liveryplayerview-options) is called.
Each of these properties can be defined individually via LiveryPlayerOptions.Builder.

class **_LiveryPlayerOptions_**

| Name              | Type                        | Default                       | Description                                                                                                                                |
| ----------------- | --------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `autoPlay`        | `Boolean`                   | `true`                        | Determines whether video shall play immediately after [createPlayer](#create-player).                                                      |
| `setAudioOnly`    | `Boolean`                   | `false`                       | Determines whether is enabled or not. |
| `fit`             | `LiveryResizeMode`          | `CONTAIN`                     | Provides access to LiveryResizeMode. Video size inside the player view can be changed from here.                                           |
| `prePoster`       | `String`                    | null                          | Represents URL to poster image. When this property is not empty, the player will show a poster on creation.                                |
| `poster`          | `String`                    | null                          | Represents URL to poster image. When this property is not empty, the player will show a poster on creation.                                |
| `postPoster`      | `String`                    | null                          | Represents URL to poster image. When this property is not empty, the player will show a poster on creation.                                |
| `akamaiLongToken` | `String`                    | null                          | Access token to use to be able to see a stream that uses Akamai’s Token Auth feature.                                                      |
| `sources`         | `String` or `Array<String>` | None                          | Defines the sources URLs.                                                                                                                  |

### Player Resize Mode

Player resize mode is passed on [Player Options](#player-options) to indicate video size.

enum **_LiveryResizeMode_**

| Name      | Description                                                                                                       |
| --------- | ----------------------------------------------------------------------------------------------------------------- |
| `CONTAIN` | Shows the full video in the view box no matter what, without breaking the aspect ratio.                           |
| `COVER`   | Fills the view box, however, zooms the video if video dimensions are too big for the view. Keep the aspect ratio. |
| `FILL`    | Fits the video into the view box, by ignoring aspect ratio rules.                                                 |

### Player Controls

You can edit LiveryControlsOptions from controls property of LiveryPlayerOptions.
Each of these properties can be defined individually via LiveryControlsOptions.Builder.
Available controls are listed on the table below.

class **_LiveryControlsOptions_**

| Name         | Type      | Default | Description                                   |
| ------------ | --------- | ------- | --------------------------------------------- |
| `fullscreen` | `Boolean` | `false` | Sets the visibility of the fullscreen button. |
| `mute`       | `Boolean` | `false` | Sets the visibility of the mute button.       |
| `quality`    | `Boolean` | `false` | Sets the visibility of the quality button.    |
| `play`       | `Boolean` | `false` | Sets the visibility of the play button.       |
| `scrubber`   | `Boolean` | `false` | Sets the visibility of the scrubber button.   |
| `contact`    | `Boolean` | `false` | Sets the visibility of the contact button.    |
| `cast`       | `Boolean` | `false` | Sets the visibility of the cast button.       |
| `error`      | `Boolean` | `false` | Sets the visibility of the error overlay.     |

### Player Events

It might be important in some cases to receive player events and process the data for your needs. In order to receive player events, a LiveryPlayerListener must be registered to the player.

class **_LiveryPlayerListener_**

| Name                                                                   | Description                                                                                                             |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `onActiveQualityChanged(@NonNull LiveryQuality quality, boolean auto)` | Called when the active quality of the media being played has changed.                                                   |
| `onPlayerError(Exception e)`                                           | Called when the player encounters an error.                                                                             |
| `onPlayerStateChanged(@NonNull LiveryPlayerState playerState)`         | Called when the playback state of the player has changed.                                                               |
| `onProgressChanged(long buffer, long latency)`                         | Called in short intervals while playing, buffer and latency values in milliseconds can be actively retrieved from here. |
| `onQualitiesChanged(@NonNull List<LiveryQuality> qualities)`           | Called when available qualities of media have changed.                                                                  |
| `onPlaybackRateChanged(float rate)`                                    | Called when the playback rate of current media has changed.                                                             |
| `onRecovered()`                                                        | Called when an error is recovered.                                                                                      |
| `onTimeUpdate(long currentTime)`                                       | Called when the current time of media has changed.                                                                      |
| `onSourceChanged(@NonNull String source)`                              | Called when the media source URL of the player has changed.                                                             |

#### Registering Player Event Listener

By calling `registerListener(LiveryPlayerListener)` method on LiveryPlayerView, a player event listener can be registered.

```java
playerView.registerListener(new LiveryPlayerListener() {
   //...
});
```

### Player Media Quality

class **_LiveryQuality_**

| Name        | Type      | Description                     |
| ----------- | --------- | ------------------------------- |
| `bitrate`   | `Integer` | Bitrate of the quality.         |
| `codecs`    | `String`  | Codec of the media.             |
| `frameRate` | `Float`   | Frame rate of the media.        |
| `height`    | `Integer` | Height of the media.            |
| `label`     | `String`  | Human readable name of quality. |
| `qualityId` | `String`  | ID of quality.                  |
| `width`     | `Integer` | Width of the media.             |

## Handle Orientation Changes

There are situations when you need to handle screen orientation changes so that the player won’t re-initialize after changing orientation. To prevent it, add this line to the manifest in the activity scopes which you want to handle orientation changes.

```xml
<activity
android:configChanges="orientation|screenSize">
<!-- ... -->
</activity>
```

## Interactive Bridge

It is possible to interact with LiveryPlayerView and the Interactive Layer using the [Interactive Bridge](/interactive-bridge).

The interactive URL can be defined with:

```java
LiveryPlayerView playerView = ...
String url = ...
playerView.setInteractiveUrl(url);
```

Besides the [methods](/interactive-bridge?id=methods) already definied on the Interactive Bridge to get values like the player **latency**, **quality**, etc. you can get and send custom messages.

### Custom commands

From the Android LiveryPlayerView it is possible to send and receive custom command to/from the interactive layer.

A custom command with a specific `name` and `argument` can be sent with the `sendInteractiveBridgeCustomCommand` method:

```java
String name = ...
Object argument = ...
playerView.sendInteractiveBridgeCustomCommand(name, argument, new LiveryInteractiveBridge.CustomCommandResponseCallback() {
   @Override
   public void result(@Nullable Object response, @Nullable String error) {

   }
});
```

To receive callbacks from the interactive layer a `LiveryInteractiveBridge.CustomCommandListener` object needs to be
register with the `setInteractiveBridgeCustomCommandListener`
method.
The commands are received on `onMessage` with the `name`, `argument` and a `callback`
that allows to sent back to the interactive layer a result Object:

```java
playerView.setInteractiveBridgeCustomCommandListener(new LiveryInteractiveBridge.CustomCommandListener() {
   @Override
   public void onMessage(@NonNull String name, @Nullable Object argument, @Nullable LiveryInteractiveBridge.CustomCommandResultCallback callback) {
      ...
      Object result = ...
      callback.result(result);
   }
});
```

## Sentry Integration

Livery uses Sentry for error reporting. In order to setup sentry.io with the correct DNS LiverySDK forces its initialization to manual
by setting `false` to [io.sentry.auto-init](https://docs.sentry.io/platforms/android/configuration/manual-init/) meta-data key.

Sentry can be used in the host application along side with LiverySDK Sentry integration.

To prevent LiverySDK from using static methods define `livery_sentry_use_static_methods` resource boolean variable to false:

```xml
<resources>
   <!--...-->
   <bool name="livery_sentry_use_static_methods">false</bool>
</resources>
```

To enable sentry.io auto initialization please add the following to the Application AndroidManifest.xml

```xml
<meta-data android:name="io.sentry.auto-init" android:value="true" tools:replace="android:value" />
```

Sentry usage by LIverySDK can be disabled by setting `livery_enable_sentry` resource boolean variable to false, default is true:

```xml
<resources>
   <!--...-->
   <bool name="livery_enable_sentry">false</bool>
</resources>
```

## Migration Guide

#### [Migration from 3.2 to 4.0](/android-migration-4#migration-from-32-to-40)

#### [Migration from 2.4 to 3.0](/android-migration-3#migration-from-24-to-30)

#### [Migration from 1.7 to 2.0](/android-migration-2#migration-from-17-to-20)


## Q&A
