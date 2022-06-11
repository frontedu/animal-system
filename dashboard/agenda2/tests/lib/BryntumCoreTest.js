const
    paramValueRegExp                             = /^(\w+)=(.*)$/,
    postTapSequence                              = ['mouseover', 'mousemove', 'mousedown', 'mouseup', 'click'],
    postLongPressSequence                        = ['mouseover', 'mousemove', 'contextmenu'],
    postLongPressSequenceWithTouchStartPrevented = ['mousemove', 'contextmenu'],
    parseParams                                  = paramString => {
        const
            result = {},
            params = paramString ? paramString.split('&') : [];

        // loop through each 'filter={"field":"name","operator":"=","value":"Sweden","caseSensitive":true}' string
        // So we cannot use .split('='). Using forEach instead of for...of for IE
        params.forEach(nameValuePair => {
            const
                [match, name, value] = paramValueRegExp.exec(nameValuePair),
                decodedName          = decodeURIComponent(name),
                decodedValue         = decodeURIComponent(value);

            if (match) {
                let paramValue = result[decodedName];

                if (paramValue) {
                    if (!Array.isArray(paramValue)) {
                        paramValue = result[decodedName] = [paramValue];
                    }
                    paramValue.push(decodedValue);
                }
                else {
                    result[decodedName] = decodedValue;
                }
            }
        });

        return result;
    },
    exemptAnimationTargets                       = '.b-toast-progress',
    nativeFocusableTags                          = {
        BUTTON   : 1,
        IFRAME   : 1,
        EMBED    : 1,
        INPUT    : 1,
        OBJECT   : 1,
        SELECT   : 1,
        TEXTAREA : 1,
        BODY     : 1
    },
    simulatorOverrides                           = {
        // override to mimic focus after a touch tap
        possiblySimulateMouseEventsForTouchEnd(target, touch, options) {
            const
                me      = this,
                didMove = me.lastStartTouch.clientX !== touch.clientX ||
                    me.lastStartTouch.clientY !== touch.clientY;

            if (!didMove) {
                let sequence;
                const startWasPrevented = this.isEventPrevented(this.lastStartTouchEvent);
                // Don't fire mouse events if this is a move pointer move ("touchDrag") operation,
                // Chrome actually fires mouse events also when you move a little, probably since touch
                // by its nature is not exact typically.

                if (this.isLongPressing()) {
                    if (startWasPrevented) {
                        sequence = postLongPressSequenceWithTouchStartPrevented;
                    }
                    else {
                        sequence = postLongPressSequence;
                    }
                }
                else if (!startWasPrevented) {
                    sequence = this.lastStartTouchWasOnNewTarget ? postTapSequence : postTapSequence.filter(function(event) {
                        return event !== 'mouseover';
                    });
                }

                sequence && sequence.forEach(function(event) {
                    me.simulateEvent(target, event, options);

                    if (event === 'mousedown' && !startWasPrevented) {
                        me.mimicFocusOnMouseDown(target, me.lastStartTouchEvent);
                    }
                });
            }
        },

        findNextFocusable(el, offset) {
            const focusbleTreeWalker = this.getFocusbleTreeWalker();

            focusbleTreeWalker.currentNode = el;

            // Walk forwards or backwards through tabbable elements found by the TreeWalker
            for (const step = Math.sign(offset); offset; offset -= step) {
                el = offset > 0 ? focusbleTreeWalker.nextNode() : focusbleTreeWalker.previousNode();
            }

            return el;
        },

        getFocusbleTreeWalker() {
            const
                me           = this,
                { document } = me.global;

            // Create a TreeWalker which only visits tabbable Elements
            if (!me._focusbleTreeWalker) {
                me._focusbleTreeWalker = document.createTreeWalker(
                    document.body,
                    NodeFilter.SHOW_ELEMENT,
                    {
                        acceptNode(e) {
                            return me.isTabbable(e) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
                        }
                    }
                );
            }

            return me._focusbleTreeWalker;
        },

        isTabbable(el) {
            const nodeName = el.nodeName;

            /*
             * An element is tabbable if it's visible or a focus trap element AND:
             *   - It is natively focusable, or
             *   - It is an anchor or link with href attribute, or
             *   - It has a tabIndex greater than -1, or
             *   - It is an editing host (contenteditable="true")
             *
             * Note that disabled items are still focusable.
             * They just do not react to normal mutation gestures.
             */
            return (el.classList.contains('b-focus-trap') && el.ownerDocument.defaultView.getComputedStyle(el).getPropertyValue('display') !== 'none') ||
                (this.test.isElementVisible(el) && (nativeFocusableTags[nodeName] ||
                    ((nodeName === 'A' || nodeName === 'LINK') && !!el.href) ||
                    parseInt(el.getAttribute('tabIndex')) > -1 ||
                    el.contentEditable === 'true'));
        }

    };

Class('BryntumCoreTest', {

    isa : Siesta.Test.Browser,

    has : {
        waitForScrolling    : true,
        applyTestConfigs    : true,
        waitForPollInterval : 20
    },

    override : {
        setup(callback, errorCallback) {
            const
                me                  = this,
                isTeamCity          = location.search.includes('IS_TEAMCITY'),
                { project, global } = me,
                testConfig          = me.getConfig(),
                b                   = global.bryntum,
                ns                  = b && (b.core || b.grid || b.scheduler || b.schedulerpro || b.gantt || b.calendar || b.taskboard);

            project.ignoreException = project.ignoreException || /ResizeObserver|Script error\./;

            // running with bundle, but tests are written for import. need to publish all classes to global
            if (ns) {

                // If there's no UI, disable creation of debugging data by Base constructor
                if (!window.Ext) {
                    global.bryntum.DISABLE_DEBUG = true;
                }

                for (const className in ns) {
                    global[className] = ns[className];
                }
            }

            me.setupConsoleHook(global);

            // Allow tests to modify configuration of class instances
            global.__applyTestConfigs = 'applyTestConfigs' in testConfig ? testConfig.applyTestConfigs : me.applyTestConfigs;

            // Enable test-specific rules.
            global.document.body.classList.add('b-siesta-testing');

            // Enable video recording for reruns of tests
            if (isTeamCity && project.isRerunningFailedTests) {
                me.startVideoRecording(callback);
            }
            else {
                me.SUPER(callback, errorCallback);
            }

            Object.assign(me.simulator, simulatorOverrides);
        },

        it(name, callback) {
            if (name.startsWith('TOUCH:') && (!window.Touch || !window.TouchEvent)) {
                arguments[1] = t => {
                    t.diag('Test skipped for non-touch browsers');
                };
            }

            this.suppressPassedWaitForAssertion = true;

            return this.SUPERARG(arguments);
        },

        dragTo(options) {
            if (arguments.length === 1 && options.source) {
                return this.SUPER(
                    options.source,
                    options.target,
                    options.callback,
                    options.scope,
                    options.options,
                    options.dragOnly,
                    options.sourceOffset,
                    options.targetOffset
                );
            }

            return this.SUPERARG(arguments);
        },

        dragBy(options) {
            if (arguments.length === 1 && options.source) {
                return this.SUPER(
                    options.source,
                    options.delta,
                    options.callback,
                    options.scope,
                    options.options,
                    options.dragOnly,
                    options.offset
                );
            }

            return this.SUPERARG(arguments);
        },

        moveMouseTo(options) {
            if (arguments.length === 1 && options.target) {
                return this.SUPER(
                    options.target,
                    options.callback,
                    options.scope,
                    options.offset,
                    options.waitForTarget,
                    options.options
                );
            }

            return this.SUPERARG(arguments);
        },

        type(options) {
            if (arguments.length === 1 && options.text) {
                return this.SUPER(
                    options.el,
                    options.text,
                    options.callback,
                    options.scope,
                    options.options,
                    options.clearExisting
                );
            }

            return this.SUPERARG(arguments);
        },

        launchSpecs() {
            const
                me         = this,
                beforeEach = me.beforeEachHooks[0];

            // If beforeEach inside the test doesn't create new instances, let's wait for any timeouts to complete before starting new t.it
            if (!beforeEach || !beforeEach.code.toString().match('new ')) {
                me.beforeEach((t, callback) => me.verifyNoTimeoutsBeforeSubTest(t, callback));
            }

            // I fought w/this for several hours and it (for me) never completes. Siesta does see the fn as async and
            // appears to progress down the correct code path, but it just does not ever move beyond it.
            // me.beforeEach(async t => {
            //     if (t.name.startsWith('TOUCH:')) {
            //         // Wait for JS to load
            //         const BH = await t.waitFor(() => t.global.BrowserHelper);
            //
            //         BH._isTouchDevice = true;
            //     }
            // });

            // So, I replaced the above with this non-async version:
            me.beforeEach((t, next) => {
                if (t.name.startsWith('TOUCH:')) {
                    // Wait for JS to load
                    t.waitFor(() => t.global.BrowserHelper).then(BH => {
                        BH._isTouchDevice = true;
                        next();
                    });
                }
                else {
                    next();
                }
            });

            me.afterEach(t => {
                if (t.global.BrowserHelper) {
                    delete t.global.BrowserHelper._isTouchDevice;
                }
            });

            return me.SUPERARG(arguments);
        },

        findValue(object, value, path = '') {
            // Visit all classes / members deeply to find links to objects that should not exist
            const
                me          = this,
                visited     = new Set(),
                forEachProp = (item, level = 0, path = '') => {
                    if (level < 40) {
                        for (const o in item) {
                            const
                                member = item[o];

                            if (member?.id === value && member.$$name) {
                                this.fail(`${o} references ${member.$$name}. Path: ${path}`);
                            }
                            else if (member && typeof member === 'object' && !('ELEMENT_NODE' in member) && !visited.has(member) && member !== me.global) {
                                visited.add(item);
                                forEachProp(member, level + 1, path ? path + '.' + o : o);
                            }
                        }
                    }
                };

            forEachProp(object, 0, path);
        },

        waitForFontLoaded(callback) {
            return this.global.document.fonts.ready;
        },

        earlySetup(callback, errorCallback) {
            const
                me             = this,
                testConfig     = me.getConfig(),
                { earlySetup } = testConfig;

            // if we have a URL to load early before the test gets started
            if (earlySetup) {
                const
                    { SUPER } = me,
                    args      = arguments;

                // request earlySetup.url before running the test
                fetch(earlySetup.url).then(response => {
                    earlySetup.callback(response, testConfig, me, () => SUPER.apply(me, args));
                }).catch(() => errorCallback(`Requesting ${earlySetup.url} failed`));
            }
            else {
                me.SUPER(callback, errorCallback);
            }
        },

        onTearDown(fn) {
            this._tearDownHook = fn;
        },

        tearDown(callback, errorCallback) {
            const
                me           = this,
                testConfig   = me.getConfig(),
                { tearDown } = testConfig,
                { SUPER }    = me,
                args         = arguments;

            if (me.isFailed() && me.rootCause?.nbrFramesRecorded > 3) {
                const
                    failedAssertions = me.getFailedAssertions(),
                    failMsg          = failedAssertions[0]?.description || failedAssertions[0]?.annotation,
                    err              = new Error(me.name + ' - ' + (failMsg || ''));

                me.rootCause.finalizeSiestaTestCallback = callback;
                me.rootCause.logException(err);
            }
            else if (me._tearDownHook) {
                me._tearDownHook(() => SUPER.apply(me, args));
            }
            // if we have a URL to load after the test finishes
            else if (tearDown) {
                // request tearDown.url after the test completion
                fetch(tearDown.url).then(response => {
                    tearDown.callback(response, testConfig, me, () => SUPER.apply(me, args));
                }).catch(() => errorCallback(`Requesting ${tearDown.url} failed`));
            }
            else {
                me.SUPERARG(args);
            }
        },

        getGlobalDelays() {
            return this.global?.bryntum?.globalDelays?.getFiltered?.({
                ignoreTimeouts : this.getConfigParam('ignoreTimeouts')
            }) || [];
        },

        async waitForAsyncness() {
            return this.waitFor(() => this.getGlobalDelays().length === 0);
        },

        // Ensure we don't start next t.it if there are active timeouts
        verifyNoTimeoutsBeforeSubTest(test, callback) {
            const
                me                         = this,
                { disableNoTimeoutsCheck } = me.getConfig();

            if (disableNoTimeoutsCheck || me.getGlobalDelays().length === 0) {
                callback();
                return;
            }

            let pollCount = 0;
            const
                POLL_DELAY     = 100,
                MAX_POLL_COUNT = 50,
                poll           = () => {
                    const delays = me.getGlobalDelays();
                    if (delays.length === 0) {
                        callback();
                    }
                    else if (pollCount > MAX_POLL_COUNT) {
                        // Output to console for debugging purposes
                        console.warn('Found delays');
                        console.log(delays);
                        const delayNames = delays.map(entry => `${entry.scope}${entry.delay?.name ? `=>${entry.delay.name}` : ''}`).join(', ');
                        this.fail(`Found delays: ${delayNames}`);
                        callback();
                    }
                    else {
                        pollCount++;
                        this.waitFor(POLL_DELAY, poll);
                    }
                };
            poll();
        },

        launchSubTest(subTest, callback) {
            const { DomHelper } = this.global;

            // Following test must not be affected by this test.
            DomHelper && (DomHelper.usingKeyboard = false);

            if (this.resetCursorPosition !== false) {
                this.simulator.currentPosition[0] = this.simulator.currentPosition[1] = 0;
            }

            // DO NOT REMOVE: handy for finding "leaking" timers
            // if (this.global.bryntum? && this.global.bryntum.globalDelays && !this.global.bryntum.globalDelays.isEmpty()) {
            //     debugger;
            //     this.fail('Active timeouts found');
            // }
            this.SUPERARG(arguments);
        }
    },

    methods : {
        initialize() {
            this.SUPERARG(arguments);

            this.on('beforetestfinalizeearly', this.performPostTestSanityChecks);
        },

        // Fail tests in automation containing iit()
        iit(description) {
            if (this.project.isAutomated && location.host !== 'lh') {
                this.fail('No iit allowed in automation mode - t.iit: ' + description);
            }
            return this.SUPERARG(arguments);
        },

        isAbove(el1, el2, tolerance, message) {
            el1 = el1.element || el1;
            el2 = el2.element || el2;

            if (typeof tolerance === 'string') {
                message = tolerance;
                tolerance = 0;
            }

            tolerance = tolerance || 0.1;

            const
                rect1 = el1.getBoundingClientRect(),
                rect2 = el2.getBoundingClientRect();

            this.isLessOrEqual(rect1.bottom, rect2.top + tolerance, message);
        },

        isLeft(el1, el2, tolerance, message) {
            el1 = el1.element || el1;
            el2 = el2.element || el2;

            if (typeof tolerance === 'string') {
                message = tolerance;
                tolerance = 0;
            }

            tolerance = tolerance || 0.1;

            const
                rect1 = el1.getBoundingClientRect(),
                rect2 = el2.getBoundingClientRect();

            this.isLessOrEqual(rect1.right, rect2.left + tolerance, message);
        },

        isNextElement(el1, el2, message) {
            el1 = el1 && el1.element || el1;
            el2 = el2 && el2.element || el2;

            this.ok(el1.nextElementSibling === el2, message);
        },

        isPrevElement(el1, el2, message) {
            el1 = el1 && el1.element || el1;
            el2 = el2 && el2.element || el2;

            this.ok(el1.previousElementSibling === el2, message);
        },

        isOverlappingHorz(el1, el2, tolerance, message) {
            el1 = el1.element || el1;
            el2 = el2.element || el2;

            if (typeof tolerance === 'string') {
                message = tolerance;
                tolerance = 0;
            }

            tolerance = tolerance || 0;

            const
                rect1 = el1.getBoundingClientRect(),
                rect2 = el2.getBoundingClientRect();

            this.ok(
                rect1.left < rect2.right + tolerance && rect2.left < rect1.right + tolerance,
                message);
        },

        isOverlappingVert(el1, el2, tolerance, message) {
            el1 = el1.element || el1;
            el2 = el2.element || el2;

            if (typeof tolerance === 'string') {
                message = tolerance;
                tolerance = 0;
            }

            tolerance = tolerance || 0;

            const
                rect1 = el1.getBoundingClientRect(),
                rect2 = el2.getBoundingClientRect();

            this.ok(
                rect1.top < rect2.bottom + tolerance && rect2.top < rect1.bottom + tolerance,
                message);
        },

        isSameCharacters(str1, str2, description) {
            str1 = str1.split('');
            str2 = str2.split('');
            let i = str1.length + 1;
            while (i--) {
                if (str2.indexOf(str1[i]) >= 0) {
                    str2.splice(str2.indexOf(str1[i]), 1);
                }
            }
            this.is(str2, '', description);
        },

        performPostTestSanityChecks(evt, t) {
            if (!this.parent && !this.url.match(/docs\//)) {
                this.assertNoDomGarbage(t);
                this.assertNoResizeMonitors();
                this.assertMaxOneFloatRoot();
            }
        },

        async delayedTouchDragBy(target, delta) {
            await this.touchStart(target);
            await this.waitForTouchTimeoutToExpire();
            await this.movePointerBy(delta);
            this.touchEnd();  // sync event
        },

        async delayedTouchDragTo(source, target) {
            await this.touchStart(source);
            await this.waitForTouchTimeoutToExpire();
            await this.movePointerTo(target);
            this.touchEnd();
        },

        async waitForTouchTimeoutToExpire() {
            const delays = this.global.bryntum.globalDelays;

            return this.waitFor(() => {
                let foundTimeout;
                delays.timeouts.forEach(o => {
                    if (o.name === 'touchStartDelay') {
                        foundTimeout = true;
                    }
                });
                return !foundTimeout;
            });
        },

        async waitForScrollPosition(element, position, dimension = 'y') {
            const property = dimension.toLowerCase() === 'y' ? 'scrollTop' : 'scrollLeft';

            return new this.global.Promise(resolve => {
                if (this.samePx(element[property], position)) {
                    resolve();
                }
                const onScroll = () => {
                    if (this.samePx(element[property], position)) {
                        element.removeEventListener('scroll', onScroll);
                        resolve();
                    }
                };
                element.addEventListener('scroll', onScroll);
            });
        },

        async waitForSelectorCount(selector, root, count) {
            if (typeof root === 'number') {
                count = root;
                root = undefined;
            }
            return this.waitFor(() => this.getSelectorCount(selector, root) === count);
        },

        getSelectorCount(selector, root) {
            return this.query(selector, root).length;
        },

        isOnline() {
            return /^(www\.)?bryntum\.com/.test(window.location.host);
        },

        isApproximatelyEqual(value1, value2, threshold) {
            if (arguments.length === 2) {
                threshold = 0;
            }
            return (Math.abs(value2 - value1) <= threshold);
        },

        addListenerToObservable(observable, event, listener) {
            if ('on' in observable) {
                observable.on(event, listener);
            }
            else if ('addEventListener' in observable) {
                observable.addEventListener(event, listener);
            }
        },

        removeListenerFromObservable(observable, event, listener) {
            // Observable might be destroyed way before test is finalized. In that case it won't have `un` method
            // t.firesOnce(popup, 'beforehide');
            // t.firesOnce(popup, 'hide');
            // popup.destroy();
            if (observable?.un) {
                observable.un(event, listener);
            }
        },

        getTimeZone() {
            const
                Date = this.global.Date,
                date = new Date();

            return date.toLocaleString().replace(/.*(GMT.*)/, '$1');
        },

        /**
         * Returns dates when DST occurs in given year
         * @param {Number} year
         * @returns {Date[]} Array with two dates: spring DST switch and autumn DST switch
         */
        getDSTDates(year = 2012) {
            const
                Date      = this.global.Date,
                yearStart = new Date(year, 0, 1),
                yearEnd   = new Date(year, 11, 31),
                dstDates  = [];

            for (let i = yearStart; i <= yearEnd; i = new Date(i.setDate(i.getDate() + 1))) {
                const
                    midnightOffset = new Date(year, i.getMonth(), i.getDate()).getTimezoneOffset(),
                    noonOffset     = new Date(year, i.getMonth(), i.getDate(), 12).getTimezoneOffset();

                if (midnightOffset !== noonOffset) dstDates.push(new Date(i.getTime()));
            }

            return dstDates;
        },

        /**
         * Returns date representing last hour in the current TZ offset, meaning next hour have different TZ offset.
         * @param {Date} start
         * @returns {Date}
         */
        getExactDSTDate(start) {
            let next, result;

            for (let i = new Date(start), end = new Date(i.getFullYear(), i.getMonth(), i.getDate() + 1); !result && i < end; i = next) {
                next = new Date(i.getTime() + 1000 * 60 * 60);

                if (next.getTimezoneOffset() !== i.getTimezoneOffset()) {
                    result = i;
                }
            }

            return result;
        },

        assertMaxOneFloatRoot() {
            const nbrFloatRoots = this.query('.b-float-root').length;

            if (nbrFloatRoots > 1) {
                this.isLessOrEqual(nbrFloatRoots, 1, 'Max one float root');
            }
        },

        assertDuplicateIDs(t) {
            const
                ids   = Array.from(t.global.document.querySelectorAll('[id]')).map(el => el.id),
                idMap = {};

            ids.forEach(id => idMap[id] ? idMap[id] += 1 : idMap[id] = 1);
            Object.entries(idMap).forEach(([id, count]) => {
                if (count > 1) {
                    t.fail(`${count} duplicate element IDs found "#${id}"`);
                }
            });
        },

        assertNoDomGarbage(t) {
            const
                me      = this,
                body    = me.global.document.body,
                invalid = [
                    '[id*="undefined"]',
                    '[id*="null"]',
                    '[class*="undefined"]',
                    '[class*="null"]'
                ].join(',');

            if (body.innerHTML.match(/NaN|id=""/)) {
                me.contentNotLike(body, 'NaN', 'No "NaN" string found in DOM');
                me.contentNotLike(body, ' id=""', 'No empty id found in DOM');
                //me.contentNotLike(body, /L{.*?}/, 'No non-localized string templates L{xx}');
            }

            // If no floating Widgets have been shown, there will not be a floatRoot.
            // But if there have, there must only be one floatRoot.
            if (document.querySelectorAll('.b-float-root').length > 1) {
                me.fail('Only one .b-float-root element must be present');
            }

            if (!t.skipSanityChecks) {
                // Remove embedded JS code blocks like `href="data:text/javascript;..."` or `<code>...</code>` from checking
                const
                    outerHTML = body.outerHTML.replace(/href="data:text\/javascript[\s\S]*?"/gm, '').replace(/<code[\s\S]*?<\/code>/gm, ''),
                    match     = /object object|undefined/i.exec(outerHTML),
                    msg       = match && ('No "Object object" or undefined string found in DOM: ' +
                        outerHTML.substr(match.index - 80, 100));

                if (msg) {
                    console.error(msg);
                    me.fail(msg);
                    if (me.global.monkeyActions) {
                        me.fail('Monkey steps:' + JSON.stringify(me.global.monkeyActions));
                    }
                }
            }

            const oops = me.$(invalid, body);

            if (oops.length) {
                me.selectorNotExists(invalid, 'No DOM attribute garbage found in DOM');

                if (me.global.monkeyActions && body.querySelector(invalid)) {
                    me.fail('Monkey steps:' + JSON.stringify(me.global.monkeyActions));
                }

                if (body.querySelector('.b-animating')) {
                    me.selectorNotExists('.b-animating', 'b-animating should not be found');
                }
            }
        },

        assertNoResizeMonitors() {
            Array.from(document.querySelectorAll('*')).forEach(e => {
                if (e._bResizemonitor?.handlers.length) {
                    this.fail(`${e.tagName}#e.id has ${e._bResizemonitor.handlers.length} resize monitors attached`);
                }
            });
        },

        // Never start an action is animations or scrolling is ongoing
        async waitForAnimations(callback = () => {}) {
            const me = this;

            // Wait until there are no *running* animations in the document.
            if (!me.disableWaitingForCSSAnimations) {

                let animatingEl;
                const hasNoAnimations = () => {
                    animatingEl = null;
                    return !me.global.document.getAnimations?.().some(a => {
                        const
                            el        = a.effect.target,
                            pseudo    = a.effect.pseudoElement,
                            iterCount = el.ownerDocument.defaultView.getComputedStyle(el, pseudo).animationIterationCount;
                        // Ignore infinite animations like spinners, also ignore opacity only transitions, no need to wait for those
                        if (!el.matches(exemptAnimationTargets) && iterCount !== 'infinite' && a.transitionProperty !== 'opacity') {
                            animatingEl = el;
                            return a;
                        }
                    });
                };

                await me.waitFor(() => hasNoAnimations());

                if (animatingEl) {
                    this.fail(`Animating element found: ${animatingEl.outerHTML.replace(animatingEl.innerHTML, '')}`);
                }
            }

            // Finish when bryntum widgets have removed all animation or motion flag classes
            return this.waitForSelectorNotFound(`.b-animating,.b-aborting${this.waitForScrolling ? ',.b-scrolling' : ''}`, callback);
        },

        async waitForAnimationFrame(next) {
            let frameFired = false;
            requestAnimationFrame(() => frameFired = true);
            return this.waitFor(() => frameFired, next);
        },

        async waitForEventOnTrigger(observable, event, trigger, next) {
            const result = this.waitForEvent(observable, event, next);
            trigger?.call();
            return result;
        },

        async waitForSelectorOnTrigger(selector, trigger, next) {
            const result = this.waitForSelector(selector, next);
            trigger?.call();
            return result;
        },

        async waitForPageNavigate(href, desc) {
            return new Promise(resolve => {
                this.chain(
                    { waitForPageLoad : null, trigger : () => this.global.location.href = href, desc },
                    resolve
                );
            });
        },

        async waitForScroll(next) {
            return new this.global.Promise(resolve => {
                const
                    me         = this,
                    as         = me.beginAsync(),
                    global     = me.global,
                    onFinished = () => {
                        me.endAsync(as);
                        global.removeEventListener('scroll', onScroll, true);
                        next?.();
                        resolve();
                    };

                let timer = global.setTimeout(onFinished, 500);

                const onScroll = () => {
                    global.clearTimeout(timer);
                    timer = global.setTimeout(onFinished, 200);
                };

                global.addEventListener('scroll', onScroll, true);
            });
        },

        async waitForScrollEnd(target, next) {
            target = this.normalizeElement(target);

            return new this.global.Promise(resolve => {
                let timer;

                const onScroll = () => {
                    clearTimeout(timer);
                    timer = setTimeout(() => {
                        target.removeEventListener('scroll', onScroll);
                        next?.();
                        resolve();
                    }, 100);
                };
                target.addEventListener('scroll', onScroll, { passive : true });
            });
        },

        async waitForAllImagesLoaded(next) {
            const images = Array.from(this.global.document.querySelectorAll('img[src]'));

            await this.waitFor(() => !images.some(img => !img.complete), next);
        },

        // Allows `await t.animationFrame`
        async animationFrame(frames = 1) {
            let count = 0,
                resolveFn;
            const
                global = this.global,
                frame  = () => {
                    if (count++ < frames) {
                        global.requestAnimationFrame(() => frame());
                    }
                    else {
                        resolveFn();
                    }
                };

            return new Promise(resolve => {
                resolveFn = resolve;
                frame();
            });
        },

        /**
         * Registers the passed URL to return the passed mocked up Fetch Response object to the
         * AjaxHelper's promise resolve function.
         * @param {String} url The url to return mock data for
         * @param {Object|Function} response A mocked up Fetch Response object which must contain
         * at least a `responseText` property, or a function to which the `url` and a `params` object
         * is passed which returns that.
         * @param {String} response.responseText The data to return.
         * @param {Boolean} [response.synchronous] resolve the Promise immediately
         * @param {Number} [response.delay=100] resolve the Promise after this number of milliseconds.
         */
        mockUrl(url, response) {
            const
                me         = this,
                AjaxHelper = me.global.AjaxHelper;

            if (!AjaxHelper) {
                throw new Error('AjaxHelper must be injected into the global namespace');
            }

            (me.mockAjaxMap || (me.mockAjaxMap = {}))[url] = response;

            // Inject the override into the AjaxHelper instance
            if (!AjaxHelper.originalFetch) {
                AjaxHelper.originalFetch = AjaxHelper.fetch;
            }
            AjaxHelper.fetch = me.mockAjaxFetch.bind(me);
        },

        mockAjaxFetch(url, options) {
            const
                urlAndParams = url.split('?'),
                win          = this.global;

            let result     = this.mockAjaxMap[urlAndParams[0]],
                parsedJson = null;

            if (result) {
                if (typeof result === 'function') {
                    result = result(urlAndParams[0], parseParams(urlAndParams[1]), options);
                }
                try {
                    parsedJson = options.parseJson && JSON.parse(result.responseText);
                }
                catch (error) {
                    parsedJson = null;
                    result.error = error;
                }

                result = win.Object.assign({
                    status     : 200,
                    ok         : true,
                    headers    : new win.Headers(),
                    statusText : 'OK',
                    url        : url,
                    parsedJson : parsedJson,
                    text       : () => new Promise((resolve) => {
                        resolve(result.responseText);
                    }),
                    json : () => new Promise((resolve) => {
                        resolve(parsedJson);
                    })
                }, result);

                return new win.Promise((resolve, reject) => {
                    if (result.synchronous) {
                        result.rejectPromise ? reject('Promise rejected!') : resolve(result);
                    }
                    else {
                        win.setTimeout(() => {
                            result.rejectPromise ? reject('Promise rejected!') : resolve(result);
                        }, ('delay' in result ? result.delay : 100));
                    }
                });
            }
            else {
                return win.AjaxHelper.originalFetch(url, options);
            }
        },

        /**
         * Unregisters the passed URL from the mocked URL map
         */
        unmockUrl(url) {
            if (this.mockAjaxMap) {
                delete this.mockAjaxMap[url];
            }
        },

        isDeeplyUnordered(array, toMatch, desc) {
            const
                failDesc = 'isDeeplyUnordered check failed: ' + desc,
                passDesc = 'isDeeplyUnordered check passed: ' + desc;

            if (!this.global.Array.isArray(array) || !this.global.Array.isArray(toMatch)) {
                return this.isDeeply.apply(this, arguments);
            }

            if (array.length !== toMatch.length) {
                this.fail(failDesc);
                return;
            }

            const
                joined = array.concat(toMatch),
                set    = new this.global.Set(joined);

            if (set.size !== array.length) {
                this.fail(failDesc);
                return;
            }

            this.pass(passDesc);
        },

        isRectApproxEqual(rect1, rect2, threshold, description) {
            for (const param in rect1) {
                this.isApprox(rect1[param], rect2[param], threshold, description || '');
            }
        },

        // t.isCssTextEqual(element, 'position: absolute; color: blue;')
        isCssTextEqual(src, cssText, desc) {
            if (src instanceof this.global.HTMLElement) {
                src = src.style.cssText;
            }
            if (src === cssText) {
                this.pass(desc || 'Style matches');
            }
            else {
                const
                    srcParts    = src.split(';').map(p => p.trim()),
                    targetParts = cssText.split(';').map(p => p.trim());

                srcParts.sort();
                targetParts.sort();

                this.isDeeply(srcParts, targetParts);
            }
        },

        startVideoRecording(callback) {
            const
                me             = this,
                document       = me.global.document,
                script         = document.createElement('script'),
                startRootCause = () => {
                    me.on('testupdate', me.onTestUpdate, me);

                    me.rootCause = new me.global.RC.Logger({
                        nbrFramesRecorded  : 0,
                        captureScreenshot  : false,
                        applicationId      : '2709a8dbc83ccd7c7dd07f79b92b5f3a90182f93',
                        maxNbrLogs         : 1,
                        recordSessionVideo : true,
                        videoBaseUrl       : me.global.location.href,
                        logToConsole       : () => {},

                        // Ignore fails in non-DOM tests which should never be flaky, and video won't help
                        processVideoFrameFn(frame) {
                            // enum VideoRecordingMessage {
                            //     setBaseUrl,
                            //     applyDomSnapshot,
                            //     applyPointerPosition,
                            //     applyPointerState,
                            //     applyElementValueChange,
                            //     applyElementCheckedChange,
                            //     applyWindowResize,
                            //     applyDomScroll,
                            //     applyDomMutation
                            // }

                            // Ignore initial video snapshot frames
                            if (frame?.[0] > 1) {
                                this.nbrFramesRecorded++;
                            }
                        },

                        onErrorLogged(responseText) {
                            let data;

                            try {
                                data = JSON.parse(responseText);
                            }
                            catch (e) {
                            }

                            if (data?.id) {
                                me.fail(`[video=${data.id}]`);
                            }
                            this.finalizeSiestaTestCallback?.();
                        },
                        onErrorLogFailed() {
                            this.finalizeSiestaTestCallback?.();
                        }
                    });

                    if (me.rootCause.socket?.readyState === WebSocket.OPEN) {
                        callback.call(me);
                    }
                    else {
                        me.rootCause.socket.addEventListener('open', callback.bind(me));
                    }
                };

            script.crossOrigin = 'anonymous';
            script.src = 'https://app.therootcause.io/rootcause-full.js';
            script.addEventListener('load', startRootCause);
            script.addEventListener('error', callback);

            document.head.appendChild(script);
        },

        onTestUpdate(event, test, result) {
            if (typeof result.passed === 'boolean') {
                this.rootCause?.addLogEntry({
                    type    : result.passed ? 'pass' : 'fail',
                    glyph   : result.passed ? 'check' : 'times',
                    message : (result.description || '') + (result.annotation ? result.annotation + ' \nresult.annotation' : '')
                });
            }
        },

        handlerThrowsOk(fn) {
            let success    = false,
                doneCalled = false;
            const
                me         = this,
                oldOnError = me.global.onerror,
                done       = () => {
                    if (!doneCalled) {
                        doneCalled = true;
                        me.global.onerror = oldOnError;
                        if (success) {
                            me.pass('Expected error was thrown');
                        }
                        else {
                            me.fail('Expected error was not thrown');
                        }
                        me.endAsync(async);
                    }
                };

            me.global.onerror = () => {
                success = true;
                done();
                return true;
            };

            const async = me.beginAsync();

            // We must return the destroy method first in case the
            // passed method is not in fact async.
            setTimeout(fn, 0);

            return done;
        },

        removeIframe(iframeId) {
            const
                t         = this,
                _document = t.global.document,
                iframe    = _document.getElementById(iframeId);
            if (iframe) {
                iframe.parentElement.removeChild(iframe);
            }
            else {
                t.fail('Cannot find iframe with id ' + iframeId);
            }
        },

        setIframeUrl(iframe, url, callback) {
            const
                async = this.beginAsync(),
                doc   = iframe.contentDocument;

            iframe.onload = () => {
                this.endAsync(async);
                iframe.onload = undefined;
                callback();
            };

            if (url && doc.location !== url) {
                doc.location = url;
            }
            else {
                doc.location.reload();
            }

        },

        async setIframeAsync(config) {
            return new this.global.Promise(resolve => {
                this.setIframe(this.global.Object.assign(config, {
                    onload : (document, iframe) => {
                        resolve({ document, iframe });
                    }
                }));
            });
        },

        setIframe(config) {
            config = config || {};

            const
                t         = this,
                id        = config.iframeId || config.id,
                {
                    onload,
                    html,
                    height = 1600,
                    width  = 900
                }         = config,
                _document = t.global.document,
                iframe    = _document.body.appendChild(_document.createElement('iframe'));

            let async = config.async;

            iframe.width = width;
            iframe.height = height;

            if (id) {
                iframe.setAttribute('id', id);
            }

            iframe.setAttribute('frameborder', 0);

            const doc = iframe.contentWindow.document;

            if (onload) {
                async = async || t.beginAsync();

                iframe.onload = () => {

                    // Anyone tries to change it, we ensure the correct test flag class is always on
                    new iframe.contentDocument.defaultView.MutationObserver(() => {
                        if (!document.body.classList.contains('b-siesta-testing')) {
                            this.fail('".b-siesta-testing" has been removed from body by some process or test! It should not happen.');
                            document.body.classList.add('b-siesta-testing');
                        }

                    }).observe(document.body, {
                        attributes : true
                    });

                    t.endAsync(async);
                    onload(doc, iframe);
                };
            }

            if (html) {
                doc.open();
                doc.write(html);
                doc.close();
            }

            doc.body.classList.add('b-siesta-testing');

            return iframe;
        },

        scrollIntoView(selector, callback) {
            this.global.document.querySelector(selector).scrollIntoView();
            callback?.();
        },

        getSVGBox(svgElement) {
            const
                svgBox       = svgElement.getBBox(),
                containerBox = svgElement.viewportElement.getBoundingClientRect();

            return {
                left   : svgBox.x + containerBox.left,
                right  : svgBox.x + containerBox.left + svgBox.width,
                top    : svgBox.y + containerBox.top,
                bottom : svgBox.y + containerBox.top + svgBox.height,
                width  : svgBox.width,
                height : svgBox.height
            };
        },

        getPx(value) {
            // Return pixel value according to window.devicePixelRatio for HiDPI display measurements
            return value * (window.devicePixelRatio || 1);
        },

        samePx(value, compareWith, threshold = 1) {
            return Math.abs(value - compareWith) <= this.getPx(threshold);
        },

        sameRect(rect1, rect2, threshold = 1) {
            return this.samePx(rect1.top, rect2.top, threshold) &&
                this.samePx(rect1.left, rect2.left, threshold) &&
                this.samePx(rect1.width, rect2.width, threshold) &&
                this.samePx(rect1.height, rect2.height, threshold);
        },

        isApproxPx(value, compareWith, threshold = 1, desc) {
            if (typeof threshold === 'string') {
                desc = threshold;
                threshold = 1;
            }
            // Extend isApprox to use window.devicePixelRatio for HiDPI display measurements
            this.isApprox(value, compareWith, threshold * (window.devicePixelRatio || 1), desc);
        },

        isApproxRect(rect1, rect2, threshold = 1, desc) {
            if (typeof threshold === 'string') {
                desc = threshold;
                threshold = 1;
            }
            desc = desc ? `${desc} ` : '';
            this.isApproxPx(rect1.top, rect2.top, threshold, `${desc}Correct rectangle top`);
            this.isApproxPx(rect1.left, rect2.left, threshold, `${desc}Correct rectangle left`);
            this.isApproxPx(rect1.width, rect2.width, threshold, `${desc}Correct rectangle width`);
            this.isApproxPx(rect1.height, rect2.height, threshold, `${desc} Correct rectangle height`);
        },

        /**
         * Asserts element height
         * @param {String} selector CSS selector to identify an element
         * @param {Number} height Expected height in px
         * @param {String} [desc] Assertion description
         */
        hasHeight(selector, height, desc) {
            this.is(this.rect(selector).height, height, desc || 'Correct height for ' + selector);
        },

        hasWidth(selector, width, desc) {
            this.is(this.rect(selector).width, width, desc || 'Correct width for ' + selector);
        },

        /**
         * Asserts elements approximate height
         * @param {String} selector CSS selector to identify an element
         * @param {Number} height Expected height in px
         * @param {Number} [threshold] Allowed deviance
         * @param {String} [desc] Assertion description
         */
        hasApproxHeight(selector, height, threshold, desc) {
            this.isApproxPx(this.rect(selector).height, height, threshold, desc || 'Correct height for ' + selector);
        },

        /**
         * Asserts elements approximate width
         * @param {String} selector CSS selector to identify an element
         * @param {Number} width Expected width in px
         * @param {Number} [threshold] Allowed deviance
         * @param {String} [desc] Assertion description
         */
        hasApproxWidth(selector, width, threshold, desc) {
            this.isApproxPx(this.rect(selector).width, width, threshold, desc || 'Correct width for ' + selector);
        },

        hasAttributeValue(element, attr, value, description) {
            // FireFox has no support for ariaRowIndex
            // https://developer.mozilla.org/en-US/docs/Web/API/Element/ariaRowIndex
            if (attr === 'aria-rowindex' && this.bowser.firefox) {
                return;
            }

            this.SUPER(element, attr, value, description || `Attribute "${attr}" equals "${value}"`);
        },

        DOMtoObject(element) {
            if (element instanceof this.global.HTMLElement) {
                const
                    result     = {
                        children : []
                    },
                    attributes = element.attributes,
                    children   = element.children;

                for (let i = 0, l = attributes.length; i < l; i++) {
                    const attr = attributes[i];

                    result[attr.name] = attr.value;
                }

                for (let i = 0, l = children.length; i < l; i++) {
                    result.children.push(this.DOMtoObject(children[i]));
                }

                return result;
            }
        },

        elementToObject(element) {
            if (element instanceof this.global.HTMLElement) {
                const
                    result     = {
                        children : []
                    },
                    attributes = element.attributes,
                    children   = element.children;

                for (let i = 0, l = attributes.length; i < l; i++) {
                    const attr = attributes[i];

                    if (typeof attr.value === 'string') {
                        if (attr.value.length > 0) {
                            result[attr.name] = attr.value;
                        }
                    }
                    else {
                        result[attr.name] = attr.value;
                    }
                }

                for (let i = 0, l = children.length; i < l; i++) {
                    result.children.push(this.elementToObject(children[i]));
                }

                return result;
            }
        },

        flushDomUpdates(WidgetClass) {
            const { all } = WidgetClass;

            for (let i = 0; i < all.length; ++i) {
                all[i].isComposable && all[i].recompose.flush();
            }
        },

        smartMonkeys(description) {
            const
                skip = [
                    'disabled',
                    '.b-disabled',
                    '.b-hidden',
                    '.b-print-button',
                    '[data-ref="fullscreenButton"]',
                    '[data-ref=fileButton]',
                    '.b-no-monkeys',
                    '.b-skip-test',
                    '#docs-button',
                    'a.b-button'
                ];

            // In Safari simultaneous click on infoButton, toggleSideBar, and dayShowButton hangs the page
            // https://github.com/bryntum/support/issues/2846
            if (this.bowser.safari) {
                skip.push(
                    '[data-ref="toggleSideBar"]',
                    '[data-ref="codeButton"]',
                    '[data-ref="infoButton"]'
                );
            }

            const
                skipSelectors   = skip.map(sel => `:not(${sel})`).join(''),
                actionSelectors = ['.b-button', 'input[type=checkbox]'].map(sel => `${sel}${skipSelectors}`).join(','),
                targetSelectors = ['.demo-header', '.demo-toolbar', '.b-toolbar'].map(sel => `${sel} ${actionSelectors}`).join(','),
                elements        = this.query(targetSelectors);

            if (elements.length > 0) {
                elements.forEach(el => {
                    // Extra fullscreen check for framework buttons
                    if (!el.querySelector('.b-icon-fullscreen')) {
                        this.diag(`Click "${el?.dataset?.ref || el.id || el.classList?.join?.(' ') || el}"`);
                        el.click();
                    }
                });
                this.pass(description || 'Smart monkeys clicking around did not produce errors');
            }
        },

        failXSS(element, name) {
            const
                parent    = element.parentElement,
                extraInfo = parent ? ` in ${parent.outerHTML.replace(parent.innerHTML, '...')}` : '';
            this.fail(`XSS: ${name}${extraInfo}`);
        },

        // Try to find XSS vulnerability
        async injectXSS(component, allRecords = true) {
            // Setup XSS fail handler on window
            this.global.failXSS = this.failXSS.bind(this);

            const
                xssText = name => `<img src="xss" onerror="failXSS(this, '${name}')"/>`,
                injected = new WeakSet(),
                widgets = component ? [component] : [
                    'calendar',
                    'gantt',
                    'ganttbase',
                    'grid',
                    'gridbase',
                    'resourcehistogram',
                    'resourceutilization',
                    'scheduler',
                    'schedulerbase',
                    'schedulerpro',
                    'schedulerprobase',
                    'taskboard',
                    'taskboardbase',
                    'treegrid'
                ].map(this.global.bryntum.query);

            widgets.filter(widget => widget).forEach(widget =>
                ['columns', 'swimlanes', 'store', 'taskStore', 'eventStore', 'resourceStore'].forEach(storeName => {
                    const store = widget.project?.[storeName] || widget[storeName];

                    if (store && !injected.has(store)) {
                        injected.add(store);

                        this.diag(`Inject XSS to ${widget.$$name}.${storeName}`);
                        const records = (allRecords ? store?.records : [store?.first]) || [];
                        let count = 0;
                        for (const record of records) {
                            const fields = record?.fieldMap;
                            if (fields) {

                                // Set image to `false` to avoid rendering of non-existing images
                                // It is checked in API code to avoid errors (E.g. Scheduler/lib/Scheduler/column/ResourceInfoColumn.js)
                                if (fields.image) {
                                    record.image = false;
                                }

                                [
                                    'text',
                                    'name',
                                    'team',
                                    'firstName',
                                    'surName',
                                    'city',
                                    'email',
                                    'description',
                                    'tags',
                                    'note',
                                    'description'
                                ].forEach(field => {
                                    if (fields[field]) {
                                        if (field === 'text' && record.htmlEncodeHeaderText === false) {
                                            // Skip injection in case this column is pre-configured with disabled encoding
                                            return;
                                        }
                                        record[field] = xssText(`${widget.$$name}.${storeName} -> ${record.$$name}.${field} [${count++}]`);
                                    }
                                });
                            }
                        }
                    }
                })
            );
        },

        query(selector, root) {
            const me = this;

            selector = selector.trim();

            // Handle potential nested iframes
            root = root || me.getNestedRoot(selector);

            selector = selector.split('->').pop().trim();

            if (selector.match(/=>/)) {
                const
                    bryntum         = me.getGlobal(root).bryntum,
                    parts           = selector.split('=>'),
                    cssSelector     = parts.pop().trim(),
                    bryntumSelector = parts[0].trim(),
                    widgets         = bryntum.queryAll(bryntumSelector);

                return widgets.map(widget => me.query(cssSelector, widget.element)[0]).filter(result => Boolean(result));
            }
            else if (selector.match(/\s*>>/)) {
                const bryntum = me.getGlobal(root).bryntum;

                return bryntum.queryAll(selector.substr(2)).map(widget => widget.element);
            }

            return me.SUPERARG([selector, root]);
        },

        /**
         * Query bryntum widget from CSS selector
         * @param {String} selector css selector
         * @return Object
         */
        queryWidget(selector) {
            return this.global.bryntum.fromElement(this.global.document.querySelector(selector));
        },

        setRandomPHPSession() {
            // Sets random cookie session ID per test
            const
                rndStr = Math.random().toString(16).substring(2),
                cookie = `${this.url} ${rndStr}`.replace(/[ .\\/&?=]/gm, '-').toLowerCase();

            this.diag(`PHPSESSID: ${cookie}`);
            this.global.document.cookie = `PHPSESSID=${cookie}`;
        },

        rect(selectorOrEl) {
            return this.normalizeElement(selectorOrEl).getBoundingClientRect();
        },

        /**
         * Returns test configuration
         */
        getConfig() {
            return this.project.getScriptDescriptor(this.url);
        },

        /**
         * Searches over all parents in test configuration to get param value
         */
        getConfigParam(param) {
            return this.project.getDescriptorConfig(this.getConfig(), param);
        },

        /**
         * Returns test mode 'es6', 'umd', 'module'
         */
        getMode() {
            return this.getConfigParam('mode');
        },

        /**
         * Enables intercepting console errors.
         */
        setupConsoleHook(parent) {
            const
                me = this;
            // No need to install hooks twice
            if (!me._consoleHooks) {
                const
                    parentWindow            = parent || me.global,
                    usesConsole             = me.getConfigParam('usesConsole'),
                    consoleFailLevels       = usesConsole ? [] : me.getConfigParam('consoleFail') || ['error', 'warn', 'log', 'info'],
                    allowedConsoleMessageRe = me.getConfigParam('allowedConsoleMessageRe');

                if (consoleFailLevels.length > 0) {
                    me.diag(`Console fails: [${consoleFailLevels.join(', ')}]`);
                }

                // Allow console message filtering by level
                consoleFailLevels.forEach(level => {
                    parentWindow.console[level] = (...args) => {
                        const
                            msg         = args[0],
                            isAllowed   = allowedConsoleMessageRe?.test(args[0]),
                            isTrialNote = BryntumTestHelper.isTrial && /Bryntum .* Trial Version/.test(msg);

                        if (!isAllowed && !isTrialNote) {
                            me.fail([`Console ${level}: `, ...args].join(''));
                        }
                        console[level](...args);
                    };
                    parentWindow.console[level].direct = (...args) => console[level](...args);
                });
                me._consoleHooks = true;
            }
        },

        // region docs
        findMemberInClass(clsRecord, propertyType, memberName, isStatic) {
            const store = clsRecord.stores[0];

            let found = (clsRecord.data[propertyType] || []).find(mem => {
                return mem.name === memberName && (mem.scope === 'static') === isStatic;
            });

            if (!found && clsRecord.data.extends) {
                const superClass = store.getById(clsRecord.data.extends[0]);

                found = this.findMemberInClass(superClass, propertyType, memberName, isStatic);
            }

            // search in mixed in members
            if (!found && clsRecord.data.mixes) {
                const mixins = clsRecord.data.mixes.slice();

                let mixin;

                while (!found && (mixin = mixins.shift())) {
                    const mixinCls = store.getById(mixin);

                    found = this.findMemberInClass(mixinCls, propertyType, memberName, isStatic);
                }
            }

            return found;
        },

        async assertDocsLinks(classRecord) {
            const
                me             = this,
                knownTags      = [
                    'function',
                    'member',
                    'method',
                    'property',
                    'link',
                    'ts-ignore',
                    'typings',
                    'category',
                    'config',
                    'field',
                    'internal',
                    'deprecated',
                    'calculated',
                    'propagating',
                    'preventable',
                    'singleton',
                    'readonly',
                    'hide',
                    'hideconfigs',
                    'hideproperties',
                    'hidefunctions',
                    'uninherit'
                ],
                contentElement = me.global.document.getElementById('content');

            if (contentElement.querySelector('.path-not-found')) {
                me.selectorNotExists('.path-not-found', 'Resource missing');
            }
            if (me.query('.description:textEquals(undefined)').length > 0) {
                me.contentNotLike(contentElement, '<div class="description">undefined</div>', 'No undefined descriptions');
            }
            if (me.query('code:empty').length > 0) {
                me.selectorNotExists('code:empty', 'No empty CODE tags');
            }

            // Assert document title (guides don't have a predictable title)
            if (!classRecord.isGuide && !contentElement.querySelector('h1').innerText.includes(classRecord.readableName)) {
                me.contentLike(contentElement.querySelector('h1'), classRecord.readableName, 'Document has the correct name');
            }

            // assert no unprocessed JSDOC tags are displayed
            knownTags.forEach(tag => {
                if (contentElement.innerText.includes('@' + tag)) {
                    me.contentNotLike(contentElement, new RegExp('@' + tag, 'i'), `No "@${tag}" string found in content`);
                }
            });

            await me.assertAllDocsLinks(classRecord, contentElement);

            me.assertClassMembers(classRecord);

            // verify all internal links are correct, in the left pane + inheritance / mixin lists
            me.assertInternalDocsLinks(classRecord, contentElement);

            // verify all links to global symbols (Date, HTMLElement etc) are OK
            me.assertExternalDocsLinks();
        },

        assertClassMembers(classRecord) {
            const
                me             = this,
                contentElement = me.global.document.getElementById('content'),
                treeStore      = classRecord.stores[0],
                // records data is replaced when showing inherited, need to get it again
                data           = treeStore.getById(classRecord.id).data,
                {
                    configs    = [],
                    functions  = [],
                    properties = [],
                    events     = []
                }              = data;

            configs.forEach(config => {
                const types = config.type;

                // only verify public configs
                if (!config.access) {
                    if (types?.length > 0) {
                        let defaultValue     = config.defaultValue,
                            defaultValueType = typeof defaultValue;

                        // Skip checking configs with just one complex type since we cannot verify it
                        if (types.length === 1 && types[0].includes('.')) {
                            return;
                        }

                        // if (types.includes('Array')) {
                        //     me.fail(`Config ${classRecord.name}#${config.name} uses Array type: ${types.join('|')}`);
                        // }

                        // Skip checking lazy config values for now, JsDoc garbles them
                        if (defaultValueType === 'string' && defaultValue.startsWith('{"$config')) {
                            return;
                        }

                        // Some default values are stringified objects
                        if (defaultValueType === 'string') {
                            if (defaultValue[0] === '{') {
                                defaultValueType = 'object';
                            }
                            else if (defaultValue[0] === '[' && types.find(type => type.endsWith('[]'))) {
                                // For array default values, just pick first value as a smoke check
                                defaultValue = JSON.parse(defaultValue);

                                if (defaultValue.length > 0) {
                                    defaultValue = defaultValue[0];
                                    defaultValueType = typeof defaultValue;
                                }
                            }
                            else if (types[0] === 'Number' && !isNaN(Number(defaultValue))) {
                                defaultValueType = 'number';
                            }
                        }

                        // If there's a default value, match it with config type
                        if (defaultValue != null && !types.map(type => type.toLowerCase().replace(/\[]/, '')).includes(defaultValueType)) {
                            let found;

                            // Sometimes default value is a snippet of code
                            try {
                                const evalResult = defaultValueType === 'string' && me.global.eval(defaultValue);

                                found = types.find(type => {
                                    if (type === '*') {
                                        return true;
                                    }

                                    try {
                                        const constructor = me.global.eval(type);

                                        return evalResult instanceof constructor;
                                    }
                                    catch (e) {

                                    }
                                });
                            }
                            catch (e) {

                            }

                            if (!found) {
                                me.fail(`Config ${classRecord.name}#${config.name} has default value ${defaultValue} [${defaultValueType}]. Documented types: ${types.join('|')}`);
                            }
                        }
                    }
                    else {
                        me.fail(`Config ${classRecord.name}#${config.name} is missing type`);
                    }
                }
            });

            if (data.extends?.length && contentElement.querySelectorAll('.class-hierarchy li').length < 2) {
                me.isGreater(contentElement.querySelectorAll('.class-hierarchy li').length, 1, 'Class + superclass rendered');
            }

            for (const func of functions) {
                const fId = func.scope === 'static' ? func.name + '-static' : func.name;

                if (func.parameters) {
                    if (!classRecord.access && !func.access || func.access === 'static') {
                        func.parameters.forEach(param => {
                            if (param.type.length === 0) {
                                me.fail(`Function ${classRecord.name}#${fId} param ${param.name} missing type`);
                            }
                            // else if (param.type.includes('Array')) {
                            //     me.fail(`Config ${classRecord.name}#${func.name} uses Array type: ${param.type}`);
                            // }
                        });
                    }
                }

                if (contentElement.querySelectorAll('#function-' + fId + ' .function-body .parameter').length !== (func.parameters || []).length) {
                    me.fail('#function-' + fId + ': wrong function params rendered');
                }
            }

            properties.forEach(property => {
                if ((!property.access || property.access === 'static')) {
                    if (!property.type?.[0]) {
                        me.fail(`Property ${classRecord.name}#${property.name} missing type`);
                    }
                    // else if (property.type.includes('Array')) {
                    //     me.fail(`Config ${classRecord.name}#${property.name} uses Array type: ${property.type}`);
                    // }
                }
            });

            for (const e of events) {
                // -1 to offset the manually rendered top level single 'event' param for Bryntum events
                if (e.parameters) {
                    if (contentElement.querySelectorAll('#event-' + e.name + '.event .parameter').length - 1 !== e.parameters.length) {
                        me.fail(e.name + ': wrong event params rendered');
                    }
                    // e.parameters.forEach(param => {
                    //     if (param.type.includes('Array')) {
                    //         me.fail(`Event ${classRecord.name}#${e.name} uses Array type: ${param.type.join('|')}`);
                    //     }
                    // });
                }
            }

            if (contentElement.querySelectorAll('.configs .config').length !== classRecord.singleton ? 0 : configs.length) {
                me.selectorCountIs('.configs .config', contentElement, classRecord.singleton ? 0 : configs.length, 'Configs rendered');
            }
            if (contentElement.querySelectorAll('.properties .property').length !== properties.length) {
                me.selectorCountIs('.properties .property', contentElement, properties.length, 'Properties rendered');
            }
            if (contentElement.querySelectorAll('.events .event').length !== events.length) {
                me.selectorCountIs('.events .event', contentElement, events.length, 'Events rendered');
            }
        },

        async assertAllDocsLinks(classRecord, contentElement) {
            const
                nodes   = contentElement.querySelectorAll('a'),
                checked = [],
                failed  = [],
                addFail = (node, href, reason) => failed.push(`"${node.textContent || node}" : href="${href}". [${reason}]`);

            await Promise.all(Array.from(nodes).filter(node => node.href).map(node => {

                const href = node.getAttribute('href').split('#')[0];
                if (href === '' || /^(http|https|mailto|api|guide|#|\?)/.test(href) || checked.includes(href)) {
                    return;
                }

                checked.push(href);

                this.diag(`Check url: ${href}`);

                if (href.includes('href=')) {
                    addFail(node, href, 'Wrong link format');
                    return;
                }

                if (BryntumTestHelper.isPR) {
                    // Run simplified test for PR validation
                    if (!/^(..\/.*examples|engine|data|\?)/.test(href)) {
                        addFail(node, href, 'Wrong link format');
                    }
                }
                else {
                    // Run full test for checking external links
                    return this.global.AjaxHelper.get(href)
                        .then(({ status, statusText }) => {
                            if (status !== 200) {
                                addFail(node, href, `${status}: ${statusText}`);
                            }
                        })
                        .catch(err => addFail(node, href, err.message));

                }
            }));

            failed.forEach(f => this.fail(f));
        },

        assertInternalDocsLinks(classRecord, contentElement) {
            const
                me               = this,
                treeStore        = classRecord.stores[0],
                ignoreLinks      = me.getConfig().ignoreLinks || [],
                ignoreClasses    = me.getConfig().ignoreClasses || [],
                linkSelector     = 'a[href^="#"]:not(.summary-icon):not(.inherited):not(.anchor-link)',
                memberCategories = ['events', 'properties', 'configs', 'functions', 'fields'],
                nodes            = contentElement.querySelectorAll(`.left-pane ${linkSelector}, .right-pane > :not(.class-contents-container) ${linkSelector}`);

            Array.from(nodes).forEach((node) => {
                const
                    href              = node.getAttribute('href').substring(1),
                    className         = href.split('#')[0],
                    member            = href.split('#')[1],
                    linkedClassRecord = treeStore.getById(className),
                    linkHref          = `${classRecord.id}#${href}`;

                // Ignore internal docs page link
                if (linkHref.endsWith('#class-description')) {
                    return;
                }

                // Completely ignore by link url
                if (!linkedClassRecord && ignoreLinks.includes(linkHref)) {
                    return;
                }
                else if (linkedClassRecord && ignoreLinks.includes(linkHref)) {
                    me.fail(`${linkHref} is redundant in ignoreLinks test config. Remove from tests/index.js`);
                }

                if (!linkedClassRecord && !ignoreClasses.includes(className)) {
                    me.fail(`${linkHref} not found in docs tree. Add to docs/data/guides.js or to ignoreClasses/ignoreLinks test config in tests/index.js`);
                }
                else if (linkedClassRecord && !member && !classRecord.access && linkedClassRecord.access === 'private') {
                    const isLinkedFromPublicMember = node.closest('.member:not(.private):not(.internal)');

                    if (isLinkedFromPublicMember) {
                        me.fail(`Public class ${classRecord.name} links to private class ${linkedClassRecord.name}`);
                    }
                }
                else if (!linkedClassRecord?.isGuide && member && !ignoreLinks.includes(href)) {
                    const
                        parts        = member.split('-'),
                        name         = decodeURIComponent(parts[1]),
                        category     = parts[0],
                        isStatic     = parts.length === 3,
                        propertyName = category === 'property' ? 'properties' : (category + 's');

                    let found = false;

                    if (parts.length > 1) {
                        found = me.findMemberInClass(linkedClassRecord, propertyName, name, isStatic);
                    }

                    if (!found && !memberCategories.includes(category)) {
                        me.fail(`${classRecord.id} - docs link not found: ${href}`);
                    }
                    else if (classRecord.access !== 'private' && linkedClassRecord.access === 'private') {
                        const isLinkedFromPublicMember = node.closest('.member:not(.private):not(.internal)');

                        if (isLinkedFromPublicMember) {
                            me.fail(`${classRecord.name} links to private member ${linkedClassRecord.name}`);
                        }
                    }
                }
            });
        },

        assertExternalDocsLinks() {
            const
                contentElement = this.global.document.getElementById('content'),
                global         = this.global,
                linkNodes      = contentElement.querySelectorAll('a.type[target=_blank]'),
                ignoreSymbols  = {
                    Class      : 1,
                    TouchEvent : 1,
                    null       : 1,
                    DragEvent  : this.bowser.safari // DragEvent somehow missing in Safari
                };

            if (!this.global.freshWindow) {
                const frame = document.createElement('iframe');

                this.global.document.body.appendChild(frame);

                frame.style.display = 'none';

                this.global.freshWindow = frame.contentWindow;
            }

            // verify all links to global symbols are OK
            global.Array.from(linkNodes).forEach(node => {
                const symbolName = node.innerHTML.trim().replace('[]', '').replace('...', '');

                if (!ignoreSymbols[symbolName] && !(symbolName in this.global.freshWindow)) {
                    this.fail(global.location.hash + ' - docs global symbol link not found: ' + symbolName);
                }
            });
        },
        // endregion docs

        /**
         * Applying locales which were preloaded via alsoPreload in tests/index.js
         * Usage example:
         * {
         *     alsoPreload : preloadLocales,
         *     url         : 'test.t.js'
         * }
         * @param localeName locale name
         * @return {Object} locale object
         */
        applyLocale(localeName) {
            this.diag(`Applying locale ${localeName}`);
            const locale = this.global.bryntum.locales[localeName];
            if (!locale) {
                this.fail(`"${localeName}" locale is not published on window.bryntum. Add "alsoPreload : preloadLocales" for test config in tests/index.js`);
            }
            return this.global.LocaleManager.locale = locale;
        }
    }
});

class BryntumTestHelper {

    static detectTrial() {
        let result = true;
        
        return result;
    }

    static detectWebGL() {
        if (bowser.chrome) {
            const canvas = document.createElement('canvas');
            document.body.appendChild(canvas);
            const supported = Boolean(canvas.getContext('webgl'));
            canvas.remove();
            return supported;
        }
    }

    static detectNetCore() {
        // run netcore tests only in chrome because we are testing backend really
        let result = false;
        if (bowser.chrome) {
            const params = new URLSearchParams(document.location.search);
            if (params.has('netcore') && params.get('netcore') !== 'false') {
                result = true;
            }
        }
        return result;
    }

    static expandUrl(url, root) {
        // Append root to the string item if it doesn't start with it (to simplify configs)
        return url.startsWith(root) ? url : `${root}/${url}`;
    }

    static prepareFrameworkTests(items, examplesRoot = '../examples/frameworks', testsRoot = 'examples/frameworks') {
        // Disable tests for PR
        if (BryntumTestHelper.isPR) {
            return [];
        }

        return items.map(item => {
            if (item.pageUrl != null && item.url != null) {
                return Object.assign({}, item, {
                    pageUrl                : this.expandUrl(item.pageUrl, examplesRoot),
                    url                    : this.expandUrl(item.url, testsRoot),
                    keepPageUrl            : true,
                    disableNoTimeoutsCheck : true
                });
            }
        });
    }

    static prepareFrameworkMonkeyTests({ items, examplesRoot = '../examples/frameworks', config = {}, smartMonkeys }) {
        // Disable tests for PR
        if (BryntumTestHelper.isPR) {
            return [];
        }

        return this.prepareMonkeyTests({
            items,
            examplesRoot,
            config,
            smartMonkeys
        });
    }

    static prepareMonkeyTests({ items, mode, examplesRoot = '../examples', config = {}, smartMonkeys = false }) {
        const
            urls       = [],
            monkeyName = smartMonkeys ? 'monkey-smart' : 'monkey';

        return items.filter(item => item).map(item => {
            // Skip monkeys for PR tests where we have example test (test setup has url)
            if (item.skipMonkey) {
                return;
            }

            const cfg = Object.assign({}, config, item instanceof Object ? item : { pageUrl : item });
            if (cfg.pageUrl) {

                cfg.pageUrl = this.expandUrl(cfg.pageUrl, examplesRoot);

                if (!cfg.keepPageUrl && ['umd', 'module'].includes(mode)) {
                    const parts = cfg.pageUrl.split('?');
                    cfg.pageUrl = parts[0] + (parts[0].endsWith('/') ? '' : '/') + `index.${mode}.html?` + (parts[1] || '');
                }

                // Prepare url-friendly id
                const id = cfg.pageUrl
                    .replace(/\.+\//g, '')
                    .replace(/[?&./]+/g, '-')
                    .replace(/-+$/, '')
                    .replace(/examples(.*?)-frameworks/, 'frameworks$1');

                Object.assign(cfg, {
                    isMonkey                : true,
                    isPR                    : BryntumTestHelper.isPR,
                    keepPageUrl             : true,
                    name                    : `${monkeyName}-${id}`,
                    url                     : `examples/${monkeyName}.t.js?${id}`,
                    // Skip errors caused by copying resources (name changes from "Dave" to "Dave - 2", "Dave - 3", etc.)
                    failOnResourceLoadError : /users\/.*?\d?\.(jpg|png)$/,
                    disableNoTimeoutsCheck  : true
                });

                // Timeout for bigdataset demos
                if (/big-?dataset/.test(id)) {
                    cfg.defaultTimeout = 60000;
                }

                // Avoid duplicates
                if (!urls.includes(cfg.url)) {
                    urls.push(cfg.url);
                    return cfg;
                }
            }
        });
    }

    static updateTitle(item, testUrl) {
        // Split testUrl to display in tree grid
        if (testUrl && (typeof URL === 'function')) {
            const
                url      = new URL(`http://bryntum.com/${testUrl}`),
                pathName = url.pathname,
                idx      = pathName.lastIndexOf('/'),
                testName = pathName.substring(idx + 1),
                testPath = !item.isMonkey ? pathName.substring(1, idx) : item.pageUrl;
            item.title = `${testName}${url.search} ${testPath !== '' ? `[ ${testPath} ]` : ''}`;
        }
    }

    static prepareItem(item, mode) {
        // Update test url and pageUrl for mode
        if (mode !== 'es6') {
            if (item.url && !item.keepUrl) {
                item.url = item.url.replace('.t.js', `.t.${mode}.js`);
            }

            if (item.pageUrl && !item.keepPageUrl && !(mode === 'module' && BryntumTestHelper.isTrial)) {
                // keep querystring also for bundle (works with both url/?develop and url?develop)
                const qs = item.pageUrl.match(/(.*?)(\/*)([?#].*)/);
                if (qs) {
                    item.pageUrl = `${qs[1]}/index.${mode}.html${qs[3]}`;
                }
                else {
                    item.pageUrl += `/index.${mode}.html`;
                }
            }

        }
        this.updateTitle(item, item.url || item.pageUrl);
    }

    static normalizeItem(item, mode) {
        // Apply custom properties for mode or default
        if (item instanceof Object) {
            for (const key in item) {
                if (Object.prototype.hasOwnProperty.call(item, key)) {
                    const val = item[key];
                    if (val && (val[mode] != null || val.default != null)) {
                        item[key] = val[mode] != null ? val[mode] : val.default;
                    }
                }
            }
        }
    }

    static prepareItems(items, mode) {
        items?.map((item, i) => {
            if (item) {
                BryntumTestHelper.normalizeItem(item, mode);

                // Only include es6 specific tests + module tests in PR mode
                if (BryntumTestHelper.isPR) {
                    // Apply group `includeFor` for items inside group
                    if (item.items) {
                        item.items.filter(child => child).forEach(child => {
                            if (typeof child === 'string') {
                                child = {
                                    url        : child,
                                    includeFor : item.includeFor
                                };
                            }
                            else {
                                child.includeFor = child.includeFor || item.includeFor;
                            }
                        });
                    }
                    else {
                        if ((mode === 'es6' && !item.includeFor?.includes('es6')) || (mode === 'umd')) {
                            items[i] = null;
                            return;
                        }
                    }
                }

                // Include for bundle and skip handling
                if (item.skip !== null && item.skip === true ||
                    (item.includeFor?.replace(' ', '').split(',').indexOf(mode) === -1)) {
                    items[i] = null;
                }
                else {
                    // Normalize URL
                    if (typeof item === 'string') {
                        item = items[i] = { url : item };
                    }
                    BryntumTestHelper.prepareItem(items[i], mode);
                    BryntumTestHelper.prepareItems(item.items, mode);

                    // Remove groups with all items excluded
                    if (item.items?.every(item => item == null)) {
                        items[i] = null;
                    }
                }
            }
        });
        return items;
    }
}

BryntumTestHelper.isTC = /IS_TEAMCITY/.test(location.href);
BryntumTestHelper.isPR = /IS_PR/.test(location.href);
BryntumTestHelper.isTrial = BryntumTestHelper.detectTrial();
BryntumTestHelper.isNetCore = BryntumTestHelper.detectNetCore();
BryntumTestHelper.isWebGL = BryntumTestHelper.detectWebGL();
