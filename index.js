'use strict';

if (typeof require === 'function') {
  var moment = require('moment');
}

moment.fn.isHoliday = function () {
  var locale = this.localeData();

  if (locale._holidays && locale._holidays.indexOf(this.format(locale._holidayFormat)) >= 0) {
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

  if (locale._forcedBusinessDays && locale._forcedBusinessDays.indexOf(this.format(locale._forcedBusinessDaysFormat)) >= 0) {
    return true;
  }

  if (this.isHoliday()) return false;

  if (workingWeekdays.indexOf(this.day()) >= 0) return true;

  return false;
};

moment.fn.businessDaysIntoMonth = function () {
  if (!this.isValid()) {
    return NaN;
  }

  var businessDay = this.clone();
  var pointer = this.clone().startOf('month');
  var end = this.clone().endOf('month');
  var businessDaysIntoMonth = 0;

  for(;;) {
    if (pointer.isAfter(end, 'day')) {
      break;
    }

    if (pointer.isBusinessDay()) {
      businessDaysIntoMonth += 1;
    }

    if (businessDay.isSame(pointer, 'day')) {
      break;
    }

    pointer.add(1, 'day')
  }

  return businessDaysIntoMonth;
};

moment.fn.businessDiff = function (param, relative) {
  var d1 = this.clone();
  var d2 = param.clone();
  var positive = d1 >= d2;
  var start = d1 < d2 ? d1 : d2;
  var end = d2 > d1 ? d2 : d1;
  var daysBetween = 0;

  if (start.isSame(end, 'day')) {
    return daysBetween;
  }

  while (start.isBefore(end, 'day')) {
    if (start.isBusinessDay()) {
      daysBetween += 1;
    }
    start.add(1, 'd');

  }

  if (!end.isBusinessDay()) {
    daysBetween -= 1;
  }

  if (relative) {
    return (positive ? daysBetween : -daysBetween);
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
      remaining -= 1;
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
    loop += 1;
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
    loop += 1;
  }
  return this;
};

moment.fn.monthBusinessDays = function (partialEndDate) {
  if (!this.isValid()) {
    return [];
  }

  var day = this.clone().startOf('month');
  var end = partialEndDate || this.clone().endOf('month');
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

  var day = fromToday ? this.clone() : this.clone().startOf('month');
  var end = this.clone().endOf('month');
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
  fromToday = fromToday || false;
  var startDate = fromToday ? this.clone() : this.clone().startOf('month');
  return _getBusinessWeeks(this, null, startDate);
};

moment.fn.businessWeeksBetween = function (endDate) {
  var startDate = this.clone();
  return _getBusinessWeeks(this, endDate, startDate);
};

var _getBusinessWeeks = function (self, endDate, startDate) {
  if (!self.isValid()) {
    return [];
  }

  var day = startDate;
  var end = endDate ? moment(endDate).clone() : self.clone().endOf('month');
  var weeksArr = [];
  var daysArr = [];
  var done = false;

  while (!done) {
    if (day.isBusinessDay()) {
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

  var day = fromToday ? this.clone() : this.clone().startOf('month');
  var end = this.clone().endOf('month');
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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = moment;
}
