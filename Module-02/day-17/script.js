//function myfun() {
//    return "Selam!";
//}
//myfun();
//const num = (n) => n + 1; 
//num();
//const greet = functionouter() {
//    let student = "Abebe";

//const inner = {} => {
  //  console.log(student);
//};
//inner();
//};
//greet();

function makeGreeter(city) {
    // inner function "closes over" city
    return function (name) {
    return `Selam ${name}, from ${city}`;
    };
}

const addis = makeGreeter("Addis Ababa");

addis("Almaz"); // "Selam Almaz, from..."
addis("Abebe");

const myFun = () => {
    let inner = () => {
        console.log("Hello World")
    }
    return inner
}

let inner = myFun();
myFun()


function myCounter() {
    let counter = 0;
    return function() {
    counter++;
    return counter;
    };
}
const add = myCounter();
//console.log(add());
//console.log(add());



function addition(n1, n2, callback) {
    callback(n1,n2);
}

addition(5, 6, (a, b) => {
    console.log("Sum:", a + b);
});
