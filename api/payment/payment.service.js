const pool = require("../../config/database");

module.exports = {
  getPaymentByUser: (userid, callBack) => {
    pool.query(
      `SELECT * FROM payment WHERE user_id= ? ORDER BY payment.payment_id DESC`,
      [userid],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  // SELECT * FROM store_admin WHERE (SELECT storeadmin_id from tbl_user where tbl_user.user_id=848)=store_admin.storeadmin_id
  getBillByUser: (data, callBack) => {
    pool.query(
      `SELECT
        u.user_id,
        u.first_recharge_coupon,
        u.user_name,
        u.user_area,
        u.rate,
        u.product_name,
        IFNULL(co.total_btl_bill, 0) AS total_btl_bill,
        IFNULL(co.month_btl, 0) AS month_btl,
        lp.billing_month AS mon,
        lp.recieved AS paid,
        IFNULL(p.month_pay, 0) AS month_pay,
        lp.date_recieved AS daterecieve,
        IFNULL(co.total_dues, 0) AS total_dues,
        IFNULL(co.curr_month, 0) AS curr_month,
        IFNULL(p.total_pay, 0) AS total_pay,
        (IFNULL(co.total_btl_bill, 0) + u.user_balance - IFNULL(p.total_pay, 0) - IFNULL(co.curr_month, 0) - IFNULL(co.total_dues, 0)) AS pre_duess,
        (IFNULL(co.total_btl_bill, 0) + u.user_balance - IFNULL(p.total_pay, 0) - IFNULL(co.curr_month, 0) - IFNULL(co.total_dues, 0)) + IFNULL(p.month_pay, 0) AS pre_dues,
        (IFNULL(co.total_btl_bill, 0) + u.user_balance - IFNULL(p.total_pay, 0) - IFNULL(co.curr_month, 0) - IFNULL(co.total_dues, 0)) + IFNULL(co.total_dues, 0) AS Gtotal
      FROM tbl_user u
      LEFT JOIN (
        SELECT
          user_id,
          SUM(completed_rate * subs_id) AS total_btl_bill,
          SUM(CASE WHEN delivery_date BETWEEN ? AND ? THEN subs_id ELSE 0 END) AS month_btl,
          SUM(CASE WHEN delivery_date BETWEEN ? AND ? THEN completed_rate * subs_id ELSE 0 END) AS total_dues,
          SUM(CASE WHEN YEAR(delivery_date) = YEAR(CURDATE()) AND MONTH(delivery_date) = MONTH(CURDATE())
                   THEN completed_rate * subs_id ELSE 0 END) AS curr_month
        FROM completed_orders
        WHERE user_id = ?
        GROUP BY user_id
      ) co ON co.user_id = u.user_id
      LEFT JOIN (
        SELECT
          user_id,
          SUM(recieved) AS total_pay,
          SUM(CASE WHEN date_recieved BETWEEN ? AND ? THEN recieved ELSE 0 END) AS month_pay
        FROM payment
        WHERE user_id = ?
        GROUP BY user_id
      ) p ON p.user_id = u.user_id
      LEFT JOIN (
        SELECT user_id, billing_month, recieved, date_recieved
        FROM payment
        WHERE user_id = ? AND recieved IS NOT NULL
        ORDER BY payment_id DESC
        LIMIT 1
      ) lp ON lp.user_id = u.user_id
      WHERE u.user_id = ?`,
      [
        data.frmDate,
        data.toDate,
        data.frmDate,
        data.toDate,
        data.userid,
        data.frmDate,
        data.toDate,
        data.userid,
        data.userid,
        data.userid,
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getOByUser: (userid, callBack) => {
    pool.query(
      `SELECT
        ov.user_id,
        ov.user_name,
        ov.user_area,
        ov.total_btl,
        ov.pre_dues,
        ov.curr_bill,
        ov.curr_month_received,
        (ov.pre_dues + ov.curr_bill - ov.curr_month_received) AS total
      FROM (
        SELECT
          u.user_id,
          u.user_name,
          u.user_area,
          IFNULL(co.curr_month_btl, 0) AS total_btl,

          -- Net previous-month(s) dues: gross bill before this month, plus any
          -- manual balance adjustment, minus everything paid before this month
          -- (total received to date minus what came in this month).
          (
            IFNULL(co.pre_dues, 0) + u.user_balance
            - (IFNULL(pay.total_received, 0) - IFNULL(pay.curr_month_received, 0))
          ) AS pre_dues,

          IFNULL(co.curr_bill, 0) AS curr_bill,
          IFNULL(pay.curr_month_received, 0) AS curr_month_received

        FROM tbl_user u
        LEFT JOIN (
          SELECT
            user_id,
            SUM(CASE WHEN delivery_date < DATE_FORMAT(CURDATE(), '%Y-%m-01')
                     THEN completed_rate * subs_id ELSE 0 END) AS pre_dues,
            SUM(CASE WHEN delivery_date >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
                     THEN completed_rate * subs_id ELSE 0 END)            AS curr_bill,
            SUM(CASE WHEN delivery_date >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
                     THEN subs_id ELSE 0 END)                   AS curr_month_btl
          FROM completed_orders
          WHERE user_id = ?
          GROUP BY user_id
        ) co ON co.user_id = u.user_id
        LEFT JOIN (
          SELECT
            user_id,
            SUM(recieved) AS total_received,
            SUM(CASE WHEN date_recieved >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
                     THEN recieved ELSE 0 END) AS curr_month_received
          FROM payment
          WHERE user_id = ?
          GROUP BY user_id
        ) pay ON pay.user_id = u.user_id
        WHERE u.user_id = ?
      ) ov`,
      [userid, userid, userid],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
};
