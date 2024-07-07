const { OnboardingFlow } = require("../services/OnboardingFlow");

async function runOnboardingFlow(userInfo, flowStep, userMessage, mongoClient) {
  const onboardingFlow = new OnboardingFlow(userInfo, userMessage, mongoClient);
  const flowCompletionStatus = await onboardingFlow.handleFlowStep(flowStep);
  return flowCompletionStatus;
}
async function flowController(req, res, next) {
  let flowCompletionStatus;
  const mongoClient = req.app.locals.mongoClient;
  try {
    const { userInfo, message, flowStep } = req.body;
    const flow = req.params.flowName;
    console.log({
      flow: flow,
      userInfo: userInfo,
      flowStep: flowStep,
      message: message,
    });
    if (flow === "onboarding") {
      flowCompletionStatus = await runOnboardingFlow(
        userInfo,
        flowStep,
        message,
        mongoClient
      );
    }
    res.status(200).send({ flowCompletionStatus });
  } catch (err) {
    res.status(500).send(err);
  }
}

module.exports = { flowController };
