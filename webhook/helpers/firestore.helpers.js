const { v4: uuidv4 } = require("uuid");

async function createNewFlow(db, flowData) {
  const flowId = uuidv4();
  const startTime = new Date().toISOString();
  const { flow, userInfo } = flowData;
  const userId = userInfo.WaId;
  const data = {
    startTime,
    flow,
    userId,
  };
  await db.collection("flows").doc(flowId).set(data);
}

async function getCurrentFlow(db, userData) {
  const userId = userData.WaId;
  const flowRef = db.collection("flows").where("userId", "==", userId).get();
  console.log("flowRef", flowRef);
}

module.exports = {
  createNewFlow,
  getCurrentFlow,
};
