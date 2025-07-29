import React from 'react';
import MuiPagination from '@mui/material/Pagination';

function Pagination({ page, totalPages, onChange }) {
    return (
        <MuiPagination
            count={totalPages}
            page={page}
            onChange={(e, value) => onChange(value)}
            color="primary"
            sx={{ mt: 2, mb: 2 }}
        />
    );
}

export default Pagination; 