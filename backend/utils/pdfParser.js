const pdfParse = require('pdf-parse');

async function parseTransactionsFromPDF(buffer) {
    const data = await pdfParse(buffer);
    const lines = data.text.split('\n').map(line => line.trim()).filter(Boolean);
    // Find the header row
    const headerIndex = lines.findIndex(line => /date/i.test(line) && /description/i.test(line));
    if (headerIndex === -1) throw new Error('No table header found in PDF');
    const transactions = [];
    for (let i = headerIndex + 1; i < lines.length; i++) {
        const row = lines[i].split(/\s{2,}/); // Split by 2+ spaces
        if (row.length < 4) continue;
        const [date, description, amount, type] = row;
        transactions.push({
            date: new Date(date),
            description,
            amount: parseFloat(amount.replace(/[^\d.-]/g, '')),
            type: type.toLowerCase(),
        });
    }
    return transactions;
}

module.exports = parseTransactionsFromPDF; 