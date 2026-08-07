'use strict';

const billRaw = "420";
const bill = Number(billRaw);
const partySize = 5;
 
const tip = bill > 300 ? bill * 0.10 : bill * 0.5;
const total = bill + tip;
const perPerson = total / partySize;

console.log(`Total = ${total}ETB
        ${perPerson}ETB each`);

const method = "telebirr";
let fee = 0;
switch (method) {
        case 'telebirr':
                fee = total * 0.005;
                break;
        case 'cbebirr':
        case 'dashen':
                fee = total * 0.01;
                break;
        default:
                fee = total * 0.02;
}
console.log(`telebirr fee= ${fee}`)