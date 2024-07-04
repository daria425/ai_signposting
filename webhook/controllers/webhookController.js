const { createNewFlow } = require("../helpers/firestore.helpers");
const apiBase = process.env.API_BASE;
const axios = require("axios");
const { getUser } = require("../helpers/database.helpers");
const { firestore } = require("../config/firestore.config");
async function handleMessage(req, res, next) {
  const mongoClient = req.app.locals.mongoClient;
  try {
    const body = JSON.parse(JSON.stringify(req.body));
    console.log("recieved message", body);
    const waId = body.WaId;
    const profileName = body.ProfileName;
    const registeredUser = await getUser(mongoClient, waId);
    const userData = registeredUser || {
      "WaId": waId,
      "ProfileName": profileName,
    };
    if (!registeredUser) {
      //first check, any message where the user is not registered gets forwarded to the onboarding flow
      const flowStep = 1;
      const flowData = {
        userInfo: userData,
        flow: "onboarding",
        flowStep,
      };
      const messageData = {
        userInfo: userData,
        message: body,
        flowStep,
      };
      //await saveUser(userData)
      await createNewFlow(firestore, flowData); //save the initialization of the flow to a temp db
      const response = await axios({
        headers: {
          "Content-Type": "application/json",
        },
        method: "post",
        url: `${apiBase}flows/onboarding`,
        data: messageData,
      });
      res.status(200).send(response.data);
    } else {
      //check if a an active flow exists
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred", err);
  }
}

module.exports = {
  handleMessage,
};
