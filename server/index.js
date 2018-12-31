const net = require('net');
const fs = require('fs');

function hexToByteArray(str) {
  if (!str) {
    return new Uint8Array();
  }
  str = "" + str;
  str = str.replace(/ #.+|\s+/g, "");
  var a = [];
  for (var i = 0, len = str.length; i < len; i+=2) {
    a.push(parseInt(str.substr(i,2),16));
  }
  
  return new Uint8Array(a);
}

function bufferToHexString(data) {
  var dataView = new DataView(data.buffer);
  var byteBuffer = new Uint8Array(data);

  var frameLength = dataView.getInt32(0);

  if(frameLength + 4 !== byteBuffer.length)
  {
    console.log("malformed message from client:");
  }
  else
  {
    var protocolId = hex(dataView.getInt32(4));
    var messageId = hex(dataView.getInt32(8));
    console.log(`< frameLength: ${frameLength}, protocolId: ${protocolId}, messageId: ${messageId}`);
  }
  return Array.from(byteBuffer).slice(12).map(n => hex(n)).join(" ");
}

function hex(obj) {
  var num = obj.toString(16);
  if (num.length % 2) {
    num = '0' + num;
  }
  return num.toUpperCase();
}

const LoginChallengeMessage = `0000000B 00000002 00000067
  0A 01 30 # "0"`;
const AccountInformationMessage = `00000055 0000006D 000003E8
0A 2D
  08 00
  12 0A 4F 72 61 6E 67 65 4E 6F 74 65 # "OrangeNote"
  1A 0A 30 72 61 6E 67 65 4E 6F 74 65 # "0rangeNote"
  22 02 45 4E # "EN"
  28 00
  30 01
  38 00
  42 07 44 45 46 41 55 4C 54 # "DEFAULT"
12 1C
  0A 02 45 4E # "EN"
  10 00
  18 00
  20 00
  29 00 00 00 00 00 00 00 00
  31 00 00 00 00 00 00 00 00`;
// const GameDataWithFigureGameDataMessage = "000007AE 0000006D 000003ED" + fs.readFileSync("./dummy-messages/GameDataWithFigureGameDataMessage.txt", "utf8");
const GameDataWithFigureGameDataMessage = "0000002B 0000006D 000003ED" + fs.readFileSync("./dummy-messages/GameDataWithFigureGameDataMessage2.txt", "utf8");

// const ArenaTeamInformationMessage = "00000015 0000006D 0000047E" + fs.readFileSync("./dummy-messages/ArenaTeamInformationMessage.txt", "utf8");
const ArenaTeamInformationMessage = "00000013 0000006D 0000047E 0A 09 08 00 12 01 30 20 00 28 00";

const UpdateFigureSuccessMessage = "00000010 0000006D 00000480" + fs.readFileSync("./dummy-messages/UpdateFigureSuccessMessage.txt", "utf8");

const server = net.createServer((c) => {
  
  console.log('client connected');
  
  c.on('end', () => {
    console.log('client disconnected');
  });
  
  c.on('data', (data) => {
    console.log(bufferToHexString(data));
    c.write(hexToByteArray(AccountInformationMessage));
	  c.write(hexToByteArray(GameDataWithFigureGameDataMessage));
    c.write(hexToByteArray(UpdateFigureSuccessMessage));
    c.write(hexToByteArray(ArenaTeamInformationMessage));
  });

  c.write(hexToByteArray(LoginChallengeMessage), undefined, () => {
    console.log("> LoginChallengeMessage")
    console.log(LoginChallengeMessage)
  });
});

server.on('error', (err) => {
  throw err;
});

server.listen(8600, () => {
  console.log('server bound to port 8600');
});