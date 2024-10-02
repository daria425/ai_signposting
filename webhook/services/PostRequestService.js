const axios = require("axios");

class PostRequestService {
  constructor(flow_api_base, transcription_api_base) {
    this.flow_api_base = flow_api_base;
    this.transcription_api_base = transcription_api_base;
  }
  async make_request(urlPath, data) {
    const response = await axios({
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      url: `${this.flow_api_base}${urlPath}`,
      data: data,
    });
    return response;
  }
  async send_transcription_data(urlPath, data) {
    const response = await axios({
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      url: `${this.transcription_api_base}${urlPath}`,
      data: data,
    });
    return response;
  }
}

module.exports = {
  PostRequestService,
};
