import cookie from "react-cookies";
import { useTheme } from '@mui/material/styles';
import GaugeComponent from 'react-gauge-component';
import { Row } from 'react-bootstrap';
import React, { Component, useContext, useEffect, useState } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
import { Link, useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { toInteger } from "lodash";
import Iconify from '../components/iconify';
import { setGlobalState, useGlobalState } from "..";
import Expired from "./Expired";
import Apis, { endpoints } from "../configs/Apis";
import { MyUserContext } from "../App";








const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function Detail() {

  const [user, dispatch] = useContext(MyUserContext);

  const path = useParams();
  const [data, setData] = useState();
  const [dataCo, setDataCo] = useState([]);
  const listener = useGlobalState("message")[0];
  useEffect(() => {
    const loaddata = async () => {
      const res = await Apis.get(`${endpoints.current_data}/${path.id}`, {
        headers: {
          Authorization: `Bearer ${cookie.load("token")}`,
        },
      }
      )
      if (res.data === '') {
        setGlobalState("isAuthorized", false)
      }
      else {
        setData(res.data);
      }
    }

    const dataHistory = async () => {
      const res = await Apis.get(`${endpoints.historyOFStation}/${path.id}`, {
        headers: {
          Authorization: `Bearer ${cookie.load("token")}`,
        },
      })
      if (res.data === '') {
        setGlobalState("isAuthorized", false)
      }
      else {
        const responese = []
        res.data.forEach(element => {
          responese.push({ x: new Date(toInteger(element.dt)*1000), y: element.component.co })
        });
        setDataCo(responese)

      }
    }
    loaddata();
    dataHistory();

  }, [listener]);
  console.log(dataCo)
  const options = {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: "Dữ liệu CO trong 1 giờ qua"
    },
    axisX: {
      valueFormatString: "DD/MM/YYYY HH:mm:ss",
      crosshair: {
        enabled: true,
        snapToDataPoint: true
      }
    },
    axisY: {
      title: "µg/m³",
      includeZero: true,
      crosshair: {
        enabled: true
      }
    },
    toolTip: {
      shared: true
    },
    legend: {
      cursor: "pointer",
      verticalAlign: "bottom",
      horizontalAlign: "left",
      dockInsidePlotArea: true,

    },
    data: [
      {
        type: "line",
        showInLegend: true,
        name: "CO",
        markerType: "square",
        xValueFormatString: "DD/MM/YYYY HH:mm:ss",
        color: "#F08080",
        dataPoints: dataCo,
      },
    ],
  };
  const option1 = {
    theme: 'light1',
    animationEnabled: true,
    exportEnabled: true,
    title: {
      text: '',
    },
    axisY: {
      title: 'Nhiệt độ',
      suffix: ' °C',
    },
    axisX: {
      title: 'Giờ trong ngày',
      prefix: '',
      interval: 1,
    },
    data: [
      {
        type: 'rangeArea',
        xValueFormatString: '',
        yValueFormatString: '#0.## °C',
        toolTipContent: ' <span style="color:#6D78AD">{x}</span><br><b>Min:</b> {y[0]}<br><b>Max:</b> {y[1]}',
        dataPoints: [
          { x: 1, y: [37, 55] },
          { x: 2, y: [37, 57] },
          { x: 3, y: [43, 63] },
          { x: 4, y: [46, 68] },
          { x: 5, y: [55, 75] },
          { x: 6, y: [63, 84] },
          { x: 7, y: [66, 90] },
        ]
      },
    ],
  };
  const isAuthorized = useGlobalState("isAuthorized")[0]
  if (isAuthorized === false || data == null || user == null) {
    return (<>
      <Expired />
    </>)
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
                    limit: 40,
                    color: '#F5CD19',
                    showTick: true,
                    tooltip: {
                      text: 'Nồng độ an toàn',
                    },
                  },
                  {
                    limit: 80,
                    color: '#5BE12C',
                    showTick: true,
                    tooltip: {
                      text: 'Nồng độ tối đa cho phép ngắn hạn',
                    },
                  },
                  {
                    limit: 916,
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
              maxValue={1000}
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
                    limit: 0.2,
                    color: '#5BE12C',
                    showTick: true,
                    tooltip: {
                      text: 'Nồng độ an toàn',
                    },
                  },
                  {
                    limit: 2.5,
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
              maxValue={3}
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
                    limit: 100,
                    color: '#5BE12C',
                    showTick: true,
                    tooltip: {
                      text: 'Nồng độ an toàn',
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
                    limit: 0.2,
                    color: '#5BE12C',
                    showTick: true,
                    tooltip: {
                      text: 'Nồng độ an toàn',
                    },
                  },
                  {
                    limit: 2.5,
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
              maxValue={3}
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
                    limit: 12,
                    color: '#5BE12C',
                    showTick: true,
                    tooltip: {
                      text: 'Nồng độ an toàn',
                    },
                  },
                  {
                    limit: 35,
                    color: '#F5CD19',
                    showTick: true,
                    tooltip: {
                      text: 'Nồng độ vừa',
                    },
                  },
                  {
                    limit: 55,
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
              value={data.component.pm2_5}
              minValue={0}
              maxValue={70}
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
                    color: '#F5CD19',
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
                    limit: 0.25,
                    color: '#5BE12C',
                    showTick: true,
                    tooltip: {
                      text: 'Nồng độ an toàn',
                    },
                  },
                  {
                    limit: 0.5,
                    color: '#F5CD19',
                    showTick: true,
                    tooltip: {
                      text: 'Nồng độ vừa',
                    },
                  },
                  {
                    limit: 1,
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
              maxValue={1.5}
            />
          </div>
        </div>
      </div>
      <div style={{ width: `calc(100% / ${1})`, height: 50 }}> </div>
      <div className="container">
        <div className="Row" style={{ display: 'flex' }}>
          <div style={{ width: `calc(100% / ${2})` }}>
            <CanvasJSChart options={options} />
          </div>
          <div style={{ width: `calc(100% / ${2})` }}>
            <CanvasJSChart options={option1} />
          </div>
        </div>
      </div>
    </>
  );
}
