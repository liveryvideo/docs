# Livery Interactive SDK

[![GitHub last commit](https://img.shields.io/github/last-commit/exmg/livery-interactive)](https://github.com/exmg/livery-interactive)
[![NPM package](https://img.shields.io/npm/v/@exmg/livery-interactive)](https://www.npmjs.com/package/@exmg/livery-interactive)
[![Changelog](https://img.shields.io/badge/docs-CHANGELOG-blue)](interactive-sdk-changelog.md)
[![License](https://img.shields.io/npm/l/@exmg/livery-interactive)](https://unpkg.com/browse/@exmg/livery-interactive/LICENSE)
[![Built with open-wc recommendations](https://img.shields.io/badge/built%20with-open--wc-blue.svg)](https://open-wc.org/)

Ex Machina Group Livery Interactive SDK for use with LiveryPlayer interactive layer pages.

?> Demo page for use by LiveryPlayer: [interactive.liveryvideo.com](https://interactive.liveryvideo.com)

?> Demo page with mock player bridge: [interactive.liveryvideo.com/mock.html](https://interactive.liveryvideo.com/mock.html)

## Support

This package exports two bundles.

The ES `module` bundle is targetted at modern browsers and tools supporting `ES2019`.

The UMD `main` bundle (as used by unpkg [CDN](#cdn)) supports iOS/iPadOS Safari v12 and up and the last 2 major versions of: Chrome, Safari, Edge, Firefox, Android Chrome and Samsung Internet.

## Installation

### NPM

Install using NPM:

```bash
npm install @exmg/livery-interactive
```

### CDN

Or load from [unpkg](https://unpkg.com):

```html
<script src="https://unpkg.com/@exmg/livery-interactive@x.y.z"></script>
```

?> Replace the version (`x.y.z`) above by the version of the SDK that you wish to use. E.g: update to latest stable release periodically. Please see the [CHANGELOG](interactive-sdk-changelog.md) for details.

## Exports

When using the UMD bundle, these can be found as properties of `livery` in the global namespace, e.g: `livery.version`.

### version

String property specifying version of Livery Interactive SDK.

### InteractiveBridge

Can be used on Livery interactive layer pages to communicate with the surrounding Livery Player.

#### Usage

```JS
import { InteractiveBridge } from '@exmg/livery-interactive';

const bridge = new InteractiveBridge('*');

bridge.getLatency().then(latency => window.alert(`latency: ${latency}`));
```

**Note:** To prevent [cross site security issues](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#security_concerns) replace the `'*'` origin above with the origin of the page that the Livery Player containing this interactive layer page will be on.

#### Methods

| Method                                      | Description                                                                                                                                                                                                       |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `constructor(targetOrigin)`                 | Constructs InteractiveBridge with `window.parent` as target window and with specified target origin.                                                                                                              |
| `getLatency()`                              | Returns promise of current LiveryPlayer latency in seconds.                                                                                                                                                       |
| `registerInteractiveCommand(name, handler)` | Register `handler` function to be called with `arg` and `listener` when `sendInteractiveCommand()` is called on LiveryPlayer with matching `name`.                                                                |
| `sendPlayerCommand(name, arg?, listener?)`  | Returns promise of value returned by LiveryPlayer custom command handler with matching `name` that is passed `arg`. Any `handler` `listener` calls will subsequently also be bridged to this `listener` callback. |
| `subscribeOrientation(listener)`            | Returns promise of current LiveryPlayer window orientation (`'landscape' \| 'portrait'`) and calls back `listener` with any subsequent orientations.                                                              |
| `subscribeStreamPhase(listener)`            | Returns promise of current LiveryPlayer stream phase (`'PRE' \| 'LIVE' \| 'POST'`) and calls back `listener` with any subsequent phases.                                                                          |
| `unregisterInteractiveCommand(name)`        | Unregister custom interactive command by name.                                                                                                                                                                    |

### LiveryBridgeLog

Element defined as `<livery-bridge-log>` which logs LiveryBridge and other window messages posted to this window.

#### Usage

```html
<livery-bridge-log></livery-bridge-log>
```

#### Attributes

| Attribute     | Property      | Type     | Default | Description                            |
| ------------- | ------------- | -------- | ------- | -------------------------------------- |
| `maxmessages` | `maxMessages` | `number` | `10`    | Maximum number of messages to display. |
