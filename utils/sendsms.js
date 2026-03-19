const axios = require('axios');

const sendWhatsApp = async (phone, variables) => {
  try {
    const apiKey = process.env.FAST2SMS_API_KEY;

    const url = `https://www.fast2sms.com/dev/whatsapp`;

    const response = await axios.get(url, {
      params: {
        authorization: apiKey,
        message_id: '15392', // your template ID
        phone_number_id: '1055616950966372',
        numbers: phone,
        variables_values: variables.join('|') // IMPORTANT
      }
    });

    console.log('WhatsApp sent:', response.data);
  } catch (error) {
    console.error('WhatsApp Error:', error.response?.data || error.message);
  }
};

module.exports = sendWhatsApp;