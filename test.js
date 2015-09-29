'use strict';
var moment = require('./index');

console.log('Add 3 business days to Friday 30-01-2015: ')
console.log(moment('30-01-2015', 'DD-MM-YYYY').businessAdd(3)._d);

console.log('Substracting 3 business days to Tuesday 27-01-2015: ')
console.log(moment('27-01-2015', 'DD-MM-YYYY').businessSubtract(3)._d);

console.log('Check if Saturday 31-01-2015 is a business day: ')
console.log(moment('31-01-2015', 'DD-MM-YYYY').isBusinessDay());

console.log('Check if Friday 30-01-2015 is a business day: ')
console.log(moment('30-01-2015', 'DD-MM-YYYY').isBusinessDay());

console.log('Next busines day of Friday 30-01-2015: ')
console.log(moment('30-01-2015', 'DD-MM-YYYY').nextBusinessDay()._d);

console.log('Next busines day of Monday 02-02-2015: ')
console.log(moment('02-02-2015', 'DD-MM-YYYY').nextBusinessDay()._d);

console.log('Busines days in this month: ')
console.log(moment('01-01-2015', 'DD-MM-YYYY').monthBusinessDays());

console.log('Busines weeks in this month: ')
console.log(moment('01-01-2015', 'DD-MM-YYYY').monthBusinessWeeks());

console.log('Natural days in this month: ')
console.log(moment('01-01-2015', 'DD-MM-YYYY').monthNaturalDays());

console.log('Natural weeks in this month: ')
console.log(moment('01-01-2015', 'DD-MM-YYYY').monthNaturalWeeks());
