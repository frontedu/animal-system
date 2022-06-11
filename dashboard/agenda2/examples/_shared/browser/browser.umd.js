"use strict";

var {
  Store,
  AjaxHelper,
  BrowserHelper,
  DomHelper,
  DomSync,
  EventHelper,
  Toolbar,
  Popup,
  Widget,
  GlobalEvents,
  VersionHelper,
  FunctionHelper
} = bryntum.calendar;




class ExamplesApp {
  constructor() {
    var me = this;
    me.product = window.bryntum.product;

    var version = VersionHelper.getVersion(me.product.name),
        groupOrder = window.groupOrder || {
      Pro: 0,
      'Integration/Pro': 1,
      Basic: 2,
      Intermediate: 3,
      Advanced: 4,
      Integration: 5,
      'Integration/Angular': 6,
      'Integration/Ionic': 7,
      'Integration/React': 8,
      'Integration/Vue': 9
    },
        examples = (window.examples || []).map(example => Object.assign({
      fullFolder: this.addTrailingSlash(this.exampleFolder(example)),
      id: this.exampleId(example)
    }, example)),
        storageName = name => `bryntum-${me.product.name}-demo-${name}`,
        saveToStorage = (name, value) => BrowserHelper.setLocalStorageItem(storageName(name), value),
        loadFromStorage = name => BrowserHelper.getLocalStorageItem(storageName(name)),
        store = me.examplesStore = new Store({
      data: examples,
      fields: ['folder', 'rootFolder', 'fullFolder', 'group', 'title', 'overlay', 'version', 'build', 'since', 'offline', 'ie', 'edge', 'id', 'updated'],
      groupers: [{
        field: 'group',
        fn: (a, b) => groupOrder[a.group] - groupOrder[b.group]
      }],
      listeners: {
        change() {
          if (me.rendered) {
            me.refresh();
          }
        },

        thisObj: me
      }
    });

    me.exampleStore = store;
    me.currentTipLoadPromiseByURL = {};
    me.testMode = BrowserHelper.queryString.test != null; // save scroll position

    me.beforeLoadScrollPos = document.getElementById('browser').scrollTop; // remove prerendered examples

    me.examplesContainerEl = document.getElementById('scroller');
    me.examplesContainerEl.innerHTML = '';
    EventHelper.on({
      scroll: {
        handler() {
          var _topElement$dataset$g, _topElement$dataset;

          var topElement = document.elementFromPoint(100, 150);
          jumpTo.value = (_topElement$dataset$g = topElement === null || topElement === void 0 ? void 0 : (_topElement$dataset = topElement.dataset) === null || _topElement$dataset === void 0 ? void 0 : _topElement$dataset.group) !== null && _topElement$dataset$g !== void 0 ? _topElement$dataset$g : null;
        },

        element: document.getElementById('browser'),
        throttled: 250
      },
      keydown: {
        handler(e) {
          // Hook CTRL/F to find
          if (e.key === 'f' && e.ctrlKey) {
            e.preventDefault();
            e.stopImmediatePropagation();
            e.cancelBubble = true;
            toolbar.widgetMap.filterField.focus();
            toolbar.widgetMap.filterField.selectAll();
          }
        },

        element: document.body
      }
    });
    document.getElementById('title').innerHTML = `${me.product.fullName} ${version}`;
    GlobalEvents.on({
      theme() {
        if (me.rendered) {
          me.refresh();
        }
      }

    });
    me.isOnline = BrowserHelper.isBryntumOnline('online');
    me.buildTip = me.isOnline ? 'This demo is not viewable online, but included when you download the trial. ' : 'This demo needs to be built before it can be viewed. ';
    var toolbar = new Toolbar({
      adopt: 'toolbar',
      // Handled by media queries hiding elements
      overflow: null,
      items: {
        jumpTo: {
          type: 'combo',
          width: '15em',
          triggers: {
            list: {
              cls: 'b-fa b-fa-list',
              align: 'start'
            }
          },
          editable: false,
          placeholder: 'Jump to',
          items: [{
            id: 'top',
            text: 'Top'
          }].concat(store.groupRecords.map(r => ({
            id: r.id,
            text: r.meta.groupRowFor
          }))),
          highlightExternalChange: false,

          onSelect({
            record,
            userAction
          }) {
            if (userAction && record) {
              if (record.id === 'top') {
                me.scrollToElement(document.querySelector('#intro'));
                jumpTo.value = null;
              } else {
                me.scrollToElement(document.querySelector(`a[data-group="${record.text}"]`));
              }
            }
          }

        },
        filterField: {
          type: 'filterfield',
          width: '15em',
          spellCheck: false,
          store,

          filterFunction(record, value) {
            // Check if all words in value exist in example title
            return value === null || value === void 0 ? void 0 : value.toLowerCase().split(' ').every(word => record.title.toLowerCase().includes(word));
          },

          placeholder: 'Type to filter',
          triggers: {
            filter: {
              cls: 'b-fa b-fa-filter',
              align: 'start'
            }
          },
          listeners: {
            change({
              value,
              userAction
            }) {
              saveToStorage('filter', value);

              if (userAction && !VersionHelper.isTestEnv && me.isOnline && value.length > 3) {
                me.logSearch(value);
              }
            }

          }
        },
        separator: '->',
        upgradeButton: {
          id: 'upgrade-button',
          type: 'button',
          text: 'Upgrade guide',
          icon: 'b-fa-book',
          href: me.isOnline ? `/docs/${me.product.onlineDocsId}/#upgrade-guide` : '../docs/#upgrade-guide'
        },
        docsButton: {
          id: 'docs-button',
          type: 'button',
          text: 'Documentation',
          icon: 'b-fa-book-open',
          href: me.isOnline ? `/docs/${me.product.onlineDocsId}/` : '../docs/'
        }
        
        ,
        trialButton: {
          type: 'trialbutton',
          productId: me.product.name,
          storeEmail: true
        }
        

      }
    });
    var {
      filterField,
      jumpTo
    } = toolbar.widgetMap;

    if (location.search.match('prerender')) {
      me.embedDescriptions().then(me.render.bind(me));
    } else {
      me.render();
    }

    if (!me.testMode) {
      var storedFilter = loadFromStorage('filter');
      storedFilter && (filterField.value = storedFilter);
    }

    this.examplesContainerEl.addEventListener('focusin', me.onFocusIn.bind(me));
    me.logSearch = FunctionHelper.createBuffered(me.logSearch.bind(me), 1000);
  }

  logSearch(value) {
    fetch(`/examplesearchlog.php?phrase=${encodeURIComponent(value)}&product_id=${encodeURIComponent(this.product.name)}`).catch(e => {});
  }

  onCloseClick() {
    document.getElementById('intro').style.maxHeight = '0';
  }

  onFocusIn({
    target
  }) {
    var _target$id;

    if (target !== null && target !== void 0 && (_target$id = target.id) !== null && _target$id !== void 0 && _target$id.startsWith('b-example')) {
      this.exampleElements.forEach(example => example.classList[example === target ? 'add' : 'remove']('b-focused'));
      window.location.hash = `#${target === null || target === void 0 ? void 0 : target.id.replace(/^b-/, '')}`;
    }
  }

  scrollToLocationHash() {
    // To prevent browser built-in scroll by location hash we use example and header ids with `b-` prefix
    if (window.location.hash) {
      var element = document.getElementById(`b-${window.location.hash.split('#')[1]}`);

      if (element) {
        this.scrollToElement(element);
        element.classList.add('b-focused');
        element.focus();
      }
    } // If no hash, and user has scrolled while loading, scroll to saved pos
    else if (this.beforeLoadScrollTop > 0) {
      document.getElementById('browser').scrollTop = this.beforeLoadScrollPos;
    }
  }

  scrollToElement(element) {
    if (element) {
      element.scrollIntoView(!VersionHelper.isTestEnv && {
        behavior: 'smooth'
      });
    }
  }

  getDomConfig() {
    var // Use the getter which relies on DomHelper.themeInfo getter which creates a DOM element and extracts theme name from it,
    // otherwise switching between themes will not change the examples preview pictures.
    {
      theme
    } = shared,
        version = VersionHelper.getVersion(this.product.name),
        isNew = example => version && example.since && version.startsWith(example.since),
        isUpdated = example => version && example.updated && version.startsWith(example.updated),
        configs = [];

    this.examplesStore.records.forEach(example => {
      if (example.isSpecialRow) {
        var group = example.meta.groupRowFor;
        configs.push({
          tag: 'h2',
          id: `b-${group}`,
          className: {
            'group-header': 1,
            [group]: 1
          },
          dataset: {
            syncId: `header-${group}`,
            group
          },
          html: group
        });
      } else {
        // Show build popup for examples marked as offline and for those who need building when demo browser is offline
        var hasPopup = example.build && !this.isOnline || example.offline,
            id = example.id;
        configs.push({
          tag: 'a',
          className: {
            example: 1,
            new: isNew(example),
            updated: isUpdated(example),
            offline: example.offline
          },
          id,
          draggable: false,
          href: !example.offline ? example.fullFolder : undefined,
          dataset: {
            linkText: hasPopup && this.exampleLinkText(example),
            linkUrl: hasPopup && example.fullFolder,
            syncId: id,
            group: example.group
          },
          children: [{
            className: 'image',
            children: [{
              tag: 'img',
              draggable: false,
              // enable image lazy loading. we don't really need the image from the invisible area
              // https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading#images_and_iframes
              loading: 'lazy',
              src: this.exampleThumbnail(example, theme),
              alt: example.tooltip || example.title || '',
              dataset: {
                group: example.group
              }
            }, {
              tag: 'i',
              className: {
                tooltip: 1,
                'b-fa': 1,
                [hasPopup ? 'b-fa-cog build' : 'b-fa-info']: 1
              }
            }, example.overlay ? {
              className: `overlay ${example.overlay}`
            } : null, example.version ? {
              className: 'version',
              html: example.version
            } : null]
          }, {
            tag: 'label',
            className: 'title',
            html: example.title,
            dataset: {
              group: example.group
            }
          }]
        });
      }
    });
    return configs;
  }

  refresh() {
    var me = this;
    DomSync.sync({
      targetElement: me.examplesContainerEl,
      domConfig: {
        onlyChildren: true,
        children: me.getDomConfig()
      },
      syncIdField: 'syncId'
    });
    me.exampleElements = document.querySelectorAll('.example');
  }

  render() {
    var me = this;
    me.refresh(); // A singleton tooltip which displays example info on hover of (i) icons.

    Widget.attachTooltip(me.examplesContainerEl, {
      forSelector: 'i.tooltip',
      header: true,
      scrollAction: 'realign',
      textContent: true,
      maxWidth: '18em',
      getHtml: async ({
        tip
      }) => {
        var activeTarget = tip.activeTarget;

        if (activeTarget.dataset.tooltip) {
          tip.titleElement.innerHTML = activeTarget.dataset.tooltipTitle;
          return activeTarget.dataset.tooltip;
        }

        var linkNode = activeTarget.closest('a');
        var url = `${linkNode.getAttribute('href') || linkNode.dataset.linkUrl}/app.config.json`; // Cancel all ongoing ajax loads (except for the URL we are interested in)
        // before fetching tip content

        for (var u in me.currentTipLoadPromiseByURL) {
          if (u !== url) {
            me.currentTipLoadPromiseByURL[u].abort();
          }
        } // if we don't have ongoing requests to the URL


        if (!me.currentTipLoadPromiseByURL[url]) {
          var requestPromise = me.currentTipLoadPromiseByURL[url] = AjaxHelper.get(url, {
            parseJson: true
          }),
              response = await requestPromise,
              json = response.parsedJson,
              html = activeTarget.dataset.tooltip = json.description.replace(/[\n\r]/g, '') + (/build/.test(activeTarget.className) ? `<br><b>${me.buildTip}</b>` : '');
          activeTarget.dataset.tooltipTitle = tip.titleElement.innerHTML = json.title.replace(/[\n\r]/g, '');
          delete me.currentTipLoadPromiseByURL[url];
          return html;
        }
      }
    });
    document.getElementById('intro').style.display = 'block';
    document.getElementById('close-button').addEventListener('click', me.onCloseClick.bind(me));
    document.body.addEventListener('error', me.onThumbError.bind(me), true);
    EventHelper.on({
      element: me.examplesContainerEl,

      click(event) {
        var el = DomHelper.up(event.target, '[data-link-url]');
        new Popup({
          forElement: el,
          maxWidth: '18em',
          cls: 'b-demo-unavailable',
          header: '<i class="b-fa b-fa-cog"></i> ' + (me.isOnline ? 'Download needed' : 'Needs building'),
          html: me.buildTip + `The demo can be found in distribution folder: <i class="b-fa b-fa-folder-open"></i><b>` + (!me.isOnline ? `<a href="${el.dataset.linkUrl}">${el.dataset.linkText}</a>` : el.dataset.linkText) + '</b>',
          closeAction: 'destroy',
          width: el.getBoundingClientRect().width,
          anchor: true,
          scrollAction: 'realign'
        });
        event.preventDefault();
      },

      delegate: '[data-link-url]'
    });
    EventHelper.on({
      element: me.examplesContainerEl,

      click(event) {
        // To be able to select example name, need to make the text do not work as a link
        if (window.getSelection().toString().length) {
          event.preventDefault();
        }
      },

      delegate: 'a.example label'
    });
    var demoDiv = document.getElementById('live-example'),
        widgetConfig = window.introWidget; // taken from `examples/_shared/data/widget.js`

    if (demoDiv && widgetConfig) {
      var createIntro = () => {
        // Use "appendTo" instead of "adopt" to insert Grid into the sized container.
        widgetConfig.appendTo = demoDiv;
        widgetConfig.requireSize = true;
        Widget.create(widgetConfig);
      }; // Only create the widget when the CSS decides that the host div becomes visible.


      if (DomHelper.getStyleValue(demoDiv, 'display') !== 'none') {
        createIntro();
      } else {
        var remover = EventHelper.on({
          element: window,

          resize() {
            if (DomHelper.isVisible(demoDiv)) {
              createIntro();
              remover();
            }
          }

        });
      }
    }

    me.rendered = true;
    me.scrollToLocationHash();
  }

  embedDescriptions() {
    return new Promise(resolve => {
      var promises = [];
      this.examplesStore.forEach(example => {
        promises.push(AjaxHelper.get(this.exampleConfig(example), {
          parseJson: true
        }).then(response => {
          var json = response.parsedJson;

          if (json) {
            example.tooltip = json.title + ' - ' + json.description.replace(/[\n\r]/g, ' ').replace(/"/g, '\'');
          }
        }));
      });
      Promise.all(promises).then(resolve);
    });
  }

  onThumbError(e) {
    var _e$target, _e$target$src;

    if ((_e$target = e.target) !== null && _e$target !== void 0 && (_e$target$src = _e$target.src) !== null && _e$target$src !== void 0 && _e$target$src.includes('thumb')) {
      e.target.style.display = 'none';
    }
  }

  addTrailingSlash(folder) {
    return folder.endsWith('/') ? folder : `${folder}/`;
  }

  exampleFolder(example, defaultRoot = '') {
    return `${example.rootFolder || defaultRoot}${example.folder}`;
  }

  exampleConfig(example) {
    return `${example.fullFolder}app.config.json`;
  }

  exampleId(example) {
    return `b-example-${this.exampleFolder(example).replace(/\.\.\//gm, '').replace(/\//gm, '-')}`;
  }

  exampleLinkText(example) {
    return this.exampleFolder(example, 'examples/').replace(/\.\.\//gm, '').replace(/\//gm, '/<wbr>');
  }

  exampleThumbnail(example, theme) {
    return `${example.fullFolder}meta/thumb.${theme.toLowerCase()}.png`;
  }

}

window.demoBrowser = new ExamplesApp();