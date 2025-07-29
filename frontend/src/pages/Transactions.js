import React, { useEffect, useState } from 'react';
import { fetchTransactions } from '../api';
import TransactionTable from '../components/TransactionTable';
import Pagination from '../components/Pagination';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import { getToken } from '../utils/auth';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        date: '',
        description: '',
        amount: '',
        type: 'debit',
        category: '',
        notes: '',
    });
    const [formError, setFormError] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);

    const loadTransactions = async (pageNum, sDate = startDate, eDate = endDate) => {
        setError('');
        try {
            const res = await fetchTransactions(pageNum, 10, sDate, eDate);
            setTransactions(res.data.transactions);
            setPage(res.data.page);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch transactions');
        }
    };

    useEffect(() => {
        loadTransactions(page);
        // eslint-disable-next-line
    }, [page, startDate, endDate]);

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setFormError('');
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        if (!form.date || !form.description || !form.amount || !form.type) {
            setFormError('Please fill all required fields');
            return;
        }
        try {
            await axios.post(
                `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/transactions`,
                form,
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            setForm({
                date: '',
                description: '',
                amount: '',
                type: 'debit',
                category: '',
                notes: '',
            });
            setOpenAddDialog(false);
            loadTransactions(page);
        } catch (err) {
            setFormError(err.response?.data?.message || 'Failed to add transaction');
        }
    };

    return (
        <Box sx={{ width: '100%', px: 2, mt: 8 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{
                    color: 'black',
                    fontWeight: 700,
                   
                }}>
                    Transactions
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddCircleIcon />}
                    onClick={() => setOpenAddDialog(true)}
                    sx={{
                        background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #44a08d 0%, #3a8c7a 100%)',
                            boxShadow: '0 6px 16px rgba(78,205,196,0.4)',
                        },
                        borderRadius: 2,
                        px: 3,
                        py: 1.5,
                        fontWeight: 'bold',
                        textTransform: 'none',
                        boxShadow: '0 4px 12px rgba(78,205,196,0.3)',
                    }}
                >
                    Add Transaction
                </Button>
            </Box>

            <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
    <Button
        variant="outlined"
        startIcon={showFilters ? <FilterListOffIcon /> : <FilterListIcon />}
        onClick={() => setShowFilters((prev) => !prev)}
        sx={{
            '&:hover': {
                borderColor: 'primary.light',
                backgroundColor: 'rgba(255,255,255,0.05)',
            },
            borderRadius: 2,
            px: 3,
            py: 1.5,
            fontWeight: 'bold',
            textTransform: 'none',
            borderColor: 'primary.main',
            color: 'primary.main',
        }}
    >
        {showFilters ? 'Hide Filters' : 'Show Filters'}
    </Button>

    {showFilters && (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                sx={{
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        borderRadius: 2,
                        '& fieldset': {
                            borderColor: 'rgba(255,255,255,0.3)',
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(255,255,255,0.5)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'primary.main',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: 'primary.main',
                        fontWeight: 600,
                        '&.Mui-focused': {
                            color: 'primary.light',
                        },
                    },
                    '& .MuiInputBase-input': {
                        color: '#333',
                    },
                }}
            />
            <TextField
                label="End Date"
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                sx={{
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        borderRadius: 2,
                        '& fieldset': {
                            borderColor: 'rgba(255,255,255,0.3)',
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(255,255,255,0.5)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'primary.main',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: 'primary.main',
                        fontWeight: 600,
                        '&.Mui-focused': {
                            color: 'primary.light',
                        },
                    },
                    '& .MuiInputBase-input': {
                        color: '#333',
                    },
                }}
            />
            <Button
                variant="outlined"
                onClick={() => { setStartDate(''); setEndDate(''); }}
                size="small"
                sx={{
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                        borderColor: 'primary.light',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                    },
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    fontWeight: 'bold',
                    textTransform: 'none',
                }}
            >
                Clear
            </Button>
        </Box>
    )}
</Box>


            {error && <Typography color="error" align="center" mb={2}>{error}</Typography>}

            <TransactionTable transactions={transactions} />
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />

            {/* Add Transaction Dialog */}
            <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                    color: 'white',
                    fontWeight: 700
                }}>
                    Add New Transaction
                </DialogTitle>
                <form onSubmit={handleFormSubmit}>
                    <DialogContent sx={{ pt: 3 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Date"
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleFormChange}
                                InputLabelProps={{ shrink: true }}
                                required
                                fullWidth
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                            <TextField
                                label="Description"
                                name="description"
                                value={form.description}
                                onChange={handleFormChange}
                                required
                                fullWidth
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                            <TextField
                                label="Amount"
                                name="amount"
                                type="number"
                                value={form.amount}
                                onChange={handleFormChange}
                                required
                                fullWidth
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                            <TextField
                                label="Type"
                                name="type"
                                select
                                value={form.type}
                                onChange={handleFormChange}
                                required
                                fullWidth
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            >
                                <MenuItem value="debit">Expense</MenuItem>
                                <MenuItem value="credit">Income</MenuItem>
                            </TextField>
                            <TextField
                                label="Category"
                                name="category"
                                value={form.category}
                                onChange={handleFormChange}
                                fullWidth
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                            <TextField
                                label="Notes"
                                name="notes"
                                value={form.notes}
                                onChange={handleFormChange}
                                multiline
                                rows={2}
                                fullWidth
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                            {formError && <Typography color="error">{formError}</Typography>}
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, pt: 1 }}>
                        <Button
                            onClick={() => setOpenAddDialog(false)}
                            sx={{
                                color: '#666',
                                '&:hover': {
                                    backgroundColor: 'rgba(0,0,0,0.04)',
                                }
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #44a08d 0%, #3a8c7a 100%)',
                                },
                                borderRadius: 2,
                                px: 3,
                                py: 1,
                                fontWeight: 'bold',
                                textTransform: 'none'
                            }}
                        >
                            Add Transaction
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
}

export default Transactions;
