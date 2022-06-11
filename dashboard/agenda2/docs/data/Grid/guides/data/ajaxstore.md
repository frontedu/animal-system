# Using an AjaxStore

Using an `AjaxStore` allows you to handle CRUD operations on the backend. `AjaxStore` for the most part works as a
normal `Store`, as covered in the guides "Displaying data" and "Using a Store". But when creating an `AjaxStore`
you need to supply some additional configs with URLs to the server:

```javascript
const store = new AjaxStore({
    createUrl : 'backend/create.php',
    readUrl   : 'backend/read.php',
    updateUrl : 'backend/update.php',
    deleteUrl : 'backend/delete.php'
});

// or if supplying a store config to a grid:

const grid = new Grid({
    store : {
        createUrl : 'backend/create.php',
        readUrl   : 'backend/read.php',
        updateUrl : 'backend/update.php',
        deleteUrl : 'backend/delete.php'
    }
});
```

As the name suggests, the store then uses these URLs for Ajax requests for the different CRUD operations.

## Headers

You can configure the AjaxStore to append HTTP headers to its server requests by using the `headers` config.

```javascript
// Configuring headers for each request
const store = new AjaxStore({
    readUrl : 'backend/read.php',
    headers : {
        'Content-Type'   : 'text/xml',
        'Accept-Charset' : 'utf-8'
    }
});
```

## Reading data

Uses GET to retrieve data from the backend. Data can be read automatically following construction of a store configured
with `{ autoLoad : true}` or manually by calling `Store#load()`:

```javascript
// Data will be loaded directly
const store = new AjaxStore({
    readUrl  : 'backend/read.php',
    autoLoad : true
});

// Or

const store = new AjaxStore({
    readUrl : 'backend/read.php'
});

// Data loaded manually
store.load();
```

When manually calling `Store#load()` you can also supply parameters in object form, which will be appended to the
QueryString:

```javascript
store.load({ from : 1, to : 1000 }); // -> backend/read.php?from=1&to=1000
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

When this store `isPaged`, the `responseTotalProperty` must be returned in the data packet to indicate the total size of
the dataset:

```json
{
    "success" : true,
        "total" : 100000,
        "data" : [
        { "id" : 1, "name" : "Leia" },
        { "id" : 2, "name" : "Lando" }
    ]
}
```

### Paging data

If the `pageParamName` or `pageStartParamName` config options are set, then the store will load data page by page. The
store sends either the required page, or the row index of the start of the required page. The page size is configured
using the `pageSize` config option.

If using a Grid, it may be convenient to use a `PagingToolbar` to control moving through the pages of data:

```javascript
new Grid({
    appendTo : containingElement,

    // Bottom toolbar controls the paging
    bbar : {
        type : 'pagingtoolbar'
    }
});
```

### Remote filtering

To request your server to provide the store's data filtered, configure the store with a `filterParamName`.

This is the name of an HTTP parameter which carries JSON representations of the filters that have been applied to the
store in the following format:

```json
{
  "field": "country",
  "operator": "=",
  "value": "sweden",
  "caseSensitive": false
}
```

The encoding may be overridden by configuring an implementation of `encodeFilterParams`
into the store which returns the value for the `filterParamName` when passed an _Iterable_ of filters.

### Remote sorting

To request your server to provide the store's data sorted, configure the store with a `sortParamName`.

This is the name of an HTTP parameter which carries JSON representations of the sorters that have been applied to the
store in the following format:

```json
{
  "field": "name",
  "ascending": true
}
```

The encoding may be overridden by configuring an implementation of `encodeSorterParams`
into the store which returns the value for the `sortParamName` when passed an _Iterable_ of sorters.

### Async operations

Loading data, as well as the other CRUD operations, are async operations. Calling `Store#load` returns a Promise, which
can be used as is or with async/await:

```javascript
// Using promise directly
store.load().then(() => console.log('loaded'));

// Using await
await store.load();
console.log('loaded');
```

You can also use a listener that will be triggered on load:

```javascript
const store = new Store({
    readUrl   : 'backend/read.php',
    listeners : {
        load() {
            console.log('loaded');
        }
    }
});

// Or

store.on('load', () => console.log('loaded'));
```

The same concept holds true when committing changes manually, as described below (`Store#commit()`).

## Modifying data

How to modify data in the store (add, insert, remove, update) is described in the guide "Using a Store". When using an
`AjaxStore`, no changes are sent to the backend until `Store#commit()` is called. This can either be done manually or
automatically:

```javascript
store.commit(); // Commits any changes, using the configured urls per action

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
store.add([
    { name : 'Han' },
    { name : 'Leia' }
]);

// Post to server
data = [{ "name" : "Han" }, { "name" : "Leia" }]
```

Server is expected to respond with **valid JSON** containing data for the the same records with any missing data filled
in (such as id). The response takes the same format as for reading data.

```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Han" },
    { "id": 2, "name": "Leia" }
  ]
}
```

### Updated records

Works much the same way as when adding records, but posts to `updateUrl`:

```javascript
// Modifying some records and committing changes
store.getAt(0).name = 'Kylo';
store.getAt(1).name = 'Rey';
store.commit();

// Post to server
data = [
    { id : 1, name : 'Kylo' }, 
    { id : 2, name : 'Rey' }
]
```

Please note that by default, only changed fields and any fields configured
with [alwaysWrite](#Core/data/field/DataField#config-alwaysWrite) are sent. If you want all fields to be sent always,
please see [writeAllFields](#Core/data/AjaxStore#config-writeAllFields). The server is expected to respond with
**valid JSON** in the same format as for adding records.

### Removed records

Has the simplest requirements of the different operations. Posts ids of removed records to `deleteUrl`:

```javascript
// Removing some records and committing
store.getById(1).remove();
store.getById(2).remove();
store.commmit();

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