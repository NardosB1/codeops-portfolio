export const totalByType = (txns, type) => txns.filter((t) => t.type === type).reduce((sum, { amount }) => sum + amount, 0);

export const byType = (txns, type) => txns.filter((t) => t.type === type);

export const formatReceipts = (txns) => txns.map(({ id, customer, amount, type }) => {const sign = type === "credit" ? "+" : "-";
        return `#${id} ${customer}: ${sign}${amount} ETB (${type})`;
    });

export const correctAmount = (txn, newAmount) => ({...txn, amount: newAmount,});

export const buildSummary = (txns) => {const totalCredits = totalByType(txns, "credit");
    const totalDebits = totalByType(txns, "debit");
    return {
        totalCredits, totalDebits,
        net: totalCredits - totalDebits,
    };
};
