const scraperBots = ["twitter", "slack", "facebook", "facebot"];

export default function isLinkScraper(userAgent) {
  return scraperBots
    .map((el) => userAgent.toLowerCase().includes(el) && true)
    .includes(true);
}
