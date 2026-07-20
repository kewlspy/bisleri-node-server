const {
  getBillByUser,
  getPaymentByUser,
  getOByUser,
} = require("./payment.service");

module.exports = {
  pagepayments: (req, res) => {
    const body = req.body;
    // Pagination code

    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    // Pagination code

    getPaymentByUser(body.userid, (err, results) => {
      if (err) {
        console.log(err);
        return res.json({
          success: 0,
          data: "invalid request",
        });
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
  bill: (req, res) => {
    const body = req.body;
    getBillByUser(body, (err, results) => {
      if (err) {
        console.log(err);
        return res.json({
          success: 0,
          data: "invalid request",
        });
      }
      return res.status(200).json({ success: 1, data: results });
    });
  },
  overview: (req, res) => {
    const body = req.body;
    getOByUser(body.userid, (err, results) => {
      if (err) {
        console.log(err);
        return res.json({
          success: 0,
          data: "invalid request",
        });
      }
      return res.status(200).json({ success: 1, data: results });
    });
  },
};
