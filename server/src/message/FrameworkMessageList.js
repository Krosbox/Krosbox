const FrameworkMessageList = {
  messagesIn: {
    "1": {
      "100": "ErrorMessage",
      "101": "LoginErrorMessage",
      "102": "KeepAliveConnectionMessage"
    },
    "2": {
      "104": "VersionMessage",
      "103": "LoginChallengeMessage",
      "105": "ChooseNicknameRequestMessage",
      "106": "NicknameSelectionErrorMessage",
      "107": "NicknameSelectionTranslatedErrorMessage",
      "110": "LoginReferralMessage",
      "112": "ServerMessageInfo",
      "113": "ValidateGuestResponse",
      "114": "ValidateGuestInitResponse"
    }
  },
  messagesOut: {
    "2": {
      "200": "LoginRequestMessage",
      "201": "CrossGameLoginMessage",
      "205": "NicknameSelectionMessage",
      "206": "ValidateGuestRequest",
      "207": "ValidateGuestInitRequest"
    },
    "3": {
      "211": "ReferredSlaveLoginMessage"
    }
  }
};

module.exports = FrameworkMessageList;
