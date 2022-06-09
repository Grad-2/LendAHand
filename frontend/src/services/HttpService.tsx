import axios from "axios";

const BackendClient = axios.create({
  baseURL: "http://172.17.0.1:9000",
  headers: {
    "Content-type": "application/json"
  }
});

export default BackendClient;
