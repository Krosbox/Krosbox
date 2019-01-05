const console = require("../util/logger");
const { bytesToString } = require("../util/byte");

class AnkamaPacket {
  constructor() {
    this.size;
    this.protocolId;
    this.messageId;
    this.body;
  }

  decode(bytes, offset, available) {
    // console.debug(`[‹] ${bytesToString(bytes)}`)
    var num = 0;

    if(available < 4) {
      return num;
    }

    this.size = bytes.readUInt32BE(offset);

    available -= 4;
    num += 4;
    offset += 4;

    if(available < 4) {
      return num;
    }

    this.protocolId = bytes.readUInt32BE(offset);

    available -= 4;
    num += 4;
    offset += 4;

    if(available < 4) {
      return num;
    }

    this.messageId = bytes.readUInt32BE(offset);

    available -= 4;
    num += 4;
    offset += 4;

    if(available < this.size - 8) {
      return num;
    }

    var sliceoff = offset + this.size - 8;

    this.body = bytes.slice(offset, sliceoff);

    return num + this.size - 8;
  }

  encode(message, opcode) {
    var size = message.length + 12;
    var offset = 0;

    var buffer = Buffer.alloc(size);
    
    buffer.writeUInt32BE(size - 4, offset);
    buffer.writeUInt32BE(opcode.protocolId, offset + 4);
    buffer.writeUInt32BE(opcode.messageId, offset + 8);

    message.copy(buffer, 12);

    // console.debug(`[›] ${bytesToString(buffer)}`)
    return buffer;
  }
}

module.exports = AnkamaPacket;
