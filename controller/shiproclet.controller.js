const axios = require("axios");
const { getShiprocketToken } = require("../services/shiprocket.service");
const Order = require('../models/order');
const BASE_URL = "https://apiv2.shiprocket.in/v1/external";

// CREATE SHIPMENT
exports.createShipment = async (req, res) => {

    try {

        const order = await Order.findById(req.params.id);
     

        const shipment = await createShipmentFn(req.body);

        order.shipment = shipment;
        order.orderStatus = "SHIPPED";

        await order.save();

        res.json({
            success: true,
            trackingUrl: shipment.trackingUrl,
            awb: shipment.awbCode
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Shiprocket shipment failed",
            error: err.response?.data || err.message
        });
    }
};



// YOUR EXISTING API
exports.addConsultation = async (req, res) => {

  try {

    const data = await AstroConsultation.create(req.body);

    res.status(201).json(data);

  } catch (err) {

    res.status(400).json({ error: err.message });

  }

};

exports.trackOrder = async (req,res) => {

 try{

   const order = await Order.findById(req.params.id);
   if(!order?.shipment?.awbCode){
      return res.status(400).json({ message:"No shipment found"});
   }

   const token = await getShiprocketToken();

   const trackRes = await axios.get(
     `${BASE_URL}/courier/track/awb/${order.shipment.awbCode}`,
     {
       headers:{ Authorization:`Bearer ${token}`}
     }
   );

   const trackingData = trackRes.data.tracking_data;

   // optional — update DB
   order.shipment.trackingUrl = trackingData.track_url;
   order.shipment.trackingData = trackingData;

   await order.save();

   res.json(trackingData);

 }catch(err){

   res.status(500).json({
      message:"Tracking failed",
      error: err.response?.data || err.message
   });
 }
}

async function createShipmentFn(payload){

 try{

   const token = await getShiprocketToken();

   // STEP 1 CREATE ORDER
   const orderRes = await axios.post(
      `${BASE_URL}/orders/create/adhoc`,
      payload,
      {
         headers:{
            Authorization:`Bearer ${token}`,
            "Content-Type":"application/json"
         }
      }
   );

   const orderId = orderRes.data.order_id;
   const shipmentId = orderRes.data.shipment_id;

   console.log("Order Created:", orderId);

   // STEP 2 GET BEST COURIER
   const courierRes = await axios.get(
      `${BASE_URL}/courier/serviceability/?order_id=${orderId}`,
      {
         headers:{ Authorization:`Bearer ${token}` }
      }
   );

   const courierList =
      courierRes.data.data.available_courier_companies;

   if(!courierList.length){
      throw new Error("No courier available");
   }

   const courierId = courierList[0].courier_company_id;

   console.log("Courier Selected:", courierId);

   // STEP 3 ASSIGN AWB
   const awbRes = await axios.post(
      `${BASE_URL}/courier/assign/awb`,
      {
         shipment_id: shipmentId,
         courier_id: courierId
      },
      {
         headers:{ Authorization:`Bearer ${token}` }
      }
   );
 console.log("AWB RES:", awbRes.data);
   const awbCode = awbRes.data.response.data.awb_code;

   console.log("AWB Assigned:", awbCode);

   // STEP 4 GET TRACKING
   const trackRes = await axios.get(
      `${BASE_URL}/courier/track/awb/${awbCode}`,
      {
         headers:{ Authorization:`Bearer ${token}` }
      }
   );

   return {
      orderId,
      shipmentId,
      awbCode,
      courierName:
         courierList[0].courier_name,
      trackingUrl:
         trackRes.data.tracking_data?.track_url,
      trackingData:
         trackRes.data.tracking_data
   };

 }catch(err){

   throw new Error("Shiprocket shipment failed");

 }
}
