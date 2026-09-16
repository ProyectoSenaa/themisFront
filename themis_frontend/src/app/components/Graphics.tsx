'use client';

import React, { useState, useEffect } from 'react';
import DashboardCard from './DashboardCard';
import { Select, MenuItem, Button, SelectChangeEvent } from '@mui/material';
import dynamic from "next/dynamic";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function Graphic() {
   
    const [month, setMonth] = useState('1');
    const [series, setSeries] = useState([
        {
            name: 'Novedades Recibidas',
            data: [355, 390, 300, 350, 390, 180, 355, 390],
        },
        {
            name: 'Novedades Rechazadas',
            data: [260, 230, 320, 200, 220, 300, 260, 230],
        },
    ]);

    const handleChange = (event: SelectChangeEvent<string>) => {
        setMonth(event.target.value);
    };

    const updateChart = () => {
        const newSeries = [
            {
                name: 'Novedades Recibidas',
                data: [Math.floor(Math.random() * 500), 390, 300, 350, 390, 180, 355, 390],
            },
            {
                name: 'Novedades Rechazadas',
                data: [260, 230, 320, Math.floor(Math.random() * 500), 220, 300, 260, 230],
            },
        ];
        setSeries(newSeries);
    };

    const customPrimaryColor = '#00324D';
    const customSecondaryColor = '#385C57'; 

    const downloadPDF = () => {
        const chartElement = document.querySelector(".apexcharts-canvas") as HTMLElement;
        if (chartElement) {
            html2canvas(chartElement).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('landscape');
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save("chart.pdf");
            });
        }
    };

    const optionscolumnchart: any = {
        chart: {
            type: 'bar',
            fontFamily: "'Inter', serif;",
            foreColor: '#D9D9D9',
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true,
                    customIcons: [
                        {
                            icon: '<img src="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' class=\'feather feather-file-text\'%3E%3Cpath d=\'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\'%3E%3C/path%3E%3Cpolyline points=\'14 2 14 8 20 8\'%3E%3C/polyline%3E%3Cline x1=\'16\' y1=\'13\' x2=\'8\' y2=\'13\'%3E%3C/line%3E%3Cline x1=\'16\' y1=\'17\' x2=\'8\' y2=\'17\'%3E%3C/line%3E%3Cpolyline points=\'10 9 9 9 8 9\'%3E%3C/polyline%3E%3C/svg%3E" />',
                            index: -1,
                            title: 'Download PDF',
                            class: 'custom-icon',
                            click: function(chart: any, options: any, e: any) {
                                downloadPDF();
                            }
                        }
                    ]
                }
            },
            height: 370,
        },
        colors: [customPrimaryColor, customSecondaryColor],
        plotOptions: {
            bar: {
                horizontal: false,
                barHeight: '60%',
                columnWidth: '60%',
                borderRadius: [6],
                borderRadiusApplication: 'end',
                borderRadiusWhenStacked: 'all',
            },
        },

        stroke: {
            show: true,
            width: 5,
            lineCap: "butt",
            colors: ["transparent"],
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: true,
        },
        grid: {
            borderColor: 'rgba(0,0,0,0.1)',
            strokeDashArray: 3,
            xaxis: {
                lines: {
                    show: true,
                },
            },
        },
        yaxis: {
            tickAmount: 4,
        },
        xaxis: {
            categories: ['11/06', '12/06', '13/06', '14/06', '15/06', '16/06', '17/06', '18/06'],
            axisBorder: {
                show: false,
            },
        },
        tooltip: {
            theme: 'dark',
            fillSeriesColor: false,
        },
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            const exportMenu = document.querySelectorAll('.apexcharts-menu-item');
            if (exportMenu.length) {
                exportMenu.forEach((item: any) => {
                    if (item.innerText === 'Download SVG') {
                        item.innerText = 'Descargar SVG';
                    } else if (item.innerText === 'Download PNG') {
                        item.innerText = 'Descargar PNG';
                    } else if (item.innerText === 'Download CSV') {
                        item.innerText = 'Descargar CSV';
                    }
                });
                clearInterval(intervalId); 
            }
        }, 100);
    }, []);

    return (
        <DashboardCard title="Reporte de Novedades" action={
            <>
                <Select
                    labelId="month-dd"
                    id="month-dd"
                    value={month}
                    size="small"
                    onChange={handleChange}
                >
                    <MenuItem value={1}>Enero 2024</MenuItem>
                    <MenuItem value={2}>Febrero 2024</MenuItem>
                    <MenuItem value={3}>Marzo 2024</MenuItem>
                    <MenuItem value={4}>Abril 2024</MenuItem>
                    <MenuItem value={5}>Mayo 2024</MenuItem>
                    <MenuItem value={6}>Junio 2024</MenuItem>
                    <MenuItem value={7}>Julio 2024</MenuItem>
                    <MenuItem value={8}>Agosto 2024</MenuItem>
                    <MenuItem value={9}>Septiembre 2024</MenuItem>
                    <MenuItem value={10}>Octubre 2024</MenuItem>
                    <MenuItem value={11}>Noviembre 2024</MenuItem>
                    <MenuItem value={12}>Diciembre 2024</MenuItem>
                </Select>
                <Button onClick={updateChart} variant="contained" style={{ marginLeft: 10, backgroundColor:'#385C57' }}>
                    Actualizar Gráfico
                </Button>
            </>
        }>
            <Chart
                options={optionscolumnchart}
                series={series}
                type="bar"
                height={260} width={"100%"}
            />
        </DashboardCard>
    );
}
