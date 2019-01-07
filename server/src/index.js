const fs = require("fs");
const net = require("net");
const express = require('express');
const console = require("./util/logger");
const { hexToByteArray } = require("./util/byte");
const AnkamaPacket = require("./network/AnkamaPacket");
const Connection = require("./network/connection");

const SERVER_PORT = 8600;
const MATCH_SERVER_PORT = 8601;

var matchServer = net.createServer((socket) => {
  console.info("[MATCH_SERVER] Connection from: " + socket.remoteAddress + ":" + socket.remotePort);
  
  var connection = new Connection(socket);

  socket.on("data", (data) => {
    var ankamapacket = new AnkamaPacket();
    var bytesDecoded = ankamapacket.decode(data, 0, data.length);
    if(bytesDecoded >= 12) {

      var decoded = connection.decode(ankamapacket);

      if(decoded && decoded != "unimplemented") {
        if(ankamapacket.protocolId == 3) {
          switch(ankamapacket.messageId) {
            
            case 211:

              var payload = {
                "id": 0,
                "type": 4, // 4 = TUTORIAL
                "playerSide": 1, // 1 = LEFT
                "boardId": 14,
                "teams": [
                  {
                    "side": 1,
                    "playerInformation": {
                      "nickname": "OrangeNote",
                      "stats": {
                        "victories": 0,
                        "defeats": 0,
                        "surrenders": 0,
                        "consecutiveVictories": 0,
                        "consecutiveDefeats": 0,
                        "randomMatches": 0,
                        "friendlyMatches": 0,
                        "tournamentMatches": 0,
                        "meleeVictories": 0,
                        "meleeDefeats": 0,
                        "meleeSurrenders": 0,
                        "meleeMaxVictory": 0
                      },
                      "rating": {
                        "points": 50.0,
                        "maxPoints": 0.0,
                      },
                      "accountType": "PLAYER"
                    },
                    "figures": [
                      {
                        "id": 12,
                        "playerFigure": {
                          "id": 0,
                          "figureId": 12,
                          "pedestalId": 0,
                          "obtentionDate": 0,
                          "seenByPlayer": true,
                          "bound": true,
                        },
                        "externalId": 0
                      }
                    ]
                  },
                  {
                    "side": 2,
                    "playerInformation": {
                      "nickname": "OrangeNote",
                      "stats": {
                        "victories": 0,
                        "defeats": 0,
                        "surrenders": 0,
                        "consecutiveVictories": 0,
                        "consecutiveDefeats": 0,
                        "randomMatches": 0,
                        "friendlyMatches": 0,
                        "tournamentMatches": 0,
                        "meleeVictories": 0,
                        "meleeDefeats": 0,
                        "meleeSurrenders": 0,
                        "meleeMaxVictory": 0
                      },
                      "rating": {
                        "points": 0.0,
                        "maxPoints": 0.0,
                      },
                      "accountType": "PLAYER"
                    },
                  },
                ],
                "timeline": {
                  "playingFirst": 1,
                  "figuresInPlayOrder": [12]
                },
                "matchDefinitionId": 3,
              };

              connection.send("MatchInformationMessage", payload);

              break;
          }
        }
        else if(ankamapacket.protocolId == 109) {
          switch(ankamapacket.messageId) {
            
            case 2204:

              var payload = {
                "effectGroups": [
                  // {
                  //   "type": 25, // 25 = PHASE_CHANGE_GROUP
                  //   "effects": [
                  //     {
                  //       "type": 51, // 51 = PHASE_SKIPPED
                  //       "phaseChangeDetails": {
                  //         "duration": 1,
                  //         "phaseInfo": {
                  //           "phaseType": 2, // 4 = PLACEMENT
                  //           "turn": 0
                  //         }
                  //       }
                  //     }
                  //   ]
                  // },
                  {
                    "type": 69, // 69 = OBJECTIVE_EFFECT
                    "effects": [
                      {
                        "type": 48, // 48 = OBJECTIVES_UPDATE
                        "objectiveDetails": {
                          "id": 88,
                          "state": 3 // 3 = STARTED
                        }
                      }
                    ]
                  },
                  {
                    "type": 8, // 8 = PLACEMENT_START_GROUP
                    "effects": [
                      {
                        "type": 5, // 5 = POSITION_CHANGE
                        "positionChangeDetails": {
                          "figureId": 12,
                          "coordinates": [
                            {
                              x: 1,
                              y: 1
                            }
                          ]
                        }
                      }
                    ]
                  }
                ]
              };

              connection.send("EventMessage", payload)

              break;
          }
        }
      }
    }
  });

  socket.on("end", () => {
    console.info("[MATCH_SERVER] Client disconnected: " + socket.remoteAddress + ":" + socket.remotePort);
  });
});

matchServer.on('error', (err) => {
  throw err;
});

matchServer.listen(MATCH_SERVER_PORT, () => {
  console.info(`[MATCH_SERVER] Match server started on port ${MATCH_SERVER_PORT}`);
});

var server = net.createServer((socket) => {
  console.info("[SERVER] Connection from: " + socket.remoteAddress + ":" + socket.remotePort);
  
  var connection = new Connection(socket);

  connection.send("LoginChallengeMessage", { nonce: "0" });

  socket.on("data", (data) => {
    var ankamapacket = new AnkamaPacket();
    var bytesDecoded = ankamapacket.decode(data, 0, data.length);
    if(bytesDecoded >= 12) {

      var decoded = connection.decode(ankamapacket);

      if(decoded && decoded != "unimplemented") {

        if(ankamapacket.protocolId == 1) {

        }
        else if(ankamapacket.protocolId == 2) {
          switch(ankamapacket.messageId) {

            case 201:
              var payload = {
                "accountInformation": {
                  accountId: 0,
                  username: "OrangeNote",
                  nickname: "0rangeNote",
                  lang: "EN",
                  community: 0,
                  administrator: false, // true = enables in game console
                  moderator: false,
                  accountType: "DEFAULT"
                },
                "preferences": {
                  language: "EN",
                  audioEnabled: false,
                  musicEnabled: false,
                  fxEnabled: false,
                  musicVolume: 0,
                  fxVolume: 0
                }
              };

              connection.send("AccountInformationMessage", payload);

              var payload = {
                "gameData": {
                  "ladder" : {
                    "leagues": [
                      {
                        "leagueId": 0,
                        "minPoint": 0,
                        "maxPoint": 100,
                        "leagueType": 1, // 1 = GRANITE
                        "leagueSeasonReward": 0,
                        "lifeTimeRewards": 0
                      },
                    ]
                  },
                  "krozRewards" : {},
                  "boards": [
                    {
                      "id": 14,
                      "size": 6,
                      "isSceneLevelSpecified": true,
                      "sceneLevelName": "Level14"
                    }
                  ],
                  "matchDefinitions": [
                    {
                      "id": 1, // 1 = ? DUMMY
                      "playableFiguresType": [],
                      "teamCompositionContraintsId": 0,
                      "rulesDataId": 0, // need this
                      "matchType": 4,
                      "victoryType": 2
                    },
                    {
                      "id": 3, // 3 = INCARNAM (TUTO)
                      "playableFiguresType": [12],
                      "teamCompositionContraintsId": 0, // references .teamCompositionConstraints[0]
                      "rulesDataId": 0,
                      "matchType": 4, // 4 = TUTORIAL,
                      "victoryType": 2 // 1 = GG, 2 = OBJECTIVE
                    },
                    {
                      "id": 4, // 3 = INCARNAM (TUTO)
                      "teamCompositionContraintsId": 0,
                      "rulesDataId": 0,
                      "matchType": 4, // 4 = TUTORIAL,
                      "victoryType": 2 // 1 = GG, 2 = OBJECTIVE
                    },
                    {
                      "id": 5, // 3 = INCARNAM (TUTO)
                      "teamCompositionContraintsId": 0,
                      "rulesDataId": 0,
                      "matchType": 4, // 4 = TUTORIAL,
                      "victoryType": 2 // 1 = GG, 2 = OBJECTIVE
                    },
                    {
                      "id": 7, // 3 = INCARNAM (TUTO)
                      "teamCompositionContraintsId": 0,
                      "rulesDataId": 0,
                      "matchType": 4, // 4 = TUTORIAL,
                      "victoryType": 2 // 1 = GG, 2 = OBJECTIVE
                    },
                    {
                      "id": 27, // 3 = INCARNAM (TUTO)
                      "teamCompositionContraintsId": 0,
                      "rulesDataId": 0,
                      "matchType": 4, // 4 = TUTORIAL,
                      "victoryType": 2 // 1 = GG, 2 = OBJECTIVE
                    },
                    {
                      "id": 15, // 15 = ASTRUB
                      "playableFiguresType": [],
                      "teamCompositionContraintsId": 1, // references .teamCompositionConstraints[1]
                      "rulesDataId": 0,
                      "matchType": 5, // 5 = MATCH_PVE,
                      "victoryType": 2 // 1 = GG, 2 = OBJECTIVE
                    },
                    {
                      "id": 16, // 15 = ASTRUB
                      "teamCompositionContraintsId": 0, // references .teamCompositionConstraints[0]
                      "rulesDataId": 0,
                      "matchType": 5, // 5 = MATCH_PVE,
                      "victoryType": 2 // 1 = GG, 2 = OBJECTIVE
                    },
                    {
                      "id": 17, // 15 = ASTRUB
                      "teamCompositionContraintsId": 0, // references .teamCompositionConstraints[0]
                      "rulesDataId": 0,
                      "matchType": 5, // 5 = MATCH_PVE,
                      "victoryType": 2 // 1 = GG, 2 = OBJECTIVE
                    },
                    {
                      "id": 18, // 15 = ASTRUB
                      "teamCompositionContraintsId": 0, // references .teamCompositionConstraints[0]
                      "rulesDataId": 0,
                      "matchType": 5, // 5 = MATCH_PVE,
                      "victoryType": 2 // 1 = GG, 2 = OBJECTIVE
                    },
                    {
                      "id": 19, // 15 = ASTRUB
                      "teamCompositionContraintsId": 0, // references .teamCompositionConstraints[0]
                      "rulesDataId": 0,
                      "matchType": 5, // 5 = MATCH_PVE,
                      "victoryType": 2 // 1 = GG, 2 = OBJECTIVE
                    },
                    {
                      "id": 20, // 15 = ASTRUB
                      "teamCompositionContraintsId": 0, // references .teamCompositionConstraints[0]
                      "rulesDataId": 0,
                      "matchType": 5, // 5 = MATCH_PVE,
                      "victoryType": 2 // 1 = GG, 2 = OBJECTIVE
                    },
                  ],
                  "teamCompositionConstraints": [
                    {
                      "minTeamSize": 1,
                      "maxTeamSize": 1,
                      "maxTotalLevel": 3,
                      "maxSameFigureOccurrences": 1,
                      "maxSameChampionOccurrences": 1,
                      "maxSameMediocreOccurrences": 1,
                      "id": 0
                    },
                    {
                      "minTeamSize": 2,
                      "maxTeamSize": 2,
                      "maxTotalLevel": 3,
                      "maxSameFigureOccurrences": 1,
                      "maxSameChampionOccurrences": 1,
                      "maxSameMediocreOccurrences": 1,
                      "id": 1
                    }
                  ],
                  "rules": [
                    {
                      "initialGgCount": 0,
                      "purchaseGgActionPointCost": 0,
                      "purchaseGgKamaCost": 0,
                      "pickUpKamaActionPointCost": 0,
                      "strainDieSpecializationDuration": 0,
                      "crateRangeBonus": 0,
                      "tournamentSubscriptionCooldown": 0,
                      "krozForTournamentGainRate": 0,
                      "krozForMaxRatingGainRate": 0,
                      "krozForConsecutiveVictoriesGainRate": 0,
                      "demonicRewardStackCount": 0,
                      "purchaseDemonicRewardActionPointCost": 0,
                      "purchaseDemonicRewardKamaCost": [
                        {
                          "rank": 1, // 1 = GRANITE_REWARD,
                          "kamaCost": 0,
                          "crafterKamaReduction": 0
                        },
                        {
                          "rank": 2, // 1 = GRANITE_REWARD,
                          "kamaCost": 0,
                          "crafterKamaReduction": 0
                        },
                        {
                          "rank": 3, // 1 = GRANITE_REWARD,
                          "kamaCost": 0,
                          "crafterKamaReduction": 0
                        },
                        {
                          "rank": 4, // 1 = GRANITE_REWARD,
                          "kamaCost": 0,
                          "crafterKamaReduction": 0
                        }
                      ],
                      "demonicRewardAttributionDuration": 0,
                      "id": 0,
                      "strainDieOneUnallocatedDieKamaEarn": 0,
                      "strainDieTwoUnallocatedDieKamaEarn": 0,
                      "crafterPareduction": 0
                    }
                  ]
                },
                "figureGameData": {
                  "spellData": [
                    {
                      "id": {
                        "catalogSpellId": 40
                      },
                      "figureSpell": true
                    },
                    {
                      "id": {
                        "catalogSpellId": 41
                      },
                      "figureSpell": true
                    },
                    {
                      "id": {
                        "catalogSpellId": 10065
                      },
                      "figureSpell": true
                    }
                  ],
                  "abilityData": [
                    {
                      "id": 49 // 49 = CRAFTER_ABILITY
                    },
                    {
                      "id": 4 // 4 = ARMOR_ABILITY
                    },
                  ],
                  "additionnalSpells": [
                    {
                      "id": 10065, // 10065 = PUNCH_SPELL
                      "rangeType": 2, // 2 = MELEE
                      "modifiableRange": false,
                      "usageType": 1 // 1 = UNLIMITED
                    }
                  ]
                }
              };

              connection.send("GameDataWithFigureGameDataMessage", payload);

              var payload = {
                "playerfigureSuccess": {
                  "figureSuccess": [
                    {
                      matchDefinition: 3, // so we can skip tutorial and jump straight to the home screen
                      figureType: 0
                    },
                    {
                      matchDefinition: 4, // so we can skip tutorial and jump straight to the home screen
                      figureType: 0
                    },
                    {
                      matchDefinition: 5, // so we can skip tutorial and jump straight to the home screen
                      figureType: 0
                    },
                    {
                      matchDefinition: 7, // so we can skip tutorial and jump straight to the home screen
                      figureType: 0
                    },
                    {
                      matchDefinition: 27, // so we can skip tutorial and jump straight to the home screen
                      figureType: 0
                    },
                  ]
                }
              };

              connection.send("UpdateFigureSuccessMessage", payload);

              var payload = {
                "teams": [
                  {
                    id: 0,
                    name: "0",
                    playerFigure: [],
                    isHuman: false,
                    accountId: 0
                  }
                ]
              };

              connection.send("ArenaTeamInformationMessage", payload);

              break;
          }
        }
        else if(ankamapacket.protocolId == 109) {
          switch(ankamapacket.messageId) {
            
            case 2100:

              var payload = {
                "slaveAddress": {
                  "host": "192.168.1.111",
                  "port": 8601
                },
                "token": "00112233445566778899aabbccddeeff",
                "slaveType": 2 // 2 = MATCH
              };

              connection.send("LoginReferralMessage", payload);

            break;
          }
        }
      }
    }
  });

  socket.on("end", () => {
    console.info("[SERVER] Client disconnected: " + socket.remoteAddress + ":" + socket.remotePort);
  });
});

server.on('error', (err) => {
  throw err;
});

server.listen(SERVER_PORT, () => {
  console.info(`[SERVER] Krosbox server started on port ${SERVER_PORT}`);
});

const app = express();
const KBAPI_PORT = 8080;

app.use(express.urlencoded({ extended: true }));

app.get('*', (req, res) => console.error("[KBAPI] GET - unimplemented"));

app.post(/\/CreateTokenWithPassword$/, (req, res) => {
  console.info(`[KBAPI] /CreateTokenWithPassword`);
  console.info(`[KBAPI] login: ${req.body.login}`);

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ token: "00112233445566778899aabbccddeeff" })); // dummy token
});

app.post('*', (req, res) => console.error("[KBAPI] POST - unimplemented"));

app.listen(KBAPI_PORT, () => console.info(`[KBAPI] Auth server started on port ${KBAPI_PORT}`));
