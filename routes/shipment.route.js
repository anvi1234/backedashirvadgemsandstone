const express = require("express");
const router = express.Router();

const shipmentController = require("../controller/shiproclet.controller");

router.post("/create-shipment/:id", shipmentController.createShipment);
router.get("/track/:id", shipmentController.trackOrder);

module.exports = router;
