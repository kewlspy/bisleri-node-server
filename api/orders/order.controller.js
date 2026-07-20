const { getOrderByUser, newOrder, cancelOrder } = require("./order.service");

module.exports = {
  neworder: (req, res) => {
    const body = req.body;

    newOrder(body, (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ success: 0, message: "Database connection error" });
      }
      return res.status(200).json({ success: 1, data: result });
    });
  },

  cancelorder: (req, res) => {
    const body = req.body;

    cancelOrder(body.orderid, (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ success: 0, message: "Database connection error" });
      }
      return res.status(200).json({ success: 1, data: result });
    });
  },

  orders: (req, res) => {
    const body = req.body;
    // Pagination code

    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    // Pagination code
    getOrderByUser(body.userid, (err, results) => {
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
};
