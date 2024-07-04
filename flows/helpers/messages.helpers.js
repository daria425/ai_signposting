const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
const createTextMessage = (waId, textContent) => {
  const message = {
    from: messagingServiceSid,
    body: textContent,
    to: `whatsapp:+${waId}`,
  };
  return message;
};

const createTemplateMessage = (waId, contentSid, templateVariables) => {
  const message = {
    from: messagingServiceSid,
    contentSid: contentSid,
    contentVariables: JSON.stringify(templateVariables),
    to: `whatsapp:+${waId}`,
    // messagingServiceSid: messagingServiceSid,
  };
  return message;
};
module.exports = {
  createTextMessage,
  createTemplateMessage,
};
