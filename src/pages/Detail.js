import cookie from 'react-cookies';
import { useTheme } from '@mui/material/styles';
import GaugeComponent from 'react-gauge-component';
import { Row, Table } from 'react-bootstrap';
import React, { Component, useContext, useEffect, useState } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { toInteger } from 'lodash';
import Iconify from '../components/iconify';
import { setGlobalState, useGlobalState } from '..';
import Expired from './Expired';
import Apis, { endpoints } from '../configs/Apis';
import { MyUserContext } from '../App';

const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function Detail() {
  const [user, dispatch] = useContext(MyUserContext);

  const path = useParams();
  const [data, setData] = useState();
  const [dataCo, setDataCo] = useState([]);
  const [minCo, setMinCo] = useState();
  const [maxCo, setMaxCo] = useState();
  const listener = useGlobalState('message')[0];
  useEffect(() => {
    const loaddata = async () => {
      const res = await Apis.get(`${endpoints.current_data}/${path.id}`, {
        headers: {
          Authorization: `Bearer ${cookie.load('token')}`,
        },
      });
      if (res.data === '') {
        setGlobalState('isAuthorized', false);
      } else {
        setData(res.data);
      }
    };

    const dataHistory = async () => {
      const res = await Apis.get(`${endpoints.historyOFStation}/${path.id}`, {
        headers: {
          Authorization: `Bearer ${cookie.load('token')}`,
        },
      });
      if (res.data === '') {
        setGlobalState('isAuthorized', false);
      } else {
        const responese = [];

        const data2 = [];
        res.data.forEach((element) => {
          responese.push({ x: new Date(toInteger(element.dt) * 1000), y: element.component.co });
        });
        setDataCo(responese);
      }
    };
    const dataMaxCo = async () => {
      const res = await Apis.get(`${endpoints.maxCo}/${path.id}`, {
        headers: {
          Authorization: `Bearer ${cookie.load('token')}`,
        },
      });
      if (res.data === '') {
        setGlobalState('isAuthorized', false);
      } else {
        setMaxCo(res.data);
      }
    };
    const dataMinCo = async () => {
      const res = await Apis.get(`${endpoints.minCo}/${path.id}`, {
        headers: {
          Authorization: `Bearer ${cookie.load('token')}`,
        },
      });
      if (res.data === '') {
        setGlobalState('isAuthorized', false);
      } else {
        setMinCo(res.data);
      }
    };
    dataMaxCo();
    dataMinCo();
    loaddata();
    dataHistory();
  }, [listener]);
  const options = {
    animationEnabled: true,
    theme: 'light2',
    title: {
      text: 'Dữ liệu CO trong 1 giờ qua',
    },
    axisX: {
      valueFormatString: 'DD/MM/YYYY HH:mm:ss',
      crosshair: {
        enabled: true,
        snapToDataPoint: true,
      },
    },
    axisY: {
      title: 'µg/m³',
      includeZero: true,
      crosshair: {
        enabled: true,
      },
    },
    toolTip: {
      shared: true,
    },
    legend: {
      cursor: 'pointer',
      verticalAlign: 'bottom',
      horizontalAlign: 'left',
      dockInsidePlotArea: true,
    },
    data: [
      {
        type: 'line',
        showInLegend: true,
        name: 'CO',
        markerType: 'square',
        xValueFormatString: 'DD/MM/YYYY HH:mm:ss',
        color: '#F08080',
        dataPoints: dataCo,
      },
    ],
  };
  const isAuthorized = useGlobalState('isAuthorized')[0];
  if (isAuthorized === false || data == null || user == null) {
    return (
      <>
        <Expired />
      </>
    );
  }
  return (
    <>
      <div className="container">
        <div className="Row" style={{ display: 'flex' }}>
          <div style={{ width: `calc(100% / ${2})`, height: `calc(100% / ${2})` }}>
            {' '}
            CO (carbon monoxide)
            <GaugeComponent
              type="semicircle"
              style={{ width: `calc(100% / ${1.2})`, height: `calc(100% / ${1.2})` }}
              arc={{
                width: 0.2,
                padding: 0.0005,
                cornerRadius: 1,
                // gradient: true,
                subArcs: [
                  {
                    limit: 1000,
                    color: '#5BE12C',
                    showTick: true,
                    tooltip: {
                      text: 'Nồng độ an toàn',
                    },
                  },
                  {
                    limit: 2000,
                    color: '#b9dd2d',
                    showTick: true,
                    tooltip: {
                      text: 'Nồng độ chấp nhận',
                    },
                  },
                  {
                    limit: 10000,
                    color: '#F5CD19',
                    showTick: true,
                    tooltip: {
                      text: 'Ngưỡng độc tính',
                    },
                  },
                  {
                    color: '#EA4228',
                    tooltip: {
                      text: 'Ngưỡng gây tử vong',
                    },
                  },
                ],
              }}
              pointer={{
                color: '#E0E0E0',
                length: 0.8,
                width: 15,
                // elastic: true,
              }}
              labels={{
                valueLabel: {
                  formatTextValue: (value) => `${value}µg/m³`,
                  style: {
                    fill: `#000000`,
                  },
                },
                tickLabels: {
                  type: 'outer',
                  defaultTickValueConfig: {
                    formatTextValue: (value) => `${value}`,
                    style: {
                      fill: `#000000`,
                      textShadow: ``,
                    },
                  },
                  ticks: [{ value: 0 }],
                },
              }}
              value={data.component.co}
              minValue={0}
              maxValue={20000}
            />
          </div>
          <div style={{ width: `calc(100% / ${2})`, height: `calc(100% / ${2})` }}>
            {' '}
            NO (nitrogen monoxide)
            <GaugeComponent
              type="semicircle"
              style={{ width: `calc(100% / ${1.2})`, height: `calc(100% / ${1.2})` }}
              arc={{
                width: 0.2,
                padding: 0.0005,
                cornerRadius: 1,
                // gradient: true,
                subArcs: [
                  {
                    limit: 1.145,
                    color: '#5BE12C',
                    showTick: true,
                    tooltip: {
                      text: 'Nồng độ an toàn',
                    },
                  },
                  {
                    limit: 2,
                    color: '#F5CD19',
                    showTick: true,
                    tooltip: {
                      text: 'Nồng độ hơi cao',
                    },
                  },
                  {
                    color: '#EA4228',
                    tooltip: {
                      text: 'Nồng độ gây độc tính',
                    },
                  },
                ],
              }}
              pointer={{
                color: '#E0E0E0',
                length: 0.8,
                width: 15,
                // elastic: true,
              }}
              labels={{
                valueLabel: {
                  formatTextValue: (value) => `${value}µg/m³`,
                  style: {
                    fill: `#000000`,
                  },
                },
                tickLabels: {
                  type: 'outer',
                  defaultTickValueConfig: {
                    formatTextValue: (value) => `${value}`,
                    style: {
                      fill: `#000000`,
                      textShadow: ``,
                    },
                  },
                  ticks: [{ value: 0 }],
                },
              }}
              value={data.component.no}
              minValue={0}
              maxValue={3}
            />
          </div>
          <div style={{ width: `calc(100% / ${2})`, height: `calc(100% / ${2})` }}>
            {' '}
            NO2 (nitrogen dioxide)
            <GaugeComponent
              type="semicircle"
              style={{ width: `calc(100% / ${1.2})`, height: `calc(100% / ${1.2})` }}
              arc={{
                width: 0.2,
                padding: 0.0005,
                cornerRadius: 1,
                // gradient: true,
                subArcs: [
                  {
                    limit: 40,
                    color: '#5BE12C',
                    showTick: true,
                    tooltip: {
                      text: 'Nồng độ an toàn',
                    },
                  },
                  {
                    limit: 80,
                    color: '#b9dd2d',
                    showTick: true,
                    tooltip: {
                      text: 'Nồng độ tốt',
                    },
                  },
                  {
                    limit: 180,
                    color: '#F5CD19',
                    showTick: true,
                    tooltip: {
                      text: 'Nồng độ cao',
                    },
                  },
                  {
                    color: '#EA4228',
                    tooltip: {
                      text: 'Nồng độ gây độc tính',
                    },
                  },
                ],
              }}
              pointer={{
                color: '#E0E0E0',
                length: 0.8,
                width: 15,
                // elastic: true,
              }}
              labels={{
                valueLabel: {
                  formatTextValue: (value) => `${value}µg/m³`,
                  style: {
                    fill: `#000000`,
                  },
                },
                tickLabels: {
                  type: 'outer',
                  defaultTickValueConfig: {
                    formatTextValue: (value) => `${value}`,
                    style: {
                      fill: `#000000`,
                      textShadow: ``,
                    },
                  },
                  ticks: [{ value: 0 }],
                },
              }}
              value={data.component.no2}
              minValue={0}
              maxValue={280}
            />
          </div>
          <div style={{ width: `calc(100% / ${2})`, height: `calc(100% / ${2})` }}>
            {' '}
            O3 (ozone)
            <GaugeComponent
              type="semicircle"
              style={{ width: `calc(100% / ${1.2})`, height: `calc(100% / ${1.2})` }}
              arc={{
                width: 0.2,
                padding: 0.0005,
                cornerRadius: 1,
                // gradient: true,
                subArcs: [
                  {
                    limit: 50,
                    color: '#5BE12C',
                    showTick: true,
                    tooltip: {
                      text: 'Nồng độ an toàn',
                    },
                  },
                  {
                    limit: 100,
                    color: '#b9dd2d',
                    showTick: true,
                    tooltip: {
                      text: 'Nồng độ tốt',
                    },
                  },
                  {
                    limit: 150,
                    color: '#F5CD19',
                    showTick: true,
                    tooltip: {
                      text: 'Nồng độ cao',
                    },
                  },
                  {
                    color: '#EA4228',
                    tooltip: {
                      text: 'Nồng độ gây độc tính',
                    },
                  },
                ],
              }}
              pointer={{
                color: '#E0E0E0',
                length: 0.8,
                width: 15,
                // elastic: true,
              }}
              labels={{
                valueLabel: {
                  formatTextValue: (value) => `${value}µg/m³`,
                  style: {
                    fill: `#000000`,
                  },
                },
                tickLabels: {
                  type: 'outer',
                  defaultTickValueConfig: {
                    formatTextValue: (value) => `${value}`,
                    style: {
                      fill: `#000000`,
                      textShadow: ``,
                    },
                  },
                  ticks: [{ value: 0 }],
                },
              }}
              value={data.component.o3}
              minValue={0}
              maxValue={200}
            />
          </div>
        </div>
      </div>
      <div style={{ width: `calc(100% / ${1})`, height: 50 }}> </div>
      <div className="container">
        <div className="Row" style={{ display: 'flex' }}>
          <div style={{ width: `calc(100% / ${2})`, height: `calc(100% / ${2})` }}>
            {' '}
            SO2 (sulphur dioxide)
            <GaugeComponent
              type="semicircle"
              style={{ width: `calc(100% / ${1.2})`, height: `calc(100% / ${1.2})` }}
              arc={{
                width: 0.2,
                padding: 0.0005,
                cornerRadius: 1,
                // gradient: true,
                subArcs: [
                  {
                    limit: 40,
                    color: '#5BE12C',
                    showTick: true,
                    tooltip: {
                      text: 'Nồng độ an toàn',
                    },
                  },
                  {
                    limit: 80,
                    color: '#b9dd2d',
                    showTick: true,
                    tooltip: {
                      text: 'Nồng độ tốt',
                    },
                  },
                  {
                    limit: 380,
                    color: '#F5CD19',
                    showTick: true,
                    tooltip: {
                      text: 'Nồng độ cao',
                    },
                  },
                  {
                    color: '#EA4228',
                    tooltip: {
                      text: 'Nồng độ gây độc tính',
                    },
                  },
                ],
              }}
              pointer={{
                color: '#E0E0E0',
                length: 0.8,
                width: 15,
                // elastic: true,
              }}
              labels={{
                valueLabel: {
                  formatTextValue: (value) => `${value}µg/m³`,
                  style: {
                    fill: `#000000`,
                  },
                },
                tickLabels: {
                  type: 'outer',
                  defaultTickValueConfig: {
                    formatTextValue: (value) => `${value}`,
                    style: {
                      fill: `#000000`,
                      textShadow: ``,
                    },
                  },
                  ticks: [{ value: 0 }],
                },
              }}
              value={data.component.so2}
              minValue={0}
              maxValue={800}
            />
          </div>
          <div style={{ width: `calc(100% / ${2})`, height: `calc(100% / ${2})` }}>
            {' '}
            PM2.5 (Fine particles matter)
            <GaugeComponent
              type="semicircle"
              style={{ width: `calc(100% / ${1.2})`, height: `calc(100% / ${1.2})` }}
              arc={{
                width: 0.2,
                padding: 0.0005,
                cornerRadius: 1,
                // gradient: true,
                subArcs: [
                  {
                    limit: 30,
                    color: '#5BE12C',
                    showTick: true,
                    tooltip: {
                      text: 'Nồng độ an toàn',
                    },
                  },
                  {
                    limit: 60,
                    color: '#b9dd2d',
                    showTick: true,
                    tooltip: {
                      text: 'Nồng độ tốt',
                    },
                  },
                  {
                    limit: 90,
                    color: '#F5CD19',
                    showTick: true,
                    tooltip: {
                      text: 'Nồng độ vừa',
                    },
                  },
                  {
                    color: '#EA4228',
                    tooltip: {
                      text: 'Nồng độ rất cao',
                    },
                  },
                ],
              }}
              pointer={{
                color: '#E0E0E0',
                length: 0.8,
                width: 15,
                // elastic: true,
              }}
              labels={{
                valueLabel: {
                  formatTextValue: (value) => `${value}µg/m³`,
                  style: {
                    fill: `#000000`,
                  },
                },
                tickLabels: {
                  type: 'outer',
                  defaultTickValueConfig: {
                    formatTextValue: (value) => `${value}`,
                    style: {
                      fill: `#000000`,
                      textShadow: ``,
                    },
                  },
                  ticks: [{ value: 0 }],
                },
              }}
              value={data.component.pm2_5}
              minValue={0}
              maxValue={120}
            />
          </div>
          <div style={{ width: `calc(100% / ${2})`, height: `calc(100% / ${2})` }}>
            {' '}
            PM10 (coarse particulate matter)
            <GaugeComponent
              type="semicircle"
              className="abc"
              style={{ width: `calc(100% / ${1.2})`, height: `calc(100% / ${1.2})`, color: `#CCCCCC` }}
              arc={{
                width: 0.2,
                padding: 0.0005,
                cornerRadius: 1,
                // gradient: true,
                subArcs: [
                  {
                    limit: 50,
                    color: '#5BE12C',
                    showTick: true,
                    tooltip: {
                      text: 'Nồng độ an toàn',
                    },
                  },
                  {
                    limit: 150,
                    color: '#b9dd2d',
                    showTick: true,
                    tooltip: {
                      text: 'Nồng độ vừa',
                    },
                  },
                  {
                    limit: 250,
                    color: '#F5CD19',
                    showTick: true,
                    tooltip: {
                      text: 'Nồng độ cao',
                    },
                  },
                  {
                    color: '#EA4228',
                    tooltip: {
                      text: 'Nồng độ rất cao',
                    },
                  },
                ],
              }}
              pointer={{
                color: '#E0E0E0',
                length: 0.8,
                width: 15,
                // elastic: true,
              }}
              labels={{
                valueLabel: {
                  formatTextValue: (value) => `${value}µg/m³`,
                  style: {
                    fill: `#000000`,
                  },
                },
                tickLabels: {
                  type: 'outer',
                  defaultTickValueConfig: {
                    formatTextValue: (value) => `${value}`,
                    style: {
                      fill: `#000000`,
                      textShadow: ``,
                    },
                  },
                  ticks: [{ value: 0 }],
                },
              }}
              value={data.component.pm10}
              minValue={0}
              maxValue={300}
            />
          </div>
          <div style={{ width: `calc(100% / ${2})`, height: `calc(100% / ${2})` }}>
            {' '}
            NH3 (ammonia)
            <GaugeComponent
              type="semicircle"
              style={{ width: `calc(100% / ${1.2})`, height: `calc(100% / ${1.2})` }}
              arc={{
                width: 0.2,
                padding: 0.0005,
                cornerRadius: 1,
                // gradient: true,
                subArcs: [
                  {
                    limit: 200,
                    color: '#5BE12C',
                    showTick: true,
                    tooltip: {
                      text: 'Nồng độ an toàn',
                    },
                  },
                  {
                    limit: 400,
                    color: '#F5CD19',
                    showTick: true,
                    tooltip: {
                      text: 'Nồng độ tốt',
                    },
                  },
                  {
                    limit: 800,
                    color: '#F5CD19',
                    showTick: true,
                    tooltip: {
                      text: 'Nồng độ cao',
                    },
                  },
                  {
                    color: '#EA4228',
                    tooltip: {
                      text: 'Nồng độ rất cao',
                    },
                  },
                ],
              }}
              pointer={{
                color: '#E0E0E0',
                length: 0.8,
                width: 15,
                // elastic: true,
              }}
              labels={{
                valueLabel: {
                  formatTextValue: (value) => `${value}µg/m³`,
                  style: {
                    fill: `#000000`,
                  },
                },
                tickLabels: {
                  type: 'outer',
                  defaultTickValueConfig: {
                    formatTextValue: (value) => `${value}`,
                    style: {
                      fill: `#000000`,
                      textShadow: ``,
                    },
                  },
                  ticks: [{ value: 0 }],
                },
              }}
              value={data.component.nh3}
              minValue={0}
              maxValue={1200}
            />
          </div>
        </div>
      </div>
      <div style={{ width: `calc(100% / ${1})`, height: 50 }}> </div>
      <div className="container">
        <div className="Row" style={{ display: 'flex' }}>
          <div style={{ width: `calc(100% / ${1.1})` }}>
            <CanvasJSChart options={options} />
          </div>
          <div
            style={{ width: `calc(100% / ${1.3})`, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <div>
              <Table striped bordered hover border={1}>
                <thead>
                  <tr>
                    <th style={{ padding: '0px 20px 0px 20px', textAlign: 'center' }}>Name</th>
                    <th style={{ padding: '0px 20px 0px 20px', textAlign: 'center' }}>Min </th>
                    <th style={{ padding: '0px 20px 0px 20px', textAlign: 'center' }}>Max </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>CO</td>
                    <td>{minCo} µg/m³</td>
                    <td>{maxCo} µg/m³</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
