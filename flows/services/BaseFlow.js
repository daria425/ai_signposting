const {
  createTextMessage,
  createTemplateMessage,
} = require("../helpers/messages.helpers");
const { sendMessage } = require("../helpers/twilio.helpers");
const { findTemplateSid } = require("../helpers/twilio_account.helpers");

/**
 * BaseFlow class handles flow-specific interactions, message creation, and contact updates.
 */
class BaseFlow {
  /**
   * Initializes a new instance of the BaseFlow class.
   * @constructor
   * @param {Object} params - Parameters to initialize the flow.
   * @param {Object} params.userInfo - Contact information including WaId.
   * @param {Object} [params.userMessage={}] - Message content and metadata.
   * @param {Object} params.contactModel - Model for interacting with contact data and database.
   * @param {string} params.organizationPhoneNumber - Phone number for the organization.
   * @param {string} params.organizationMessagingServiceSid - Messaging Service SID.
   */
  constructor({
    userInfo,
    userMessage = {},
    contactModel,
    organizationPhoneNumber,
    organizationMessagingServiceSid,
  }) {
    this.userInfo = userInfo;
    this.WaId = userInfo.WaId;
    this.userMessage = userMessage;
    this.messageContent = userMessage?.Body;
    this.buttonPayload = userMessage?.ButtonPayload ?? "-";
    this.listId = userMessage?.ListId;
    this.contactModel = contactModel;
    this.organizationPhoneNumber = organizationPhoneNumber;
    this.messagingServiceSid = organizationMessagingServiceSid;
    this.trackedFlowId = userMessage.trackedFlowId;
    this.clientSideTriggered = userMessage.clientSideTriggered;
  }

  /**
   * Updates user information using the contact model.
   * @async
   * @param {Object} updateData - Data to update for the user.
   * @returns {Promise<void>}
   */
  async updateUser(updateData) {
    await this.contactModel.updateContact(this.WaId, updateData);
  }

  /**
   * Creates an error message to send to the user.
   * @async
   * @param {string} recipient - The user WaId.
   * @returns {Promise<Object>} The created error message.
   */
  async createErrorMessage(recipient) {
    const text =
      "An unexpected error occurred, please text 'hi' to search again";
    const message = createTextMessage({
      waId: recipient,
      textContent: text,
      messagingServiceSid: this.messagingServiceSid,
    });
    return message;
  }
  /**
   * Saves a response message (outbound message sent as response to a user) to the database.
   * @async
   * @param {Object} params - Parameters for saving the message.
   * @param {Object} params.message - Message content to save.
   * @param {string} params.flowName - Name of the flow.
   * @param {string} [params.templateName] - Optional template name.
   * @returns {Promise<string>} The inserted message ID.
   */
  async saveResponseMessage({ message, flowName, templateName }) {
    //OUTBOUND MESSAGE
    const messageToSave = {
      clientSideTriggered: this.clientSideTriggered,
      trackedFlowId: this.trackedFlowId,
      Body: message?.body ?? null,
      To: `whatsapp:+${this.WaId}`,
      From: message.from,
      Direction: "outbound",
      Flow: flowName,
      ContentSID: message?.contentSid ?? null,
      ContentVariables: message?.contentVariables ?? null,
      CreatedAt: new Date(),
      Status: "sent",
      SearchableTemplateName: templateName ?? null,
    };
    const insertedId = await this.contactModel.saveContactMessage(
      this.WaId,
      messageToSave
    );
    return insertedId;
  }
  /**
   * Adds the message SID (returned from Twilio in the `sendMessage` function) to the information stored about messages that have been sent out.
   * @async
   * @param {string} messageId - The message ID to update.
   * @param {string} sid - The Twilio SID.
   * @returns {Promise<void>}
   */
  async updateResponse(messageId, sid) {
    await this.contactModel.addMessageSid(messageId, sid);
  }

  /**
   * Saves and sends a text message to the user.
   * @async
   * @param {Object} message - The message content to send.
   * @param {string} flowName - The name of the flow.
   * @returns {Promise<void>}
   * @see {@link sendMessage}
   */
  async saveAndSendTextMessage(message, flowName) {
    const insertedId = await this.saveResponseMessage({ message, flowName });
    const sid = await sendMessage(message);
    await this.updateResponse(insertedId, sid);
  }

  /**
   * Saves and sends a template message to the user.
   * @async
   * @param {Object} params - Parameters for sending the template message.
   * @param {string} params.templateKey - Key to retrieve the template SID.
   * @param {Object} params.templateVariables - Variables for the template.
   * @returns {Promise<void>}
   */
  async saveAndSendTemplateMessage({ templateKey, templateVariables }) {
    /**
     * utility function to find a template SID (unique ID) & name within the templates listed for an account using the Twilio API
     * @see {@link findTemplateSid}
     */
    const { templateSid, templateName } = await findTemplateSid(
      templateKey,
      false
    );
    const templateMessage = createTemplateMessage({
      waId: this.WaId,
      contentSid: templateSid,
      templateVariables,
      messagingServiceSid: this.messagingServiceSid,
    });
    const insertedId = await this.saveResponseMessage({
      message: templateMessage,
      flowName: this.constructor.FLOW_NAME,
      templateName,
    });
    const sid = await sendMessage(templateMessage);
    await this.updateResponse(insertedId, sid);
  }
}

class SurveyBaseFlow extends BaseFlow {
  constructor({
    userInfo,
    userMessage,
    contactModel,
    organizationPhoneNumber,
    organizationMessagingServiceSid,
  }) {
    super({
      userInfo,
      userMessage,
      contactModel,
      organizationPhoneNumber,
      organizationMessagingServiceSid,
    });
  }
  createCancellationMessage(recipient) {
    const text = "No worries!";
    const message = createTextMessage({
      waId: recipient,
      textContent: text,
      messagingServiceSid: this.messagingServiceSid,
    });
    return message;
  }
}
module.exports = {
  BaseFlow,
  SurveyBaseFlow,
};
