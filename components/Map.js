import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import VehiclePositionMarker from "../svgs/vehicle-position-marker.svg";

mapboxgl.accessToken =
  "pk.eyJ1IjoiY2F0Y2h5LW56IiwiYSI6ImNra2pkNzNyOTA0ZTkyd3BtOTRqenNoZjYifQ.IT8HHxo0QW-IU4jRkhfmEQ";

const Map = ({ lat, lng, bearing }) => {
  const mapContainerRef = useRef(null);
  const map = useRef();
  const marker = useRef();

  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      pitch: 40,
      zoom: 16,
      interactive: false,
    });

    marker.current = new mapboxgl.Marker({
      anchor: "right",
      rotation: bearing,
      pitchAlignment: "map",
      element: document.querySelector("#vehiclePositionMarker"),
    });

    return () => map.current.remove();
  }, []);

  useEffect(() => {
    map.current.flyTo({
      center: [lng, lat],
      offset: [0, 75],
      curve: 0.75,
    });

    marker.current
      .setLngLat([lng, lat])
      .setRotation(bearing)
      .addTo(map.current);
  }, [lng, lat]);

  return (
    <>
      <div className="absolute h-screen w-screen inset-0">
        <div ref={mapContainerRef} className="relative h-screen w-screen" />
      </div>
      <VehiclePositionMarker
        id="vehiclePositionMarker"
        width="40"
        height="40"
        className="absolute"
      />
    </>
  );
};

export default Map;
