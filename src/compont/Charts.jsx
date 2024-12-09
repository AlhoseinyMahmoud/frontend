import "./chart.css";
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart, lineElementClasses, markElementClasses } from '@mui/x-charts/LineChart';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { Gauge } from '@mui/x-charts/Gauge';
import {gaugeClasses } from '@mui/x-charts/Gauge';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from "react";
export default function DashedLineChart() {
  useEffect(() => {
    AOS.init({
        once: true,
        disable: "phone",
        duration: 800,
        easing: "ease-out-cubic",
    });
  }, [])
  const settings = {
    width: 150,
    height: 130,
    value: 70,
  };
  const setting = {
    width: 150,
    height: 130,
    value: 90,
  };
  
  const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
  const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
  const xLabels = ['Page A', 'Page B', 'Page C', 'Page D', 'Page E', 'Page F', 'Page G'];
  return (
    <div className="d-flex justify-content-between gap-2 cardBox">
      {/* Line Chart Section */}
      <div className="chart-section" data-aos="fade-up" data-aos-duration="3000">
        <div className="d-flex justify-content-between mt-4">
          <h5 className="fw-bold px-1">Target</h5>
          <input 
            type="date" 
            className="mx-2 form-control p-2 w-50 rounded-4 border-0" 
            placeholder="...." 
          />
        </div>
        <div className="card-linechart">
          <LineChart
            width={495}
            height={300}
            series={[
              { data: pData, label: 'pv', id: 'pvId' },
              { data: uData, label: 'uv', id: 'uvId' },
            ]}
            xAxis={[{ scaleType: 'point', data: xLabels }]}
            sx={{
              [`.${lineElementClasses.root}, .${markElementClasses.root}`]: {
                strokeWidth: 1,
              },
              '.MuiLineElement-series-pvId': {
                strokeDasharray: '5 5',
              },
              '.MuiLineElement-series-uvId': {
                strokeDasharray: '3 4 5 2',
              },
              [`.${markElementClasses.root}:not(.${markElementClasses.highlighted})`]: {
                fill: '#fff',
              },
              [`& .${markElementClasses.highlighted}`]: {
                stroke: 'none',
              },
            }}
          />
        </div>
      </div>

      {/* Weekly Top Sell Pie Chart */}
      <div className="chart-section2" data-aos="fade-up" data-aos-duration="3000">
        <div className="mt-4 pb-1">
          <h5 className="fw-bold px-1">WeeklyTop</h5>
        </div>
        <div className="card-linechart">
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: 20, label: 'Series A' },
                  { id: 1, value: 5, label: 'Series B' },
                  { id: 2, value: 5, label: 'Series C' },
                ],
              },
            ]}
            width={300}
            height={300}
          />
        </div>
      </div>

      {/* Sales Report Pie Chart */}
      <div className="chart-section3"  data-aos="fade-up" data-aos-duration="3000">
        <div className="mt-4 pb-1">
          <h5 className="fw-bold px-1">SalesReport</h5>
        </div>
        <div className="card-linechart">
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: 20, label: 'Series A' },
                  { id: 1, value: 5, label: 'Series B' },
                  { id: 2, value: 5, label: 'Series C' },
                ],
              },
            ]}
            width={200}
            height={300}
          />
        </div>
      </div>
      {/* Sales Report Pie Chart */}
      <div className="chart-section4" data-aos="fade-right"data-aos-offset="300"data-aos-easing="ease-in-sine">
        <div className="mt-4 pb-1">
          <h5 className="fw-bold px-1">Sales Report</h5>
        </div>
        <div className="d-flex main-sec4 gap-4 w-100">
        <div className="card-linechart w-50">
          <div className=" align-content-center">
            <p className="fs-3">target salary</p>
            <p>500sales</p>
          </div>
          <div>       
              <Gauge
                {...settings}
                cornerRadius="50%"
                sx={(theme) => ({
                  [`& .${gaugeClasses.valueText}`]: {
                    fontSize: 30,
                  },
                  [`& .${gaugeClasses.valueArc}`]: {
                    fill: '#b800d8',
                  },
                  [`& .${gaugeClasses.referenceArc}`]: {
                    fill: theme.palette.text.disabled,
                  },
                })}
              />
          </div>
        </div>
        <div className="card-linechart w-50 d-flex flex-column">
            <div className="col-12">
            <span className="fs-5">social Meida</span>
            </div>
          <div className="col-12">
          <Stack direction="row" sx={{ width: '100%' }}>
            <Box sx={{ flexGrow: 1 }}>
              <SparkLineChart data={[1, 4, 2, 5, 7, 2, 4, 6]} height={100} />
            </Box>
          </Stack>
          </div>
        </div>
        </div>
        <div className="d-flex main-sec4 gap-4 w-100">
        <div className="card-linechart w-50">
        <div className="align-content-center">
            <p className="fs-3">New product</p>
            <p>500sales</p>
          </div>
          <div>       
              <Gauge
                {...setting}
                cornerRadius="50%"
                sx={(theme) => ({
                  [`& .${gaugeClasses.valueText}`]: {
                    fontSize: 30,
                  },
                  [`& .${gaugeClasses.valueArc}`]: {
                    fill: '#02b2af',
                  },
                  [`& .${gaugeClasses.referenceArc}`]: {
                    fill: theme.palette.text.disabled,
                  },
                })}
              />
          </div>
        </div>
        <div className="card-linechart w-50 d-flex flex-column">
            <div className="col-12">
            <span className="fs-5">social Meida</span>
            </div>
          <div className="col-12">
          <Stack direction="row" sx={{ width: '100%' }}>
            <Box sx={{ flexGrow: 1 }}>
              <SparkLineChart data={[1, 4, 2, 5, 7, 2, 4, 6]} height={100} />
            </Box>
          </Stack>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
