const express = require("express");
const router = express.Router();
const { handleMessage } = require("../controllers/webhookController");

router.post("/", handleMessage);
module.exports = router;
