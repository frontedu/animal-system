# Store specification

This document describes in detail how you can interact with the Store API to load/save the data displayed in the grid,
which events it triggers when and what server responses it expects when using [`AjaxStore`](#Core/data/AjaxStore).

All changes are kept local until [`Store#commit()`](#Core/data/AjaxStore#function-commit) is called. Store may be
configured with [`Store#autoCommit`](#Core/data/mixin/StoreCRUD#config-autoCommit) to always commit changes
automatically.

## Exceptions from an AjaxStore

If errors are signalled during server requests, an `exception` event will be triggered, and the `Promise` returned from
the `commit` or `load`
call will be rejected. The parameter passed to the reject function and the `exception` event object is an object which
describes the error. See [`AjaxStore`](#Core/data/AjaxStore) documentation for details.

## Create

### Records in local store

Adding to the store using either [`Store#add()`](#Core/data/mixin/StoreCRUD#function-add)
or [`Store#insert()`](#Core/data/mixin/StoreCRUD#function-insert) triggers the following behaviour:

1. If raw data is added, convert it into a record using configured
   Model ([`Store#modelClass`](#Core/data/Store#config-modelClass)). Also assigns the new record a generated id if none
   was specified.
2. Add to store
    - Add raw data to `Store#data`
    - Add record to `Store#records`
    - Add record to `Store#added` (only contains records added since last commit)
3. Assign the store to the record (`Model#stores`)
4. Init record relations, if any
5. Update `Store#idMap`, which is used for fast lookups by id or index
6. Trigger events
    - Trigger `add` event
    - Trigger `change` event (triggered on all manipulations of store data)

Committing added records in a local store simply empties the `Store#added` array, to signal that records are now
considered as adequate members of the store. Committing triggers the following behaviour:

1. Trigger `beforeCommit` event, which is cancelable
2. Clear stored changes (accept them)
3. Trigger `commit` event
 
### Records in AjaxStore

Adding a record to an AjaxStore follows the same behaviour as outlined in 1 - 6 above, but replaces the behaviour upon
commit with the following:

1. Trigger events:
    - Trigger `beforeCommit` event, which is cancelable
    - Trigger `beforeRequest` event
2. Post the added records to the configured url as Ajax with JSON encoding (`AjaxStore#createUrl`). Post has the
   following format: `data=[{ field1: xx, field2: xx, ... }, ...]`
3. Server is expected to return a JSON encoded response containing:
    - A success property `{ "success" : true/false }`
    - Upon success, also an array of JSON encoded objects corresponding to the added records. These objects should at
      least contain id:s assigned by the server to replace any locally generated
      ids: `{ "success": true, "data": [ { "id": 1 }, ... ] }`
4. If server call is unsuccessful trigger `exception` event and abort commit
5. If server call was successful, continue
6. Update `Store#idMap`, which is used for fast lookups by id or index
7. Trigger events:
    - Trigger `commitAdded` event
    - Trigger `refresh` event
    - Trigger `afterRequest` event
    - Trigger `commit` event

## Read

### Setting already available data

Assigning an array of json data to `Store#data` loads it into the store and triggers the following behaviour:

1. Clear any exsting data by calling `Store#clear()`
2. If raw data is loaded, convert it into records using configured model (`Store#modelClass`)
3. Apply sorting, grouping & filtering
4. Update `Store#idMap`, which is used for fast lookups by id or index
5. Trigger events:
   - Trigger `refresh` event, with `{ action : 'dataset' }`
   - Trigger `change` event, with `{ action : 'dataset' }` (triggered on all manipulations of store data)

### Loading data using AjaxStore

Loading data using Ajax by calling `AjaxStore#load()` (or configuring `Store#autoLoad`) triggers the following
behaviour:

1. Trigger events:
   - Trigger `beforeLoad` event, which is cancelable
   - Trigger `loadStart` event
   - Trigger `beforeRequest` event
2. Set `Store#isLoading` to true, to prevent actions that should not occur while loading
3. Make Ajax request to configured url (`AjaxStore#readUrl`)
4. If server request fails, trigger `exception` event and abort
5. Server is expected to return an array of JSON encoded data upon success
6. Assign returned data to `Store#data`, triggering steps 1 - 5 in the previous section
7. Clear any uncommited changes
8. Trigger events:
   - Trigger `load` event
   - Trigger `afterRequest` event

## Update

### Records in local store

Modifying records in a local store (by either using a models properties or `Model#set()`) triggers the following
behaviour:

1. Modify value
2. Store old value in `record.meta.modified`
3. Flag model as changed (`record.meta.changed`)
4. If changing a foreign id (when using model relations), also update the relation
5. Add to `Store#modified[]` for all containing stores, if not already present in `Store#added`
6. If changing id:
   - Update `Store#idMap`
   - Trigger `idChange` event on store
7. Trigger events on store:
   - Trigger `update` event
   - Trigger `change` event (triggered on all manipulations of store data)

Committing modified records in a local store simply empties the `Store#modified[]` array and
clear `record.meta.modified` and `record.meta.changed` for all modified records. Committing triggers the following
behaviour:

1. Trigger `beforeCommit` event, which is cancelable
2. Clear stored changes (accept them)
3. Trigger `commit` event

### Records in AjaxStore

Modifying records in an AjaxStore triggers the same behaviour as outlined in steps 1 - 7 above. Committing triggers the
following behaviour:

1. Trigger events:
    - Trigger `beforeCommit` event, which is cancelable
    - Trigger `beforeRequest` event
2. Post modifications from the modified records to the configured url as Ajax with JSON encoding (`AjaxStore#updateUrl`)
   . Post has the following format: `data=[{ id: 1, field1: xx, field2: xx, ... }, ...]`
3. If server call is unsuccessful, trigger `exception` event and abort
4. If server call was successful, continue
5. Clear stored changes (accept them)
6. Update `Store#idMap`, which is used for fast lookups by id or index
7. Trigger events:
    - trigger `commitModified` event
    - trigger `refresh` event
    - Trigger `afterRequest` event
    - Trigger `commit` event

## Destroy

### Records in local store

When removing records from a local store by either
calling [`Store#remove()`](#Core/data/mixin/StoreCRUD#function-remove)
or [`Model#remove()`](#Core/data/Model#function-remove) the following behaviour is triggered:

1. Remove record from store
2. If record is added but not committed, also remove from `Store#added[]`
3. Otherwise add record to `Store#removed[]`
3. Update relations, if any
4. Flag record as removed, by setting `record.meta.removed`
4. Update `Store#idMap`, which is used for fast lookups by id or index
5. Trigger events:
   - trigger `remove` event
   - trigger `change` event (triggered on all manipulations of store data)

Committing removed records in a local store simply empties `Store#removed[]`. It triggers the following:

1. Trigger `beforeCommit` event, which is cancelable
2. Clear stored changes (accept them)
3. Trigger `commit` event

### Records in AjaxStore

Removing records from an AjaxStore triggers the same behaviour as outlined in steps 1 - 5 above. Committing triggers the
following:

1. Trigger events:
   - Trigger `beforeCommit` event, which is cancelable
   - Trigger `beforeRequest` event
2. Post ids of removed records using Ajax to `AjaxStore#destroyUrl`. Post has format `id=x,y,...`
3. If server call is unsuccessful, trigger `exception` event and abort
4. If server call was successful, continue
5. Clear stored changes (`Store#removed[]`)
6. Trigger events:
   - Trigger `commitRemoved` event
   - Trigger `refresh` event
   - Trigger `afterRequest` event
   - Trigger `commit` event

### Sending HTTP Headers
You can configure the AjaxStore to append HTTP headers to its server requests by using the `headers` config.

```
// Configuring headers for each request
const store = new AjaxStore({
    readUrl : 'backend/read.php',
    headers : {
        'Content-Type'   : 'text/xml',
        'Accept-Charset' : 'utf-8'
    }
});
```


<p class="last-modified">Last modified on 2022-05-30 6:38:15</p>