import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import axios from "axios";

const MapComponent = () => {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapCenter, setMapCenter] = useState({
    lat: 13.736717, // พิกัดเริ่มต้นของแผนที่ (เช่น กรุงเทพมหานคร)
    lng: 100.523186
  });

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

  const getMarkerColor = (ccs) => {
    if (ccs < 5) return "green";
    if (ccs < 12) return "yellow";
    return "red";
  };

  const mapStyles = {
    height: "80vh",
    width: "80%"
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyBb8Ioejj1p4NKXJM1Fyo-xNAlztcA-1wM">
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={5}
        center={mapCenter}  // ใช้ mapCenter เป็นค่า center ของแผนที่
        mapTypeId="hybrid"
      >
        {!isLoading && locations.length > 0 ? (
          locations.map((location) => (
            <Marker
              key={location.ID}
              position={{ lat: location.LAT, lng: location.LON }}
              icon={{
                url: `http://maps.google.com/mapfiles/ms/icons/${getMarkerColor(location.CCS)}-dot.png`,
              }}
              onClick={() => {
                setSelectedMarker(location);
                setMapCenter({ lat: location.LAT, lng: location.LON });  // เมื่อคลิก marker ให้เปลี่ยน center ของแผนที่
              }}
            />
          ))
        ) : (
          <p>Loading markers...</p>
        )}

        {selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.LAT, lng: selectedMarker.LON }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div>
              <p>CCS: {selectedMarker.CCS}</p>
              <p>Latitude: {selectedMarker.LAT}</p>
              <p>Longitude: {selectedMarker.LON}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
