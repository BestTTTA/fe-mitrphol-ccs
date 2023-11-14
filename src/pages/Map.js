import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Circle,
  LayersControl,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../App.css";
import Icon from "../location-pin.png";
import axios from "axios";
import PyScript from "pyscript-react/esm"; // main entrypoint
import PyScriptProvider from "pyscript-react/esm/components/py-script-provider";

function MapCenterUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

const calculateRadiusBasedOnZoom = (zoomLevel) => {
  // Adjust these values based on your requirements
  const baseRadius = 100; // Base radius at a specific zoom level
  const baseZoom = 15; // The zoom level at which base radius is defined
  return baseRadius * Math.pow(2, baseZoom - zoomLevel);
};

function ZoomListener({ setCircleRadius }) {
  useMapEvents({
    zoomend: (e) => {
      const newZoom = e.target.getZoom();
      setCircleRadius(calculateRadiusBasedOnZoom(newZoom));
    },
  });
  return null;
}

export default function Map({ CCS }) {
  const [lat, setLat] = useState(14.87521768575168);
  const [lng, setLng] = useState(101.9988285957337);
  const [circleRadius, setCircleRadius] = useState(100);
  const [dataList, setDataList] = useState([]);
  const [ccs, setCcs] = useState([]);
  const [latitude, setLatitude] = useState([]);
  const [longitude, setLongitude] = useState([]);
  const [mapKey, setMapKey] = useState(Date.now());
  const [clicked, setClicked] = useState(false);

  const style = {
    textDecoration: "underline",
    cursor: "pointer",
    color: clicked ? "gray" : "black", // สีเปลี่ยนเมื่อคลิก
    transform: clicked ? "scale(1)" : "scale(1)", // เพิ่มขนาดเมื่อคลิก
    transition: "transform 0.2s, color 0.2s", // การเปลี่ยนแปลงอย่างเรียบร้อย
  };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     // ทำการรีเฟรช key ของแผนที่เพื่อโหลดข้อมูลใหม่
  //     setMapKey(Date.now());
  //   }, 60000); // ตั้งค่าเวลาในการรีเฟรช (เช่นทุก 60 วินาที)

  //   return () => clearInterval(interval);
  // }, []);

  const sendDataSheeet = async () => {
    try {
      const data = {
        ccs: Number(CCS),
        latitude: Number(latitude), // ใช้ selectedValue ที่นี่
        longitude: Number(longitude),
      };

      const response = await axios.post(
        "https://apilatlng.thetigerteamacademy.net/log/",
        data
      );
      if (response.data.result === "success") {
        console.log("Data sent successfully");
      } else {
        console.error("Failed to send data");
      }
    } catch (error) {
      console.error("There was an error sending the data:", error);
    }
  };

  useEffect(() => {
    // พยายามดึงข้อมูลจาก API ที่สร้างด้วย FastAPI
    axios
      .get("https://apilatlng.thetigerteamacademy.net/get_data/")
      .then((response) => {
        setDataList(response.data);
      })
      .catch((error) => {
        console.error("There was an error retrieving the data", error);
      });
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (err) => {
        console.error(err);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        setClicked(!clicked);
        if (CCS) {
          sendDataSheeet();
          setMapKey(Date.now());
          alert("ดำเนินการเสร็จสิ้น");
          
        } else {
          alert("PredictCCS before Update location");
        }
      },
      (err) => {
        console.error(err);
      },
      { enableHighAccuracy: true }
    );
  };
  // ตัวอย่างข้อมูล CCS
  // const ccsData = [
  //   { lat: lat, lng: lng, ccs: CCS },
  //   // ... other data ...
  // ];

  // const transformedData = dataList.map((item) => ({
  //   lat: item.latitude,
  //   lng: item.longitude,
  //   ccs: item.ccs,
  // }));



  return (
    <div className="map">
      <div>
        <div className="getlocation">
          <a onClick={getCurrentLocation} style={style}>
            <b>Get location</b>
          </a>
          <img src={Icon} style={{ width: "25px" }}></img>
        </div>
        <p>
          latitude:{lat} longitude:{lng}
        </p>
      </div>
      <iframe
        src={`https://mapccs.thetigerteamacademy.net/`}
        style={{ height: "60vh", width: "70vw" }}
        title="Map"
      ></iframe>
    </div>
  );
}
