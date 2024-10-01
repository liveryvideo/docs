```json
{
  "broadcastId": "__8ACqCEN-YR-_vqFBAAAA==",
  "tenantId": "____48UvbgcnNAxn-7EAAA==",
  "name": "Test broadcast",
  "phase": "LIVE",
  "creationDate": 1727273305733,
  "latestLiveDate": 1727273310554,
  "closeDate": 0,
  "lastAnonymizeActionDate": 0,
  "lastStatsUpdateSent": 1727352360368,
  "hideExtension": false,
  "archived": false,
  "interactionDetails": [
    {
      "interactionId": "__8ACqD4N-YSIPvqFBAAAA==",
      "type": "trivia",
      "phaseConfigs": {
        "PENDING": {
          "duration": 0.0,
          "autoNextPhaseOnDurationEnd": false,
          "minimalDuration": 0.1,
          "isRelativeToBroadcast": false
        },
        "RESULTS": {
          "duration": 0.0,
          "autoNextPhaseOnDurationEnd": false,
          "isRelativeToBroadcast": false
        },
        "OPEN": {
          "duration": 0.0,
          "autoNextPhaseOnDurationEnd": false,
          "isRelativeToBroadcast": false
        }
      },
      "serverPhaseTimes": {
        "OPEN": 1727276366119,
        "PENDING": 1727276626165,
        "RESULTS": 1727276639815
      },
      "serverPhase": "RESULTS",
      "nextServerPhase": "CLOSED",
      "clientPhase": "RESULTS",
      "clientPhaseDurationInSeconds": 0.0,
      "clientPhaseEnd": 1727276639815,
      "flags": []
    },
    {
      "interactionId": "__8ACqE8N-YSM_vqFBAAAA==",
      "type": "poll",
      "phaseConfigs": {
        "PENDING": {
          "duration": 0.0,
          "autoNextPhaseOnDurationEnd": true,
          "minimalDuration": 0.1,
          "isRelativeToBroadcast": false
        },
        "RESULTS": {
          "duration": 0.0,
          "autoNextPhaseOnDurationEnd": false,
          "isRelativeToBroadcast": false
        },
        "OPEN": {
          "duration": 0.0,
          "autoNextPhaseOnDurationEnd": false,
          "isRelativeToBroadcast": false
        }
      },
      "serverPhaseTimes": {
        "OPEN": 1727276366884,
        "PENDING": 1727276623021,
        "RESULTS": 1727276623266
      },
      "serverPhase": "RESULTS",
      "nextServerPhase": "CLOSED",
      "clientPhase": "RESULTS",
      "clientPhaseDurationInSeconds": 0.0,
      "clientPhaseEnd": 1727276623266,
      "flags": []
    }
  ],
  "instanceIdToConcurrencyData": {
    "i-04e12184ce2f34004-CONSUMER": {
      "count": 0,
      "date": 1727352360363
    },
    "i-02786d6ad0884978a-WEB": {
      "count": 0,
      "date": 1727352360444
    },
    "i-04e12184ce2f34004-WEB": {
      "count": 1,
      "date": 1727352360370
    },
    "i-02786d6ad0884978a-CONSUMER": {
      "count": 0,
      "date": 1727352360402
    }
  },
  "smsLimit": 0,
  "smsCount": 0,
  "currentConcurrency": 1,
  "totalPlayers": 1,
  "newPlayers": 0,
  "returningPlayers": 1,
  "locale": "en-AU",
  "themeId": "____48UvbgcnNwxn-7EAAA==",
  "agreementRequirements": {
    "agreementIds": []
  },
  "profileRequirements": {
    "propertyRequirements": [
      {
        "field": "EMAIL",
        "mandatory": false,
        "constraints": {
          "regex": "^[\\w\\-\\.\\+]+@([\\w-]+\\.)+[\\w-]{2,4}$",
          "allowedValues": []
        }
      },
      {
        "field": "GENDER",
        "mandatory": false,
        "constraints": {
          "minLength": 3,
          "allowedValues": []
        }
      }
    ]
  },
  "schedule": {
    "autoStart": false,
    "autoClose": false,
    "autoCloned": false
  },
  "attributes": [
    {
      "name": "chatVisible",
      "value": true
    },
    {
      "name": "questionAnswerVisible",
      "value": true
    },
    {
      "name": "interactionsVisible",
      "value": true
    },
    {
      "name": "triviaPercentageEnabled",
      "value": true
    },
    {
      "name": "leaderboardVisible",
      "value": true
    },
    {
      "name": "highlightsVisible",
      "value": true
    },
    {
      "name": "userCountVisible",
      "value": true
    },
    {
      "name": "historyVisible",
      "value": true
    }
  ],
  "version": 6667,
  "deleted": false
}
```
