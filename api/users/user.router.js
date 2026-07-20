const {
  createUser,
  getUsers,
  login,
  data,
  location,
  locupdate,
  fcmToken,
} = require("./user.controller");
const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");

router.post("/", createUser);
router.get("/", getUsers);
router.post("/login", login);
router.post("/data", data);
router.post("/location", location);
router.post("/locationupdate", locupdate);
router.post("/fcmtoken", fcmToken);

module.exports = router;
