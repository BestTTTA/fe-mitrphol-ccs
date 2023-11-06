import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { DateTime } from "luxon";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import "../App.css";
import logo from "../image 2.png";

function Home() {
  // const [api, setApi] = React.useState("httpss://apimitphol.thetigerteamacademy.net/predict/");
  // const [api, setApi] = React.useState("http://127.0.0.1:8000/predict/");
  const [FiberFunc, setFiberFunc] = useState("T3");
  const [XValue, setXValue] = useState("");
  const [ModelName, setModelName] = useState("");
  const [brixF, setBrixF] = React.useState("");
  const [result, setResult] = React.useState(null);

  const handleMonthChange = (event) => {
    setXValue(event.target.value);
  };
  const handlefiberChange = (event) => {
    setFiberFunc(event.target.value);
  };
  const handleModelChange = (event) => {
    setModelName(event.target.value);
  };

  const Overall = "finalized";

  const sendData = async () => {
    try {
      const data = {
        BrixF: Number(brixF),
        FiberFunc: "fiber_" + String(FiberFunc),
        XValue: Number(XValue),
        ModelName: String(ModelName),
      };
      const response = await axios.post("https://ccs.api.thetigerteamacademy.net/predict/", data);
      setResult(response.data);
    } catch (error) {
      console.error("There was an error sending the data:", error);
      console.error("Error:", error.response.data);
    }
  };

  React.useEffect(() => {
    if (result) {
      sendDataSheeet();
    }
  }, [result]);

  const thaiTimestamp = DateTime.now().setZone("Asia/Bangkok").toISO();
  const sendDataSheeet = async () => {
    try {
      const data = {
        Timestamp: thaiTimestamp,
        BrixF: Number(brixF),
        FiberFunc: String(FiberFunc),
        XValue: Number(XValue),
        ModelName: String(ModelName),
        PredictCCS: Number(result),
      };

      const response = await axios.post("https://ccs.api.thetigerteamacademy.net/log/", data);
      if (response.data.result === "success") {
        console.log("Data sent successfully");
      } else {
        console.error("Failed to send data");
      }
    } catch (error) {
      console.error("There was an error sending the data:", error);
    }
  };

  const clearValues = () => {
    setFiberFunc("");
    setXValue("");
    setModelName("");
    setBrixF("");
    setResult("");
  };

  return (
    <div>
      <div className="nav">
        <img src={logo} alt="logo" />
      </div>
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
              {["T1", "T2", "T3", "T4", "T5", "T6"].map((T) => (
                <MenuItem key={T} value={T}>
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
              <MenuItem value={Overall}>Overall</MenuItem>
              {["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9"].map(
                (F) => (
                  <MenuItem key={F} value={F}>
                    {F}
                  </MenuItem>
                )
              )}
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
                <InputAdornment position="start">Brix(F) </InputAdornment>
              ),
            }}
          />
          <div className="text">
            <text>
              <div> {result ? "CCS is: " + result : "..."}</div>
            </text>
          </div>
          <div className="containbutton">
            <div className="button">
              <Button
                variant="primary"
                onClick={sendData}
                disabled={[brixF, FiberFunc, XValue, ModelName].some(
                  (value) => !value
                )}
              >
                PREDICT CCS
              </Button>
              <Button variant="secondary" onClick={clearValues}>
                CLEAR
              </Button>
              <div className="list">
                {/* <Link to="/Listdata">
                  <img
                    src={Scrip}
                    height="40px"
                    style={{ cursor: "pointer" }}
                  />
                </Link> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
