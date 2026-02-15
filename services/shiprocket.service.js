const axios = require("axios");

let shiprocketToken = null;

async function getShiprocketToken() {
  try {
    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        email: "ashirvadrudrakshgemsship@gmail.com",
        password: "Y6c3Bqn^FHwY%K8#jVgpHULPks^#N7Ou",
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
