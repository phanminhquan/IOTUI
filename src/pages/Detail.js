import cookie from 'react-cookies';
import { useTheme } from '@mui/material/styles';
import GaugeComponent from 'react-gauge-component';
import { Row, Table } from 'react-bootstrap';
import React, { Component, useContext, useEffect, useState } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { set, toInteger } from 'lodash';
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
  const [dataNO, setDataNo] = useState([]);
  const [dataNO2, setDataNO2] = useState([]);
  const [dataO3, setDataO3] = useState([]);
  const [dataSO2, setDataSO2] = useState([]);
  const [dataPM25, setDataPM25] = useState([]);
  const [dataPM10, setDataPM10] = useState([]);
  const [dataNH3, setDataNH3] = useState([]);
  const [minCo, setMinCo] = useState();
  const [maxCo, setMaxCo] = useState();
  const [minNO, setMinNO] = useState();
  const [maxNO, setMaxNO] = useState();
  const [minNO2, setMinNO2] = useState();
  const [maxNO2, setMaxNO2] = useState();
  const [minO3, setMinO3] = useState();
  const [maxO3, setMaxO3] = useState();
  const [minSO2, setMinSO2] = useState();
  const [maxSO2, setMaxSO2] = useState();
  const [minPm25, setMinPm25] = useState();
  const [maxPm25, setMaxPm25] = useState();
  const [minPm10, setMinPm10] = useState();
  const [maxPm10, setMaxPm10] = useState();
  const [minNH3, setMinNH3] = useState();
  const [maxNH3, setMaxNH3] = useState();
  
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
        const resDataNO = [];
        const resDataNO2 = [];
        const resDataO3 = [];
        const resDataSO2 = []
        const resDataPM25 = []
        const resDataPM10 = []
        const resDataNH3 = []
        const data2 = [];
        res.data.forEach((element) => {
          responese.push({ x: new Date(toInteger(element.dt) * 1000), y: element.component.co });
          resDataNO.push({ x: new Date(toInteger(element.dt) * 1000), y: element.component.no });
          resDataNO2.push({ x: new Date(toInteger(element.dt) * 1000), y: element.component.no2 });
          resDataO3.push({ x: new Date(toInteger(element.dt) * 1000), y: element.component.o3 });
          resDataSO2.push({ x: new Date(toInteger(element.dt) * 1000), y: element.component.so2 });
          resDataPM25.push({ x: new Date(toInteger(element.dt) * 1000), y: element.component.pm2_5 });
          resDataPM10.push({ x: new Date(toInteger(element.dt) * 1000), y: element.component.pm10 });
          resDataNH3.push({ x: new Date(toInteger(element.dt) * 1000), y: element.component.nh3 });
        });
        setDataCo(responese);
        setDataNo(resDataNO);
        setDataNO2(resDataNO2);
        setDataO3(resDataO3);
        setDataSO2(resDataSO2);
        setDataPM25(resDataPM25);
        setDataPM10(resDataPM10);
        setDataNH3(resDataNH3);
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
        setMaxCo(res.data.co);
        setMaxNO(res.data.no);
        setMaxNO2(res.data.no2);
        setMaxO3(res.data.o3);
        setMaxSO2(res.data.so2);
        setMaxPm25(res.data.pm25);
        setMaxPm10(res.data.pm10);
        setMaxNH3(res.data.nh3);
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
        setMinCo(res.data.co);
        setMinNO(res.data.no);
        setMinNO2(res.data.no2);
        setMinO3(res.data.o3);
        setMinSO2(res.data.so2);
        setMinPm25(res.data.pm25);
        setMinPm10(res.data.pm10);
        setMinNH3(res.data.nh3);
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
  const optionsNO = {
    animationEnabled: true,
    theme: 'light2',
    title: {
      text: 'Dữ liệu NO trong 1 giờ qua',
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
        name: 'NO',
        markerType: 'square',
        xValueFormatString: 'DD/MM/YYYY HH:mm:ss',
        color: '#F08080',
        dataPoints: dataNO,
      },
    ],
  };
  const optionsNO2 = {
    animationEnabled: true,
    theme: 'light2',
    title: {
      text: 'Dữ liệu NO2 trong 1 giờ qua',
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
        name: 'NO2',
        markerType: 'square',
        xValueFormatString: 'DD/MM/YYYY HH:mm:ss',
        color: '#F08080',
        dataPoints: dataNO2,
      },
    ],
  };
  const optionsO3 = {
    animationEnabled: true,
    theme: 'light2',
    title: {
      text: 'Dữ liệu O3 trong 1 giờ qua',
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
        name: 'O3',
        markerType: 'square',
        xValueFormatString: 'DD/MM/YYYY HH:mm:ss',
        color: '#F08080',
        dataPoints: dataO3,
      },
    ],
  };
  const optionsSO2 = {
    animationEnabled: true,
    theme: 'light2',
    title: {
      text: 'Dữ liệu SO2 trong 1 giờ qua',
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
        name: 'SO2',
        markerType: 'square',
        xValueFormatString: 'DD/MM/YYYY HH:mm:ss',
        color: '#F08080',
        dataPoints: dataSO2,
      },
    ],
  };
  const optionsPM25 = {
    animationEnabled: true,
    theme: 'light2',
    title: {
      text: 'Dữ liệu PM2_5 trong 1 giờ qua',
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
        name: 'pm2_5',
        markerType: 'square',
        xValueFormatString: 'DD/MM/YYYY HH:mm:ss',
        color: '#F08080',
        dataPoints: dataPM25,
      },
    ],
  };
  const optionsPM10 = {
    animationEnabled: true,
    theme: 'light2',
    title: {
      text: 'Dữ liệu PM10 trong 1 giờ qua',
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
        name: 'pm10',
        markerType: 'square',
        xValueFormatString: 'DD/MM/YYYY HH:mm:ss',
        color: '#F08080',
        dataPoints: dataPM10,
      },
    ],
  };
  const optionsNH3 = {
    animationEnabled: true,
    theme: 'light2',
    title: {
      text: 'Dữ liệu NH3 trong 1 giờ qua',
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
        name: 'NH3',
        markerType: 'square',
        xValueFormatString: 'DD/MM/YYYY HH:mm:ss',
        color: '#F08080',
        dataPoints: dataNH3,
      },
    ],
  };
  const isAuthorized = useGlobalState('isAuthorized')[0];
  if (isAuthorized === false || user == null) {
    return (
      <>
        <Expired />
      </>
    );
  }
  if(data == null) return (<></>)
  return (
    <>
      <div className="container">
      <div style={{ width: `calc(100% / ${2})`, height: `calc(100% / ${2})`,margin: 'auto' }}>
            {' '}
            <h3>AQI</h3>
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
                  formatTextValue: (value) => `${value}`,
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
              value={data.main.aqi}
              minValue={0}
              maxValue={200}
            />
          </div>
          <br/>
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
                    limit: 134,
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
              maxValue={600}
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
          <div style={{ width: `calc(100% / ${1})` }}>
            <CanvasJSChart options={options} />
          </div>
          <div
            style={{
              width: `calc(79%)`,
              display: 'flex',
              justifyContent: 'end',
              alignItems: 'end',
              position: 'absolute',
            }}
          >
            <div>
              <Table striped bordered hover border={1}>
                <thead>
                  <tr>
                    <th style={{ padding: '0px 20px 0px 20px', textAlign: 'center' }}>Min </th>
                    <th style={{ padding: '0px 20px 0px 20px', textAlign: 'center' }}>Max </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{minCo} µg/m³</td>
                    <td>{maxCo} µg/m³</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
      <div style={{ width: `calc(100% / ${1})`, height: 50 }}> </div>
      <div className="container">
        <div className="Row" style={{ display: 'flex' }}>
          <div style={{ width: `calc(100% / ${1})` }}>
            <CanvasJSChart options={optionsNO} />
          </div>
          <div
            style={{
              width: `calc(79%)`,
              display: 'flex',
              justifyContent: 'end',
              alignItems: 'end',
              position: 'absolute',
            }}
          >
            <div>
              <Table striped bordered hover border={1}>
                <thead>
                  <tr>
                    <th style={{ padding: '0px 20px 0px 20px', textAlign: 'center' }}>Min </th>
                    <th style={{ padding: '0px 20px 0px 20px', textAlign: 'center' }}>Max </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{minNO} µg/m³</td>
                    <td>{maxNO} µg/m³</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
      <div style={{ width: `calc(100% / ${1})`, height: 50 }}> </div>
      <div className="container">
        <div className="Row" style={{ display: 'flex' }}>
          <div style={{ width: `calc(100% / ${1})` }}>
            <CanvasJSChart options={optionsNO2} />
          </div>
          <div
            style={{
              width: `calc(79%)`,
              display: 'flex',
              justifyContent: 'end',
              alignItems: 'end',
              position: 'absolute',
            }}
          >
            <div>
              <Table striped bordered hover border={1}>
                <thead>
                  <tr>
                    <th style={{ padding: '0px 20px 0px 20px', textAlign: 'center' }}>Min </th>
                    <th style={{ padding: '0px 20px 0px 20px', textAlign: 'center' }}>Max </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{minNO2} µg/m³</td>
                    <td>{maxNO2} µg/m³</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
      <div style={{ width: `calc(100% / ${1})`, height: 50 }}> </div>
      <div className="container">
        <div className="Row" style={{ display: 'flex' }}>
          <div style={{ width: `calc(100% / ${1})` }}>
            <CanvasJSChart options={optionsO3} />
          </div>
          <div
            style={{
              width: `calc(79%)`,
              display: 'flex',
              justifyContent: 'end',
              alignItems: 'end',
              position: 'absolute',
            }}
          >
            <div>
              <Table striped bordered hover border={1}>
                <thead>
                  <tr>
                    <th style={{ padding: '0px 20px 0px 20px', textAlign: 'center' }}>Min </th>
                    <th style={{ padding: '0px 20px 0px 20px', textAlign: 'center' }}>Max </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{minO3} µg/m³</td>
                    <td>{maxO3} µg/m³</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
      <div style={{ width: `calc(100% / ${1})`, height: 50 }}> </div>
      
      <div style={{ width: `calc(100% / ${1})`, height: 50 }}> </div>
      <div className="container">
        <div className="Row" style={{ display: 'flex' }}>
          <div style={{ width: `calc(100% / ${1})` }}>
            <CanvasJSChart options={optionsSO2} />
          </div>
          <div
            style={{
              width: `calc(79%)`,
              display: 'flex',
              justifyContent: 'end',
              alignItems: 'end',
              position: 'absolute',
            }}
          >
            <div>
              <Table striped bordered hover border={1}>
                <thead>
                  <tr>
                    <th style={{ padding: '0px 20px 0px 20px', textAlign: 'center' }}>Min </th>
                    <th style={{ padding: '0px 20px 0px 20px', textAlign: 'center' }}>Max </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{minSO2} µg/m³</td>
                    <td>{maxSO2} µg/m³</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
      <div style={{ width: `calc(100% / ${1})`, height: 50 }}> </div>
      <div className="container">
        <div className="Row" style={{ display: 'flex' }}>
          <div style={{ width: `calc(100% / ${1})` }}>
            <CanvasJSChart options={optionsPM25 } />
          </div>
          <div
            style={{
              width: `calc(79%)`,
              display: 'flex',
              justifyContent: 'end',
              alignItems: 'end',
              position: 'absolute',
            }}
          >
            <div>
              <Table striped bordered hover border={1}>
                <thead>
                  <tr>
                    <th style={{ padding: '0px 20px 0px 20px', textAlign: 'center' }}>Min </th>
                    <th style={{ padding: '0px 20px 0px 20px', textAlign: 'center' }}>Max </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{minPm25} µg/m³</td>
                    <td>{maxPm25} µg/m³</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
      <div style={{ width: `calc(100% / ${1})`, height: 50 }}> </div>
      <div className="container">
        <div className="Row" style={{ display: 'flex' }}>
          <div style={{ width: `calc(100% / ${1})` }}>
            <CanvasJSChart options={optionsPM10} />
          </div>
          <div
            style={{
              width: `calc(79%)`,
              display: 'flex',
              justifyContent: 'end',
              alignItems: 'end',
              position: 'absolute',
            }}
          >
            <div>
              <Table striped bordered hover border={1}>
                <thead>
                  <tr>
                    <th style={{ padding: '0px 20px 0px 20px', textAlign: 'center' }}>Min </th>
                    <th style={{ padding: '0px 20px 0px 20px', textAlign: 'center' }}>Max </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{minPm10} µg/m³</td>
                    <td>{maxPm10} µg/m³</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
      <div style={{ width: `calc(100% / ${1})`, height: 50 }}> </div>
      <div className="container">
        <div className="Row" style={{ display: 'flex' }}>
          <div style={{ width: `calc(100% / ${1})` }}>
            <CanvasJSChart options={optionsNH3} />
          </div>
          <div
            style={{
              width: `calc(79%)`,
              display: 'flex',
              justifyContent: 'end',
              alignItems: 'end',
              position: 'absolute',
            }}
          >
            <div>
              <Table striped bordered hover border={1}>
                <thead>
                  <tr>
                    <th style={{ padding: '0px 20px 0px 20px', textAlign: 'center' }}>Min </th>
                    <th style={{ padding: '0px 20px 0px 20px', textAlign: 'center' }}>Max </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{minNH3} µg/m³</td>
                    <td>{maxNH3} µg/m³</td>
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
