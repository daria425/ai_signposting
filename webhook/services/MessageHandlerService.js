const {
  createNewFlow,
  getCurrentFlow,
  deleteFlowOnCompletion,
  deleteFlowOnErr,
  updateUserSelection,
  createUserDetailUpdate,
} = require("../helpers/firestore.helpers");
const { PostRequestService } = require("../services/PostRequestService");
const { api_base } = require("../config/api_base.config");
const { UserService } = require("../services/UserService");
const { firestore } = require("../config/firestore.config");

class MessageHandlerService {
  constructor(req, res) {
    this.postRequestService = new PostRequestService(api_base);
    this.userService = new UserService(req.app.locals.db);
    this.body = JSON.parse(JSON.stringify(req.body));
    this.waId = this.body.WaId;
    this.profileName = this.body.ProfileName;
    this.organizationNumber = this.body.To;
    this.seeMoreOptionMessages = ["See More Options", "That's great, thanks"];
    this.addUpdateMessages = ["Yes", "No thanks"];
    this.res = res;
  }

  isGreeting() {
    return this.body.Body.toLowerCase() === "hi";
  }

  isEditDetailsRequest() {
    return this.body.Body.toLowerCase().trim() === "edit details";
  }

  createMessageData(userData, flowName, flowStep) {
    return {
      userInfo: userData,
      message: this.body,
      flowName,
      flowStep,
    };
  }
  async startFlow(userData, flowName, flowStep, extraData = {}) {
    const messageData = this.createMessageData(userData, flowName, 1);
    await createNewFlow(firestore, messageData);
    const response = await this.postRequestService.make_request(
      `flows/${flowName}`
    );
  }
}
