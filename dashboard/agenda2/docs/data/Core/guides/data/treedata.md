# Using tree data

The built in `Store` (and its subclass `AjaxStore`) both handle tree data. This guide shows the basics of working with
such data.

## Loading tree data

As with flat data, tree data can be loaded either inline or using Ajax (see other "Working with data" guides for more
details on loading). Both methods by default expect data to contain child nodes in a `children` property on the parents:

```javascript
store.data = [
    {
        id : 1,
        name : 'Proud parent',
        age : 38,
        children : [
            { id : 11, name : 'First born', age : 6 },
            { id : 12, name : 'Some kid', age : 3 }
        ]
    }
]
```

The name of this property can be changed, by assigning to [`Model.childrenField`](#Core/data/Model#property-childrenField-static). See API docs for more information.

Records that are used in a tree are commonly also called nodes. There are two types of nodes:
leaf nodes and parent nodes. A leaf node is a node which has no children. A parent node is a node
which has children, or is going to have children when loading on demand is enabled.

To load a node as a leaf node, omit the [children](#Core/data/mixin/TreeNode#field-children) property, or set it to an empty array if
[convertEmptyParentToLeaf](#Core/data/mixin/TreeNode#property-convertEmptyParentToLeaf-static) is `true`.

To load a node as a parent node, provide at least one task to the [children](#Core/data/mixin/TreeNode#field-children) property,
or set it to an empty array or just `true` (to indicate load on demand) value if [convertEmptyParentToLeaf](#Core/data/mixin/TreeNode#property-convertEmptyParentToLeaf-static) is `false`.

In the case illustrated above, the store will have a `rootNode` property
with one child node which itself has two children.

A node has the following extra properties by virtue of its position in
the tree structure:

* [`parent`](#Core/data/mixin/TreeNode#property-parent) A reference to the parent node.
* [`parentIndex`](#Core/data/mixin/TreeNode#field-parentIndex) The node's index in the parent's `children` array.
* [`previousSibling`](#Core/data/mixin/TreeNode#property-previousSibling) A reference to the node's previous sibling if any.
* [`nextSibling`](#Core/data/mixin/TreeNode#property-nextSibling) A reference to the node's next sibling if any.
* [`childLevel`](#Core/data/mixin/TreeNode#property-childLevel) The visible level of the node with 0 being the top level nodes.

## Transforming flat data

Optionally a tree store can consume a flat dataset with nodes that have a `parentId` property. By configuring the
store with `tree : true` and `transformFlatData : true`, the flat data is transformed into tree data:

```javascript
const store = new Store({
  tree              : true,
  transformFlatData : true,
  data              : [
    { id : 1, name : 'ABBA' },
    { id : 2, name: 'Agnetha', parentId : 1 },
    { id : 3, name: 'Bjorn', parentId : 1 },
    { id : 4, name: 'Benny', parentId : 1 },
    { id : 5, name: 'Anni-Frid', parentId : 1 }
  ]
});
```

## Saving row order

When data is loaded to the store, [`parentIndex`](#Core/data/mixin/TreeNode#field-parentIndex) is set automatically
based on the nodes position. When task order is changed
[`parentIndex`](#Core/data/mixin/TreeNode#field-parentIndex) is updated. Therefore to save row order, need to persist
the field on the server, and when data is fetched to be loaded, need to sort it on the server by the field. This will
put nodes in correct order and nodes will receive correct parent indexes.

## Retrieving nodes

The "Using a Store" guide describes different ways of retrieving records. Currently only a couple of those are supported
for trees:

```javascript
// get node at any level by id
store.getById(12); // -> Some kid

// query for multiple nodes
store.query(node => node.age < 10); // -> [First born, Some kid]
```

## Traversing nodes

The nodes in a tree can be traversed using `Store#traverse()`:

```javascript
store.traverse(node => {
    // code to run per node
});
```

## CRUD operations

### Adding nodes

Add child nodes by first retrieving the parent node and then calling its `appendChild()` method supplying a model data
Object or a Model instance:

```javascript
const newBaby = store.getById(1).appendChild({
    name : 'Baby',
    age : 0
});
```

Same goes for insertion using `insertChild()`:

```javascript
const parent = store.getById(1),
    firstBorn = parent.insertChild({
        name : 'Actual first born',
        age : 18
    }, parent.children[0]);
```

### Removing nodes

Remove child nodes by first retrieving the parent node and then calling its `removeChild()` method supplying a Model
instance, or call the node's `remove()` method which routes through to its parent's `removeChild()` method:

```javascript
const parent = store.getById(1);
parent.removeChild(parent.children[1]); // Removes second kid
parent.removeChild(parent.children[0]); // Removes First born
```

### Modifying records

Works the same way as with flat data, see the ["Using a store"](#Core/guides/data/storebasics.md) guide.


<p class="last-modified">Last modified on 2022-05-30 6:38:15</p>