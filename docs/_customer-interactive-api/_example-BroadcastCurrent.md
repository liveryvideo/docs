```json
{
  "chat": [
    {
      "messageId": "__8ACq1fjhZZcwKrSF0AAA==",
      "senderUserId": "____5XCnMZVu8ZvGxssAAA==",
      "senderName": "123456",
      "message": "hello!"
    }
  ],
  "broadcast": {
    "broadcastId": "__8ACqCEN-YR-_vqFBAAAA==",
    "tenantId": "____48UvbgcnNAxn-7EAAA==",
    "name": "Test broadcast",
    "phase": "LIVE",
    "creationDate": 1727273305733,
    "latestLiveDate": 1727273310554,
    "closeDate": 0,
    "lastAnonymizeActionDate": 0,
    "lastStatsUpdateSent": 1727276640459,
    "hideExtension": false,
    "archived": false,
    "interactionDetails": [
      {
        "interactionId": "__8ACqdAN-YUKPvqFBAAAA==",
        "type": "prediction",
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
          "OPEN": 1727276367719,
          "PENDING": 1727276621566,
          "RESULTS": 1727276637803
        },
        "serverPhase": "RESULTS",
        "nextServerPhase": "CLOSED",
        "clientPhase": "RESULTS",
        "clientPhaseDurationInSeconds": 0.0,
        "clientPhaseEnd": 1727276637803,
        "flags": [
          "ANSWER_PROCESSING_STARTED"
        ]
      }
    ],
    "instanceIdToConcurrencyData": {
      "i-04e12184ce2f34004-CONSUMER": {
        "count": 0,
        "date": 1727276640448
      },
      "i-02786d6ad0884978a-WEB": {
        "count": 0,
        "date": 1727276640519
      },
      "i-04e12184ce2f34004-WEB": {
        "count": 0,
        "date": 1727276640442
      },
      "i-02786d6ad0884978a-CONSUMER": {
        "count": 0,
        "date": 1727276640454
      }
    },
    "smsLimit": 0,
    "smsCount": 0,
    "currentConcurrency": 0,
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
    "version": 369,
    "deleted": false
  },
  "interactions": [
    {
      "interactionId": "__8ACqdAN-YUKPvqFBAAAA==",
      "version": 498,
      "broadcastId": "__8ACqCEN-YR-_vqFBAAAA==",
      "type": "PREDICTION",
      "text": "Will it rain tomorrow in New York City?",
      "phase": "RESULTS",
      "phaseDuration": 0.0,
      "answers": [
        {
          "code": "1",
          "text": "Yes, it will rain.",
          "percentage": 100.0,
          "correct": false
        },
        {
          "code": "2",
          "text": "No, it will not rain.",
          "percentage": 0.0,
          "correct": false
        }
      ],
      "answerType": "TEXT",
      "layoutType": "ROW",
      "hideText": true,
      "forceToForeground": false,
      "maxScore": 50,
      "phaseTimes": {
        "server": {
          "OPEN": 1727276367719,
          "PENDING": 1727276621566,
          "RESULTS": 1727276637803
        },
        "client": {
          "OPEN": 1727276367719,
          "PENDING": 1727276621566,
          "RESULTS": 1727276637803
        },
        "duration": {
          "OPEN": 0.0,
          "PENDING": 0.0,
          "RESULTS": 0.0
        }
      }
    }
  ]
}
```