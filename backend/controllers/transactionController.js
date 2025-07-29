const Transaction = require('../models/Transaction');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const { createWorker } = Tesseract;
const { parseReceiptText } = require('../utils/receiptParser');
const pdfParse = require('pdf-parse');
const mongoose = require('mongoose');

exports.upload = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        let text = '';
        if (req.file.mimetype === 'application/pdf') {
            
            const data = await pdfParse(req.file.buffer);
            text = data.text;
            
        } else if (req.file.mimetype.startsWith('image/')) {
            // Use OCR for image
            const worker = await createWorker('eng');
            const { data: { text: ocrText } } = await worker.recognize(req.file.buffer);
            await worker.terminate();
            text = ocrText;
        } else {
            return res.status(400).json({ message: 'Unsupported file type. Please upload a PDF or image.' });
        }
        const transactions = parseReceiptText(text);
        if (!transactions.length) return res.status(400).json({ message: 'No transactions found in file', ocrText: text });
        const docs = transactions.map(t => ({ ...t, user: req.user }));
        await Transaction.insertMany(docs);
        res.json({ message: 'Transactions extracted from file', count: docs.length });
    } catch (err) {
        res.status(400).json({ message: err.message || 'Failed to process file' });
    }
};

exports.list = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { startDate, endDate } = req.query;
    const filter = { user: req.user };
    if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
    }
    try {
        const total = await Transaction.countDocuments(filter);
        const transactions = await Transaction.find(filter)
            .sort({ date: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        res.json({
            transactions,
            page,
            totalPages: Math.ceil(total / limit),
            total,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.create = async (req, res) => {
    const { date, description, amount, type, category, notes } = req.body;
    if (!date || !description || !amount || !type) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    try {
        console.log('Creating transaction for user:', req.user);
        console.log('Transaction data:', { date, description, amount, type, category, notes });

        const transaction = new Transaction({
            user: req.user,
            date,
            description,
            amount,
            type,
            category: category || 'Uncategorized',
            notes: notes || '',
        });
        await transaction.save();
        console.log('Transaction saved successfully:', transaction._id);
        res.status(201).json(transaction);
    } catch (err) {
        console.error('Error creating transaction:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.summary = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user);
        const match = { user: userId };
        console.log('Summary request for user:', req.user);
        console.log('Converted user ID:', userId);

        // First, let's check if any transactions exist for this user
        const totalTransactions = await Transaction.countDocuments(match);
        console.log('Total transactions for user:', totalTransactions);

        // Get a sample transaction to see the structure
        const sampleTransaction = await Transaction.findOne(match);
        console.log('Sample transaction:', sampleTransaction);

        // By Category
        const byCategory = await Transaction.aggregate([
            { $match: match },
            {
                $group: {
                    _id: { category: "$category", type: "$type" },
                    total: { $sum: "$amount" }
                }
            }
        ]);
        console.log('By category data:', byCategory);

        // By Date
        const byDate = await Transaction.aggregate([
            { $match: match },
            {
                $group: {
                    _id: { date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, type: "$type" },
                    total: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.date": 1 } }
        ]);
        console.log('By date data:', byDate);

        res.json({ byCategory, byDate });
    } catch (err) {
        console.error('Summary error:', err);
        res.status(500).json({ message: 'Server error' });
    }
}; 