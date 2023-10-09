import React, { useContext, useEffect, useState, Component } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import cookie from 'react-cookies';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import CanvasJSReact from '@canvasjs/react-charts';
import { toInteger } from 'lodash';
import Apis, { endpoints } from '../configs/Apis';
import Button from '../theme/overrides/Button';
import { setGlobalState, useGlobalState } from '..';
import { MyUserContext } from '../App';

// components
import Iconify from '../components/iconify';
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';
import Expired from './Expired';

const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;
// sections

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const [user, dispatch] = useContext(MyUserContext);
  const theme = useTheme();
  const navigate = useNavigate();
  const choose = (id) => {
    navigate(`/app/${id}`);
  };

  const [data, setData] = useState();
  const [data1, setData1] = useState();
  const [data2, setData2] = useState();
  const [data3, setData3] = useState();
  const [data4, setData4] = useState();
  const [data5, setData5] = useState();
  const listener = useGlobalState('message')[0];
  useEffect(() => {
    const loaddata = async () => {
      const res = await Apis.get(endpoints.allStation, {
        headers: {
          Authorization: `Bearer ${cookie.load('token')}`,
        },
      });
      console.log(res);
      if (res.data === '') {
        setGlobalState('isAuthorized', false);
      } else {
        setData(res.data);
        console.log(data);
      }
    };
    const datastation1 = async () => {
      const res = await Apis.get(`${endpoints.station}/station1`, {
        headers: {
          Authorization: `Bearer ${cookie.load('token')}`,
        },
      });
      if (res.data === '') {
        setGlobalState('isAuthorized', false);
      } else {
        const responese = [];
        console.log(data);
        res.data.forEach((element) => {
          responese.push({ y: element.component.co, x: new Date(toInteger(element.dt) * 1000) });
        });
        setData1(responese);
      }
    };
    const datastation2 = async () => {
      const res = await Apis.get(`${endpoints.station}/station2`, {
        headers: {
          Authorization: `Bearer ${cookie.load('token')}`,
        },
      });
      if (res.data === '') {
        setGlobalState('isAuthorized', false);
      } else {
        const responese = [];
        console.log(data);
        res.data.forEach((element) => {
          responese.push({ y: element.component.co, x: new Date(toInteger(element.dt) * 1000) });
        });
        setData2(responese);
      }
    };
    const datastation3 = async () => {
      const res = await Apis.get(`${endpoints.station}/station3`, {
        headers: {
          Authorization: `Bearer ${cookie.load('token')}`,
        },
      });
      if (res.data === '') {
        setGlobalState('isAuthorized', false);
      } else {
        const responese = [];
        console.log(data);
        res.data.forEach((element) => {
          responese.push({ y: element.component.co, x: new Date(toInteger(element.dt) * 1000) });
        });
        setData3(responese);
      }
    };
    const datastation4 = async () => {
      const res = await Apis.get(`${endpoints.station}/station4`, {
        headers: {
          Authorization: `Bearer ${cookie.load('token')}`,
        },
      });
      if (res.data === '') {
        setGlobalState('isAuthorized', false);
      } else {
        const responese = [];
        console.log(data);
        res.data.forEach((element) => {
          responese.push({ y: element.component.co, x: new Date(toInteger(element.dt) * 1000) });
        });
        setData4(responese);
      }
    };
    const datastation5 = async () => {
      const res = await Apis.get(`${endpoints.station}/station5`, {
        headers: {
          Authorization: `Bearer ${cookie.load('token')}`,
        },
      });
      if (res.data === '') {
        setGlobalState('isAuthorized', false);
      } else {
        const responese = [];
        console.log(data);
        res.data.forEach((element) => {
          responese.push({ y: element.component.co, x: new Date(toInteger(element.dt) * 1000) });
        });
        setData5(responese);
      }
    };

    datastation1();
    datastation2();
    datastation3();
    datastation4();
    datastation5();
    loaddata();
  }, [listener]);

  const isAuthorized = useGlobalState('isAuthorized')[0];
  const formatTitle = (str) => {
    return str
      .slice(0, 1)
      .toUpperCase()
      .concat(str.slice(1, 7).concat(` ${str.substring(7, 9)}`));
  };

  if (user == null) return <Navigate to="/login" />;
  if (isAuthorized === false || user == null) {
    return (
      <>
        <Expired />
      </>
    );
  }
  // data chart
  const options = {
    animationEnabled: true,
    title: {
      text: 'Dữ liệu CO trong vòng 24h của các trạm',
    },
    axisY: {
      title: 'µg/m³',
    },
    toolTip: {
      shared: true,
    },
    data: [
      {
        type: 'spline',
        name: 'Station1',
        showInLegend: true,
        dataPoints: data1,
      },
      {
        type: 'spline',
        name: 'Station2',
        showInLegend: true,
        dataPoints: data2,
      },
      {
        type: 'spline',
        name: 'Station3',
        showInLegend: true,
        dataPoints: data3,
      },
      {
        type: 'spline',
        name: 'Station4',
        showInLegend: true,
        dataPoints: data4,
      },
      {
        type: 'spline',
        name: 'Station5',
        showInLegend: true,
        dataPoints: data5,
      },
    ],
  };
  if(data == null)
  return(<></>)
  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          {data.map((element) => {
            return (
              <Grid item xs={12} sm={6} md={3}>
                <Link style={{ textDecoration: 'none' }} to={`/dashboard/info/${element.id}`}>
                  <AppWidgetSummary
                    title={formatTitle(element.id)}
                    color="success"
                    icon={'ant-design:desktop-outlined'}
                  />
                </Link>
              </Grid>
            );
          })}
        </Grid>
        <div>
          <CanvasJSChart options={options} />
          {}
        </div>
      </Container>
    </>
  );
}
