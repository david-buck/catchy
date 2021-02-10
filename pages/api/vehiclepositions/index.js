const got = require("got");

async function getResponse() {
  try {
    const response = await got(
      "https://api.opendata.metlink.org.nz/v1/gtfs-rt/vehiclepositions",
      {
        headers: {
          "x-api-key": "qERRhpluph3tNi0KG4gA65h3lYgkV9e58hOAAFR1",
          "cache-control": "max-age=30",
        },
      }
    );
    return response.body;
  } catch (error) {
    return error.response.body;
  }
}

module.exports = async (req, res) => {
  const allPositions = await getResponse();
  res.status(200).json(allPositions);
};
