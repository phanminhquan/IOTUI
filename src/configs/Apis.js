import axios from "axios";
import cookie from "react-cookies";

const SERVER = "http://localhost:9000";

export const endpoints = {
  login: "/authenticate",
  current_user: "/api/current-user",
  register: "/sign-up",
  loaddata: "/api/data"

};
export const authApi = () => {
  return axios.create({
    baseURL: SERVER,
    headers: {
      Authorization: `Bearer ${cookie.load("token")}`,
    },
  });
};

export default axios.create({
  baseURL: SERVER,
});
