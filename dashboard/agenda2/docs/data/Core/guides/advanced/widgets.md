# Widgets

Bryntum components extend the `Widget` base class and build on its rendering capabilities to produce DOM elements and
listen for events. This guide demonstrates how to extend `Widget` by building a simple `Link` component.

## The Widget Class
Creating a custom widget starts with a class the extends the `Widget` base class (or some other class that ultimately
extends `Widget`).

For example, a `Link` component would look like the following:

```javascript
class Link extends Widget {
    static get configurable() {
        return {
            href : null,
            text : null
        };
    }

    compose() {
        const { href, text } = this;

        return {
            tag : 'a',
            href,
            text
        };
    }
}

const link = new Link({
    appendTo : document.body,
    text     : 'The link',
    href     : '#foo'
});
```

Widgets leverage configuration properties. These are declared by implementing the `static` (class-level) `configurable`
property getter. This getter returns an object containing the class's config properties. For the `Link` class, these
config properties mimic those of the DOM `<a>` element.

## Child Elements

Most widgets will need to render multiple elements. To illustrate, consider an enhancement to the `Link` widget to
add an external link icon. Instead of the simple `<a>` element, the new `Link` renders a `<div>` with one or two
child `<a>` elements.

```javascript
class Link extends Widget {
    static get configurable() {
        return {
            external : null,
            href     : null,
            target   : '_blank',
            text     : null
        };
    }

    compose() {
        const { external, href, target, text } = this;

        return {
            children : {
                linkElement : {
                    tag : 'a',
                    href,
                    text
                },
                
                externalLinkElement : external && {
                    tag   : 'a',
                    class : {
                        'b-fa'                   : 1,
                        'b-fa-external-link-alt' : 1
                    },
                    href,
                    target
                }
            }
        };
    }
}

const link = new Link({
    appendTo : document.body,
    text     : 'The link',
    href     : '#foo',
    external : true
});
```

The `children` property contains the child elements of the widget's main element. The element references for each named
element are stored on the widget instance using the key in the `children` object, i.e., `link.linkElement` and
`link.externalLinkElement`.

Note how the `externalLinkElement` property will be `null` if the `external` config property is not set to `true`. When
`external` is `null`, this has the effect of not rendering the second child element, with the `link.externalLinkElement`
reference being set to `null`. When `external` is true, the second child is rendered and `link.externalLinkElement` is
set accordingly.

Setting the `text` or `href` config properties on the `link` instance automatically updates the rendered element in the
DOM.

```javascript
link.text = 'New link text';
link.href = '#bar';
```

### Change Detection

Changes to config properties are detectable due to the convention illustrated above where all relevant config property
values are retrieved at the top of the `compose()` method. This pattern allows the `Widget` base class to detect the
getter calls on these config properties when the first instance of a class is rendered. Because this first instance
retrieves all config properties used by the `compose()` method, their use will not be hidden by short-circuit
expressions had they been accessed directly from `this` when computing the returned object.

### Recomposition

When a config used by `compose()` is modified, the `recompose()` method is called automatically. This method does not
immediately update the DOM. The DOM will be updated on the next animation frame where all changes made to the widget
will be incorporated by again calling `compose()` and applying any necessary changes to the DOM.

Accessing a child element (e.g., `link.linkElement`) or the main element (`link.element`) of a widget will flush any
pending updates to the DOM.

## Inheritance and `compose()`

When extending a base class such as `Link`, the derived class can customize the elements by implementing a `compose()`
method of its own. Unlike typical inherited methods, the `compose()` methods of all classes are automatically called
and their returned objects are merged key-by-key. Values returned by the base class are overwritten by the derived class
where key names match.

Consider the following class derived from the `Link` class above.

```javascript
class CopyableLink extends Link {
    static get configurable() {
        return {
            copyIcon : 'b-fa-copy'
        };
    }
    
    compose() {
        const { copyIcon } = this;

        return {
            children : {
                copyIconElement : {
                    tag   : 'span',
                    class : {
                        'b-fa'     : 1,
                        [copyIcon] : 1
                    }
                }
            }
        };
    }
}

const link = new CopyableLink({
    appendTo : document.body,
    text     : 'Copyable link',
    href     : '#foo'
});
```

The object returned by this implementation of `compose()` is merged with the object returned by the `compose()` method
of the `Link` base class to produce a `children` object with all three keys (`linkElement`, `externalLinkElement`, and
`copyIconElement`).

## Handling Events

To complete the functionality of `CopyableLink`, an event handler is needed to copy the link to the clipboard when the
user clicks on the copy icon. This is accomplished by added a `listeners` property to the element(s) that need them.

```javascript
class CopyableLink extends Link {
    static get configurable() {
        return {
            copyIcon : 'b-fa-copy'
        };
    }
    
    compose() {
        const { copyIcon } = this;

        return {
            children : {
                copyIconElement : {
                    tag   : 'span',
                    class : {
                        'b-fa'     : 1,
                        [copyIcon] : 1
                    },
                    listeners : {
                        click : 'onCopyLink'
                    }
                }
            }
        };
    }

    onCopyLink(event) {
        navigator.clipboard?.writeText(this.linkElement.href);
    }
}

const link = new CopyableLink({
    appendTo : document.body,
    text     : 'Copyable link',
    href     : '#foo'
});
```

The `listeners` object contains event names as keys and handler method names as values. In this case the `click` event
and the method `onCopyLink`.

## Child Element Order

The elements contained in the `children` object are created in the order in which they are
[declared](https://2ality.com/2015/10/property-traversal-order-es6.html) in that object. Elements added by derived
classes (as above) are appending to the inherited elements.

When this order is not desired, a derived class can use the `>` character in the keys of its `children` properties to
insert its elements before an inherited element.

```javascript
class CopyableLink extends Link {
    static get configurable() {
        return {
            copyIcon : 'b-fa-copy'
        };
    }
    
    compose() {
        const { copyIcon } = this;

        return {
            children : {
                // Insert copyIconElement before inherited externalLinkElement:
                'copyIconElement > externalLinkElement' : {
                    tag   : 'span',
                    class : {
                        'b-fa'     : 1,
                        [copyIcon] : 1
                    },
                    listeners : {
                        click : 'onCopyLink'
                    }
                }
            }
        };
    }

    onCopyLink(event) {
        navigator.clipboard?.writeText(this.linkElement.href);
    }
}

const link = new CopyableLink({
    appendTo : document.body,
    text     : 'Copyable link',
    href     : '#foo'
});
```

<div class="external-example" data-file="Core/guides/advanced/widgets.js"></div>

## Boilerplate

All `Widget` classes have some additional boilerplate content that was omitted above. These are shown below:

```javascript
export default class Link extends Widget {
    static get $name() {
        return 'Link';
    }

    static get type() {
        return 'link';
    }

    // ...
}

Link.initClass();
```

The `export` keyword is needed to export the class from its module. The `default` keyword is typically used when the
module has only one symbol to `export`.

The `$name` static class getter is needed due to class name compression by the code minifier. This should match what
would normally be returned by the `name` property of the constructor.

The `type` property specifies the short name for the widget. It is used when creating an instance from a config object.
From the above, the config object `{ type : 'link' }` would be able to create an instance of the `Link` class.

The `initClass()` method call actually registers the `Link` class with the widget factory to enable the above creation
from a config object.

## Caveats

The `Widget` class relies on the standard getter and setter for config properties. Overriding the getter will prevent
detection of configs used by `compose()` while overriding the setter will prevent detection of changes to configs and
the automatic call to `recompose()`. Best practice is to leave the getter and setter alone and implement only the
changer or updater methods when needed.


<p class="last-modified">Last modified on 2022-05-30 6:38:15</p>