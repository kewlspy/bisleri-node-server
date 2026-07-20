const {
  getCurrentTerms,
  getVersionForUser,
  getLastAcceptedVersion,
  insertAcceptance,
} = require("./terms.service");

module.exports = {
  getCurrentTerms: (req, res) => {
    const userId = req.query.userid;

    getCurrentTerms(userId, (err, row) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ success: 0, message: "Database connection error" });
      }

      if (!row) {
        return res.status(200).json({
          success: 1,
          data: {
            content: "",
            version: 1,
            previous_version: null,
            updated_at: null,
            accepted_version: null,
            needs_acceptance: false,
          },
        });
      }

      const version = Number(row.version);
      const acceptedVersion =
        row.accepted_version != null ? Number(row.accepted_version) : null;

      return res.status(200).json({
        success: 1,
        data: {
          content: row.content,
          version,
          previous_version: version > 1 ? version - 1 : null,
          updated_at: row.updated_at,
          accepted_version: acceptedVersion,
          needs_acceptance: acceptedVersion === null || acceptedVersion < version,
        },
      });
    });
  },

  acceptTerms: (req, res) => {
    const userId = req.body.userid;
    if (!userId) {
      return res.status(400).json({ success: 0, message: "userid required" });
    }

    // Resolve the live version server-side — never trust a client-supplied
    // version, otherwise a stale app could mark an old revision as "accepted".
    getVersionForUser(userId, (err, row) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ success: 0, message: "Database connection error" });
      }

      if (!row) {
        return res
          .status(200)
          .json({ success: 0, message: "terms not found for this user" });
      }

      const storeAdminId = row.storeadmin_id;
      const currentVersion = Number(row.version);

      getLastAcceptedVersion(userId, (err2, last) => {
        if (err2) {
          console.log(err2);
          return res
            .status(500)
            .json({ success: 0, message: "Database connection error" });
        }

        // idempotent: only write a new row if this version isn't already recorded
        if (!last || Number(last.version) !== currentVersion) {
          insertAcceptance(userId, storeAdminId, currentVersion, (err3) => {
            if (err3) {
              console.log(err3);
              return res
                .status(500)
                .json({ success: 0, message: "Database connection error" });
            }
            return res
              .status(200)
              .json({ success: 1, data: { accepted_version: currentVersion } });
          });
        } else {
          return res
            .status(200)
            .json({ success: 1, data: { accepted_version: currentVersion } });
        }
      });
    });
  },
};
