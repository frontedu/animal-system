'use strict';

/**
 * folder  : example folder under ./examples
 * group   : browser page group
 * title   : example title
 * build   : true if example needs building
 * offline : true if example is not available online
 * since   : package version since example is available
 */
window.examples = [// Basics
    {
        folder : 'basic',
        group  : 'Basics',
        title  : 'Basic setup'
    }, {
        folder  : 'visible-hours',
        group   : 'Basics',
        title   : 'Configuring visible hours',
        updated : '4.3.6'
    }, {
        folder : 'recurrence',
        group  : 'Basics',
        title  : 'Recurring events'
    }, // Features
    {
        folder : 'print',
        group  : 'Features',
        title  : 'Calendar print feature',
        since  : '4.1.0'
    }, {
        folder : 'shifted',
        group  : 'Features',
        title  : 'Display day views that don\'t start at midnight',
        since  : '4.2.0'
    }, {
        folder : 'filtering',
        group  : 'Features',
        title  : 'Event filtering'
    }, {
        folder  : 'listview',
        group   : 'Features',
        title   : 'Events viewed in grid form',
        since   : '4.1.0',
        updated : '5.0'
    }, {
        folder : 'exporttoics',
        group  : 'Features',
        title  : 'Exporting events to ICS format',
        since  : '4.0'
    }, {
        folder  : 'fit-hours',
        group   : 'Features',
        title   : 'Fit timeline to available space',
        since   : '4.1.1',
        updated : '4.3.2'
    }, {
        folder : 'multiassign',
        group  : 'Features',
        title  : 'Multi assignment'
    }, {
        folder  : 'resourceview',
        group   : 'Features',
        title   : 'ResourceView',
        since   : '4.3.0',
        updated : '5.0.2'
    }, {
        folder : 'undoredo',
        group  : 'Features',
        title  : 'Undo & redo'
    }, // Customization
    {
        folder : 'customized-resourcefilter',
        group  : 'Customization',
        title  : 'Alternative resource filtering UI',
        since  : '4.3.5'
    }, {
        folder : 'confirmation-dialogs',
        group  : 'Customization',
        title  : 'Confirmation dialogs',
        since  : '4.1.4'
    }, {
        folder : 'custom-menus',
        group  : 'Customization',
        title  : 'Customized context menus',
        since  : '4.0.5'
    }, {
        folder  : 'eventedit',
        group   : 'Customization',
        title   : 'Customized event editor',
        updated : '5.0'
    }, {
        folder : 'tooltips',
        group  : 'Customization',
        title  : 'Customized event tooltip'
    }, {
        folder : 'sidebar-customization',
        group  : 'Customization',
        title  : 'Customized sidebar'
    }, {
        folder  : 'custom-rendering',
        group   : 'Customization',
        title   : 'Custom rendering',
        updated : '5.0'
    }, {
        folder : 'localization',
        group  : 'Customization',
        title  : 'Localization'
    }, {
        folder : 'resource-avatars',
        group  : 'Customization',
        title  : 'Rendering resource avatars in the event bars',
        since  : '4.3.9'
    }, // Power demos
    {
        folder  : 'bigdataset',
        group   : 'Power demos',
        title   : 'Big data set',
        updated : '4.3.3'
    }, {
        folder : 'calendar-taskboard',
        group  : 'Power demos',
        title  : 'Calendar + Taskboard integration',
        since  : '5.0.0'
    }, {
        folder : 'dragfromgrid',
        group  : 'Power demos',
        title  : 'Drag events from external grid',
        since  : '4.0.4'
    }, {
        folder  : 'calendar-scheduler',
        group   : 'Power demos',
        title   : 'Scheduler Timeline',
        since   : '4.1.0',
        updated : '4.2.4'
    }, {
        folder : 'megadataset',
        group  : 'Power demos',
        title  : 'Colossal data set',
        since  : '5.0.2'
    }, // Integration
    {
        folder : 'esmodule',
        group  : 'Integration',
        title  : 'Include using EcmaScript module'
    }, {
        folder  : 'salesforce',
        group   : 'Integration',
        title   : 'Using Calendar as Lightning Web Component',
        offline : true,
        since   : '4.0.3'
    }, {
        folder : 'scripttag',
        group  : 'Integration',
        title  : 'Include using script tag'
    }, {
        folder : 'webcomponents',
        group  : 'Integration',
        title  : 'Use as web component',
        since  : '4.1.0'
    }, // Integration/Webpack
    {
        folder  : 'frameworks/webpack',
        group   : 'Integration',
        title   : 'Custom build using WebPack',
        overlay : 'webpack',
        version : 'WebPack 4',
        since   : '4.2.5',
        offline : true
    }, // Integration/Ionic
    {
        folder  : 'frameworks/ionic/ionic-4',
        group   : 'Integration/Ionic',
        title   : 'Integrate with Ionic',
        build   : true,
        overlay : 'ionic',
        version : 'Ionic 4',
        since   : '4.3.0'
    }, // Integration/Angular
    {
        folder  : 'frameworks/angular/angular-7',
        group   : 'Integration/Angular',
        overlay : 'angular',
        version : 'Angular 7',
        title   : 'Angular 7 Basic demo using HttpClient',
        build   : true,
        since   : '4.0'
    }, {
        folder  : 'frameworks/angular/drag-from-grid',
        group   : 'Integration/Angular',
        overlay : 'angular',
        version : 'Angular 13',
        title   : 'Drag from external source Angular demo',
        build   : true,
        since   : '5.0.5'
    }, {
        folder  : 'frameworks/angular/inline-data',
        group   : 'Integration/Angular',
        overlay : 'angular',
        version : 'Angular 13',
        title   : 'Angular inline data demo',
        build   : true,
        since   : '5.0.3'
    }, {
        folder  : 'frameworks/angular/filtering',
        group   : 'Integration/Angular',
        overlay : 'angular',
        version : 'Angular 13',
        title   : 'Angular Event Filtering demo',
        build   : true,
        updated : '4.3.4'
    }, // Integration/React
    {
        folder  : 'frameworks/react/javascript/filtering',
        group   : 'Integration/React',
        overlay : 'react',
        version : 'React 16.13',
        title   : 'React Event Filtering demo',
        build   : true
    }, {
        folder  : 'frameworks/react/javascript/inline-data',
        group   : 'Integration/React',
        overlay : 'react',
        version : 'React 16.13',
        title   : 'React inline data demo',
        build   : true,
        since   : '5.0.3'
    }, {
        folder  : 'frameworks/react/javascript/visible-hours',
        group   : 'Integration/React',
        overlay : 'react',
        version : 'React 17',
        title   : 'Configuring visible hours in React',
        build   : true,
        since   : '4.1'
    }, {
        folder  : 'frameworks/react/typescript/basic',
        group   : 'Integration/React',
        overlay : 'react',
        version : 'React 17',
        title   : 'Basic React application with TypeScript',
        build   : true,
        since   : '5.0.3'
    }, // Integration/Vue
    {
        folder  : 'frameworks/vue/javascript/filtering',
        group   : 'Integration/Vue',
        overlay : 'vue',
        version : 'Vue 2.6',
        title   : 'Vue Event Filtering demo',
        build   : true
    }, // Integration/Vue-3
    {
        folder  : 'frameworks/vue-3/javascript/basic',
        group   : 'Integration/Vue',
        overlay : 'vue',
        version : 'Vue 3.0',
        title   : 'Vue 3 Basic demo',
        build   : true,
        since   : '4.1'
    }, {
        folder  : 'frameworks/vue-3/javascript/inline-data',
        group   : 'Integration/Vue',
        overlay : 'vue',
        version : 'Vue 3.0',
        title   : 'Vue 3 inline data demo',
        build   : true,
        since   : '5.0.3'
    }];
