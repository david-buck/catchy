export default function routeRenamer(route) {
  switch (route) {
    case "Wgtn Station":
      return "Wellington Station";
    case "Grenada Vlg":
      return "Grenada Village";
    case "J'ville West":
      return "Johnsonville West";
    case "Stokes V Hgts":
      return "Stokes Valley Heights";
    case "Stokes Valley Heigh":
      return "Stokes Valley Heights";

    default:
      return route;
  }
}
