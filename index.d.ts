import * as moment from 'moment';

declare module 'moment' {
    interface Moment {
        isHoliday: () => boolean;
        isBusinessDay: () => boolean;

        businessDaysIntoMonth: () => number;

        businessDiff: (param: Moment) => number;
        businessAdd: (param: number, period?: unitOfTime.Base) => Moment;
        businessSubtract: (param: number, period?: unitOfTime.Base) => Moment;

        nextBusinessDay: () => Moment;
        prevBusinessDay: () => Moment;

        monthBusinessDays: (partialEndDate?: Moment) => Moment[];
        monthNaturalDays: (fromToday?: boolean) => Moment[];
        monthBusinessWeeks: (fromToday?: boolean) => Moment[][];
        monthNaturalWeeks: (fromToday?: boolean) => Moment[][];
    }

    interface LocaleSpecification {
        holidays?: string[];
        holidayFormat?: string;
    }
}

export = moment;
