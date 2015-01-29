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

The objects returned by functions are momentjs objects (**except isBusinessDay**) so you can handle it with moment native functions.
