import { train_stations } from "../../../../data/train_stations";

function getDistance(lat1, lon1, lat2, lon2, unit) {
  if (lat1 == lat2 && lon1 == lon2) {
    return 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.8532;

    return dist;
  }
}

export default function handler({ query: { lat, long } }, res) {
  const nearest = train_stations
    .map((element, key) => {
      let dist = getDistance(lat, long, element.stop_lat, element.stop_lon);
      if (dist < 3) return { distance: dist.toFixed(4), ...element };
      else return null;
    })
    .filter((i) => i)
    .sort((a, b) => a.distance.localeCompare(b.distance))
    .slice(0, 20);

  res.status(200).json(nearest);
}
