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

module.exports = async ({ query: { vehicle_id } }, res) => {
  const oneUpdate = await getResponse();

  const filtered = await JSON.parse(oneUpdate).entity.find(
    (p) => p.vehicle.vehicle.id === vehicle_id
  );

  if (filtered) {
    res.status(200).json(filtered);
  } else {
    res
      .status(404)
      .json({ message: `There is no trip with id: ${vehicle_id}.` });
  }
};
