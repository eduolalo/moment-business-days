'use strict';
var moment = require('../index');
var expect = require('chai').expect;
var holidayFormat = 'MM-DD-YYYY';

var resetLocale = function (done) {
  moment.updateLocale('us', {});
  done();
};

describe('Moment Business Days', function () {
  afterEach(resetLocale);
  describe('.prevBusinessDay', function () {
    describe('When today is Monday', function () {
      it('should be Friday', function (done) {
        var monday = moment()
          .startOf('week')
          .add(1, 'days');
        var friday = monday.prevBusinessDay();
        expect(friday.format('dddd')).to.eql('Friday');
        done();
      });
    });
    describe('On April 10th, 2019', function () {
      beforeEach(function (done) {
        moment.updateLocale('us', {
          holidays: ['04-05-2019', '04-06-2019', '04-07-2019', '04-08-2019', '04-09-2019'],
          holidayFormat: 'MM-DD-YYYY',
          workingWeekdays: [1],
          prevBusinessDayLimit: 31,
        });
        done();
      });

      afterEach(resetLocale);

      it('should be 1st when considering holidays and custom working days', function (done) {
        var first = moment().prevBusinessDay();
        expect(first.format('D')).to.eql('1');
        done();
      });
    });
  });
  describe('.isBusinessDay', function () {
    describe('When today is a regular weekday', function () {
      it('should be true', function (done) {
        var wednesday = moment()
          .startOf('week')
          .add(3, 'days');
        expect(wednesday.isBusinessDay()).to.be.true;
        done();
      });
    });
    describe('When today is a weekend', function () {
      it('should be false', function (done) {
        var sunday = moment().startOf('week');
        expect(sunday.isBusinessDay()).to.be.false;
        done();
      });
    });

    describe('When today is a holiday determined by a function', function () {
      var callCount = 0;

      beforeEach(function (done) {
        moment.locale('xmas', {
          // Every Christmas is a holiday, no matter the year
          holiday: function (someMoment) {
            callCount++;

            // Months indexed starting at 0, so December is 11.
            return someMoment.month() === 11 && someMoment.date() === 25;
          }
        });
        done();
      });

      afterEach(resetLocale);

      it('should be false', function (done) {
        // In these years, Christmas was a weekday
        expect(moment('2012-12-25').isBusinessDay()).to.be.false;
        expect(moment('2013-12-25').isBusinessDay()).to.be.false;
        expect(moment('2014-12-25').isBusinessDay()).to.be.false;
        expect(moment('2015-12-25').isBusinessDay()).to.be.false;
        expect(callCount).to.equal(4);
        done();
      });
    });

    describe('When today is custom working day', function () {
      beforeEach(function (done) {
        moment.updateLocale('us', {
          workingWeekdays: [1, 2, 3, 4, 5, 6]
        });
        done();
      });
      it('Should be true', function (done) {
        var saturday = moment().endOf('week');
        expect(saturday.isBusinessDay()).to.be.true;
        done();
      });
    });
    describe('When today is a holiday', function () {
      var july4th = '07-04-2015';

      beforeEach(function (done) {
        moment.updateLocale('us', {
          holidays: [july4th],
          holidayFormat: holidayFormat
        });
        done();
      });

      afterEach(resetLocale);

      it('should be false', function (done) {
        expect(moment(july4th, holidayFormat).isBusinessDay()).to.be.false;
        done();
      });
    });
  });
  describe('.businessDaysIntoMonth', function () {
    afterEach(resetLocale);

    describe('When moment object is invalid', function () {
      it('should return NaN', function () {
        var businessDaysIntoMonth = moment(null).businessDaysIntoMonth();
        expect(businessDaysIntoMonth).to.be.NaN;
      });
    });
    describe('On Wednesday, September 23rd 2015', function () {
      it('should be 17 when there are no holidays', function (done) {
        moment.updateLocale('us', {
          workingWeekdays: null
        });
        var businessDaysIntoMonth = moment(
          '09-23-2015',
          'MM-DD-YYYY'
        ).businessDaysIntoMonth();
        expect(businessDaysIntoMonth).to.eql(17);
        done();
      });
      it('should be 16 when considering labor day', function (done) {
        moment.updateLocale('us', {
          holidays: ['09-07-2015'],
          holidayFormat: holidayFormat
        });
        var businessDaysIntoMonth = moment(
          '09-23-2015',
          'MM-DD-YYYY'
        ).businessDaysIntoMonth();
        expect(businessDaysIntoMonth).to.eql(16);
        done();
      });
    });
  });
  describe('.businessAdd', function () {
    afterEach(resetLocale);

    describe('When moment object is invalid', function () {
      it('should return a new invalid moment object', function () {
        var originalMoment = moment(null);
        var newBusinessDay = originalMoment.businessAdd(3);
        // Deepy equal but not strictly equal
        expect(originalMoment).to.eql(newBusinessDay);
        expect(originalMoment).not.equal(newBusinessDay);
        // New moment object should also be invalid
        expect(newBusinessDay.isValid()).to.be.false;
      });
    });
    describe('On Tuesday, November 3rd 2015', function () {
      it('adds business days only, excluding weekends, even over 2 weeks', function (done) {
        var newBusinessDay = moment('11-03-2015', 'MM-DD-YYYY').businessAdd(5);
        expect(newBusinessDay.format('D')).to.eql('10');
        done();
      });
      it('adds business days only, excluding weekends', function (done) {
        var newBusinessDay = moment('11-03-2015', 'MM-DD-YYYY').businessAdd(10);
        expect(newBusinessDay.format('D')).to.eql('17');
        done();
      });
      it('adds business days only, excluding weekends, preserving time-of-day', function (done) {
        var newBusinessDay = moment('11-03-2015 12:42:00', 'MM-DD-YYYY hh-mm-ss').businessAdd(10);
        expect(newBusinessDay.format('MM-DD-YYYY hh:mm:ss')).to.eql('11-17-2015 12:42:00');
        done();
      });
      it('adds business days only, excluding weekends, rounding down fractional day values', function (done) {
        var newBusinessDay = moment('11-03-2015 12:42:00', 'MM-DD-YYYY hh-mm-ss').businessAdd(10.4);
        expect(newBusinessDay.format('D')).to.eql('17');
        done();
      });
      it('adds business days only, excluding weekends, rounding up fractional day values', function (done) {
        var newBusinessDay = moment('11-03-2015 12:42:00', 'MM-DD-YYYY hh-mm-ss').businessAdd(10.5);
        expect(newBusinessDay.format('D')).to.eql('18');
        done();
      });
      it('subtracts business days when negative values are added, excluding weekends, rounding down fractional day values', function (done) {
        var newBusinessDay = moment('11-03-2015 12:42:00', 'MM-DD-YYYY hh-mm-ss').businessAdd(-10.4);
        expect(newBusinessDay.format('D')).to.eql('20');
        done();
      });
      it('subtracts business days when negative values are added, excluding weekends, rounding up fractional day values', function (done) {
        var newBusinessDay = moment('11-03-2015 12:42:00', 'MM-DD-YYYY hh-mm-ss').businessAdd(-10.5);
        expect(newBusinessDay.format('D')).to.eql('19');
        done();
      });
      it('adds business hours only, excluding weekends', function (done) {
        var newBusinessDay = moment('11-06-2015', 'MM-DD-YYYY').businessAdd(
          36,
          'hours'
        );
        expect(newBusinessDay.format('D')).to.eql('9');
        done();
      });
      it('adds business days only, excluding weekends and holidays, if present', function (done) {
        moment.updateLocale('us', {
          holidays: ['11-05-2015'],
          holidayFormat: holidayFormat
        });
        var newBusinessDay = moment('11-03-2015', 'MM-DD-YYYY').businessAdd(5);
        expect(newBusinessDay.format('D')).to.eql('11');
        done();
      });
      it('adds business days only, excluding weekends and holidays, if present, even over 2 weeks', function (done) {
        moment.updateLocale('us', {
          holidays: ['11-05-2015', '11-12-2015'],
          holidayFormat: holidayFormat
        });
        var newBusinessDay = moment('11-03-2015', 'MM-DD-YYYY').businessAdd(10);
        expect(newBusinessDay.format('D')).to.eql('19');
        done();
      });
    });
  });
  describe('Business Diff', function () {
    afterEach(resetLocale);
    it('Should calculate number of busines days between dates', function () {
      var diff = moment('05-15-2017', 'MM-DD-YYYY').businessDiff(
        moment('05-08-2017', 'MM-DD-YYYY')
      );
      expect(diff).to.eql(5);
    });
    it('...and in reverse order', function () {
      var diff = moment('05-08-2017', 'MM-DD-YYYY').businessDiff(
        moment('05-15-2017', 'MM-DD-YYYY')
      );
      expect(diff).to.eql(5);
    });
    it('Should calculate nr of business days with custom workingdays', function () {
      moment.updateLocale('us', {
        workingWeekdays: [1, 2, 3, 4, 5, 6]
      });
      var diff = moment('05-15-2017', 'MM-DD-YYYY').businessDiff(
        moment('05-08-2017', 'MM-DD-YYYY')
      );
      expect(diff).to.eql(6);
    });
    it('Should calculate nr of business with all working days', function () {
      moment.updateLocale('us', {
        workingWeekdays: [0, 1, 2, 3, 4, 5, 6]
      });
      var diff = moment('06-18-2017', 'MM-DD-YYYY').businessDiff(
        moment('05-18-2017', 'MM-DD-YYYY')
      );
      expect(diff).to.eql(31);
    });
    it('Should be zero days if start and end is same', function () {
      var diff = moment('05-08-2017', 'MM-DD-YYYY').businessDiff(
        moment('05-08-2017', 'MM-DD-YYYY')
      );
      expect(diff).to.eql(0);
    });
    it('Should be zero days if start and end is same disregarding hours', function () {
      var diff = moment('2018-08-16T19:06:57.665Z').businessDiff(
        moment('2018-08-16T18:06:57.665Z')
      );
      expect(diff).to.eql(0);
    });
  });
  describe('Aggregate functions return empty array on invalid object', function () {
    afterEach(resetLocale);
    it('Should return empty array on .monthBusinessDays', function () {
      var monthBusinessDays = moment(null).monthBusinessDays();
      expect(monthBusinessDays).to.be.an('array').that.is.empty;
    });
    it('Should return empty array on .monthNaturalDays', function () {
      var monthNaturalDays = moment(null).monthNaturalDays();
      expect(monthNaturalDays).to.be.an('array').that.is.empty;
    });
    it('Should return empty array on .monthBusinessWeeks', function () {
      var monthBusinessWeeks = moment(null).monthBusinessWeeks();
      expect(monthBusinessWeeks).to.be.an('array').that.is.empty;
    });
    it('Should return empty array on .monthNaturalWeeks', function () {
      var monthNaturalWeeks = moment(null).monthNaturalWeeks();
      expect(monthNaturalWeeks).to.be.an('array').that.is.empty;
    });
  });
});
