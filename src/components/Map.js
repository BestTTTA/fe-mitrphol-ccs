import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, HeatmapLayer } from "@react-google-maps/api";
import axios from "axios";

const MapComponent = () => {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const mapCenter = {
    lat: 13.736717,
    lng: 100.523186
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://ccs.latlon.thetigerteamacademy.net/geo/");
        setLocations(response.data.geo_entities || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const mapStyles = {
    height: "80vh",
    width: "80%"
  };

  const heatmapData = locations.map(location => ({
    location: new window.google.maps.LatLng(location.LAT, location.LON),
    weight: location.CCS
  }));

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyBb8Ioejj1p4NKXJM1Fyo-xNAlztcA-1wM"
      libraries={["visualization"]}
    >
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={5}
        center={mapCenter}
        mapTypeId="hybrid"
      >
        {!isLoading && locations.length > 0 && (
          <HeatmapLayer
            data={heatmapData}
            options={{
              radius: 20,
              opacity: 0.6,
              dissipating: true,
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;