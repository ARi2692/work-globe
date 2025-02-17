import * as React from "react";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Buffer } from "buffer";
import { getConfigByChain } from "../config";
import Job from "../artifacts/contracts/JobContract.sol/JobContract.json";
import { useAccount, useNetwork } from "wagmi";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Grid, Button, TextField } from "@mui/material";
import { useLocation } from "react-router-dom";
import { ButtonBase, Paper } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { create as ipfsHttpClient } from "ipfs-http-client";

import EmployerNavBar from "../components/EmployerNavBar";

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: "#1fe47a",
          "&:hover": {
            transform: "scale(1.05)",
            backgroundColor: "#1fe47a",
          },
        },
      },
    },
  },
});

const projectId = "2DkWK5numOIP1H7GyUZ3aEPhLXK";
const projectSecret = "9c669d03ed7813aae7dc0a32c5cfd386";
const projectIdAndSecret = `${projectId}:${projectSecret}`;
//const client = ipfsHttpClient("https://nftmarketcover.infura-ipfs.io:5001/api/v0")
const client = ipfsHttpClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: `Basic ${
      (Buffer.from(projectIdAndSecret).toString, "base64")
    }`,
  },
});

function Application(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const [cv, setCv] = React.useState();
  const { chain } = useNetwork();
  const [formInput, updateFormInput] = useState({
    name: "",
    experience: "",
    location: "",
  });
  const { address } = useAccount();

  async function onChange(e) {
    const file = e.target.files[0];
    console.log("file", client);

    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      console.log("added is:", client);
      const url = `https://nftmarketcover.infura-ipfs.io/ipfs/${added.path}`;
      console.log(`File uploaded is: ${url}`);
      setCv(url);
    } catch (e) {
      console.log(`Error is: ${e}`);
    }
  }
  

  async function applyNow() {
    await window.ethereum.send("eth_requestAccounts"); // opens up metamask extension and connects Web2 to Web3
    const provider = new ethers.providers.Web3Provider(window.ethereum); //create provider
    const signer = provider.getSigner();
    const network = await provider.getNetwork();
    const contract = new ethers.Contract(
      getConfigByChain(chain?.id)[0].contractProxyAddress,
      Job.abi,
      signer
    );
    console.log(location.state.jobId);
    debugger
    const tx = await contract.applyForJob(
      location.state.jobId,
      formInput.name,
      formInput.experience,
      formInput.location,
      cv
    );
    toast.success("Creating block... Please Wait", { icon: "👏" });
    const receipt = await provider
      .waitForTransaction(tx.hash, 1, 150000)
      .then(() => {
        toast.success("Application Done !!");
      });
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder="false" />
      <ThemeProvider theme={theme}>
        <Grid container spacing={3} justify="center">
          <Grid item xs={12}>
            <Typography variant="h6" component="h2">
              Apply for Position at {location.state.companyName} for &nbsp;
              {location.state.position}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="outlined-basic"
              label="Your Name"
              variant="outlined"
              onChange={(e) =>
                updateFormInput((formInput) => ({
                  ...formInput,
                  name: e.target.value,
                }))
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="outlined-basic"
              label="Your Experience"
              variant="outlined"
              onChange={(e) =>
                updateFormInput((formInput) => ({
                  ...formInput,
                  experience: e.target.value,
                }))
              }
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              id="outlined-basic"
              label="City"
              variant="outlined"
              onChange={(e) =>
                updateFormInput((formInput) => ({
                  ...formInput,
                  location: e.target.value,
                }))
              }
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <input type="file" name="Asset" onChange={onChange} />
          </Grid>

          <Grid item xs={4} />
          <Grid item xs={4}>
            <Button variant="contained" onClick={() => applyNow()}>
              Apply
            </Button>
          </Grid>
          <Grid item xs={4} />
        </Grid>
      </ThemeProvider>
    </>
  );
}

export default Application;
