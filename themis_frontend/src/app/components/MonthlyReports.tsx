'use client';

import React, { useState } from 'react';
import dynamic from "next/dynamic";
import { Stack, Typography, Avatar, Fab } from '@mui/material';
import Image from "next/image";
import DashboardCard from './DashboardCard';
import RefreshIcon from '@mui/icons-material/Refresh';
import { ApexOptions } from 'apexcharts'; // Importa el tipo ApexOptions

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const MonthlyReports = () => {

  const customPrimaryColor = '#00324D';
  const customSecondaryColor = '#385C57';

  const [series, setSeries] = useState([
    {
      name: '',
      color: customPrimaryColor,
      data: [25, 66, 20, 40, 12, 58, 20],
    },
  ]);

  const updateChart = () => {
    const newSeries = [
      {
        name: '',
        color: customPrimaryColor,
        data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100)),
      },
    ];
    setSeries(newSeries);
  };

  const optionscolumnchart: ApexOptions = { // Usa ApexOptions como el tipo
    chart: {
      type: 'area',
      fontFamily: "'Inter', serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 60,
      sparkline: {
        enabled: true,
      },
      group: 'sparklines',
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      colors: [customPrimaryColor],
      type: 'solid',
      opacity: 0.05,
    },
    markers: {
      size: 0,
    },
    tooltip: {
      theme: customPrimaryColor,
    },
  };

  return (
    <DashboardCard
      title={
        <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%">
          <Typography variant="h6">
            Reportes Mensuales
          </Typography>
          <Fab
            size="small"
            onClick={updateChart}
            sx={{ marginLeft: '80px', bgcolor: '#385C57', '&:hover': { bgcolor: '#476863', color: 'white' } }}
          >
            <RefreshIcon />
          </Fab>
        </Stack>
      }
      footer={
        <Chart options={optionscolumnchart} series={series} type="area" height={60} width={"100%"} />
      }
    >
      <>
        <Typography variant="h3" fontWeight="200" mt="-20px">
          +200 este mes
        </Typography>
        <Stack direction="row" spacing={1} my={1} alignItems="center">
          <Avatar sx={{ bgcolor: customSecondaryColor, width: 27, height: 27 }}>
            <Image src="/icons/arrow-right.svg" width={20} height={20} alt="Flecha a la derecha" />
          </Avatar>
          <Typography variant="subtitle2" fontWeight="600">
            +9%
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            último año
          </Typography>
        </Stack>
      </>
    </DashboardCard>
  );
};

export default MonthlyReports;
