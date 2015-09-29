'use strict';
var moment = require('../index');
var expect = require("chai").expect
var holidayFormat = 'MM-DD-YYYY';

var resetLocale = function (done) {
    moment.locale('us', {});
    done()
};

describe('Moment Business Days', function () {
    describe('.prevBusinessDay', function () {
        describe('When today is Monday', function () {
            it('should be Friday', function (done) {
                var monday = moment().startOf('week').add(1, 'days');
                var friday = monday.prevBusinessDay();
                expect(friday.format('dddd')).to.eql('Friday');
                done();
            });
        });      
    });
    describe('.isBusinessDay', function () {
        describe('When today is a regular weekday', function () {
            it('should be true', function (done) {
                var wednesday = moment().startOf('week').add(3, 'days');
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
        describe('When today is a holiday', function () {
            
            var july4th = '07-04-2015';
            
            beforeEach(function (done) {
                moment.locale('us', {
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
        
        describe('On Wednesday, September 23rd 2015', function () {
            it('should be 17 when there are no holidays', function (done) {
                var businessDaysIntoMonth = moment('09-23-2015', 'MM-DD-YYYY').businessDaysIntoMonth();
                expect(businessDaysIntoMonth).to.eql(17);
                done();
            });
            it('should be 16 when considering labor day', function (done) {
                moment.locale('us', {
                    holidays: ['09-07-2015'],
                    holidayFormat: holidayFormat
                });
                var businessDaysIntoMonth = moment('09-23-2015', 'MM-DD-YYYY').businessDaysIntoMonth();
                expect(businessDaysIntoMonth).to.eql(16);
                done();
            });
        });      
    });
});
