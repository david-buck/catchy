import React, { useRef, useEffect } from "react";
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
      style: "mapbox://styles/catchy-nz/ckl34y0vr1yqt17mqd9q74me0",
      center: [lng, lat],
      pitch: 38,
      maxPitch: 45,
      zoom: 16.9,
      minZoom: 15,
      maxZoom: 18,
      //interactive: false,
    });

    marker.current = new mapboxgl.Marker({
      anchor: "right",
      rotation: bearing,
      pitchAlignment: "map",
      offset: [20, 0],
      element: document.querySelector("#vehiclePositionMarker"),
    });

    return () => map.current.remove();
  }, []);

  useEffect(() => {
    map.current.flyTo({
      center: [lng, lat],
      offset: [0, 75],
      curve: 0,
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
        className="text-blue-600"
      />
    </>
  );
};

export default Map;
