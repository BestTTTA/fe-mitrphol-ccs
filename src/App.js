import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./image 2.png";
import "./App.css";
import Button from "react-bootstrap/Button";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { IconButton } from "@mui/material";


import axios from "axios";

function BasicExample() {

  // const URL = process.env.URL;

  const sendData = async () => {
    try {
      const response = await axios.post(
        "https://apimitphol.thetigerteamacademy.net/predict/",
        {
          "BrixF": Number(brixF),
          "Fiber": Number(fiber)
        }
      );
  
      console.log(response.data);
      setResult(response.data);
    } catch (error) {
      console.error("There was an error sending the data:", error);
    }
  };
  

  // const [brix, setBrix] = React.useState("");
  // const [pol, setPol] = React.useState("");
  // const [purity, setPurity] = React.useState("");
  const [fiber, setFiber] = React.useState("");
  const [brixF, setBrixF] = React.useState("");
  const [result, setResult] = React.useState(null);

  const clearValues = () => {
    // setBrix("");
    // setPol("");
    // setPurity("");
    setFiber("");
    setBrixF("");
    setResult("");
  };

  return (
    <div>
      <div className="nav">
        <img src={logo} alt="logo" />
      </div>
      <div className="valueconatin">
        <div className="addvalue">
          <TextField
            value={fiber}
            onChange={(e) => setFiber(e.target.value)}
            label=""
            id="outlined-start-adornment"
            sx={{ m: 1, width: "100%" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">%Fiber </InputAdornment>
              ),
            }}
          />
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
              <div>
                {" "}
                {result ? "CCS is: " + (result && result.prediction) : "..."}
              </div>
            </text>
          </div>
          <div className="button">
            <Button
              variant="primary"
              onClick={sendData}
              disabled={[fiber, brixF].some(
                (value) => !value
              )}
            >
              PREDICT
            </Button>
            <Button variant="secondary" onClick={clearValues}>
              CLEAR
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BasicExample;
