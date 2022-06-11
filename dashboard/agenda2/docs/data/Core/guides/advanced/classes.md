# The class system

All Bryntum classes extend a `Base` class which provides services which the subclasses need and which simplify object
creation and configuration.

New classes which participate in the Bryntum ecosystem should use this convention.

## Construction

Subclasses which inherit from `Base` must not implement a `constructor`.

Instead, they _may_ implement a `construct` method which will be called immediately upon construction, passed the same
parameters as the caller passed to the constructor.

This lifts the restriction that the `this` reference is not available until the `super` call. Subclasses may perform
certain operations upon themselves based upon incoming configuration information *before*
calling `super.construct(config)` and passing all the parameters upwards.

Note that due to automatic application of configuration by the `Base` class, it is often not necessary to write
a `construct` method at all. Processing of incoming configuration values should be done in `changeConfigName`
and `updateConfigName` functions which may be implemented for named "configurable" config properties.

The purpose of a constructor is only to initialize private instance properties which are not available for
configuration, but which are needed for class operation.

## Configuration

When this `construct` call chain arrives at the `Base` class, the `construct` method there applies the configuration.

Configurable properties are defined in a static class method:

```javascript
    static get configurable() {
        return {
            /**
             * The name of the object
             * ＠config {String}
             */
            name : null,

            /**
             * The type of the object
             * ＠config {String}
             */
            type : null
        };
    }
```

For each of these, when set, the incoming value is passed through an ingestion process which may convert simple
incoming values to a final form which will be stored as that property value.

### Changers

If a configurable property needs to be "promoted" from a simple value into a final stored form, this is done by a
changer function. This is named according to the configurable property's name:

```javascript
    changeName(name, oldName) {
        return StringHelper.capitalize(name);
    }
```

A system-generated setter will call the changer, passing in the new, incoming value, and the old value. The value
which the property must be set to must be returned from the function.

If the function returns `undefined`, the property set operation is vetoed.

If the function returns a value that is equal to the old vale, the property set operation is vetoed.

Note that the underlying property named `_name` is set by the system-generated setter as the result of the changer,
you do not have to set the property.

### Updaters

If a new property value *is* set, in order to postprocess the new, incoming value, an updater function is called.
This is named according to the property's name:

```javascript
    updateName(name, oldName) {
        // The system ensures that type will be set as configured
        this.setTitleText(`Client name ${name}, type : ${this.type}`);
    }
```

You may have noticed that the updater of the `name` property requires that the `type` property already be ingested.

This issue is handled automagically by the configuration system as described in the next section.

### Config property ingestion ordering

Configuration properties are applied in a very special way. As part of the `Base` class's configuration, the incoming
config object is iterated and each property is set.

However, some configurations may depend on the presence, and preprocessing by the changer or updater of other configurations.

For example the `data` property of the `Grid` class depends upon the incoming `store` config having been
preprocessed and converted into a `Store` instance and cached to be available.

This *could* be done by writing a constructor which reads the incoming config object in a very specific order, and
applies the configs correctly.

But this approach is complex and brittle, and there are often interwoven and complex dependencies which may change as
the class changes.

The approach taken by the `Base` class is that for each incoming config property a *temporary* instance property is
defined, and the `getter` of that property will delete that temporary property, read the value from the incoming
configuration object, then set that property which will then pass through the class author's changer and updater
to become the true property value.

Then that *temporary* property `getter` returns the value of the property which will come through the system-generated
`getter` and the required, fully promoted value will be returned.

In this way, the `construct` function may be almost empty. All initialization takes place in property changers and
updaters which can rely on the presence of whatever configuration properties they need.

During initial configuration, the `isConfiguring` property is set to `true` on the instance so that setters can tell
whether the property is being set at instantiation time or later.

And for each config being set an `initializingPropName` flag is set so that if the setter ends up calling elsewhere, it
can always be determined that it is because of a certain config's initialization.

## Class properties versus configurations

Certain properties that a class may need to use should not be passed through this mechanism because there is a slight
overhead (the benefits described above far outweigh this in terms of robustness and flexibility).

If for example there are constant values, for example a CSS class name to be applied to a DOM element, then either
place it in a module-private `const`:

```javascript
import Base from "../Base.js";

const
    myCssClassName = 'my-css-class',
    myRegExp       = /^\s*(\w+)\s*:(.*)$/i;

export default class MyClass extends Base {
    
}
```

or, if it needs to be visible to outside code, place it onto the prototype:

```javascript
import Base from "../Base.js";

export default class MyClass extends Base {
    
}

MyClass.prototype.myCssClassName = 'my-css-class';
```

If the class needs to initialize per-instance properties for internal use then set them up in the `construct` method
before calling `super.construct(config)`

```javascript
import Base from "../Base.js";

export default class MyClass extends Base {
    construct(config) {
        this.addedRecords = [];
        this.removedRecords = [];
        this.modifiedRecords = [];

        super.construct(config);
    }
}
```


<p class="last-modified">Last modified on 2022-05-30 6:38:15</p>