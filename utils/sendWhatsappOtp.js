const axios = require('axios');

const sendWhatsAppOtp = async (phone, otp) => {
  try {
    const response = await axios.get(
      'https://www.fast2sms.com/dev/whatsapp',
      {
        params: {
          authorization: process.env.FAST2SMS_API_KEY,
          message_id: '15390', // 👈 OTP template ID
          phone_number_id: '1055616950966372',
          numbers: phone, // without +91
          variables_values: otp.toString()
        }
      }
    );

    console.log('OTP WhatsApp sent:', response.data);
  } catch (error) {
    console.error('OTP WhatsApp Error:', error.response?.data || error.message);
  }
};

module.exports = sendWhatsAppOtp;




