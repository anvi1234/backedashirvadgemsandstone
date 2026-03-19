const axios = require('axios');

const sendWhatsAppMerchant = async (variables) => {
  try {
    const response = await axios.get(
      'https://www.fast2sms.com/dev/whatsapp',
      {
        params: {
          authorization: process.env.FAST2SMS_API_KEY,
          message_id: '15403',
          phone_number_id: '1055616950966372',
          numbers: '9899545248', // 👈 YOUR FIXED MERCHANT NUMBER (no +91)
          variables_values: variables.join('|')
        }
      }
    );

    console.log('Merchant WhatsApp:', response.data);
  } catch (error) {
    console.error('Merchant WhatsApp Error:', error.response?.data || error.message);
  }
};

module.exports = sendWhatsAppMerchant;