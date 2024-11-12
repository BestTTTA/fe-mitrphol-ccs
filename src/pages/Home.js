import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { DateTime } from "luxon";
import React, { useState, useCallback, useEffect } from "react";
import Button from "react-bootstrap/Button";
import "../App.css";
import logo from "../image 2.png";
import MapComponent from "../components/Map";

function Home() {
  const [FiberFunc, setFiberFunc] = useState("");
  const [XValue, setXValue] = useState("");
  const [ModelName, setModelName] = useState("");
  const [brixFLast, setBrixFLast] = useState(null);
  const [brixFMiddle, setBrixFMiddle] = useState(null);
  const [brixFBegin, setBrixFBegin] = useState(null);
  const [brixFAvg, setBrixFAvg] = useState(null);
  const [result, setResult] = useState(null);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedValueM, setSelectedValueM] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [sumRain, setSumRain] = useState(0);
  const [month, setMonth] = useState(7);

  const getStartAndEndDate = () => {
    const today = new Date();

    const startDate = new Date(today.getFullYear(), 0, 1); 
    const startDateString = startDate.toISOString().split("T")[0];

    // Set end date to two days before today
    const endDate = new Date(today);
    endDate.setDate(today.getDate() - 2);
    const endDateString = endDate.toISOString().split("T")[0];

    // Extract and format the dates (without hyphens)
    const startDateFormatted = startDateString.replace(/-/g, "");
    const endDateFormatted = endDateString.replace(/-/g, "");

    setStartDate(startDateFormatted);
    setEndDate(endDateFormatted);
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLat(latitude);
          setLon(longitude);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const clickGetBoth = () => {
    getStartAndEndDate();
    getUserLocation();
  }

  // useEffect(() => {
  //   getStartAndEndDate();
  //   getUserLocation();
  // }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchNasaPowerData = useCallback(async () => {
    const apiUrl = `https://power.larc.nasa.gov/api/temporal/daily/point?start=${startDate}&end=${endDate}&latitude=${lat}&longitude=${lon}&community=AG&parameters=PRECTOTCORR&format=JSON`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.status}`);
      }
      const data = await response.json();
      const precipitationData = data.properties.parameter.PRECTOTCORR;
      let totalSum = 0;
      for (const date in precipitationData) {
        const value = precipitationData[date];
        if (value >= 0) {
          totalSum += value;
        }
      }
      setSumRain(totalSum);
    } catch (error) {
      console.error("Failed to fetch NASA POWER API data:", error);
    }
  });

  useEffect(() => {
    if (startDate && endDate && lat && lon) {
      fetchNasaPowerData();
    }
  }, [startDate, endDate, lat, lon, fetchNasaPowerData]);

  const selectTBasedOnRain = (rain) => {
    if (rain <= 600) return "T1";
    if (rain >= 600 && rain <= 800) return "T2";
    if (rain >= 800 && rain <= 1000) return "T3";
    if (rain >= 1000 && rain <= 1200) return "T4";
    if (rain >= 1200 && rain <= 1400) return "T5";
    if (rain >= 1400 && rain <= 1600) return "T6";
    return "T6";
  };

  const selectedModel = (model) => {
    switch (model) {
      case "finalized":
        return "Overall";
      case "M1":
        return "มิตรภูเขียว";
      case "M2":
        return "มิตรกาฬสินธุ์";
      case "M3":
        return "มิตรภูเวียง";
      case "M4":
        return "มิตรภูหลวง";
      case "M5":
        return "มิตรอำนาจเจริญ";
      case "M6":
        return "มิตรผล ด่านช้าง";
      case "M7":
        return "มิตรผล สิงห์บุนรี";
      case "M9":
        return "มิตรผล เกษตรสมบรูณ์";
      default:
        return model;
    }
  };

  // Automatically select T when sumRain changes
  useEffect(() => {
    const selectedT = selectTBasedOnRain(sumRain);
    setSelectedValue(selectedT);
  }, [sumRain]); // Trigger whenever sumRain changes

  const handleSelectM = (value) => {
    const transformedValueM = transformValueM(value);
    setSelectedValueM(transformedValueM);
  };
  const handleModelChange = (event) => {
    setModelName(event.target.value);
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

  const predictData = async () => {
    setIsLoading(true);
    try {
      const data = {
        BrixF: brixFAvg,
        FiberFunc: "fiber_" + String(selectedValue),
        XValue: Number(month),
        ModelName: String(selectedValueM),
      };
      const response = await axios.post("https://apimitphol.ccs.thetigerteamacademy.net/predict/", data);
      setResult(response.data);
      sentLatLon(response.data)
    } catch (error) {
      console.error("There was an error sending the data:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const thaiTimestamp = DateTime.now().setZone("Asia/Bangkok").toISO();

  // month 7-12
  const sentLatLon = async (ccs) => {
    try {
      const data = {
        ccs: parseFloat(ccs),
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        month: parseFloat(month),
        precipitation: parseFloat(sumRain),
        factory: selectedModel(selectedValueM),
        brix: parseFloat(brixFAvg),
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

  const sendDataSheeet = useCallback(async () => {
    try {
      const data = {
        Timestamp: thaiTimestamp,
        BrixF: Number(brixFAvg),
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
  }, [thaiTimestamp, brixFAvg, FiberFunc, XValue, selectedValueM, result]);

  useEffect(() => {
    if (result) {
      sendDataSheeet();
    }
  }, [result, sendDataSheeet]);

  const clearValues = () => {
    setFiberFunc("");
    setXValue(7);
    setModelName("");
    setBrixFLast("");
    setBrixFMiddle("");
    setBrixFBegin("");
    setResult("");
  };

  useEffect(() => {
    if (brixFBegin !== null && brixFMiddle !== null && brixFLast !== null) {
      const brixF = Number(brixFBegin) + Number(brixFMiddle) + Number(brixFLast);
      const brixFAvg = brixF / 3;
      setBrixFAvg(Number(brixFAvg));
    }
  }, [brixFBegin, brixFMiddle, brixFLast]);

  return (
    <main>
      <div className="nav">
        <img src={logo} alt="logo" />
      </div>
      <div className="p-4 flex gap-2">
        <div className="bg-white p-4 rounded-md drop-shadow-md shadow-md items-center flex flex-col">
          <div className="flex w-full flex-col">
            <p>Latitude: {lat}</p>
            <p>Longitude: {lon}</p>
            <p>Precipitation: {sumRain}</p>
          </div>
          <div className="mb-2">
            <button onClick={clickGetBoth} className="underline hover:text-blue-500">Click here to get the location.</button>
          </div>
          <FormControl sx={{ m: 0, minWidth: "100%" }}>
            <FormHelperText>
              <b>Choose Factory</b>
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

          <FormControl sx={{ m: 0, minWidth: "100%" }}>
            <FormHelperText>
              <b>อายุของอ้อย(เดือน)</b>
            </FormHelperText>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {/* สร้างรายการตัวเลือกสำหรับตัวเลข 7 ถึง 12 */}
              {[7, 8, 9, 10, 11, 12].map((number) => (
                <MenuItem key={number} value={number} onClick={() => setMonth(number)}>
                  {number}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            value={brixFLast}
            onChange={(e) => setBrixFLast(e.target.value)}
            label=""
            id="outlined-start-adornment"
            sx={{ mt: 1, width: "100%" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">Brix(F)-ปลายต้น</InputAdornment>
              ),
            }}
          />
          <TextField
            value={brixFMiddle}
            onChange={(e) => setBrixFMiddle(e.target.value)}
            label=""
            id="outlined-start-adornment"
            sx={{ mt: 1, width: "100%" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">Brix(F)-กลางต้น</InputAdornment>
              ),
            }}
          />
          <TextField
            value={brixFBegin}
            onChange={(e) => setBrixFBegin(e.target.value)}
            label=""
            id="outlined-start-adornment"
            sx={{ mt: 1, width: "100%" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">Brix(F)-โคนต้น</InputAdornment>
              ),
            }}
          />

          {
            brixFAvg ? (
              <p>ค่าเฉลี่ย BrixF: {brixFAvg}</p>
            ) : null
          }

          <div className="flex flex-col justify-center items-center ">
            <div className="my-2">{result ? "CCS result: " + result : "..."}</div>
          </div>
          <div className="flex w-full justify-center gap-2">
            <Button
              variant="primary"
              onClick={predictData}
              disabled={isLoading || [brixFLast, brixFMiddle, brixFBegin, ModelName, sumRain].some((value) => !value)}
            >
              {isLoading ? "Predicting..." : "PREDICT CCS"}
            </Button>
            <Button variant="secondary" onClick={clearValues}>
              CLEAR
            </Button>
          </div>
        </div>
        <MapComponent lat={lat} lon={lon} />
      </div>
    </main>
  );
}

export default Home;
