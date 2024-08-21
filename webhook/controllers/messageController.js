const { MessageHandlerService } = require("../services/MessageHandlerService");
const { firestore } = require("../config/firestore.config");
async function handleMessage(req, res, next) {
  const messageHandler = new MessageHandlerService(req, res, firestore);
  await messageHandler.handle();
}
module.exports = {
  handleMessage,
};
