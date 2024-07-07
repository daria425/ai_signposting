const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const axios = require("axios");
const { convertTemplateName } = require("./format.helpers");
async function listTemplates() {
  const auth = {
    username: accountSid,
    password: authToken,
  };

  const response = await axios.get("https://content.twilio.com/v1/Content", {
    auth,
  });
  return response.data;
}

async function findTemplateSid(templateName, convertTemplate = true) {
  try {
    const templates = await listTemplates();
    const foundTemplate = templates.contents.find((template) =>
      convertTemplate
        ? template.friendly_name === convertTemplateName(templateName)
        : template.friendly_name === templateName
    );
    if (foundTemplate) {
      return foundTemplate.sid;
    } else {
      throw new Error("Template not found");
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

module.exports = {
  findTemplateSid,
};
