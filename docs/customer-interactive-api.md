# Livery Video Interactive API

This document describes the API calls that are available to customers. These calls can be used by application administrators to retrieve restricted data.

For more information regarding domain & paths, ask for the URL from Livery support.

## Pull restricted broadcast data

Authorized customers are allowed to access Livery interactive restricted API calls.
Authorization will be done via an API key that can be retrieved from the Livery interactive portal.

The value of the added key must be included in header `x-livery-api-key`

Unless an API key is added, the customer will not be able to retrieve broadcast data.

## Push restricted broadcast data

On broadcast status change, it is possible to be notified of the changes. You have to add a value to `PUSH_URL`
server setting, representing your API endpoint which will receive the data with HTTP POST.

Note: Add your API endpoint URL to receive broadcast status changes. This is done via server settings update endpoint.

Example of notification: 

[broadcast](_customer-interactive-api/_example-Broadcast.md ':include')

## API Calls

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
