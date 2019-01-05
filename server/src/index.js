const fs = require("fs");
const net = require("net");
const express = require('express');
const console = require("./util/logger");
const { hexToByteArray } = require("./util/byte");
const AnkamaPacket = require("./network/AnkamaPacket");
const Connection = require("./network/connection");

const SERVER_PORT = 8600;

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
                  administrator: true, // enables in game console
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
                  "ladder" : {},
                  "krozRewards" : {},
                  "matchDefinitions": [
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
                  ]
                },
                "figureGameData": {}
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
