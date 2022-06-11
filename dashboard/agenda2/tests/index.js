/* global bowser */

const
    Project                 = new Siesta.Project.Browser(),
    { isPR, isTC, isTrial } = BryntumTestHelper;

Project.configure({
    title                   : 'Bryntum Calendar Test Suite',
    isReadyTimeout          : 20000, // longer for memory profiling which slows things down
    testClass               : BryntumCalendarTest,
    runCore                 : 'sequential',
    disableCaching          : false,
    autoCheckGlobals        : false,
    keepResults             : false,
    enableCodeCoverage      : Boolean(window.IstanbulCollector),
    failOnResourceLoadError : true,
    forceDOMVisible         : isTC && bowser.safari,
    turboMode               : true,
    ignoreTimeouts          : [
        'scrollToVisibleStartTime',
        'syncCurrentTimeIndicator',
        'b-no-transitions'
    ],
    recorderConfig : {
        recordOffsets    : false,
        ignoreCssClasses : [
            'b-active',
            'b-icon',
            'b-hover',
            'b-hover-anim',
            'b-dirty',
            'b-focused',
            'b-contains-focus'
        ],
        shouldIgnoreDomElementId : id => /^b-/.test(id)
    }
});

const
    getItems                = mode => {
        const
            examples   = [
                {
                    pageUrl : '../examples/basic?test',
                    url     : './examples/basic.t.js'
                },
                {
                    pageUrl : '../examples/bigdataset?test',
                    url     : './examples/bigdataset.t.js'
                },
                {
                    // Omit the ?test query because we test the hints in this example test.
                    pageUrl : '../examples/calendar-scheduler?test',
                    url     : './examples/calendar-scheduler.t.js'
                },
                {
                    pageUrl     : '../examples/calendar-taskboard',
                    keepPageUrl : true,
                    includeFor  : 'module'
                },
                {
                    pageUrl : '../examples/confirmation-dialogs',
                    url     : './examples/confirmation-dialogs.t.js'
                },
                {
                    pageUrl : '../examples/custom-menus?develop',
                    url     : './examples/custom-menus.t.js'
                },
                {
                    // Omit the ?develop query because we test the hints in this example test.
                    title   : 'Custom Rendering default theme',
                    pageUrl : '../examples/custom-rendering',
                    url     : './examples/customrendering.t.js'
                },
                {
                    // Omit the ?test query because we test the hints in this example test.
                    // But we are testing that the hints show up in the dark theme.
                    // url query param needed to make the URL unique.
                    title   : 'Custom Rendering Dark theme',
                    pageUrl : '../examples/custom-rendering?theme=dark',
                    url     : './examples/customrendering.t.js?dark-theme'
                },
                'dragfromgrid',
                {
                    pageUrl     : '../examples/esmodule',
                    keepPageUrl : true,
                    includeFor  : 'module'
                },
                {
                    pageUrl : '../examples/eventedit?test',
                    url     : './examples/eventedit.t.js'
                },
                {
                    pageUrl     : '../examples/exporttoics?test',
                    url         : './examples/exporttoics.t.js',
                    keepPageUrl : true
                },
                {
                    pageUrl : '../examples/filtering?test',
                    url     : './examples/filtering.t.js'
                },
                'fit-hours',
                {
                    pageUrl : '../examples/listview?test',
                    url     : './examples/listview.t.js'
                },
                {
                    pageUrl : '../examples/localization?test',
                    url     : './examples/localization.t.js'
                },
                {
                    pageUrl : '../examples/multiassign?test',
                    url     : './examples/multiassign.t.js'
                },
                'print',
                'recurrence',
                {
                    pageUrl : '../examples/resourceview?develop',
                    url     : './examples/resourceview.t.js'
                },
                // 'salesforce', We don't test it
                {
                    pageUrl     : '../examples/scripttag',
                    keepPageUrl : true
                },
                {
                    pageUrl : '../examples/sidebar-customization?test',
                    url     : './examples/sidebarcustomization.t.js'
                },
                {
                    pageUrl : '../examples/tooltips?test',
                    url     : './examples/tooltips.t.js'
                },
                {
                    pageUrl : '../examples/undoredo?test',
                    url     : './examples/undoredo.t.js'
                },
                {
                    pageUrl : '../examples/visible-hours?test',
                    url     : './examples/visiblehours.t.js'
                },
                {
                    pageUrl     : '../examples/webcomponents?test',
                    url         : './examples/webcomponents.t.js',
                    keepPageUrl : true,
                    includeFor  : isTrial ? 'module' : 'es6'
                }
            ],

            frameworks = [
                'angular/angular-7',
                {
                    pageUrl : 'angular/drag-from-grid',
                    url     : 'angular/angular-drag-from-grid.t.js'
                },
                'angular/filtering',
                {
                    pageUrl : 'angular/inline-data',
                    url     : 'angular/angular-inline-data.t.js'
                },
                'ionic/ionic-4',
                {
                    pageUrl : 'react/javascript/inline-data',
                    url     : 'react/react-inline-data.t.js'
                },
                'react/javascript/filtering',
                'react/javascript/visible-hours',
                {
                    pageUrl : 'react/typescript/basic',
                    url     : 'react/react-typescript-basic.t.js'
                },
                'vue/javascript/filtering',
                'vue-3/javascript/basic',
                {
                    pageUrl : 'vue-3/javascript/inline-data',
                    url     : 'vue-3/vue-3-inline-data.t.js'
                },
                {
                    pageUrl : 'webpack',
                    url     : 'webpack.t.js'
                }
            ],

            items      = [
                {
                    group   : 'Combination',
                    // Dont pull in any classes from sources or bundles
                    preload : [
                        '../build/thin/core.stockholm.thin.css',
                        '../build/thin/grid.stockholm.thin.css',
                        '../build/thin/scheduler.stockholm.thin.css',
                        '../build/thin/calendar.stockholm.thin.css'
                    ],
                    includeFor : 'module',
                    items      : [
                        {
                            url     : 'combination/Scheduler.t.js',
                            keepUrl : true,
                            preload : preloads
                        },
                        {
                            url         : 'combination/thin-all.t.js',
                            keepUrl     : true,
                            alsoPreload : [
                                '../build/thin/schedulerpro.stockholm.thin.css',
                                '../build/thin/gantt.stockholm.thin.css',
                                '../build/thin/calendar.stockholm.thin.css',
                                '../build/thin/taskboard.stockholm.thin.css'
                            ]
                        },
                        {
                            url         : 'combination/thin-calendar-gantt.t.js',
                            keepUrl     : true,
                            alsoPreload : [
                                '../build/thin/gantt.stockholm.thin.css'
                            ]
                        },
                        {
                            url     : 'combination/thin-calendar-grid.t.js',
                            keepUrl : true

                        },
                        {
                            url     : 'combination/thin-calendar-scheduler.t.js',
                            keepUrl : true

                        },
                        {
                            url         : 'combination/thin-calendar-schedulerpro.t.js',
                            keepUrl     : true,
                            alsoPreload : [
                                '../build/thin/schedulerpro.stockholm.thin.css'
                            ]
                        },
                        {
                            url         : 'combination/thin-calendar-taskboard.t.js',
                            keepUrl     : true,
                            alsoPreload : [
                                '../build/thin/taskboard.stockholm.thin.css'
                            ]
                        }
                    ]
                },
                {
                    group                  : 'Docs',
                    pageUrl                : '../docs/',
                    includeFor             : isTrial ? 'module' : 'es6',
                    keepPageUrl            : true,
                    subTestTimeout         : 120000,
                    defaultTimeout         : 240000,
                    waitForTimeout         : 10000,
                    disableNoTimeoutsCheck : true,
                    alsoPreload            : bowser.firefox && preloadNoResizeObserver,
                    viewportHeight         : 500,
                    viewportWidth          : 1500,
                    items                  : [
                        {
                            url            : 'docs/open-all-links.t.js',
                            subTestTimeout : 360000,
                            ignoreTopics   : [
                                'demos',
                                'engineDocs'
                            ],
                            ignoreClasses : [
                                'guides/data/displayingdata.md',
                                'guides/data/treedata.md'
                            ],
                            docsTitle              : 'Bryntum Calendar',
                            disableNoTimeoutsCheck : true
                        },
                        {
                            url                    : 'docs/verify-links-in-guides.t.js',
                            subTestTimeout         : 240000,
                            disableNoTimeoutsCheck : true,
                            ignoreLinks            : [
                                'Core/guides/advanced/widgets.md#foo'
                            ]
                        },
                        
                    ]
                },
                {
                    group     : 'layout',
                    collapsed : true,
                    items     : [
                        'layout/day/FluidDayLayout.t.js'
                    ]
                },
                {
                    group     : 'util',
                    collapsed : true,
                    items     : [
                        'util/DayTime.t.js'
                    ]
                },
                {
                    group     : 'widget',
                    collapsed : true,
                    items     : [
                        'widget/AgendaView.t.js',
                        'widget/CalendarRow.t.js',
                        'widget/DayView-dayShift.t.js',
                        'widget/DayView.t.js',
                        'widget/EventList.t.js',
                        'widget/MonthView.t.js',
                        'widget/ResourceView.t.js',
                        'widget/Sidebar.t.js',
                        'widget/WeekView.t.js',
                        'widget/YearView.t.js'
                    ]
                },
                {
                    group : 'view',
                    items : [
                        {
                            alsoPreload : preloadLocales,
                            url         : 'view/Calendar.t.js'
                        },
                        {
                            alsoPreload : preloadLocales,
                            url         : 'view/Calendar1.t.js'
                        },
                        'view/CalendarAllDay.t.js',
                        'view/CalendarConfig.t.js',
                        'view/CalendarData.t.js',
                        'view/CalendarFiltering.t.js',
                        'view/CalendarProject.t.js',
                        'view/CalendarRecurrence.t.js',
                        'view/CalendarRendering.t.js',
                        'view/CalendarResourceView.t.js',
                        'view/CalendarSelection.t.js',
                        'view/Rendering.t.js',
                        'view/Scrolling.t.js'
                    ]
                },
                {
                    group : 'features',
                    items : [
                        'features/AutoCreate.t.js',
                        'features/CalendarDragCreateDay.t.js',
                        'features/CalendarDragCreateMonth.t.js',
                        'features/CalendarDragCreateWeek.t.js',
                        'features/CalendarDragCreateYear.t.js',
                        'features/CalendarDragMoveDay.t.js',
                        'features/CalendarDragMoveMonth.t.js',
                        'features/CalendarDragMoveWeek.t.js',
                        'features/CalendarDragMoveYear.t.js',
                        'features/CalendarDragResizeDay.t.js',
                        'features/CalendarDragResizeMonth.t.js',
                        'features/CalendarDragResizeWeek.t.js',
                        'features/CalendarDragResizeYear.t.js',
                        'features/CalendarPrint.t.js',
                        'features/ContextMenus.t.js',
                        'features/EventEdit.t.js',
                        'features/EventTooltip.t.js',
                        'features/ExternalEventSource.t.js',
                        'features/LoadOnDemand.t.js',
                        'features/Recurrence.t.js',
                        'features/UndoRedo.t.js',
                        'features/WeekExpander.t.js'
                    ]
                },
                {
                    group : 'XSS',
                    items : [
                        'xss/CalendarXSS.t.js'
                    ]
                },
                
                {
                    group       : 'Localization',
                    alsoPreload : preloadLocales,
                    items       : [
                        {
                            alsoPreload : {
                                default : [{
                                    type         : 'js',
                                    isEcmaModule : true,
                                    content      : [
                                        'import "../lib/Calendar/localization/En.js";',
                                        'import "../lib/Calendar/localization/Nl.js";',
                                        'import "../lib/Calendar/localization/Ru.js";',
                                        'import "../lib/Calendar/localization/SvSE.js";'
                                    ].join('\n')
                                }
                                ]
                            },
                            includeFor : 'es6',
                            url        : 'localization/Sanity.t.js'
                        },
                        'localization/Localization.t.js',
                        'localization/features/EventEdit.t.js',
                        'localization/AgendaEventList.t.js',
                        
                    ]
                },
                
                {
                    group : 'Examples',
                    // Filter out examples used for monkey tests only
                    items : examples.filter(example => example?.pageUrl != null && example?.url != null)
                },
                {
                    group          : 'Examples browser',
                    subTestTimeout : 120000,
                    defaultTimeout : 120000,
                    waitForTimeout : 60000,
                    items          : [
                        {
                            pageUrl            : '../examples/?theme=material&test',
                            url                : 'examples/browser/examplebrowser.t.js',
                            enablePageRedirect : true,
                            exampleName        : 'recurrence',
                            exampleTitle       : 'Recurring Events',
                            offlineExampleName : 'frameworks-vue-3-javascript-basic',
                            jumpSectionName    : 'Customization',
                            jumpExampleName    : 'customized-resourcefilter',
                            filterText         : 'events',
                            filterCount        : 4
                        },
                        {
                            pageUrl : '../examples/?online&test',
                            url     : 'examples/browser/examplebrowser-links.t.js',
                            isPR,
                            isTrial,
                            config  : {
                                skipSanityChecks : true
                            },
                            productName     : 'Calendar',
                            skipHeaderCheck : [
                                'esmodule',
                                'scripttag'
                            ],
                            skipTrialCheck : [
                                'extjsmodern'
                            ],
                            skipTestSizeCheck : [
                                'megadataset'
                            ],
                            enablePageRedirect : true,
                            defaultTimeout     : 480000,
                            skip               : {
                                // Demo browser opens module demos even if opened as umd when not run on an ancient
                                // browser (which we do not support), so no point in running this test for umd
                                umd : true
                            },
                            disableNoTimeoutsCheck : true
                        }
                    ]
                },
                {
                    group : 'Monkey Tests for Examples',
                    items : BryntumTestHelper.prepareMonkeyTests({
                        items  : examples,
                        mode,
                        config : {
                            webComponent   : 'bryntum-calendar',
                            waitSelector   : '.b-calendar-cell',
                            targetSelector : '.b-calendar'
                        }
                    })
                },
                {
                    group : 'Smart Monkey Tests for Examples',
                    items : BryntumTestHelper.prepareMonkeyTests({
                        items        : examples.concat([{ pageUrl : '../examples' }]),
                        mode,
                        smartMonkeys : true,
                        config       : {
                            webComponent   : 'bryntum-calendar',
                            waitSelector   : '.b-calendar-cell',
                            targetSelector : '.b-calendar'
                        }
                    })
                },
                {
                    group      : 'Frameworks examples (npm build)',
                    includeFor : 'umd',
                    skip       : !(isTrial && bowser.chrome),
                    items      : [
                        'examples/frameworks-build.t.js'
                    ]
                },
                {
                    group          : 'Frameworks',
                    consoleFail    : ['error', 'warn'],
                    includeFor     : isTrial ? 'umd' : 'es6',
                    config         : { skipSanityChecks : true },
                    subTestTimeout : 120000,
                    defaultTimeout : 120000,
                    skip           : isTC && !isTrial,
                    items          : [
                        {
                            group : 'Frameworks examples',
                            items : BryntumTestHelper.prepareFrameworkTests(frameworks)
                        },
                        {
                            group : 'Monkey tests for Frameworks examples',
                            items : BryntumTestHelper.prepareFrameworkMonkeyTests({
                                items  : frameworks,
                                config : {
                                    waitSelector   : '.b-calendar-cell',
                                    targetSelector : '.b-calendar'
                                }
                            })
                        },
                        {
                            group : 'Smart Monkey tests for Frameworks examples',
                            items : BryntumTestHelper.prepareFrameworkMonkeyTests({
                                items        : frameworks,
                                smartMonkeys : true,
                                config       : {
                                    waitSelector   : '.b-calendar-cell',
                                    targetSelector : '.b-calendar'
                                }
                            })
                        }
                    ]
                }
            ];

        return BryntumTestHelper.prepareItems(items, mode);
    },
    // Preloads for tests. Usage example: alsoPreload : [preloadName]
    preloadFont             = {
        // want size to be as equal as possible on different platforms
        type    : 'css',
        content : 'body, button { font-family: Arial, Helvetica, sans-serif;  font-size: 14px; }'
    },
    preloadNoResizeObserver = {
        type    : 'js',
        content : 'window.ResizeObserver = false; window.onerror = function(err) { return /ResizeObserver/.test(err);};'
    },
    preloadTurbo            = {
        // To allow classes to have different config values in test execution
        type    : 'js',
        content : 'window.__applyTestConfigs = ' + String(Project.turboMode) + ';'
    },
    preloadCss              = '../build/calendar.material.css',
    preloadLocales          = {
        umd : [
            '../examples/_shared/locales/examples.locale.En.umd.js',
            '../examples/_shared/locales/examples.locale.Nl.umd.js',
            '../examples/_shared/locales/examples.locale.Ru.umd.js',
            '../examples/_shared/locales/examples.locale.SvSE.umd.js',
            '../examples/localization/locales/custom.locale.De.umd.js'
        ],
        default : [{
            type         : 'js',
            isEcmaModule : true,
            content      : [
                'import En from "../lib/Calendar/localization/En.js";',
                'import Nl from "../lib/Calendar/localization/Nl.js";',
                'import Ru from "../lib/Calendar/localization/Ru.js";',
                'import SvSE from "../lib/Calendar/localization/SvSE.js";',
                'import "../examples/_shared/locales/examples.locale.En.js";',
                'import "../examples/_shared/locales/examples.locale.Nl.js";',
                'import "../examples/_shared/locales/examples.locale.Ru.js";',
                'import "../examples/_shared/locales/examples.locale.SvSE.js";',
                'import "../examples/localization/locales/custom.locale.De.js";',
                'if (!window.bryntum.locales) window.bryntum.locales = {};',
                'window.bryntum.locales.En = En;',
                'window.bryntum.locales.Nl = Nl;',
                'window.bryntum.locales.Ru = Ru;',
                'window.bryntum.locales.SvSE = SvSE;'
            ].join('')
        }]
    },
    preloads                = [
        preloadCss,
        preloadFont,
        preloadTurbo
    ],
    groups                  = [];



groups.push({
    group   : 'Using module bundle',
    preload : preloads.concat({
        type         : 'js',
        isEcmaModule : true,
        content      : `
            import * as Module from "../build/calendar.module.js";
            Object.assign(window, Module);
        `
    }),
    isEcmaModule : true,
    mode         : 'module',
    items        : getItems('module')
});

groups.push({
    group        : 'Using umd bundle',
    preload      : preloads.concat(isTrial ? '../build/calendar.umd.js' : '../build/calendar.umd.min.js'),
    isEcmaModule : false,
    mode         : 'umd',
    items        : getItems('umd')

});

groups.forEach(group => group.product = 'calendar');

Project.start(groups);
