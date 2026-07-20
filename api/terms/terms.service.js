const pool = require("../../config/database");

module.exports = {
  getCurrentTerms: (userId, callBack) => {
    pool.query(
      `SELECT tc.content, tc.version, tc.updated_at,
              (SELECT uta.version FROM user_terms_acceptance uta
               WHERE uta.user_id = u.user_id
               ORDER BY uta.accepted_at DESC LIMIT 1) AS accepted_version
       FROM tbl_user u
       JOIN terms_conditions tc ON tc.storeadmin_id = u.storeadmin_id
       WHERE u.user_id = ?`,
      [userId],
      (error, results) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },

  getVersionForUser: (userId, callBack) => {
    pool.query(
      `SELECT u.storeadmin_id, tc.version
       FROM tbl_user u
       JOIN terms_conditions tc ON tc.storeadmin_id = u.storeadmin_id
       WHERE u.user_id = ?`,
      [userId],
      (error, results) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },

  getLastAcceptedVersion: (userId, callBack) => {
    pool.query(
      `SELECT version FROM user_terms_acceptance
       WHERE user_id = ? ORDER BY accepted_at DESC LIMIT 1`,
      [userId],
      (error, results) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },

  insertAcceptance: (userId, storeAdminId, version, callBack) => {
    pool.query(
      `INSERT INTO user_terms_acceptance (user_id, storeadmin_id, version) VALUES (?, ?, ?)`,
      [userId, storeAdminId, version],
      (error, results) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
};
