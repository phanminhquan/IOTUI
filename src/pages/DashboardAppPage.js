import { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, Navigate, useNavigate } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';

import { DataContext, MyUserContext } from '../App';
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



// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const [user, dispatch] = useContext(MyUserContext);
  const [data, dispatchData] = useContext(DataContext); 
  const theme = useTheme();
  const navigate = useNavigate();
  const choose = (id) => {
    navigate(`/app/${id}`)
  }

  if (user == null)
        return <Navigate to="/login" />
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

          <Grid item xs={12} sm={6} md={3}>
            <Link style={{ textDecoration: 'none' }} to={"/dashboard/tram/1"} >
              <AppWidgetSummary title="Trạm 1" color="success" icon={'ant-design:desktop-outlined'} />
            </Link>
          </Grid>


          <Grid item xs={12} sm={6} md={3}>
            <Link style={{ textDecoration: 'none' }} to={"/dashboard/tram/2"} >
              <AppWidgetSummary title="Trạm 2" color="success" icon={'ant-design:desktop-outlined'} />
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Link style={{ textDecoration: 'none' }} to={"/dashboard/tram/3"} >
              <AppWidgetSummary title="Trạm 3" color="success" icon={'ant-design:desktop-outlined'} />
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Link style={{ textDecoration: 'none' }} to={"/dashboard/tram/4"} >
              <AppWidgetSummary title="Trạm 4" color="error" icon={'ant-design:desktop-outlined'} />
            </Link>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Link style={{ textDecoration: 'none' }} to={"/dashboard/tram/5"} >
              <AppWidgetSummary title="Trạm 5" color="error" icon={'ant-design:desktop-outlined'} />
            </Link>
          </Grid>
        </Grid>

      </Container>
    </>
  );
}
