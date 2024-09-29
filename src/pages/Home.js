import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { DateTime } from "luxon";
import React, { useState, useCallback } from "react";
import Button from "react-bootstrap/Button";
import "../App.css";
import logo from "../image 2.png";
import MapComponent from "../components/Map";

function Home() {
  const [FiberFunc, setFiberFunc] = useState("");
  const [XValue, setXValue] = useState("");
  const [ModelName, setModelName] = useState("");
  const [brixF, setBrixF] = useState("");
  const [result, setResult] = useState(null);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedValueM, setSelectedValueM] = useState("");
  const [isLoading, setIsLoading] = useState(false);



  const sentLatLon = async (lat, lon, ccs) => {
    try {
      const data = {
        ccs: parseFloat(ccs),
        lat: parseFloat(lat),
        lon: parseFloat(lon),
      };

      const response = await axios.post("https://ccs.latlon.thetigerteamacademy.net/geo/", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(response.data);
    } catch (error) {
      console.error('Error sending data:', error.response ? error.response.data : error.message);
    }
  };


  const getUserLocation = (ccs) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          sentLatLon(latitude, longitude, ccs);
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };


  const handleSelect = (value) => {
    const transformedValue = transformValue(value);
    setSelectedValue(transformedValue);
  };

  const handleSelectM = (value) => {
    const transformedValueM = transformValueM(value);
    setSelectedValueM(transformedValueM);
  };

  const transformValue = (value) => {
    switch (value) {
      case "600":
        return "T1";
      case "800":
        return "T2";
      case "1,000":
        return "T3";
      case "1,200":
        return "T4";
      case "1,400":
        return "T5";
      case "1,600":
        return "T6";
      default:
        return value;
    }
  };

  const transformValueM = (value) => {
    switch (value) {
      case "Overall":
        return "finalized";
      case "มิตรภูเขียว":
        return "M1";
      case "มิตรกาฬสินธุ์":
        return "M2";
      case "มิตรภูเวียง":
        return "M3";
      case "มิตรภูหลวง":
        return "M4";
      case "มิตรอำนาจเจริญ":
        return "M5";
      case "มิตรผล ด่านช้าง":
        return "M6";
      case "มิตรผล สิงห์บุนรี":
        return "M7";
      case "มิตรผล เกษตรสมบรูณ์":
        return "M8";
      default:
        return value;
    }
  };

  const handleMonthChange = (event) => {
    setXValue(event.target.value);
  };

  const handlefiberChange = (event) => {
    setFiberFunc(event.target.value);
  };

  const handleModelChange = (event) => {
    setModelName(event.target.value);
  };

  const sendData = async () => {
    setIsLoading(true);
    try {
      const data = {
        BrixF: Number(brixF),
        FiberFunc: "fiber_" + String(selectedValue),
        XValue: Number(XValue),
        ModelName: String(selectedValueM),
      };
      const response = await axios.post("https://apimitphol.ccs.thetigerteamacademy.net/predict/", data);
      setResult(response.data);
      getUserLocation(response.data)
    } catch (error) {
      console.error("There was an error sending the data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const thaiTimestamp = DateTime.now().setZone("Asia/Bangkok").toISO();

  const sendDataSheeet = useCallback(async () => {
    try {
      const data = {
        Timestamp: thaiTimestamp,
        BrixF: Number(brixF),
        FiberFunc: String(FiberFunc),
        XValue: Number(XValue),
        ModelName: String(selectedValueM),
        PredictCCS: Number(result),
      };

      const response = await axios.post("https://apimitphol.ccs.thetigerteamacademy.net/log/", data);
      if (response.data.result === "success") {
        console.log("Data sent successfully");
      } else {
        console.error("Failed to send data");
      }
    } catch (error) {
      console.error("There was an error sending the data:", error);
    }
  }, [thaiTimestamp, brixF, FiberFunc, XValue, selectedValueM, result]);

  React.useEffect(() => {
    if (result) {
      sendDataSheeet();
    }
  }, [result, sendDataSheeet]);

  const clearValues = () => {
    setFiberFunc("");
    setXValue("");
    setModelName("");
    setBrixF("");
    setResult(null);
  };

  return (
    <main>
      <div className="nav">
        <img src={logo} alt="logo" />
      </div>
      <div className="mapcontain p-4">
        <div className="valuecontain">
          <div className="addvalue">
            <FormControl sx={{ m: 0, minWidth: "100%" }}>
              <FormHelperText>
                <b>ระบุเดือน</b>
              </FormHelperText>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={XValue}
                onChange={handleMonthChange}
              >
                {[7, 8, 9, 10, 11, 12].map((month) => (
                  <MenuItem key={month} value={month}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ m: 0, minWidth: "100%" }}>
              <FormHelperText>
                <b>ระดับน้ำฝน</b>
              </FormHelperText>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={FiberFunc}
                onChange={handlefiberChange}
              >
                {["600", "800", "1,000", "1,200", "1,400", "1,600"].map((T) => (
                  <MenuItem key={T} value={T} onClick={() => handleSelect(T)}>
                    {T}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ m: 0, minWidth: "100%" }}>
              <FormHelperText>
                <b>ระบุโรงงาน</b>
              </FormHelperText>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={ModelName}
                onChange={handleModelChange}
              >
                <MenuItem value="Overall" onClick={() => handleSelectM("Overall")}>
                  Overall
                </MenuItem>
                {[
                  "มิตรภูเขียว",
                  "มิตรกาฬสินธุ์",
                  "มิตรภูเวียง",
                  "มิตรภูหลวง",
                  "มิตรอำนาจเจริญ",
                  "มิตรผล ด่านช้าง",
                  "มิตรผล สิงห์บุนรี",
                  "มิตรผล เกษตรสมบรูณ์",
                ].map((F) => (
                  <MenuItem key={F} value={F} onClick={() => handleSelectM(F)}>
                    {F}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              value={brixF}
              onChange={(e) => setBrixF(e.target.value)}
              label=""
              id="outlined-start-adornment"
              sx={{ m: 1, width: "100%" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">Brix(F)</InputAdornment>
                ),
              }}
            />

            <div className="text">
              <div>{result ? "CCS is: " + result : "..."}</div>
            </div>

            <div className="containbutton">
              <div className="button">
                <Button
                  variant="primary"
                  onClick={sendData}
                  disabled={isLoading || [brixF, FiberFunc, XValue, ModelName].some((value) => !value)}
                >
                  {isLoading ? "Predicting..." : "PREDICT CCS"}
                </Button>
                <Button variant="secondary" onClick={clearValues}>
                  CLEAR
                </Button>
              </div>
            </div>
          </div>
        </div>
          <MapComponent />
      </div>
    </main>
  );
}

export default Home;
