# Displaying data in a Scheduler

Bryntum Scheduler uses a `ResourceStore` to hold resources and an `EventStore` to hold events. Both are based on a
common base class `Store`, which holds and manages data in JSON format. A Scheduler might also use additional stores,
such as an `AssignmentStore` and a `DependencyStore`

A store uses a model for each row (called record) it holds. A `ResourceStore` uses a `ResourceModel` and an `EventStore`
uses an `EventModel`. Both of them inherit from `Model`, but they differ in which data fields they contain. This guide
is meant to give an overview of how you work with those stores and models.

## Schedulers project

Schedulers stores are linked to each other using a project. The project can be thought of as the complete dataset
available to the Scheduler: all events, resources, assignments and dependencies under a single "parent".

The project is responsible for:

* Making the stores available to Scheduler
* Calculating dates and durations using its calculation engine, which happens async
* Keeping references between records up to date (for example which resources an event is assigned to)
* Optionally working as a CrudManager

During normal basic UI usage, you will not need to interact much with the project. But it is worth knowing that it
exists. And if you need it, you access it using `scheduler.project`.

## Creating a Scheduler with data

This sections describes the different basic options you have out of the box to create a scheduler with inline data or by
loading remote data using Ajax.

### Using inline data

If you have inline data, you can supply it directly when creating a scheduler:

```javascript
const scheduler = new Scheduler({
    resources : [
        { id : 1, name : 'Batman' },
        { id : 2, name : 'Wolverine' },
        /*...*/
    ],
    
    events : [
        { id : 1, resourceId : 1, name : 'Fight crime', startDate : new Date(2018,4,1,9,00), endDate : new Date(2018,4,1,17,00) },
        { id : 2, resourceId : 1, name : 'Attend banquet', startDate : new Date(2018,4,1,20,00), endDate : new Date(2018,4,1,23,00) },
        { id : 3, resourceId : 2, name : 'Drink beer', startDate : new Date(2018,4,1,9,00), duration : 8, durationUnit : 'hour' },
        /*...*/
    ]
});
```

This will create a `ResourceStore` and an `EventStore holding the data. The stores can be accessed later:

```javascript
scheduler.resourceStore.sort('name');
scheduler.eventStore.removeAll();
```

Another option if you need more control over the stores created is to supply store config objects (for info on available
configs, see API docs):

```javascript
const scheduler = new Scheduler({
    resourceStore : {
        sorters : [
            { field : 'name' }      
        ],
        data : [
            { id : 1, name : 'Batman' },
            /*...*/
        ] 
    },
    /*...*/
});
```

A third option is to supply an already existing store instance:

```javascript
const resourceStore = new ResourceStore({
    someConfig : "...",
    data       : [
        { id : 1, name : 'Batman' },
        /*...*/
    ]
});

const scheduler = new Scheduler({
    resourceStore
});
```

And a forth is to use projects:

```javascript
// Inline project data
const scheduler = new Scheduler({
  project : {
    eventsData      : [/*...*/],
    resourcesData   : [/*...*/],
    assignmentsData : [/*...*/]
  }
});

// - or -

const project = new ProjectModel({
  eventsData      : [/*...*/],
  resourcesData   : [/*...*/],
  assignmentsData : [/*...*/]
});

const scheduler = new Scheduler({
  project
});
```

Inline data is expected to be an array of JavaScript/JSON objects.

### Using remote data

Both `ResourceStore` and `EventStore` can load remote data, since they are actually based on an `AjaxStore`. As with
inline data you have different options on how to set it up. Either supply a store config containing a `readUrl`:

```javascript
const scheduler = new Scheduler({
    resources : {
        readUrl : 'backend/loadResources.php', 
        autoLoad : true // Load upon creation
    }
});
```

Or create the store prior to creating the scheduler:

```javascript
const resourceStore = new ResourceStore({
   readUrl : 'backend/loadResources.aspx'
});

const scheduler = new Scheduler({
    resourceStore
});

store.load();
```

The data returned from the backend is by default expected to have the following format:

```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Batman" }
  ]
}
```

If this approach does not suite your needs you can of course load data in any custom way you want and then plug it into 
an inline store:

```javascript
const scheduler = new Scheduler({
    /*...*/
});

// Using native fetch to load data
const response = await fetch('backend/loadResources.php');
const data = await response.json();

// Maybe do some custom processing before plugging into schedulers store
data.forEach((row, index) => {
    row.index = index;
    row.someValue = Math.random();
    /*...*/
});

// Plug it in as inline data
scheduler.resourceStore.data = data;
```

### Using CrudManager

Scheduler ships with a helpful class called `CrudManager`, that allows you to load multiple stores in a single request
to the backend. For more information, see [CrudManager API docs](#Scheduler/data/CrudManager)

## ResourceStore and ResourceModel

As mentioned way up at the top a Scheduler uses a `ResourceStore` to hold instances of `ResourceModel`. In a horizontal
schedule this represents the rows. The model describes what data each record contains (fields). By
default `ResourceModel` defines only three fields:

* name
* eventColor
* eventStyle

The `name` field is what it sounds like, a text field for a resource name. For more information on `eventColor`
and `eventStyle`, read the guide on [Styling](#Scheduler/guides/customization/styling.md).

## EventStore and EventModel

A Scheduler also requires an `EventStore` to hold instances of `EventModel`. Records in this store represents the bars
displayed in the schedule. There are multiple predefined fields, the most important ones being (
see [EventModel in API docs](#Scheduler/model/EventModel) for a complete list):

* `resourceId`  
   Which resource this event is assigned to. Only valid with single assignment.
* `name`  
   Event name, displayed in the event bars by default.
* `startDate`  
   Start date, either as a date or a parseable date string
* `endDate`  
   An event should either have an endDate or a duration. The missing one will be calculated.
* `duration`  
   Duration, added to startDate to determine endDate. Remember to also specify durationUnit
* `durationUnit`  
   The unit in which the duration is given. Needed to make the calculation correct

## Defining additional fields

In many applications you will want to extend the built in models with additional fields. There is a few different ways
of achieving this, and while this section uses `ResourceModel` for the examples they apply to all models.

### Autogenerated fields

The properties of the first record in your data will be turned into fields on the model:

```javascript
const resourceStore = new ResourceStore({
    data : [
        { name : 'Wolverine', powers : 'Regeneration' },
        { name : 'Deadpool', powers : 'Yes I have, great powers' }   
    ]
});
```

The code above will create a `ResourceStore` with two records, based on a generated `ResourceModel` containing the
added `powers` field (name is already there by default).

### Custom Model

If you need more control over the fields a model contains, you have two options. If you do not need to reuse the Model
you can simply specify the additional fields when creating the store:

```javascript
const resourceStore = new ResourceStore({
    fields : ['powers', 'affiliation'],
    data : [
        { name : 'Wolverine', powers : 'Regeneration' },
        /*...*/
    ]
});
```

You can also create a subclass of a `Model` and define the fields you need on it:

```javascript
class SuperHero extends ResourceModel {
    static get fields() {
        return [
            // New custom fields:
            'powers', 
            'affiliation' 
        ];
    }
}

const resourceStore = new ResourceStore({
    modelClass : SuperHero,
    data : [/*...*/]
}); 
```

See the API docs for [Model](#Core/data/Model) for more information on defining and mapping fields.

### Models are reactive!

Fields are turned into setters on the records, which makes them reactive. For example doing this...

```javascript
const scheduler = new Scheduler({
    events : [
        { id : 3, resourceId : 2, name : 'Drink beer', startDate : new Date(2018,4,1,9,00), duration : 8, durationUnit : 'hour' },
    ]
});

scheduler.eventStore.first.duration = 10; 
```

...will update the scheduler on the fly to giving Wolverine more time to drink beer...


<p class="last-modified">Last modified on 2022-05-30 6:38:16</p>