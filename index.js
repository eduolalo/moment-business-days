'use strict';

if (typeof require === 'function') {
  var moment = require('moment');
}

moment.fn.isHoliday = function () {
  var locale = this.localeData();

  if (locale._holidays) {
    if (locale._holidays.indexOf(this.format(locale._holidayFormat)) >= 0)
      return true;
  }

  if (locale.holiday) {
    if (locale.holiday(this)) {
      return true;
    }
    return false;
  }

  return false;
};

moment.fn.isBusinessDay = function () {
  var locale = this.localeData();
  var defaultWorkingWeekdays = [1, 2, 3, 4, 5];
  var workingWeekdays = locale._workingWeekdays || defaultWorkingWeekdays;

  if (this.isHoliday()) return false;
  if (workingWeekdays.indexOf(this.day()) >= 0) return true;

  return false;
};

moment.fn.businessDaysIntoMonth = function () {
  if (!this.isValid()) {
    return NaN;
  }
  var businessDay = this.isBusinessDay() ? this : this.prevBusinessDay();
  var monthBusinessDays = businessDay.monthBusinessDays();
  var businessDaysIntoMonth;
  monthBusinessDays.map(function (day, index) {
    if (day.format('M/DD/YY') === businessDay.format('M/DD/YY')) {
      businessDaysIntoMonth = index + 1;
    }
  });
  return businessDaysIntoMonth;
};

moment.fn.businessDiff = function (param, relative) {
  var d1 = this.clone();
  var d2 = param.clone();
  var positive = d1 >= d2;
  var start = d1 < d2 ? d1 : d2;
  var end = d2 > d1 ? d2 : d1;

  var daysBetween = 0;

  if (start.format('DD/MM/YYYY') === end.format('DD/MM/YYYY')) {
    return daysBetween;
  }

  while (start < end) {
    if (start.isBusinessDay()) {
      daysBetween++;
    }
    start.add(1, 'd');
  }

  if (relative) {
    return positive ? daysBetween : -daysBetween;
  }

  return daysBetween;
};

moment.fn.businessAdd = function (number, period) {
  var day = this.clone();
  if (!day.isValid()) {
    return day;
  }

  if (number < 0) {
    number = Math.round(-1 * number) * -1;
  } else {
    number = Math.round(number);
  }

  var signal = number < 0 ? -1 : 1;
  period = typeof period !== 'undefined' ? period : 'days';

  var remaining = Math.abs(number);
  while (remaining > 0) {
    day.add(signal, period);

    if (day.isBusinessDay()) {
      remaining--;
    }
  }

  return day;
};

moment.fn.businessSubtract = function (number, period) {
  return this.businessAdd(-number, period);
};

moment.fn.nextBusinessDay = function () {
  var locale = this.localeData();

  var loop = 1;
  var defaultNextBusinessDayLimit = 7;
  var limit = locale._nextBusinessDayLimit || defaultNextBusinessDayLimit;
  while (loop < limit) {
    if (this.add(1, 'd').isBusinessDay()) {
      break;
    }
    loop++;
  }
  return this;
};

moment.fn.prevBusinessDay = function () {
  var locale = this.localeData();

  var loop = 1;
  var defaultPrevBusinessDayLimit = 7;
  var limit = locale._prevBusinessDayLimit || defaultPrevBusinessDayLimit;
  while (loop < limit) {
    if (this.subtract(1, 'd').isBusinessDay()) {
      break;
    }
    loop++;
  }
  return this;
};

moment.fn.monthBusinessDays = function (partialEndDate) {
  if (!this.isValid()) {
    return [];
  }
  var me = this.clone();
  var day = me.clone().startOf('month');
  var end = partialEndDate ? partialEndDate : me.clone().endOf('month');
  var daysArr = [];
  var done = false;
  while (!done) {
    if (day.isBusinessDay()) {
      daysArr.push(day.clone());
    }
    if (end.diff(day.add(1, 'd')) < 0) {
      done = true;
    }
  }
  return daysArr;
};

moment.fn.monthNaturalDays = function (fromToday) {
  if (!this.isValid()) {
    return [];
  }
  var me = this.clone();
  var day = fromToday ? me.clone() : me.clone().startOf('month');
  var end = me.clone().endOf('month');
  var daysArr = [];
  var done = false;
  while (!done) {
    daysArr.push(day.clone());
    if (end.diff(day.add(1, 'd')) < 0) {
      done = true;
    }
  }
  return daysArr;
};

moment.fn.monthBusinessWeeks = function (fromToday) {
  if (!this.isValid()) {
    return [];
  }
  var me = this.clone();
  var day = fromToday ? me.clone() : me.clone().startOf('month');
  var end = me.clone().endOf('month');
  var weeksArr = [];
  var daysArr = [];
  var done = false;

  while (!done) {
    if (day.day() >= 1 && day.day() < 6) {
      daysArr.push(day.clone());
    }
    if (day.day() === 5) {
      weeksArr.push(daysArr);
      daysArr = [];
    }
    if (end.diff(day.add(1, 'd')) < 0) {
      if (daysArr.length < 5) {
        weeksArr.push(daysArr);
      }
      done = true;
    }
  }
  return weeksArr;
};

moment.fn.monthNaturalWeeks = function (fromToday) {
  if (!this.isValid()) {
    return [];
  }
  var me = this.clone();
  var day = fromToday ? me.clone() : me.clone().startOf('month');
  var end = me.clone().endOf('month');
  var weeksArr = [];
  var daysArr = [];
  var done = false;

  while (!done) {
    daysArr.push(day.clone());
    if (day.day() === 6) {
      weeksArr.push(daysArr);
      daysArr = [];
    }
    if (end.diff(day.add(1, 'd')) < 0) {
      if (daysArr.length < 7) {
        weeksArr.push(daysArr);
      }
      done = true;
    }
  }
  return weeksArr;
};

if (typeof module != 'undefined' && module.exports) {
  module.exports = moment;
}
