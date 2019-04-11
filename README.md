# moment-business-days
This is a [Moment.js](https://github.com/moment/moment/) plugin that allows you to work with only business days
(Monday to Friday). You can customize the working week, and also set custom dates for holidays to exclude them from
being counted as business days, for example **national holidays**.

## Notes
* This plugin works on both server and client side.
* This plugin is based on [momentjs-business](https://github.com/leonardosantos/momentjs-business).
* All contributions are welcome.
* **Thanks to the contributors for making this plugin better!!**

## Usage

````javascript
// NodeJS: require instead of standard moment package
var moment = require('moment-business-days');
// You'll be able use Moment.js as you normally do
````

````html
<!-- Browser -->
<!-- NB: add after moment.js -->
<script src="moment.js"></script>
<script src="moment-business-days.js"></script>
````

## Configuration

### Use localization to configure holidays

````javascript
var moment = require('moment-business-days');

var july4th = '07-04-2015';
var laborDay = '09-07-2015';

moment.updateLocale('us', {
   holidays: [july4th, laborDay],
   holidayFormat: 'MM-DD-YYYY'
});

// moment-business-days will now stop considering these holidays as business days
````

### Use localization to configure business days

````javascript
var moment = require('moment-business-days');

moment.updateLocale('us', {
   workingWeekdays: [1, 2, 3, 4, 5, 6]
});

// Defines days from 1 (Monday) to 6 (Saturday) as business days. Note that Sunday is day 0.
// When omitting this configuration parameter, business days are based on locale default
````

## API

The objects returned by methods are **Moment.js** objects (except `.isBusinessDay()` and `.businessDiff()`) so you can
handle them with **Moment.js** native methods.

#### `.isHoliday()` => boolean

Check if the date is among the holidays specified, and return **true** or **false**:

#### `.isBusinessDay()` => boolean

Check if the date is a business day, and return **true** or **false**:

```javascript
// 31-01-2015 is Saturday
moment('31-01-2015', 'DD-MM-YYYY').isBusinessDay() // false

// 30-01-2015 is Friday
moment('30-01-2015', 'DD-MM-YYYY').isBusinessDay() // true
```

#### `.businessDaysIntoMonth()` => number

Calculate the amount of business days in the month of the **Moment.js** object.

#### `.businessDiff()` => number

Calculate the amount of business days between dates.

```javascript
var diff = moment('05-15-2017', 'MM-DD-YYYY').businessDiff(moment('05-08-2017','MM-DD-YYYY'));
// diff = 5
```

#### `.businessAdd(days)` => Moment

Will add the given number of days skipping non-business days, returning a **Moment.js** object:

```javascript
// 30-01-2015 is Friday, DD-MM-YYYY is the format
moment('30-01-2015', 'DD-MM-YYYY').businessAdd(3)._d // Wed Feb 04 2015 00:00:00 GMT-0600 (CST)
```

#### `.businessSubtract(days)` => Moment

Will subtract the given number of days skipping non-business days, returning a **Moment.js** object:

```javascript
// 27-01-2015 is Tuesday, DD-MM-YYYY is the format
moment('27-01-2015', 'DD-MM-YYYY').businessSubtract(3)._d // Thu Jan 22 2015 00:00:00 GMT-0600 (CST)
```

#### `.nextBusinessDay()` => Moment

Will retrieve the next business date as a **Moment.js** object:

```javascript
// Next business day from Friday 30-01-2015
moment('30-01-2015', 'DD-MM-YYYY').nextBusinessDay()._d // Mon Feb 02 2015 00:00:00 GMT-0600 (CST)

// Next business day from Monday 02-02-2015
moment('02-02-2015', 'DD-MM-YYYY').nextBusinessDay()._d //Tue Feb 03 2015 00:00:00 GMT-0600 (CST)
```

By default only 7 days into the future are checked for the next business day. To search beyond 7 days
set the nextBusinessDayLimit (as a number) higher.
````javascript
var moment = require('moment-business-days');

moment.updateLocale('us', {
   nextBusinessDayLimit: 31
});
````

#### `.prevBusinessDay()` => Moment

Will retrieve the previous business date as a **Moment.js** object:

```javascript
// Previous business day of Monday 02-02-2015
moment('02-02-2015', 'DD-MM-YYYY').prevBusinessDay()._d // Fri Jan 30 2015 00:00:00 GMT-0600 (CST)

// Previous business day of Tuesday 03-02-2015
moment('03-02-2015', 'DD-MM-YYYY').prevBusinessDay()._d //Mon Feb 02 2015 00:00:00 GMT-0600 (CST)
```

By default only the last 7 days are checked for the previous business day. To search beyond 7 days
set the prevBusinessDayLimit (as a number) higher.
````javascript
var moment = require('moment-business-days');

moment.updateLocale('us', {
   prevBusinessDayLimit: 31
});
````

#### `.monthBusinessDays()` => Moment[]

Retrieve an array of the business days in the month, each one is a **Moment.js** object.

```javascript
// Business days in month January 2015
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

#### `.monthNaturalDays()` => Moment[]

Is like `.monthBusinessDays()`, but this method will include the weekends in it's response.

#### `.monthBusinessWeeks()` => Moment[][]

Retrieve an array of arrays, these arrays are the representation of a business weeks and each week (array) have it own
business days (Monday to Friday). There could be the case that one week (array) have less than 5 days, this is because
the month started in the middle of a week, for example: the first week of January 2015 has just two days,
Thursday 1st and Friday 2nd. **Each day in the week arrays are Moment.js objects.**

```javascript
// Business weeks in month January 2015
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

#### `.monthNaturalWeeks()` => Moment[][]

It's like `.monthBusinessWeeks()`, but this method will include weekends in it's response.

## Installation

````
// For Node.js
$ npm install moment-business-days

// ...or install and save in package.json
$ npm install --save moment-business-days

// For bower
$ bower install moment-business-days
````

## Testing

````
npm test
````
