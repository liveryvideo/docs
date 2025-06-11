# Livery Video Web Player

[![npm package](https://img.shields.io/npm/v/@liveryvideo/player.svg?logo=npm)](https://www.npmjs.com/package/@liveryvideo/player)
[![conventional CHANGELOG](https://img.shields.io/badge/conventional-CHANGELOG-FE5196.svg?logo=conventionalcommits)](/npm/player/CHANGELOG)
[![tsdoc API](https://img.shields.io/badge/tsdoc-API-3178C6.svg?logo=typescript)](/npm/player/dist/)
[![Lit Elements](https://img.shields.io/badge/Lit-Elements-324FFF.svg?logo=lit)](https://lit.dev/)
[![license MIT](https://img.shields.io/npm/l/@liveryvideo/player.svg?color=808080&logo=unlicense)](https://cdn.jsdelivr.net/npm/@liveryvideo/player/LICENSE)

Livery video player for use in web browsers.

?> Links: [Product demo](https://liveryvideo.com/demo), [Test page](https://test.livery.live/)

Please refer to the [Livery Video Portal](video-portal.md) for stream configuration options.

## Basic Usage

If you're not bundling your own JS you can just use an HTML snippet like this:

```html
<script src="https://cdn.jsdelivr.net/npm/@liveryvideo/player@x.y.z"></script>
<livery-player streamid="6613d164e4b0bf3ad645f3c6"></livery-player>
```

?> Replace the player version and stream id by your own, see: [CDN](#cdn), [HTML](#html) and [CSS](#css) for details below.

?> If this does not work you can fall back to embedding the player in an iframe instead, see: [Livery Video Embed](embed.md).

## Support

This package exports two bundles.

The ES `module` bundle is targetted at modern browsers and tools supporting `ES2019`.

The UMD `main` bundle (as used by jsdelivr [CDN](#cdn)) supports the last 2 major versions of: Chrome, Safari, Edge, Firefox, Android Chrome, iOS Safari and Samsung Internet.

## Installation

### CDN

The player can be loaded from [jsdelivr](https://jsdelivr.com):

```html
<script src="https://cdn.jsdelivr.net/npm/@liveryvideo/player@x.y.z"></script>
```

?> Replace the version (`x.y.z`) above by the player version that you wish to use. E.g: update to latest stable release periodically. Please see the [CHANGELOG](/npm/player/CHANGELOG) for details.

### NPM

Or the player can be installed using NPM:

```bash
npm install @liveryvideo/player
```

And then loaded in your JavaScript and bundled as you like:

```js
import '@liveryvideo/player';
```

## Usage

### HTML

```html
<livery-player streamid="6613d164e4b0bf3ad645f3c6"></livery-player>
```

?> Replace the Livery Demo stream id (`6613d164e4b0bf3ad645f3c6`) above by your own.

Please see the [LiveryPlayer](/npm/player/dist/classes/LiveryPlayer) API documentation for additional attributes etc.

### CSS

The livery-player element is displayed as a `block`, i.e: using the full width available by default.

If no height is specified it will use the video aspect ratio (default `16:9`) to determine the height intrinsically.

Alternatively you can specify the size extrinsically, to prevent it from changing as the stream is loaded, e.g:

```css
livery-player {
  height: 50vh;
}
```

See also: [MDN Sizing items in CSS](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Sizing_items_in_CSS)

When you use a fixed height like this the video contents of the player will be fitted inside the available space based on the `Fit` mode configured in the Livery Portal for this stream (e.g: `CONTAIN` or `COVER` or ..).

See also: [MDN object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)

## [API](/npm/player/dist/)

Detailed documentation of the exported API is generated and included in the NPM package and can be viewed here: [API](/npm/player/dist/)

## [CHANGELOG](/npm/player/CHANGELOG)

A detailed changelog of the package is generated and included in the NPM package and can be viewed here: [CHANGELOG](/npm/player/CHANGELOG)

## Guides

### Frictionless Login

To have the interactive layer authenticate you can change the [LiveryPlayer interactiveAuth property](/npm/player/dist/classes/LiveryPlayer?id=interactiveauth) to a JWT token `string` or claims `object` value. Inversely you can change it to an `undefined` value to have the interactive layer logout.

When this is used the interactive layer should specify a callback to the [InteractiveBridge option](/npm/interactive-bridge/dist/classes/InteractiveBridge?id=parameters) `{ handleAuth }`. That will then be called with the value of the `LiveryPlayer` `interactiveAuth` property whenever that changes. And in turn should take care of corresponding authentication within the interactive layer.

### Custom Controls

The default player controls can be disabled by changing the [LiveryPlayer controlsDisabled attribute](/npm/player/dist/classes/LiveryPlayer?id=controlsdisabled) to `true` or by specifying [InteractiveBridge option](/npm/interactive-bridge/dist/classes/InteractiveBridge?id=parameters) `{ controlsDisabled: true }`.

You can subsequently implement custom controls using the [LiveryPlayer](/npm/player/dist/) or [InteractiveBridge](/npm/interactive-bridge/dist/) API.

General guidelines based on the `LiveryPlayer` API (the `InteractiveBridge` API is similar):

- Wait for loading to finish (e.g: for `config` to be defined); while using
- Only show playback controls when video is available (i.e: `config?.streamPhase === 'LIVE'`)
- Only use supported `features`
- Respect which `config?.controls` are enabled and disabled
- Show controls when active and hide them again after a timeout of around 1.8s
  - Besides actively using controls (e.g: showing quality selection dialog)
  - Consider hovering as activity with pointer devices and keyboard focus with keyboard inputs
  - In addition to tapping or clicking anywhere in your preferred controls area
  - Immediately hide controls when pointer hover or keyboard focus leaves the player

More specifically, from bottom to top the following layers/controls should be shown on top of the video player:

- Interactive layer
  - Shown by the interactive element/page within the player as configured by the server
- Show only the first of the following overlays if their condition is matched:
  1. While `!navigator.onLine` show an offline overlay
  2. While `(config?.controls.error ?? true) && !!error` show an error overlay
     - With `error.message` and a reload button bound to `reload()`
     - If `features.contact && controls.contact` then show a link to the contact form in the info dialog (see below)
     - Note: Don't just show this overlay when `controls.error === true`, but also when config has not loaded (yet) and there is an error
       - If there was an error while loading config the default player controls will show this
       - Unless the page around the player has set `controlsDisabled` to `true` and is rendering these custom controls
  3. While `config?.streamPhase === 'LIVE' && playbackState === 'ENDED'` show a "Stream unavailable" overlay
  4. While `playbackState === 'PAUSED' && config?.controls.play === false || userPaused !== 'PAUSED'` show an overlay with a big play button
     - Where `userPaused: 'UNSPECIFIED' | 'PAUSED' | 'UNPAUSED'` corresponding to your use of `pause()` and `play()`
  5. While `!config || stalled` show a loading overlay
     - With custom controls in the interactive layer render this below your interactive content
     - TODO: Refactor to separate the overlay selection method from the display in layers here
  6. While `muted && (config?.controls.mute === false || userMuted !== 'MUTED')` show an overlay with a big unmute button
     - Where `userMuted: 'UNSPECIFIED' | 'MUTED' | 'UNMUTED'` corresponding to your use of `setMuted()`
  - The player persists this to storage and so should you
- Show a controls bar with:
- While `features.scrubber && config?.streamPhase === 'LIVE' && config.controls.scrubber` show scrubber:
  - _(to be specified, e.g: using playback details and `seek()`)_
- While `config?.streamPhase === 'LIVE' && config.controls.play` show a pause toggle button using `paused` and `play()` or `pause()`
- While `config?.controls.mute` show a mute toggle button using `muted` and `setMuted()`
- While `features.volume && config?.controls.mute` show a volume slider using `volume`
- While `config?.streamPhase === 'LIVE' && config.controls.quality` show a `qualities.list` toggle:
  - Highlighting the `qualities.active` and `qualities.selected` qualities
  - Enabling selecting one of those or the automatic quality selection (`-1`) using `selectQuality()`
- While `features.pip && config?.controls.pip` show a picture-in-picture toggle button using `display` and `setDisplay('PIP' | 'DEFAULT')`
- While `features.fullscreen && config?.controls.fullscreen` show a fullscreen toggle button using `display` and `setDisplay('FULLSCREEN' | 'DEFAULT')`
- While `features.airplay && config?.controls.airplay` show an Airplay toggle button using `display` and `setDisplay('AIRPLAY' | 'DEFAULT')`
- While `features.chromecast && config?.controls.chromecast` show a Chromecast toggle button using `display` and `setDisplay('CHROMECAST' | 'DEFAULT')`
- Enable showing an info dialog (currently shown on player/controls right click) with:
  - Livery player `version` from package
  - While `features.contact && config?.controls.contact` show a contact form bound to `submitUserFeedback()`

### Next.js

Next.js makes use of server side rendering, which the Livery Web SDK does not currently support. However, users of Next.js can still use the SDK by making use of Next.js’s support for [dynamic imports](https://nextjs.org/docs/advanced-features/dynamic-import) inside a [React Effect Hook](https://reactjs.org/docs/hooks-effect.html) or in a [React class component's `componentDidMount` lifecycle method](https://reactjs.org/docs/react-component.html#componentdidmount). When used in combination, this ensures the module being imported is evaluated at runtime on the client.

Note that many of the examples that Next.js provides use a statement of the form `dynamic( import(...) )`. The `dynamic()` function is used for importing React components and should not be used for importing `@liveryvideo/player`. The code below illustrates basic usage with Next.js.

```js
// do not import('@liveryvideo/player') here

function MyComponent() {
  useEffect(
    () => {
      import('@liveryvideo/player');
    },
    [], // tell react to only use this effect on mount
  );
  return <livery-player streamid="6613d164e4b0bf3ad645f3c6"></livery-player>;
}
```

## FAQ

### Autoplay

**_Why doesn't the player automatically start (unmuted)?_**

Browsers keep track of user engagement with video players on pages, scoring higher when the video is shown clearly and when it is allowed to play unmuted by the user.

In Chrome you can check this on the [Media Engagement](chrome://media-engagement/) page; when the player page has a `Score` which is marked as `Is High` `Yes` then unmuted autoplay is allowed.

Our player attempts to automatically start playback unmuted, but if for example the engagement score is too low that will not be allowed by the browser. In that case the player attempts to automatically start playback _muted_ instead and show a dialog to manually unmute.

In some cases a browser (p.e: Safari in low-power mode) or user (using browser configuration) might not allow autoplay at all (not even muted) in which case a dialog will be shown to manually start playback.
