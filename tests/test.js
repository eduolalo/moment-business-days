'use strict';
var moment = require('../index');
var expect = require("chai").expect
var holidayFormat = 'DD-MM-YYYY';

var resetLocale = function (done) {
    moment.locale('us', {});
    done()
};

describe('Moment Business Days', function () {
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
            
            var july4th = '04-07-2015';
            var laborDay = '07-09-2015';
            var regularDay = '28-09-2015';
            
            beforeEach(function (done) {
                moment.locale('us', {
                    holidays: [july4th, laborDay],
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
    
});
