const express = require("express");
const router = express.Router();

router.post("/:flowName", (req, res, next) => {
  try {
    const { userInfo, message } = req.body;
    const flow = req.params.flowName;
    console.log(flow, userInfo);
    res.status(200).send({
      status: "data Recieved",
      flow,
      data: message,
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
