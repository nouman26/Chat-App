var express = require("express");
var router = express.Router();
var Controller = require("../controller/controllers");

router.get("/", Controller.login);
router.post("/option", Controller.option);
router.post("/chat", Controller.chat);
router.get("/error", Controller.error);

module.exports = router;