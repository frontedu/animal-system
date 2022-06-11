Class('BryntumSchedulerTest', {
    // eslint-disable-next-line no-undef
    isa : BryntumGridTest, // Have to do `chmod a+r tests/lib/BryntumGridTest.js` after build (644 access rights)

    override : {
        mimicFocusOnMouseDown(el, mouseDownEvent) {
            // Allow mousedown on label to run its course
            if (el.tagName !== 'LABEL') {
                this.SUPER(el, mouseDownEvent);
            }
        }
    },

    methods : {
        query(selector, root) {
            selector = selector.trim();

            selector = selector.replace(/\$event=(([^\s.])*)/, '.b-sch-event-wrap[data-event-id="$1"]');

            return this.SUPERARG([selector, root]);
        },

        // Never start an action is animations or scrolling is ongoing
        waitForAnimations(callback = () => {}) {
            return this.SUPER(() => {
                if (this.global.bryntum && this.global.bryntum.testProject) {
                    return this.waitForProjectReady(this.global.bryntum.testProject, callback);
                }
                else {
                    callback();
                }
            });
        },

        getTimeAxis(TimeAxis, PresetManager, presetName, cfg) {
            const Date = this.global.Date;

            return new TimeAxis(this.global.Object.assign({
                startDate    : new Date(2010, 1, 1),
                endDate      : new Date(2010, 1, 11),
                weekStartDay : 1,
                viewPreset   : presetName
            }, cfg));
        },

        getAssignmentStore(config, nbrAssignments = 5) {
            const AssignmentStore = this.global.AssignmentStore;

            return new AssignmentStore(this.global.Object.assign({

                data : (() => {
                    const records = [];
                    for (let i = 1; i <= nbrAssignments; i++) {
                        records.push({
                            id         : 'a' + i, // no-sanity
                            eventId    : i,
                            resourceId : 'r' + i
                        });
                    }

                    return records;
                })()
            }, config || {}));
        },

        getEventStore(config = {}, nbrEvents = 5, storeClass = this.global.EventStore) {
            const { Date, Object } = this.global;

            return new storeClass(Object.assign({
                data : (() => {
                    const events = [];
                    for (let i = 1; i <= nbrEvents; i++) {
                        events.push({
                            id         : i,
                            cls        : 'event' + i,
                            resourceId : 'r' + i,
                            name       : 'Assignment ' + i,
                            startDate  : new Date(2011, 0, 3 + i),
                            endDate    : new Date(2011, 0, 5 + i)
                        });
                    }

                    return events;
                })()
            }, config || {}));
        },

        getResourceStore(config) {
            const ResourceStore = this.global.ResourceStore;

            config = config || {};

            return new ResourceStore(this.global.Object.assign({
                data : [
                    { id : 'r1', name : 'Mike' }, // no-sanity
                    { id : 'r2', name : 'Linda' }, // no-sanity
                    { id : 'r3', name : 'Don' }, // no-sanity
                    { id : 'r4', name : 'Karen' }, // no-sanity
                    { id : 'r5', name : 'Doug' }, // no-sanity
                    { id : 'r6', name : 'Peter' } // no-sanity
                ]
            }, config));
        },

        getResourceStore2(config, nbrResources) {
            const ResourceStore = this.global.ResourceStore;

            return new ResourceStore(this.global.Object.assign({
                data : (() => {
                    const resources = [];
                    for (let i = 1; i <= nbrResources; i++) {
                        resources.push({
                            id   : 'r' + i, // no-sanity
                            name : 'Resource ' + i
                        });
                    }

                    return resources;
                })()
            }, config));
        },

        getResourceTreeStore(config) {
            const ResourceStore = this.global.ResourceStore;

            config = config || {};

            return new ResourceStore(this.global.Object.assign({
                tree : true,
                data : [
                    {
                        id : 'r1', // no-sanity

                        name     : 'Kastrup Airport',
                        expanded : true,

                        children : [
                            {
                                id       : 'r2', // no-sanity
                                name     : 'Terminal A',
                                expanded : false,

                                children : [
                                    {
                                        id       : 'r3', // no-sanity
                                        name     : 'Gates 1 - 5',
                                        expanded : true,

                                        children : [
                                            {
                                                id   : 'r4', // no-sanity
                                                name : 'Gate 1'
                                            },
                                            {
                                                id   : 'r5', // no-sanity
                                                name : 'Gate 2'
                                            },
                                            {
                                                id   : 'r6', // no-sanity
                                                name : 'Gate 3'
                                            },
                                            {
                                                id   : 'r7', // no-sanity
                                                name : 'Gate 4'
                                            },
                                            {
                                                id   : 'r8', // no-sanity
                                                name : 'Gate 5'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                id   : 'r42222', // no-sanity
                                name : 'Gate 1214312421'
                            }
                        ]
                    }
                    // eof Kastrup
                ]

                // eof data

            }, config));
        },

        getDependencyStore(config, nbrEvents) {
            const DependencyStore = this.global.DependencyStore;

            if (nbrEvents === undefined) {
                nbrEvents = 5;
            }

            return new DependencyStore(this.global.Object.assign({

                data : (() => {
                    const dependencies = [];
                    for (let i = 1; i <= nbrEvents - 1; i++) {
                        dependencies.push({
                            id   : i,
                            from : i,
                            to   : i + 1
                        });
                    }
                    return dependencies;
                })()

            }, config || {}));
        },

        async getSchedulerAsync(config, nbrEvents) {
            const scheduler = this.getScheduler(config, nbrEvents);

            await this.waitForProjectReady(scheduler);

            return scheduler;
        },

        getScheduler(config, nbrEvents) {
            const
                { Date, Scheduler, Object } = this.global;

            config = config || {};

            if (!config.features) {
                config.features = {
                    eventEdit          : false, // some tests not written to have event editor or context menu
                    eventMenu          : false,
                    cellMenu           : false,
                    headerMenu         : false,
                    timeAxisHeaderMenu : false
                };
            }

            // Secret flag to easily get a scheduler tree
            //if (config.__tree) {
            //    return this.getSchedulerTree(config, nbrEvents);
            //}

            if (config.dependencyStore === true) {
                config.dependencyStore = this.getDependencyStore({}, nbrEvents);
            }

            if ((config.dependencyStore || config.dependencies) && !config.features.dependencies) {
                config.features.dependencies = true;
            }

            if (!('startDate' in config)) {
                config.startDate = new Date(2011, 0, 3);
                config.endDate = new Date(2011, 0, 13);
            }

            if (!config.events && !config.eventStore && !config.crudManager && !config.project) {
                config.eventStore = this.getEventStore({}, nbrEvents);
            }

            if (!config.resources && !config.resourceStore && !config.crudManager && !config.project) {
                config.resourceStore = this.getResourceStore();
            }

            if (!config.appendTo) {
                config.appendTo = this.global.document.body;
            }

            const scheduler = new Scheduler(Object.assign({
                viewPreset : 'dayAndWeek',
                rowHeight  : 45,
                // Setup static columns
                columns    : [
                    { text : 'Name', sortable : true, width : 100, field : 'name', locked : true }
                ],

                destroyStores : true,

                useInitialAnimation : false

            }, config));

            if (scheduler.isVisible && config.sanityCheck !== false) {
                this.checkGridSanity(scheduler);
            }

            return scheduler;
        },

        getVerticalScheduler(config) {
            const { Date, Object, document } = this.global;

            if (!config) {
                config = {};
            }

            return new this.global.Scheduler(Object.assign({
                appendTo : document.body,

                mode : 'vertical',

                startDate : new Date(2019, 5, 1),
                endDate   : new Date(2019, 6, 1),

                useInitialAnimation   : false,
                enableEventAnimations : false,

                barMargin : 0,

                subGridConfigs : {
                    locked : {
                        // Grid region splitter width has increased. Setting subgrid with 2px smaller.
                        width : 98
                    }
                },

                events : [
                    { id : 1, name : 'Event 1', resourceId : 'r1', startDate : new Date(2019, 4, 28), duration : 2 },
                    { id : 2, name : 'Event 2', resourceId : 'r1', startDate : new Date(2019, 4, 29), duration : 4 },
                    { id : 3, name : 'Event 3', resourceId : 'r2', startDate : new Date(2019, 5, 1), duration : 4 },
                    { id : 4, name : 'Event 4', resourceId : 'r3', startDate : new Date(2019, 5, 5), duration : 5 },
                    { id : 5, name : 'Event 5', resourceId : 'r4', startDate : new Date(2019, 5, 8), duration : 2 },
                    { id : 6, name : 'Event 6', resourceId : 'r1', startDate : new Date(2019, 5, 20), duration : 2 },
                    { id : 7, name : 'Event 7', resourceId : 'r1', startDate : new Date(2019, 5, 25), duration : 2 },
                    { id : 8, name : 'Event 8', resourceId : 'r9', startDate : new Date(2019, 5, 25), duration : 2 },
                    // Initially outside of timeaxis
                    {
                        id         : 1000,
                        name       : 'Event 1000',
                        resourceId : 'r1',
                        startDate  : new Date(2019, 4, 10),
                        duration   : 2
                    },
                    {
                        id         : 1001,
                        name       : 'Event 1001',
                        resourceId : 'r1',
                        startDate  : new Date(2019, 6, 20),
                        duration   : 2
                    }
                ],

                resources : [
                    { id : 'r1', name : 'Resource 1', location : 'Location 1' }, // no-sanity
                    { id : 'r2', name : 'Resource 2', location : 'Location 2' }, // no-sanity
                    { id : 'r3', name : 'Resource 3', location : 'Location 1' }, // no-sanity
                    { id : 'r4', name : 'Resource 4', location : 'Location 2' }, // no-sanity
                    { id : 'r5', name : 'Resource 5', location : 'Location 1' }, // no-sanity
                    { id : 'r6', name : 'Resource 6', location : 'Location 2' }, // no-sanity
                    { id : 'r7', name : 'Resource 7', location : 'Location 1' }, // no-sanity
                    { id : 'r8', name : 'Resource 8' }, // no-sanity
                    { id : 'r9', name : 'Resource 9', location : 'Location 1' } // no-sanity
                ],

                resourceTimeRanges : [
                    {
                        id         : 1,
                        name       : 'Resource range 1',
                        resourceId : 'r3',
                        startDate  : new Date(2019, 4, 28),
                        duration   : 10
                    }
                ],

                timeRanges : [
                    { id : 1, name : 'Range 1', startDate : new Date(2019, 4, 29), duration : 4 },
                    { id : 2, name : 'Line 2', startDate : new Date(2019, 5, 6) }
                ]
            }, config));
        },

        async getVerticalSchedulerAsync(config) {
            const scheduler = this.getVerticalScheduler(config);

            await this.waitForProjectReady(scheduler);

            return scheduler;
        },

        getVerticalSchedulerMulti(config) {
            if (!config) {
                config = {};
            }

            return this.getVerticalScheduler(this.global.Object.assign({
                events : [
                    { id : 1, name : 'Event 1', startDate : new this.global.Date(2019, 4, 28), duration : 2 },
                    { id : 2, name : 'Event 2', startDate : new this.global.Date(2019, 4, 29), duration : 4 },
                    { id : 3, name : 'Event 3', startDate : new this.global.Date(2019, 5, 1), duration : 4 },
                    { id : 4, name : 'Event 4', startDate : new this.global.Date(2019, 5, 5), duration : 5 },
                    { id : 5, name : 'Event 5', startDate : new this.global.Date(2019, 5, 8), duration : 2 },
                    { id : 6, name : 'Event 6', startDate : new this.global.Date(2019, 5, 20), duration : 2 },
                    { id : 7, name : 'Event 7', startDate : new this.global.Date(2019, 5, 25), duration : 2 },
                    { id : 8, name : 'Event 8', startDate : new this.global.Date(2019, 5, 25), duration : 2 }
                ],

                assignments : [
                    { id : 'a1', resourceId : 'r1', eventId : 1 }, // no-sanity
                    { id : 'a2', resourceId : 'r1', eventId : 2 }, // no-sanity
                    { id : 'a3', resourceId : 'r1', eventId : 3 }, // no-sanity
                    { id : 'a4', resourceId : 'r1', eventId : 4 }, // no-sanity
                    { id : 'a5', resourceId : 'r2', eventId : 1 }, // no-sanity
                    { id : 'a6', resourceId : 'r2', eventId : 2 }, // no-sanity
                    { id : 'a7', resourceId : 'r3', eventId : 4 }, // no-sanity
                    { id : 'a8', resourceId : 'r3', eventId : 5 }, // no-sanity
                    { id : 'a9', resourceId : 'r3', eventId : 6 }, // no-sanity
                    { id : 'a10', resourceId : 'r4', eventId : 1 }, // no-sanity
                    { id : 'a11', resourceId : 'r5', eventId : 7 }, // no-sanity
                    { id : 'a12', resourceId : 'r6', eventId : 8 }, // no-sanity
                    { id : 'a13', resourceId : 'r7', eventId : 7 }, // no-sanity
                    { id : 'a14', resourceId : 'r8', eventId : 8 }, // no-sanity
                    { id : 'a15', resourceId : 'r9', eventId : 1 } // no-sanity
                ]
            }, config));
        },

        async getVerticalSchedulerMultiAsync(config) {
            const scheduler = await this.getVerticalSchedulerMulti(config);

            await this.waitForProjectReady(scheduler);

            return scheduler;
        },

        snapShotListeners(observable, name) {
            this._observableData = this._observableData || {};
            this._observableData[name] = {};

            // if (!name) throw 'Must provide a name for the observable';

            Object.keys(observable.eventListeners).forEach(key => {
                this._observableData[name][key] = observable.eventListeners[key].slice();
            });
        },

        verifyListeners(observable, name, allowedObservers) {
            const needListeners = this._observableData[name];

            let count = 0;

            const logListener = listener => {
                const result = Object.assign({}, listener);
                result.thisObj = result.thisObj?.constructor.name || undefined;
                return result;
            };

            allowedObservers = allowedObservers || [];

            Object.keys(observable.eventListeners).forEach(key => {
                if (!needListeners[key]) {
                    observable.eventListeners[key].forEach(listener => {
                        if (!allowedObservers.includes(listener.thisObj)) {
                            count++;
                            this.is(logListener(listener), null, `Extra ${key} event listener found`);
                        }
                    });
                }
                else {
                    observable.eventListeners[key].forEach(listener => {
                        if (!needListeners[key].includes(listener) && !allowedObservers.includes(listener.thisObj)) {
                            count++;
                            this.is(logListener(listener), null, `Extra ${key} event listener found`);
                        }
                    });

                    needListeners[key].forEach(listener => {
                        if (observable.eventListeners[key].indexOf(listener) === -1) {
                            this.is(null, logListener(listener), `${key} event listener is missing`);
                        }
                    });
                }
            });

            this.is(count, 0, 'No extra listeners found');
        },

        getHeaderAndBodyScrollValues(scheduler) {
            const
                bodyScroll   = scheduler.timeAxisSubGrid.scrollable.x,
                headerScroll = scheduler.timeAxisSubGrid.header.scrollable.x;

            return {
                header : headerScroll,
                body   : bodyScroll
            };
        },

        waitForHeaderAndBodyScrollSynced(scheduler, next) {
            this.waitFor(() => {
                const values = this.getHeaderAndBodyScrollValues(scheduler);

                return values.header === values.body;
            }, next);
        },

        waitForEventsToRender(next) {
            return this.waitForSelector('.b-sch-event', next);
        },

        // Can be called in chain `{ waitForDependencies : null }` or awaited `await t.waitForDependencies()`
        waitForDependencies(next) {
            if (next) {
                return this.waitForSelector('.b-sch-dependency', next);
            }
            else {
                return new Promise(resolve => {
                    this.waitForSelector('.b-sch-dependency', resolve);
                });
            }
        },

        async waitForProjectReady(project, next) {
            if (!project) {
                project = this.global.bryntum.testProject;
            }
            if (project.project) project = project.project;

            // No replica in scheduler_core
            await this.waitFor({
                // description       : 'Waiting for project to be ready',
                suppressAssertion : true,
                method            : () => project.replica
                    ? !project.replica.dirty && !project.replica.isCommitting && !project.replica.hasPendingAutoCommit() && !project.isDelayingCalculation
                    : !project.hasPendingAutoCommit && !project.isPerformingCommit && project.isInitialCommitPerformed
            });

            next && next();
        },

        assertHeaderAndBodyAreScrollSynced(scheduler) {
            const values = this.getHeaderAndBodyScrollValues(scheduler);

            this.is(values.header, values.body, 'Header and body scroll is synced');
        },

        assertDependency(scheduler, dependency, { fromSide, toSide, fromBox, toBox } = {}, msg = 'Assert dependency') {
            const getPointFromBox = (record, side, box) => {
                    const
                        adjustTop           = 0,
                        [el]                = scheduler.getElementsFromEventRecord(record),
                        // taken from SchedulerRegions#adjustItemBox
                        viewStartDate       = scheduler.startDate,
                        viewEndDate         = scheduler.endDate,
                        OUTSIDE_VIEW_OFFSET = 40;

                    let point,
                        adjustLeft  = 0,
                        adjustRight = 0;

                    if (box) {
                        if (record.startDate > viewEndDate) {
                            box.left = box.left + OUTSIDE_VIEW_OFFSET;
                        }
                        else if (record.endDate < viewStartDate) {
                            box.left = box.left - OUTSIDE_VIEW_OFFSET;
                        }
                        box.right = box.left + box.width;
                    }
                    else {
                        box = el.getBoundingClientRect();
                    }

                    if (record.milestone) {
                        if (!el.classList.contains('b-sch-event-withicon')) {
                            adjustLeft = -1 * (adjustRight = box.height / 2);
                        }
                        else {
                            box = el.querySelector('*').getBoundingClientRect();
                        }
                    }

                    switch (side) {
                        case 'top'    :
                            point = [box.left + box.width / 2, box.top];
                            break;
                        case 'bottom' :
                            point = [box.left + box.width / 2, box.bottom];
                            break;
                        case 'left'   :
                            point = [box.left + adjustLeft, box.top + box.height / 2 - adjustTop];
                            break;
                        case 'right'  :
                            point = [box.right + adjustRight, box.top + box.height / 2];
                            break;
                        case 'top-left' :
                            point = [box.left + adjustLeft, box.top];
                            break;
                    }

                    return point;
                },
                getFromSide     = dependency => {
                    return dependency.fromSide || (dependency.type < 2 ? 'left' : 'right');
                },
                getToSide       = dependency => {
                    let result;

                    if (dependency.toSide) {
                        result = dependency.toSide;
                    }
                    else {
                        result = dependency.type % 2 ? 'right' : 'left';
                    }

                    return result;
                },
                from            = dependency.fromEvent,
                to              = dependency.toEvent;

            if (from && to) {
                const
                    dependencyEl     = scheduler.features.dependencies.getElementsForDependency(dependency)[0],
                    fromPoint        = getPointFromBox(from, fromSide || getFromSide(dependency), fromBox),
                    toPoint          = getPointFromBox(to, toSide || getToSide(dependency), toBox),
                    svgBox           = dependencyEl.ownerSVGElement.getBoundingClientRect(),
                    dependencyPoints = dependencyEl.getAttribute('points').split(' '),
                    depStartPoint    = dependencyPoints[0].split(',').map(item => parseInt(item)),
                    depEndPoint      = dependencyPoints[dependencyPoints.length - 1].split(',').map(item => parseInt(item)),
                    depFromPoint     = [depStartPoint[0] + svgBox.left, depStartPoint[1] + svgBox.top],
                    depToPoint       = [depEndPoint[0] + svgBox.left, depEndPoint[1] + svgBox.top],
                    gap              = 2;

                this.isApproxPx(depFromPoint[0], fromPoint[0], gap, `${msg}: Start point X is correct (${from.name})`);
                this.isApproxPx(depFromPoint[1], fromPoint[1], gap, `${msg}: Start point Y is correct (${from.name})`);

                this.isApproxPx(depToPoint[0], toPoint[0], gap, `${msg}: End point X is correct (${to.name})`);
                this.isApproxPx(depToPoint[1], toPoint[1], gap, `${msg}: End point Y is correct (${to.name})`);
            }
        },

        assertHorizontalBreakOnRowBorder(client, { dependencyId, assignmentData, rowId, expectedPoints = 6 }) {
            const
                dependency = client.dependencyStore.getById(dependencyId),
                depElement = client.getElementsForDependency(dependency, assignmentData)[0],
                path       = depElement.getAttribute('points'),
                rowBox     = client.getRecordCoords(rowId, true),
                rowBottom  = rowBox.top + rowBox.height;

            if (expectedPoints >= 4) {
                const [point1, point2] = path.split(' ').slice(expectedPoints / 2 - 1, expectedPoints / 2 + 1);

                this.ok(
                    (rowBottom === point1.split(',')[1] - 0) && (rowBottom === point2.split(',')[1] - 0),
                    `Dependency ${dependency.id} is aligned with row boundary`
                );
            }

            this.is(path.split(' ').length, expectedPoints, `Points amount is correct for dependency ${dependency.id}`);
        },

        // Utility method to create steps to show contextmenu and click item.
        eventContextMenuSteps(testScheduler, event, ...menuText) {
            if (!(event instanceof testScheduler.eventStore.modelClass)) {
                event = testScheduler.eventStore.getById(event);
            }

            const steps = [
                next => {
                    testScheduler.scrollEventIntoView(event).then(next);
                },
                {
                    rightclick : testScheduler.getElementFromEventRecord(event)
                }
            ];

            for (let i = 0; i < menuText.length - 1; i++) {
                steps.push({
                    moveMouseTo : `.b-menuitem:contains(${menuText[i]})`
                });
            }
            steps.push({
                click : `.b-menuitem:contains(${menuText[menuText.length - 1]})`
            });

            return steps;
        },

        /**
         * Asserts that given events are aligned to the assigned resource row elements vertically
         * @param scheduler
         * @param events
         * @returns {boolean}
         */
        assertEventsPositions(scheduler, events = []) {
            const
                rectangle                  = this.global.Rectangle,
                { timeAxisSubGridElement } = scheduler;

            let pass = true;

            events.forEach(event => {
                if (scheduler.timeAxis.isTimeSpanInAxis(event)) {
                    const
                        expectedStartX = scheduler.getCoordinateFromDate(event.startDate),
                        expectedEndX   = event.isMilestone ? expectedStartX : scheduler.getCoordinateFromDate(event.endDate) - 1;

                    event.resources.forEach(resource => {
                        const
                            eventEl     = scheduler.getElementFromEventRecord(event, resource),
                            resourceRow = scheduler.getRowFor(resource),
                            resourceEl  = resourceRow && resourceRow.elements.normal,
                            eventBox    = rectangle.from(eventEl, timeAxisSubGridElement),
                            resourceBox = rectangle.from(resourceEl, timeAxisSubGridElement),
                            eventStartX = eventBox.x + (event.isMilestone ? eventBox.width / 2 : 0),
                            eventEndX   = eventBox.right - (event.isMilestone ? eventBox.width / 2 : 0);

                        if (resourceBox.intersect(eventBox).height !== eventBox.height) {
                            this.fail(`Event ${event.id} is not aligned to its resource ${event.resourceId}`, {
                                got      : eventBox,
                                need     : resourceBox,
                                gotDesc  : 'Event rectangle',
                                needDesc : 'Resource rectangle'
                            });

                            pass = false;
                        }

                        if (Math.abs(eventStartX - expectedStartX) > 1) {
                            this.fail(`Event ${event.id} is not aligned to its start date`, {
                                got      : eventStartX,
                                need     : expectedStartX,
                                gotDesc  : 'Got x',
                                needDesc : 'Need x'
                            });

                            pass = false;
                        }

                        if (Math.abs(eventEndX - expectedEndX) > 1) {
                            this.fail(`Event ${event.id} is not aligned to its end date`, {
                                got      : eventEndX,
                                need     : expectedEndX,
                                gotDesc  : 'Got right',
                                needDesc : 'Need right'
                            });

                            pass = false;
                        }
                    });
                }
                else {
                    this.pass(`Event ${event.id} is outside of the current time axis`);
                }
            });

            if (pass) {
                this.pass('Events are positioned correctly');
            }

            return pass;
        },

        //region Export

        generateSingleRowHeightDataSet(resourcesCount, startDate, endDate) {
            const
                dateHelper        = this.global.DateHelper,
                resources         = this.global.DataGenerator.generateData(resourcesCount),
                randomGenerator   = new this.global.RandomGenerator(),
                events            = [],
                dependencies      = [],
                rangeCenter       = dateHelper.add(startDate, Math.floor(dateHelper.getDurationInUnit(startDate, endDate, 'd') / 2), 'd'),
                ranges            = [
                    [null, startDate],
                    [dateHelper.add(startDate, 1, 'd'), rangeCenter],
                    [rangeCenter, endDate],
                    [endDate, null]
                ],
                createRandomEvent = (rangeStart, rangeEnd) => {
                    if (!rangeStart) {
                        rangeStart = dateHelper.add(rangeEnd, -2, 'w');
                    }
                    else if (!rangeEnd) {
                        rangeEnd = dateHelper.add(rangeStart, 2, 'w');
                    }

                    const
                        rangeInDays = dateHelper.getDurationInUnit(rangeStart, rangeEnd, 'd'),
                        startDay    = randomGenerator.nextRandom(rangeInDays - 1),
                        duration    = randomGenerator.nextRandom(rangeInDays - startDay),
                        startDate   = dateHelper.add(rangeStart, startDay, 'd'),
                        endDate     = dateHelper.add(startDate, duration, 'd');

                    return {
                        startDate,
                        endDate
                    };
                };

            resources.forEach(resource => {
                for (let i = 0; i < 4; i++) {
                    events.push(
                        Object.assign({
                            id         : `${resource.id}-${i}`,
                            resourceId : resource.id,
                            name       : `Assignment ${i + 1}`
                        }, createRandomEvent(...ranges[i]))
                    );
                }
            });

            events.forEach(record => {
                const
                    // Don't target dependencies to milestones, see issue #21
                    target      = randomGenerator.fromArray(events.filter(r => r.id !== record.id && r.endDate - r.startDate !== 0)),
                    fromOutside = !dateHelper.intersectSpans(record.startDate, record.endDate, startDate, endDate),
                    toOutside   = !dateHelper.intersectSpans(target.startDate, target.endDate, startDate, endDate);

                dependencies.push({
                    id   : `${record.id}-${target.id}`,
                    from : record.id,
                    to   : target.id,
                    type : randomGenerator.nextRandom(3),
                    toOutside,
                    fromOutside
                });
            });

            return { resources, events, dependencies };
        },

        async createSchedulerForExport({
            verticalPages = 1,
            horizontalPages = 1,
            rowHeight = 50,
            rowsPerPage = 10,
            startDate = new this.global.Date(2019, 10, 4),
            endDate = new this.global.Date(2019, 10, 18),
            height = 450,
            width = 600,
            featuresConfig = {},
            config = {}
        } = {}) {
            const
                timelineWeight        = 0.75,
                paperHeight           = this.global.PaperFormat.A4.height * 96,
                paperWidth            = this.global.PaperFormat.A4.width * 96,
                viewPreset            = 'weekAndDayLetter',
                presetInstance        = this.global.PresetManager.getPreset(viewPreset),
                ticksAmount           = this.global.DateHelper.getDurationInUnit(startDate, endDate, 'd'),
                timelineMinWidth      = ticksAmount * presetInstance.tickWidth,
                proposedScheduleWidth = Math.max(horizontalPages * paperWidth * timelineWeight, timelineMinWidth),
                proposedTickWidth     = Math.floor(proposedScheduleWidth / ticksAmount),
                normalRegionWidth     = proposedTickWidth * ticksAmount,
                lockedRegionWidth     = horizontalPages * paperWidth - normalRegionWidth - 5, // 5 - splitter width
                columnsNumber         = 4,
                columnWidth           = Math.floor(lockedRegionWidth / columnsNumber),
                // Make header and footer to take as much space to leave only ROWSPERPAGE rows on each page
                headerHeight          = Math.floor((paperHeight - rowHeight * rowsPerPage) / 2);

            const columns = [
                { type : 'rownumber', id : 'rownumber', width : columnWidth, minWidth : columnWidth }, // no-sanity
                {
                    id       : 'name', // no-sanity
                    field    : 'name',
                    width    : columnWidth,
                    minWidth : columnWidth,
                    headerRenderer({ headerElement }) {
                        headerElement.style.height = `${rowHeight - 1}px`;
                        return 'Name';
                    }
                },
                {
                    text     : 'First name',
                    id       : 'firstName', // no-sanity
                    field    : 'firstName',
                    width    : columnWidth,
                    minWidth : columnWidth
                },
                {
                    text     : 'Surname',
                    id       : 'surName', // no-sanity
                    field    : 'surName',
                    width    : columnWidth,
                    minWidth : columnWidth
                }
            ];

            const { resources, events, dependencies } = this.generateSingleRowHeightDataSet(verticalPages * rowsPerPage - 1, startDate, endDate);

            const features = Object.assign({
                pdfExport : {
                    exportServer : '/export',
                    headerTpl    : ({ currentPage }) => `<div style="height:${headerHeight}px;background-color: grey">
                    ${currentPage != null ? `Page ${currentPage}` : 'HEAD'}</div>`,
                    footerTpl : () => `<div style="height:${headerHeight}px;background-color: grey">FOOT</div><style>.b-horizontaltimeaxis .b-sch-header-row { flex:1; }</style>`
                }
            }, featuresConfig);

            const scheduler = new this.global.Scheduler(Object.assign({
                appendTo       : this.global.document.body,
                subGridConfigs : {
                    locked : {
                        width : Math.min(300, columnWidth * columnsNumber) - 2 // -2 because grid region splitter width change
                    }
                },
                weekStartDay : 1,
                rowHeight    : rowHeight - 1,
                viewPreset   : {
                    base      : viewPreset,
                    tickWidth : proposedTickWidth
                },
                startDate,
                endDate,
                width,
                height,
                columns,
                features,
                resources,
                events,
                dependencies
            }, config));

            await this.waitForProjectReady(scheduler);

            if ((resources.length + 1) * rowHeight > height) {
                const
                    { locked }    = scheduler.subGrids,
                    splitterWidth = locked.splitterElement.offsetWidth;

                await this.waitFor(() => {
                    return scheduler.timeAxisViewModel.availableSpace === scheduler.width - locked.width - splitterWidth - this.global.DomHelper.scrollBarWidth;
                });
            }

            return { scheduler, headerHeight, rowHeight, rowsPerPage, paperHeight, paperWidth };
        },

        getFirstLastVisibleTicks(doc, headerEl) {
            headerEl = headerEl || doc.querySelector('.b-sch-header-row.b-lowest ');

            const
                rectangle     = this.global.Rectangle,
                exportBodyEl  = doc.querySelector('.b-export-body'),
                exportBodyBox = rectangle.from(exportBodyEl),
                timeAxisEl    = doc.querySelector('.b-grid-header-scroller-normal'),
                // header element might be moved outside of export body box with margin
                // and we only need left/right coordinates
                tmpBox        = rectangle.from(timeAxisEl),
                headerBox     = new rectangle(tmpBox.x, exportBodyBox.y, tmpBox.width, tmpBox.height).intersect(exportBodyBox),
                ticks         = Array.from(headerEl.querySelectorAll('.b-sch-header-timeaxis-cell'));

            let firstTick, lastTick;

            // Sort elements by tick index
            ticks.sort((el1, el2) => {
                const index1 = parseInt(el1.dataset.tickIndex);
                const index2 = parseInt(el2.dataset.tickIndex);

                return index1 - index2;
            });

            // Find first/last ticks visible by finding ticks which intersect left and right edges of header
            ticks.forEach((tickEl, index) => {
                const tickBox = rectangle.from(tickEl);

                if (!firstTick) {
                    if (Math.round(tickBox.left) <= Math.round(headerBox.left) && Math.round(tickBox.right) > Math.round(headerBox.left)) {
                        firstTick = tickEl;
                    }
                }

                if (!lastTick) {
                    if (tickBox.left < headerBox.right && Math.round(tickBox.right) >= Math.round(headerBox.right) - (index === ticks.length - 1 ? 1 : 0)) {
                        lastTick = tickEl;
                    }
                }
            });

            return { firstTick, lastTick };
        },

        // In order to work this requires `window.DEBUG = true;` to be set in the `StartTest` method
        getDateRangeFromExportedPage(doc, visible = false) {
            const
                rectangle       = this.global.Rectangle,
                exportBodyEl    = doc.querySelector('.b-export-body'),
                exportBodyBox   = rectangle.from(exportBodyEl),
                headerEl        = doc.querySelector('.b-sch-timeaxiscolumn'),
                schedulerHeader = doc.querySelector('.b-schedulerheader'),
                // header element might be moved outside of export body box with margin
                // and we only need left/right coordinates
                tmpBox          = rectangle.from(visible ? schedulerHeader : headerEl),
                headerBox       = new rectangle(tmpBox.x, exportBodyBox.y, tmpBox.width, tmpBox.height).intersect(exportBodyBox),
                bottomHeaderEl  = doc.querySelector('.b-sch-header-row.b-lowest '),
                ticks           = Array.from(bottomHeaderEl.querySelectorAll('.b-sch-header-timeaxis-cell'));

            let firstTick, lastTick;

            // Sort elements by tick index
            ticks.sort((el1, el2) => {
                const index1 = parseInt(el1.dataset.tickIndex);
                const index2 = parseInt(el2.dataset.tickIndex);

                return index1 - index2;
            });

            ticks.forEach((tickEl, index) => {
                const tickBox = rectangle.from(tickEl);

                if (!firstTick && tickBox.right >= headerBox.left) {
                    firstTick = tickEl;
                }

                if (!lastTick) {
                    if (index === ticks.length - 1 || tickBox.right > headerBox.right) {
                        lastTick = tickEl;
                    }
                }
            });

            const
                startDate = new this.global.Date(parseInt(firstTick.dataset.date)),
                endDate   = new this.global.Date(parseInt(lastTick.dataset.date));

            return { startDate, endDate };
        },

        assertTicksExportedWithoutGaps(doc) {
            const
                rectangle  = this.global.Rectangle,
                headerRows = Array.from(doc.querySelectorAll('.b-sch-header-row')),
                headerEls  = Array.from(doc.querySelectorAll('.b-sch-header-row'));

            let pass = true;

            headerRows.forEach(headerRow => {
                const
                    position = headerRow.dataset.headerPosition,
                    tickEls  = Array.from(headerRow.querySelectorAll('.b-sch-header-timeaxis-cell'));

                let prevRight, prevTickIndex;

                // Sort elements by tick index
                tickEls.sort((el1, el2) => {
                    const index1 = parseInt(el1.dataset.tickIndex);
                    const index2 = parseInt(el2.dataset.tickIndex);

                    if (index1 < index2) {
                        return -1;
                    }
                    else if (index1 === index2) {
                        return 0;
                    }
                    else {
                        return 1;
                    }
                });

                tickEls.forEach((tickEl, index) => {
                    const
                        elBox     = rectangle.from(tickEl),
                        tickIndex = parseInt(tickEl.dataset.tickIndex);

                    if (index === 0) {
                        prevRight = elBox.right;
                        prevTickIndex = tickIndex;
                    }
                    else {
                        if (Math.abs(tickEl.left - prevRight) > 1) {
                            this.fail(`Tick ${index} in header ${position} is not aligned with previous one`, {
                                got  : elBox.left,
                                need : prevRight
                            });

                            pass = false;
                        }

                        if (tickIndex !== prevTickIndex + 1) {
                            this.fail(`Unexpected tick index in header ${position}, got ${tickIndex} need ${prevTickIndex + 1}`);
                            pass = false;
                        }

                        prevRight = tickEl.left;
                        prevTickIndex = tickIndex;
                    }
                });
            });

            headerEls.forEach(headerEl => {
                const
                    position                = headerEl.dataset.headerPosition,
                    { firstTick, lastTick } = this.getFirstLastVisibleTicks(doc, headerEl);

                if (!firstTick) {
                    this.fail(`Time axis cell element wasn't found at the beginning of header ${position}`);
                    pass = false;
                }

                if (!lastTick) {
                    this.fail(`Time axis cell element wasn't found at the end of header ${position}`);
                    pass = false;
                }
            });

            return pass;
        },

        isExportedTickCount(doc, count) {
            this.is(doc.querySelectorAll('.b-lowest .b-sch-header-timeaxis-cell').length, count, 'Ticks count is ok');
        },

        assertExportedEventsList(doc, events = []) {
            const
                rectangle     = this.global.Rectangle,
                exportBodyEl  = doc.querySelector('.b-export-body'),
                exportBodyBox = rectangle.from(exportBodyEl);

            let pass = true;

            events.forEach(event => {
                const eventElement = doc.querySelector(`[data-event-id="${event.id}"]:not(.b-released)`);

                if (!eventElement) {
                    this.fail(`Element is not found for event ${event.id}`);
                    pass = false;
                }
                else {
                    const eventBox = rectangle.from(eventElement);

                    if (!eventBox.intersect(exportBodyBox)) {
                        this.fail(`Event ${event.id} is not visible in the current view`, {
                            got      : eventBox,
                            need     : exportBodyBox,
                            gotDesc  : 'Event rectangle',
                            needDesc : 'Body rectangle'
                        });
                        pass = false;
                    }

                    const
                        resourceEl  = doc.querySelector(`.b-timeline-subgrid .b-grid-row[data-id="${event.resourceId}"]`),
                        resourceBox = rectangle.from(resourceEl);

                    if (resourceBox.intersect(eventBox).height !== eventBox.height) {
                        this.fail(`Event ${event.id} is not aligned to its resource ${event.resourceId}`, {
                            got      : eventBox,
                            need     : resourceBox,
                            gotDesc  : 'Event rectangle',
                            needDesc : 'Resource rectangle'
                        });
                    }
                }
            });

            return pass;
        },

        assertExportedEventDependenciesList(doc, dependencies = []) {
            let pass = true;

            const
                getPointFromBox          = (el, side) => {
                    const
                        adjustLeft  = 0,
                        adjustRight = 0,
                        box         = el.getBoundingClientRect();

                    let fromPoint;

                    switch (side) {
                        case 'top'    :
                            fromPoint = [box.left + box.width / 2, box.top];
                            break;
                        case 'bottom' :
                            fromPoint = [box.left + box.width / 2, box.bottom];
                            break;
                        case 'left'   :
                            fromPoint = [box.left - adjustLeft, box.top + box.height / 2];
                            break;
                        case 'right'  :
                            fromPoint = [box.right + adjustRight, box.top + box.height / 2];
                            break;
                    }

                    return fromPoint;
                },
                getFromSide              = dependency => dependency.fromSide || (dependency.type < 2 ? 'left' : 'right'),
                getToSide                = dependency => dependency.toSide || (dependency.type % 2 ? 'right' : 'left'),
                getDependencyCoordinates = (dependency, dependencyEl, fromEl, toEl, scale) => {
                    const
                        svgBox           = dependencyEl.ownerSVGElement.getBoundingClientRect(),
                        dependencyPoints = dependencyEl.getAttribute('points').split(' '),
                        depStartPoint    = dependencyPoints[0].split(',').map(item => parseInt(item)),
                        depEndPoint      = dependencyPoints[dependencyPoints.length - 1].split(',').map(item => parseInt(item)),
                        depFromPoint     = [depStartPoint[0] * scale + svgBox.left, depStartPoint[1] * scale + svgBox.top],
                        depToPoint       = [depEndPoint[0] * scale + svgBox.left, depEndPoint[1] * scale + svgBox.top],
                        fromPoint        = fromEl && getPointFromBox(fromEl, getFromSide(dependency), fromEl.classList.contains('b-milestone-wrap')),
                        toPoint          = toEl && getPointFromBox(toEl, getToSide(dependency), toEl.classList.contains('b-milestone-wrap'));

                    return { depFromPoint, depToPoint, fromPoint, toPoint };
                },
                getScale                 = el => el.getBoundingClientRect().width / el.offsetWidth;

            dependencies.forEach(dep => {
                // Firefox is case sensitive, has to be `depid` not `depId`
                const depElement = doc.querySelector(`[depid="${dep.id}"]`);

                if (!depElement) {
                    this.fail(`Element is not found for dependency ${dep.id}`);
                    pass = false;
                }
                else {
                    const
                        sourceEl = doc.querySelector(`[data-event-id="${dep.from}"]:not(.b-released)`),
                        targetEl = doc.querySelector(`[data-event-id="${dep.to}"]:not(.b-released)`),
                        scale    = getScale(sourceEl || targetEl);

                    const { depFromPoint, depToPoint, fromPoint, toPoint } = getDependencyCoordinates(dep, depElement, sourceEl, targetEl, scale);

                    if (fromPoint) {
                        if (Math.abs(depFromPoint[0] - fromPoint[0]) > 1) {
                            this.fail(`Dependency ${dep.id} start point x is ok`, {
                                got  : depFromPoint[0],
                                need : fromPoint[0]
                            });
                            pass = false;
                        }

                        if (Math.abs(depFromPoint[1] - fromPoint[1]) > 1) {
                            this.fail(`Dependency ${dep.id} start point y is ok`, {
                                got  : depFromPoint[1],
                                need : fromPoint[1]
                            });
                            pass = false;
                        }
                    }

                    if (toPoint) {
                        if (Math.abs(depToPoint[0] - toPoint[0]) > 1) {
                            this.fail(`Dependency ${dep.id} end point x is ok`, {
                                got  : depToPoint[0],
                                need : toPoint[0]
                            });
                            pass = false;
                        }

                        if (Math.abs(depToPoint[1] - toPoint[1]) > 1) {
                            this.fail(`Dependency ${dep.id} end point y is ok`, {
                                got  : depToPoint[1],
                                need : toPoint[1]
                            });
                            pass = false;
                        }
                    }
                }
            });

            return pass;
        }
        //endregion
    }
});

// Override so that when we run grid tests over here in Scheduler, we run them on an instance of Scheduler
const getScheduler = BryntumSchedulerTest.prototype.getScheduler;
BryntumSchedulerTest.prototype._getGrid = BryntumGridTest.prototype.getGrid;
BryntumSchedulerTest.prototype.getGrid = function(cfg) {
    if (!cfg.appendTo) {
        cfg.appendTo = this.scopeProvider.iframe.contentDocument.body;
    }
    return getScheduler.call(this, cfg);
};
