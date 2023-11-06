import React, { useState, useEffect } from "react";
import axios from "axios";

function Listdata() {
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    // พยายามดึงข้อมูลจาก API ที่สร้างด้วย FastAPI
    axios
      .get("https://ccs.api.thetigerteamacademy.net/get_data")
      .then((response) => {
        setDataList(response.data);
      })
      .catch((error) => {
        console.error("There was an error retrieving the data", error);
      });
  }, []); // ใช้ useEffect เพื่อดึงข้อมูลเมื่อ component ถูกเรนเดอร์ครั้งแรก

  function convertFiberValue(value) {
    if (value.startsWith("fiber_")) {
      return value.replace("fiber_", "");
    }
    return value;
  }
  function convertModelName(value) {
    if (value.startsWith("finalized")) {
      return value.replace("finalized", "Overall");
    }
    return value;
  }

  return (
    <div style={{ color: "black", padding: "20px" }}>
      {dataList.map((item, index) => (
        <div key={index}>
          <p>เวลาPredict: {item.Timestamp}</p>
          <p>Brix(F): {item.BrixF}</p>
          <p>ระบุเดือน: {item.XValue}</p>
          <p>ระบุดับน้ำฝน: {convertFiberValue(item.FiberFunc)}</p>
          <p>ระบุโรงงาน: {convertModelName(item.ModelName)}</p>
          <p>CCS: {item.PredictCCS}</p>
          <hr></hr>
        </div>
      ))}
    </div>
  );
}

export default Listdata;
