Class('BryntumCalendarTest', {

    // eslint-disable-next-line no-undef
    isa : BryntumSchedulerTest,

    override : {
        action(...actions) {
            return new Promise(resolve => {
                this.chain(actions.concat([
                    (next, result) => {
                        resolve(result);
                        next();
                    }
                ]));
            });
        },

        clearPageScroll() {
            this.enablePageScroll(false);
        },

        dateShifter(startShift = 0, offsetHrs = startShift) {
            const nn = v => `${(v < 10) ? '0' : ''}${v}`;

            return (Y, M, D, h = 0, m = 0, s = 0) => {
                const offset = (h + m + s) ? offsetHrs : startShift;

                if (offset) {
                    h += offset;

                    while (h >= 24) {
                        h -= 24;
                        ++D;

                        if (D > 31) {  // ignore moving into December
                            D = 1;
                            ++M;
                        }
                    }
                }

                return `${Y}-${nn(M)}-${nn(D)}T${nn(h)}:${nn(m)}:${nn(s)}`;
            };
        },

        enablePageScroll(enable = true) {
            const
                body     = this.getBodyElement(),
                doc      = body.ownerDocument,
                scrollEl = doc.scrollingElement || doc.body,
                pad      = 125;

            body.style.overflow = enable ? 'auto' : '';
            body.style.padding = enable ? `${pad}px` : '0';
            scrollEl.scrollTop = enable ? 2 * pad : 0;
            scrollEl.scrollLeft = enable ? 2 * pad : 0;
        },

        getHackathonData(startShift = 0, offsetHrs = startShift) {
            const date = this.dateShifter(startShift, offsetHrs);

            return {
                success   : true,
                resources : {
                    rows : [
                        {
                            id         : 'bryntum', // no-sanity
                            name       : 'Bryntum team',
                            eventColor : '#249fbc'
                        },
                        {
                            id         : 'hotel', // no-sanity
                            name       : 'Hotel Park',
                            eventColor : '#ffc107'
                        },
                        {
                            id         : 'mats', // no-sanity
                            name       : 'Mats Bryntse',
                            eventColor : '#e44959'
                        }
                    ]
                },
                events : {
                    rows : [
                        {
                            id         : 1,
                            startDate  : date(2019, 10, 14),
                            endDate    : date(2019, 10, 22),
                            name       : 'Hackathon 2019',
                            allDay     : !startShift,
                            resourceId : 'bryntum'
                        },
                        {
                            id         : 2,
                            startDate  : date(2019, 10, 14, 14),
                            endDate    : date(2019, 10, 14, 18),
                            name       : 'Check-In in Hotel',
                            resourceId : 'hotel'
                        },
                        {
                            id         : 3,
                            startDate  : startShift ? date(2019, 10, 14) : date(2019, 10, 14, 18),
                            endDate    : startShift ? date(2019, 10, 15) : date(2019, 10, 14, 20),
                            name       : 'Relax and official arrival beer',
                            allDay     : !startShift,
                            resourceId : 'mats'
                        },
                        {
                            id         : 4,
                            startDate  : date(2019, 10, 14, 20),
                            endDate    : date(2019, 10, 14, 21),
                            name       : 'Dinner',
                            resourceId : 'hotel'
                        },
                        {
                            id             : 5,
                            startDate      : date(2019, 10, 15, 9),
                            endDate        : date(2019, 10, 15, 10),
                            name           : 'Breakfast',
                            recurrenceRule : 'FREQ=DAILY;INTERVAL=1;UNTIL=20191021',
                            resourceId     : 'hotel'
                        },
                        {
                            id         : 6,
                            startDate  : date(2019, 10, 15, 10),
                            endDate    : date(2019, 10, 15, 12),
                            name       : 'Team Scrum',
                            resourceId : 'bryntum'
                        },
                        {
                            id         : 7,
                            startDate  : date(2019, 10, 15, 12),
                            endDate    : date(2019, 10, 15, 14),
                            name       : 'Scheduler Grid introduction + review',
                            resourceId : 'bryntum'
                        },
                        {
                            id         : 8,
                            startDate  : date(2019, 10, 15, 14),
                            endDate    : date(2019, 10, 15, 15),
                            name       : 'Lunch',
                            resourceId : 'hotel'
                        },
                        {
                            id         : 9,
                            startDate  : date(2019, 10, 15, 15),
                            endDate    : date(2019, 10, 15, 19),
                            name       : 'Active client project review',
                            resourceId : 'bryntum'
                        },
                        {
                            id         : 10,
                            startDate  : date(2019, 10, 15, 19),
                            endDate    : date(2019, 10, 15, 20),
                            name       : 'Dinner',
                            resourceId : 'hotel'
                        },
                        // {
                        //     id         : 11,
                        //     startDate  : date(2019, 10, 16, 09),
                        //     endDate    : date(2019, 10, 16, 10),
                        //     name       : 'Breakfast',
                        //     resourceId : 'hotel'
                        // },
                        {
                            id         : 12,
                            startDate  : date(2019, 10, 16, 10),
                            endDate    : date(2019, 10, 16, 12),
                            name       : 'Roadmapping for 2020',
                            resourceId : 'bryntum'
                        },
                        {
                            id         : 13,
                            startDate  : date(2019, 10, 16, 12),
                            endDate    : date(2019, 10, 16, 14),
                            name       : 'Review Assembla tickets and decide features to add',
                            resourceId : 'bryntum'
                        },
                        {
                            id         : 14,
                            startDate  : date(2019, 10, 16, 14),
                            endDate    : date(2019, 10, 16, 15),
                            name       : 'Lunch',
                            resourceId : 'hotel'
                        },
                        {
                            id         : 15,
                            startDate  : date(2019, 10, 16, 15),
                            endDate    : date(2019, 10, 16, 19),
                            name       : 'Active programming',
                            resourceId : 'bryntum'
                        },
                        {
                            id         : 16,
                            startDate  : date(2019, 10, 16, 19),
                            endDate    : date(2019, 10, 16, 20),
                            name       : 'Dinner',
                            resourceId : 'hotel'
                        },
                        // {
                        //     id         : 17,
                        //     startDate  : date(2019, 10, 17, 09),
                        //     endDate    : date(2019, 10, 17, 10),
                        //     name       : 'Breakfast',
                        //     resourceId : 'hotel'
                        // },
                        {
                            id         : 18,
                            startDate  : date(2019, 10, 17, 10),
                            endDate    : date(2019, 10, 17, 18),
                            name       : 'Excursion',
                            resourceId : 'mats'
                        },
                        {
                            id         : 19,
                            startDate  : date(2019, 10, 17, 18),
                            endDate    : date(2019, 10, 17, 22),
                            name       : 'Team Building',
                            resourceId : 'mats'
                        },
                        // {
                        //     id         : 20,
                        //     startDate  : date(2019, 10, 18, 09),
                        //     endDate    : date(2019, 10, 18, 10),
                        //     name       : 'Breakfast',
                        //     resourceId : 'hotel'
                        // },
                        {
                            id         : 21,
                            startDate  : date(2019, 10, 18, 14),
                            endDate    : date(2019, 10, 18, 15),
                            name       : 'Lunch',
                            resourceId : 'hotel'
                        },
                        {
                            id         : 22,
                            startDate  : date(2019, 10, 18, 19),
                            endDate    : date(2019, 10, 18, 20),
                            name       : 'Dinner',
                            resourceId : 'hotel'
                        },
                        {
                            id         : 23,
                            startDate  : date(2019, 10, 18),
                            endDate    : date(2019, 10, 19),
                            name       : 'Gantt review + development',
                            allDay     : !startShift,
                            resourceId : 'bryntum'
                        },
                        // {
                        //     id         : 24,
                        //     startDate  : date(2019, 10, 19, 09),
                        //     endDate    : date(2019, 10, 19, 10),
                        //     name       : 'Breakfast',
                        //     resourceId : 'hotel'
                        // },
                        {
                            id         : 25,
                            startDate  : date(2019, 10, 19, 14),
                            endDate    : date(2019, 10, 19, 15),
                            name       : 'Lunch',
                            resourceId : 'hotel'
                        },
                        {
                            id         : 26,
                            startDate  : date(2019, 10, 19, 18),
                            endDate    : date(2019, 10, 19, 21),
                            name       : 'Split.JS conference: Monitoring and Reproducing Errors in Web Applications + Late Dinner or AfterParty',
                            resourceId : 'mats'
                        },
                        {
                            id         : 27,
                            startDate  : date(2019, 10, 19),
                            endDate    : date(2019, 10, 20),
                            name       : 'Root Cause ticket bash',
                            allDay     : !startShift,
                            resourceId : 'bryntum'
                        },
                        // {
                        //     id         : 28,
                        //     startDate  : date(2019, 10, 20, 09),
                        //     endDate    : date(2019, 10, 20, 10),
                        //     name       : 'Breakfast',
                        //     resourceId : 'hotel'
                        // },
                        {
                            id         : 29,
                            startDate  : date(2019, 10, 20, 14),
                            endDate    : date(2019, 10, 20, 15),
                            name       : 'Lunch',
                            resourceId : 'hotel'
                        },
                        {
                            id         : 30,
                            startDate  : date(2019, 10, 20, 19),
                            endDate    : date(2019, 10, 20, 20),
                            name       : 'Dinner',
                            resourceId : 'hotel'
                        },
                        {
                            id         : 31,
                            startDate  : date(2019, 10, 20),
                            endDate    : date(2019, 10, 21),
                            name       : 'Pair programming sessions',
                            allDay     : !startShift,
                            resourceId : 'bryntum'
                        },
                        // {
                        //     id         : 32,
                        //     startDate  : date(2019, 10, 21, 09),
                        //     endDate    : date(2019, 10, 21, 10),
                        //     name       : 'Breakfast',
                        //     resourceId : 'hotel'
                        // },
                        {
                            id         : 33,
                            startDate  : date(2019, 10, 21, 10),
                            endDate    : date(2019, 10, 21, 12),
                            name       : 'Check-Out & Fly home',
                            resourceId : 'mats'
                        }
                    ]
                }
            };
        },

        isDragging() {
            return Boolean(this.getBodyElement().querySelector('.b-calendar.b-draghelper-active'));
        },

        async getMonthView(config) {
            const
                project    = {},
                viewConfig = Object.assign({ project }, config),
                DateHelper = this.global.DateHelper;

            if (config.eventStore) {
                project.eventStore = config.eventStore;
            }
            if (config.resourceStore) {
                project.resourceStore = config.resourceStore;
            }
            viewConfig.project = new this.global.ProjectModel(viewConfig.project);

            const
                monthView = new this.global.MonthView(Object.assign({
                    appendTo : this.getBodyElement()
                }, viewConfig));

            await this.waitForProjectReady(monthView);

            Object.defineProperty(monthView, 'weekWidth', {
                get : () => monthView.bodyElement.querySelector('.b-calendar-days').getBoundingClientRect().width
            });
            Object.defineProperty(monthView, 'cellWidth', {
                get : () => monthView.bodyElement.querySelector('.b-calendar-cell:not(.b-hide-display)').getBoundingClientRect().width
            });
            Object.defineProperty(monthView, 'eventElements', {
                get : () => monthView.eventStore.reduce((prev, event) => {
                    const eventEl = monthView.getEventElement(event);

                    if (eventEl) {
                        prev.push(eventEl);
                    }
                    return prev;
                }, [])
            });

            monthView.getCellEvents = date => {
                if (typeof date !== 'string') {
                    date = DateHelper.format(date, 'YYYY-MM-DD');
                }
                return monthView.cellMap.get(date).renderedEvents.slots.map(e => e.eventRecord);
            };
            monthView.getCellEventIds = date => {
                if (typeof date !== 'string') {
                    date = DateHelper.format(date, 'YYYY-MM-DD');
                }
                return monthView.cellMap.get(date).renderedEvents.slots.map(e => e.eventRecord.id);
            };

            this.assertNoDomGarbage(this);

            const nullifiedConfigs = monthView.$meta.nullify.map(c => c.name);

            // Check that nullified configs from the Widget class are propagated all the way down.
            if (!(nullifiedConfigs.includes('scrollable') && nullifiedConfigs.includes('monitorResize'))) {
                this.fail('nullifed configs not propagated from Widget down to sub classes');
            }

            return monthView;
        },

        async getAgendaView(config) {
            const
                project    = {},
                viewConfig = Object.assign({ project }, config),
                DateHelper = this.global.DateHelper;

            if (config.eventStore) {
                project.eventStore = config.eventStore;
            }
            if (config.resourceStore) {
                project.resourceStore = config.resourceStore;
            }
            viewConfig.project = new this.global.ProjectModel(viewConfig.project);

            const
                agendaView = new this.global.AgendaView(Object.assign({
                    appendTo : this.getBodyElement()
                }, viewConfig));

            await this.waitForProjectReady(agendaView);

            Object.defineProperty(agendaView, 'eventElements', {
                get : () => agendaView.eventStore.reduce((prev, event) => {
                    const eventEl = agendaView.getEventElement(event);

                    if (eventEl) {
                        prev.push(eventEl);
                    }
                    return prev;
                }, [])
            });

            agendaView.getCellEvents = date => {
                if (typeof date !== 'string') {
                    date = DateHelper.format(date, 'YYYY-MM-DD');
                }
                return agendaView.cellMap.get(date).events.map(e => e.eventRecord);
            };
            agendaView.getCellEventIds = date => {
                if (typeof date !== 'string') {
                    date = DateHelper.format(date, 'YYYY-MM-DD');
                }
                return agendaView.cellMap.get(date).events.map(e => e.eventRecord.id);
            };

            this.assertNoDomGarbage(this);

            const nullifiedConfigs = agendaView.$meta.nullify.map(c => c.name);

            // Check that nullified configs from the Widget class are propagated all the way down.
            if (!(nullifiedConfigs.includes('scrollable') && nullifiedConfigs.includes('monitorResize'))) {
                this.fail('nullifed configs not propagated from Widget down to sub classes');
            }

            return agendaView;
        },

        async getDayView(t, config) {
            const
                project    = {},
                viewConfig = Object.assign({ project }, config);

            if (config.eventStore) {
                project.eventStore = config.eventStore;
            }
            if (config.resourceStore) {
                project.resourceStore = config.resourceStore;
            }
            viewConfig.project = new t.global.ProjectModel(viewConfig.project);

            const dayView = new t.global.DayView(Object.assign({
                appendTo : t.getBodyElement()
            }, viewConfig));

            await t.waitForProjectReady(dayView);

            // Wait for animation frame to allow visibleStartTime to be honoured before starting tests
            await this.waitForAnimationFrame();

            Object.defineProperty(dayView, 'eventElements', {
                get : () => dayView.eventStore.reduce((prev, event) => {
                    const eventEl = dayView.getEventElement(event);

                    if (eventEl) {
                        prev.push(eventEl);
                    }
                    return prev;
                }, [])
            });

            dayView.on({
                refresh({ source : dayView }) {
                    if (!t.isFinished()) {
                        // Check cell counts always match at every refresh
                        t.is(dayView.element.querySelectorAll('.b-calendarrow .b-calendar-cell').length, dayView.element.querySelectorAll('.b-dayview-day-container .b-calendar-cell').length, 'Header count = Cell count');
                    }
                }
            });

            // Sanity check that CalendarRows in a DayView never have overflow
            dayView.on({
                paint({ source : dayView }) {
                    dayView.allDayEvents?.on({
                        paint({ source }) {
                            const { contentElEment } = source;

                            t.isLessOrEqual(contentElEment.scrollWidth, contentElEment.clientWidth);
                        }
                    });
                },
                once : true
            });

            t.assertNoDomGarbage(t);

            const nullifiedConfigs = dayView.$meta.nullify.map(c => c.name);

            // Check that nullified configs from the Widget class are propagated all the way down.
            if (!(nullifiedConfigs.includes('scrollable') && nullifiedConfigs.includes('monitorResize'))) {
                this.fail('nullifed configs not propagated from Widget down to sub classes');
            }

            return dayView;
        },

        async getYearView(config) {
            const
                project    = {},
                viewConfig = Object.assign({ project }, config);

            if (config.eventStore) {
                project.eventStore = config.eventStore;
            }
            if (config.resourceStore) {
                project.resourceStore = config.resourceStore;
            }
            viewConfig.project = new this.global.ProjectModel(viewConfig.project);

            const yearView = new this.global.YearView(Object.assign({
                appendTo : this.getBodyElement(),
                width    : 1024,
                height   : 768
            }, viewConfig));

            await this.waitForProjectReady(yearView);

            this.assertNoDomGarbage(this);

            const nullifiedConfigs = yearView.$meta.nullify.map(c => c.name);

            // Check that nullified configs from the Widget class are propagated all the way down.
            if (!(nullifiedConfigs.includes('scrollable') && nullifiedConfigs.includes('monitorResize'))) {
                this.fail('nullified configs not propagated from Widget down to sub classes');
            }

            return yearView;
        },

        async getCalendar(config, activeIndex) {
            const modeIndices = [
                'day',
                'week',
                'month',
                'year',
                'agenda'
            ];

            config = this.global.Calendar.mergeConfigs({
                appendTo : this.getBodyElement(),
                width    : 1024,
                height   : 768
            }, config);

            if (activeIndex != null) {
                config.mode = modeIndices[activeIndex];
            }

            const
                test     = this,
                calendar = new this.global.Calendar(config),
                dayViews = calendar.queryAll(v => v.isDayView);

            calendar.on('catchAll', ({ type }) => {
                if (type.includes('undefined')) {
                    test.fail("event type 'undefined' is not valid");
                }
            });

            // Sanity check that CalendarRows in a DayView never have overflow
            for (let i = 0, { length } = dayViews; i < length; i++) {
                dayViews[i].on({
                    paint({ source : dayView }) {
                        dayView.allDayEvents?.on({
                            paint({ source }) {
                                const { contentElement } = source;

                                if (contentElement.scrollWidth > contentElement.clientWidth) {
                                    test.isLessOrEqual(contentElement.scrollWidth, contentElement.clientWidth);
                                }
                            }
                        });
                    },
                    once : true
                });
            }

            await this.waitForProjectReady(calendar);

            // Wait for animation frame to allow DayView's visibleStartTime to be honoured before starting tests
            await this.waitForAnimationFrame();

            this.assertNoDomGarbage(this);

            const nullifiedConfigs = calendar.$meta.nullify.map(c => c.name);

            // Check that nullified configs from the Widget class are propagated all the way down.
            if (!(nullifiedConfigs.includes('scrollable') && nullifiedConfigs.includes('monitorResize'))) {
                this.fail('nullified configs not propagated from Widget down to sub classes');
            }

            return calendar;
        },

        async setupHackathonProject() {
            const
                t       = this,
                project = new t.global.ProjectModel({
                    eventStore : new t.global.EventStore({
                        data : t.getHackathonData().events.rows,

                        // Auto-created and DD created events get this as a default Calendar
                        defaultCalendarId : 'mats'
                    }),

                    resourceStore : new t.global.ResourceStore({
                        data : t.getHackathonData().resources.rows
                    })
                });

            await t.waitForProjectReady(project);

            // eventStore = project.eventStore;

            return project;
        },

        hmsToSec(hms) {
            const parts = hms.split(':');

            return (parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10)) * 60 + (parseInt(parts[2] || 0, 10));
        },

        hmsToMillis(hms) {
            return this.hmsToSec(hms) * 1000;
        },

        async occurrenceEditConfirmation(el) {
            const t = this;

            if (!el) {
                el = await this.waitForSelector('.b-sch-recurrenceconfirmation');
                el = el[0];
            }

            const buttons = el.querySelectorAll('button:not(.b-tool):not(.b-hidden)');

            t.is(buttons.length, 3, 'Occurrence editor dialog');

            return {
                async allFutureEvents() {
                    await t.click(buttons[0]);
                },

                async cancel() {
                    await t.click(buttons[2]);
                },

                async onlyThisEvent() {
                    await t.click(buttons[1]);
                }
            };
        },

        async recurrenceEditConfirmation(el) {
            const t = this;

            if (!el) {
                el = await this.waitForSelector('.b-sch-recurrenceconfirmation');
                el = el[0];
            }

            const buttons = el.querySelectorAll('button:not(.b-tool):not(.b-hidden)');

            t.is(buttons.length, 2, 'Recurrence editor dialog');

            return {
                async cancel() {
                    await t.click(buttons[1]);
                },

                async yes() {
                    await t.click(buttons[0]);
                }
            };
        },

        setupDayViewAllDayDragHarness() {
            return this.setupDragHarness({
                activeIndex  : 0,
                viewSelector : '.b-dayview:not(.b-weekview)',
                cellCls      : '.b-calendar-cell.b-dayview-allday',
                config       : {
                    // defaults
                }
            });
        },

        setupDayViewDragHarness() {
            return this.setupDragHarness({
                activeIndex  : 0,
                viewSelector : '.b-dayview:not(.b-weekview)',
                cellCls      : '.b-calendar-cell.b-dayview-day-detail',
                config       : {
                    // defaults
                }
            });
        },

        setupMonthViewDragHarness() {
            return this.setupDragHarness({
                activeIndex    : 2,
                viewSelector   : '.b-monthview-content',
                cellCls        : '.b-calendar-cell',
                innerSelector  : '.b-cal-cell-header',
                overflowSuffix : ' .b-cal-cell-overflow',
                config         : {
                    // defaults
                }
            });
        },

        setupWeekViewAllDayDragHarness() {
            return this.setupDragHarness({
                activeIndex  : 1,
                viewSelector : '.b-weekview',
                cellCls      : '.b-calendar-cell.b-dayview-allday',
                config       : {
                    // defaults
                }
            });
        },

        setupWeekViewDragHarness() {
            return this.setupDragHarness({
                activeIndex  : 1,
                viewSelector : '.b-weekview',
                cellCls      : '.b-calendar-cell.b-dayview-day-detail',
                config       : {
                    // defaults
                }
            });
        },

        setupYearViewDragHarness() {
            return this.setupDragHarness({
                activeIndex  : 3,
                viewSelector : '.b-yearview-content',
                cellCls      : '.b-calendar-cell:not(.b-other-month)',
                config       : {
                    // defaults
                }
            });
        },

        setupResourceViewDragHarness() {
            return this.setupDragHarness({
                activeIndex  : 3,
                viewSelector : '.b-resourceview-content',
                cellCls      : '.b-calendar-cell',
                config       : {
                    // defaults
                }
            });
        },

        setupDragHarness({ activeIndex, config, viewSelector, cellCls, innerSelector, overflowSuffix }) {
            let t = this;  // the beforeEach() context

            function combineDragOptions(options, keys) {
                const isMac = t.global.navigator.platform.match(/Mac/);

                if (keys) {
                    options = options || {};
                    options.options = Object.assign({}, options.options);

                    options.options.altKey = keys.includes('A');
                    options.options.ctrlKey = keys.includes('C') || (!isMac && keys.includes('^'));
                    options.options.metaKey = keys.includes('M') || (isMac && keys.includes('^'));
                    options.options.shiftKey = keys.includes('S');
                }

                return options;
            }

            const harness = {
                Event : {
                    BeerTime     : 3,
                    Breakfast    : 5,
                    CheckInHotel : 2,
                    GanttReview  : 23,
                    Hackathon    : 1,
                    SplitJS      : 26,
                    Dinner2      : 10,
                    Dinner3      : 16,
                    Excursion    : 18,
                    TeamBuilding : 19,
                    TeamScrum    : 6
                },

                Text : {
                    BeerTime     : 'Relax and official arrival beer',
                    CheckInHotel : 'Check-In in Hotel',
                    Dinner2      : 'Dinner',
                    Dinner3      : 'Dinner',
                    GanttReview  : 'Gantt review + development',
                    Hackathon    : 'Hackathon 2019',
                    Excursion    : 'Excursion',
                    TeamBuilding : 'Team Building',
                    TeamScrum    : 'Team Scrum'
                },

                // Browsers implement localization differently, for example 'LT' in FF has no leading zero
                TimeText : {
                    BeerTime    : 'Relax and official arrival beer',
                    GanttReview : 'Gantt review + development',
                    Hackathon   : 'Hackathon 2019',
                    TeamScrum   : '10 AMTeam Scrum12 PM'
                },

                EDGE_OFFSET       : 6,  // see hoverX() methods on drag harness
                MONTH_PX_PER_DAY  : 112,
                MONTH_PX_PER_WEEK : 108,

                get DAY_PX_PER_HOUR() {
                    const view = harness.calendar.modes.day || harness.calendar.modes.week;
                    return view.hourHeight;
                },

                async init(_t, localConfig = {}) {
                    t = _t;  // the it() context

                    // Check that none of the floating things are persisting
                    if (t.global.document.querySelector('.b-sch-event-tooltip,.b-sch-event-tooltip,.b-eventeditor')) {
                        t.selectorNotExists('.b-overflowpopup:visible');
                        t.selectorNotExists('.b-sch-event-tooltip');
                        t.selectorNotExists('.b-eventeditor');
                    }

                    if (!localConfig.crudManager) {
                        harness.project = await t.setupHackathonProject();
                    }
                    else {
                        harness.project = localConfig.crudManager;
                    }

                    harness.eventStore = harness.project.eventStore;

                    harness.calendar = await t.getCalendar(t.global.Calendar.mergeConfigs({
                        eventStore : harness.eventStore,
                        project    : harness.project,
                        date       : new Date(2019, 9, 14),
                        features   : {
                            eventEdit : null
                        }
                    }, config, localConfig), activeIndex);

                    harness.eventStore = harness.calendar.eventStore;

                    await t.waitFor(1);  // TODO figure out what we're really waiting for here
                },

                get focusedEventRecord() {
                    const activeElement = t.global.document.activeElement;

                    return activeElement && harness.calendar.contains(activeElement) &&
                        harness.calendar.getEventRecord(activeElement);
                },

                get tentativeEvent() {
                    return harness.calendar.features.drag.eventRecord;
                },

                destroy() {
                    harness.calendar?.destroy();
                },

                action(...actions) {
                    return t.action(...actions);
                },

                async allDayDrag({ from, to, keys, options }) {
                    const
                        isDayView          = viewSelector.includes('day') || viewSelector.includes('week'),
                        allDayCellSelector = isDayView ? 'headerCellSelector' : 'cellSelector',
                        cell               = this[allDayCellSelector](from),
                        cell2              = this[allDayCellSelector](to);

                    await this.dragDrop(cell, Object.assign({
                        to : cell2
                    }, options), keys);

                    await harness.getDragResult();
                },

                cellSelector(date) {
                    return `${viewSelector} ${cellCls}[data-date="${date}"] ${innerSelector || ''}`;
                },

                headerCellSelector(date) {
                    return `${viewSelector} [data-header-date="${date}"] ${innerSelector || ''}`;
                },

                async overflowPopup(date) {
                    await this.action({
                        click : `${viewSelector} ${cellCls}[data-date="${date}"]${overflowSuffix || ''}`
                    });

                    await t.waitFor(() => this.calendar.activeView._overflowPopup?.isVisible);

                    const { overflowPopup } = this.calendar.activeView;

                    return {
                        async hoverEvent(eventId, { offset } = {}) {
                            const selector = `#${overflowPopup.id} [data-event-id="${eventId}"]`;

                            const els = await harness.waitForSelectorAll(selector);

                            const el = els[0];

                            await harness.moveCursorTo(el, { offset });

                            return [el, offset, harness.eventStore.getById(eventId)];
                        }
                    };
                },

                async dayTimeDrag({ keys, from, to, options }) {
                    const [cell, x, y, sx, sy] = await this.dayXY(from.date, from.time);
                    const [, , , sx1, sy1] = await this.dayXY(to.date, to.time);

                    await this.dragDrop(cell, Object.assign({
                        offset : [x, y],
                        by     : [sx1 - sx, sy1 - sy]
                    }, options), keys);

                    await harness.getDragResult();
                },

                /**
                 * Returns coordinates for the date and time.
                 * @param {String} date Date in form `YYYY-MM-DD`, i.e. 2020-12-21
                 * @param {String} [hms] Time info in form `HH:mm`, i.e. 20:45
                 * @returns {Promise<Array>} Returns array [cell element, x, y, gx, gy], where
                 * x, y - date coordinates relative to the top left corner of the cell (day column)
                 * px, py - date coordinates relative to the top left corner of the page
                 */
                async dayXY(date, hms) {
                    const
                        cell = await this.getCell(date),
                        view = await this.getView(),
                        box  = cell.getBoundingClientRect(),
                        x = Math.round(box.width / 2);

                    let y;

                    if (hms) {
                        const { dayStartMs, dayEndMs } = view;

                        y = t.hmsToMillis(hms);
                        y = Math.round((y - dayStartMs) / (dayEndMs - dayStartMs) * box.height);
                    }
                    else {
                        y = Math.round(box.height / 2);
                    }

                    // returns local x/y relative to day column and page x/y
                    return [cell, x, y, Math.round(box.left) + x, Math.round(box.top) + y];
                },

                drag(el, options, keys) {
                    options = combineDragOptions(options, keys);
                    options = Object.assign({
                        drag     : el,
                        dragOnly : true
                    }, options);

                    if (!options.by && !options.to) {
                        options.by = [0, 0];
                    }

                    return this.action(options);
                },

                dragDrop(el, options, keys) {
                    return this.drag(el, Object.assign({
                        dragOnly : false
                    }, options), keys);
                },

                drop(options, keys) {
                    options = combineDragOptions(options, keys);

                    return this.action(
                        Object.assign({
                            action : 'mouseUp',

                            // We need to not waitForTarget because drag proxies can overlap the target... further, the
                            // pointer-events:none style can confuse matters (it seems). However, given the defaulting
                            // of waitForTarget to true when "target" is provided, we need to avoid setting "target"
                            // for this to work:
                            waitForTarget : false
                        }, options)
                    );
                },

                async getCell(date) {
                    return this.waitForSelector(this.cellSelector(date));
                },

                getDateRangeForElement(el, includeTop) {
                    const view = t.global.bryntum.fromElement(el);
                    const cell = el.closest(`${view.visibleCellSelector}${view.hideNonWorkingDays ? ':not(.b-nonworking-day' : ''}`);
                    const calendarRow = cell.closest('.b-calendarrow');
                    const calendarWeek = cell.closest('.b-calendar-week');
                    const cellDate = view.getDateFromElement(cell);
                    const cellRect = cell.getBoundingClientRect();
                    const elRect = el.getBoundingClientRect();

                    let end, start;

                    if (cell.closest('.b-dayview-day-container')) {
                        const { dayStartMs, dayEndMs } = view;
                        const dayStartMinute = dayStartMs / 60000;
                        const dayLenMinutes = (dayEndMs - dayStartMs) / 60000;
                        const scale = dayLenMinutes / cellRect.height;
                        const toDate = y => {
                            const d = new Date(cellDate.getTime());

                            d.setMinutes(Math.round(dayStartMinute + (y - cellRect.top) * scale));

                            return d;
                        };

                        start = toDate(elRect.top);
                        end = toDate(elRect.bottom);
                    }
                    else if (cell.closest('.b-yearview-month')) {
                        return cell.classList.contains('b-other-month') ? [cellDate, 'other'] : cellDate;
                    }
                    else {
                        const weekRect = (calendarWeek || calendarRow).getBoundingClientRect();
                        const daysPerPx = view.weekLength / weekRect.width;
                        const startDate = view.getDateFromElement((calendarWeek || calendarRow).querySelector(`${view.visibleCellSelector}${view.hideNonWorkingDays ? ':not(.b-nonworking-day' : ''}`));
                        const toDate = x => {
                            const d = new Date(startDate);

                            d.setDate(d.getDate() + Math.round((x - weekRect.left) * daysPerPx));

                            return d;
                        };

                        start = toDate(elRect.left);
                        end = toDate(elRect.right);
                    }

                    const ret = [start, end, el.textContent];

                    if (includeTop) {
                        ret.push(Math.round(parseInt(el.style.top || '0', 10) / 2) * 2);
                    }

                    return ret;
                },

                async getDragResult() {
                    harness.newEventRecord = harness.eventStore.find(r => r.data.name === 'New event');

                    harness.occurrences = harness.newEventRecord &&
                        harness.newEventRecord.getOccurrencesForDateRange(new Date(2019, 0, 1), new Date(2020, 0, 1));

                    await t.waitForProjectReady(harness.calendar);
                },

                getTentativeDates(includeTop = false) {
                    const els = this.calendar.activeView.element.querySelectorAll('.b-cal-tentative-event');

                    return Array.from(els).map(el => this.getDateRangeForElement(el, includeTop));
                },

                async getView() {
                    const el = await this.waitForSelector(viewSelector);

                    return t.global.bryntum.fromElement(el);
                },

                async hoverDate(date, offset) {
                    if (typeof date !== 'string') {
                        date = t.global.bryntum.Calendar.DateHelper.format(date, 'YYYY-MM-DD');
                    }

                    return await this.moveCursorTo(`${viewSelector} [data-date="${date}"]:not(.b-other-month)`, { offset });
                },

                async hoverEvent(eventId, { offset, last, extraSelector } = {}) {
                    const selector = `${viewSelector} [data-event-id="${eventId}"]:not(.b-overflow)${extraSelector || ''}`;

                    const els = await this.waitForSelectorAll(selector);

                    const el = last ? els[els.length - 1] : els[0];

                    await this.moveCursorTo(el, { offset });

                    return [el, offset, harness.eventStore.getById(eventId)];
                },

                /**
                 * Moves cursor to the top edge of the event, preparing it to resizing.
                 * @param {Number|String} eventId Id of the event to hover
                 * @returns {Promise<Array>} Returns array [event element, offset, event record]
                 */
                async hoverTop(eventId) {
                    return await this.hoverEvent(eventId, {
                        extraSelector : ':not(.b-starts-above)',
                        offset        : ['50%', 6]
                    });
                },

                async hoverRight(eventId, last = true) {
                    return await this.hoverEvent(eventId, {
                        offset : ['100%-6', '50%'],
                        last
                    });
                },

                /**
                 * Moves cursor to the bottom edge of the event, preparing it to resizing.
                 * @param {Number|String} eventId Id of the event to hover
                 * @returns {Promise<Array>} Returns array [event element, offset, event record]
                 */
                async hoverBottom(eventId) {
                    return await this.hoverEvent(eventId, {
                        extraSelector : ':not(.b-ends-below)',
                        offset        : ['50%', '100%-6']
                    });
                },

                async hoverLeft(eventId, last = false) {
                    return await this.hoverEvent(eventId, {
                        offset : [6, '50%'],
                        last
                    });
                },

                isHovering(el) {
                    const
                        gripper = el.querySelector('.b-gripper'),
                        ret     = [];

                    if (gripper?.ownerDocument.defaultView.getComputedStyle(gripper).display === 'none') {
                        ret.push('hidden');
                    }

                    if (el.classList.contains('b-hover-top')) {
                        ret.push('top');
                    }

                    if (el.classList.contains('b-hover-right')) {
                        ret.push('right');
                    }

                    if (el.classList.contains('b-hover-bottom')) {
                        ret.push('bottom');
                    }

                    if (el.classList.contains('b-hover-left')) {
                        ret.push('left');
                    }

                    if (el.classList.contains('b-hover-edge')) {
                        ret.push('edge');
                    }

                    return ret.join('-');
                },

                moveCursorBy(dx, dy) {
                    return this.action({ moveCursorBy : [dx, dy] });
                },

                moveCursorTo(to, options) {
                    return this.action(Object.assign({ moveCursorTo : to }, options));
                },

                async touchDragBy(el, dx, dy) {
                    await t.delayedTouchDragBy(el, [dx, dy]);

                    await t.waitFor(() => this.eventStore.modified.items.size > 0);
                },

                async waitForAnimationFrame() {
                    return this.action({
                        waitForAnimationFrame : null
                    });
                },

                async waitForSelector(selector, options) {
                    const elements = await this.waitForSelectorAll(selector, options);

                    t.isStrict(elements.length, 1, `Selector "${selector}" matches exactly 1 element`);
                    return elements[0];
                },

                async waitForSelectorAll(selector, options) {
                    if (typeof options === 'string') {
                        options = {
                            desc : options
                        };
                    }

                    return await this.action(Object.assign({ waitForSelector : selector }, options));
                }
            };

            Object.defineProperty(harness, 'WEEK_PX_PER_DAY', {
                get : () => harness.calendar.activeView.dayContainerElement.firstChild.offsetWidth
            });

            return harness;
        }
    },

    methods : {}
});
