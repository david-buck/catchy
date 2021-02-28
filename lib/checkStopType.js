const cableCarStops = ["KELB", "SALA", "TALA", "CLIF", "LAMB"];

export default function checkStopType(sms) {
  if (sms) {
    if (isNaN(sms)) {
      if (cableCarStops.includes(sms)) {
        return "cableCar";
      } else {
        return "train";
      }
    } else {
      if (sms >= 9995) {
        return "ferry";
      } else {
        return "bus";
      }
    }
  }
  return undefined;
}
