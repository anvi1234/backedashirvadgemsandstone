const axios = require("axios");

let shiprocketToken = null;

async function getShiprocketToken() {
  try {
    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        email: "ashirvadrudrakshgemsship@gmail.com",
        password: "t$X7^*pkXU8utmOjHmrYx%iYd0#hafZI",
      }
    );

    shiprocketToken = response.data.token;

    return shiprocketToken;
  } catch (err) {
    console.log(err.response.data);
  }
}

module.exports = {
  getShiprocketToken
};
