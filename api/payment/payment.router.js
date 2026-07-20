const { bill, pagepayments, overview } = require("./payment.controller");
const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");

router.post("/bill", bill);
router.post("/overview", overview);
router.post("/page", pagepayments);

module.exports = router;
