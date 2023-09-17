
import { useTheme } from '@mui/material/styles';
import GaugeComponent from 'react-gauge-component';
import { Row } from 'react-bootstrap';
import React, { Component } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
import Iconify from '../components/iconify';
 
const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;
 

export default function Detail() {

  const options = {
    animationEnabled: true,
    exportEnabled: true,
    theme: 'dark1', // 'light1', 'dark1', 'dark2'
    title: {
      text: 'Giao Động Nhiệt Độ',
    },
    axisY: {
      title: 'Nhiệt độ',
      suffix: '°C',
    },
    axisX: {
      title: 'Giờ trong ngày',
      prefix: '',
      interval: 1,
    },
    data: [
      {
        type: 'line',
        toolTipContent: 'Hour {x}: {y}°C',
        dataPoints: [
          { x: 1, y: 28 },
          { x: 2, y: 30 },
          { x: 3, y: 32 },
          { x: 4, y: 26 },
          
        ],
      },
    ],
  };
  return (
    <>
      <div className="container" style={{backgroundColor: '#2a2a2a'}}>
        <div className="Row" style={{ display: 'flex'}}>
        <div style={{ width: `calc(100% / ${2})`, height: `calc(100% / ${2})` , color:"white"}}> Nhiệt độ
            <GaugeComponent
              type="semicircle"
              style={{ width: `calc(100% / ${1.2})`, height: `calc(100% / ${1.2})`, backgroundColor: '#2a2a2a' }}
              arc={{
                width: 0.2,
                padding: 0.0005,
                cornerRadius: 1,
                // gradient: true,
                subArcs: [
                  {
                    limit: 16,
                    color: '#EA4228',
                    showTick: true,
                    tooltip: {
                      text: 'Nhiệt độ quá thấp',
                    },
                    onClick: () => console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'),
                    onMouseMove: () => console.log('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB'),
                    onMouseLeave: () => console.log('CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC'),
                  },
                  {
                    limit: 25,
                    color: '#F5CD19',
                    showTick: true,
                    tooltip: {
                      text: 'Nhiệt độ thấp',
                    },
                  },
                  {
                    limit: 33,
                    color: '#5BE12C',
                    showTick: true,
                    tooltip: {
                      text: 'Nhiệt độ lý tưởng',
                    },
                  },
                  {
                    limit: 40,
                    color: '#F5CD19',
                    showTick: true,
                    tooltip: {
                      text: 'Nhiệt độ cao',
                    },
                  },
                  {
                    
                    color: '#EA4228',
                    tooltip: {
                      text: 'Nhiệt độ ở mức cảnh báo',
                    },
                  },
                ],
              }}
              pointer={{
                color: '#345243',
                length: 0.8,
                width: 15,
                // elastic: true,
              }}
              labels={{
                valueLabel: { formatTextValue: value => `${value}°C` },
                tickLabels: {
                  type: 'outer',
                  valueConfig: { formatTextValue: value => `${value}°C`, fontSize: 10 },
                  ticks: [{ value: 0 }, { value: 25 }, { value: 33 }],
                },
              }}
              value={30}
              minValue={0}
              maxValue={50}
            />
          </div>
          <div style={{ width: `calc(100% / ${2})`, height: `calc(100% / ${2})` , color:"white"}}> Độ ẩm
            <GaugeComponent
              type="semicircle"
              style={{ width: `calc(100% / ${1.2})`, height: `calc(100% / ${1.2})`, backgroundColor: '#2a2a2a' }}
              arc={{
                width: 0.2,
                padding: 0.0005,
                cornerRadius: 1,
                // gradient: true,
                subArcs: [
                  {
                    limit: 0,
                    color: '#EA4228',
                    showTick: true,
                    tooltip: {
                      text: 'Too low temperature!',
                    },
                    onClick: () => console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'),
                    onMouseMove: () => console.log('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB'),
                    onMouseLeave: () => console.log('CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC'),
                  },
                  {
                    limit: 30,
                    color: '#F5CD19',
                    showTick: true,
                    tooltip: {
                      text: 'Khá khô',
                    },
                  },
                  {
                    limit: 60,
                    color: '#5BE12C',
                    showTick: true,
                    tooltip: {
                      text: 'Mức độ thoải mái',
                    },
                  },
                  {
                    limit: 100,
                    color: '#F5CD19',
                    showTick: true,
                    tooltip: {
                      text: 'Khá ẩm',
                    },
                  },
                  {
                    color: '#EA4228',
                    tooltip: {
                      text: 'Too high temperature!',
                    },
                  },
                ],
              }}
              pointer={{
                color: '#345243',
                length: 0.8,
                width: 15,
                // elastic: true,
              }}
              labels={{
                valueLabel: { formatTextValue: value => `${value}% RH` },
                tickLabels: {
                  type: 'outer',
                  valueConfig: { formatTextValue: value => `${value}% RH`, fontSize: 10 },
                  ticks: [{ value: 0 }, { value: 60 }, { value: 100 }],
                },
              }}
              value={50}
              minValue={0}
              maxValue={100}
            />
          </div>
          <div style={{ width: `calc(100% / ${2})`, height: `calc(100% / ${2})` , color:"white"}}> Độ bụi
            <GaugeComponent
              type="semicircle"
              style={{ width: `calc(100% / ${1.2})`, height: `calc(100% / ${1.2})`, backgroundColor: '#2a2a2a' }}
              arc={{
                width: 0.2,
                padding: 0.0005,
                cornerRadius: 1,
                // gradient: true,
                subArcs: [
                  {
                    limit: 0,
                    color: '#EA4228',
                    showTick: true,
                    tooltip: {
                      text: 'Too low temperature!',
                    },
                    onClick: () => console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'),
                    onMouseMove: () => console.log('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB'),
                    onMouseLeave: () => console.log('CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC'),
                  },
                  {
                    limit: 6,
                    color: '#F5CD19',
                    showTick: true,
                    tooltip: {
                      text: 'Độ bụi ở mức lý tưởng',
                    },
                  },
                  {
                    limit: 12,
                    color: '#5BE12C',
                    showTick: true,
                    tooltip: {
                      text: 'Độ bụi ở mức an toàn',
                    },
                  },
                  {
                    limit: 14,
                    color: '#F5CD19',
                    showTick: true,
                    tooltip: {
                      text: 'Độ bụi ở mức cảnh báo',
                    },
                  },
                  {
                    color: '#EA4228',
                    tooltip: {
                      text: 'Too high temperature!',
                    },
                  },
                ],
              }}
              pointer={{
                color: '#345243',
                length: 0.8,
                width: 15,
                // elastic: true,
              }}
              labels={{
                valueLabel: { formatTextValue: value => `${value}µm` },
                tickLabels: {
                  type: 'outer',
                  valueConfig: { formatTextValue: value => `${value}µm`, fontSize: 10 },
                  ticks: [{ value: 0 }, { value: 6 }, { value: 14 }],
                },
              }}
              value={4}
              minValue={0}
              maxValue={14}
            />
          </div>
          <div style={{ width: `calc(100% / ${2})`, height: `calc(100% / ${2})` , color:"white"}}> Độ CO2
            <GaugeComponent
              type="semicircle"
              style={{ width: `calc(100% / ${1.2})`, height: `calc(100% / ${1.2})`, backgroundColor: '#2a2a2a' }}
              arc={{
                width: 0.2,
                padding: 0.0005,
                cornerRadius: 1,
                // gradient: true,
                subArcs: [
                  {
                    limit: 0,
                    color: '#EA4228',
                    showTick: true,
                    tooltip: {
                      text: 'Too low temperature!',
                    },
                    onClick: () => console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'),
                    onMouseMove: () => console.log('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB'),
                    onMouseLeave: () => console.log('CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC'),
                  },
                  {
                    limit: 300,
                    color: '#F5CD19',
                    showTick: true,
                    tooltip: {
                      text: 'Low temperature!',
                    },
                  },
                  {
                    limit: 400,
                    color: '#5BE12C',
                    showTick: true,
                    tooltip: {
                      text: 'OK temperature!',
                    },
                  },
                  {
                    limit: 1000,
                    color: '#F5CD19',
                    showTick: true,
                    tooltip: {
                      text: 'High temperature!',
                    },
                  },
                  {
                    color: '#EA4228',
                    tooltip: {
                      text: 'Too high temperature!',
                    },
                  },
                ],
              }}
              pointer={{
                color: '#345243',
                length: 0.8,
                width: 15,
                // elastic: true,
              }}
              labels={{
                valueLabel: { formatTextValue: value => `${value}ppm` },
                tickLabels: {
                  type: 'outer',
                  valueConfig: { formatTextValue: value => `${value}ppm`, fontSize: 10 },
                  ticks: [{ value: 0 }, { value: 500 }, { value: 1000 }],
                },
              }}
              value={300}
              minValue={0}
              maxValue={2000}
            />
          </div>
        </div>
        <div className='Row'>
          <div>
            <CanvasJSChart options = {options}/></div>
        </div>
      </div>
    </>
  );
}
  
