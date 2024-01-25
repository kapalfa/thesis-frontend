import React, { useEffect, useState } from "react";
import axios from "axios";
import OutputWindow from "./OutputWindow.jsx";
import CustomInput from "./CustomInput";
import OutputDetails from "./OutputDetails.jsx";

const Landing = ({mydata}) => {
 // const [code, setCode] = useState(javascriptDefault);
  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(null);
  //const [theme, setTheme] = useState("cobalt");
 // const [language, setLanguage] = useState('javascript');
 
  const handleCompile = () => {
    setProcessing(true);
    const formData = {
      language_id: 48,
      // encode source code in base64
      source_code: btoa(mydata),
      stdin: btoa(customInput),
    };
    const options = {
      method: "POST",
      url: 'https://judge0-ce.p.rapidapi.com/submissions',
      params: { base64_encoded: "true", fields: "*" },
      headers: {
       // "content-type": "application/json",
       // "Content-Type": "application/json",
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": '753e575bd0mshe75c35e71e4a08fp192405jsn2737e4662253',
      },
      data: formData,
    };

    axios
      .request(options)
      .then(function (response) {
        console.log("res.data", response.data);
        const token = response.data.token;
        checkStatus(token);
      })
      .catch((err) => {
        let error = err.response ? err.response.data : err;
        // get error status
        //let status = err.response.status;
        //console.log("status", status);
        //if (status === 429) {
          //console.log("too many requests", status);

        //}
        setProcessing(false);
        console.log("catch block...", error);
      });
  };

  const checkStatus = async (token) => {
    const options = {
      method: "GET",
      url: 'https://judge0-ce.p.rapidapi.com/submissions/' + token,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": '753e575bd0mshe75c35e71e4a08fp192405jsn2737e4662253',
      },
    };
    try {
      let response = await axios.request(options);
      let statusId = response.data.status?.id;

      // Processed - we have a result
      if (statusId === 1 || statusId === 2) {
        // still processing
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
        return;
      } else {
        setProcessing(false);
        setOutputDetails(response.data);
        console.log("response.data", response.data);
        return;
      }
    } catch (err) {
      console.log("err", err);
      setProcessing(false);
    }
  };

  return (
    <>
      <div className="flex flex-row space-x-4 items-start px-4 py-4">         
        <div className="right-container flex flex-shrink-0 w-[30%] flex-col">
          <OutputWindow outputDetails={outputDetails} />
          <div className="flex flex-col items-end">
           <CustomInput
              customInput={customInput}
             setCustomInput={setCustomInput}
            />
            <button
              onClick={handleCompile}
              disabled={!mydata}
            >
              {processing ? "Processing..." : "Compile and Execute"}
            </button>
          </div>
          {outputDetails && <OutputDetails outputDetails={outputDetails} />}
        </div>
      </div>
    </>
  );
};
export default Landing;