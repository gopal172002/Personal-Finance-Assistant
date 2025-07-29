import React, { useEffect, useState } from 'react';
import { fetchSummary } from '../api';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PieChartIcon from '@mui/icons-material/PieChart';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

function Dashboard() {
    const [summary, setSummary] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSummary()
            .then(res => {
                setSummary(res.data);
            })
            .catch(err => {
                setError(err.response?.data?.message || 'Failed to load summary');
            });
    }, []);

    if (error) return <Typography color="error">{error}</Typography>;
    if (!summary) return <Typography>Loading...</Typography>;

    const pieData = summary.byCategory
        .filter(d => d._id.type === 'debit')
        .map(d => ({
            id: d._id.category,
            label: d._id.category,
            value: Math.abs(d.total)
        }));

    const dates = Array.from(new Set(summary.byDate.map(d => d._id.date))).sort();

    const expenseByDate = dates.map(date => {
        const found = summary.byDate.find(d => d._id.date === date && d._id.type === 'debit');
        return { x: date, y: found ? Math.abs(found.total) : 0 };
    });

    const incomeByDate = dates.map(date => {
        const found = summary.byDate.find(d => d._id.date === date && d._id.type === 'credit');
        return { x: date, y: found ? Math.abs(found.total) : 0 };
    });

    const barData = dates.map(date => ({
        date,
        Expense: expenseByDate.find(d => d.x === date)?.y || 0,
        Income: incomeByDate.find(d => d.x === date)?.y || 0,
    }));

    const totalExpenses = summary.byCategory
        .filter(d => d._id.type === 'debit')
        .reduce((sum, d) => sum + Math.abs(d.total), 0);

    const totalIncome = summary.byCategory
        .filter(d => d._id.type === 'credit')
        .reduce((sum, d) => sum + Math.abs(d.total), 0);

    const categoriesCount = summary.byCategory.filter(d => d._id.type === 'debit').length;

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', p: 4 }}>
            <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h2" sx={{ color: 'white', fontWeight: 900, textShadow: '2px 2px 4px rgba(0,0,0,0.3)', mb: 2 }}>
                        Financial Dashboard
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 400 }}>
                        Track your income and expenses with beautiful insights
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', mb: 5 }}>
                    <Card sx={{
                        width: 250,
                        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                        borderRadius: 2,
                        boxShadow: '0 4px 16px rgba(255,107,107,0.2)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: '0 6px 20px rgba(255,107,107,0.3)'
                        }
                    }}>
                        <CardContent sx={{ p: 2, color: 'white' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <AccountBalanceWalletIcon sx={{ fontSize: 28, mr: 1 }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    Total Expenses
                                </Typography>
                            </Box>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                ₹{totalExpenses.toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card sx={{
                        width: 250,
                        background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                        borderRadius: 2,
                        boxShadow: '0 4px 16px rgba(78,205,196,0.2)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: '0 6px 20px rgba(78,205,196,0.3)'
                        }
                    }}>
                        <CardContent sx={{ p: 2, color: 'white' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <TrendingUpIcon sx={{ fontSize: 28, mr: 1 }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    Total Income
                                </Typography>
                            </Box>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                ₹{totalIncome.toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card sx={{
                        width: 250,
                        background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                        borderRadius: 2,
                        boxShadow: '0 4px 16px rgba(168,237,234,0.2)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: '0 6px 20px rgba(168,237,234,0.3)'
                        }
                    }}>
                        <CardContent sx={{ p: 2, color: '#333' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <PieChartIcon sx={{ fontSize: 28, mr: 1, color: '#d6336c' }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    Categories
                                </Typography>
                            </Box>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                {categoriesCount}
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }, gap: 4 }}>
                    <Card sx={{
                        borderRadius: 3,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                        background: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: '#1a1a2e', textAlign: 'center' }}>
                                Expenses by Category
                            </Typography>
                            <Box sx={{ height: 400 }}>
                                <ResponsivePie
                                    data={pieData}
                                    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                                    innerRadius={0.6}
                                    padAngle={3}
                                    cornerRadius={8}
                                    activeOuterRadiusOffset={8}
                                    colors={{ scheme: 'nivo' }}
                                    borderWidth={2}
                                    borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
                                    arcLinkLabelsSkipAngle={10}
                                    arcLinkLabelsTextColor="#666"
                                    arcLinkLabelsThickness={2}
                                    arcLinkLabelsColor={{ from: 'color' }}
                                    arcLabelsSkipAngle={10}
                                    arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                                    tooltip={({ datum }) => (
                                        <Box sx={{
                                            background: 'rgba(255,255,255,0.95)',
                                            padding: '8px 12px',
                                            border: '1px solid #ccc',
                                            borderRadius: 4,
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                        }}>
                                            <strong>{datum.label}: ₹{datum.value.toFixed(2)}</strong>
                                        </Box>
                                    )}
                                />
                            </Box>
                        </CardContent>
                    </Card>

                    <Card sx={{
                        borderRadius: 3,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                        background: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: '#1a1a2e', textAlign: 'center' }}>
                                Income vs Expenses Over Time
                            </Typography>
                            <Box sx={{ height: 400 }}>
                                <ResponsiveLine
                                    data={[
                                        { id: 'Expenses', color: '#ff6b6b', data: expenseByDate },
                                        { id: 'Income', color: '#4ecdc4', data: incomeByDate },
                                    ]}
                                    margin={{ top: 50, right: 110, bottom: 60, left: 70 }}
                                    xScale={{ type: 'point' }}
                                    yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false }}
                                    axisBottom={{
                                        orient: 'bottom',
                                        tickRotation: -45,
                                        legend: 'Date',
                                        legendOffset: 48,
                                        legendPosition: 'middle',
                                        tickSize: 5,
                                        tickPadding: 8,
                                    }}
                                    axisLeft={{
                                        orient: 'left',
                                        legend: 'Amount (₹)',
                                        legendOffset: -50,
                                        legendPosition: 'middle',
                                    }}
                                    colors={d => d.color}
                                    pointSize={8}
                                    pointBorderWidth={2}
                                    pointColor={{ from: 'color' }}
                                    pointBorderColor="#fff"
                                    enableGridX={false}
                                    enableArea={true}
                                    areaOpacity={0.15}
                                    useMesh={true}
                                    legends={[
                                        {
                                            anchor: 'top-right',
                                            direction: 'row',
                                            translateY: -30,
                                            itemsSpacing: 20,
                                            itemWidth: 80,
                                            itemHeight: 20,
                                            itemOpacity: 0.8,
                                            symbolSize: 14,
                                            symbolShape: 'circle',
                                        },
                                    ]}
                                    tooltip={({ point }) => (
                                        <Box sx={{
                                            background: 'rgba(255,255,255,0.95)',
                                            padding: '8px 12px',
                                            border: '1px solid #ccc',
                                            borderRadius: 4,
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                        }}>
                                            <strong>{point.serieId} — {point.data.xFormatted}: ₹{point.data.yFormatted}</strong>
                                        </Box>
                                    )}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Box>

                <Card sx={{
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    mt: 4
                }}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: '#1a1a2e', textAlign: 'center' }}>
                            Income vs Expenses Comparison
                        </Typography>
                        <Box sx={{ height: 400 }}>
                            <ResponsiveBar
                                data={barData}
                                keys={['Income', 'Expense']}
                                indexBy="date"
                                margin={{ top: 50, right: 140, bottom: 60, left: 70 }}
                                padding={0.3}
                                groupMode="grouped"
                                colors={['#4ecdc4', '#ff6b6b']}
                                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                                axisBottom={{
                                    tickRotation: -45,
                                    legend: 'Date',
                                    legendPosition: 'middle',
                                    legendOffset: 48,
                                }}
                                axisLeft={{
                                    legend: 'Amount (₹)',
                                    legendPosition: 'middle',
                                    legendOffset: -50,
                                }}
                                labelSkipWidth={12}
                                labelSkipHeight={12}
                                labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                                legends={[
                                    {
                                        dataFrom: 'keys',
                                        anchor: 'top-right',
                                        direction: 'row',
                                        translateY: -30,
                                        itemsSpacing: 20,
                                        itemWidth: 90,
                                        itemHeight: 20,
                                        itemOpacity: 0.85,
                                        symbolSize: 14,
                                        symbolShape: 'circle',
                                        effects: [
                                            {
                                                on: 'hover',
                                                style: {
                                                    itemOpacity: 1,
                                                },
                                            },
                                        ],
                                    },
                                ]}
                                animate={true}
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}

export default Dashboard;
