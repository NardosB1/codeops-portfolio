import { transactions } from "./transactions.js";
import {
    formatReceipts,
    correctAmount,
    buildSummary,
} from "./report.js";

console.log("TeleBirr Transaction Report \n");

console.log("Receipts:");
formatReceipts(transactions).forEach((line) => console.log(line));

const { totalCredits, totalDebits, net } = buildSummary(transactions);

console.log("\nTotals:");
console.log(`Credits: ${totalCredits} ETB`);
console.log(`Debits: ${totalDebits} ETB`);
console.log(`Net balance: ${net} ETB`);

const corrected = correctAmount(transactions[0], 300);

console.log("\nCorrection example (spread, no mutation):");
console.log("Original:", transactions[0]);
console.log("Corrected copy:", corrected);
