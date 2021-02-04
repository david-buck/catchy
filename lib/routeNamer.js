export default function routeRenamer(route) {
  switch (route) {
    case "Wgtn Station":
      return "Wellington Station";
    case "Courtenay Pl":
      return "Courtenay Place";
    case "Courtenay Pl - Scots":
      return "Courtenay Place — Scots";
    case "Grenada Vlg":
      return "Grenada Village";
    case "J'ville West":
      return "Johnsonville West";
    case "Stokes V Hgts":
      return "Stokes Valley Heights";
    case "Stokes Valley Heigh":
      return "Stokes Valley Heights";
    case "Kilbirnie - Rongota":
      return "Kilbirnie – Rongotai";
    case "Whitireia-Por":
      return "Whitireia – Porirua";
    case "Waikanae Bch":
      return "Waikanae Beach";

    default:
      return route;
  }
}
