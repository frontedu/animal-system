<h1 class="title-with-image">
<img src="Core/logo/salesforce.svg" alt="Bryntum Scheduler supports Lightning Web Components"/>
Scheduler Salesforce Lightning Component demo
</h1>

This demo shows how to embed Bryntum Scheduler into the Lightning Component to use in your salesforce org. We are going 
to use [DreamHouse app](http://www.dreamhouseapp.io/) to provide us with some demoable entities - properties with pictures.
Properties will appear as resources and we will link them to events in the calendar.

DreamHouse app is not installed by default, please follow installation steps by the link above.

## Installation

### Static Resource
#### Production bundle
First of all, you need to upload Bryntum Scheduler sources to the `Static Resources`. Given that size of a static 
resource is limited by 5MB, and it will be loaded with the page, it would be better if we only stick with a minimum amount
of resources.

Let's say we want scheduler with the default theme only:
1. Navigate to `scheduler/build` folder
2. Create zip archive with required resources:

        // using bundle
        zip -9 -r scheduler.zip scheduler.umd.min.js scheduler.stockholm.min.css ./fonts/

Now we have archive `scheduler.zip` which should be uploaded to the salesforce. Demo component expects resource with a 
name `scheduler`. If this name doesn't work for you, pick any other but don't forget to rename resource in the 
`schedulingComponent.cmp` that will be created later. Please refer to
[this article](https://developer.salesforce.com/docs/atlas.en-us.pages.meta/pages/pages_resources_create.htm)
to learn how to upload static resource.

#### Debugging bundle
It might be handy to have a static resource for debugging purposes. To make it just repeat steps above but pack different
resources into archvie:

    zip -9 -r scheduler_debug.zip scheduler.umd.js scheduler.stockholm.css ./fonts/

Now upload this resource and when you will need to debug your app, just reference it in the `schedulingComponent.cmp`

### Making Lightning Component (from developer console)
This section describes how to set up component using developer console. In case you have the Visual Studio Code with 
ForceCode installed and working, you can skip to the Alternative installation section.

*Please keep in mind, that class names are case-sensitive. It is recommended that you stick to the exact names we use here*
#### Apex class
We will rely on special Apex class to interact with backend:
1. Create new Apex class from developer console (File -> New -> Apex Class) with a name **SchedulingComponentController**
2. Paste contents of the `src/classes/SchedulingComponentController.cls`

#### Component and app
And now the finishing moves: component and app respectively:

1. Open folder `src/aura/schedulingComponent`
2. Open developer console
3. Add new Lightning Component (File -> New -> Lightning Component) named
`schedulingComponent`
3. Set API version to 39 to disable LockerService
4. Paste contents of the `schedulingComponent.cmp` from local folder to the new component in the developer console.
If your static resource is named `scheduler`, you are fine. But in case you have different name (e.g. *your_name*), make
sure you have updated requirement tag:

        $Resource.your_name

5. Create helper by clicking on button `HELPER` in the side panel of the console. When helper is created, paste helper
sources from the local folder. Repeat operation with controller and style
6. Add new Lightning App (File -> New -> Lightning Application) named `schedulingApp`
6. Set API version to 39 to disable LockerService
7. Copy source code of the `src/aura/schedulingApp/schedulingApp.app` into your new app

### Alternative installation
If you have Visual Studio Code setup with Force Code extension, you can just sync these folders to salesforce.
1. Press `Ctrl + Shift + P`
2. Type **Force ref** press enter
3. Pick **Get All Files from org**
4. Now copy contents of the demo `src` folder to the `src` folder you've just downloaded

Now, when everything is copied, you have to open every added file and deploy it:
1. Click `Ctrl + Shift + P`
2. Type `ForceCode[ENTER]`
3. Type `Compile/Deploy` and pick that item

Save order should be:
1. Apex class
2. Lightning component (one with .cmp extension)
3. Lightning component helper/style/controller
4. Lightning app

All contents should be uploaded and be working (this is why we have so many XMLs in sources)

### Behold!

Now it should be done! Assuming you have `schedulingApp.app` in your dev console opened, click **Preview** button to see
the awesome result you've achieved.

### Technical details

In our demo app we use some ES6 features like arrow functions and **class** definition. While arrow functions are there
only for convenience, **class** is required to use model field mapping.

#### What is model field mapping?
It is a concept that allows scheduler to load any suitable data and point it to key fields. Scheduler event model relies
on 3 key fields: *startDate*, *endDate* and *resourceId*. Salesforce has object called **Event**, which we want to show 
in the scheduler, which has those fields with different names. So, for convenience we define model and map fields to the
data:
```javascript
class MyEvent extends bryntum.scheduler.EventModel {
    static get fields() {
        return [
            { name : 'Id' },
            { name : 'name', dataSource : 'Subject' },
            { name : 'startDate', dataSource : 'StartDateTime', type : 'date' },
            { name : 'endDate', dataSource : 'EndDateTime', type : 'date' },
            { name : 'resourceId', dataSource : 'WhatId' }
        ];
    }
}
```

But there is a problem - some browsers (Internet Explorer) do not support **class** syntax

#### Is it going to work in Internet Explorer 11?
Sure, we just need to transpile ES6 code to ES2015, pretty easy. This [article](https://css-tricks.com/transpiling-es6/)
properly explains, how to do that. And you only need to transpile your code, our `scheduler.umd.*` bundles are already
transpiled!

#### Backend
Lightning Components are obliged to use Aura framework to access data, which means our data package is not completely 
utilized. We need a layer which will communicate with backend and update data on a client side.
```javascript
this.queueAction('c.createEvent', {
    item : {
        WhatId        : eventRecord.resourceId,
        StartDateTime : eventRecord.startDate.toISOString(),
        EndDateTime   : eventRecord.endDate.toISOString(),
        Subject       : eventRecord.name
    }
}, function (response) {
    var state = response.getState();

    if (state === 'SUCCESS') {
        // Update record Id
        eventRecord.Id = response.getReturnValue().Id;
    }
    else {
        scheduler.eventStore.remove(eventRecord);
    }
});
```

queueAction is a simple wrapper that allows us to send requests with params, passed in 2nd argument. In this case we create
new event record and when it is saved, we update client record with the actual id.


<p class="last-modified">Last modified on 2022-05-30 6:38:16</p>