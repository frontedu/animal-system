# 5.0.5 - 2022-05-30

## FEATURES / ENHANCEMENTS

* New Angular demo that shows how to drag events from an unplanned event grid to calendar (Partial fix of #4587)

## BUG FIXES

* Fixed #4350 - Fixed various panel and calendar sidebar collapse issues
* Fixed #4607 - [VUE] Incorrect prop types in Vue wrapper

# 5.0.4 - 2022-05-11

## BUG FIXES

* Fixed #4499 - Resource avatars demo not showing any event bars
* Fixed #4529 - Sync is triggered when Scheduler is used as Calendar mode, after double clicking to create new event
* Fixed #4544 - Calendar fires an `eventundefined` event upon key down
* Fixed #4548 - Not possible to hide delete button on the event editor
* Fixed #4562 - [REACT] React wrappers have incorrect source mapping urls

# 5.0.3 - 2022-04-26

## FEATURES / ENHANCEMENTS

* [WRAPPERS] `ProjectModel` wrapper component reference can now be used as `project` parameter for Bryntum Calendar
  wrapper component in Angular applications (Fixed #4238)
* [WRAPPERS] Calendar has a new `ProjectModel` framework wrapper available for React and Angular. It simplifies
  sharing data between multiple Bryntum components (Fixed #4382)
* [ANGULAR] New demo showing use of inline data and `ProjectModel` wrapper. Demo located in
  `examples/frameworks/angular/inline-data` folder
* [REACT] New demo showing use of inline data and `ProjectModel` wrapper. Demo located in
  `examples/frameworks/react/javascript/inline-data` folder
* [VUE-3] New demo showing use of inline data for `Calendar` wrapper. Demo located in
  `examples/frameworks/vue-3/javascript/inline-data` folder

## API CHANGES

* The `validateResponse` flag on `CrudManager` has been changed to default to `true`. When enabled, it validates
  `CrudManager` responses from the backend and outputs a message on console if the format isn't valid. This is helpful
  during the development phase, but can be turned off in production
* New Vue 2/3 wrapper config option `relayStoreEvents` (defaults to `false`). When set to `true`, the events fired by
  stores are relayed to the Bryntum Grid instance
* [REACT] New basic React demo with TypeScript. Demo located in `examples/frameworks/react/typescript/basic` folder
* [REACT] React wrappers now include TypeScript definitions (Fixed #3378)

## BUG FIXES

* Fixed #4127 - [LWC] `DomHelper.isInView()` throws
* Fixed #4222 - [LWC] Performance degradation in 5.0 release
* Fixed #4316 - `DatePicker`'s `events : 'count'` option should sync with the current filtered state of the `eventStore`
* Fixed #4432 - [LWC] Mouse events do not work
* Fixed #4461 - [Vue] wrapper triggers doubled `dataChange` events with different params

# 5.0.2 - 2022-04-13

## FEATURES / ENHANCEMENTS

* A new example (`megadataset`) has been added showcasing rapid view generation upon navigation through 100,000 event
  records
* `ResourceFilter` in `Sidebar` should be configurable with custom selection (Fixed #2006)
* `AgendaView`'s time rendering is now configurable with an `eventTimeRenderer` config (Fixed #4437)

## BUG FIXES

* Fixed #3469 - `loadOnDemand` causes fetch loop when involving Scheduler
* Fixed #4279 - Calendar Resource Filter works incorrectly after one of resources removed
* Fixed #4303 - `MonthView` `autoRowHeight -> false` can result in incorrect `eventsPerCell` count
* Fixed #4307 - Order of data setting must be enforced when data set through `setConfig`
* Fixed #4315 - `MonthView` doesn't refresh on prev/next click is it contains a cell for the new date
* Fixed #4323 - Calendar features should tolerate being invoked upon non-Calendar views
* Fixed #4331 - Resource view items can sometimes disappear when filtering by resource
* Fixed #4353 - Resource avatar hidden while dragging
* Fixed #4406 - Fixed items in disabled `fieldset`/`radiogroup` not being disabled
* Fixed #4451 - Removing a resource causes crash in agenda mode

# 5.0.1 - 2022-03-04

## FEATURES / ENHANCEMENTS

* The `Calendar` `modeDefaults` config is now dynamic. Mutations applied to any of its properties made will immediately
  be applied to all child views. (Fixed #4268)
* Add default "Duplicate Event" context menu item (Fixed #4271)

## BUG FIXES

* Fixed #4186 - Wrong docs in Angular integration guide
* Fixed #4212 - Error thrown when event is updated in a non-painted scheduler (re-fix)
* Fixed #4261 - Crash after changing start date of a recurring event in `calendar-scheduler` demo
* Fixed #4284 - Drag external event to certain resource

# 5.0.0 - 2022-02-21

* We are thrilled to announce version 5.0 of our Calendar product. This release marks a big milestone for us, after more
  than a year of development. In this version we have greatly simplified how to combine Bryntum products, and we have
  made a new combination demo with the TaskBoard to show you how. The release also includes lots of improvements to the 
  other demos as well as bug fixes and enhancements requested by our community. A big thanks to our customers who 
  helped us with testing our alpha & beta versions.

* You are most welcome to join us on March 16th, at 9am PST (6pm CET) for a 5.0 walkthrough webinar, demonstrating all
  the shiny new features
  [Click here to register](https://us06web.zoom.us/webinar/register/5116438317103/WN_4MkExpZPQsGYNpzh1mR_Ag)

* We hope you will enjoy this release and we are looking forward to hearing your feedback of what you would like us to
  develop next

*/ Mats Bryntse, CEO @Bryntum

## FEATURES / ENHANCEMENTS

* New TaskBoard + Calendar integration demo
* The `EventList` calendar view which displays a grid-based view of the `EventStore` now *merges* any
  configured `columns` with its default `columns` by matching the `field` property. On display in the
  `listview` demo (Fixed #3500)
* Each product has a new "thin" JavaScript bundle. The thin bundle only contains product specific code, letting you
  combine multiple Bryntum products without downloading the shared code multiple times (previously only possible with
  custom-built bundles from sources). Find out more in the What's new guide (Fixed #2805)
* Each theme is now available in a version that only has product specific CSS in it, called a `thin` version. These
  files are name `[product].[theme].thin.css` - `calendar.stockholm.thin.css` for example. They are intended for using
  when you have multiple different bryntum products on the same page, to avoid including shared CSS multiple times
  Read more about it in the `What's new` section in docs (Fixed #3276)
* `Model` has a new `readOnly` field that is respected by UI level editing features to disallow editing records having
  `readOnly : true`. It does not directly affect the datalayer, meaning that you can still programmatically edit the
  records (Fixed #665)
* New `ProjectModel` setters/getters for `assignments`, `dependencies`, `events`, `resources` (Fixed #4043)
* `window` references are replaced with `globalThis` which is supported in all modern browsers and across different JS
  environments (Fixed #4071)
* A new function called `downloadTestCase()` was added to Bryntum widgets, it is intended to simplify creating test
  cases for reporting issues on Bryntum's support forum. Running it collects the current value for the configs your app
  is using, inlines the current dataset and compiles that into a JavaScript app that is then downloaded. The app will
  most likely require a fair amount of manual tweaking to reproduce the issue, but we are hoping it will simplify the
  process for you. Run `calender.downloadTestCase()` on the console in a demo to try it
* Updated FontAwesome Free to version 6, which includes some new icons sponsored by Bryntum in the charts category:
  https://fontawesome.com/search?m=free&c=charts-diagrams&s=solid

## API CHANGES

* [BREAKING] React wrappers now use the more modern module bundle by default, instead of the legacy umd bundle. Hence
  application imports must be changed to match. This will slightly improve application size and performance
  (Fixed #2787)

## BUG FIXES

* Fixed #3140 - Possibility calendar entries side by side (when there is enough space)
* Fixed #4223 - ResourceView example. `minWidth` setting not applied to filtered out views
* Fixed #4231 - Fix day view sort by duration for interday events

# 4.3.9 - 2022-02-17

## FEATURES / ENHANCEMENTS

* `Calendar` now supports `minDate` and `maxDate`, meaning that temporal navigation may never place the start date of
  any view before the `minDate`, and never place the end date of any view after the `maxDate`
* Views (and therefore an owning `Calendar`) now fire a preventable `beforeDateChange` event before temporal navigation
  so that date changes may be vetoed by application logic (Fixed #4057)

## BUG FIXES

* Fixed #4125 - A tooltip and event editor shows different `endDate` for same event
* Fixed #4160 - Sort day/week view events that start before midnight as starting at midnight for each intersecting day
* Fixed #4173 - `ResourceView` does not handle multi assignment
* Fixed #4175 - Double border on far right side of resource view
* Fixed #4196 - Calendar Create event when Wednesday is a `nonWorkingDay` and `hideNonWorkingDays` is true
* Fixed #4197 - Crash when configuring resource filter with selectAllItem
* Fixed #4204 - `AgendaView` `dateRangeChange` event doesn't fire when `CrudManager` is `autoLoad : false`
* Fixed #4217 - Calendar "select all Items" is not working if inline data used

# 4.3.8 - 2022-02-07

## FEATURES / ENHANCEMENTS

* Short events get CSS class `b-short-event` added for special rendition. (Fixed #4106)

## BUG FIXES

* Fixed #4099 - `Tooltip` doesn't handle reshowing on delegate change consistently
* Fixed #4103 - `weekStartDay` is ignored when using Next/Previous week button in toolbar
* Fixed #4111 - Drag from external event source doesn't work on touch devices
* Fixed #4112 - Timeaxis in resource view is missing after resourceStore sort
* Fixed #4114 - ResourceView child `allDayEvents` rows don't sync height on filter in/out

# 4.3.7 - 2022-02-02

## BUG FIXES

* Fixed #2850 - `weekStart` not honored by date picker nor `AgendaView`
* Fixed #4005 - `eventColor` for resource and event not applied on Month and Agenda views
* Fixed #4010 - Menu icon in Agenda view is not round
* Fixed #4011 - All day text in Agenda view is not localized
* Fixed #4015 - Setting Calendar `readOnly` makes filter field in sidebar also `readOnly`
* Fixed #4020 - Document event mouse events
* Fixed #4024 - `calculatePropagateEndDate` needs to be passed more context and be public
* Fixed #4063 - `MonthView` `autoRowHeight` causes recursive `loadOnDemand` reloading
* Fixed #4065 - `CalendarRow`. When `autoHeight`, data changes do not sync scrollbar presence
* Fixed #4069 - Document schedule mouse events and the `eventAutoCreated` event
* Fixed #4088 - `EventTooltip`'s `activeClient` can be set before it gets shown
* Fixed #4089 - Click on an event bar in "other month" cell should not navigate to that month

# 4.3.6 - 2022-01-13

## FEATURES / ENHANCEMENTS

* `DayView` and `WeekView` have a new config, `coreHours` which specifies the core working hours to show. (Fixed #3964)

## BUG FIXES

* Fixed #3489 - Calendar styling issues
* Fixed #3942 - WeekView elements misaligned when day shifted and week crosses DST change boundary
* Fixed #3971 - MonthView dayCellRenderer result not used as HTML
* Fixed #3973 - Clicking overflow button and OverflowPopup on an "other month" cell changes month
* Fixed #3990 - Chrome & Content Security Policy causes failure because of debug code section

# 4.3.5 - 2021-12-24

## FEATURES / ENHANCEMENTS

* Views which show OverflowPopups now allow the `overflowPopup` to be reconfigured to show customized content, to be
  configured with an `eventRenderer` of the same type as their owning view, or to be configured away entirely
  (Fixed #3860)

## BUG FIXES

* Fixed #3846 - Fix drag/drop issues in `DayView` when `showAllDayHeader=false`
* Fixed #3885 - DayView needs a `dayCellRenderer` config
* Fixed #3892 - DayView does not lay out day-spanning events correctly when `showAllDayHeader` is false
* Fixed #3893 - Resource view filtering should refresh child views
* Fixed #3896 - [TypeScript] Wrong typings of model class configs
* Fixed #3905 - AgendaView doesn't remove cells when a day becomes empty due to event deletion/filtering
* Fixed #3907 - [TypeScript] Cannot pass Scheduler instance to `Store.relayAll`
* Fixed #3914 - Bug when EventEdit from EventTooltip used in DayView with `showAllDayHeader: false`
* Fixed #3915 - MonthView layout overlays events when events span multiple weeks
* Fixed #3920 - Listeners for eventTooltip not applying if config notation used
* Fixed #3922 - `hideNonWorkingDays` in yearView generates an error if configured initially
* Fixed #3924 - CalendarRow doesn't support `overflowClickAction`
* Fixed #3928 - DateHelper `k` format behaves incorrectly
* Fixed #3929 - YearView's overflow popup doesn't show event continuation arrows
* Fixed #3934 - Added `dayHeaderRenderer` to DayView to allow custom cay cell header in `allDayEvents`

# 4.3.4 - 2021-12-13

## FEATURES / ENHANCEMENTS

* Calendar's `DayView` (and, by extension, `WeekView`) now offers the `showAllDayHeader` config. This is
  `true` by default. Configure this as `false` to *not* show all day and inter-day events spanning days in
  *header cells*, but to arrange them in the day detail part of the view, wrapping into as many columns as necessary
  (Fixed #3771)
* Updated `filtering` Angular demo to use Angular 13 (Fixed #3742)
* Added a config to hide eventTooltip header. Use `header : false` (Fixed #3828)
* Added a new config to the `ResourceView`. `stableResourceOrder` is `true` by default and means that the resource child
  views will always be in the same order as the resources in the `resourceStore`. If set to
  `false`, newly added (or filtered in) child views will be appended to the combined view
* Calendar now supports the `overlaySidebar` config which means that the sidebar is collapsed and the collapse tool in
  the top toolbar toggles the sidebar between the collapsed state and an overlayed _revealed_ state. On small UIs such
  as phones, this mode is enabled by default
* Added a new config for `DayCellRenderer` widgets (`MonthView` and `CalendarRow`)
  `overflowButtonRenderer` which allows apps to customize the appearance of the "+n more" button
  (Fixed #3867)

## BUG FIXES

* Fixed #3551 - Localize listRangeMenu in Agenda section
* Fixed #3621 - [TypeScript] Improve typings of mixins
* Fixed #3664 - Correct date in calendar title when switching modes in a `ResourceView`
* Fixed #3769 - `ResourceView` child views should be in the same order as the `ResourceStore`
* Fixed #3850 - [TypeScript] Missing static properties in typings

# 4.3.3 - 2021-11-30

## FEATURES / ENHANCEMENTS

* Calendar modes now support a `syncViewDate` config. It is `true` by default. This means that a Calendar's modes have
  their date automatically synced with the Calendar's date. This may be set to `false` to opt out
* The `MonthView` now has an `autoRowHeight` config which means that week rows assume the height of the events they
  contain. The `minRowHeight` config controls how small week rows may shrink and may be specified in any CSS units, but
  also *in events*. So if you use `autoRowHeight`, you can specify `minRowHeight : '3ev'` which means empty weeks may
  shrink to the height equivalent to showing three event bars.

## BUG FIXES

* Fixed #3505 - Bryntum Calendar Agenda View Decade Button not working
* Fixed #3629 - Some views may not be tied to the Calendar's date. `EventList` may not be required to "snap"
* Fixed #3648 - [DOCS] Content navigation is broken
* Fixed #3672 - `ResourceView` gets its `start`/`end` date wrong
* Fixed #3696 - `MonthView` `WeekExpander` feature flips all other rows back to be flexed when expanding a row
* Fixed #3697 - `MonthView`'s `shrinkwrapWeekRow` (`WeekExpander` feature) is static. Week does not expand if events are
  added
* Fixed #3743 - [DOCS] `web.config` file for Windows IIS server

# 4.3.2 - 2021-10-29

## FEATURES / ENHANCEMENTS

* `DayView` now supports the `fitHours` config which sizes the hour cell heights to fit exactly within available height

## BUG FIXES

* Fixed #2397 - Events are re-rendered during drag and now include a footer with event end time
* Fixed #2640 - Events can be dragged into and out of the `allDay` zone on the day and week views
* Fixed #3585 - When using a `dayStartTime` in `DayView`, `CalendarDrag` gets the drop time wrong
* Fixed #3586 - Fixed event drag (move) in an expanded week of a month view when using `weekExpander` feature
* Fixed #3633 - `EventTooltip` feature needs to document it's currently active event record

# 4.3.1 - 2021-10-21

## FEATURES / ENHANCEMENTS

* YearView now supports `dayCellRenderer` to add custom styling to its day cells, see updated `custom-rendering` demo
  (Fixed #2485)
* Bumped builtin Font Awesome Free to version 5.15.4

## BUG FIXES

* Fixed #3526 - Fixed `EventList` in `ResourceView` crashes with `hideNonWorkingDays`
* Fixed #3538 - Calendar view do not show the time horizontal lines in angular 12 after initial load
* Fixed #3567 - Minified css bundle contains unicode chars
* Fixed #3574 - Fix recurrence editor handling of monthly pattern using "On the n'th of the month" ("first" was ignored,
  "second" was interpreted as "first", etc.)

# 4.3.0 - 2021-10-12

## FEATURES / ENHANCEMENTS

* Calendar has a new `ResourceView` that encapsulates a series of calendar views, one for each resource/calendar on
  display in the new `resourceview` demo (Fixed #2353, Fixed #3385)
* [IONIC] Added Ionic framework integration demo. Demo located in `examples/frameworks/ionic/ionic-4` folder
  (Fixed #2622)

## API CHANGES

* [DEPRECATED] Buttons `menuIconCls` config was deprecated in favor of the new `menuIcon` config, which better matches
  the naming of other configs

## BUG FIXES

* Fixed #3513 - Time axis column not aligned with resource border

# 4.2.7 - 2021-10-01

## FEATURES / ENHANCEMENTS

* When there are many "all day" events, and the all day row of a day or week view is expanded, the all day row now only
  grows to consume up to 50% of the Calendar's height (Fixed #3317)

## BUG FIXES

* Fixed #1481 - Recurring events repeats endless after delete one of occurrences
* Fixed #3269 - Zero duration events are not displayed
* Fixed #3318 - Calendar mode's overflow popup can be misaligned when there are many overflowing events
* Fixed #3413 - Correct DST handling in monthly recurrence for n-th weekdays of a month
* Fixed #3417 - Missing icon for all day events
* Fixed #3456 - End after X time setting not applies for event with end on date setting
* Fixed #3458 - Document nested fields
* Fixed #3461 - Dragging from grid makes resource selector single select

# 4.2.6 - 2021-09-15

## BUG FIXES

* Fixed #3408 - Updated typings to support spread operator for parameters
* Fixed #3409 - Missing icon Intraday events in Month and Agenda view

# 4.2.5 - 2021-09-08

## FEATURES / ENHANCEMENTS

* When using a Scheduler as a mode in Calendar (as in the calendar-scheduler demo) there are now two new useful configs,
  `range` and `stepUnit`. They let you configure how much time the time axis spans and how large steps to take when
  clicking the previous/next buttons on the toolbar. Another enhancement for the same combination is that clicking a
  date in the mini calendar in the sidebar now scrolls that date into view (Fixed #3328)
* ProjectModel now fires a `dataReady` event when the engine has finished its calculations and the result has been
  written back to the records (Fixed #2019)
* The API documentation now better communicates when a field or property accepts multiple input types but uses a single
  type for output. For example date fields on models, which usually accepts a `String` or `Date` but always outputs a
  `Date` (Fixed #2933)
* New `examples/frameworks/webpack` demo added which shows how build a Calendar bundle from sources with Webpack
  Available for licensed Calendar version which includes sources

## BUG FIXES

* Fixed #3322 - Add `dataChange` event to framework guides
* Fixed #3408 - Updated typings to support spread operator for method parameters

# 4.2.4 - 2021-08-27

## FEATURES / ENHANCEMENTS

* Previous versions of Calendar used a bottom border on events to create a fake gap between them in day and week views
  With this release there is now an actual gap between events instead, whose size is determined using the
  `eventSpacing` config of the DayView (Fixed #2613)

## BUG FIXES

* Fixed #3265 - Docs are not scrolled to the referenced member
* Fixed #3294 - List should update its selection prior to firing its item event
* Fixed #3305 - Guides look bad in the docs search results
* Fixed #3306 - Doc browser does not scroll to member

# 4.2.3 - 2021-08-05

## FEATURES / ENHANCEMENTS

* [NPM] Bryntum Npm server now supports remote private repository access for Artifactory with username and password
  authentication (Fixed #2864)
* [TYPINGS] Type definitions now contain typed `features` configs and properties (Fixed #2740)

## BUG FIXES

* Fixed #1795 - Add configs to show event `startTime` + `endTime` optionally (partial: `startTime` is optional)
* Fixed #2395 – Document `showTime` / `timeFormat` in CalendarMixin
* Fixed #3239 - `showTime: false` on Calendar WeekView throws + make `showTime` public

# 4.2.2 - 2021-07-21

## FEATURES / ENHANCEMENTS

* You can now distinguish new events being created using drag create (or double clicking in the schedule) by checking
  the Model#isCreating flag. In the DOM, a new CSS class b-sch-creating has been added to all events that are being
  created
* [NPM] Bryntum Npm server now supports `npm token` command for managing access tokens for CI/CD (Fixed #2703)

## BUG FIXES

* Fixed #3039 - Fixed incorrect `dragcancel` firing when only a click (and no drag) occurred
* Fixed #3162 - LoadOnDemand feature cannot be disabled in runtime
* Fixed #3167 - LWC bundle is missing from trial packages
* Fixed #3178 - Syntax highlighter messes up code snippets in docs
* Fixed #3185 - Add CSS class to indicate that an event is being created

# 4.2.1 - 2021-07-07

## FEATURES / ENHANCEMENTS

* [FRAMEWORKS] Added `dragFeature` and `externalEventSourceFeature` to frameworks wrappers (Fixed #3135)

## BUG FIXES

* Fixed #3136 - [NPM] Running `npm install` twice creates modified `package-lock.json` file
* Fixed #3139 - Support `on` and `un` methods for `eventTooltip` feature instance

# 4.2.0 - 2021-06-30

## FEATURES / ENHANCEMENTS

* New config for day/week views (`dayStartShift`) to allow day columns to start their 24-hour period at a specified time
  other than midnight. This differs from `dayStartTime` which only controls the first time to render
* Added "Upgrade Font Awesome icons to Pro version" guide
* Added "Replacing Font Awesome with Material Icons" guide
* Improved day view layout and added new configs to address layout issues with many overlapping events. (Fixed #2409)

* For more details, see [What's new](https://bryntum.com/docs/calendar/guide/Calendar/whats-new/4.2.0) and
  [Upgrade guide](https://bryntum.com/docs/calendar/guide/Calendar/upgrades/4.2.0) in docs

## BUG FIXES

* Fixed #1185 - Calendar should auto-scroll as you drag an event close to edges
* Fixed #3086 - Day/WeekView now update correctly on changing `dayStartShift`

# 4.1.6 - 2021-06-23

## BUG FIXES

* Fixed #3004 - New calendar event added does not sync its assignment when using multi-assignment
* Fixed #3005 - [VUE-3] Problem with Critical Paths due to Vue Proxy and double native events firing bug
* Fixed #3013 - Card layout causes overflow during card change
* Fixed #3026 - [VUE-2] and [VUE-3] typescript type declarations are missing
* Fixed #3027 - Can't create event when using filter

# 4.1.5 - 2021-06-09

## FEATURES / ENHANCEMENTS

* [TYPINGS] API singleton classes are correctly exported to typings (Fixed #2752)

## BUG FIXES

* Fixed #2943 - Agenda view should not scroll after clicking event
* Fixed #2958 - Weekly Repeat event editor doesn't fit day names
* Fixed #2959 - TypeError: Cannot read property 'focus' of null on event edit in Year view
* Fixed #2961 - Recurring event rule is not working correctly for Week/Day view
* Fixed #2972 - Cancelling a newly created event in event editor should not trigger sync
* Fixed #2978 - Fixed focus/scroll reverting to previously resized event
* Fixed #2990 - [ANGULAR] Preventable async events don't work
* Fixed #2994 - Cannot configure defaultCalendar on Calendar instance

# 4.1.4 - 2021-05-28

## FEATURES / ENHANCEMENTS

* TypeScript definitions updated to use typed `Partial<>` parameters where available
* Calendar now fires preventable `beforeDragMoveEnd`, `beforeDragResizeEnd` and `beforeDragCreateEnd`. Each of these
  events can be prevented by returning `false` or a Promise yielding `false` (async confirmation)
* New demo `confirmation-dialogs` showing how to do asynchronous confirmation of drag drop, resize and drag create
  actions
* Buttons now has a new style `b-transparent` that renders them without background or borders (Fixed #2853)
* [NPM] repository package `@bryntum/calendar` now includes source code (Fixed #2723)
* [NPM] repository package `@bryntum/calendar` now includes minified versions of bundles (Fixed #2842)
* [FRAMEWORKS] Frameworks demos packages dependencies updated to support Node v12

## API CHANGES

* Resource field in EventEditor is no longer `required` by default

## BUG FIXES

* Fixed #2699 - First day of week is incorrect
* Fixed #2781 - Remove leading 0 in hour for US English locale
* Fixed #2828 - Memory leak when replacing project instance
* Fixed #2834 - Core should not use b-fa for icon prefix
* Fixed #2892 - MonthView eventHeight cannot use string based values (eg '2em')
* Fixed #2894 - Cannot assign multiple resources when creating new event
* Fixed #2896 - Event Adds Without Event Editor Prompt if month cell has many events
* Fixed #2897 - Crash when double clicking to create a new event
* Fixed #2902 - Overflowing events popup doesn't look good with a lot of content
* Fixed #2903 - Event Edit modal closes on iPhone when user taps "Done" on the keyboard

# 4.1.3 - 2021-05-13

## FEATURES / ENHANCEMENTS

* Bumped the built-in version of FontAwesome Free to 5.15.3 and added missing imports to allow stacked icons etc
* Bumped the `@babel/preset-env` config target to `chrome: 75` for the UMD and Module bundles. This decreased bundle
  sizes and improved performance for modern browsers
* Updated Angular Wrappers to be compatible with Angular 6-7 in production mode for target `es2015`

## BUG FIXES

* Fixed #2778 - Wrong module declaration in typings file
* Fixed #2780 - Changing dayStartTime / dayEndTime on the fly is not working
* Fixed #2820 - Loading SchedulerPro styles to a Calendar demo breaks it
* Fixed #2844 - Calendar scrollbar flicker on initial animation
* Fixed #2851 - Event tap doesn't work show event tooltip on touch devices
* Fixes #2821 - Cannot drag create an event in a calendar
* Fixes #2848 - Newly created event syncs before editor is shown

# 4.1.2 - 2021-04-27

## FEATURES / ENHANCEMENTS

* Internal code improvements and bugfixes

# 4.1.1 - 2021-04-23

## FEATURES / ENHANCEMENTS

* Added Lightning Web Component integration guide (Fixed #2623)
* New demo 'fit-hours' showing how to fit the week view timeline to available vertical space
* Updated 'visible-hours' demo with a number field which lets you configure the snap increment
* Scheduler / Gantt / Calendar will now react when CTRL-Z key to undo / redo recent changes made. Behavior can be
  controlled with the new `enableUndoRedoKeys` config (Fixed #2532)

## BUG FIXES

* Fixed #1629 - Calendar React Filtering demo styling
* Fixed #1987 - DOCS: React guide needs a section on how to listen for events
* Fixed #2601 - Drag proxy misplaced in all day bar
* Fixed #2602 - List view demo broken
* Fixed #2603 - Add opacity to original element while drag drop is ongoing
* Fixed #2611 - Drag move and drag resize operations now properly restore focus to the dragged event
* Fixed #2619 - Dragging non-allDay event in all day zone is offset incorrectly
* Fixed #2679 - on-owner events should be added to owner too in docs
* Fixed #2681 - Yarn. Package trial alias can not be installed
* Fixed #2719 - New event won't sync after drag creation
* Fixed #2725 - Calendar styles are broken when scheduler stylesheet is loaded on the same page

# 4.1.0 - 2021-04-02

## FEATURES / ENHANCEMENTS

* We are happy to announce that Bryntum Calendar now can be directly installed using our npm registry
  We've updated all our frameworks demos to use `@bryntum` npm packages. See them in `examples/frameworks` folder
  Please refer to "Npm packages" guide in docs for registry login and usage information
* Bryntum demos were updated with XSS protection code. `StringHelper.encodeHtml` and `StringHelper.xss` functions were
  used for this
* The calendar now defaults to show current date if no `date` config is provided
* Added new React 17 demo for configuring visible hours in Calendar. The example also implements theme switching
  (Fixed #1823 and Fixed #2213)
* A new Calendar mode, `list` is now available which shows events as a Grid in a fixed range around the Calendar's
  current date. Range may be `day`, `week`, `month`, `year`, `decade`. The default range is `'month'` (Fixed #2034)
* The Agenda mode now extends the `list` view and offers a settings button to change the range size (Fixed #1875)
* Added `shiftNext`, `shiftPrevious`, and `shiftToNow` methods to Calendar to navigate in Calendar views (Fixed #2343)
* Added new Vue 3 Basic demo to show how to use Bryntum Calendar in Vue 3 (Fixed #1315)
* Added new Calendar + Scheduler demo (Fixed #1578)
* Added support for `overflowClickAction : 'shrinkwrap'` which makes a click on a `+n more` indicator expand that week
  row to show all events in the week. The MonthView may then scroll vertically to show all week rows because this may
  make it overflow its available height. New API and event support. (Fixed #1165)
* Added a new Feature `weekExpander` which offers a UI to expand MonthView week rows which contain overflowing cells
* A new feature, `print` allows the current active view to be printed. (Fixed #1595)

## API CHANGES

* [BREAKING] Removed RequireJS demos and integration guides in favor of using modern ES6 Modules technology
  (Fixed #1963)
* [BREAKING] `init` method is no longer required in Lightning Web Components and was removed from the LWC bundle
* The drag create feature no longer shows a tooltip by default during dragging (Fixed #2394). See upgrade guide for
  details

## BUG FIXES

* Fixed #1452 - All day event duration is not shown in the tooltip
* Fixed #1794 - Cannot toggle calendar modes in readonly mode
* Fixed #2023 - Calendar should not sync to the store when create a new event before the event is saved in Event Editor
* Fixed #2211 - Add test coverage for XSS
* Fixed #2312 - Wrong dragFeature name in wrappers
* Fixed #2340 - Saving events when resource field is disabled resets assigned resource
* Fixed #2355 - Multicombo box css is disturbed if it's not editable
* Fixed #2359 - Update readme files in all framework demos in all products
* Fixed #2379 - Add minified version of *.lite.umd.js to the bundle
* Fixed #2399 - sync triggered after loading initial data
* Fixed #2400 - Sync failure messages displayed in `syncMask` where not auto-closing
* Fixed #2405 - Corrected event position when moving or resizing an event that overlaps other events
* Fixed #2416 - Crash when beforeEventEdit returns false
* Fixed #2439 - Drag and drop selects text in Safari
* Fixed #2445 - Calendar year view should have white background
* Fixed #2454 - Editor stays opened in ListView demo
* Fixed #2457 - All day events with a picture look bad in Custom rendering demo

# 4.0.8 - 2021-01-27

* Internal code improvements and bugfixes

# 4.0.7 - 2021-01-12

## BUG FIXES

* Fixed #2106 - Add `tools` to tooltip demo to show interaction with the hovered event

# 4.0.6 - 2020-12-29

## FEATURES / ENHANCEMENTS

* The [Custom event editor example](https://bryntum.com/examples/calendar/eventedit/) has been enhanced to
  illustrate how to make the provided editor widgets match conform with a theme. Guides on how to customize the event
  editor have been improved. (Fixed #2000)

## BUG FIXES

* Fixed #1421 - Week start day and number are not updated on locale change
* Fixed #2017 - DayView and WeekView timeline time format and Event time format is not localized dynamically
* Fixed #2108 - Update of recurrent event occurrence specifying "All future events" when the occurrence is limited by a
  COUNT value resulted in the COUNT being applied from the modified date, so too many occurrences were created
* Fixed #2113 - Event width is preserved when dragging event in the calendar
* Fixed #2149 - Unable to filter multi assigned task

# 4.0.5 - 2020-12-15

## FEATURES / ENHANCEMENTS

* Two new Calendar features have been added, `EventMenu` which offers a context menu
  for right-click on events, and `ScheduleMenu` for right-click on empty areas of a calendar. These work in the same
  way as the Scheduler's features by the same name. (Fixed #1274)

## BUG FIXES

* Fixed #2105 - Crash when switching to single day view from any other calendar view

# 4.0.4 - 2020-12-09

## API CHANGES

* The following params of DayCellRenderer#dayCellRenderer and AgendaView#dayCellRenderer were made private:
  `key`, `day`, `visibleColumnIndex`, `isOtherMonth`, `visible`, `tomorrow`, `isRowStart`, `isRowEnd`, `renderedEvents`

## FEATURES / ENHANCEMENTS

* A new Calendar Feature, `ExternalEventSource` makes it extremely easy to drag in events to "import" them in to a
  Calendar instance. (Fixed #1683)

## BUG FIXES

* Fixed #1812 - Make tables look better in docs
* Fixed #1898 - Custom event renderer doesn't work properly for AgendaView
* Fixed #1977 - Fields added to a default layout Container are stretched along the main axis
* Fixed #1991 - Sidebar Customization example throws JS error when "Create Event" clicked when YearView is active

# 4.0.3 - 2020-11-17

## FEATURES / ENHANCEMENTS

* A new Scheduler widget type `undoredo` has been added which, when added to the `tbar` of a scheduling widget (such as
  a `Scheduler`, `Gantt`, or `Calendar`), provides undo and redo functionality
* Added experimental support for Salesforce Lightning Locker Service. The distributed bundle only supports modern
  browsers (not IE11 or non-chromium based Edge), since Salesforce drops support for those on January 1st 2021 too
  (Fixed #1822)
* Added Lightning Web Component demo, see `examples/salesforce/src/lwc`
* `calendar.umd.js` and `calendar.lite.umd.js` bundles are now compiled with up-to-date `@babel/preset-env` webpack
  preset with no extra polyfilling. This change decreases size for the bundle by ~20% and offers performance
  enhancements for supported browsers
* [DEPRECATED] `calendar.lite.umd.js` was deprecated in favor of `calendar.umd.js` and will be removed in version 5.0

## BUG FIXES

* Fixed #1792 - Resource filter names missing colors
* Fixed #1852 - Exception when editing new event in collapsed CalendarRow when that new event is in overflow
* Fixed #1882 - dblclick in YearView should not initiate autoCreate in the WeekView

# 4.0.2 - 2020-11-04

## BUG FIXES

* Fixed documentation bugs

# 4.0.1 - 2020-11-03

## BUG FIXES

* Fixed #1451 - Use selected element to anchor event editor instead of scrolling the first rendered element of an event
  into view
* Fixed #1454 - Calendar Month View: +2 more shown but only one event present
* Fixed #1459 - Fix cleanup issues when cancelling drag via ESC key press
* Fixed #1609 - Calendar CSS issues
* Fixed #1617 - Event layout, (ordering and element sizing) not corrected after drag move and drag create
* Fixed #1720 - Crash when clicking task in examples browser demo
* Fixed #2168 - dblclick in AgendaView adds new event, but doesn't show the editor

# 4.0.0 - 2020-10-19

## FEATURES / ENHANCEMENTS

* [BREAKING] Dropped Support for Edge 18 and older. Our Edge <=18 fixes are still in place and active, but we will not
  be adding more fixes. Existing fixes will be removed in a later version
* Improved default description property of `WeekView` to display week of year in addition to month
* Added `descriptionRenderer` config to calendar view widgets to allow custom descriptions
* Calendar now ships with the same set of themes as its relatives Grid, Scheduler and Gantt: material, stockholm,
  classic, classic-light and classic-dark (Fixed #477)
* New event `dateRangeChange` is fired before any Calendar view changes its date range. This allows
  apps to request new data from the server. Upon loading data, any new events will appear
* Added new localization demo and guide (Fixed #1409)
* New `loadOnDemand` feature which dynamically loads the Calendar's CrudManager depending on the date
  range active in the current view
* Added a styling guide (Fixed #1427)
* Added XSS protection to default renderers (based on `StringHelper.encodeHtml` and `StringHelper.xss`)
* Added support to export events to ICS format with the new `TimeSpan#exportToICS` method. Demonstrated in the
  new `exporttoics` example
* Added `calendar.lite.umd.js` module that does not include `Promise` polyfill. This module is primarily intended to be
  used with Angular to prevent `zone.js` polyfills overwrite
* Added a new `angular-7` demo (Fixed #1537)

## API CHANGES

* Model fields in derived classes are now merged with corresponding model fields (by name) in super classes. This allows
  serialization and other attributes to be inherited when a derived class only wants to change the `defaultValue` or
  other attribute of the field
* The `dateFormat` config for `type='date'` model fields has been simplified to `format`

## BUG FIXES

* Fixed #1133 - Calendar event selection
* Fixed #1228 - Custom fields in event editor now properly hide and show based on `eventType`
* Fixed #1234 - Visible date range required event to notify when views navigate in tiime
* Fixed #1237 - CrudManager.load() resulted in doubling of events
* Fixed #1246 - Fix css warning in Calendar theme
* Fixed #1253 - All day header out of sync with main schedule body after browser zoom
* Fixed #1257 - Event editor docs regarding how to add the `eventTypeField` were incorrect
* Fixed #1281 - Calendar drag/drop did not work correctly with a scrolled body element
* Fixed #1282 - Ripple misplaced when clicking
* Fixed #1285 - Drag handles are no longer displayed where events in day view extend outside of day start/end times
* Fixed #1422 - Doubleclicking calendar throws after locale change
* Fixed #1434 - TimeAxis time format in Day and Week views should match time format in event elements
* Fixed #1446 - Calendar size is changed when switching months
* Fixed #1548 - [ANGULAR] Investigate zone.js loading order and set it to Angular default
* Fixed #1641 - Extra CSS classes applied to Calendar container
* Fixed #1696 - Calendar drag create throws error when event edit feature enabled

# 1.0.1 - 2020-07-24

## BUG FIXES

* Fixed #1031 - Some localized properties not processed
* Fixed #1187 - Corrected drag/drop handling for non-date drop locations
* Fixed #1213 - Events created on current date always uses current time
* Fixed #1722 - dblclick to edit event when autoCreate is false throws error

# 1.0.0 - 2020-07-17

* We are very excited to announce the 1.0 GA of the Bryntum Calendar – our super modern calendar component
  with day, week, month, year and agenda views. It is written in pure ES6+ with wrappers available for React, Vue and
  Angular. The data model and UI are both extremely flexible and can be extended
  to match any application data model. Additionally, the data model is identical to that used in the Gantt / Scheduler
  products so you can easily share project data between multiple views. The SDK contains lots of examples and
  API documentation to get you started quickly

# 1.0.0-rc-1 - 2020-07-17

## BUG FIXES

* Fixed #1173 - autoCreate: false not propagated from calendar into participating views
* Fixed #1684 - EventRecords with recurrenceRule should be mutable before they acquire an eventStore

# 1.0.0-alpha-6 - 2020-07-09

## FEATURES / ENHANCEMENTS

* Added `DayView#visibleStartTime` config indicating the starting hour to scroll to for day / week view
* Added new 'visible-hours' demo showing how to customize the visible time span
* Added new 'undoredo' demo
* Added new 'recurrence' demo showing recurring events
* Added new 'filterfield' to sidebar widget
* Added new 'custom-rendering' demo showing use of the `eventRenderer` method
* Added new 'bigdataset' demo to show a very busy week, to test the performance

# 1.0.0-alpha-1 - 2020-06-11

* Alpha-1 release of Bryntum Calendar