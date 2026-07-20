const { orders, neworder, cancelorder } = require("./order.controller");
const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");

router.post("/cancelorder", cancelorder);
router.post("/neworder", neworder);
router.post("/page", orders);
// router.post("/page", neworder);

module.exports = router;
