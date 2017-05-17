# moment-business-days
This is a momentJS plugin that allows you to use only business days (Monday to Friday).

**NOTES:**
* This plugin is for using in NodeJS
* This plugin is based in [this repo](http://goo.gl/i9m4gJ)

### How to use:

````javascript

var moment = require('moment-business-days');
// You'll be able use moment as you normally do

````

#### Use localizaton to configure holidays:

````javascript

var moment = require('moment-business-days');

var july4th = '07-04-2015';
var laborDay = '09-07-2015';

moment.locale('us', {
   holidays: [july4th, laborDay],
   holidayFormat: 'MM-DD-YYYY' 
});

// moment-business-days will now stop considering these holidays as business days

````
#### Use localizaton to customize workingdays:

````javascript

var moment = require('moment-business-days');

moment.locale('us', {
   workingWeekdays: [1,2,3,4,5,6] 
});

// Specifies days form 1 to 6 as a workingday, thus monday to saturday
// When ommiting this configuration parameter, workingdays as used based on locale default

````
#### Run Tests:

`npm test`

### Methods:

**businessAdd(days)**

Will add just business days excluding Saturday and Sunday, return a moment date object:

```javascript
// 30-01-2015 is Friday, DD-MM-YYYY is the format
moment('30-01-2015', 'DD-MM-YYYY').businessAdd(3)._d // Wed Feb 04 2015 00:00:00 GMT-0600 (CST)
```

**businessSubtract(days)**

Will subtract just business days excluding Saturday and Sunday, return a moment date object:

```javascript
// 27-01-2015 is Tuesday, DD-MM-YYYY is the format
moment('27-01-2015', 'DD-MM-YYYY').businessSubtract(3)._d // Thu Jan 22 2015 00:00:00 GMT-0600 (CST)
```

**isBusinessDay()**

Check if the date is a business day and return  **true**/**false**:

```javascript
// 31-01-2015 is Saturday
moment('31-01-2015', 'DD-MM-YYYY').isBusinessDay() // false

// 30-01-2015 is Fridat
moment('30-01-2015', 'DD-MM-YYYY').isBusinessDay() // true
```

**nextBusinessDay()**

Will retrieve the next business date as moment date object:

```javascript
//Next busines day of Friday 30-01-2015
moment('30-01-2015', 'DD-MM-YYYY').nextBusinessDay()._d // Mon Feb 02 2015 00:00:00 GMT-0600 (CST)

//Next busines day of Monday 02-02-2015
moment('02-02-2015', 'DD-MM-YYYY').nextBusinessDay()._d //Tue Feb 03 2015 00:00:00 GMT-0600 (CST)
```

**prevBusinessDay()**

Will retrieve the previous business date as moment date object:

```javascript
//Previous busines day of Monday 02-02-2015
moment('02-02-2015', 'DD-MM-YYYY').prevBusinessDay()._d // Fri Jan 30 2015 00:00:00 GMT-0600 (CST)

//Previous busines day of Tuesday 03-02-2015
moment('03-02-2015', 'DD-MM-YYYY').prevBusinessDay()._d //Mon Feb 02 2015 00:00:00 GMT-0600 (CST)
```

**monthBusinessDays()**

Retrieve an array of the business days in the month, each one is a moment object.

```javascript
//Busines days in month January 2015
moment('01-01-2015', 'DD-MM-YYYY').monthBusinessDays()

/*
[ { _isAMomentObject: true,
    _i: '01-01-2015',
    _f: 'DD-MM-YYYY',
    _isUTC: false,
    _pf:{ ... },
    _locale: { ... },
    _d: Thu Jan 01 2015 00:00:00 GMT-0600 (CST)
  } {
   ...
  },
  ( ... )
]
*/
```

**monthNaturalDays()**

Is like monthBusinessDays(), but this method will include the weekends on it's response.

**monthBusinessWeeks()**

Retrieve an array of arrays, these arrays are the representation of a business weeks and each week (array) have it own business days (Monday to Friday). There could be the case that one week (array) have less than 5 days, this is because the month started on the middle of the week, for example: the first week of January 2015 just have two days, Thursday 1st and Friday 2nd. **Each day in the week arrays are moment objects.**

```javascript
//Busines weeks in month January 2015
moment('01-01-2015', 'DD-MM-YYYY').monthBusinessWeeks()

/*
[ [ { _isAMomentObject: true,
      _i: '01-01-2015',
      _f: 'DD-MM-YYYY',
      _isUTC: false,
      _pf: [...],
      _locale: [...],
      _d: Thu Jan 01 2015 00:00:00 GMT-0600 (CST) 
    }, { _isAMomentObject: true,
      _i: '01-01-2015',
      _f: 'DD-MM-YYYY',
      _isUTC: false,
      _pf: [...],
      _locale: [...],
      _d: Fri Jan 02 2015 00:00:00 GMT-0600 (CST) }
  ],
  [...]
]
*/
```
**monthNaturalWeeks()**

It's like monthBusinessWeeks(), but this method will include weekends on it's response.

The objects returned by functions are momentjs objects (**except isBusinessDay**) so you can handle it with moment native functions.

**businessDiff()**

Calculate number of busines days between dates.

```javascript

var diff = moment('05-15-2017', 'MM-DD-YYYY').businessDiff(moment('05-08-2017','MM-DD-YYYY'));
// diff = 5
/*
