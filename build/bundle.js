
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = program.b - t;
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.32.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function get_interpolator(a, b) {
        if (a === b || a !== a)
            return () => a;
        const type = typeof a;
        if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
            throw new Error('Cannot interpolate values of different type');
        }
        if (Array.isArray(a)) {
            const arr = b.map((bi, i) => {
                return get_interpolator(a[i], bi);
            });
            return t => arr.map(fn => fn(t));
        }
        if (type === 'object') {
            if (!a || !b)
                throw new Error('Object cannot be null');
            if (is_date(a) && is_date(b)) {
                a = a.getTime();
                b = b.getTime();
                const delta = b - a;
                return t => new Date(a + t * delta);
            }
            const keys = Object.keys(b);
            const interpolators = {};
            keys.forEach(key => {
                interpolators[key] = get_interpolator(a[key], b[key]);
            });
            return t => {
                const result = {};
                keys.forEach(key => {
                    result[key] = interpolators[key](t);
                });
                return result;
            };
        }
        if (type === 'number') {
            const delta = b - a;
            return t => a + t * delta;
        }
        throw new Error(`Cannot interpolate ${type} values`);
    }
    function tweened(value, defaults = {}) {
        const store = writable(value);
        let task;
        let target_value = value;
        function set(new_value, opts) {
            if (value == null) {
                store.set(value = new_value);
                return Promise.resolve();
            }
            target_value = new_value;
            let previous_task = task;
            let started = false;
            let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
            if (duration === 0) {
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                store.set(value = target_value);
                return Promise.resolve();
            }
            const start = now() + delay;
            let fn;
            task = loop(now => {
                if (now < start)
                    return true;
                if (!started) {
                    fn = interpolate(value, new_value);
                    if (typeof duration === 'function')
                        duration = duration(value, new_value);
                    started = true;
                }
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                const elapsed = now - start;
                if (elapsed > duration) {
                    store.set(value = new_value);
                    return false;
                }
                // @ts-ignore
                store.set(value = fn(easing(elapsed / duration)));
                return true;
            });
            return task.promise;
        }
        return {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe
        };
    }

    /* src/components/Blob.svelte generated by Svelte v3.32.0 */
    const file = "src/components/Blob.svelte";

    function create_fragment(ctx) {
    	let g;
    	let ellipse;
    	let ellipse_class_value;
    	let ellipse_rx_value;
    	let rect;
    	let rect_transform_value;
    	let rect_x_value;
    	let rect_y_value;
    	let rect_width_value;
    	let rect_height_value;
    	let foreignObject;
    	let h1;
    	let t0;
    	let t1;
    	let p;
    	let t2;
    	let g_transform_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			ellipse = svg_element("ellipse");
    			rect = svg_element("rect");
    			foreignObject = svg_element("foreignObject");
    			h1 = element("h1");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			p = element("p");
    			t2 = text(/*description*/ ctx[1]);
    			attr_dev(ellipse, "class", ellipse_class_value = "" + (null_to_empty(/*group*/ ctx[2]) + " svelte-1lod594"));
    			attr_dev(ellipse, "rx", ellipse_rx_value = Math.round(/*size*/ ctx[5] * (0.5 + /*overlap*/ ctx[6])));
    			toggle_class(ellipse, "hovered", /*hovered*/ ctx[4]);
    			toggle_class(ellipse, "focussed", /*focussed*/ ctx[3]);
    			add_location(ellipse, file, 42, 2, 1188);
    			attr_dev(rect, "class", "rect svelte-1lod594");
    			attr_dev(rect, "transform", rect_transform_value = "translate(" + -/*size*/ ctx[5] / 2 + " " + -/*size*/ ctx[5] / 2 + ")");
    			attr_dev(rect, "x", rect_x_value = /*size*/ ctx[5] * 0.115);
    			attr_dev(rect, "y", rect_y_value = /*size*/ ctx[5] * 0.115);
    			attr_dev(rect, "width", rect_width_value = /*size*/ ctx[5] * 0.77);
    			attr_dev(rect, "height", rect_height_value = /*size*/ ctx[5] * 0.77);
    			add_location(rect, file, 43, 2, 1290);
    			attr_dev(h1, "class", "svelte-1lod594");
    			add_location(h1, file, 45, 4, 1586);
    			attr_dev(p, "class", "svelte-1lod594");
    			add_location(p, file, 48, 4, 1621);
    			attr_dev(foreignObject, "class", "node svelte-1lod594");
    			attr_dev(foreignObject, "x", /*textBoxOffset*/ ctx[17]);
    			attr_dev(foreignObject, "y", /*textBoxOffset*/ ctx[17]);
    			attr_dev(foreignObject, "width", /*textBoxSize*/ ctx[16]);
    			attr_dev(foreignObject, "height", /*textBoxSize*/ ctx[16]);
    			toggle_class(foreignObject, "focussed", /*focussed*/ ctx[3]);
    			add_location(foreignObject, file, 44, 2, 1445);
    			attr_dev(g, "transform", g_transform_value = "translate(" + /*$x*/ ctx[7] + " " + /*$y*/ ctx[8] + ") scale(" + /*$scale*/ ctx[9] + ")");
    			add_location(g, file, 36, 0, 1023);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			append_dev(g, ellipse);
    			append_dev(g, rect);
    			append_dev(g, foreignObject);
    			append_dev(foreignObject, h1);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			append_dev(foreignObject, p);
    			append_dev(p, t2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(g, "mouseover", /*mouseover_handler*/ ctx[23], false, false, false),
    					listen_dev(g, "mouseout", /*mouseout_handler*/ ctx[24], false, false, false),
    					listen_dev(g, "click", /*click_handler*/ ctx[25], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*group*/ 4 && ellipse_class_value !== (ellipse_class_value = "" + (null_to_empty(/*group*/ ctx[2]) + " svelte-1lod594"))) {
    				attr_dev(ellipse, "class", ellipse_class_value);
    			}

    			if (dirty & /*size, overlap*/ 96 && ellipse_rx_value !== (ellipse_rx_value = Math.round(/*size*/ ctx[5] * (0.5 + /*overlap*/ ctx[6])))) {
    				attr_dev(ellipse, "rx", ellipse_rx_value);
    			}

    			if (dirty & /*group, hovered*/ 20) {
    				toggle_class(ellipse, "hovered", /*hovered*/ ctx[4]);
    			}

    			if (dirty & /*group, focussed*/ 12) {
    				toggle_class(ellipse, "focussed", /*focussed*/ ctx[3]);
    			}

    			if (dirty & /*size*/ 32 && rect_transform_value !== (rect_transform_value = "translate(" + -/*size*/ ctx[5] / 2 + " " + -/*size*/ ctx[5] / 2 + ")")) {
    				attr_dev(rect, "transform", rect_transform_value);
    			}

    			if (dirty & /*size*/ 32 && rect_x_value !== (rect_x_value = /*size*/ ctx[5] * 0.115)) {
    				attr_dev(rect, "x", rect_x_value);
    			}

    			if (dirty & /*size*/ 32 && rect_y_value !== (rect_y_value = /*size*/ ctx[5] * 0.115)) {
    				attr_dev(rect, "y", rect_y_value);
    			}

    			if (dirty & /*size*/ 32 && rect_width_value !== (rect_width_value = /*size*/ ctx[5] * 0.77)) {
    				attr_dev(rect, "width", rect_width_value);
    			}

    			if (dirty & /*size*/ 32 && rect_height_value !== (rect_height_value = /*size*/ ctx[5] * 0.77)) {
    				attr_dev(rect, "height", rect_height_value);
    			}

    			if (dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);
    			if (dirty & /*description*/ 2) set_data_dev(t2, /*description*/ ctx[1]);

    			if (dirty & /*focussed*/ 8) {
    				toggle_class(foreignObject, "focussed", /*focussed*/ ctx[3]);
    			}

    			if (dirty & /*$x, $y, $scale*/ 896 && g_transform_value !== (g_transform_value = "translate(" + /*$x*/ ctx[7] + " " + /*$y*/ ctx[8] + ") scale(" + /*$scale*/ ctx[9] + ")")) {
    				attr_dev(g, "transform", g_transform_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const animationDuration = 250;

    function instance($$self, $$props, $$invalidate) {
    	let $x;
    	let $y;
    	let $scale;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Blob", slots, []);
    	let { title } = $$props;
    	let { description } = $$props;
    	let { group } = $$props;
    	let { row } = $$props;
    	let { column } = $$props;
    	let { focussed = false } = $$props;
    	let { hovered = false } = $$props;

    	let { setHover = () => {
    		
    	} } = $$props;

    	let { setFocus = () => {
    		
    	} } = $$props;

    	let { size } = $$props;
    	let { overlap } = $$props;
    	let { canvasHeight = 100 } = $$props;
    	let scale = tweened(1, { duration: animationDuration });
    	validate_store(scale, "scale");
    	component_subscribe($$self, scale, value => $$invalidate(9, $scale = value));
    	let x = tweened((column + 0.5) * size, { duration: animationDuration });
    	validate_store(x, "x");
    	component_subscribe($$self, x, value => $$invalidate(7, $x = value));
    	let y = tweened((row + 0.5) * size, { duration: animationDuration });
    	validate_store(y, "y");
    	component_subscribe($$self, y, value => $$invalidate(8, $y = value));
    	const hoverOn = () => setHover(true);
    	const hoverOff = () => setHover(false);
    	const focus = () => setFocus(true);
    	const textBoxSize = size * 0.7;
    	const textBoxOffset = -textBoxSize / 2;

    	const writable_props = [
    		"title",
    		"description",
    		"group",
    		"row",
    		"column",
    		"focussed",
    		"hovered",
    		"setHover",
    		"setFocus",
    		"size",
    		"overlap",
    		"canvasHeight"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Blob> was created with unknown prop '${key}'`);
    	});

    	const mouseover_handler = () => hoverOn();
    	const mouseout_handler = () => hoverOff();
    	const click_handler = () => focus();

    	$$self.$$set = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("description" in $$props) $$invalidate(1, description = $$props.description);
    		if ("group" in $$props) $$invalidate(2, group = $$props.group);
    		if ("row" in $$props) $$invalidate(18, row = $$props.row);
    		if ("column" in $$props) $$invalidate(19, column = $$props.column);
    		if ("focussed" in $$props) $$invalidate(3, focussed = $$props.focussed);
    		if ("hovered" in $$props) $$invalidate(4, hovered = $$props.hovered);
    		if ("setHover" in $$props) $$invalidate(20, setHover = $$props.setHover);
    		if ("setFocus" in $$props) $$invalidate(21, setFocus = $$props.setFocus);
    		if ("size" in $$props) $$invalidate(5, size = $$props.size);
    		if ("overlap" in $$props) $$invalidate(6, overlap = $$props.overlap);
    		if ("canvasHeight" in $$props) $$invalidate(22, canvasHeight = $$props.canvasHeight);
    	};

    	$$self.$capture_state = () => ({
    		tweened,
    		title,
    		description,
    		group,
    		row,
    		column,
    		focussed,
    		hovered,
    		setHover,
    		setFocus,
    		size,
    		overlap,
    		canvasHeight,
    		animationDuration,
    		scale,
    		x,
    		y,
    		hoverOn,
    		hoverOff,
    		focus,
    		textBoxSize,
    		textBoxOffset,
    		$x,
    		$y,
    		$scale
    	});

    	$$self.$inject_state = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("description" in $$props) $$invalidate(1, description = $$props.description);
    		if ("group" in $$props) $$invalidate(2, group = $$props.group);
    		if ("row" in $$props) $$invalidate(18, row = $$props.row);
    		if ("column" in $$props) $$invalidate(19, column = $$props.column);
    		if ("focussed" in $$props) $$invalidate(3, focussed = $$props.focussed);
    		if ("hovered" in $$props) $$invalidate(4, hovered = $$props.hovered);
    		if ("setHover" in $$props) $$invalidate(20, setHover = $$props.setHover);
    		if ("setFocus" in $$props) $$invalidate(21, setFocus = $$props.setFocus);
    		if ("size" in $$props) $$invalidate(5, size = $$props.size);
    		if ("overlap" in $$props) $$invalidate(6, overlap = $$props.overlap);
    		if ("canvasHeight" in $$props) $$invalidate(22, canvasHeight = $$props.canvasHeight);
    		if ("scale" in $$props) $$invalidate(10, scale = $$props.scale);
    		if ("x" in $$props) $$invalidate(11, x = $$props.x);
    		if ("y" in $$props) $$invalidate(12, y = $$props.y);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*focussed, canvasHeight, hovered, column, size, row*/ 4980792) {
    			 {
    				if (focussed) {
    					scale.set(4);
    					x.set(canvasHeight / 2);
    					y.set(canvasHeight / 2);
    				} else {
    					scale.set(hovered ? 1.05 : 1);
    					x.set((column + 0.5) * size);
    					y.set((row + 0.5) * size);
    				}
    			}
    		}
    	};

    	return [
    		title,
    		description,
    		group,
    		focussed,
    		hovered,
    		size,
    		overlap,
    		$x,
    		$y,
    		$scale,
    		scale,
    		x,
    		y,
    		hoverOn,
    		hoverOff,
    		focus,
    		textBoxSize,
    		textBoxOffset,
    		row,
    		column,
    		setHover,
    		setFocus,
    		canvasHeight,
    		mouseover_handler,
    		mouseout_handler,
    		click_handler
    	];
    }

    class Blob extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance, create_fragment, safe_not_equal, {
    			title: 0,
    			description: 1,
    			group: 2,
    			row: 18,
    			column: 19,
    			focussed: 3,
    			hovered: 4,
    			setHover: 20,
    			setFocus: 21,
    			size: 5,
    			overlap: 6,
    			canvasHeight: 22
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Blob",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !("title" in props)) {
    			console.warn("<Blob> was created without expected prop 'title'");
    		}

    		if (/*description*/ ctx[1] === undefined && !("description" in props)) {
    			console.warn("<Blob> was created without expected prop 'description'");
    		}

    		if (/*group*/ ctx[2] === undefined && !("group" in props)) {
    			console.warn("<Blob> was created without expected prop 'group'");
    		}

    		if (/*row*/ ctx[18] === undefined && !("row" in props)) {
    			console.warn("<Blob> was created without expected prop 'row'");
    		}

    		if (/*column*/ ctx[19] === undefined && !("column" in props)) {
    			console.warn("<Blob> was created without expected prop 'column'");
    		}

    		if (/*size*/ ctx[5] === undefined && !("size" in props)) {
    			console.warn("<Blob> was created without expected prop 'size'");
    		}

    		if (/*overlap*/ ctx[6] === undefined && !("overlap" in props)) {
    			console.warn("<Blob> was created without expected prop 'overlap'");
    		}
    	}

    	get title() {
    		throw new Error("<Blob>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Blob>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get description() {
    		throw new Error("<Blob>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set description(value) {
    		throw new Error("<Blob>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get group() {
    		throw new Error("<Blob>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set group(value) {
    		throw new Error("<Blob>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get row() {
    		throw new Error("<Blob>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set row(value) {
    		throw new Error("<Blob>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get column() {
    		throw new Error("<Blob>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set column(value) {
    		throw new Error("<Blob>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focussed() {
    		throw new Error("<Blob>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focussed(value) {
    		throw new Error("<Blob>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hovered() {
    		throw new Error("<Blob>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hovered(value) {
    		throw new Error("<Blob>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get setHover() {
    		throw new Error("<Blob>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set setHover(value) {
    		throw new Error("<Blob>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get setFocus() {
    		throw new Error("<Blob>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set setFocus(value) {
    		throw new Error("<Blob>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Blob>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Blob>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get overlap() {
    		throw new Error("<Blob>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set overlap(value) {
    		throw new Error("<Blob>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get canvasHeight() {
    		throw new Error("<Blob>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set canvasHeight(value) {
    		throw new Error("<Blob>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/SvgButton.svelte generated by Svelte v3.32.0 */

    const file$1 = "src/components/SvgButton.svelte";

    function create_fragment$1(ctx) {
    	let g;
    	let rect;
    	let switch_instance;
    	let g_transform_value;
    	let current;
    	let mounted;
    	let dispose;
    	var switch_value = /*icon*/ ctx[3];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			rect = svg_element("rect");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(rect, "x", "0");
    			attr_dev(rect, "y", "0");
    			attr_dev(rect, "width", "50");
    			attr_dev(rect, "height", "50");
    			attr_dev(rect, "class", "svelte-103ckom");
    			add_location(rect, file$1, 7, 2, 155);
    			attr_dev(g, "transform", g_transform_value = "translate(" + /*x*/ ctx[1] + " " + /*y*/ ctx[2] + ")");
    			add_location(g, file$1, 6, 0, 93);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			append_dev(g, rect);

    			if (switch_instance) {
    				mount_component(switch_instance, g, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					g,
    					"click",
    					function () {
    						if (is_function(/*action*/ ctx[0])) /*action*/ ctx[0].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (switch_value !== (switch_value = /*icon*/ ctx[3])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, g, null);
    				} else {
    					switch_instance = null;
    				}
    			}

    			if (!current || dirty & /*x, y*/ 6 && g_transform_value !== (g_transform_value = "translate(" + /*x*/ ctx[1] + " " + /*y*/ ctx[2] + ")")) {
    				attr_dev(g, "transform", g_transform_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			if (switch_instance) destroy_component(switch_instance);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SvgButton", slots, []);
    	let { action } = $$props;
    	let { x } = $$props;
    	let { y } = $$props;
    	let { icon } = $$props;
    	const writable_props = ["action", "x", "y", "icon"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SvgButton> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("action" in $$props) $$invalidate(0, action = $$props.action);
    		if ("x" in $$props) $$invalidate(1, x = $$props.x);
    		if ("y" in $$props) $$invalidate(2, y = $$props.y);
    		if ("icon" in $$props) $$invalidate(3, icon = $$props.icon);
    	};

    	$$self.$capture_state = () => ({ action, x, y, icon });

    	$$self.$inject_state = $$props => {
    		if ("action" in $$props) $$invalidate(0, action = $$props.action);
    		if ("x" in $$props) $$invalidate(1, x = $$props.x);
    		if ("y" in $$props) $$invalidate(2, y = $$props.y);
    		if ("icon" in $$props) $$invalidate(3, icon = $$props.icon);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [action, x, y, icon];
    }

    class SvgButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { action: 0, x: 1, y: 2, icon: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SvgButton",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*action*/ ctx[0] === undefined && !("action" in props)) {
    			console.warn("<SvgButton> was created without expected prop 'action'");
    		}

    		if (/*x*/ ctx[1] === undefined && !("x" in props)) {
    			console.warn("<SvgButton> was created without expected prop 'x'");
    		}

    		if (/*y*/ ctx[2] === undefined && !("y" in props)) {
    			console.warn("<SvgButton> was created without expected prop 'y'");
    		}

    		if (/*icon*/ ctx[3] === undefined && !("icon" in props)) {
    			console.warn("<SvgButton> was created without expected prop 'icon'");
    		}
    	}

    	get action() {
    		throw new Error("<SvgButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set action(value) {
    		throw new Error("<SvgButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x() {
    		throw new Error("<SvgButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<SvgButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<SvgButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<SvgButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<SvgButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<SvgButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/icons/Cross.svelte generated by Svelte v3.32.0 */

    const file$2 = "src/components/icons/Cross.svelte";

    function create_fragment$2(ctx) {
    	let line0;
    	let t;
    	let line1;

    	const block = {
    		c: function create() {
    			line0 = svg_element("line");
    			t = space();
    			line1 = svg_element("line");
    			attr_dev(line0, "x1", "10");
    			attr_dev(line0, "y1", "10");
    			attr_dev(line0, "x2", "40");
    			attr_dev(line0, "y2", "40");
    			attr_dev(line0, "class", "svelte-zqvjwe");
    			add_location(line0, file$2, 0, 0, 0);
    			attr_dev(line1, "x1", "10");
    			attr_dev(line1, "y1", "40");
    			attr_dev(line1, "x2", "40");
    			attr_dev(line1, "y2", "10");
    			attr_dev(line1, "class", "svelte-zqvjwe");
    			add_location(line1, file$2, 1, 0, 33);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line0, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, line1, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(line1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Cross", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Cross> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Cross extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Cross",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    const baseLayout = [
      {
        group: 'know',
        title: 'Data Sources',
        description: 'TKTKTK',
        row: 0,
        column: 0,
      },
      {
        group: 'know',
        title: 'Rights around data sources',
        description: 'TKTKTK',
        row: 0,
        column: 1,
      },
      {
        group: 'know',
        title: 'Limitations in data sources',
        description: 'TKTKTK',
        row: 0,
        column: 2,
      },
      {
        group: 'know',
        title: 'Ethical and legislative context',
        description: 'TKTKTK',
        row: 0,
        column: 3,
      },
      {
        group: 'explore',
        title: 'Your reason for using data',
        description: 'TKTKTK',
        row: 1,
        column: 0,
      },
      {
        group: 'explore',
        title: 'Positive effects on people',
        description: 'TKTKTK',
        row: 1,
        column: 1,
      },
      {
        group: 'explore',
        title: 'Negative effects on people',
        description: 'TKTKTK',
        row: 1,
        column: 2,
      },
      {
        group: 'explore',
        title: 'Minimising negative effects',
        description: 'TKTKTK',
        row: 1,
        column: 3,
      },
      {
        group: 'plan',
        title: 'Engaging with people',
        description: 'TKTKTK',
        row: 2,
        column: 0,
      },
      {
        group: 'plan',
        title: 'Communicating your purpose',
        description: 'TKTKTK',
        row: 2,
        column: 1,
      },
      {
        group: 'plan',
        title: 'Openness and transparency',
        description: 'TKTKTK',
        row: 2,
        column: 2,
      },
      {
        group: 'plan',
        title: 'Sharing data with others',
        description: 'TKTKTK',
        row: 2,
        column: 3,
      },
      {
        group: 'integrate',
        title: 'Ongoing implementation',
        description: 'TKTKTK',
        row: 0,
        column: 4,
      },
      {
        group: 'integrate',
        title: 'Reviews and iterations',
        description: 'TKTKTK',
        row: 1,
        column: 4,
      },
      {
        group: 'integrate',
        title: 'Your actions',
        description: 'TKTKTK',
        row: 2,
        column: 4,
      },
    ];

    // Unique ID creation requires a high quality random # generator. In the browser we therefore
    // require the crypto API and do not support built-in fallback to lower quality random number
    // generators (like Math.random()).
    var getRandomValues;
    var rnds8 = new Uint8Array(16);
    function rng() {
      // lazy load so that environments that need to polyfill have a chance to do so
      if (!getRandomValues) {
        // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
        // find the complete implementation of crypto (msCrypto) on IE11.
        getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

        if (!getRandomValues) {
          throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
        }
      }

      return getRandomValues(rnds8);
    }

    var REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

    function validate(uuid) {
      return typeof uuid === 'string' && REGEX.test(uuid);
    }

    /**
     * Convert array of 16 byte values to UUID string format of the form:
     * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
     */

    var byteToHex = [];

    for (var i = 0; i < 256; ++i) {
      byteToHex.push((i + 0x100).toString(16).substr(1));
    }

    function stringify(arr) {
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      // Note: Be careful editing this code!  It's been tuned for performance
      // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
      var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
      // of the following:
      // - One or more input array values don't map to a hex octet (leading to
      // "undefined" in the uuid)
      // - Invalid input values for the RFC `version` or `variant` fields

      if (!validate(uuid)) {
        throw TypeError('Stringified UUID is invalid');
      }

      return uuid;
    }

    function v4(options, buf, offset) {
      options = options || {};
      var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

      rnds[6] = rnds[6] & 0x0f | 0x40;
      rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

      if (buf) {
        offset = offset || 0;

        for (var i = 0; i < 16; ++i) {
          buf[offset + i] = rnds[i];
        }

        return buf;
      }

      return stringify(rnds);
    }

    const canvas = () => {
        const { subscribe, set, update } = writable({ blobs: baseLayout });
        const setId = (id = v4()) => update((s) => {
            s.uuid = id;
            return s;
        });
        setId();
        return {
            subscribe,
            set,
            update,
        };
    };
    const canvasState = canvas();

    function fade(node, { delay = 0, duration = 400, easing = identity }) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* src/components/Canvas.svelte generated by Svelte v3.32.0 */
    const file$3 = "src/components/Canvas.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	child_ctx[9] = list;
    	child_ctx[10] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    // (16:4) {#each Array(cols * rows).fill().map((_, i) => i) as cell}
    function create_each_block_1(ctx) {
    	let ellipse;

    	const block = {
    		c: function create() {
    			ellipse = svg_element("ellipse");
    			attr_dev(ellipse, "cy", Math.floor(/*cell*/ ctx[11] / 5));
    			attr_dev(ellipse, "cx", /*cell*/ ctx[11] % 5);
    			attr_dev(ellipse, "rx", 0.5 + /*areaConfig*/ ctx[2].overlap * 3);
    			add_location(ellipse, file$3, 16, 6, 731);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ellipse, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ellipse);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(16:4) {#each Array(cols * rows).fill().map((_, i) => i) as cell}",
    		ctx
    	});

    	return block;
    }

    // (22:2) {#each $canvasState.blobs as blobState}
    function create_each_block(ctx) {
    	let blob;
    	let current;

    	function func_1(...args) {
    		return /*func_1*/ ctx[5](/*blobState*/ ctx[8], /*each_value*/ ctx[9], /*blobState_index*/ ctx[10], ...args);
    	}

    	function func_2(...args) {
    		return /*func_2*/ ctx[6](/*blobState*/ ctx[8], /*each_value*/ ctx[9], /*blobState_index*/ ctx[10], ...args);
    	}

    	const blob_spread_levels = [
    		/*blobState*/ ctx[8],
    		{ setHover: func_1 },
    		{ setFocus: func_2 },
    		/*areaConfig*/ ctx[2],
    		{ canvasHeight: /*height*/ ctx[4] }
    	];

    	let blob_props = {};

    	for (let i = 0; i < blob_spread_levels.length; i += 1) {
    		blob_props = assign(blob_props, blob_spread_levels[i]);
    	}

    	blob = new Blob({ props: blob_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(blob.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(blob, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			const blob_changes = (dirty & /*$canvasState, areaConfig, height*/ 21)
    			? get_spread_update(blob_spread_levels, [
    					dirty & /*$canvasState*/ 1 && get_spread_object(/*blobState*/ ctx[8]),
    					dirty & /*$canvasState*/ 1 && { setHover: func_1 },
    					dirty & /*$canvasState*/ 1 && { setFocus: func_2 },
    					dirty & /*areaConfig*/ 4 && get_spread_object(/*areaConfig*/ ctx[2]),
    					dirty & /*height*/ 16 && { canvasHeight: /*height*/ ctx[4] }
    				])
    			: {};

    			blob.$set(blob_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(blob.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(blob.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(blob, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(22:2) {#each $canvasState.blobs as blobState}",
    		ctx
    	});

    	return block;
    }

    // (32:2) {#if focusBlob > -1}
    function create_if_block(ctx) {
    	let g;
    	let rect;
    	let blob;
    	let svgbutton;
    	let g_transition;
    	let current;

    	const blob_spread_levels = [
    		/*$canvasState*/ ctx[0].blobs[/*focusBlob*/ ctx[1]],
    		/*areaConfig*/ ctx[2],
    		{ canvasHeight: /*height*/ ctx[4] }
    	];

    	let blob_props = {};

    	for (let i = 0; i < blob_spread_levels.length; i += 1) {
    		blob_props = assign(blob_props, blob_spread_levels[i]);
    	}

    	blob = new Blob({ props: blob_props, $$inline: true });

    	svgbutton = new SvgButton({
    			props: {
    				x: cols * /*areaConfig*/ ctx[2].size - 50,
    				y: "0",
    				action: /*func_3*/ ctx[7],
    				icon: Cross
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			rect = svg_element("rect");
    			create_component(blob.$$.fragment);
    			create_component(svgbutton.$$.fragment);
    			attr_dev(rect, "class", "blank svelte-zbxuet");
    			attr_dev(rect, "x", -/*margin*/ ctx[3]);
    			attr_dev(rect, "y", -/*margin*/ ctx[3]);
    			attr_dev(rect, "width", cols * /*areaConfig*/ ctx[2].size + 2 * /*margin*/ ctx[3]);
    			attr_dev(rect, "height", /*height*/ ctx[4] + 2 * /*margin*/ ctx[3]);
    			add_location(rect, file$3, 33, 4, 1239);
    			attr_dev(g, "class", "editor");
    			add_location(g, file$3, 32, 2, 1178);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			append_dev(g, rect);
    			mount_component(blob, g, null);
    			mount_component(svgbutton, g, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const blob_changes = (dirty & /*$canvasState, focusBlob, areaConfig, height*/ 23)
    			? get_spread_update(blob_spread_levels, [
    					dirty & /*$canvasState, focusBlob*/ 3 && get_spread_object(/*$canvasState*/ ctx[0].blobs[/*focusBlob*/ ctx[1]]),
    					dirty & /*areaConfig*/ 4 && get_spread_object(/*areaConfig*/ ctx[2]),
    					dirty & /*height*/ 16 && { canvasHeight: /*height*/ ctx[4] }
    				])
    			: {};

    			blob.$set(blob_changes);
    			const svgbutton_changes = {};
    			if (dirty & /*$canvasState, focusBlob*/ 3) svgbutton_changes.action = /*func_3*/ ctx[7];
    			svgbutton.$set(svgbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(blob.$$.fragment, local);
    			transition_in(svgbutton.$$.fragment, local);

    			add_render_callback(() => {
    				if (!g_transition) g_transition = create_bidirectional_transition(g, fade, { duration: 100 }, true);
    				g_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(blob.$$.fragment, local);
    			transition_out(svgbutton.$$.fragment, local);
    			if (!g_transition) g_transition = create_bidirectional_transition(g, fade, { duration: 100 }, false);
    			g_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			destroy_component(blob);
    			destroy_component(svgbutton);
    			if (detaching && g_transition) g_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(32:2) {#if focusBlob > -1}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let svg;
    	let g;
    	let rect;
    	let each1_anchor;
    	let current;
    	let each_value_1 = Array(cols * rows).fill().map(func);
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*$canvasState*/ ctx[0].blobs;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let if_block = /*focusBlob*/ ctx[1] > -1 && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g = svg_element("g");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			rect = svg_element("rect");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each1_anchor = empty();
    			if (if_block) if_block.c();
    			attr_dev(rect, "width", cols - 1);
    			attr_dev(rect, "height", rows - 1);
    			add_location(rect, file$3, 18, 4, 838);
    			attr_dev(g, "class", "cloud svelte-zbxuet");
    			attr_dev(g, "transform", "scale(" + /*areaConfig*/ ctx[2].size + ") translate(0.5 0.5)");
    			add_location(g, file$3, 14, 2, 586);
    			attr_dev(svg, "viewBox", "-" + /*margin*/ ctx[3] + " -" + /*margin*/ ctx[3] + " " + (cols * /*areaConfig*/ ctx[2].size + 2 * /*margin*/ ctx[3]) + " " + (/*height*/ ctx[4] + 2 * /*margin*/ ctx[3]));
    			attr_dev(svg, "class", "svelte-zbxuet");
    			add_location(svg, file$3, 13, 0, 481);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(g, null);
    			}

    			append_dev(g, rect);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(svg, null);
    			}

    			append_dev(svg, each1_anchor);
    			if (if_block) if_block.m(svg, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*Math, Array, cols, rows, areaConfig*/ 4) {
    				each_value_1 = Array(cols * rows).fill().map(func);
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(g, rect);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*$canvasState, areaConfig, height*/ 21) {
    				each_value = /*$canvasState*/ ctx[0].blobs;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(svg, each1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (/*focusBlob*/ ctx[1] > -1) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*focusBlob*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(svg, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const cols = 5;
    const rows = 3;
    const func = (_, i) => i;

    function instance$3($$self, $$props, $$invalidate) {
    	let focusBlob;
    	let $canvasState;
    	validate_store(canvasState, "canvasState");
    	component_subscribe($$self, canvasState, $$value => $$invalidate(0, $canvasState = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Canvas", slots, []);
    	const areaConfig = { size: 200, overlap: 0.05 };
    	const margin = areaConfig.size * areaConfig.overlap * 5;
    	const height = rows * areaConfig.size;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Canvas> was created with unknown prop '${key}'`);
    	});

    	const func_1 = (blobState, each_value, blobState_index, state) => set_store_value(canvasState, each_value[blobState_index].hovered = state, $canvasState);
    	const func_2 = (blobState, each_value, blobState_index, state) => set_store_value(canvasState, each_value[blobState_index].focussed = state, $canvasState);
    	const func_3 = () => set_store_value(canvasState, $canvasState.blobs[focusBlob].focussed = false, $canvasState);

    	$$self.$capture_state = () => ({
    		Blob,
    		SvgButton,
    		Cross,
    		canvasState,
    		fade,
    		cols,
    		rows,
    		areaConfig,
    		margin,
    		height,
    		focusBlob,
    		$canvasState
    	});

    	$$self.$inject_state = $$props => {
    		if ("focusBlob" in $$props) $$invalidate(1, focusBlob = $$props.focusBlob);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$canvasState*/ 1) {
    			 $$invalidate(1, focusBlob = $canvasState.blobs.findIndex(x => x.focussed === true));
    		}
    	};

    	return [$canvasState, focusBlob, areaConfig, margin, height, func_1, func_2, func_3];
    }

    class Canvas extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Canvas",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.32.0 */
    const file$4 = "src/App.svelte";

    function create_fragment$4(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let canvas;
    	let current;
    	canvas = new Canvas({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "ODI Learning Data Ethics Canvas";
    			t1 = space();
    			create_component(canvas.$$.fragment);
    			add_location(h1, file$4, 4, 1, 86);
    			attr_dev(main, "class", "svelte-cg2kj3");
    			add_location(main, file$4, 3, 0, 78);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			mount_component(canvas, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(canvas.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(canvas.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(canvas);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Canvas });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
