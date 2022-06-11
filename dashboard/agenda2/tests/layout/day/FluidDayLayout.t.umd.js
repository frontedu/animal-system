"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

StartTest(t => {
  console.clear(); // A 20hr range to keep top/bottom decimals from exploding (due to divisions by 3)

  const dayStartHr = 1,
        dayEndHr = 21,
        calcY = t => ((+t.split(':')[0] - dayStartHr) * 60 + +t.split(':')[1]) * 5 / 60,
        percentify = v => v == null ? '' : typeof v === 'string' && isNaN(Number(v)) ? v : `${v}%`;

  let eventId = 0,
      dayTime,
      events,
      innerEl,
      items,
      layout,
      outerEl;
  t.beforeEach(t => {
    events = items = null;
    eventId = 0;

    if (outerEl) {
      while (outerEl.childNodes.length) {
        outerEl.childNodes[0].remove();
      }
    } else {
      outerEl = document.createElement('div');
      outerEl.style.width = '1000px';
      outerEl.style.height = '750px';
      outerEl.style.position = 'absolute';
      outerEl.style.backgroundColor = 'silver';
      document.body.appendChild(outerEl);
    }
  });

  function calculateClusters(testData) {
    const clusters = [];

    for (const item of testData) {
      const cluster = item.c || 0;

      if (!clusters[cluster]) {
        clusters[cluster] = [item.s, item.e, 1];
      } else {
        if (tod(clusters[cluster][1]) < tod(item.e)) {
          clusters[cluster][1] = item.e;
        }

        ++clusters[cluster][2];
      }
    }

    return clusters;
  }

  function checkClusters(t, expectedClusters) {
    const clusters = [];
    let itemNum = 0,
        clusterNum = 0,
        maxEnd = 0,
        // not really used, but datflow analyzer warns w/o this...
    cluster,
        clusterItem,
        clusterItemIndex,
        clusterSize,
        end,
        item,
        start;

    for (item of items) {
      if (!clusters.includes(item.cluster)) {
        clusters.push(item.cluster);
      }
    }

    for (cluster of expectedClusters) {
      start = tod(cluster[0]);
      end = tod(cluster[1]);
      clusterSize = cluster[2] || items.length;
      cluster = clusters[clusterNum];

      for (clusterItemIndex = 0; clusterItemIndex < clusterSize; ++clusterItemIndex) {
        clusterItem = cluster.items[clusterItemIndex];
        item = items[itemNum];

        if (!item) {
          throw new Error(`Cluster expectation has too many items`);
        }

        t.isStrict(clusters.indexOf(item.cluster), clusterNum, `item ${itemNum} should be in cluster ${clusterNum}`);
        t.isStrict(clusterItem, item, `cluster${clusterNum}.items[${clusterItemIndex}] should be item ${itemNum}`);

        if (clusterItemIndex) {
          maxEnd = Math.max(maxEnd, item.end);
        } else {
          t.isStrict(start, item.start, `cluster${clusterNum}.start should equal that of its first item`);
          maxEnd = item.end;
        }

        ++itemNum;
      } // noinspection JSUnusedAssignment


      t.isStrict(end, maxEnd, `cluster${clusterNum}.end should equal the max end time of its items`);
      ++clusterNum;
    }

    t.isStrict(itemNum, items.length, 'All items accounted for');
  }

  function checkLayout(t, index, positions) {
    const pick = val => Array.isArray(val) ? val[index < val.length ? index : 0] : val;

    let i = 0,
        eventRec,
        item,
        pos,
        rect;

    for (item of items) {
      eventRec = events[i];
      pos = positions[i];
      pos.start = pos.s;
      pos.end = pos.e;

      if (!('top' in pos)) {
        pos.top = calcY(pos.start);
      }

      if (!('bottom' in pos)) {
        pos.bottom = calcY(pos.end);
      }

      innerEl = getEl(eventRec);
      Object.assign(innerEl.style, {
        top: percentify(item.top),
        left: percentify(item.left),
        width: percentify(item.width),
        height: percentify(item.height),
        minWidth: percentify(item.minWidth)
      });
      ++i;
    }

    i = 0;

    for (item of items) {
      eventRec = events[i];
      pos = positions[i];
      innerEl = outerEl.childNodes[i];
      rect = innerEl.getBoundingClientRect();
      const start = pick(pos.start),
            end = pick(pos.end),
            top = pick(pos.top),
            bottom = pick(pos.bottom),
            left = pick(pos.left),
            width = pick(pos.width),
            right = pick(pos.right);
      t.isStrict(item.eventRecord, eventRec, `item ${i} should wrap event ${i}`);
      t.isStrict(item.start, tod(start), `Correct item${i}.start`);
      t.isStrict(item.end, tod(end), `Correct item${i}.end`);
      t.isApprox(item.top, top, 0.5, `Correct item${i}.top`);
      t.isApprox(item.bottom, bottom, 0.5, `Correct item${i}.bottom`);
      t.isApprox(item.height, bottom - top, 0.5, `Correct item${i}.height`);

      if (left != null) {
        t.isApprox(rect.left, left, 1, `Correct item${i}.left`);
      }

      if (width != null) {
        t.isApprox(rect.width, width, 1, `Correct item${i}.width`);
      } else if (right != null) {
        t.isApprox(rect.right, right, 1, `Correct item${i}.right`);
      }

      ++i;
    }
  }

  function doLayout(evs, layoutConfig) {
    dayTime = new DayTime({
      timeStart: dayStartHr,
      timeEnd: dayEndHr
    });
    events = evs;
    layout = new FluidDayLayout(layoutConfig || {});
    const sorted = events.slice();
    sorted.sort(EventSorter.defaultSorterFn);

    for (let i = 0; i < events.length; ++i) {
      if (sorted[i] !== events[i]) {
        throw new Error(`Event ${i} is not in sorted order`);
      }
    }

    items = layout.layoutEvents({
      events,
      dayTime,
      // Simulate a DayCell date which is the date which encapsulates the event(s)
      date: new Date(DateHelper.clearTime(events[0].startDate).getTime() + dayTime.startShift)
    });
  }

  function event(startTime, endTime, name) {
    ++eventId;
    return new EventModel({
      id: eventId,
      startDate: fixTime(startTime),
      endDate: fixTime(endTime),
      name: name || `Event ${eventId}`
    });
  }

  function fixTime(t) {
    const parts = t.split('T');
    const time = parts.pop().split(':');

    if (time.length === 2) {
      time.push('00');
    }

    if (time[0].length === 1) {
      time[0] = '0' + time[0];
    }

    return `${parts[0] || '2020-03-10'}T${time.join(':')}`;
  }

  function getEl(eventRecord) {
    innerEl = document.createElement('div');
    innerEl.style.position = 'absolute';
    const n = outerEl.childNodes.length;
    const rgb = [((n * 7 + 3) % 16).toString(16), ((n * 37 + 11) % 16).toString(16), ((n * 71 + 31) % 16).toString(16)];
    innerEl.style.backgroundColor = '#' + rgb.join('');
    innerEl.dataset['eventId'] = eventRecord.id;
    innerEl.textContent = String(eventRecord.id - 1);
    outerEl.appendChild(innerEl);
    return innerEl;
  }

  function tod(t) {
    const [h, m, s] = t.split(':').map(v => Number(v));
    return (h - dayStartHr) * 3600 + m * 60 + (s || 0);
  }

  function testLayout(t, index, testData, layoutConfig) {
    if (typeof index !== 'number') {
      layoutConfig = testData;
      testData = index;
      index = null;
    }

    const eventRecords = testData.map(it => event(it.s, it.e));
    const expectedClusters = calculateClusters(testData);
    doLayout(eventRecords, layoutConfig);
    checkClusters(t, expectedClusters);
    checkLayout(t, index, testData);
  }

  t.describe('Simple', t => {
    t.it('should layout single item', t => {
      testLayout(t, [{
        s: '3:00',
        e: '6:00',
        top: 10,
        bottom: 25
      }]);
    });
    t.it('should layout items without clusters', t => {
      testLayout(t, [// c is the cluster number (it defaults to 0)
      {
        c: 0,
        s: '3:00',
        e: '6:00',
        top: 10,
        bottom: 25
      }, {
        c: 1,
        s: '6:00',
        e: '7:00',
        top: 25,
        bottom: 30
      }, {
        c: 2,
        s: '8:00',
        e: '10:00',
        top: 35,
        bottom: 45
      }]);
    });
    t.it('should layout with clusters', t => {
      testLayout(t, [{
        s: '3:00',
        e: '6:00',
        top: 10,
        bottom: 25
      }, {
        s: '4:00',
        e: '8:00',
        top: 15,
        bottom: 35
      }, {
        s: '6:00',
        e: '7:00',
        top: 25,
        bottom: 30
      }]);
    });
  });
  t.describe('Overlapping', t => {
    const suite = (t, index, layoutConfig) => {
      t.it(`should handle single minor overlap`, t => {
        testLayout(t, index, [{
          s: '9:00',
          e: '12:00',
          top: 40,
          bottom: 55,
          left: 0,
          right: 990
        }, {
          s: '10:00',
          e: '13:00',
          top: 45,
          bottom: 60,
          left: 10,
          right: 995
        }], layoutConfig);
      });
      t.it(`should handle single major overlap`, t => {
        testLayout(t, index, [{
          s: '9:00',
          e: '12:00',
          top: 40,
          bottom: 55,
          left: 0,
          right: [500, 990]
        }, {
          s: '9:30',
          e: '13:00',
          top: 42.5,
          bottom: 60,
          left: 500,
          right: 995
        }], layoutConfig);
      });
      t.it(`should handle multiple, simultaneous major overlapping events`, t => {
        testLayout(t, index, [{
          s: '9:00',
          e: '14:00',
          top: 40,
          bottom: 65,
          left: 0,
          right: [333, 985]
        }, {
          s: '9:00',
          e: '13:00',
          top: 40,
          bottom: 60,
          left: 333,
          right: [667, 990]
        }, {
          s: '9:00',
          e: '12:00',
          top: 40,
          bottom: 55,
          left: 667,
          right: [995, 995]
        }], layoutConfig);
      });
      t.it(`should handle multiple minor overlapping events`, t => {
        testLayout(t, index, [{
          s: '9:00',
          e: '13:00',
          top: 40,
          bottom: 60,
          left: 0,
          right: 980
        }, {
          s: '10:00',
          e: '14:00',
          top: 45,
          bottom: 65,
          left: 10,
          right: 985
        }, {
          s: '11:00',
          e: '15:00',
          top: 50,
          bottom: 70,
          left: 20,
          right: 990
        }, {
          s: '12:00',
          e: '14:00',
          top: 55,
          bottom: 65,
          left: 30,
          right: 995
        }], layoutConfig);
      });
      t.it(`should handle multiple major overlapping events`, t => {
        testLayout(t, index, [{
          s: '9:00',
          e: '14:00',
          top: 40,
          bottom: 65,
          left: 0,
          right: [250, 980]
        }, {
          s: '9:00',
          e: '13:00',
          top: 40,
          bottom: 60,
          left: 250,
          right: [500, 985]
        }, {
          s: '9:30',
          e: '15:00',
          top: 42.5,
          bottom: 70,
          left: 500,
          right: [750, 990]
        }, {
          s: '9:30',
          e: '14:00',
          top: 42.5,
          bottom: 65,
          left: 750,
          right: [995, 995]
        }], layoutConfig);
      });
      t.it(`should minimize overlap of sibling items`, t => {
        /*
         *      +----------------+
         *      |                |
         *      |    +------------------+   (minor overlap)
         *      |    |                  |
         *      |    +------------------+
         *      |                |
         *      |    +------------------+   (minor overlap)
         *      |    |                  |
         *      |    +------------------+
         *      |                |
         *      +----------------+
         */
        testLayout(t, index, [{
          s: '9:00',
          e: '14:00',
          top: 40,
          bottom: 65,
          left: [0, 0, 0],
          right: 990
        }, {
          s: '10:00',
          e: '11:00',
          top: 45,
          bottom: 50,
          left: [10, 10, 10],
          right: 995
        }, // minor
        {
          s: '12:00',
          e: '13:00',
          top: 55,
          bottom: 60,
          left: [10, 10, 10],
          right: 995
        } // minor
        ], layoutConfig);
      });
      t.it(`should handle cascade of minor overlapping events when first root event is cleared`, t => {
        testLayout(t, index, [{
          s: '9:00',
          e: '13:00',
          top: 40,
          bottom: 60,
          left: 0,
          right: 985
        }, {
          s: '12:00',
          e: '14:00',
          top: 55,
          bottom: 65,
          left: 10,
          right: 990
        }, {
          s: '13:00',
          e: '15:00',
          top: 60,
          bottom: 70,
          left: 20,
          right: 995
        }], layoutConfig);
      });
      t.it(`should escalate items to the root following major/minor overlap`, t => {
        /*
         *      +----------------+
         *      |0               |
         *      |                |  +---------------+       (major)
         *      |                |  |1              |
         *      |                |  |               |
         *      |  +---------------+|               |       (minor)
         *      +--|2              ||               |
         *         |               ||               |
         *         |               ||  +---------------+    (minor)
         *         |               ||  |3              |
         *         |               |+--|               |
         *         |               |   |               |
         *         +---------------+   |               |
         *                             +---------------+
         */
        testLayout(t, index, [{
          s: '9:30',
          e: '12:00',
          top: 42.5,
          bottom: 55,
          left: 0,
          right: [495, 980]
        }, // 0
        {
          s: '10:00',
          e: '15:00',
          top: 45,
          bottom: 70,
          left: 500,
          right: [990, 990]
        }, // 1
        {
          s: '11:00',
          e: '17:00',
          top: 50,
          bottom: 80,
          left: 10,
          right: [500, 985]
        }, // 2
        {
          s: '13:00',
          e: '16:00',
          top: 60,
          bottom: 75,
          left: 510,
          right: [995, 995]
        } // 3
        ], layoutConfig);
      });
      t.it(`should escalate item to a child of the root following minor/major overlap`, t => {
        /*
         *      +--------------------+
         *      |0                   |
         *      |                    |
         *      |   +----------------------+   (minor overlap)
         *      |   |1                     |
         *      |   |        +------------------+   (major overlap)
         *      |   |        |2                 |
         *      |   +--------|                  |
         *      |            |                  |
         *      |   +----------------------+    |   (minor overlap)
         *      |   |3                     |    |
         *      |   |                      |    |
         *      +---|                      |    |
         *          |                      |----+
         *          +----------------------+
         */
        testLayout(t, index, [{
          s: '9:00',
          e: '15:00',
          top: 40,
          bottom: 70,
          left: 0,
          right: [495, 985]
        }, // 0
        {
          s: '10:00',
          e: '12:00',
          top: 45,
          bottom: 55,
          left: 10,
          right: [500, 990]
        }, // 1 (minor)
        {
          s: '10:30',
          e: '14:00',
          top: 47.5,
          bottom: 65,
          left: 500,
          right: [995, 995]
        }, // 2 (major)
        {
          s: '13:00',
          e: '16:00',
          top: 60,
          bottom: 75,
          left: 10,
          right: [500, 990]
        } // 3 (minor)
        ], layoutConfig);
      });
      t.it(`should escalate item to a child of the root following minor/major/minor overlap`, t => {
        /*
         *      +--------------------+
         *      |0                   |
         *      |                    |
         *      |   +----------------------+   (minor overlap)
         *      |   |1                     |
         *      |   |        +------------------+   (major overlap)
         *      |   |        |2                 |
         *      |   |        |   +-------------------+  (minor)
         *      |   |        +---|3                  |
         *      |   +------------|                   |
         *      |                |                   |
         *      |   +----------------------+         |   (minor overlap)
         *      |   |4                     |         |
         *      |   |                      |         |
         *      +---|                      |         |
         *          |                      |---------+
         *          +----------------------+
         */
        testLayout(t, index, [{
          s: '9:00',
          e: '15:00',
          top: 40,
          bottom: 70,
          left: 0,
          right: [495, 980]
        }, // 0
        {
          s: '10:00',
          e: '14:00',
          top: 45,
          bottom: 65,
          left: 10,
          right: [500, 985]
        }, // 1 (minor)
        {
          s: '10:30',
          e: '13:00',
          top: 47.5,
          bottom: 60,
          left: 500,
          right: [990, 990]
        }, // 2 (major)
        {
          s: '12:00',
          e: '15:00',
          top: 55,
          bottom: 70,
          left: 510,
          right: [995, 995]
        }, // 3 (minor)
        {
          s: '14:30',
          e: '16:00',
          top: 67.5,
          bottom: 75,
          left: 10,
          right: [500, 985]
        } // 4 (minor)
        ], layoutConfig);
      });
      t.it(`should escalate item to the root following minor/major overlap`, t => {
        /*
         *      +--------------------+
         *      |0                   |
         *      |                    |
         *      |   +----------------------+   (minor overlap)
         *      |   |1                     |
         *      |   |        +------------------+   (major overlap)
         *      |   |        |2                 |
         *      |   +--------|                  |
         *      +------------|                  |
         *      +--------------------+          |
         *      |3                   |          |
         *      |                    |          |
         *      |                    |          |
         *      |                    |----------+
         *      +--------------------+
         */
        testLayout(t, index, [{
          s: '9:00',
          e: '12:00',
          top: 40,
          bottom: 55,
          left: 0,
          right: [495, 985]
        }, // 0
        {
          s: '10:00',
          e: '11:00',
          top: 45,
          bottom: 50,
          left: 10,
          right: [500, 990]
        }, // 1 (minor)
        {
          s: '10:30',
          e: '13:00',
          top: 47.5,
          bottom: 60,
          left: 500,
          right: [995, 995]
        }, // 2 (major)
        {
          s: '12:00',
          e: '14:00',
          top: 55,
          bottom: 65,
          left: 0,
          right: [500, 990]
        } // 3
        ], layoutConfig);
      });
      t.it(`should escalate item to the root following minor/major/minor overlap`, t => {
        /*
         *      +--------------------+
         *      |0                   |
         *      |                    |
         *      |   +----------------------+   (minor overlap)
         *      |   |1                     |
         *      |   |        +------------------+   (major overlap)
         *      |   |        |2                 |
         *      |   |        |   +-------------------+  (minor)
         *      |   |        +---|3                  |
         *      |   +------------|                   |
         *      +----------------|                   |
         *      +--------------------------+         |   (minor overlap)
         *      |4                         |         |
         *      |                          |         |
         *      |                          |         |
         *      |                          |---------+
         *      +--------------------------+
         */
        testLayout(t, index, [{
          s: '9:00',
          e: '15:00',
          top: 40,
          bottom: 70,
          left: 0,
          right: [495, 980]
        }, // 0
        {
          s: '10:00',
          e: '14:00',
          top: 45,
          bottom: 65,
          left: 10,
          right: [500, 985]
        }, // 1 (minor)
        {
          s: '10:30',
          e: '13:00',
          top: 47.5,
          bottom: 60,
          left: 500,
          right: [990, 990]
        }, // 2 (major)
        {
          s: '12:00',
          e: '16:00',
          top: 55,
          bottom: 75,
          left: 510,
          right: [995, 995]
        }, // 3 (minor)
        {
          s: '15:00',
          e: '17:00',
          top: 70,
          bottom: 80,
          left: 0,
          right: [500, 985]
        } // 4 (minor)
        ], layoutConfig);
      });
      t.it(`should escalate item to child of root following minor/major/minor/minor overlap`, t => {
        /*
         *      +--------------------+
         *      |0                   |
         *      |                    |
         *      |   +----------------------+   (minor overlap)
         *      |   |1                     |
         *      |   |        +------------------+   (major overlap)
         *      |   |        |2                 |
         *      |   |        |   +-------------------+  (minor)
         *      |   |        +---|3                  |
         *      |   +------------|                   |
         *      |   +----------------------+         |   (minor overlap)
         *      |   |4                     |         |
         *      +---|   +-----------------------+    |   (minor overlap)
         *          |   |5                      |    |
         *          |   |                       |----+
         *          +---|                       |
         *              +-----------------------+
         */
        testLayout(t, index, [{
          s: '9:00',
          e: '15:00',
          top: 40,
          bottom: 70,
          left: 0,
          right: [490, 975]
        }, // 0
        {
          s: '10:00',
          e: '14:00',
          top: 45,
          bottom: 65,
          left: 10,
          right: [500, 985]
        }, // 1 (minor)
        {
          s: '10:30',
          e: '13:00',
          top: 47.5,
          bottom: 60,
          left: 500,
          right: [990, 990]
        }, // 2 (major)
        {
          s: '12:00',
          e: '16:00',
          top: 55,
          bottom: 75,
          left: 510,
          right: [995, 995]
        }, // 3 (minor)
        {
          s: '14:15',
          e: '16:30',
          top: 66.25,
          bottom: 77.5,
          left: 10,
          right: [495, 980]
        }, // 4 (minor)
        {
          s: '15:00',
          e: '17:00',
          top: 70,
          bottom: 80,
          left: 20,
          right: [500, 985]
        } // 5 (minor)
        ], layoutConfig);
      });
      t.it(`should handle simultaneous event after escalating item multiple levels to be child of root`, t => {
        /*
         *      +--------------------+
         *      |0                   |
         *      |                    |
         *      |   +----------------------+   (minor overlap)
         *      |   |1                     |
         *      |   |   +-----------------------+   (minor overlap)
         *      |   |   |2                      |
         *      |   +---|                       |
         *      |       |                       |
         *      |   +-------------+-------------+   (minor overlap then simultaneous/major overlap)
         *      |   |3            |4            |
         *      |   |             |             |
         *      +---|             |             |
         *          |             |             |
         *          |             +-------------+
         *          |                      |
         *          +----------------------+
         */
        testLayout(t, index, [{
          s: '9:00',
          e: '15:00',
          top: 40,
          bottom: 70,
          left: 0,
          right: [485, 975, 490]
        }, // 0
        {
          s: '10:00',
          e: '12:00',
          top: 45,
          bottom: 55,
          left: 10,
          right: [490, 980, 495]
        }, // 1
        {
          s: '11:00',
          e: '14:00',
          top: 50,
          bottom: 65,
          left: 20,
          right: [495, 985, 500]
        }, // 2
        {
          s: '13:00',
          e: '17:00',
          top: 60,
          bottom: 80,
          left: [30, 30, 10],
          right: [500, 990, 495]
        }, // 3
        {
          s: '13:00',
          e: '16:00',
          top: 60,
          bottom: 75,
          left: 500,
          right: [995, 995]
        } // 4
        ], layoutConfig);
      });
      t.it(`should handle multiple simultaneous events after escalating item multiple levels to be child of root`, t => {
        /*
         *      +--------------------+
         *      |0                   |
         *      |                    |
         *      |   +----------------------+   (minor overlap)
         *      |   |1                     |
         *      |   |   +---------------------+     (minor overlap)
         *      |   |   |2                    |
         *      |   +---|                     |
         *      |       |                     |
         *      |   +----------+-------+--------+   (minor overlap then simultaneous 2 major overlaps)
         *      |   |3         |4      |5       |
         *      |   |          |       |        |
         *      +---|          |       |        |
         *          |          |       +--------+
         *          |          +--------------+
         *          |                       |
         *          +-----------------------+
         */
        testLayout(t, index, [{
          s: '9:00',
          e: '15:00',
          top: 40,
          bottom: 70,
          left: 0,
          right: [318, 970, 323]
        }, // 0
        {
          s: '10:00',
          e: '12:00',
          top: 45,
          bottom: 55,
          left: 10,
          right: [323, 975, 328]
        }, // 1
        {
          s: '11:00',
          e: '14:00',
          top: 50,
          bottom: 65,
          left: 20,
          right: [328, 980, 333]
        }, // 2
        {
          s: '13:00',
          e: '17:00',
          top: 60,
          bottom: 80,
          left: [30, 30, 10],
          right: [333, 985, 328]
        }, // 3
        {
          s: '13:00',
          e: '16:00',
          top: 60,
          bottom: 75,
          left: 333,
          right: [667, 990]
        }, // 4
        {
          s: '13:00',
          e: '15:30',
          top: 60,
          bottom: 72.5,
          left: 667,
          right: [995, 995]
        } // 5
        ], layoutConfig);
      });
      t.it(`should handle simultaneous events after minor overlap of item multiply escalated to child of root`, t => {
        /*
         *      +--------------------+
         *      |0                   |
         *      |                    |
         *      |   +----------------------+   (minor overlap)
         *      |   |1                     |
         *      |   |   +-----------------------+   (minor overlap)
         *      |   |   |2                      |
         *      |   +---|                       |
         *      |       |                       |
         *      |   +-----------------------+   |   (minor overlap -> escalate to child of root)
         *      |   |3                      |---+
         *      |   |   +------------+--------------+   (minor overlap then simultaneous/major overlap)
         *      |   |   |4           |5             |
         *      +---|   |            |              |
         *          |   |            |              |
         *          +---|            |              |
         *              |            |              |
         *              |            +--------------+
         *              |                       |
         *              +-----------------------+
         */
        testLayout(t, index, [{
          s: '9:00',
          e: '15:00',
          top: 40,
          bottom: 70,
          left: 0,
          right: [480, 970, 490]
        }, // 0
        {
          s: '10:00',
          e: '12:00',
          top: 45,
          bottom: 55,
          left: 10,
          right: [485, 975, 495]
        }, // 1
        {
          s: '11:00',
          e: '14:00',
          top: 50,
          bottom: 65,
          left: 20,
          right: [490, 980, 500]
        }, // 2
        {
          s: '13:00',
          e: '16:00',
          top: 60,
          bottom: 75,
          left: [30, 30, 10],
          right: [495, 985]
        }, // 3
        {
          s: '14:00',
          e: '18:00',
          top: 65,
          bottom: 85,
          left: [40, 40, 20],
          right: [500, 990]
        }, // 4
        {
          s: '14:00',
          e: '17:00',
          top: 65,
          bottom: 80,
          left: 500,
          right: [995, 995]
        } // 5
        ], layoutConfig);
      });
      t.it(`should detect cousin events in overlapping columns and indent accordingly`, t => {
        /*
         *      +-----------------+  +----------------------+
         *      |0                |  |1                     |+----------------------+
         *      |                 |  +----------------------+|2                     |
         *      |                 |                          |                      |
         *      |                 |  +----------------------+|                      |
         *      | +-----------------+|3                     ||  +-------------------------+
         *      | |4                ||                      ||  |5                        |
         *      | +-----------------++----------------------+|  +-------------------------+
         *      |                 |                          |                      |
         *      |                 |  +----------------------+|                      |
         *      | +-----------------+|6                     ||  +-------------------------+
         *      | |7                ||                      ||  |8                        |
         *      | +-----------------++----------------------+|  |                         |
         *      |                 |                          |  |                         |
         *      | +-----------------++----------------------+|  +-----------------------+ |
         *      | |10                ||9                    ||  |11                     |-+
         *      | +-----------------++----------------------+|  |                       |
         *      |                 |                          |  |                       |
         *      | +-----------------++----------------------+|  +-----------------------+
         *      | |13               ||12                    ||  |14                   |
         *      | +-----------------++----------------------+|  +---------------------+
         *      |                 |                          |                      |
         *      |                 |                          +----------------------+
         *      +-----------------+
         */
        testLayout(t, index, [{
          s: '9:00',
          e: '20:00',
          left: 0,
          right: [328, 965]
        }, // 0
        {
          s: '9:10',
          e: '10:00',
          left: 333,
          right: [667, 975]
        }, // 1
        {
          s: '9:20',
          e: '19:00',
          left: 667,
          right: [980, 980]
        }, // 2
        {
          s: '11:00',
          e: '12:00',
          left: 333,
          right: [667, 975]
        }, // 3
        {
          s: '11:10',
          e: '12:00',
          left: 10,
          right: [333, 970]
        }, // 4
        {
          s: '11:20',
          e: '12:00',
          left: 677,
          right: [995, 995]
        }, // 5
        {
          s: '13:00',
          e: '14:00',
          left: 333,
          right: [667, 975]
        }, // 6
        {
          s: '13:10',
          e: '14:00',
          left: 10,
          right: [333, 970]
        }, // 7
        {
          s: '13:15',
          e: '16:00',
          left: 677,
          right: [985, 985, 995]
        }, // 8
        {
          s: '15:00',
          e: '16:00',
          left: 333,
          right: [667, 975]
        }, // 9
        {
          s: '15:00',
          e: '16:00',
          left: 10,
          right: [333, 970]
        }, // 10
        {
          s: '15:15',
          e: '17:30',
          left: [687, 687, 677],
          right: [990, 990]
        }, // 11
        {
          s: '17:00',
          e: '18:00',
          left: 333,
          right: [667, 975]
        }, // 12
        {
          s: '17:00',
          e: '18:00',
          left: 10,
          right: [333, 970]
        }, // 13
        {
          s: '17:00',
          e: '18:00',
          left: [697, 697, 677],
          right: [995, 995, 985]
        } // 14
        ], layoutConfig);
      });
      t.it(`should use multiple levels of exposed columns in decreasing order`, t => {
        /*              0               1                   2               3               4
         *      +---------------++---------------++---------------++---------------+
         *      |0              ||1              ||2              ||3              |+---------------+
         *      |               |+---------------++---------------++---------------+|4              |
         *      |               |+-------------------------++----------------------+|               |
         *      |               ||5                        ||6                     ||               |
         *      |               |+-------------------------++----------------------+|               |
         *      |               |+-------------------------------------------------+|               |
         *      |               ||7                                                ||               |
         *      |               ||                                                 ||               |
         *      |               ||                                                 ||               |
         *      +---------------+|                                                 |+---------------+
         *                       +-------------------------------------------------+
         */
        testLayout(t, index, [{
          s: '9:00',
          e: '15:00',
          top: 40,
          bottom: 70,
          left: 0,
          right: [200, 975]
        }, // 0
        {
          s: '9:00',
          e: '10:00',
          top: 40,
          bottom: 45,
          left: 200,
          right: [400, 980]
        }, // 1
        {
          s: '9:00',
          e: '10:00',
          top: 40,
          bottom: 45,
          left: 400,
          right: [600, 985]
        }, // 2
        {
          s: '9:00',
          e: '10:00',
          top: 40,
          bottom: 45,
          left: 600,
          right: [800, 990]
        }, // 3
        {
          s: '9:15',
          e: '15:00',
          top: 41.25,
          bottom: 70,
          left: 800,
          right: [995, 995]
        }, // 4
        // Now the special cases:
        {
          s: '10:00',
          e: '11:00',
          top: 45,
          bottom: 50,
          left: 200,
          right: [500, 985]
        }, // 5
        {
          s: '10:00',
          e: '11:00',
          top: 45,
          bottom: 50,
          left: 500,
          right: [800, 990]
        }, // 6
        {
          s: '11:00',
          e: '17:00',
          top: 50,
          bottom: 80,
          left: 200,
          right: [800, 990]
        } // 7
        ], _objectSpread({
          clearanceMinutes: 600
        }, layoutConfig));
      });
      t.it(`should use multiple levels of exposed columns in increasing order`, t => {
        /*
         *      +---------------++-----------------+
         *      |0              ||1                |+--------------+
         *      |               |+----------------+|2              |
         *      |               |+----------------+|               |+------------------------------+
         *      |               ||3               ||               ||4                             |
         *      |               |+----------------+|               |+------------------------------+
         *      |               |+----------------+|               |+--------------++--------------+
         *      |               ||5               ||               ||6             ||7             |
         *      |               ||                ||               ||              ||              |
         *      |               ||                ||               ||              ||              |
         *      +---------------+|                |+---------------+|              ||              |
         *                       |                |                 |              ||              |
         *                       +----------------+                 +--------------++--------------+
         */
        testLayout(t, index, [{
          s: '9:00',
          e: '15:00',
          top: 40,
          bottom: 70,
          left: 0,
          right: [200, 980]
        }, // 0
        {
          s: '9:00',
          e: '10:00',
          top: 40,
          bottom: 45,
          left: 200,
          right: [400, 985]
        }, // 1
        {
          s: '9:15',
          e: '15:00',
          top: 41.25,
          bottom: 70,
          left: 400,
          right: [600, 990]
        }, // 2
        // Now the special cases:
        {
          s: '10:00',
          e: '11:00',
          top: 45,
          bottom: 50,
          left: 200,
          right: [400, 990]
        }, // 3
        {
          s: '10:00',
          e: '11:00',
          top: 45,
          bottom: 50,
          left: 600,
          right: [995, 995]
        }, // 4
        {
          s: '11:00',
          e: '17:00',
          top: 50,
          bottom: 80,
          left: 200,
          right: [400, 990]
        }, // 5
        {
          s: '11:00',
          e: '17:00',
          top: 50,
          bottom: 80,
          left: 600,
          right: [800, 990]
        }, // 6
        {
          s: '11:00',
          e: '17:00',
          top: 50,
          bottom: 80,
          left: 800,
          right: [995, 995]
        } // 7
        ], _objectSpread({
          clearanceMinutes: 600
        }, layoutConfig));
      });
      t.it(`should use exposed columns of subsequent events`, t => {
        /*
         *      +----------+  +----------------++----------------++---------------+
         *      |0         |  |1               ||2               ||3              |+---------------+
         *      |          |  +----------------++----------------++---------------+|4              |
         *      |          |  +---------------------------+                        |               |
         *      |          |  |5                          |+----------------------+|               |
         *      |          |  |                           ||6                     ||               |
         *      |          |  +---------------------------+|                      ||               |
         *      |          |                               +----------------------+|               |
         *      |          |  +---------------------------------------------------+|               |
         *      |          |  |7                                                  |+---------------+
         *      |          |  |                                                   |
         *      |          |  +---------------------------------------------------+
         *      | +----------++------------++------------++------------++------------++------------+
         *      | |12        ||8           ||9           ||10          ||11          ||13         ||
         *      | +----------++------------++------------++------------++------------++------------+
         *      |          |
         *      +----------+
         */
        testLayout(t, index, [{
          s: '9:00',
          e: '18:00',
          top: 40,
          bottom: 85,
          left: 0,
          right: [162, 970]
        }, // 0
        {
          s: '9:00',
          e: '10:00',
          top: 40,
          bottom: 45,
          left: 167,
          right: [374, 980]
        }, // 1
        {
          s: '9:00',
          e: '10:00',
          top: 40,
          bottom: 45,
          left: 374,
          right: [583, 985]
        }, // 2
        {
          s: '9:00',
          e: '10:00',
          top: 40,
          bottom: 45,
          left: 583,
          right: [792, 990]
        }, // 3
        {
          s: '9:15',
          e: '14:00',
          top: 41.25,
          bottom: 65,
          left: 792,
          right: [995, 995]
        }, // 4
        // Now the special cases:
        {
          s: '10:00',
          e: '12:00',
          top: 45,
          bottom: 55,
          left: 167,
          right: [479, 985]
        }, // 5
        {
          s: '10:30',
          e: '12:30',
          top: 47.5,
          bottom: 57.5,
          left: 479,
          right: [792, 990]
        }, // 6
        {
          s: '12:30',
          e: '14:30',
          top: 57.5,
          bottom: 67.5,
          left: 167,
          right: [792, 990]
        }, // 7
        {
          s: '15:00',
          e: '17:00',
          top: 70,
          bottom: 80,
          left: 167,
          right: [333, 975]
        }, // 8
        {
          s: '15:00',
          e: '17:00',
          top: 70,
          bottom: 80,
          left: 333,
          right: [500, 980]
        }, // 9
        {
          s: '15:00',
          e: '17:00',
          top: 70,
          bottom: 80,
          left: 500,
          right: [667, 985]
        }, // 10
        {
          s: '15:00',
          e: '17:00',
          top: 70,
          bottom: 80,
          left: 667,
          right: [833, 990]
        }, // 11
        {
          s: '15:00',
          e: '17:00',
          top: 70,
          bottom: 80,
          left: 10,
          right: [167, 975]
        }, // 12
        {
          s: '15:00',
          e: '17:00',
          top: 70,
          bottom: 80,
          left: 833,
          right: [995, 995]
        } // 13
        ], _objectSpread({
          clearanceMinutes: 240
        }, layoutConfig));
      });
    };

    t.describe('defaults', t => {
      suite(t, 0, {});
    });
    t.describe('stretch', t => {
      suite(t, 1, {
        stretch: true
      });
    });
    t.describe('escape', t => {
      suite(t, 2, {
        escapeMinutes: 45
      });
    }); // TODO  t.describe('proportional', t => ... { indentWidth : 0.05, staggerWidth : 0.05  }
  });
});