const { deliveries, pagedeliveries } = require("./delivery.controller");
const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");

router.post("/", deliveries);
router.post("/page", pagedeliveries);

module.exports = router;
