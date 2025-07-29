function parseReceiptText(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const transactions = [];

    const tableLineRegex = /^(\d{1,2}\/\d{1,2}\/\d{4})\s+(.+?)\s+([\d,]+(?:\.\d{2})?)\s+(Debit|Credit)\s+(.+?)\s*-\s*(.*)$/i;

    for (let line of lines) {
        const match = line.match(tableLineRegex);
        if (match) {
            const [, date, description, amount, type, category, notes] = match;
            transactions.push({
                date: new Date(date.split('/').reverse().join('-')),
                description: description.trim(),
                amount: (type.toLowerCase() === 'debit' ? -1 : 1) * parseFloat(amount.replace(/,/g, '')),
                type: type.toLowerCase(),
                category: category.trim(),
                notes: notes.trim(),
            });
        }
    }

    return transactions;
}

module.exports = { parseReceiptText };
