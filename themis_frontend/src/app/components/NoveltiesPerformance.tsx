"use client";

import { Box } from '@mui/material';
import DashboardCard from './DashboardCard';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Registrar los componentes necesarios
ChartJS.register(ArcElement, Tooltip, Legend);

const persons = [
    {
        id: "1",
        name: "Coordinacion de Formacion Integral",
        numReports: "34"
    },
    {
        id: "2",
        name: "Coordinación Gestión Financiera y Administrativa",
        numReports: "35",
    },
    {
        id: "3",
        name: "Coordinación de Contabilidad y Finanzas",
        numReports: "23",
    },
    {
        id: "4",
        name: "Coordinación de Articulación con la Educación Media",
        numReports: "12",
    },
    {
        id: "5",
        name: "Coordinación Académica Formación Virtual",
        numReports: "34"
    },
    {
        id: "6",
        name: "Coordinación de Tecnología e Innovación",
        numReports: "35",
    },
];

/**
 * Componente que muestra el rendimiento de novedades en forma de gráfico de torta.
 *
 * @returns {JSX.Element} El componente de rendimiento de novedades.
 */
const NoveltiesPerformance = () => {
    // Preparar los datos para el gráfico de torta
    const data = {
        labels: persons.map(person => person.name),
        datasets: [{
            label: 'Número de Reportes',
            data: persons.map(person => parseInt(person.numReports)),
            backgroundColor: [
                '#385C57',
                '#00324D',
                '#BFD7B5',
                '#E4DFDA',
            ],
            hoverBackgroundColor: [
                '#E4DFDA',
            ]
        }]
    };

    const options = {
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    boxWidth: 20,
                }
            }
        },
        layout: {
            padding: {
                top: 10,
                bottom: 10,
            }
        },
        maintainAspectRatio: false,
        responsive: true,
    };

    return (
        <DashboardCard title="Reportes por Coordinación">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <Box sx={{ width: '750px', height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Pie data={data} options={{
                        plugins: {
                            legend: {
                                position: 'right' as const,
                                labels: {
                                    boxWidth: 20,
                                }
                            }
                        },
                        layout: {
                            padding: {
                                top: 10,
                                bottom: 10,
                            }
                        },
                        maintainAspectRatio: false,
                        responsive: true,
                    }} />
                </Box>
            </Box>
        </DashboardCard>
    );
};

export default NoveltiesPerformance;
