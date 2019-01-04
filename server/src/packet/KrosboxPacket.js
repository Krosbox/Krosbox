const _ = require("lodash");

const protobuf = require("protobufjs/minimal");
const Krosbox = require("./proto.js").krosbox;

const console = require("../util/logger")

const ArenaMessageList = require("../message/ArenaMessageList");
const CollectionMessageList = require("../message/CollectionMessageList");
const FrameworkMessageList = require("../message/FrameworkMessageList");

var decoders = _.merge(ArenaMessageList.messagesOut, CollectionMessageList.messagesOut, FrameworkMessageList.messagesOut);

Krosbox.decode = function(packet) {
  try {
    if(decoders[packet.protocolId] && decoders[packet.protocolId][packet.messageId]) {
      var messageName = decoders[packet.protocolId][packet.messageId];
      var decoded = (Krosbox[messageName] || Krosbox.data[messageName] || Krosbox.collection[messageName] || Krosbox.common[messageName]).decode(packet.body);
      console.info(`[‹] ${messageName} (${packet.size + 4} bytes)`)
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
}

module.exports = Krosbox;