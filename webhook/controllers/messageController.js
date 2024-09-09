const { MessageHandlerService } = require("../services/MessageHandlerService");
const { firestore } = require("../config/firestore.config");
async function handleMessage(req, res, next) {
  try {
    console.log(req.body);
    const messageHandler = new MessageHandlerService(
      req,
      res,
      req.body.To,
      firestore
    );
    await messageHandler.handle();
  } catch (err) {
    next(err);
  }
}
module.exports = {
  handleMessage,
};
