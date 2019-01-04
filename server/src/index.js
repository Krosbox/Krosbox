const fs = require("fs");
const net = require("net");
const express = require('express');
const console = require("./util/logger");
const { hexToByteArray } = require("./util/byte");
const AnkamaPacket = require("./packet/AnkamaPacket");
const KrosboxPacket = require("./packet/KrosboxPacket");

const SERVER_PORT = 8600;

var server = net.createServer((socket) => {
  console.info("[SERVER] Connection from: " + socket.remoteAddress + ":" + socket.remotePort);
  
  socket.write(hexToByteArray("0000000B 00000002 00000067 0A0130"), undefined, () => {
    console.info("[›] LoginChallengeMessage")
  });

  socket.on("data", (data) => {
    var ankamapacket = new AnkamaPacket();
    var bytesDecoded = ankamapacket.decode(data, 0, data.length);
    if(bytesDecoded >= 12) {
      var decoded = KrosboxPacket.decode(ankamapacket);
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

              var err = KrosboxPacket.AccountInformationMessage.verify(payload);
              if(err) throw Error(err);

              var msg  = KrosboxPacket.AccountInformationMessage.create(payload);
              var encodedmsg = KrosboxPacket.AccountInformationMessage.encode(msg).finish();

              var ankamaMsg = new AnkamaPacket();
              var encodedAnkamaMsg = ankamaMsg.encode(encodedmsg, 109, 1000);

              console.info(`[›] AccountInformationMessage (${encodedAnkamaMsg.length} bytes)`);
              socket.write(encodedAnkamaMsg);

              var payload = {
                "gameData": {
                  "ladder" : {},
                  "krozRewards" : {}
                },
                "figureGameData": {}
              };

              var err = KrosboxPacket.GameDataWithFigureGameDataMessage.verify(payload);
              if(err) throw Error(err);

              var msg  = KrosboxPacket.GameDataWithFigureGameDataMessage.create(payload);
              var encodedmsg = KrosboxPacket.GameDataWithFigureGameDataMessage.encode(msg).finish();

              var ankamaMsg = new AnkamaPacket();
              var encodedAnkamaMsg = ankamaMsg.encode(encodedmsg, 109, 1005);

              console.info(`[›] GameDataWithFigureGameDataMessage (${encodedAnkamaMsg.length} bytes)`);
              socket.write(encodedAnkamaMsg);

              var payload = {
                "playerfigureSuccess": {
                  "figureSuccess": [
                    {
                      matchDefinition: 27, // so we can skip tutorial and jump straight to the home screen
                      figureType: 0
                    }
                  ]
                }
              };

              var err = KrosboxPacket.UpdateFigureSuccessMessage.verify(payload);
              if(err) throw Error(err);

              var msg  = KrosboxPacket.UpdateFigureSuccessMessage.create(payload);
              var encodedmsg = KrosboxPacket.UpdateFigureSuccessMessage.encode(msg).finish();

              var ankamaMsg = new AnkamaPacket();
              var encodedAnkamaMsg = ankamaMsg.encode(encodedmsg, 109, 1152);

              console.info(`[›] UpdateFigureSuccessMessage (${encodedAnkamaMsg.length} bytes)`);
              socket.write(encodedAnkamaMsg);

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

              var err = KrosboxPacket.ArenaTeamInformationMessage.verify(payload);
              if(err) throw Error(err);

              var msg  = KrosboxPacket.ArenaTeamInformationMessage.create(payload);
              var encodedmsg = KrosboxPacket.ArenaTeamInformationMessage.encode(msg).finish();

              var ankamaMsg = new AnkamaPacket();
              var encodedAnkamaMsg = ankamaMsg.encode(encodedmsg, 109, 1150);

              console.info(`[›] ArenaTeamInformationMessage (${encodedAnkamaMsg.length} bytes)`);
              socket.write(encodedAnkamaMsg);

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
