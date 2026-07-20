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
      `SELECT DISTINCT tbl_user.user_id, first_recharge_coupon, user_name,user_area,rate,tbl_user.product_name,
      (SELECT ifnull(SUM(completed_rate*subs_id),0) from completed_orders WHERE user_id=tbl_user.user_id ) as total_btl_bill,
      (SELECT ifnull(SUM(subs_id),0) from completed_orders WHERE user_id=tbl_user.user_id AND delivery_date Between ? AND ?) as month_btl,
      (SELECT billing_month
      FROM 
      tbl_user,payment 
      where 
      tbl_user.user_id=payment.user_id && tbl_user.user_id=? && recieved is not Null order by payment_id DESC LIMIT 1)as mon,
      (SELECT recieved
      FROM tbl_user,payment where      tbl_user.user_id=payment.user_id && tbl_user.user_id=? && recieved is not Null order by payment_id DESC LIMIT 1)as paid,
      (SELECT IFNULL( SUM(recieved),0) FROM payment where user_id=tbl_user.user_id and date_recieved Between ? AND ?) as month_pay,
      (SELECT date_recieved FROM       tbl_user,payment 
      where    tbl_user.user_id=payment.user_id && tbl_user.user_id=? && recieved is not null order by payment_id DESC LIMIT 1)as daterecieve,
      
      (SELECT ifnull(SUM(completed_rate*subs_id),0) from completed_orders WHERE user_id=tbl_user.user_id AND delivery_date Between ? AND ?) as 'total_dues' ,
      (SELECT ifnull(SUM(completed_rate*subs_id),0) from completed_orders WHERE user_id=tbl_user.user_id AND YEAR(delivery_date)= YEAR(CURRENT_DATE()) and MONTH(delivery_date)=MONTH(CURRENT_DATE())) as curr_month ,
      (SELECT IFNULL( SUM(recieved),0) FROM payment where user_id=tbl_user.user_id) as total_pay,(SELECT(total_btl_bill)+(user_balance)-(total_pay)-(curr_month)-(total_dues)) as 'pre_duess',
      (SELECT CASE when pre_duess<=0 THEN (pre_duess)+(month_pay)
      WHEN pre_duess>0 THEN (pre_duess)+(month_pay) END )as 'pre_dues',
      (SELECT CASE when pre_duess<=0 THEN (total_dues) +(pre_duess)
      WHEN pre_duess>0 THEN (pre_duess)+(total_dues) END )as Gtotal
      FROM tbl_user LEFT JOIN completed_orders on tbl_user.user_id=completed_orders.user_id LEFT JOIN payment ON completed_orders.user_id=payment.user_id where tbl_user.user_id=?`,
      [
        data.frmDate,
        data.toDate,
        data.userid,
        data.userid,
        data.frmDate,
        data.toDate,
        data.userid,
        data.frmDate,
        data.toDate,
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
      `SELECT DISTINCT tbl_user.user_id, user_name,user_area, (SELECT ifnull(SUM(subs_id),0) from completed_orders WHERE completed_orders.user_id=tbl_user.user_id AND YEAR(delivery_date)= YEAR(CURRENT_DATE()) and MONTH(delivery_date)=MONTH(CURRENT_DATE())) as total_btl,
      (((SELECT IFNULL(SUM(completed_rate*subs_id),0) from completed_orders WHERE completed_orders.user_id=tbl_user.user_id)-(SELECT IFNULL(SUM(completed_rate*subs_id),0) from completed_orders WHERE user_id=tbl_user.user_id AND YEAR(delivery_date)= YEAR(CURRENT_DATE()) and MONTH(delivery_date)=MONTH(CURRENT_DATE()))) )as pre_dues,
      ((((SELECT IFNULL(SUM(completed_rate*subs_id),0) from completed_orders WHERE completed_orders.user_id=tbl_user.user_id)-(SELECT IFNULL(SUM(completed_rate*subs_id),0) from completed_orders WHERE user_id=tbl_user.user_id AND YEAR(delivery_date)= YEAR(CURRENT_DATE()) and MONTH(delivery_date)=MONTH(CURRENT_DATE()))) -(SELECT IFNULL( SUM(recieved),0) FROM payment where user_id=tbl_user.user_id))+(user_balance)
) as 'dues',(SELECT IFNULL(SUM(rate*subs_id),0) from completed_orders WHERE completed_orders.user_id=tbl_user.user_id AND YEAR(delivery_date)= YEAR(CURRENT_DATE()) and MONTH(delivery_date)=MONTH(CURRENT_DATE())) as curr_bill,((SELECT IFNULL(SUM(completed_rate*subs_id),0) from completed_orders WHERE completed_orders.user_id=tbl_user.user_id)-(SELECT ifnull(SUM(recieved),0)FROM payment WHERE payment.user_id=tbl_user.user_id) ) as 'total' ,
    ( SELECT(dues)+(total)) as gtotal FROM tbl_user LEFT JOIN completed_orders on tbl_user.user_id=completed_orders.user_id LEFT JOIN payment ON completed_orders.user_id=payment.user_id WHERE tbl_user.user_id=?`,
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
