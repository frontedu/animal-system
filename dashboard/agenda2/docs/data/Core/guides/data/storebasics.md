# Using a Store

This guide shows how to manage records in a `Store`, for example how to retrieve records and how to sort or filter the
store. It assumes you have read the "Displaying data" guide, which has info on how to create a Store, populate it with
data and how to use it with your grid.

## Store example

The store outlined in code below is referred to in the examples ahead in this guide:

```javascript
const store = new Store({
    data : [
        { id : 1, name : 'Ms. Marvel', powers : 'Shapeshifting' },
        { id : 2, name : 'Black Widow', powers : 'Martial arts' },
        { id : 3, name : 'Captain Marvel', powers : 'Flight, Energy projection' },
        { id : 4, name : 'X-23', powers : 'Regeneration' },
        { id : 5, name : 'Mockingbird', powers : 'Martial arts' }       
    ]
});
```

## Retrieving records

A `Store` can be seen as a collection of records with functionality to manage them. To retrieve a record, it is easiest
to do it using its index or id:

```javascript
store.getAt(1); // Black Widow
store.getById(3); // Captain Marvel
```

There are also shortcuts to get the first or last record:

```javascript
store.first; // Ms. Marvel
store.last; // Mockingbird
```

You can search for a single record:

```javascript
store.find(record => record.name.startsWith('M')); // Ms. Marvel
store.findRecord('name', 'X-23'); // X-23, surprise
```

Or query for multiple:

```javascript
store.query(record => record.name.startsWith('M')); // [Ms. Marvel, Mockingbird]
```

## Sorting

A `Store` can be sorted by a single field or by multiple fields. Sort can be specified at creation time using stores
config:

```javascript
const store = new Store({
    sorters : [
        { field : 'powers' }, // ascending
        { field : 'name', ascending: false } // descending
    ]
});
```

After creation it can be sorted as below: 

```javascript
store.sort('name'); // Sort by name, ascending first time, toggles on additional calls
store.sort('name', false); // Sort by name, descending

store.addSorter('powers'); // Also sort by powers
store.removeSorter('powers'); // Stop sorting by powers
```

## Filtering

Filtering makes the store expose a subset of its records. When iterating or querying the store only this subset will be
used. Examples on filtering:

```javascript
store.filter('powers', 'Martial arts'); // Black Widow, Mockingbird

store.filter({
    property : 'id',
    operatior : '<',
    value : 4
}); // Ms. Marvel, Black Widow, Captain Marvel

store.removeAllFilters(); // Remove filters
```

## Iterating over records

The records in the store can be iterated over in a couple of ways. Using for-of:

```javascript
for (let record of store) {
    console.log(record.name);
}
```

Or by using forEach:

```javascript
store.forEach(record => {
    console.log(record.name);
});
```

The stores implementation of forEach differs from the native arrays by allowing you to terminate the iteration by
returning false.

## CRUD operations

### Adding records

You can easily add existing records or raw data:

```javascript
store.add({ name : 'Scarlet Witch' });

// or

store.add(new Model({
  name : 'Storm',
  powers : 'Weather'
}));
```

Same goes for insertion:

```javascript
store.insert(0, { name : 'She-Hulk' });

// or

store.insert(0, new Model({
  name : 'Medusa',
  powers : 'Hair'
}));
```

### Removing records

Either retrieve a record and and call `Model#remove()` or remove it using its id:

```javascript
store.remove(1); // Removes Ms. Marvel

store.last.remove(); // Removes Mockingbird
```

### Modifying records

Fields in a record are turned into setters which can be assigned to to update the record, making it reactive. Doing so
triggers events that updates the grid (if the store is used with a grid). To modify a record, simply retrieve it and set
values:

```javascript
store.last.name = 'Jennifer Walters';
```

To set multiple fields in a single go:

```javascript
store.last.set({
    name : 'Jennifer Walters',
    powers : 'Strength'
});
```

## JSON

If you want to serialize the contents of a store, you can access the data from all of its records in JSON format:

```javascript
 const jsonString = store.json;
 
 // or
 
 const jsonArray = store.toJSON();
```
 
 To plug the JSON data back in later:
 
```javascript
 store.json = jsonString;
 
 // or
 
 store.data = jsonArray;
```


<p class="last-modified">Last modified on 2022-05-30 6:38:15</p>