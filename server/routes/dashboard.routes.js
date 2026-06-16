const express = require("express");
const router = express.Router();

const { getDashboardOverview } = require("../controllers/dashboard.controller");

router.get(
  "/overview",

  getDashboardOverview,
);

module.exports = router;
