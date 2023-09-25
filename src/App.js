import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./image 2.png";
import "./App.css";
import Button from "react-bootstrap/Button";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { IconButton } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import axios from "axios";

function BasicExample() {
  const [api, setApi] = React.useState("httpss://apimitphol.thetigerteamacademy.net/predict/");

  const handleChange = (event) => {
    setApi(event.target.value);
  };

  // const URL = process.env.URL;

  const sendData = async () => {
    try {
      const response = await axios.post(
        // "httpss://apimitphol.thetigerteamacademy.net/predict/",
        api,
        {
          BrixF: Number(brixF),
          Fiber: Number(fiber),
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
      <div className="valuecontain">
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
          <div className="containbutton">
            <FormControl sx={{ m: 1, minWidth: 167 }}>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                onChange={handleChange}
              >
                <MenuItem value="https://ccs.api.thetigerteamacademy.net/predict/">
                Finalized_model
                </MenuItem>
                <MenuItem value="https://ccs.api.thetigerteamacademy.net/predictM1/">
                  Model 1
                </MenuItem>
                <MenuItem value="https://ccs.api.thetigerteamacademy.net/predictM2/">
                  Model 2
                </MenuItem>
                <MenuItem value="https://ccs.api.thetigerteamacademy.net/predictM3/">
                  Model 3
                </MenuItem>
                <MenuItem value="https://ccs.api.thetigerteamacademy.net/predictM4/">
                  Model 4
                </MenuItem>
                <MenuItem value="https://ccs.api.thetigerteamacademy.net/predictM5/">
                  Model 5
                </MenuItem>
                <MenuItem value="https://ccs.api.thetigerteamacademy.net/predictM6/">
                  Model 6
                </MenuItem>
                <MenuItem value="https://ccs.api.thetigerteamacademy.net/predictM7/">
                  Model 7
                </MenuItem>
                <MenuItem value="https://ccs.api.thetigerteamacademy.net/predictM8/">
                  Model 8
                </MenuItem>
                <MenuItem value="https://ccs.api.thetigerteamacademy.net/predictM9/">
                  Model 9
                </MenuItem>
              </Select>
              {/* <FormHelperText>With label + helper text</FormHelperText> */}
            </FormControl>
            <div className="button">
              <Button
                variant="primary"
                onClick={sendData}
                disabled={[fiber, brixF].some((value) => !value)}
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
    </div>
  );
}

export default BasicExample;
