# Using remote data

`ResourceStore` and `EventStore` are both based on `AjaxStore`, which allows you to handle CRUD operations on the
backend.
`AjaxStore` for the most part works as a normal `Store`, but when creating it you need to supply some additional configs
with URLs to the server:

```javascript
const resourceStore = new ResourceStore({
    createUrl : 'backend/create.php',
    readUrl   : 'backend/read.php',
    updateUrl : 'backend/update.php',
    deleteUrl : 'backend/delete.php'
});

// or if supplying a store config to a scheduler:

const scheduler = new Scheduler({
    resourceStore : {
        createUrl : 'backend/create.php',
        readUrl   : 'backend/read.php',
        updateUrl : 'backend/update.php',
        deleteUrl : 'backend/delete.php'
    }
});
```

As the name suggests, the store then uses these URLs for Ajax requests for the different CRUD operations.

## Reading data

Uses GET to retrieve data from the backend. Data can be read automatically following construction of a store configured
with `{ autoLoad : true}` or manually by calling `Store#load()`:

```javascript
// Data will be loaded directly
const resourceStore = new ResourceStore({
    readUrl : 'backend/read.php',
    autoLoad : true
});

// Or

const resourceStore = new ResourceStore({
    readUrl : 'backend/read.php'
});

// Data loaded manually
resourceStore.load();
```

When manually calling `Store#load()` you can also supply parameters in object form, which will be appended to the
QueryString:

```javascript
resourceStore.load({ from : 1, to : 1000 }); // -> backend/read.php?from=1&to=1000
```

### Server response

Data returned is either expected to be an array of record data...

```json
[
    { "id" : 1, "name" : "Han" },
    { "id" : 2, "name" : "Luke" }
]
```

...or a response object with the following format:

```json
{
    "success" : true,
    "data"    : [
        { "id" : 1, "name" : "Leia" },
        { "id" : 2, "name" : "Lando" }
    ]
}
```

When using the latter format it is also possible to communicate server exceptions:

```json
{
    "success" : false,
    "message" : "That did not work very well, sorry"
}
```

### Async operations

Loading data, as well as the other CRUD operations, are async operations. Calling `Store#load` returns a Promise, which
can be used as is or with async/await:

```javascript
// Using promise directly
resourceStore.load().then(() => console.log('loaded'));

// Using await
await resourceStore.load();
console.log('loaded');
```

You can also use a listener that will be triggered on load:

```javascript
const resourceStore = new ResourceStore({
    readUrl : 'backend/read.php',
    listeners: {
        load() {
            console.log('loaded');
        }
    }
});

// Or

resourceStore.on('load', () => console.log('loaded'));
```

The same concept holds true when committing changes manually, as described below (`Store#commit()`).

## Modifying data

How to modify data in the store (add, insert, remove, update) is described in the guide "Using a Store". When using an
`AjaxStore`, no changes are sent to the backend until `Store#commit()` is called. This can either be done manually or
automatically:

```javascript
resourceStore.commit(); // Commits any changes, using the configured urls per action

// Or specify { autoCommit : true } to commit automatically after each action
const autoStore = new Store({
    autoCommit : true,
    /*...*/
});
```

If you want to cancel changes, you can do so if using manual committing by calling `Store#clearChanges()`.

### Added records

Any added (or inserted) records will be sent as JSON using POST to `createUrl`. The format will be:

```javascript
// Add operation
resourceStore.add([
    { name : 'Han' },
    { name : 'Leia' }
]);

// Post to server
data=[{"name":"Han"},{"name":"Leia"}]
```

Server is expected to respond with the same records with any missing data filled in (such as id). The response takes the
same format as for reading data.

```json
{
    "success" : true,   
    "data" : [
        {"id" : 1, "name" : "Han"},
        {"id" : 2, "name" : "Leia"}
    ]
}
```

### Updated records

Works much the same way as when adding records, but posts to `updateUrl`:

```javascript
// Modifying some records and committing changes
resourceStore.getAt(0).name = 'Kylo';
resourceStore.getAt(1).name = 'Rey';
resourceStore.commit();

// Post to server
data = [
    { id : 1, name : 'Kylo' },
    { id : 2, name : 'Rey' }
]
```

Please note that only changed fields are posted. Server is expected to respond with same format as for adding records.

### Removed records

Has the simplest requirements of the different operations. Posts ids of removed records to `deleteUrl`:

```javascript
// Removing some records and committing
resourceStore.getById(1).remove();
resourceStore.getById(2).remove();
resourceStore.commmit();

// Post to server
data = [1, 2];
```

Expects a response in this format:

```json
{
    "success" : true
}
```


<p class="last-modified">Last modified on 2022-05-30 6:38:16</p>