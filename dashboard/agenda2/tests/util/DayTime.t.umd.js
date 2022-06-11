"use strict";

StartTest(t => {
  const MILLIS_MINUTE = 60 * 1000,
        MILLIS_HOUR = 60 * MILLIS_MINUTE;

  function makeDate(time, days = 0) {
    time = time.split(':').map(p => +p);
    return new Date(2020, 1, 10 + days, ...time);
  }

  function makeEvent(startDate, endDate) {
    return new EventModel({
      startDate,
      endDate
    });
  }

  t.describe('Misc', t => {
    t.it('should parse various date formats', t => {
      t.isStrict(DayTime.parse('2:10'), 2 * MILLIS_HOUR + 10 * MILLIS_MINUTE, 'Parses H:MM');
      t.isStrict(DayTime.parse('12:10'), 12 * MILLIS_HOUR + 10 * MILLIS_MINUTE, 'Parses HH:MM');
      t.isStrict(DayTime.parse('10'), 10 * MILLIS_HOUR, 'Parses H alone');
      t.isStrict(DayTime.parse(':10'), 10 * MILLIS_MINUTE, 'Parses :M alone');
      t.isStrict(DayTime.parse(new Date(2021, 4, 20, 7)), 7 * MILLIS_HOUR, 'Extracts time of day from Date');
      t.isStrict(DayTime.parse(7 * MILLIS_HOUR), 7 * MILLIS_HOUR, 'Large numbers are parsed as milliseconds');

      for (let i = 0; i <= 24; ++i) {
        t.isStrict(DayTime.parse(i), i * MILLIS_HOUR, 'Small numbers are treated as hours');
      }
    });
  });
  t.describe('Standard Day', t => {
    const dt = new DayTime();
    t.it('dateKey', t => {
      t.is(dt.dateKey(makeDate('0:00')), '2020-02-10');
      t.is(dt.dateKey(makeDate('9:00')), '2020-02-10');
      t.is(dt.dateKey(makeDate('23:59:59')), '2020-02-10');
      t.is(dt.dateKey(makeDate('0:00', 1)), '2020-02-11');
    });
    t.it('isIntraDay', t => {
      t.ok(dt.isIntraDay(makeDate('9:00'), makeDate('10:00')), 'Small time range');
      t.ok(dt.isIntraDay(makeDate('9:00'), makeDate('23:00')), 'Most of the day');
      t.ok(dt.isIntraDay(makeDate('6:00'), makeDate('0:00', 1)), 'Ends at midnight');
      t.ok(dt.isIntraDay(makeEvent(makeDate('9:00'), makeDate('10:00'))), 'Small time range');
      t.ok(dt.isIntraDay(makeEvent(makeDate('9:00'), makeDate('23:00'))), 'Most of the day');
      t.ok(dt.isIntraDay(makeEvent(makeDate('6:00'), makeDate('0:00', 1))), 'Ends at midnight');
      t.notOk(dt.isIntraDay(makeDate('0:00'), makeDate('0:00', 1)), 'Whole day');
      t.notOk(dt.isIntraDay(makeDate('6:00'), makeDate('0:00:01', 1)), 'Wraps after midnight');
      t.notOk(dt.isIntraDay(makeEvent(makeDate('0:00'), makeDate('0:00', 1))), 'Whole day');
      t.notOk(dt.isIntraDay(makeEvent(makeDate('6:00'), makeDate('0:00:01', 1))), 'Wraps after midnight');
    });
  });
  t.describe('Simple Shifted Day', t => {
    const dt = new DayTime({
      startShift: 8 // 8 am

    });
    t.it('dateKey', t => {
      t.is(dt.dateKey(makeDate('7:00')), '2020-02-09');
      t.is(dt.dateKey(makeDate('8:00')), '2020-02-10');
      t.is(dt.dateKey(makeDate('9:00')), '2020-02-10');
      t.is(dt.dateKey(makeDate('7:59:59', 1)), '2020-02-10');
      t.is(dt.dateKey(makeDate('8:00', 1)), '2020-02-11');
    });
    t.it('isIntraDay', t => {
      t.ok(dt.isIntraDay(makeDate('9:00'), makeDate('10:00')), 'Small time range');
      t.ok(dt.isIntraDay(makeDate('9:00'), makeDate('23:00')), 'Most of the day');
      t.ok(dt.isIntraDay(makeDate('16:00'), makeDate('8:00', 1)), 'Ends at EOD');
      t.ok(dt.isIntraDay(makeEvent(makeDate('9:00'), makeDate('10:00'))), 'Small time range');
      t.ok(dt.isIntraDay(makeEvent(makeDate('9:00'), makeDate('23:00'))), 'Most of the day');
      t.ok(dt.isIntraDay(makeEvent(makeDate('16:00'), makeDate('8:00', 1))), 'Ends at EOD');
      t.notOk(dt.isIntraDay(makeDate('8:00'), makeDate('8:00', 1)), 'Whole day');
      t.notOk(dt.isIntraDay(makeEvent(makeDate('8:00'), makeDate('8:00', 1))), 'Whole day');
      t.notOk(dt.isIntraDay(makeDate('6:00'), makeDate('20:00')), 'Wraps if before start shift');
      t.notOk(dt.isIntraDay(makeDate('8:00'), makeDate('8:00:01', 1)), 'Wraps at 24 hrs after start shift');
      t.notOk(dt.isIntraDay(makeEvent(makeDate('6:00'), makeDate('20:00'))), 'Wraps if before start shift');
      t.notOk(dt.isIntraDay(makeEvent(makeDate('8:00'), makeDate('8:00:01', 1))), 'Wraps at 24 hrs after start shift');
    });
  });
  t.describe('Day Spanning Midnight', t => {
    const dt = new DayTime({
      startShift: 18,
      // 6 pm
      timeStart: 2,
      timeEnd: 14
    });
    t.it('construction', t => {
      const d = new DayTime({
        startShift: 18
      });
      t.is(d.timeStart, 18 * MILLIS_HOUR, 'Correct default timeStart');
      t.is(d.timeEnd, 18 * MILLIS_HOUR, 'Correct default timeEnd');
    });
    t.it('dateKey', t => {
      t.is(dt.dateKey(makeDate('17:59')), '2020-02-09');
      t.is(dt.dateKey(makeDate('18:00')), '2020-02-10');
      t.is(dt.dateKey(makeDate('19:00')), '2020-02-10');
      t.is(dt.dateKey(makeDate('17:59:59', 1)), '2020-02-10');
      t.is(dt.dateKey(makeDate('18:00', 1)), '2020-02-11');
    });
    t.it('duration', t => {
      t.is(dt.duration(), 12 * MILLIS_HOUR, 'Correct duration');
      t.is(dt.duration('h'), 12, 'Correct duration (hrs)');
    });
    t.it('isIntraDay', t => {
      t.ok(dt.isIntraDay(makeDate('19:00'), makeDate('20:00')), 'Small time range');
      t.ok(dt.isIntraDay(makeDate('19:00'), makeDate('01:00')), 'Spanning midnight');
      t.ok(dt.isIntraDay(makeDate('19:00'), makeDate('18:00', 1)), 'Ends at EOD');
      t.ok(dt.isIntraDay(makeEvent(makeDate('19:00'), makeDate('20:00'))), 'Small time range');
      t.ok(dt.isIntraDay(makeEvent(makeDate('19:00'), makeDate('01:00'))), 'Spanning midnight');
      t.ok(dt.isIntraDay(makeEvent(makeDate('19:00'), makeDate('18:00', 1))), 'Ends at EOD');
      t.notOk(dt.isIntraDay(makeDate('18:00'), makeDate('18:00', 1)), 'Whole day');
      t.notOk(dt.isIntraDay(makeEvent(makeDate('18:00'), makeDate('18:00', 1))), 'Whole day');
      t.notOk(dt.isIntraDay(makeDate('17:59:59'), makeDate('18:00', 1)), 'Whole day plus one sec of prior day');
      t.notOk(dt.isIntraDay(makeDate('17:00'), makeDate('20:00')), 'Wraps if before start shift');
      t.notOk(dt.isIntraDay(makeDate('18:00'), makeDate('18:00:01', 1)), 'Wraps at 24 hrs after start shift');
      t.notOk(dt.isIntraDay(makeEvent(makeDate('17:59:59'), makeDate('18:00', 1))), 'Whole day plus one sec of prior day');
      t.notOk(dt.isIntraDay(makeEvent(makeDate('17:00'), makeDate('20:00'))), 'Wraps if before start shift');
      t.notOk(dt.isIntraDay(makeEvent(makeDate('18:00'), makeDate('18:00:01', 1))), 'Wraps at 24 hrs after start shift');
    });
    t.it('startOfDay', t => {
      const today = makeDate('18:00');
      const tomorrow = makeDate('18:00', 1);
      const yesterday = makeDate('18:00', -1);
      t.is(dt.startOfDay(makeDate('17:59')), yesterday);
      t.is(dt.startOfDay(makeDate('18:00')), today);
      t.is(dt.startOfDay(makeDate('19:00')), today);
      t.is(dt.startOfDay(makeDate('17:59:59', 1)), today);
      t.is(dt.startOfDay(makeDate('18:00', 1)), tomorrow);
    });
    t.it('startTimeOffsetMs', t => {
      t.is(dt.startTimeOffsetMs, (2 + 24 - 18) * MILLIS_HOUR, 'Correct startTimeOffsetMs');
    });
    t.it('times', t => {
      t.is(dt.timeStart, 2 * MILLIS_HOUR, 'Correct timeStart');
      t.is(dt.timeEnd, 14 * MILLIS_HOUR, 'Correct timeEnd');
    });
  });
});