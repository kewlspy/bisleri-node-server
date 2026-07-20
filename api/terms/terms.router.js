const { getCurrentTerms, acceptTerms } = require("./terms.controller");
const router = require("express").Router();

router.get("/current", getCurrentTerms);
router.post("/accept", acceptTerms);

module.exports = router;
