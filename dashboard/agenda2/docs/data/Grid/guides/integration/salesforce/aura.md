<h1 class="title-with-image">
<img src="Core/logo/salesforce.svg" alt="Bryntum Grid supports Lightning Web Components"/>
Grid Salesforce Lightning Component demo
</h1>

This demo shows how to embed Bryntum Grid into a Lightning Component to use in your Salesforce org. We are going to use
[DreamHouse demo app](http://www.dreamhouseapp.io/)
to provide us with some demoable entities - properties with pictures. The DreamHouse app is not installed by default, please
follow installation steps by the link above.

## Installation

### Static Resource
#### Production bundle
First of all, you need to upload Bryntum Grid sources to the `Static Resources`. Given that size of a static resource is
limited by 5MB, and it will be loaded with the page, it would be better if we only stick with a minimum amount of resources.

Let's say we want grid with the default theme only:
1. Navigate to `grid/build` folder
2. Create zip archive with required resources:

        // using smallest bundle
        zip -9 -r grid.zip grid.umd.min.js grid.stockholm.min.css ./fonts/

Now we have archive `grid.zip` which should be uploaded to Salesforce. Demo component expects a resource with name
`bryntum_grid`. If this name doesn't work for you, pick any other but don't forget to rename resource in the
`bryntumgridComponent.cmp` that will be created later. Please refer to
[this article](https://developer.salesforce.com/docs/atlas.en-us.pages.meta/pages/pages_resources_create.htm)
to learn how to upload a static resource.

#### Debugging bundle
It might be handy to have a static resource for debugging purposes. To create one, repeat steps above but pack different
resources into the archvie:

    zip -9 -r grid_debug.zip grid.umd.js grid.stockholm.css ./fonts/

Now upload this resource and need to debug your app, reference it in the `bryntumgridComponent.cmp`

### Making Lightning Component (from developer console)
This section describes how to set up a component using developer console. In case you have Visual Studio Code with
ForceCode installed and working, you can skip to the Alternative installation section.

*Please keep in mind, that class names are case-sensitive. It is recommended that you stick to the exact names we use here*

#### Apex class
We will rely on a special Apex class to interact with the backend:
1. Create new Apex class from developer console (File -> New -> Apex Class) with name
**BryntumGridComponentController**
2. Paste contents of the `src/classes/BryntumGridComponentController.cls`

#### Component and app
And now the finishing moves, component and app respectively:

1. Open folder `src/aura/bryntumgridComponent`
2. Open developer console
3. Add new Lightning Component (File -> New -> Lightning Component) named
`bryntumgridComponent`
3. Set API version to 39 to disable LockerService
4. Paste contents of the `bryntumgridComponent.cmp` from local folder to the new
component in the developer console. If your static resource is named `bryntum_grid`, you are fine.
But in case you have different name (e.g. *your_name*), make sure you have updated requirement tag:

        $Resource.your_name

5. Create helper by clicking on button `HELPER` in the side panel of the console. When helper
 is created, paste helper sources from the local folder. Repeat operation with controller and style
6. Add new Lightning App (File -> New -> Lightning Application) named `bryntumgridApp`
6. Set API version to 39 to disable LockerService
7. Copy source code of the `src/aura/bryntumgridApp/bryntumgridApp.app` into your new app

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

Now it should be done! Assuming you have `bryntumgridApp.app` in your dev console opened, click **Preview** button to see
the awesome result you've achieved.

### Technical details

In our demo app we use some ES6 features like arrow functions and **class** definition. While arrow functions are there
only for convenience, **class** is required to use model field mapping.

#### What is model field mapping?
It is a concept that allows grid to load any suitable data and point it to fields. E.g. we are loading two dates, and a 
related entity - Broker. To handle date type, we are creating field with specific type. Broker info, that we get from 
the server, is an object. So we query that object for the field of interest. That also allows grouping grid by this field
easily.
```javascript
class MyModel extends bryntum.grid.Model {
    static get fields() {
        return [
            { name : 'Broker', dataSource : 'Broker__r.Name' },
            { name : 'Date_Listed', dataSource : 'Date_Listed__c', type : 'date' },
            { name : 'Date_Closed', dataSource : 'Date_Closed__c', type : 'date' }
        ];
    }
}
```

But there is a problem - some browsers (Internet Explorer) do not support **class** syntax

#### Is it going to work in Internet Explorer 11?
Sure, we just need to transpile ES6 code to ES5, pretty easy. This [article](https://css-tricks.com/transpiling-es6/)
properly explains how to do that. And you only need to transpile your code, our `grid.umd.*` bundles are already transpiled!

#### Backend
Lightning Components are obliged to use the Aura framework to access data, which means our data package is not completely
utilized. We need a layer which will communicate with the backend and update data on the client side. In this demo we
made one entry point that syncs changes from grid to backend. Changes include modified records and removed ones.
```javascript
saveChanges : function () {
    var me = this,
        changes = me.grid.store.changes;

    setTimeout($A.getCallback(() => {
        changes.removed.length && me.queueAction('c.removeProperties', {
            ids : changes.removed.map(r => r.Id)
        }, response => {
            var state = response.getState();

            if (state !== 'SUCCESS') {
                console.log('Remove failed with state:', state);
            }
        });

        changes.modified.forEach(r => {
            var changes = r.modifications;

            // Date has to be processed before sending
            if (changes.Date_Listed__c) {
                changes.Date_Listed__c = changes.Date_Listed__c.toISOString();
            }

            if (changes.Date_Closed__c) {
                changes.Date_Closed__c = changes.Date_Closed__c.toISOString();
            }

            // queueAction is smart, it will batch requests into one large
            me.queueAction('c.saveProperty', {
                item : changes
            }, response => {
                var state = response.getState();

                if (state !== 'SUCCESS') {
                    console.log('Update failed with state:', state);
                }
            });
        });

        // Commit right away
        me.grid.store.commit();
    }));
}
```

queueAction is a simple wrapper that allows us to send requests with params, passed in 2nd argument. In this case we
send ids of the deleted records and changes made to records on **save** button click.


<p class="last-modified">Last modified on 2022-05-30 6:38:16</p>