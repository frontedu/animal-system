# Crud manager

## Introduction

Crud manager is a mixin that adds data persistence functionality for a collection of [data stores](#Core/data/Store).
It solves the data consistency problem which will inevitably appear if managing multiples stores with related data separately.

To illustrate the data consistency problem: Assume we have two stores, one of them contains references to the entities
in another. We add new records to both stores and issues a "save" command. If we would be managing every store
separately, network communication for one of them can fail and succeed for the other. This can easily lead to inconsistent
state of the data.

To solve this problem, the Crud Manager treats those stores as a single dataset, and combines changes from all stores
into a single HTTP request.

## Architecture

The core of the Crud Manager is the [AbstractCrudManagerMixin](#Scheduler/crud/AbstractCrudManagerMixin) mixin. It can be mixed into any class,
providing data persistence capabilities. The consuming class should also add 2 additional mixins, for Encoding and Transport.

### Encoding mixin

The Encoding mixin is responsible for serialization of the data package (encoding/decoding to/from string). Currently, the only
implementation of the encoding mixin is the [JsonEncoder](#Scheduler/crud/encoder/JsonEncoder).

Custom implementations of this mixin must have two methods:
- `encode` - encodes packages before they are sent to a server (from `Object` to a `string`). Supposed to be overridden in case data provided by the CRUD manager has to be transformed into format requested by server.
- `decode` - decodes server responses (from `string` to an `Object`). Supposed to be overridden in case data provided by server has to be transformed into format requested by the CRUD manager.

### Transport mixin

The Transport mixin is responsible for transferring data to the server (sending and receiving). Currently the only
implementation of the encoding mixin is the [AjaxTransport](#Scheduler/crud/transport/AjaxTransport)

Custom implementations of this mixin must implement two methods:

- `sendRequest` - sends a request to a server
- `cancelRequest` - cancels a request

### Core API

The core API of the Crud Manager consists from these methods:

- [addCrudStore](#Scheduler/crud/AbstractCrudManagerMixin#function-addCrudStore) - Adds a new [store](#Core/data/Store) to the
collection of managed stores
- [load](#Scheduler/crud/AbstractCrudManagerMixin#function-load) Loads a new data package from the server. The data package will contain
data for all stores managed by the crud manager.
- [sync](#Scheduler/crud/AbstractCrudManagerMixin#function-sync) Persists the changes from all managed stores to the server.

Please also refer to [AbstractCrudManagerMixin](#Scheduler/crud/AbstractCrudManagerMixin) docs, for a full list of available properties.

## Data revisions

The server interaction protocol supports a _server revision stamp_ (a number incremented after every data update on the server).
Based on this value, the server may reject a save-request, containing possibly outdated data. This can be useful in case of a system with lots of concurrent
 data write operations, offering you additional control on data integrity and consistency.

This capability is optional and can be easily turned on or off in the server-side code depending on your requirements.

## Loading data

Data can either be loaded by calling the [load](#Scheduler/crud/AbstractCrudManagerMixin#function-load) method or, declaratively
by setting the [autoLoad](#Scheduler/crud/AbstractCrudManagerMixin#config-autoLoad) config to `true`.
Load requests are performed asynchronously. To be notified of when a load operation is completed, use the returned promise,
or listen to the [load event](#Scheduler/crud/AbstractCrudManagerMixin#event-load).

When the data has been fetched, it is loaded to each of the stores in the same order as the stores were registered in the Crud manager.
Please take a look at the [addCrudStore](#Scheduler/crud/AbstractCrudManagerMixin#function-addCrudStore) method for more details on
how to register stores in a particular order.

### Load request structure

In order to review the CrudManager request/response packages let's imagine a sample dataset
that includes three stores:

1. `writers` which contains list of writers and has following fields:
    - `id` writer identifier
    - `name` writer first name
    - `surname` writer surname
2. `books` which contains list of books and has following fields:
    - `id` book identifier
    - `title` book title
    - `published` year the book was published
    - `added_dt` date time the book was added to the database
    - `updated_dt` date time the book was last updated in the database
3. `authors` which contains a list of book authors (references `writers` and `books` tables) and has the following fields:
    - `id` record identifier
    - `book_id` record identifier
    - `writer_id` writer identifier

The following example illustrates how a load request package could look for this data structure:

```json
    {
        "requestId"   : 123,
        "type"        : "load",
        "stores"      : [
            {
                "storeId"     : "books",
                "someParam"   : "abc"
            },
            "authors",
            "writers"
        ]
    }
```

In the above example:

- `requestId` property contains a unique request identifier included with every request (filled automatically by the CrudManager)
- `type` property is the request type (`load` - for load requests, `sync` - for sync requests)
- `stores` section contains the list of stores to be loaded. As the bare minimum, each store can be represented with its identifier (as it's done for `authors` and `writers` in the example) but optionally they can be represented with an object to pass as a store descriptor in the JSON `data` parameter.
These parameters can be provided in the [load](#Scheduler/crud/AbstractCrudManagerMixin#function-load) method.

```javascript
    crudManager.load({
        // specify a data object for books store
        books : {
            someParam : 'abc'
        }
    });
```

### Passing HTTP Parameters

A special `request` option to the [load](#Scheduler/crud/AbstractCrudManagerMixin#function-load) method is passed into the [sendRequest](#Scheduler/crud/transport/AjaxTransport#function-sendRequest) method to allow the HTTP request to be modified. For example, to add extra HTTP parameters, use

```javascript
    crudManager.load({
        // specify options for the AjaxTransport's HTTP request
        request : {
            params : {
                startDate : '2020-09-01'
                endDate   : '2020-10-01'
            }
        }
    });
```

### Store identifiers

The store identifiers used in the Crud Manager server communication protocol are taken from the corresponding stores `storeId` property by default.
This behavior can be changed to force the Crud Manager to retrieve the identifiers from another property
(see [storeIdProperty](#Scheduler/crud/AbstractCrudManagerMixin#config-storeIdProperty) for details).

### Load response structure

Then response for the load request described in "Load request structure" chapter could look like this:

```json
    {
        "success"     : true,
        "requestId"   : 123,
        "revision"    : 5,

        "books"       : {
            "rows" : [
                { "id" : 65, "title" : "War and Peeace", "published" : 1826, "added_dt" : "2019-01-01T00:00:00", "updated_dt" : null },
                { "id" : 9000, "title" : "The Last of the Mohicans", "published" : 1869, "added_dt" : "2019-01-01T00:00:00", "updated_dt" : null },
                { "id" : 9001, "title" : "The Last of the Mohicans", "published" : 1869, "added_dt" : "2019-04-25T13:56:17", "updated_dt" : null }
            ],
            "metaData" : {
                "most-popular-book-id" : 9000
            },
            "total" : 5
        },

        "writers"      : {
            "rows" : [
                { "id" : 1, "name" : "Leo", "surname" : "Tolstoy" },
                { "id" : 2, "name" : "James Fenimore", "surname" : "Cooper" }
            ],
            "total" : 2
        },

        "authors"      : {
            "rows" : [
                { "id" : 1, "book_id" : 65, "writer_id" : 1 },
                { "id" : 2, "book_id" : 9000, "writer_id" : 2 },
                { "id" : 3, "book_id" : 9001, "writer_id" : 2 }
            ],
            "total" : 2
        }
    }
```

In the above example:

- `success` a Boolean property, `true` indicates a successful operation, `false` would mean some server error occurred
- `requestId` contains the corresponding request identifier
- `revision` is the current _server revision stamp_

The store data is placed under each corresponding store identifier. A store data section has:

- `rows` - An array of store records
- `total` - The total number of records
- `metaData` - optionally server can return some extra data transferred with the store records. This object is available for usage by your application logic in the `response` param of the `load` event.

## Saving data

A save operation is triggered by calling [sync](#Scheduler/crud/AbstractCrudManagerMixin#function-sync) call or it can be invoked
automatically after any data change if the [autoSync](#Scheduler/crud/AbstractCrudManagerMixin#config-autoSync) config is set to `true`.
A sync request is performed asynchronously. To be notified upon completion, use the returned Promise, or listen to the
[sync event](#Scheduler/crud/AbstractCrudManagerMixin#event-sync).

After a save request is completed, the CRUD manager applies the server-side response to each individual store.

**Note: It's highly recommended to prevent users from changing data in the stores while a sync operation is ongoing.
The Crud Manager tries to queue additional sync requests if a user triggers a sync before a prior request is done.
But still, data changes done in parallel with ongoing sync requests may easily lead to the inconsistent state of your data,
so the recommendation is to use GUI masking technique to prevent such scenarios.**

### Sync request structure

Now in order to review the data persisting request package, let's imagine that user has made the following changes in the stores we described above:

1. user has noticed a typo in the "War and Peace" title (double "ee" - "War and Peeace") and fixed it
2. user has added "Pet Sematary" book written by Stephen King (so he added records to all three tables)
3. and finally user has found out that he had mistakenly added "The Last of the Mohicans" book twice, so he has removed the unneeded entries in both `books` and `authors` stores.

Here is how a _sync request_ object could look for such changes:

```json
    {
        "requestId" : 124,
        "type"      : "sync",
        "revision"  : 5,

        "books"     : {
            "added" : [
                { "$PhantomId" : "book-123", "title" : "Pet Sematary", "published" : 1983 }
            ],
            "updated" : [
                { "id" : 65, "title" : "War and Peace" }
            ],
            "removed" : [
                { "id" : 9001 }
            ]
        },

        "writers"      : {
            "added" : [
                { "$PhantomId" : "writer-321", "name" : "Stephen", "surname" : "King" }
            ]
        },

        "authors"      : {
            "added" : [
                { "$PhantomId" : "author-555", "book_id" : "book-123", "writer_id" : "writer-321" }
            ],
            "removed" : [
                { "id" : 3 }
            ]
        }
    }
```

In the above example:

- `requestId` property is the unique request identifier
- `type` property is the request type `sync` or `load` (`sync` in this case since we are persisting data)
- `revision` property is the current _server revision stamp_ the client has

For each store, the request has three sections `added`, `updated` and `removed` under which the corresponding records are placed.
The presence of each section is optional depending on the presence of such type of modifications.

Each added record is sent including its _phantom identifier_ (auto-generated client side unique value used to identify the record) ([by default](#Scheduler/crud/AbstractCrudManagerMixin#config-phantomIdField) the `$PhantomId`,  field name is used). This is illustrated for all three stores due to the newly added "Pet Cemetary" book which also required adding of records to `writers` and `authors` stores.

**Note: Please do not persist phantom record identifiers as-is on the server. That might cause collisions on the client after data reloading. It's expected that backend assigns new identifiers to added records.**

Each updated record data includes its identifier plus the updated field values. This is illustrated by fixing the typo in "War and Peace" title.

And finally for removed records, only their identifiers are transferred (demonstrated by removed book and author).

### Sync response structure

The Response to the sync request basically has two objectives:

1. to confirm that certain changes were applied
2. to update the client with any changes that were made by the server

As reaction to the request described in the previous chapter we could have the following response:

```json
    {
        "success"     : true,
        "requestId"   : 124,
        "revision"    : 6,

        "books" : {
            "rows" : [
                { "$PhantomId" : "book-123", "id" : 9002, "added_dt" : "2019-04-26T18:45:00" },
                { "id" : 65 }
            ],
            "removed" : [
                { "id" : 9001 }
            ]
        },

        "writers" : {
            "rows" : [
                { "$PhantomId" : "writer-321", "id" : 3 }
            ]
        },

        "authors" : {
            "rows" : [
                { "$PhantomId" : "author-555", "id" : 4, "book_id" : 9002, "writer_id" : 3 }
            ],
            "removed" : [
                { "id" : 3 }
            ]
        }
    }
```

In the above example:

- `requestId` is the matching request identifier
- `success` is a flag which indicates status of the operation. If `true`, indicates a successful response, dirty records will be marked as clean automatically. If `false`, operation is considered to be failed and the records continue to stay dirty and will be a part of next sync request.
- `revision` provides an up-to-date _server revision stamp_ from the server

For each store we have two sections: `rows` and `removed`, where:

- `rows` holds all records added or updated _by the server_.
As the bare minimum, for added records sent from the client, the server returns a combination of record _phantom identifier_ and its "real" identifier  assigned by the database.
If the server decides to update _any_ other fields of _any_ record it should return an object holding a combination of the record identifier and new field values.
The field values will be applied to the corresponding store record on the client. **Note** that this way the server can also provide new records to the client by passing them in the `rows` section.
- `removed` holds ids of records removed _by the server_ whether initially sent from client or removed due to some server logic.

## Error handling

In case of an error happening while loading or persisting, the response object will look like this:

```json
    {
        "success"   : false,
        "requestId" : 123890,
        "message"   : "Error description goes here",
        "code"      : 13
    }
```

In the above example:

- `success` is `false` indicating that an error has occurred. Not staged changes will be a part of next sync request.
- `requestId` has the failed request identifier
- `message` contains the error message
- `code` has an optional error code

Both [load](#Scheduler/crud/AbstractCrudManagerMixin#function-load) and [sync](#Scheduler/crud/AbstractCrudManagerMixin#function-sync) methods return `Promise`s so error handling looks like this:

```javascript
    const crudManager = new CrudManager({
        /*...*/
        transport       : {
            load : {
                url : 'php/read.php'
            },
            sync : {
                url : 'php/save.php'
            }
        }
    });

    crudManager.load().
        // no load errors occurred
        then(() => {
            /*...*/
        }).
        // loading failed
        catch(response => {
            // show notification with error message
            Toast.show(response && response.message || 'Unknown error occurred');
        });
```

Alternatively you can listen to the [loadFail](#Scheduler/crud/AbstractCrudManagerMixin#event-loadFail)
and [syncFail](#Scheduler/crud/AbstractCrudManagerMixin#event-syncFail) events:

```javascript
    let crudManager;

    // A function to handle CRUD errors
    function processError(event) {
        // error code
        const response = event.response,
              code = response && response.code;

        // here we can define some specific reactions on certain errors
        if (code === 13) {
            // for example re-load crudManager
            crudManager.load();

        // and for all other cases we just display the error message
        } else {
            // show notification with error message
            Toast.show(response && response.message || 'Unknown error occurred');
        }
    };

    crudManager = new CrudManager({
        autoLoad        : true,
        /*...*/
        transport       : {
            load : {
                url : 'php/read.php'
            },
            sync : {
                url : 'php/save.php'
            }
        },
        listeners       : {
            // listen to load request errors
            loadFail : processError,
            // listen to sync request errors
            syncFail : processError
        }
    });
```


<p class="last-modified">Last modified on 2022-05-30 6:38:15</p>