const pool = require("../../config/database");

module.exports = {
  getDeliveryByPage: (userid, callBack) => {
    pool.query(
      `SELECT * FROM completed_orders WHERE user_id= ?`,
      [userid],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },

  getDeliveryByUser: (userid, frmDate, toDate, callBack) => {
    let sql = `SELECT * FROM completed_orders WHERE user_id = ?`;
    const params = [userid];

    // Optional date-range filter on the delivery day (time-of-day is ignored,
    // so the bounds are inclusive of the whole frmDate/toDate calendar days).
    if (frmDate && toDate) {
      sql += ` AND DATE(delivery_date) BETWEEN ? AND ?`;
      params.push(frmDate, toDate);
    } else if (frmDate) {
      sql += ` AND DATE(delivery_date) >= ?`;
      params.push(frmDate);
    } else if (toDate) {
      sql += ` AND DATE(delivery_date) <= ?`;
      params.push(toDate);
    }

    sql += ` ORDER BY completed_orders.completed_id DESC`;

    pool.query(sql, params, (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results);
    });
  },
};
