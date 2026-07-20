const pool = require("../../config/database");
// const { use } = require("./user.router");

module.exports = {
  create: (data, callBack) => {
    pool.query(
      `INSERT INTO registration (firstName, lastName, gender, email, password, number) 
      VALUES (?,?,?,?,?,?)`,
      [
        data.first_name,
        data.last_name,
        data.gender,
        data.email,
        data.password,
        data.number,
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getUsers: (callBack) => {
    pool.query(`SELECT * from tbl_user`, [], (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results);
    });
  },

  getUserByUserEmail: (number, callBack) => {
    pool.query(
      `select * from tbl_user where user_phone = ?`,
      [number],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  getDataByUser: (userid, callBack) => {
    pool.query(
      `SELECT (SELECT COUNT(*) FROM orders WHERE YEAR(order_date)= YEAR(CURRENT_DATE()) and MONTH(order_date)=MONTH(CURRENT_DATE()) and  user_id=?) as totalOrder,
      (SELECT COUNT(*) FROM completed_orders WHERE YEAR(delivery_date)= YEAR(CURRENT_DATE()) and MONTH(delivery_date)=MONTH(CURRENT_DATE()) and  user_id=?) as totalCompleted,
      (SELECT IFNULL(SUM(subs_id),0) FROM completed_orders WHERE YEAR(delivery_date)= YEAR(CURRENT_DATE()) and MONTH(delivery_date)=MONTH(CURRENT_DATE()) and  user_id=?) as totalBottles,
      (SELECT ifnull((SUM(subs_id*completed_rate)),0) FROM completed_orders WHERE YEAR(delivery_date)= YEAR(CURRENT_DATE()) and MONTH(delivery_date)=MONTH(CURRENT_DATE()) and  user_id=?) as totalBill,
      (SELECT storeadmin_deliverycharges FROM store_admin where storeadmin_id=(select storeadmin_id from tbl_user where user_id=?)) as delivery,
      (SELECT storeadmin_name FROM store_admin where storeadmin_id=(select storeadmin_id from tbl_user where user_id=?)) as admin,
      ((SELECT empty_btl FROM tbl_user WHERE user_id=?) + IFNULL((SELECT SUM(subs_id) FROM completed_orders WHERE user_id=?),0) - IFNULL((SELECT SUM(returnbtl) FROM completed_orders WHERE user_id=?),0)) as remainbtl`,
      // `select * from tbl_user where user_id = ?`,
      [userid, userid, userid, userid, userid, userid, userid, userid, userid],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  getLocationByUser: (userid, callBack) => {
    pool.query(
      `SELECT user_id,lat,lng FROM tbl_user WHERE user_id=?`,[userid],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },

  locationUpdate: (data, callBack) => {
    pool.query(
      `UPDATE tbl_user SET lat=?,lng=? where user_id=?`,
      [data.lat, data.lng, data.userid],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },

  updateToken: (data, callBack) => {
    pool.query(
      `UPDATE tbl_user SET device_id=? where user_id=?`,
      [data.token, data.userid],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
};
