import { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import cookie from "react-cookies";
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import Apis, { endpoints } from '../configs/Apis';
import Button from '../theme/overrides/Button';
import { setGlobalState, useGlobalState } from '..';
import { MyUserContext } from '../App';
// components
import Iconify from '../components/iconify';
// sections
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






// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const [user, dispatch] = useContext(MyUserContext);
  const theme = useTheme();
  const navigate = useNavigate();
  const choose = (id) => {
    navigate(`/app/${id}`)
  }

  const [data, setData] = useState();
  const listener = useGlobalState("message")[0];
  useEffect(() => {
    const loaddata = async () => {
      const res = await Apis.get(endpoints.allStation, {
        headers: {
          Authorization: `Bearer ${cookie.load("token")}`,
        },
      }
      )
      console.log(res)
      if (res.data === '') {
        setGlobalState("isAuthorized", false)
      }
      else {
        setData(res.data);
        console.log(data)
      }
    }
    loaddata();

  }, [listener]);

  const isAuthorized = useGlobalState("isAuthorized")[0]
  const formatTitle = (str) =>{
    return  str.slice(0,1).toUpperCase().concat(str.slice(1, 7).concat(` ${str.substring(7,9)}`));
  }

  if (user == null)
    return <Navigate to="/login" />
  if (isAuthorized === false || data == null || user == null) {
    return (<>
      <Expired />
    </>)
  }
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
          {data.map(element => {
            return <Grid item xs={12} sm={6} md={3}>
              <Link style={{ textDecoration: 'none' }} to={`/dashboard/info/${element.id}`} >
                <AppWidgetSummary title={formatTitle(element.id)} color="success" icon={'ant-design:desktop-outlined'} />
              </Link>
            </Grid>
          })}
        </Grid>

      </Container>
    </>
  );
}
