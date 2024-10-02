let flow_api_base = process.env.API_BASE;
let transcription_api_base = process.env.TRANSCRIPTION_API_BASE;
if (process.env.NODE_ENV === "development") {
  flow_api_base = "http://localhost:8080/";
  transcription_api_base = "http://127.0.0.1:8000/";
}
module.exports = { flow_api_base, transcription_api_base };
