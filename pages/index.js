import { useState, useEffect } from "react";

import Link from "next/link";

export default function IndexPage() {
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
    });
  }, []);

  return (
    <div>
      <Link as={`/stop/4917`} href="/stop/[sms]">
        <a>Upland</a>
      </Link>
      <br />
      <Link as={`/stop/5010`} href="/stop/[sms]">
        <a>Lamb</a>
      </Link>
    </div>
  );
}
