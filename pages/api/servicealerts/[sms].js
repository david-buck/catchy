const got = require("got");

async function getResponse() {
  try {
    const response = await got(
      "https://api.opendata.metlink.org.nz/v1/gtfs-rt/servicealerts/",
      {
        headers: {
          "x-api-key": "qERRhpluph3tNi0KG4gA65h3lYgkV9e58hOAAFR1",
          "cache-control": "max-age=300",
        },
      }
    );
    return response.body;
  } catch (error) {
    return error.response.body;
  }
}

module.exports = async ({ query: { sms } }, res) => {
  const allAlerts = await getResponse();

  const relevantAlerts = JSON.parse(allAlerts).entity.filter((e) =>
    e.alert.informed_entity.find((f) => f.stop_id === sms)
  );

  res.status(200).json(relevantAlerts);
};
