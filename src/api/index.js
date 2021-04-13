import axios from "axios";

const api = axios.create({
  baseURL: "http://test.ok.paymo.uz/public/",
  headers: {
    "Content-Type": "application/json",
  },
});
export default api;
