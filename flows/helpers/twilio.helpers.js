const { client } = require("../config/twilio.config");

const sendMessage = async (messageContent) => {
  await client.messages.create(messageContent);
};

module.exports = {
  sendMessage,
};
