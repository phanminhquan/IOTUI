import React, { useContext, useEffect, useState, Component } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import cookie from 'react-cookies';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import CanvasJSReact from '@canvasjs/react-charts';
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
  if (isAuthorized === false || data == null || user == null) {
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
      text: 'Number of New Customers',
    },
    axisY: {
      title: 'Number of Customers',
    },
    toolTip: {
      shared: true,
    },
    data: [
      {
        type: 'spline',
        name: '2016',
        showInLegend: true,
        dataPoints: [
          { y: 155, label: 'Jan' },
          { y: 150, label: 'Feb' },
          { y: 152, label: 'Mar' },
          { y: 148, label: 'Apr' },
          { y: 142, label: 'May' },
          { y: 150, label: 'Jun' },
          { y: 146, label: 'Jul' },
          { y: 149, label: 'Aug' },
          { y: 153, label: 'Sept' },
          { y: 158, label: 'Oct' },
          { y: 154, label: 'Nov' },
          { y: 150, label: 'Dec' },
        ],
      },
      {
        type: 'spline',
        name: '2017',
        showInLegend: true,
        dataPoints: [
          { y: 172, label: 'Jan' },
          { y: 173, label: 'Feb' },
          { y: 175, label: 'Mar' },
          { y: 172, label: 'Apr' },
          { y: 162, label: 'May' },
          { y: 165, label: 'Jun' },
          { y: 172, label: 'Jul' },
          { y: 168, label: 'Aug' },
          { y: 175, label: 'Sept' },
          { y: 170, label: 'Oct' },
          { y: 165, label: 'Nov' },
          { y: 169, label: 'Dec' },
        ],
      },
      {
        type: 'spline',
        name: '2018',
        showInLegend: true,
        dataPoints: [
          { y: 155, label: 'Jan' },
          { y: 150, label: 'Feb' },
          { y: 152, label: 'Mar' },
          { y: 148, label: 'Apr' },
          { y: 149, label: 'May' },
          { y: 150, label: 'Jun' },
          { y: 146, label: 'Jul' },
          { y: 149, label: 'Aug' },
          { y: 153, label: 'Sept' },
          { y: 158, label: 'Oct' },
          { y: 154, label: 'Nov' },
          { y: 123, label: 'Dec' },
        ],
      },
      {
        type: 'spline',
        name: '2019',
        showInLegend: true,
        dataPoints: [
          { y: 155, label: 'Jan' },
          { y: 150, label: 'Feb' },
          { y: 152, label: 'Mar' },
          { y: 128, label: 'Apr' },
          { y: 142, label: 'May' },
          { y: 150, label: 'Jun' },
          { y: 146, label: 'Jul' },
          { y: 149, label: 'Aug' },
          { y: 153, label: 'Sept' },
          { y: 178, label: 'Oct' },
          { y: 154, label: 'Nov' },
          { y: 150, label: 'Dec' },
        ],
      },
      {
        type: 'spline',
        name: '2020',
        showInLegend: true,
        dataPoints: [
          { y: 140, label: 'Jan' },
          { y: 150, label: 'Feb' },
          { y: 152, label: 'Mar' },
          { y: 148, label: 'Apr' },
          { y: 122, label: 'May' },
          { y: 150, label: 'Jun' },
          { y: 146, label: 'Jul' },
          { y: 149, label: 'Aug' },
          { y: 153, label: 'Sept' },
          { y: 158, label: 'Oct' },
          { y: 154, label: 'Nov' },
          { y: 150, label: 'Dec' },
        ],
      },
    ],
  };
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
