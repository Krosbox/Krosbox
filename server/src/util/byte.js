function hex(obj) {
  var num = obj.toString(16);
  if (num.length % 2) {
    num = '0' + num;
  }
  return num.toUpperCase();
}

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

function bytesToString(bytes) {
	return Array.from(bytes).map(b => hex(b)).join(" ");
}

module.exports = { hex, hexToByteArray, bytesToString };