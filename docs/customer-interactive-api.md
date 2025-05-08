# Livery Video Interactive API

This page describes the API calls that are available to customers.
These calls can be used by application administrators or developers to retrieve restricted data.

For more information regarding domain & paths, ask for the URL from Livery support.

## Rate limits

These API's are not ment to be used directly in frontend applications.
Make sure a backend is put in between to cache the responses and prevent hitting the rate limits.

The API calls are rate limited to 30 calls per minute per customer.
This means that it combines the request count for all streams of a customer.
If this limit is exceded the server will return a response with a 429 HTTP status code.

## Pull API

Authorized customers are allowed to access Livery interactive restricted API calls.
Authorization will be done via an API key that can be retrieved from the Livery interactive portal.

The value of the added key must be included in header `x-livery-api-key`

Unless an API key is added, the customer will not be able to retrieve broadcast data.

Page numbers start at 0 on paginated API calls

### Get current broadcast data

This API call can be used to retrieve information about the broadcast that is currently live.
A use case is to poll this API to react on the broadcast being closed.

```
curl -H "x-livery-api-key: value" https://www.example.com/services/broadcasts/current
```

Response example:

[filename](_customer-interactive-api/_example-BroadcastCurrent.md ':include')

#### List of supported interactions:

<details>
<summary>announcement</summary>

[announcement](_customer-interactive-api/interactions/announcement.md ':include')
</details>

<details>
<summary>countdown</summary>

[countdown](_customer-interactive-api/interactions/countdown.md ':include')
</details>

<details>
<summary>estimate</summary>

[estimate](_customer-interactive-api/interactions/estimate.md ':include')
</details>

<details>
<summary>estimationPoll</summary>

[estimationPoll](_customer-interactive-api/interactions/estimationpoll.md ':include')
</details>

<details>
<summary>estimationPrediction</summary>

[estimationPrediction](_customer-interactive-api/interactions/estimationprediction.md ':include')
</details>

<details>
<summary>liveReaction</summary>

[liveReaction](_customer-interactive-api/interactions/livereaction.md ':include')
</details>

<details>
<summary>poll</summary>

[poll](_customer-interactive-api/interactions/poll.md ':include')
</details>

<details>
<summary>prediction</summary>

[prediction](_customer-interactive-api/interactions/prediction.md ':include')
</details>

<details>
<summary>productItem</summary>

[productItem](_customer-interactive-api/interactions/productitem.md ':include')
</details>

<details>
<summary>rating</summary>

[rating](_customer-interactive-api/interactions/rating.md ':include')
</details>

<details>
<summary>shopifyProductItem</summary>

[shopifyProductItem](_customer-interactive-api/interactions/shopifyproductitem.md ':include')
</details>

<details>
<summary>trivia</summary>

[trivia](_customer-interactive-api/interactions/trivia.md ':include')
</details>

<details>
<summary>webclip</summary>

[webclip](_customer-interactive-api/interactions/webclip.md ':include')
</details>

### Get broadcast data

This API call can be used to retrieve information about any created broadcast.

```
curl -H "x-livery-api-key: value" https://www.example.com/services/broadcasts/{broadcastId}
```

Response example:

[filename](_customer-interactive-api/_example-Broadcast.md ':include')

### Get interaction

This API call can be used to retrieve information about interaction.

```
curl -H "x-livery-api-key: value" https://www.example.com/services/broadcasts/{broadcastId}/interactions/{interactionId}
```
Response example:

[estimationPoll](_customer-interactive-api/interactions/estimationpoll.md ':include')

This response is specific to the `estimationPoll` interaction type. [Here](#List-of-supported-interactions) is the full list of supported interactions.

### Get user data

This API call can be used to retrieve a list of users in a broadcast.

```
curl -H "x-livery-api-key: value" https://www.example.com/services/broadcasts/{broadcastId}/users/pagenumbers/{pagenumber}
```

Response example:

[filename](_customer-interactive-api/_example-Users.md ':include')

### Get leaderboard data

This API call can be used to retrieve game data on a broadcast. 
The `isUpdating` field serves as an indicator of the leaderboard’s current processing status. 
When `isUpdating` is set to `true`, it signifies that the leaderboard is actively undergoing updates, 
such as recalculating player rankings or processing new scores. 
Conversely, when `isUpdating` is `false`, it indicates that the leaderboard has completed all processing tasks and reflects the most recent data.

```
curl -H "x-livery-api-key: value" https://www.example.com/services/broadcasts/{broadcastId}/leaderboard/pagenumbers/{pageNumber}
```

Response example:

[filename](_customer-interactive-api/_example-Leaderboard.md ':include')

## Push API

Next to the Pull API's a limited set of Push API's exist.
These API's work the other way around where the Livery server's will do a call to a server of the customer.

For each of the Push API's you can configure a push URL.
The Livery server will do a HTTP POST request to the configured url with a request body as specified below.
The push URL's can be configured in the `Services API settings` in the `Settings` page.

The server will retry each API call maximum 5 times, with a delay of 20 seconds after each retry.

### Broadcast push API

The broadcast push API call will be invoked when a broadcast is opened or closed.
This could be used to trigger the retrieval of exports for example.

Example request body:

[broadcast](_customer-interactive-api/_example-Broadcast.md ':include')

### Leaderboard push API

The leaderboard push API call will be invoked on several leaderboard related events.
This can be at the start or end of the update process or when the persisting state changes.

Leaderboards are updated in passes.
This is done to be able to time the leaderboard updates precicely.
For example we don't want to update user score's when the interaction results are not yet shown in the frontend.
When we start such a leaderboard pass, this push API will be invoked with the `updatingForTriggeredByIds` array containing the id of the interaction that caused the leaderboard update.
When the update process is done another call is done, and now the interaction id has been moved to the `updatedForTriggeredByIds` array.
So you can see which interactions have contributed to the current leaderboard.

Leaderboards also have a `state` field which can have one of the following values:

- LIVE: the leaderboard is in a stable state but can change at any time
- UPDATING: the leaderboard is currently being updated
- FINALIZED: the leaderboard is finalized, meaning scores will not be updated anymore
- PERSISTING: the leaderboard is being written to slower long term storage
- PERSISTED: the leaderboard persisting process has finished

Example request body:

[leaderboard push](_customer-interactive-api/_example-LeaderboardPush.md ':include')
