const got = require("got");

async function getResponse() {
  try {
    const response = await got(
      "https://api.niwa.co.nz/weather/forecast/229675266"
    );
    return response.body;
  } catch (error) {
    return error.response.body;
  }
}

module.exports = async (req, res) => {
  const allUpdates = await getResponse();
  res.status(200).json(allUpdates);
};
