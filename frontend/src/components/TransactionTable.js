import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';

function TransactionTable({ transactions }) {
  return (
    <TableContainer sx={{ width: '100%', mt: 2 }}>
      <Table sx={{ width: '100%' }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell sx={{ fontWeight: 'bold', color: '#4b2e83', width: '15%' }}>
              Date
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#4b2e83', width: '30%' }}>
              Description
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#4b2e83', width: '15%' }}>
              Amount
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#4b2e83', width: '10%' }}>
              Type
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#4b2e83', width: '15%' }}>
              Category
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#4b2e83', width: '15%' }}>
              Notes
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                No transactions found.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((t) => (
              <TableRow
                key={t._id || `${t.date}-${t.description}`}
                hover
                sx={{ cursor: 'default' }}
              >
                <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                <TableCell>{t.description}</TableCell>
                <TableCell>{t.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    label={t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                    size="small"
                    sx={{
                      backgroundColor:
                        t.type.toLowerCase() === 'credit' ? '#e0f7e9' : '#fdecea',
                      color: t.type.toLowerCase() === 'credit' ? '#2e7d32' : '#c62828',
                      fontWeight: 'bold',
                      borderRadius: '9999px',
                    }}
                  />
                </TableCell>
                <TableCell>{t.category || '-'}</TableCell>
                <TableCell>{t.notes || '-'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TransactionTable;
