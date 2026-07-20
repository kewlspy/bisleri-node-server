const {
  create,
  getUsers,
  getUserByUserEmail,
  getDataByUser,
  updateToken,
  getLocationByUser,
  locationUpdate,
} = require("./user.service");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

module.exports = {
  createUser: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);
    create(body, (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ success: 0, message: "Database connection error" });
      }
      return res.status(200).json({ success: 1, data: result });
    });
  },
  getUsers: (req, res) => {
    // Pagination code

    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    // Pagination code

    getUsers((err, results) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ success: 0, message: "Database connection error" });
      }

      // Pagination code
      const result = {};

      if (endIndex < results.length) {
        result.next = {
          page: page + 1,
          limit: limit,
        };
      }

      if (startIndex > 0) {
        result.previous = {
          page: page - 1,
          limit: limit,
        };
      }

      result.result = results.slice(startIndex, endIndex);
      // Pagination code
      return res.status(200).json({ success: 1, data: result });
    });
  },
  login: (req, res) => {
    const body = req.body;
    number = "92" + body.number;
    getUserByUserEmail(number, (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.json({ success: 0, data: "Invalid email or password" });
      }
      user_password = results.user_password.replace("$2y$", "$2a$");
      const result = compareSync(body.password, user_password);
      if (result) {
        results.password = undefined;
        const jsontoken = sign({ result: results }, "qwe1234", {
          expiresIn: "1h",
        });
        return res.json({
          success: 1,
          data: "login successfully",
          token: jsontoken,
          results,
        });
      } else {
        return res.json({
          success: 0,
          data: "invalid email or password",
        });
      }
    });
  },

  data: (req, res) => {
    const body = req.body;
    getDataByUser(body.userid, (err, results) => {
      if (err) {
        console.log(err);
        return res.json({
          success: 0,
          data: "invalid request",
          results,
        });
      }
      return res.status(200).json({ success: 1, data: results });
    });
  },
  location: (req, res) => {
    const body = req.body;
    getLocationByUser(body.userid, (err, results) => {
      if (err) {
        console.log(err);
        return res.json({
          success: 0,
          data: "invalid request",
          results,
        });
      }
      return res.status(200).json({ success: 1, data: results });
    });
  },

  locupdate: (req, res) => {
    const body = req.body;
    locationUpdate(body, (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ success: 0, message: "Database connection error" });
      }
      return res.status(200).json({ success: 1, data: result });
    });
  },

  fcmToken: (req, res) => {
    const body = req.body;

    updateToken(body, (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ success: 0, message: "Database connection error" });
      }
      return res.status(200).json({ success: 1, data: result });
    });
  },
};
