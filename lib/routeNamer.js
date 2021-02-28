export default function routeRenamer(route) {
  switch (route) {
    case "Wgtn Station":
      return "Wellington Station";
    case "Courtenay Pl":
      return "Courtenay Place";
    case "Courtenay Pl - Scots":
      return "Courtenay Place - Scots";
    case "Courtenay Pl-Scots":
      return "Courtenay Place - Scots";
    case "Grenada Vlg":
      return "Grenada Village";
    case "J'ville West":
      return "Johnsonville West";
    case "Stokes V Hgts":
      return "Stokes Valley Heights";
    case "Stokes Valley Heigh":
      return "Stokes Valley Heights";
    case "Kilbirnie - Rongota":
      return "Kilbirnie — Rongotai";
    case "Whitireia-Por":
      return "Whitireia — Porirua";
    case "Waikanae Bch":
      return "Waikanae Beach";
    case "Whitby Nav Dr":
      return "Whitby — Navigation Drive";
    case "Whitby Crowsn":
      return "Whitby — The Crowsnest";
    case "Wainuiomata N":
      return "Wainuiomata North";

    case "JOHN-All stops":
      return "Johnsonville — All stops";
    case "WAIK-All stops":
      return "Waikanae — All stops";
    case "UPPE-All stops":
      return "Upper Hutt — All stops";
    case "MELL-All stops":
      return "Melling — All stops";
    case "PORI-All stops":
      return "Porirua — All stops";
    case "WELL-All stops":
      return "Wellington — All stops";
    case "WELL-Express":
      return "Wellington — Express";
    case "WELL-Non stop":
      return "Wellington — Non-stop";
    case "MAST-Express":
      return "Masterton — Express";
    case "MAST-All stops":
      return "Masterton — All stops";

    default:
      return route;
  }
}
