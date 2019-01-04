const protobuf = require("protobufjs/light");
const jsonDescriptor = require("./proto.json");

const console = require("../util/logger")

const _ = require("lodash");

const AnkamaPacket = require("./AnkamaPacket")

const encoderMessages = require("./encoderMessages");
const decoderMessages = require("./decoderMessages");

const root = protobuf.Root.fromJSON(jsonDescriptor);

function Connection(socket) {
	this.socket = socket;
}

Connection.prototype.send = function(messageName, payload) {	
	var Packet = root.lookupType(messageName);

	var errMsg = Packet.verify(payload);
	if (errMsg)
		throw Error(errMsg);
	
	var message = Packet.create(payload);
	var encodedMsg = Packet.encode(message).finish();

	var simpleName = this._getSimpleMessageName(messageName);
	console.debug(simpleName)

  var encodedAnkamaMsg = new AnkamaPacket().encode(encodedMsg, encoderMessages[simpleName]);

  this.socket.write(encodedAnkamaMsg);

  console.info(`[›] ${simpleName} (${encodedAnkamaMsg.length} bytes)`);
};

Connection.prototype._getSimpleMessageName = function(name) {
	if(!name.includes(".")) return name;
	var arr = name.split(".");
	return arr[arr.length - 1];
};

Connection.prototype.decode = function(packet) {
	try {
    if(decoderMessages[packet.protocolId] && decoderMessages[packet.protocolId][packet.messageId]) {
      var messageName = decoderMessages[packet.protocolId][packet.messageId];
      var decoded = root.lookupType(messageName).decode(packet.body);
      console.info(`[‹] ${messageName} (${packet.size + 4} bytes)`);
      return decoded;
    }
    else {
      console.error(`opcode not found ${packet.protocolId} ${packet.messageId}`);
      return "unimplemented";
    }
  }
  catch(e) {
    return null;
  }
};

module.exports = Connection;