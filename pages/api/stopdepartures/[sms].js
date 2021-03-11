const got = require("got");

async function getResponse({ sms }) {
  try {
    const response = await got(
      "https://api.opendata.metlink.org.nz/v1/stop-predictions?stop_id=" + sms,
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

module.exports = async ({ query: sms }, res) => {
  const allDepartures = await getResponse(sms);

  const filteredDepartures = JSON.parse(allDepartures).departures.map(
    ({ stop_id, operator, origin, arrival, delay, name, status, ...e }) => e
  );

  //res.status(200).json(JSON.parse(allDepartures).departures);
  res.status(200).json(filteredDepartures);
};
