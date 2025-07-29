import React, { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
    Snackbar,
    Alert,
    IconButton,
    CircularProgress,
    FormHelperText,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloseIcon from '@mui/icons-material/Close';
import { uploadFile } from '../api';

function Upload() {
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfUploading, setPdfUploading] = useState(false);
    const [pdfMessage, setPdfMessage] = useState('');
    const [pdfError, setPdfError] = useState('');

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const openSnackbar = (message, severity = 'success') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };
    const closeSnackbar = () => setSnackbarOpen(false);

    const validateFile = (file) =>
        file && (file.type === 'application/pdf' || file.type.startsWith('image/'));

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!validateFile(selectedFile)) {
            setPdfFile(null);
            setPdfError('Please select a valid PDF or image file');
            return;
        }

        setPdfFile(selectedFile);
        setPdfError('');
        setPdfMessage('');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        handleFileChange({ target: { files: [droppedFile] } });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!pdfFile) {
            setPdfError('Please select a PDF or image file');
            return;
        }

        setPdfUploading(true);
        setPdfError('');
        setPdfMessage('');

        try {
            const res = await uploadFile(pdfFile);
            setPdfMessage(
                `Uploaded ${res.data.count} transaction(s)!`
            );
            openSnackbar('PDF uploaded successfully!');
            setPdfFile(null);
        } catch (err) {
            const msg = err.response?.data?.message || 'Upload failed';
            setPdfError(msg);
            openSnackbar(msg, 'error');
        } finally {
            setPdfUploading(false);
        }
    };

    return (
        <Box
    maxWidth={1200}
    mx="auto"
    mt={6}
    display="flex"
    gap={4}
    flexDirection="column"
    alignItems="center"
>
<Box flex={1} minWidth={400}> {/* Increased from 300 to 400 */}
    <Typography variant="h6" gutterBottom textAlign="center" color="primary">
        Upload Transactions or Receipts
    </Typography>
    <form onSubmit={handleSubmit}>
        <Paper
            sx={{
                width: '100%', // Expand to take all available horizontal space
                p: 3,
                border: '2px dashed #ccc',
                textAlign: 'center',
                borderRadius: 2,
                backgroundColor: '#f9f9f9',
                cursor: 'pointer',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
            }}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => document.getElementById('pdf-file-input').click()}
        >
            <Typography sx={{ fontSize: '1rem', mb: 1 }}>
                {pdfFile ? pdfFile.name : 'Click or drag a PDF/image file here'}
            </Typography>
            {pdfFile && (
                <IconButton size="small" onClick={e => {
                    e.stopPropagation();
                    setPdfFile(null);
                }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            )}
            <input
                id="pdf-file-input"
                type="file"
                accept="application/pdf,image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
        </Paper>
        {pdfError && <FormHelperText error>{pdfError}</FormHelperText>}
        {pdfUploading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
        <Box textAlign="center">
            <Button
                type="submit"
                variant="contained"
                size="small"
                disabled={!pdfFile || pdfUploading}
                startIcon={<UploadFileIcon />}
            >
                Upload
            </Button>
        </Box>
        {pdfMessage && (
            <Typography textAlign="center" color="success.main" mt={1}>
                {pdfMessage}
            </Typography>
        )}
    </form>
</Box>


            <Box sx={{
                mt: 5,
                maxWidth: 700,
                mx: 'auto',
                background: 'linear-gradient(90deg, #fffbe6 0%, #fff3cd 100%)',
                borderLeft: '6px solid #ffe066',
                p: 3,
                display: 'flex',
                alignItems: 'flex-start',
                boxShadow: 'none'
            }}>
                <Box sx={{ mr: 2, mt: 0.5 }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="#ffe066" /><path d="M12 7v5" stroke="#b8860b" strokeWidth="2" strokeLinecap="round" /><circle cx="12" cy="16" r="1" fill="#b8860b" /></svg>
                </Box>
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#b8860b', mb: 1 }}>Important Notes:</Typography>
                    <ul style={{ margin: 0, paddingLeft: 18, color: '#856404', fontSize: 15 }}>
                        <li>Only <b>PDF</b> files (for transactions) and <b>image</b> files (for receipts) are supported.</li>
                        <li>For best results, upload clear, high-quality images or well-formatted PDFs.</li>
                        <li>Uploaded files are processed automatically; please review extracted transactions for accuracy.</li>
                        <li>Do not upload sensitive or personal information not related to transactions.</li>
                    </ul>
                </Box>
            </Box>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={closeSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={closeSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default Upload;
