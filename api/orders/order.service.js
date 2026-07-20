const pool = require("../../config/database");

module.exports = {
  newOrder: (data, callBack) => {
    pool.query(
      `INSERT INTO orders (storeadmin_id,user_id, order_qty, order_date, order_total, order_type) 
      VALUES ((SELECT storeadmin_id FROM tbl_user WHERE user_id=?),?,?,?,?,?)`,
      [
        data.userid,
        data.userid,
        data.orderqty,
        data.orderdate,
        data.total,
        data.type,
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },

  cancelOrder: (orderid, callBack) => {
    pool.query(
      `UPDATE orders SET order_status="cancelled"  WHERE order_id=?`,
      [orderid],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },

  getOrderByUser: (userid, callBack) => {
    pool.query(
      `SELECT * FROM orders WHERE order_status !="cancelled" and user_id= ? ORDER BY orders.order_id DESC`,
      // `SELECT * FROM orders WHERE user_id= ?  ORDER BY orders.order_id DESC`
      [userid],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
};
