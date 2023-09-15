import React, { createContext, useReducer } from 'react';
import cookie from "react-cookies";
import { BrowserRouter, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
// routes
// import { over } from 'stompjs'
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import MyUserReducer from './produces/MyUserReducer';
import DataReducer from './produces/DataReducer';




// ----------------------------------------------------------------------

export const MyUserContext = createContext();
export const DataContext = createContext();

export default function App() {
  let stompClient = null;
  const [user, dispatch] = useReducer(MyUserReducer, cookie.load("user") || null);
  const [data, dispatchData] = useReducer(DataReducer, null);

  const onPrivateMessage = (payload) => {
    const payloadData = JSON.parse(payload.body);
    console.log(payloadData);
    dispatchData({
      "type": "reset"
    })
  }
  const onError = (err) => {
    console.log(err);

  }
  const userJoin = () => {
    const chatMessage = {
      senderName: 'client',
      status: "JOIN"
    };
    stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
  }


  React.useEffect(() => {
    const Sock = new SockJS('http://localhost:9000/ws');
    stompClient = over(Sock);
    stompClient.connect({}, () => {
      stompClient.subscribe('/user/client/private', onPrivateMessage);
      userJoin();
    }, onError)
  }, []);
  return (
    <MyUserContext.Provider value={[user, dispatch]}>
      <DataContext.Provider value={[data, dispatchData]}>
        <HelmetProvider>
          <BrowserRouter>
            <ThemeProvider>
              <ScrollToTop />
              <StyledChart />
              <Router />
            </ThemeProvider>
          </BrowserRouter>
        </HelmetProvider>
      </DataContext.Provider>
    </MyUserContext.Provider>
  );
}
