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
    if (this.day() === 0 || this.day() === 6) return false;
    if (this.isHoliday()) return false;
    return true;
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
    var count = 0;
    var maybeBizDay = start.clone();
    
    while ( maybeBizDay.isBefore(end) ) {
        if (maybeBizDay.isBusinessDay() ) {
            count++; 
        }
        maybeBizDay = maybeBizDay.add(1, 'days');
    }

    return signal * count;
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
