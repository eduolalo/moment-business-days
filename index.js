'use strict';
var moment = require('moment');

moment.fn.isHoliday = function () {
    var locale = this.localeData();

    if (locale._holidays) {
        if (locale._holidays.indexOf(this.format(locale._holidayFormat)) >= 0) return true;
    }

    return false;
};

moment.fn.isBusinessDay = function() {
    var locale = this.localeData();
    var defaultWorkingWeekdays = [1,2,3,4,5];
    var workingWeekdays = locale._workingWeekdays || defaultWorkingWeekdays;

    if (this.isHoliday()) return false;
    if (workingWeekdays.indexOf(this.day())>=0) return true;

    return false;
};

moment.fn.businessDaysIntoMonth = function () {
    var businessDay = this.isBusinessDay() ? this : this.prevBusinessDay();
    var monthBusinessDays = businessDay.monthBusinessDays();
    var businessDaysIntoMonth;
    monthBusinessDays.map(function (day, index) {
        if (day.format('M/DD/YY') === businessDay.format('M/DD/YY'))
            businessDaysIntoMonth = index + 1;
    });

    return businessDaysIntoMonth;
};

moment.fn.businessDiff = function(param) {
    param = moment(param);
    var signal = param.unix() < this.unix()?1:-1;
    var start = moment.min(param, this).clone();
    var end = moment.max(param, this).clone();
    var start_offset = start.day() - 7;
    var end_offset = end.day();

    var end_sunday = end.clone().subtract('d', end_offset);
    var start_sunday = start.clone().subtract('d', start_offset);
    var weeks = end_sunday.diff(start_sunday, 'days') / 7;

    start_offset = Math.abs(start_offset);
    if (start_offset == 7) {
      start_offset = 5;
    } else if (start_offset == 1) {
      start_offset = 0;
    } else {
      start_offset -= 2;
    };

    if (end_offset == 6) {
      end_offset--;
    };

    return signal * (weeks * 5 + start_offset + end_offset);
};

moment.fn.businessAdd = function(days) {
    var signal = days < 0 ? -1 : 1;
    var daysRemaining = Math.abs(days);
    var d = this.clone();
    while (daysRemaining) {
      d.add(signal, 'd');
      if (d.isBusinessDay()) {
        daysRemaining--;
      };
    };
    return d;
};

moment.fn.businessSubtract = function(days) {
    return this.businessAdd(-days);
};


moment.fn.nextBusinessDay = function() {
    var loop = 1;
    var limit = 7;
    while (loop < limit) {
        if (this.add(1, 'd').isBusinessDay()) {
            break;
        };
        loop++;
    };
    return this;
};

moment.fn.prevBusinessDay = function() {
    var loop = 1;
    var limit = 7;
    while (loop < limit) {
        if (this.subtract(1, 'd').isBusinessDay()) {
            break;
        };
        loop++;
    };
    return this;
};

moment.fn.monthBusinessDays = function() {
    var me = this.clone();
    var day = me.clone().startOf('month');
    var end = me.clone().endOf('month');
    var daysArr = [];
    var done = false;
    while (!done) {
        if (day.isBusinessDay()) {
            daysArr.push(day.clone());
        };
        if(end.diff(day.add(1,'d')) < 0) {
            done = true;
        };
    };
    return daysArr;
};

moment.fn.monthNaturalDays = function(fromToday) {
    var me = this.clone();
    var day = fromToday ? me.clone() : me.clone().startOf('month');
    var end = me.clone().endOf('month');
    var daysArr = [];
    var done = false;
    while (!done) {
        daysArr.push(day.clone());
        if(end.diff(day.add(1,'d')) < 0) {
            done = true;
        };
    };
    return daysArr;
};

moment.fn.monthBusinessWeeks = function(fromToday) {
    var me = this.clone();
    var day = fromToday ? me.clone() : me.clone().startOf('month');
    var end = me.clone().endOf('month');
    var weeksArr = [];
    var daysArr = [];
    var done = false;

    while(!done) {
        if(day.day() >= 1 && day.day() < 6) {
            daysArr.push(day.clone());
        };
        if(day.day() === 5) {
            weeksArr.push(daysArr);
            daysArr = [];
        };
        if(end.diff(day.add(1,'d')) < 0) {
            if(daysArr.length < 5) {
                weeksArr.push(daysArr);
            };
            done = true;
        };
    };
    return weeksArr;
};

moment.fn.monthNaturalWeeks = function(fromToday) {
    var me = this.clone();
    var day = fromToday ? me.clone() : me.clone().startOf('month');
    var end = me.clone().endOf('month');
    var weeksArr = [];
    var daysArr = [];
    var done = false;

    while(!done) {
        daysArr.push(day.clone());
        if(day.day() === 6) {
            weeksArr.push(daysArr);
            daysArr = [];
        };
        if(end.diff(day.add(1,'d')) < 0) {
            if(daysArr.length < 7) {
                weeksArr.push(daysArr);
            };
            done = true;
        };
    };
    return weeksArr;
};

module.exports = moment;
