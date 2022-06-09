import axios from "axios";

const BackendClient = axios.create({
  baseURL: "http://0.0.0.0:9000",
  headers: {
    "Content-type": "application/json"
  }
});

export default BackendClient;
