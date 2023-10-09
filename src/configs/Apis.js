import axios from 'axios';
import cookie from 'react-cookies';

const SERVER = 'http://localhost:9000';

export const endpoints = {
  login: '/authenticate',
  current_user: '/api/current-user',
  register: '/sign-up',
  loaddata: '/data',
  getExpirationDate: '/expirationOfToken',
  historyOFStation: '/api/history',
  current_data: '/api/current',
  allStation: '/api/all-staion',
  minCo: '/api/minCO',
  maxCo: '/api/maxCO',
  station: '/api/datastation',
  checkemail: "/checkusername/",
  generateOTP :"/generateOtp",
  validateOTP:'/validateOtp'
};
export const authApi = () => {
  return axios.create({
    baseURL: SERVER,
    headers: {
      Authorization: `Bearer ${cookie.load('token')}`,
    },
  });
};


export default axios.create({
  baseURL: SERVER,
});
