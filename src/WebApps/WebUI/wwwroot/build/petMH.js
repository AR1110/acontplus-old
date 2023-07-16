var petMH = (function () {
	'use strict';

	/** @returns {void} */
	function noop$1() {}

	function run(fn) {
		return fn();
	}

	function blank_object() {
		return Object.create(null);
	}

	/**
	 * @param {Function[]} fns
	 * @returns {void}
	 */
	function run_all(fns) {
		fns.forEach(run);
	}

	/**
	 * @param {any} thing
	 * @returns {thing is Function}
	 */
	function is_function(thing) {
		return typeof thing === 'function';
	}

	/** @returns {boolean} */
	function safe_not_equal(a, b) {
		return a != a ? b == b : a !== b || (a && typeof a === 'object') || typeof a === 'function';
	}

	/** @returns {boolean} */
	function is_empty(obj) {
		return Object.keys(obj).length === 0;
	}

	function action_destroyer(action_result) {
		return action_result && is_function(action_result.destroy) ? action_result.destroy : noop$1;
	}

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @returns {void}
	 */
	function append(target, node) {
		target.appendChild(node);
	}

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @param {Node} [anchor]
	 * @returns {void}
	 */
	function insert(target, node, anchor) {
		target.insertBefore(node, anchor || null);
	}

	/**
	 * @param {Node} node
	 * @returns {void}
	 */
	function detach(node) {
		if (node.parentNode) {
			node.parentNode.removeChild(node);
		}
	}

	/**
	 * @returns {void} */
	function destroy_each(iterations, detaching) {
		for (let i = 0; i < iterations.length; i += 1) {
			if (iterations[i]) iterations[i].d(detaching);
		}
	}

	/**
	 * @template {keyof HTMLElementTagNameMap} K
	 * @param {K} name
	 * @returns {HTMLElementTagNameMap[K]}
	 */
	function element(name) {
		return document.createElement(name);
	}

	/**
	 * @param {string} data
	 * @returns {Text}
	 */
	function text(data) {
		return document.createTextNode(data);
	}

	/**
	 * @returns {Text} */
	function space() {
		return text(' ');
	}

	/**
	 * @param {EventTarget} node
	 * @param {string} event
	 * @param {EventListenerOrEventListenerObject} handler
	 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options]
	 * @returns {() => void}
	 */
	function listen(node, event, handler, options) {
		node.addEventListener(event, handler, options);
		return () => node.removeEventListener(event, handler, options);
	}

	/**
	 * @returns {(event: any) => any} */
	function prevent_default(fn) {
		return function (event) {
			event.preventDefault();
			// @ts-ignore
			return fn.call(this, event);
		};
	}

	/**
	 * @param {Element} node
	 * @param {string} attribute
	 * @param {string} [value]
	 * @returns {void}
	 */
	function attr(node, attribute, value) {
		if (value == null) node.removeAttribute(attribute);
		else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
	}

	/**
	 * @param {Element} element
	 * @returns {ChildNode[]}
	 */
	function children(element) {
		return Array.from(element.childNodes);
	}

	/**
	 * @param {Text} text
	 * @param {unknown} data
	 * @returns {void}
	 */
	function set_data(text, data) {
		data = '' + data;
		if (text.data === data) return;
		text.data = /** @type {string} */ (data);
	}

	/**
	 * @returns {void} */
	function set_input_value(input, value) {
		input.value = value == null ? '' : value;
	}

	/**
	 * @returns {void} */
	function set_style(node, key, value, important) {
		if (value == null) {
			node.style.removeProperty(key);
		} else {
			node.style.setProperty(key, value, important ? 'important' : '');
		}
	}

	/**
	 * @typedef {Node & {
	 * 	claim_order?: number;
	 * 	hydrate_init?: true;
	 * 	actual_end_child?: NodeEx;
	 * 	childNodes: NodeListOf<NodeEx>;
	 * }} NodeEx
	 */

	/** @typedef {ChildNode & NodeEx} ChildNodeEx */

	/** @typedef {NodeEx & { claim_order: number }} NodeEx2 */

	/**
	 * @typedef {ChildNodeEx[] & {
	 * 	claim_info?: {
	 * 		last_index: number;
	 * 		total_claimed: number;
	 * 	};
	 * }} ChildNodeArray
	 */

	let current_component;

	/** @returns {void} */
	function set_current_component(component) {
		current_component = component;
	}

	function get_current_component() {
		if (!current_component) throw new Error('Function called outside component initialization');
		return current_component;
	}

	/**
	 * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
	 * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
	 * it can be called from an external module).
	 *
	 * If a function is returned _synchronously_ from `onMount`, it will be called when the component is unmounted.
	 *
	 * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
	 *
	 * https://svelte.dev/docs/svelte#onmount
	 * @template T
	 * @param {() => import('./private.js').NotFunction<T> | Promise<import('./private.js').NotFunction<T>> | (() => any)} fn
	 * @returns {void}
	 */
	function onMount(fn) {
		get_current_component().$$.on_mount.push(fn);
	}

	// TODO figure out if we still want to support
	// shorthand events, or if we want to implement
	// a real bubbling mechanism
	/**
	 * @param component
	 * @param event
	 * @returns {void}
	 */
	function bubble(component, event) {
		const callbacks = component.$$.callbacks[event.type];
		if (callbacks) {
			// @ts-ignore
			callbacks.slice().forEach((fn) => fn.call(this, event));
		}
	}

	const dirty_components = [];
	const binding_callbacks = [];

	let render_callbacks = [];

	const flush_callbacks = [];

	const resolved_promise = /* @__PURE__ */ Promise.resolve();

	let update_scheduled = false;

	/** @returns {void} */
	function schedule_update() {
		if (!update_scheduled) {
			update_scheduled = true;
			resolved_promise.then(flush);
		}
	}

	/** @returns {void} */
	function add_render_callback(fn) {
		render_callbacks.push(fn);
	}

	/** @returns {void} */
	function add_flush_callback(fn) {
		flush_callbacks.push(fn);
	}

	// flush() calls callbacks in this order:
	// 1. All beforeUpdate callbacks, in order: parents before children
	// 2. All bind:this callbacks, in reverse order: children before parents.
	// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
	//    for afterUpdates called during the initial onMount, which are called in
	//    reverse order: children before parents.
	// Since callbacks might update component values, which could trigger another
	// call to flush(), the following steps guard against this:
	// 1. During beforeUpdate, any updated components will be added to the
	//    dirty_components array and will cause a reentrant call to flush(). Because
	//    the flush index is kept outside the function, the reentrant call will pick
	//    up where the earlier call left off and go through all dirty components. The
	//    current_component value is saved and restored so that the reentrant call will
	//    not interfere with the "parent" flush() call.
	// 2. bind:this callbacks cannot trigger new flush() calls.
	// 3. During afterUpdate, any updated components will NOT have their afterUpdate
	//    callback called a second time; the seen_callbacks set, outside the flush()
	//    function, guarantees this behavior.
	const seen_callbacks = new Set();

	let flushidx = 0; // Do *not* move this inside the flush() function

	/** @returns {void} */
	function flush() {
		// Do not reenter flush while dirty components are updated, as this can
		// result in an infinite loop. Instead, let the inner flush handle it.
		// Reentrancy is ok afterwards for bindings etc.
		if (flushidx !== 0) {
			return;
		}
		const saved_component = current_component;
		do {
			// first, call beforeUpdate functions
			// and update components
			try {
				while (flushidx < dirty_components.length) {
					const component = dirty_components[flushidx];
					flushidx++;
					set_current_component(component);
					update(component.$$);
				}
			} catch (e) {
				// reset dirty state to not end up in a deadlocked state and then rethrow
				dirty_components.length = 0;
				flushidx = 0;
				throw e;
			}
			set_current_component(null);
			dirty_components.length = 0;
			flushidx = 0;
			while (binding_callbacks.length) binding_callbacks.pop()();
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
		seen_callbacks.clear();
		set_current_component(saved_component);
	}

	/** @returns {void} */
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

	/**
	 * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
	 * @param {Function[]} fns
	 * @returns {void}
	 */
	function flush_render_callbacks(fns) {
		const filtered = [];
		const targets = [];
		render_callbacks.forEach((c) => (fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c)));
		targets.forEach((c) => c());
		render_callbacks = filtered;
	}

	const outroing = new Set();

	/**
	 * @type {Outro}
	 */
	let outros;

	/**
	 * @returns {void} */
	function group_outros() {
		outros = {
			r: 0,
			c: [],
			p: outros // parent group
		};
	}

	/**
	 * @returns {void} */
	function check_outros() {
		if (!outros.r) {
			run_all(outros.c);
		}
		outros = outros.p;
	}

	/**
	 * @param {import('./private.js').Fragment} block
	 * @param {0 | 1} [local]
	 * @returns {void}
	 */
	function transition_in(block, local) {
		if (block && block.i) {
			outroing.delete(block);
			block.i(local);
		}
	}

	/**
	 * @param {import('./private.js').Fragment} block
	 * @param {0 | 1} local
	 * @param {0 | 1} [detach]
	 * @param {() => void} [callback]
	 * @returns {void}
	 */
	function transition_out(block, local, detach, callback) {
		if (block && block.o) {
			if (outroing.has(block)) return;
			outroing.add(block);
			outros.c.push(() => {
				outroing.delete(block);
				if (callback) {
					if (detach) block.d(1);
					callback();
				}
			});
			block.o(local);
		} else if (callback) {
			callback();
		}
	}

	/** @typedef {1} INTRO */
	/** @typedef {0} OUTRO */
	/** @typedef {{ direction: 'in' | 'out' | 'both' }} TransitionOptions */
	/** @typedef {(node: Element, params: any, options: TransitionOptions) => import('../transition/public.js').TransitionConfig} TransitionFn */

	/**
	 * @typedef {Object} Outro
	 * @property {number} r
	 * @property {Function[]} c
	 * @property {Object} p
	 */

	/**
	 * @typedef {Object} PendingProgram
	 * @property {number} start
	 * @property {INTRO|OUTRO} b
	 * @property {Outro} [group]
	 */

	/**
	 * @typedef {Object} Program
	 * @property {number} a
	 * @property {INTRO|OUTRO} b
	 * @property {1|-1} d
	 * @property {number} duration
	 * @property {number} start
	 * @property {number} end
	 * @property {Outro} [group]
	 */

	// general each functions:

	function ensure_array_like(array_like_or_iterator) {
		return array_like_or_iterator?.length !== undefined
			? array_like_or_iterator
			: Array.from(array_like_or_iterator);
	}

	/** @returns {void} */
	function bind$1(component, name, callback) {
		const index = component.$$.props[name];
		if (index !== undefined) {
			component.$$.bound[index] = callback;
			callback(component.$$.ctx[index]);
		}
	}

	/** @returns {void} */
	function create_component(block) {
		block && block.c();
	}

	/** @returns {void} */
	function mount_component(component, target, anchor) {
		const { fragment, after_update } = component.$$;
		fragment && fragment.m(target, anchor);
		// onMount happens before the initial afterUpdate
		add_render_callback(() => {
			const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
			// if the component was destroyed immediately
			// it will update the `$$.on_destroy` reference to `null`.
			// the destructured on_destroy may still reference to the old array
			if (component.$$.on_destroy) {
				component.$$.on_destroy.push(...new_on_destroy);
			} else {
				// Edge case - component was destroyed immediately,
				// most likely as a result of a binding initialising
				run_all(new_on_destroy);
			}
			component.$$.on_mount = [];
		});
		after_update.forEach(add_render_callback);
	}

	/** @returns {void} */
	function destroy_component(component, detaching) {
		const $$ = component.$$;
		if ($$.fragment !== null) {
			flush_render_callbacks($$.after_update);
			run_all($$.on_destroy);
			$$.fragment && $$.fragment.d(detaching);
			// TODO null out other refs, including component.$$ (but need to
			// preserve final state?)
			$$.on_destroy = $$.fragment = null;
			$$.ctx = [];
		}
	}

	/** @returns {void} */
	function make_dirty(component, i) {
		if (component.$$.dirty[0] === -1) {
			dirty_components.push(component);
			schedule_update();
			component.$$.dirty.fill(0);
		}
		component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
	}

	/** @returns {void} */
	function init(
		component,
		options,
		instance,
		create_fragment,
		not_equal,
		props,
		append_styles,
		dirty = [-1]
	) {
		const parent_component = current_component;
		set_current_component(component);
		/** @type {import('./private.js').T$$} */
		const $$ = (component.$$ = {
			fragment: null,
			ctx: [],
			// state
			props,
			update: noop$1,
			not_equal,
			bound: blank_object(),
			// lifecycle
			on_mount: [],
			on_destroy: [],
			on_disconnect: [],
			before_update: [],
			after_update: [],
			context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
			// everything else
			callbacks: blank_object(),
			dirty,
			skip_bound: false,
			root: options.target || parent_component.$$.root
		});
		append_styles && append_styles($$.root);
		let ready = false;
		$$.ctx = instance
			? instance(component, options.props || {}, (i, ret, ...rest) => {
					const value = rest.length ? rest[0] : ret;
					if ($$.ctx && not_equal($$.ctx[i], ($$.ctx[i] = value))) {
						if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
						if (ready) make_dirty(component, i);
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
			} else {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				$$.fragment && $$.fragment.c();
			}
			if (options.intro) transition_in(component.$$.fragment);
			mount_component(component, options.target, options.anchor);
			flush();
		}
		set_current_component(parent_component);
	}

	/**
	 * Base class for Svelte components. Used when dev=false.
	 *
	 * @template {Record<string, any>} [Props=any]
	 * @template {Record<string, any>} [Events=any]
	 */
	class SvelteComponent {
		/**
		 * ### PRIVATE API
		 *
		 * Do not use, may change at any time
		 *
		 * @type {any}
		 */
		$$ = undefined;
		/**
		 * ### PRIVATE API
		 *
		 * Do not use, may change at any time
		 *
		 * @type {any}
		 */
		$$set = undefined;

		/** @returns {void} */
		$destroy() {
			destroy_component(this, 1);
			this.$destroy = noop$1;
		}

		/**
		 * @template {Extract<keyof Events, string>} K
		 * @param {K} type
		 * @param {((e: Events[K]) => void) | null | undefined} callback
		 * @returns {() => void}
		 */
		$on(type, callback) {
			if (!is_function(callback)) {
				return noop$1;
			}
			const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
			callbacks.push(callback);
			return () => {
				const index = callbacks.indexOf(callback);
				if (index !== -1) callbacks.splice(index, 1);
			};
		}

		/**
		 * @param {Partial<Props>} props
		 * @returns {void}
		 */
		$set(props) {
			if (this.$$set && !is_empty(props)) {
				this.$$.skip_bound = true;
				this.$$set(props);
				this.$$.skip_bound = false;
			}
		}
	}

	/**
	 * @typedef {Object} CustomElementPropDefinition
	 * @property {string} [attribute]
	 * @property {boolean} [reflect]
	 * @property {'String'|'Boolean'|'Number'|'Array'|'Object'} [type]
	 */

	// generated during release, do not modify
	const PUBLIC_VERSION = '4';

	if (typeof window !== 'undefined')
		// @ts-ignore
		(window.__svelte || (window.__svelte = { v: new Set() })).v.add(PUBLIC_VERSION);

	function bind(fn, thisArg) {
	  return function wrap() {
	    return fn.apply(thisArg, arguments);
	  };
	}

	// utils is a library of generic helper functions non-specific to axios

	const {toString} = Object.prototype;
	const {getPrototypeOf} = Object;

	const kindOf = (cache => thing => {
	    const str = toString.call(thing);
	    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
	})(Object.create(null));

	const kindOfTest = (type) => {
	  type = type.toLowerCase();
	  return (thing) => kindOf(thing) === type
	};

	const typeOfTest = type => thing => typeof thing === type;

	/**
	 * Determine if a value is an Array
	 *
	 * @param {Object} val The value to test
	 *
	 * @returns {boolean} True if value is an Array, otherwise false
	 */
	const {isArray} = Array;

	/**
	 * Determine if a value is undefined
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if the value is undefined, otherwise false
	 */
	const isUndefined = typeOfTest('undefined');

	/**
	 * Determine if a value is a Buffer
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a Buffer, otherwise false
	 */
	function isBuffer(val) {
	  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
	    && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
	}

	/**
	 * Determine if a value is an ArrayBuffer
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
	 */
	const isArrayBuffer = kindOfTest('ArrayBuffer');


	/**
	 * Determine if a value is a view on an ArrayBuffer
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
	 */
	function isArrayBufferView(val) {
	  let result;
	  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
	    result = ArrayBuffer.isView(val);
	  } else {
	    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
	  }
	  return result;
	}

	/**
	 * Determine if a value is a String
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a String, otherwise false
	 */
	const isString = typeOfTest('string');

	/**
	 * Determine if a value is a Function
	 *
	 * @param {*} val The value to test
	 * @returns {boolean} True if value is a Function, otherwise false
	 */
	const isFunction = typeOfTest('function');

	/**
	 * Determine if a value is a Number
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a Number, otherwise false
	 */
	const isNumber = typeOfTest('number');

	/**
	 * Determine if a value is an Object
	 *
	 * @param {*} thing The value to test
	 *
	 * @returns {boolean} True if value is an Object, otherwise false
	 */
	const isObject = (thing) => thing !== null && typeof thing === 'object';

	/**
	 * Determine if a value is a Boolean
	 *
	 * @param {*} thing The value to test
	 * @returns {boolean} True if value is a Boolean, otherwise false
	 */
	const isBoolean = thing => thing === true || thing === false;

	/**
	 * Determine if a value is a plain Object
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a plain Object, otherwise false
	 */
	const isPlainObject = (val) => {
	  if (kindOf(val) !== 'object') {
	    return false;
	  }

	  const prototype = getPrototypeOf(val);
	  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
	};

	/**
	 * Determine if a value is a Date
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a Date, otherwise false
	 */
	const isDate = kindOfTest('Date');

	/**
	 * Determine if a value is a File
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a File, otherwise false
	 */
	const isFile = kindOfTest('File');

	/**
	 * Determine if a value is a Blob
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a Blob, otherwise false
	 */
	const isBlob = kindOfTest('Blob');

	/**
	 * Determine if a value is a FileList
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a File, otherwise false
	 */
	const isFileList = kindOfTest('FileList');

	/**
	 * Determine if a value is a Stream
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a Stream, otherwise false
	 */
	const isStream = (val) => isObject(val) && isFunction(val.pipe);

	/**
	 * Determine if a value is a FormData
	 *
	 * @param {*} thing The value to test
	 *
	 * @returns {boolean} True if value is an FormData, otherwise false
	 */
	const isFormData = (thing) => {
	  let kind;
	  return thing && (
	    (typeof FormData === 'function' && thing instanceof FormData) || (
	      isFunction(thing.append) && (
	        (kind = kindOf(thing)) === 'formdata' ||
	        // detect form-data instance
	        (kind === 'object' && isFunction(thing.toString) && thing.toString() === '[object FormData]')
	      )
	    )
	  )
	};

	/**
	 * Determine if a value is a URLSearchParams object
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
	 */
	const isURLSearchParams = kindOfTest('URLSearchParams');

	/**
	 * Trim excess whitespace off the beginning and end of a string
	 *
	 * @param {String} str The String to trim
	 *
	 * @returns {String} The String freed of excess whitespace
	 */
	const trim = (str) => str.trim ?
	  str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

	/**
	 * Iterate over an Array or an Object invoking a function for each item.
	 *
	 * If `obj` is an Array callback will be called passing
	 * the value, index, and complete array for each item.
	 *
	 * If 'obj' is an Object callback will be called passing
	 * the value, key, and complete object for each property.
	 *
	 * @param {Object|Array} obj The object to iterate
	 * @param {Function} fn The callback to invoke for each item
	 *
	 * @param {Boolean} [allOwnKeys = false]
	 * @returns {any}
	 */
	function forEach(obj, fn, {allOwnKeys = false} = {}) {
	  // Don't bother if no value provided
	  if (obj === null || typeof obj === 'undefined') {
	    return;
	  }

	  let i;
	  let l;

	  // Force an array if not already something iterable
	  if (typeof obj !== 'object') {
	    /*eslint no-param-reassign:0*/
	    obj = [obj];
	  }

	  if (isArray(obj)) {
	    // Iterate over array values
	    for (i = 0, l = obj.length; i < l; i++) {
	      fn.call(null, obj[i], i, obj);
	    }
	  } else {
	    // Iterate over object keys
	    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
	    const len = keys.length;
	    let key;

	    for (i = 0; i < len; i++) {
	      key = keys[i];
	      fn.call(null, obj[key], key, obj);
	    }
	  }
	}

	function findKey(obj, key) {
	  key = key.toLowerCase();
	  const keys = Object.keys(obj);
	  let i = keys.length;
	  let _key;
	  while (i-- > 0) {
	    _key = keys[i];
	    if (key === _key.toLowerCase()) {
	      return _key;
	    }
	  }
	  return null;
	}

	const _global = (() => {
	  /*eslint no-undef:0*/
	  if (typeof globalThis !== "undefined") return globalThis;
	  return typeof self !== "undefined" ? self : (typeof window !== 'undefined' ? window : global)
	})();

	const isContextDefined = (context) => !isUndefined(context) && context !== _global;

	/**
	 * Accepts varargs expecting each argument to be an object, then
	 * immutably merges the properties of each object and returns result.
	 *
	 * When multiple objects contain the same key the later object in
	 * the arguments list will take precedence.
	 *
	 * Example:
	 *
	 * ```js
	 * var result = merge({foo: 123}, {foo: 456});
	 * console.log(result.foo); // outputs 456
	 * ```
	 *
	 * @param {Object} obj1 Object to merge
	 *
	 * @returns {Object} Result of all merge properties
	 */
	function merge(/* obj1, obj2, obj3, ... */) {
	  const {caseless} = isContextDefined(this) && this || {};
	  const result = {};
	  const assignValue = (val, key) => {
	    const targetKey = caseless && findKey(result, key) || key;
	    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
	      result[targetKey] = merge(result[targetKey], val);
	    } else if (isPlainObject(val)) {
	      result[targetKey] = merge({}, val);
	    } else if (isArray(val)) {
	      result[targetKey] = val.slice();
	    } else {
	      result[targetKey] = val;
	    }
	  };

	  for (let i = 0, l = arguments.length; i < l; i++) {
	    arguments[i] && forEach(arguments[i], assignValue);
	  }
	  return result;
	}

	/**
	 * Extends object a by mutably adding to it the properties of object b.
	 *
	 * @param {Object} a The object to be extended
	 * @param {Object} b The object to copy properties from
	 * @param {Object} thisArg The object to bind function to
	 *
	 * @param {Boolean} [allOwnKeys]
	 * @returns {Object} The resulting value of object a
	 */
	const extend = (a, b, thisArg, {allOwnKeys}= {}) => {
	  forEach(b, (val, key) => {
	    if (thisArg && isFunction(val)) {
	      a[key] = bind(val, thisArg);
	    } else {
	      a[key] = val;
	    }
	  }, {allOwnKeys});
	  return a;
	};

	/**
	 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
	 *
	 * @param {string} content with BOM
	 *
	 * @returns {string} content value without BOM
	 */
	const stripBOM = (content) => {
	  if (content.charCodeAt(0) === 0xFEFF) {
	    content = content.slice(1);
	  }
	  return content;
	};

	/**
	 * Inherit the prototype methods from one constructor into another
	 * @param {function} constructor
	 * @param {function} superConstructor
	 * @param {object} [props]
	 * @param {object} [descriptors]
	 *
	 * @returns {void}
	 */
	const inherits = (constructor, superConstructor, props, descriptors) => {
	  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
	  constructor.prototype.constructor = constructor;
	  Object.defineProperty(constructor, 'super', {
	    value: superConstructor.prototype
	  });
	  props && Object.assign(constructor.prototype, props);
	};

	/**
	 * Resolve object with deep prototype chain to a flat object
	 * @param {Object} sourceObj source object
	 * @param {Object} [destObj]
	 * @param {Function|Boolean} [filter]
	 * @param {Function} [propFilter]
	 *
	 * @returns {Object}
	 */
	const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
	  let props;
	  let i;
	  let prop;
	  const merged = {};

	  destObj = destObj || {};
	  // eslint-disable-next-line no-eq-null,eqeqeq
	  if (sourceObj == null) return destObj;

	  do {
	    props = Object.getOwnPropertyNames(sourceObj);
	    i = props.length;
	    while (i-- > 0) {
	      prop = props[i];
	      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
	        destObj[prop] = sourceObj[prop];
	        merged[prop] = true;
	      }
	    }
	    sourceObj = filter !== false && getPrototypeOf(sourceObj);
	  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

	  return destObj;
	};

	/**
	 * Determines whether a string ends with the characters of a specified string
	 *
	 * @param {String} str
	 * @param {String} searchString
	 * @param {Number} [position= 0]
	 *
	 * @returns {boolean}
	 */
	const endsWith = (str, searchString, position) => {
	  str = String(str);
	  if (position === undefined || position > str.length) {
	    position = str.length;
	  }
	  position -= searchString.length;
	  const lastIndex = str.indexOf(searchString, position);
	  return lastIndex !== -1 && lastIndex === position;
	};


	/**
	 * Returns new array from array like object or null if failed
	 *
	 * @param {*} [thing]
	 *
	 * @returns {?Array}
	 */
	const toArray = (thing) => {
	  if (!thing) return null;
	  if (isArray(thing)) return thing;
	  let i = thing.length;
	  if (!isNumber(i)) return null;
	  const arr = new Array(i);
	  while (i-- > 0) {
	    arr[i] = thing[i];
	  }
	  return arr;
	};

	/**
	 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
	 * thing passed in is an instance of Uint8Array
	 *
	 * @param {TypedArray}
	 *
	 * @returns {Array}
	 */
	// eslint-disable-next-line func-names
	const isTypedArray = (TypedArray => {
	  // eslint-disable-next-line func-names
	  return thing => {
	    return TypedArray && thing instanceof TypedArray;
	  };
	})(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

	/**
	 * For each entry in the object, call the function with the key and value.
	 *
	 * @param {Object<any, any>} obj - The object to iterate over.
	 * @param {Function} fn - The function to call for each entry.
	 *
	 * @returns {void}
	 */
	const forEachEntry = (obj, fn) => {
	  const generator = obj && obj[Symbol.iterator];

	  const iterator = generator.call(obj);

	  let result;

	  while ((result = iterator.next()) && !result.done) {
	    const pair = result.value;
	    fn.call(obj, pair[0], pair[1]);
	  }
	};

	/**
	 * It takes a regular expression and a string, and returns an array of all the matches
	 *
	 * @param {string} regExp - The regular expression to match against.
	 * @param {string} str - The string to search.
	 *
	 * @returns {Array<boolean>}
	 */
	const matchAll = (regExp, str) => {
	  let matches;
	  const arr = [];

	  while ((matches = regExp.exec(str)) !== null) {
	    arr.push(matches);
	  }

	  return arr;
	};

	/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
	const isHTMLForm = kindOfTest('HTMLFormElement');

	const toCamelCase = str => {
	  return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,
	    function replacer(m, p1, p2) {
	      return p1.toUpperCase() + p2;
	    }
	  );
	};

	/* Creating a function that will check if an object has a property. */
	const hasOwnProperty = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

	/**
	 * Determine if a value is a RegExp object
	 *
	 * @param {*} val The value to test
	 *
	 * @returns {boolean} True if value is a RegExp object, otherwise false
	 */
	const isRegExp = kindOfTest('RegExp');

	const reduceDescriptors = (obj, reducer) => {
	  const descriptors = Object.getOwnPropertyDescriptors(obj);
	  const reducedDescriptors = {};

	  forEach(descriptors, (descriptor, name) => {
	    if (reducer(descriptor, name, obj) !== false) {
	      reducedDescriptors[name] = descriptor;
	    }
	  });

	  Object.defineProperties(obj, reducedDescriptors);
	};

	/**
	 * Makes all methods read-only
	 * @param {Object} obj
	 */

	const freezeMethods = (obj) => {
	  reduceDescriptors(obj, (descriptor, name) => {
	    // skip restricted props in strict mode
	    if (isFunction(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
	      return false;
	    }

	    const value = obj[name];

	    if (!isFunction(value)) return;

	    descriptor.enumerable = false;

	    if ('writable' in descriptor) {
	      descriptor.writable = false;
	      return;
	    }

	    if (!descriptor.set) {
	      descriptor.set = () => {
	        throw Error('Can not rewrite read-only method \'' + name + '\'');
	      };
	    }
	  });
	};

	const toObjectSet = (arrayOrString, delimiter) => {
	  const obj = {};

	  const define = (arr) => {
	    arr.forEach(value => {
	      obj[value] = true;
	    });
	  };

	  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

	  return obj;
	};

	const noop = () => {};

	const toFiniteNumber = (value, defaultValue) => {
	  value = +value;
	  return Number.isFinite(value) ? value : defaultValue;
	};

	const ALPHA = 'abcdefghijklmnopqrstuvwxyz';

	const DIGIT = '0123456789';

	const ALPHABET = {
	  DIGIT,
	  ALPHA,
	  ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
	};

	const generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
	  let str = '';
	  const {length} = alphabet;
	  while (size--) {
	    str += alphabet[Math.random() * length|0];
	  }

	  return str;
	};

	/**
	 * If the thing is a FormData object, return true, otherwise return false.
	 *
	 * @param {unknown} thing - The thing to check.
	 *
	 * @returns {boolean}
	 */
	function isSpecCompliantForm(thing) {
	  return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === 'FormData' && thing[Symbol.iterator]);
	}

	const toJSONObject = (obj) => {
	  const stack = new Array(10);

	  const visit = (source, i) => {

	    if (isObject(source)) {
	      if (stack.indexOf(source) >= 0) {
	        return;
	      }

	      if(!('toJSON' in source)) {
	        stack[i] = source;
	        const target = isArray(source) ? [] : {};

	        forEach(source, (value, key) => {
	          const reducedValue = visit(value, i + 1);
	          !isUndefined(reducedValue) && (target[key] = reducedValue);
	        });

	        stack[i] = undefined;

	        return target;
	      }
	    }

	    return source;
	  };

	  return visit(obj, 0);
	};

	const isAsyncFn = kindOfTest('AsyncFunction');

	const isThenable = (thing) =>
	  thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);

	var utils = {
	  isArray,
	  isArrayBuffer,
	  isBuffer,
	  isFormData,
	  isArrayBufferView,
	  isString,
	  isNumber,
	  isBoolean,
	  isObject,
	  isPlainObject,
	  isUndefined,
	  isDate,
	  isFile,
	  isBlob,
	  isRegExp,
	  isFunction,
	  isStream,
	  isURLSearchParams,
	  isTypedArray,
	  isFileList,
	  forEach,
	  merge,
	  extend,
	  trim,
	  stripBOM,
	  inherits,
	  toFlatObject,
	  kindOf,
	  kindOfTest,
	  endsWith,
	  toArray,
	  forEachEntry,
	  matchAll,
	  isHTMLForm,
	  hasOwnProperty,
	  hasOwnProp: hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
	  reduceDescriptors,
	  freezeMethods,
	  toObjectSet,
	  toCamelCase,
	  noop,
	  toFiniteNumber,
	  findKey,
	  global: _global,
	  isContextDefined,
	  ALPHABET,
	  generateString,
	  isSpecCompliantForm,
	  toJSONObject,
	  isAsyncFn,
	  isThenable
	};

	/**
	 * Create an Error with the specified message, config, error code, request and response.
	 *
	 * @param {string} message The error message.
	 * @param {string} [code] The error code (for example, 'ECONNABORTED').
	 * @param {Object} [config] The config.
	 * @param {Object} [request] The request.
	 * @param {Object} [response] The response.
	 *
	 * @returns {Error} The created error.
	 */
	function AxiosError(message, code, config, request, response) {
	  Error.call(this);

	  if (Error.captureStackTrace) {
	    Error.captureStackTrace(this, this.constructor);
	  } else {
	    this.stack = (new Error()).stack;
	  }

	  this.message = message;
	  this.name = 'AxiosError';
	  code && (this.code = code);
	  config && (this.config = config);
	  request && (this.request = request);
	  response && (this.response = response);
	}

	utils.inherits(AxiosError, Error, {
	  toJSON: function toJSON() {
	    return {
	      // Standard
	      message: this.message,
	      name: this.name,
	      // Microsoft
	      description: this.description,
	      number: this.number,
	      // Mozilla
	      fileName: this.fileName,
	      lineNumber: this.lineNumber,
	      columnNumber: this.columnNumber,
	      stack: this.stack,
	      // Axios
	      config: utils.toJSONObject(this.config),
	      code: this.code,
	      status: this.response && this.response.status ? this.response.status : null
	    };
	  }
	});

	const prototype$1 = AxiosError.prototype;
	const descriptors = {};

	[
	  'ERR_BAD_OPTION_VALUE',
	  'ERR_BAD_OPTION',
	  'ECONNABORTED',
	  'ETIMEDOUT',
	  'ERR_NETWORK',
	  'ERR_FR_TOO_MANY_REDIRECTS',
	  'ERR_DEPRECATED',
	  'ERR_BAD_RESPONSE',
	  'ERR_BAD_REQUEST',
	  'ERR_CANCELED',
	  'ERR_NOT_SUPPORT',
	  'ERR_INVALID_URL'
	// eslint-disable-next-line func-names
	].forEach(code => {
	  descriptors[code] = {value: code};
	});

	Object.defineProperties(AxiosError, descriptors);
	Object.defineProperty(prototype$1, 'isAxiosError', {value: true});

	// eslint-disable-next-line func-names
	AxiosError.from = (error, code, config, request, response, customProps) => {
	  const axiosError = Object.create(prototype$1);

	  utils.toFlatObject(error, axiosError, function filter(obj) {
	    return obj !== Error.prototype;
	  }, prop => {
	    return prop !== 'isAxiosError';
	  });

	  AxiosError.call(axiosError, error.message, code, config, request, response);

	  axiosError.cause = error;

	  axiosError.name = error.name;

	  customProps && Object.assign(axiosError, customProps);

	  return axiosError;
	};

	// eslint-disable-next-line strict
	var httpAdapter = null;

	/**
	 * Determines if the given thing is a array or js object.
	 *
	 * @param {string} thing - The object or array to be visited.
	 *
	 * @returns {boolean}
	 */
	function isVisitable(thing) {
	  return utils.isPlainObject(thing) || utils.isArray(thing);
	}

	/**
	 * It removes the brackets from the end of a string
	 *
	 * @param {string} key - The key of the parameter.
	 *
	 * @returns {string} the key without the brackets.
	 */
	function removeBrackets(key) {
	  return utils.endsWith(key, '[]') ? key.slice(0, -2) : key;
	}

	/**
	 * It takes a path, a key, and a boolean, and returns a string
	 *
	 * @param {string} path - The path to the current key.
	 * @param {string} key - The key of the current object being iterated over.
	 * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
	 *
	 * @returns {string} The path to the current key.
	 */
	function renderKey(path, key, dots) {
	  if (!path) return key;
	  return path.concat(key).map(function each(token, i) {
	    // eslint-disable-next-line no-param-reassign
	    token = removeBrackets(token);
	    return !dots && i ? '[' + token + ']' : token;
	  }).join(dots ? '.' : '');
	}

	/**
	 * If the array is an array and none of its elements are visitable, then it's a flat array.
	 *
	 * @param {Array<any>} arr - The array to check
	 *
	 * @returns {boolean}
	 */
	function isFlatArray(arr) {
	  return utils.isArray(arr) && !arr.some(isVisitable);
	}

	const predicates = utils.toFlatObject(utils, {}, null, function filter(prop) {
	  return /^is[A-Z]/.test(prop);
	});

	/**
	 * Convert a data object to FormData
	 *
	 * @param {Object} obj
	 * @param {?Object} [formData]
	 * @param {?Object} [options]
	 * @param {Function} [options.visitor]
	 * @param {Boolean} [options.metaTokens = true]
	 * @param {Boolean} [options.dots = false]
	 * @param {?Boolean} [options.indexes = false]
	 *
	 * @returns {Object}
	 **/

	/**
	 * It converts an object into a FormData object
	 *
	 * @param {Object<any, any>} obj - The object to convert to form data.
	 * @param {string} formData - The FormData object to append to.
	 * @param {Object<string, any>} options
	 *
	 * @returns
	 */
	function toFormData(obj, formData, options) {
	  if (!utils.isObject(obj)) {
	    throw new TypeError('target must be an object');
	  }

	  // eslint-disable-next-line no-param-reassign
	  formData = formData || new (FormData)();

	  // eslint-disable-next-line no-param-reassign
	  options = utils.toFlatObject(options, {
	    metaTokens: true,
	    dots: false,
	    indexes: false
	  }, false, function defined(option, source) {
	    // eslint-disable-next-line no-eq-null,eqeqeq
	    return !utils.isUndefined(source[option]);
	  });

	  const metaTokens = options.metaTokens;
	  // eslint-disable-next-line no-use-before-define
	  const visitor = options.visitor || defaultVisitor;
	  const dots = options.dots;
	  const indexes = options.indexes;
	  const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
	  const useBlob = _Blob && utils.isSpecCompliantForm(formData);

	  if (!utils.isFunction(visitor)) {
	    throw new TypeError('visitor must be a function');
	  }

	  function convertValue(value) {
	    if (value === null) return '';

	    if (utils.isDate(value)) {
	      return value.toISOString();
	    }

	    if (!useBlob && utils.isBlob(value)) {
	      throw new AxiosError('Blob is not supported. Use a Buffer instead.');
	    }

	    if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
	      return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
	    }

	    return value;
	  }

	  /**
	   * Default visitor.
	   *
	   * @param {*} value
	   * @param {String|Number} key
	   * @param {Array<String|Number>} path
	   * @this {FormData}
	   *
	   * @returns {boolean} return true to visit the each prop of the value recursively
	   */
	  function defaultVisitor(value, key, path) {
	    let arr = value;

	    if (value && !path && typeof value === 'object') {
	      if (utils.endsWith(key, '{}')) {
	        // eslint-disable-next-line no-param-reassign
	        key = metaTokens ? key : key.slice(0, -2);
	        // eslint-disable-next-line no-param-reassign
	        value = JSON.stringify(value);
	      } else if (
	        (utils.isArray(value) && isFlatArray(value)) ||
	        ((utils.isFileList(value) || utils.endsWith(key, '[]')) && (arr = utils.toArray(value))
	        )) {
	        // eslint-disable-next-line no-param-reassign
	        key = removeBrackets(key);

	        arr.forEach(function each(el, index) {
	          !(utils.isUndefined(el) || el === null) && formData.append(
	            // eslint-disable-next-line no-nested-ternary
	            indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
	            convertValue(el)
	          );
	        });
	        return false;
	      }
	    }

	    if (isVisitable(value)) {
	      return true;
	    }

	    formData.append(renderKey(path, key, dots), convertValue(value));

	    return false;
	  }

	  const stack = [];

	  const exposedHelpers = Object.assign(predicates, {
	    defaultVisitor,
	    convertValue,
	    isVisitable
	  });

	  function build(value, path) {
	    if (utils.isUndefined(value)) return;

	    if (stack.indexOf(value) !== -1) {
	      throw Error('Circular reference detected in ' + path.join('.'));
	    }

	    stack.push(value);

	    utils.forEach(value, function each(el, key) {
	      const result = !(utils.isUndefined(el) || el === null) && visitor.call(
	        formData, el, utils.isString(key) ? key.trim() : key, path, exposedHelpers
	      );

	      if (result === true) {
	        build(el, path ? path.concat(key) : [key]);
	      }
	    });

	    stack.pop();
	  }

	  if (!utils.isObject(obj)) {
	    throw new TypeError('data must be an object');
	  }

	  build(obj);

	  return formData;
	}

	/**
	 * It encodes a string by replacing all characters that are not in the unreserved set with
	 * their percent-encoded equivalents
	 *
	 * @param {string} str - The string to encode.
	 *
	 * @returns {string} The encoded string.
	 */
	function encode$1(str) {
	  const charMap = {
	    '!': '%21',
	    "'": '%27',
	    '(': '%28',
	    ')': '%29',
	    '~': '%7E',
	    '%20': '+',
	    '%00': '\x00'
	  };
	  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
	    return charMap[match];
	  });
	}

	/**
	 * It takes a params object and converts it to a FormData object
	 *
	 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
	 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
	 *
	 * @returns {void}
	 */
	function AxiosURLSearchParams(params, options) {
	  this._pairs = [];

	  params && toFormData(params, this, options);
	}

	const prototype = AxiosURLSearchParams.prototype;

	prototype.append = function append(name, value) {
	  this._pairs.push([name, value]);
	};

	prototype.toString = function toString(encoder) {
	  const _encode = encoder ? function(value) {
	    return encoder.call(this, value, encode$1);
	  } : encode$1;

	  return this._pairs.map(function each(pair) {
	    return _encode(pair[0]) + '=' + _encode(pair[1]);
	  }, '').join('&');
	};

	/**
	 * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
	 * URI encoded counterparts
	 *
	 * @param {string} val The value to be encoded.
	 *
	 * @returns {string} The encoded value.
	 */
	function encode(val) {
	  return encodeURIComponent(val).
	    replace(/%3A/gi, ':').
	    replace(/%24/g, '$').
	    replace(/%2C/gi, ',').
	    replace(/%20/g, '+').
	    replace(/%5B/gi, '[').
	    replace(/%5D/gi, ']');
	}

	/**
	 * Build a URL by appending params to the end
	 *
	 * @param {string} url The base of the url (e.g., http://www.google.com)
	 * @param {object} [params] The params to be appended
	 * @param {?object} options
	 *
	 * @returns {string} The formatted url
	 */
	function buildURL(url, params, options) {
	  /*eslint no-param-reassign:0*/
	  if (!params) {
	    return url;
	  }
	  
	  const _encode = options && options.encode || encode;

	  const serializeFn = options && options.serialize;

	  let serializedParams;

	  if (serializeFn) {
	    serializedParams = serializeFn(params, options);
	  } else {
	    serializedParams = utils.isURLSearchParams(params) ?
	      params.toString() :
	      new AxiosURLSearchParams(params, options).toString(_encode);
	  }

	  if (serializedParams) {
	    const hashmarkIndex = url.indexOf("#");

	    if (hashmarkIndex !== -1) {
	      url = url.slice(0, hashmarkIndex);
	    }
	    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
	  }

	  return url;
	}

	class InterceptorManager {
	  constructor() {
	    this.handlers = [];
	  }

	  /**
	   * Add a new interceptor to the stack
	   *
	   * @param {Function} fulfilled The function to handle `then` for a `Promise`
	   * @param {Function} rejected The function to handle `reject` for a `Promise`
	   *
	   * @return {Number} An ID used to remove interceptor later
	   */
	  use(fulfilled, rejected, options) {
	    this.handlers.push({
	      fulfilled,
	      rejected,
	      synchronous: options ? options.synchronous : false,
	      runWhen: options ? options.runWhen : null
	    });
	    return this.handlers.length - 1;
	  }

	  /**
	   * Remove an interceptor from the stack
	   *
	   * @param {Number} id The ID that was returned by `use`
	   *
	   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
	   */
	  eject(id) {
	    if (this.handlers[id]) {
	      this.handlers[id] = null;
	    }
	  }

	  /**
	   * Clear all interceptors from the stack
	   *
	   * @returns {void}
	   */
	  clear() {
	    if (this.handlers) {
	      this.handlers = [];
	    }
	  }

	  /**
	   * Iterate over all the registered interceptors
	   *
	   * This method is particularly useful for skipping over any
	   * interceptors that may have become `null` calling `eject`.
	   *
	   * @param {Function} fn The function to call for each interceptor
	   *
	   * @returns {void}
	   */
	  forEach(fn) {
	    utils.forEach(this.handlers, function forEachHandler(h) {
	      if (h !== null) {
	        fn(h);
	      }
	    });
	  }
	}

	var InterceptorManager$1 = InterceptorManager;

	var transitionalDefaults = {
	  silentJSONParsing: true,
	  forcedJSONParsing: true,
	  clarifyTimeoutError: false
	};

	var URLSearchParams$1 = typeof URLSearchParams !== 'undefined' ? URLSearchParams : AxiosURLSearchParams;

	var FormData$1 = typeof FormData !== 'undefined' ? FormData : null;

	var Blob$1 = typeof Blob !== 'undefined' ? Blob : null;

	/**
	 * Determine if we're running in a standard browser environment
	 *
	 * This allows axios to run in a web worker, and react-native.
	 * Both environments support XMLHttpRequest, but not fully standard globals.
	 *
	 * web workers:
	 *  typeof window -> undefined
	 *  typeof document -> undefined
	 *
	 * react-native:
	 *  navigator.product -> 'ReactNative'
	 * nativescript
	 *  navigator.product -> 'NativeScript' or 'NS'
	 *
	 * @returns {boolean}
	 */
	const isStandardBrowserEnv = (() => {
	  let product;
	  if (typeof navigator !== 'undefined' && (
	    (product = navigator.product) === 'ReactNative' ||
	    product === 'NativeScript' ||
	    product === 'NS')
	  ) {
	    return false;
	  }

	  return typeof window !== 'undefined' && typeof document !== 'undefined';
	})();

	/**
	 * Determine if we're running in a standard browser webWorker environment
	 *
	 * Although the `isStandardBrowserEnv` method indicates that
	 * `allows axios to run in a web worker`, the WebWorker will still be
	 * filtered out due to its judgment standard
	 * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
	 * This leads to a problem when axios post `FormData` in webWorker
	 */
	 const isStandardBrowserWebWorkerEnv = (() => {
	  return (
	    typeof WorkerGlobalScope !== 'undefined' &&
	    // eslint-disable-next-line no-undef
	    self instanceof WorkerGlobalScope &&
	    typeof self.importScripts === 'function'
	  );
	})();


	var platform = {
	  isBrowser: true,
	  classes: {
	    URLSearchParams: URLSearchParams$1,
	    FormData: FormData$1,
	    Blob: Blob$1
	  },
	  isStandardBrowserEnv,
	  isStandardBrowserWebWorkerEnv,
	  protocols: ['http', 'https', 'file', 'blob', 'url', 'data']
	};

	function toURLEncodedForm(data, options) {
	  return toFormData(data, new platform.classes.URLSearchParams(), Object.assign({
	    visitor: function(value, key, path, helpers) {
	      if (platform.isNode && utils.isBuffer(value)) {
	        this.append(key, value.toString('base64'));
	        return false;
	      }

	      return helpers.defaultVisitor.apply(this, arguments);
	    }
	  }, options));
	}

	/**
	 * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
	 *
	 * @param {string} name - The name of the property to get.
	 *
	 * @returns An array of strings.
	 */
	function parsePropPath(name) {
	  // foo[x][y][z]
	  // foo.x.y.z
	  // foo-x-y-z
	  // foo x y z
	  return utils.matchAll(/\w+|\[(\w*)]/g, name).map(match => {
	    return match[0] === '[]' ? '' : match[1] || match[0];
	  });
	}

	/**
	 * Convert an array to an object.
	 *
	 * @param {Array<any>} arr - The array to convert to an object.
	 *
	 * @returns An object with the same keys and values as the array.
	 */
	function arrayToObject(arr) {
	  const obj = {};
	  const keys = Object.keys(arr);
	  let i;
	  const len = keys.length;
	  let key;
	  for (i = 0; i < len; i++) {
	    key = keys[i];
	    obj[key] = arr[key];
	  }
	  return obj;
	}

	/**
	 * It takes a FormData object and returns a JavaScript object
	 *
	 * @param {string} formData The FormData object to convert to JSON.
	 *
	 * @returns {Object<string, any> | null} The converted object.
	 */
	function formDataToJSON(formData) {
	  function buildPath(path, value, target, index) {
	    let name = path[index++];
	    const isNumericKey = Number.isFinite(+name);
	    const isLast = index >= path.length;
	    name = !name && utils.isArray(target) ? target.length : name;

	    if (isLast) {
	      if (utils.hasOwnProp(target, name)) {
	        target[name] = [target[name], value];
	      } else {
	        target[name] = value;
	      }

	      return !isNumericKey;
	    }

	    if (!target[name] || !utils.isObject(target[name])) {
	      target[name] = [];
	    }

	    const result = buildPath(path, value, target[name], index);

	    if (result && utils.isArray(target[name])) {
	      target[name] = arrayToObject(target[name]);
	    }

	    return !isNumericKey;
	  }

	  if (utils.isFormData(formData) && utils.isFunction(formData.entries)) {
	    const obj = {};

	    utils.forEachEntry(formData, (name, value) => {
	      buildPath(parsePropPath(name), value, obj, 0);
	    });

	    return obj;
	  }

	  return null;
	}

	const DEFAULT_CONTENT_TYPE = {
	  'Content-Type': undefined
	};

	/**
	 * It takes a string, tries to parse it, and if it fails, it returns the stringified version
	 * of the input
	 *
	 * @param {any} rawValue - The value to be stringified.
	 * @param {Function} parser - A function that parses a string into a JavaScript object.
	 * @param {Function} encoder - A function that takes a value and returns a string.
	 *
	 * @returns {string} A stringified version of the rawValue.
	 */
	function stringifySafely(rawValue, parser, encoder) {
	  if (utils.isString(rawValue)) {
	    try {
	      (parser || JSON.parse)(rawValue);
	      return utils.trim(rawValue);
	    } catch (e) {
	      if (e.name !== 'SyntaxError') {
	        throw e;
	      }
	    }
	  }

	  return (encoder || JSON.stringify)(rawValue);
	}

	const defaults = {

	  transitional: transitionalDefaults,

	  adapter: ['xhr', 'http'],

	  transformRequest: [function transformRequest(data, headers) {
	    const contentType = headers.getContentType() || '';
	    const hasJSONContentType = contentType.indexOf('application/json') > -1;
	    const isObjectPayload = utils.isObject(data);

	    if (isObjectPayload && utils.isHTMLForm(data)) {
	      data = new FormData(data);
	    }

	    const isFormData = utils.isFormData(data);

	    if (isFormData) {
	      if (!hasJSONContentType) {
	        return data;
	      }
	      return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
	    }

	    if (utils.isArrayBuffer(data) ||
	      utils.isBuffer(data) ||
	      utils.isStream(data) ||
	      utils.isFile(data) ||
	      utils.isBlob(data)
	    ) {
	      return data;
	    }
	    if (utils.isArrayBufferView(data)) {
	      return data.buffer;
	    }
	    if (utils.isURLSearchParams(data)) {
	      headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
	      return data.toString();
	    }

	    let isFileList;

	    if (isObjectPayload) {
	      if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
	        return toURLEncodedForm(data, this.formSerializer).toString();
	      }

	      if ((isFileList = utils.isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
	        const _FormData = this.env && this.env.FormData;

	        return toFormData(
	          isFileList ? {'files[]': data} : data,
	          _FormData && new _FormData(),
	          this.formSerializer
	        );
	      }
	    }

	    if (isObjectPayload || hasJSONContentType ) {
	      headers.setContentType('application/json', false);
	      return stringifySafely(data);
	    }

	    return data;
	  }],

	  transformResponse: [function transformResponse(data) {
	    const transitional = this.transitional || defaults.transitional;
	    const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
	    const JSONRequested = this.responseType === 'json';

	    if (data && utils.isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
	      const silentJSONParsing = transitional && transitional.silentJSONParsing;
	      const strictJSONParsing = !silentJSONParsing && JSONRequested;

	      try {
	        return JSON.parse(data);
	      } catch (e) {
	        if (strictJSONParsing) {
	          if (e.name === 'SyntaxError') {
	            throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
	          }
	          throw e;
	        }
	      }
	    }

	    return data;
	  }],

	  /**
	   * A timeout in milliseconds to abort a request. If set to 0 (default) a
	   * timeout is not created.
	   */
	  timeout: 0,

	  xsrfCookieName: 'XSRF-TOKEN',
	  xsrfHeaderName: 'X-XSRF-TOKEN',

	  maxContentLength: -1,
	  maxBodyLength: -1,

	  env: {
	    FormData: platform.classes.FormData,
	    Blob: platform.classes.Blob
	  },

	  validateStatus: function validateStatus(status) {
	    return status >= 200 && status < 300;
	  },

	  headers: {
	    common: {
	      'Accept': 'application/json, text/plain, */*'
	    }
	  }
	};

	utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
	  defaults.headers[method] = {};
	});

	utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
	  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
	});

	var defaults$1 = defaults;

	// RawAxiosHeaders whose duplicates are ignored by node
	// c.f. https://nodejs.org/api/http.html#http_message_headers
	const ignoreDuplicateOf = utils.toObjectSet([
	  'age', 'authorization', 'content-length', 'content-type', 'etag',
	  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
	  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
	  'referer', 'retry-after', 'user-agent'
	]);

	/**
	 * Parse headers into an object
	 *
	 * ```
	 * Date: Wed, 27 Aug 2014 08:58:49 GMT
	 * Content-Type: application/json
	 * Connection: keep-alive
	 * Transfer-Encoding: chunked
	 * ```
	 *
	 * @param {String} rawHeaders Headers needing to be parsed
	 *
	 * @returns {Object} Headers parsed into an object
	 */
	var parseHeaders = rawHeaders => {
	  const parsed = {};
	  let key;
	  let val;
	  let i;

	  rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
	    i = line.indexOf(':');
	    key = line.substring(0, i).trim().toLowerCase();
	    val = line.substring(i + 1).trim();

	    if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
	      return;
	    }

	    if (key === 'set-cookie') {
	      if (parsed[key]) {
	        parsed[key].push(val);
	      } else {
	        parsed[key] = [val];
	      }
	    } else {
	      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
	    }
	  });

	  return parsed;
	};

	const $internals = Symbol('internals');

	function normalizeHeader(header) {
	  return header && String(header).trim().toLowerCase();
	}

	function normalizeValue(value) {
	  if (value === false || value == null) {
	    return value;
	  }

	  return utils.isArray(value) ? value.map(normalizeValue) : String(value);
	}

	function parseTokens(str) {
	  const tokens = Object.create(null);
	  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
	  let match;

	  while ((match = tokensRE.exec(str))) {
	    tokens[match[1]] = match[2];
	  }

	  return tokens;
	}

	const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());

	function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
	  if (utils.isFunction(filter)) {
	    return filter.call(this, value, header);
	  }

	  if (isHeaderNameFilter) {
	    value = header;
	  }

	  if (!utils.isString(value)) return;

	  if (utils.isString(filter)) {
	    return value.indexOf(filter) !== -1;
	  }

	  if (utils.isRegExp(filter)) {
	    return filter.test(value);
	  }
	}

	function formatHeader(header) {
	  return header.trim()
	    .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
	      return char.toUpperCase() + str;
	    });
	}

	function buildAccessors(obj, header) {
	  const accessorName = utils.toCamelCase(' ' + header);

	  ['get', 'set', 'has'].forEach(methodName => {
	    Object.defineProperty(obj, methodName + accessorName, {
	      value: function(arg1, arg2, arg3) {
	        return this[methodName].call(this, header, arg1, arg2, arg3);
	      },
	      configurable: true
	    });
	  });
	}

	class AxiosHeaders {
	  constructor(headers) {
	    headers && this.set(headers);
	  }

	  set(header, valueOrRewrite, rewrite) {
	    const self = this;

	    function setHeader(_value, _header, _rewrite) {
	      const lHeader = normalizeHeader(_header);

	      if (!lHeader) {
	        throw new Error('header name must be a non-empty string');
	      }

	      const key = utils.findKey(self, lHeader);

	      if(!key || self[key] === undefined || _rewrite === true || (_rewrite === undefined && self[key] !== false)) {
	        self[key || _header] = normalizeValue(_value);
	      }
	    }

	    const setHeaders = (headers, _rewrite) =>
	      utils.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));

	    if (utils.isPlainObject(header) || header instanceof this.constructor) {
	      setHeaders(header, valueOrRewrite);
	    } else if(utils.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
	      setHeaders(parseHeaders(header), valueOrRewrite);
	    } else {
	      header != null && setHeader(valueOrRewrite, header, rewrite);
	    }

	    return this;
	  }

	  get(header, parser) {
	    header = normalizeHeader(header);

	    if (header) {
	      const key = utils.findKey(this, header);

	      if (key) {
	        const value = this[key];

	        if (!parser) {
	          return value;
	        }

	        if (parser === true) {
	          return parseTokens(value);
	        }

	        if (utils.isFunction(parser)) {
	          return parser.call(this, value, key);
	        }

	        if (utils.isRegExp(parser)) {
	          return parser.exec(value);
	        }

	        throw new TypeError('parser must be boolean|regexp|function');
	      }
	    }
	  }

	  has(header, matcher) {
	    header = normalizeHeader(header);

	    if (header) {
	      const key = utils.findKey(this, header);

	      return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
	    }

	    return false;
	  }

	  delete(header, matcher) {
	    const self = this;
	    let deleted = false;

	    function deleteHeader(_header) {
	      _header = normalizeHeader(_header);

	      if (_header) {
	        const key = utils.findKey(self, _header);

	        if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
	          delete self[key];

	          deleted = true;
	        }
	      }
	    }

	    if (utils.isArray(header)) {
	      header.forEach(deleteHeader);
	    } else {
	      deleteHeader(header);
	    }

	    return deleted;
	  }

	  clear(matcher) {
	    const keys = Object.keys(this);
	    let i = keys.length;
	    let deleted = false;

	    while (i--) {
	      const key = keys[i];
	      if(!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
	        delete this[key];
	        deleted = true;
	      }
	    }

	    return deleted;
	  }

	  normalize(format) {
	    const self = this;
	    const headers = {};

	    utils.forEach(this, (value, header) => {
	      const key = utils.findKey(headers, header);

	      if (key) {
	        self[key] = normalizeValue(value);
	        delete self[header];
	        return;
	      }

	      const normalized = format ? formatHeader(header) : String(header).trim();

	      if (normalized !== header) {
	        delete self[header];
	      }

	      self[normalized] = normalizeValue(value);

	      headers[normalized] = true;
	    });

	    return this;
	  }

	  concat(...targets) {
	    return this.constructor.concat(this, ...targets);
	  }

	  toJSON(asStrings) {
	    const obj = Object.create(null);

	    utils.forEach(this, (value, header) => {
	      value != null && value !== false && (obj[header] = asStrings && utils.isArray(value) ? value.join(', ') : value);
	    });

	    return obj;
	  }

	  [Symbol.iterator]() {
	    return Object.entries(this.toJSON())[Symbol.iterator]();
	  }

	  toString() {
	    return Object.entries(this.toJSON()).map(([header, value]) => header + ': ' + value).join('\n');
	  }

	  get [Symbol.toStringTag]() {
	    return 'AxiosHeaders';
	  }

	  static from(thing) {
	    return thing instanceof this ? thing : new this(thing);
	  }

	  static concat(first, ...targets) {
	    const computed = new this(first);

	    targets.forEach((target) => computed.set(target));

	    return computed;
	  }

	  static accessor(header) {
	    const internals = this[$internals] = (this[$internals] = {
	      accessors: {}
	    });

	    const accessors = internals.accessors;
	    const prototype = this.prototype;

	    function defineAccessor(_header) {
	      const lHeader = normalizeHeader(_header);

	      if (!accessors[lHeader]) {
	        buildAccessors(prototype, _header);
	        accessors[lHeader] = true;
	      }
	    }

	    utils.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

	    return this;
	  }
	}

	AxiosHeaders.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization']);

	utils.freezeMethods(AxiosHeaders.prototype);
	utils.freezeMethods(AxiosHeaders);

	var AxiosHeaders$1 = AxiosHeaders;

	/**
	 * Transform the data for a request or a response
	 *
	 * @param {Array|Function} fns A single function or Array of functions
	 * @param {?Object} response The response object
	 *
	 * @returns {*} The resulting transformed data
	 */
	function transformData(fns, response) {
	  const config = this || defaults$1;
	  const context = response || config;
	  const headers = AxiosHeaders$1.from(context.headers);
	  let data = context.data;

	  utils.forEach(fns, function transform(fn) {
	    data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
	  });

	  headers.normalize();

	  return data;
	}

	function isCancel(value) {
	  return !!(value && value.__CANCEL__);
	}

	/**
	 * A `CanceledError` is an object that is thrown when an operation is canceled.
	 *
	 * @param {string=} message The message.
	 * @param {Object=} config The config.
	 * @param {Object=} request The request.
	 *
	 * @returns {CanceledError} The created error.
	 */
	function CanceledError(message, config, request) {
	  // eslint-disable-next-line no-eq-null,eqeqeq
	  AxiosError.call(this, message == null ? 'canceled' : message, AxiosError.ERR_CANCELED, config, request);
	  this.name = 'CanceledError';
	}

	utils.inherits(CanceledError, AxiosError, {
	  __CANCEL__: true
	});

	/**
	 * Resolve or reject a Promise based on response status.
	 *
	 * @param {Function} resolve A function that resolves the promise.
	 * @param {Function} reject A function that rejects the promise.
	 * @param {object} response The response.
	 *
	 * @returns {object} The response.
	 */
	function settle(resolve, reject, response) {
	  const validateStatus = response.config.validateStatus;
	  if (!response.status || !validateStatus || validateStatus(response.status)) {
	    resolve(response);
	  } else {
	    reject(new AxiosError(
	      'Request failed with status code ' + response.status,
	      [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
	      response.config,
	      response.request,
	      response
	    ));
	  }
	}

	var cookies = platform.isStandardBrowserEnv ?

	// Standard browser envs support document.cookie
	  (function standardBrowserEnv() {
	    return {
	      write: function write(name, value, expires, path, domain, secure) {
	        const cookie = [];
	        cookie.push(name + '=' + encodeURIComponent(value));

	        if (utils.isNumber(expires)) {
	          cookie.push('expires=' + new Date(expires).toGMTString());
	        }

	        if (utils.isString(path)) {
	          cookie.push('path=' + path);
	        }

	        if (utils.isString(domain)) {
	          cookie.push('domain=' + domain);
	        }

	        if (secure === true) {
	          cookie.push('secure');
	        }

	        document.cookie = cookie.join('; ');
	      },

	      read: function read(name) {
	        const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
	        return (match ? decodeURIComponent(match[3]) : null);
	      },

	      remove: function remove(name) {
	        this.write(name, '', Date.now() - 86400000);
	      }
	    };
	  })() :

	// Non standard browser env (web workers, react-native) lack needed support.
	  (function nonStandardBrowserEnv() {
	    return {
	      write: function write() {},
	      read: function read() { return null; },
	      remove: function remove() {}
	    };
	  })();

	/**
	 * Determines whether the specified URL is absolute
	 *
	 * @param {string} url The URL to test
	 *
	 * @returns {boolean} True if the specified URL is absolute, otherwise false
	 */
	function isAbsoluteURL(url) {
	  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
	  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
	  // by any combination of letters, digits, plus, period, or hyphen.
	  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
	}

	/**
	 * Creates a new URL by combining the specified URLs
	 *
	 * @param {string} baseURL The base URL
	 * @param {string} relativeURL The relative URL
	 *
	 * @returns {string} The combined URL
	 */
	function combineURLs(baseURL, relativeURL) {
	  return relativeURL
	    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
	    : baseURL;
	}

	/**
	 * Creates a new URL by combining the baseURL with the requestedURL,
	 * only when the requestedURL is not already an absolute URL.
	 * If the requestURL is absolute, this function returns the requestedURL untouched.
	 *
	 * @param {string} baseURL The base URL
	 * @param {string} requestedURL Absolute or relative URL to combine
	 *
	 * @returns {string} The combined full path
	 */
	function buildFullPath(baseURL, requestedURL) {
	  if (baseURL && !isAbsoluteURL(requestedURL)) {
	    return combineURLs(baseURL, requestedURL);
	  }
	  return requestedURL;
	}

	var isURLSameOrigin = platform.isStandardBrowserEnv ?

	// Standard browser envs have full support of the APIs needed to test
	// whether the request URL is of the same origin as current location.
	  (function standardBrowserEnv() {
	    const msie = /(msie|trident)/i.test(navigator.userAgent);
	    const urlParsingNode = document.createElement('a');
	    let originURL;

	    /**
	    * Parse a URL to discover it's components
	    *
	    * @param {String} url The URL to be parsed
	    * @returns {Object}
	    */
	    function resolveURL(url) {
	      let href = url;

	      if (msie) {
	        // IE needs attribute set twice to normalize properties
	        urlParsingNode.setAttribute('href', href);
	        href = urlParsingNode.href;
	      }

	      urlParsingNode.setAttribute('href', href);

	      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
	      return {
	        href: urlParsingNode.href,
	        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
	        host: urlParsingNode.host,
	        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
	        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
	        hostname: urlParsingNode.hostname,
	        port: urlParsingNode.port,
	        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
	          urlParsingNode.pathname :
	          '/' + urlParsingNode.pathname
	      };
	    }

	    originURL = resolveURL(window.location.href);

	    /**
	    * Determine if a URL shares the same origin as the current location
	    *
	    * @param {String} requestURL The URL to test
	    * @returns {boolean} True if URL shares the same origin, otherwise false
	    */
	    return function isURLSameOrigin(requestURL) {
	      const parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
	      return (parsed.protocol === originURL.protocol &&
	          parsed.host === originURL.host);
	    };
	  })() :

	  // Non standard browser envs (web workers, react-native) lack needed support.
	  (function nonStandardBrowserEnv() {
	    return function isURLSameOrigin() {
	      return true;
	    };
	  })();

	function parseProtocol(url) {
	  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
	  return match && match[1] || '';
	}

	/**
	 * Calculate data maxRate
	 * @param {Number} [samplesCount= 10]
	 * @param {Number} [min= 1000]
	 * @returns {Function}
	 */
	function speedometer(samplesCount, min) {
	  samplesCount = samplesCount || 10;
	  const bytes = new Array(samplesCount);
	  const timestamps = new Array(samplesCount);
	  let head = 0;
	  let tail = 0;
	  let firstSampleTS;

	  min = min !== undefined ? min : 1000;

	  return function push(chunkLength) {
	    const now = Date.now();

	    const startedAt = timestamps[tail];

	    if (!firstSampleTS) {
	      firstSampleTS = now;
	    }

	    bytes[head] = chunkLength;
	    timestamps[head] = now;

	    let i = tail;
	    let bytesCount = 0;

	    while (i !== head) {
	      bytesCount += bytes[i++];
	      i = i % samplesCount;
	    }

	    head = (head + 1) % samplesCount;

	    if (head === tail) {
	      tail = (tail + 1) % samplesCount;
	    }

	    if (now - firstSampleTS < min) {
	      return;
	    }

	    const passed = startedAt && now - startedAt;

	    return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
	  };
	}

	function progressEventReducer(listener, isDownloadStream) {
	  let bytesNotified = 0;
	  const _speedometer = speedometer(50, 250);

	  return e => {
	    const loaded = e.loaded;
	    const total = e.lengthComputable ? e.total : undefined;
	    const progressBytes = loaded - bytesNotified;
	    const rate = _speedometer(progressBytes);
	    const inRange = loaded <= total;

	    bytesNotified = loaded;

	    const data = {
	      loaded,
	      total,
	      progress: total ? (loaded / total) : undefined,
	      bytes: progressBytes,
	      rate: rate ? rate : undefined,
	      estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
	      event: e
	    };

	    data[isDownloadStream ? 'download' : 'upload'] = true;

	    listener(data);
	  };
	}

	const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

	var xhrAdapter = isXHRAdapterSupported && function (config) {
	  return new Promise(function dispatchXhrRequest(resolve, reject) {
	    let requestData = config.data;
	    const requestHeaders = AxiosHeaders$1.from(config.headers).normalize();
	    const responseType = config.responseType;
	    let onCanceled;
	    function done() {
	      if (config.cancelToken) {
	        config.cancelToken.unsubscribe(onCanceled);
	      }

	      if (config.signal) {
	        config.signal.removeEventListener('abort', onCanceled);
	      }
	    }

	    if (utils.isFormData(requestData)) {
	      if (platform.isStandardBrowserEnv || platform.isStandardBrowserWebWorkerEnv) {
	        requestHeaders.setContentType(false); // Let the browser set it
	      } else {
	        requestHeaders.setContentType('multipart/form-data;', false); // mobile/desktop app frameworks
	      }
	    }

	    let request = new XMLHttpRequest();

	    // HTTP basic authentication
	    if (config.auth) {
	      const username = config.auth.username || '';
	      const password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
	      requestHeaders.set('Authorization', 'Basic ' + btoa(username + ':' + password));
	    }

	    const fullPath = buildFullPath(config.baseURL, config.url);

	    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

	    // Set the request timeout in MS
	    request.timeout = config.timeout;

	    function onloadend() {
	      if (!request) {
	        return;
	      }
	      // Prepare the response
	      const responseHeaders = AxiosHeaders$1.from(
	        'getAllResponseHeaders' in request && request.getAllResponseHeaders()
	      );
	      const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
	        request.responseText : request.response;
	      const response = {
	        data: responseData,
	        status: request.status,
	        statusText: request.statusText,
	        headers: responseHeaders,
	        config,
	        request
	      };

	      settle(function _resolve(value) {
	        resolve(value);
	        done();
	      }, function _reject(err) {
	        reject(err);
	        done();
	      }, response);

	      // Clean up request
	      request = null;
	    }

	    if ('onloadend' in request) {
	      // Use onloadend if available
	      request.onloadend = onloadend;
	    } else {
	      // Listen for ready state to emulate onloadend
	      request.onreadystatechange = function handleLoad() {
	        if (!request || request.readyState !== 4) {
	          return;
	        }

	        // The request errored out and we didn't get a response, this will be
	        // handled by onerror instead
	        // With one exception: request that using file: protocol, most browsers
	        // will return status as 0 even though it's a successful request
	        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
	          return;
	        }
	        // readystate handler is calling before onerror or ontimeout handlers,
	        // so we should call onloadend on the next 'tick'
	        setTimeout(onloadend);
	      };
	    }

	    // Handle browser request cancellation (as opposed to a manual cancellation)
	    request.onabort = function handleAbort() {
	      if (!request) {
	        return;
	      }

	      reject(new AxiosError('Request aborted', AxiosError.ECONNABORTED, config, request));

	      // Clean up request
	      request = null;
	    };

	    // Handle low level network errors
	    request.onerror = function handleError() {
	      // Real errors are hidden from us by the browser
	      // onerror should only fire if it's a network error
	      reject(new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request));

	      // Clean up request
	      request = null;
	    };

	    // Handle timeout
	    request.ontimeout = function handleTimeout() {
	      let timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
	      const transitional = config.transitional || transitionalDefaults;
	      if (config.timeoutErrorMessage) {
	        timeoutErrorMessage = config.timeoutErrorMessage;
	      }
	      reject(new AxiosError(
	        timeoutErrorMessage,
	        transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
	        config,
	        request));

	      // Clean up request
	      request = null;
	    };

	    // Add xsrf header
	    // This is only done if running in a standard browser environment.
	    // Specifically not if we're in a web worker, or react-native.
	    if (platform.isStandardBrowserEnv) {
	      // Add xsrf header
	      const xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath))
	        && config.xsrfCookieName && cookies.read(config.xsrfCookieName);

	      if (xsrfValue) {
	        requestHeaders.set(config.xsrfHeaderName, xsrfValue);
	      }
	    }

	    // Remove Content-Type if data is undefined
	    requestData === undefined && requestHeaders.setContentType(null);

	    // Add headers to the request
	    if ('setRequestHeader' in request) {
	      utils.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
	        request.setRequestHeader(key, val);
	      });
	    }

	    // Add withCredentials to request if needed
	    if (!utils.isUndefined(config.withCredentials)) {
	      request.withCredentials = !!config.withCredentials;
	    }

	    // Add responseType to request if needed
	    if (responseType && responseType !== 'json') {
	      request.responseType = config.responseType;
	    }

	    // Handle progress if needed
	    if (typeof config.onDownloadProgress === 'function') {
	      request.addEventListener('progress', progressEventReducer(config.onDownloadProgress, true));
	    }

	    // Not all browsers support upload events
	    if (typeof config.onUploadProgress === 'function' && request.upload) {
	      request.upload.addEventListener('progress', progressEventReducer(config.onUploadProgress));
	    }

	    if (config.cancelToken || config.signal) {
	      // Handle cancellation
	      // eslint-disable-next-line func-names
	      onCanceled = cancel => {
	        if (!request) {
	          return;
	        }
	        reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
	        request.abort();
	        request = null;
	      };

	      config.cancelToken && config.cancelToken.subscribe(onCanceled);
	      if (config.signal) {
	        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
	      }
	    }

	    const protocol = parseProtocol(fullPath);

	    if (protocol && platform.protocols.indexOf(protocol) === -1) {
	      reject(new AxiosError('Unsupported protocol ' + protocol + ':', AxiosError.ERR_BAD_REQUEST, config));
	      return;
	    }


	    // Send the request
	    request.send(requestData || null);
	  });
	};

	const knownAdapters = {
	  http: httpAdapter,
	  xhr: xhrAdapter
	};

	utils.forEach(knownAdapters, (fn, value) => {
	  if(fn) {
	    try {
	      Object.defineProperty(fn, 'name', {value});
	    } catch (e) {
	      // eslint-disable-next-line no-empty
	    }
	    Object.defineProperty(fn, 'adapterName', {value});
	  }
	});

	var adapters = {
	  getAdapter: (adapters) => {
	    adapters = utils.isArray(adapters) ? adapters : [adapters];

	    const {length} = adapters;
	    let nameOrAdapter;
	    let adapter;

	    for (let i = 0; i < length; i++) {
	      nameOrAdapter = adapters[i];
	      if((adapter = utils.isString(nameOrAdapter) ? knownAdapters[nameOrAdapter.toLowerCase()] : nameOrAdapter)) {
	        break;
	      }
	    }

	    if (!adapter) {
	      if (adapter === false) {
	        throw new AxiosError(
	          `Adapter ${nameOrAdapter} is not supported by the environment`,
	          'ERR_NOT_SUPPORT'
	        );
	      }

	      throw new Error(
	        utils.hasOwnProp(knownAdapters, nameOrAdapter) ?
	          `Adapter '${nameOrAdapter}' is not available in the build` :
	          `Unknown adapter '${nameOrAdapter}'`
	      );
	    }

	    if (!utils.isFunction(adapter)) {
	      throw new TypeError('adapter is not a function');
	    }

	    return adapter;
	  },
	  adapters: knownAdapters
	};

	/**
	 * Throws a `CanceledError` if cancellation has been requested.
	 *
	 * @param {Object} config The config that is to be used for the request
	 *
	 * @returns {void}
	 */
	function throwIfCancellationRequested(config) {
	  if (config.cancelToken) {
	    config.cancelToken.throwIfRequested();
	  }

	  if (config.signal && config.signal.aborted) {
	    throw new CanceledError(null, config);
	  }
	}

	/**
	 * Dispatch a request to the server using the configured adapter.
	 *
	 * @param {object} config The config that is to be used for the request
	 *
	 * @returns {Promise} The Promise to be fulfilled
	 */
	function dispatchRequest(config) {
	  throwIfCancellationRequested(config);

	  config.headers = AxiosHeaders$1.from(config.headers);

	  // Transform request data
	  config.data = transformData.call(
	    config,
	    config.transformRequest
	  );

	  if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
	    config.headers.setContentType('application/x-www-form-urlencoded', false);
	  }

	  const adapter = adapters.getAdapter(config.adapter || defaults$1.adapter);

	  return adapter(config).then(function onAdapterResolution(response) {
	    throwIfCancellationRequested(config);

	    // Transform response data
	    response.data = transformData.call(
	      config,
	      config.transformResponse,
	      response
	    );

	    response.headers = AxiosHeaders$1.from(response.headers);

	    return response;
	  }, function onAdapterRejection(reason) {
	    if (!isCancel(reason)) {
	      throwIfCancellationRequested(config);

	      // Transform response data
	      if (reason && reason.response) {
	        reason.response.data = transformData.call(
	          config,
	          config.transformResponse,
	          reason.response
	        );
	        reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
	      }
	    }

	    return Promise.reject(reason);
	  });
	}

	const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? thing.toJSON() : thing;

	/**
	 * Config-specific merge-function which creates a new config-object
	 * by merging two configuration objects together.
	 *
	 * @param {Object} config1
	 * @param {Object} config2
	 *
	 * @returns {Object} New object resulting from merging config2 to config1
	 */
	function mergeConfig(config1, config2) {
	  // eslint-disable-next-line no-param-reassign
	  config2 = config2 || {};
	  const config = {};

	  function getMergedValue(target, source, caseless) {
	    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
	      return utils.merge.call({caseless}, target, source);
	    } else if (utils.isPlainObject(source)) {
	      return utils.merge({}, source);
	    } else if (utils.isArray(source)) {
	      return source.slice();
	    }
	    return source;
	  }

	  // eslint-disable-next-line consistent-return
	  function mergeDeepProperties(a, b, caseless) {
	    if (!utils.isUndefined(b)) {
	      return getMergedValue(a, b, caseless);
	    } else if (!utils.isUndefined(a)) {
	      return getMergedValue(undefined, a, caseless);
	    }
	  }

	  // eslint-disable-next-line consistent-return
	  function valueFromConfig2(a, b) {
	    if (!utils.isUndefined(b)) {
	      return getMergedValue(undefined, b);
	    }
	  }

	  // eslint-disable-next-line consistent-return
	  function defaultToConfig2(a, b) {
	    if (!utils.isUndefined(b)) {
	      return getMergedValue(undefined, b);
	    } else if (!utils.isUndefined(a)) {
	      return getMergedValue(undefined, a);
	    }
	  }

	  // eslint-disable-next-line consistent-return
	  function mergeDirectKeys(a, b, prop) {
	    if (prop in config2) {
	      return getMergedValue(a, b);
	    } else if (prop in config1) {
	      return getMergedValue(undefined, a);
	    }
	  }

	  const mergeMap = {
	    url: valueFromConfig2,
	    method: valueFromConfig2,
	    data: valueFromConfig2,
	    baseURL: defaultToConfig2,
	    transformRequest: defaultToConfig2,
	    transformResponse: defaultToConfig2,
	    paramsSerializer: defaultToConfig2,
	    timeout: defaultToConfig2,
	    timeoutMessage: defaultToConfig2,
	    withCredentials: defaultToConfig2,
	    adapter: defaultToConfig2,
	    responseType: defaultToConfig2,
	    xsrfCookieName: defaultToConfig2,
	    xsrfHeaderName: defaultToConfig2,
	    onUploadProgress: defaultToConfig2,
	    onDownloadProgress: defaultToConfig2,
	    decompress: defaultToConfig2,
	    maxContentLength: defaultToConfig2,
	    maxBodyLength: defaultToConfig2,
	    beforeRedirect: defaultToConfig2,
	    transport: defaultToConfig2,
	    httpAgent: defaultToConfig2,
	    httpsAgent: defaultToConfig2,
	    cancelToken: defaultToConfig2,
	    socketPath: defaultToConfig2,
	    responseEncoding: defaultToConfig2,
	    validateStatus: mergeDirectKeys,
	    headers: (a, b) => mergeDeepProperties(headersToObject(a), headersToObject(b), true)
	  };

	  utils.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
	    const merge = mergeMap[prop] || mergeDeepProperties;
	    const configValue = merge(config1[prop], config2[prop], prop);
	    (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
	  });

	  return config;
	}

	const VERSION = "1.4.0";

	const validators$1 = {};

	// eslint-disable-next-line func-names
	['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
	  validators$1[type] = function validator(thing) {
	    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
	  };
	});

	const deprecatedWarnings = {};

	/**
	 * Transitional option validator
	 *
	 * @param {function|boolean?} validator - set to false if the transitional option has been removed
	 * @param {string?} version - deprecated version / removed since version
	 * @param {string?} message - some message with additional info
	 *
	 * @returns {function}
	 */
	validators$1.transitional = function transitional(validator, version, message) {
	  function formatMessage(opt, desc) {
	    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
	  }

	  // eslint-disable-next-line func-names
	  return (value, opt, opts) => {
	    if (validator === false) {
	      throw new AxiosError(
	        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
	        AxiosError.ERR_DEPRECATED
	      );
	    }

	    if (version && !deprecatedWarnings[opt]) {
	      deprecatedWarnings[opt] = true;
	      // eslint-disable-next-line no-console
	      console.warn(
	        formatMessage(
	          opt,
	          ' has been deprecated since v' + version + ' and will be removed in the near future'
	        )
	      );
	    }

	    return validator ? validator(value, opt, opts) : true;
	  };
	};

	/**
	 * Assert object's properties type
	 *
	 * @param {object} options
	 * @param {object} schema
	 * @param {boolean?} allowUnknown
	 *
	 * @returns {object}
	 */

	function assertOptions(options, schema, allowUnknown) {
	  if (typeof options !== 'object') {
	    throw new AxiosError('options must be an object', AxiosError.ERR_BAD_OPTION_VALUE);
	  }
	  const keys = Object.keys(options);
	  let i = keys.length;
	  while (i-- > 0) {
	    const opt = keys[i];
	    const validator = schema[opt];
	    if (validator) {
	      const value = options[opt];
	      const result = value === undefined || validator(value, opt, options);
	      if (result !== true) {
	        throw new AxiosError('option ' + opt + ' must be ' + result, AxiosError.ERR_BAD_OPTION_VALUE);
	      }
	      continue;
	    }
	    if (allowUnknown !== true) {
	      throw new AxiosError('Unknown option ' + opt, AxiosError.ERR_BAD_OPTION);
	    }
	  }
	}

	var validator = {
	  assertOptions,
	  validators: validators$1
	};

	const validators = validator.validators;

	/**
	 * Create a new instance of Axios
	 *
	 * @param {Object} instanceConfig The default config for the instance
	 *
	 * @return {Axios} A new instance of Axios
	 */
	class Axios {
	  constructor(instanceConfig) {
	    this.defaults = instanceConfig;
	    this.interceptors = {
	      request: new InterceptorManager$1(),
	      response: new InterceptorManager$1()
	    };
	  }

	  /**
	   * Dispatch a request
	   *
	   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
	   * @param {?Object} config
	   *
	   * @returns {Promise} The Promise to be fulfilled
	   */
	  request(configOrUrl, config) {
	    /*eslint no-param-reassign:0*/
	    // Allow for axios('example/url'[, config]) a la fetch API
	    if (typeof configOrUrl === 'string') {
	      config = config || {};
	      config.url = configOrUrl;
	    } else {
	      config = configOrUrl || {};
	    }

	    config = mergeConfig(this.defaults, config);

	    const {transitional, paramsSerializer, headers} = config;

	    if (transitional !== undefined) {
	      validator.assertOptions(transitional, {
	        silentJSONParsing: validators.transitional(validators.boolean),
	        forcedJSONParsing: validators.transitional(validators.boolean),
	        clarifyTimeoutError: validators.transitional(validators.boolean)
	      }, false);
	    }

	    if (paramsSerializer != null) {
	      if (utils.isFunction(paramsSerializer)) {
	        config.paramsSerializer = {
	          serialize: paramsSerializer
	        };
	      } else {
	        validator.assertOptions(paramsSerializer, {
	          encode: validators.function,
	          serialize: validators.function
	        }, true);
	      }
	    }

	    // Set config.method
	    config.method = (config.method || this.defaults.method || 'get').toLowerCase();

	    let contextHeaders;

	    // Flatten headers
	    contextHeaders = headers && utils.merge(
	      headers.common,
	      headers[config.method]
	    );

	    contextHeaders && utils.forEach(
	      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
	      (method) => {
	        delete headers[method];
	      }
	    );

	    config.headers = AxiosHeaders$1.concat(contextHeaders, headers);

	    // filter out skipped interceptors
	    const requestInterceptorChain = [];
	    let synchronousRequestInterceptors = true;
	    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
	      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
	        return;
	      }

	      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

	      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
	    });

	    const responseInterceptorChain = [];
	    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
	      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
	    });

	    let promise;
	    let i = 0;
	    let len;

	    if (!synchronousRequestInterceptors) {
	      const chain = [dispatchRequest.bind(this), undefined];
	      chain.unshift.apply(chain, requestInterceptorChain);
	      chain.push.apply(chain, responseInterceptorChain);
	      len = chain.length;

	      promise = Promise.resolve(config);

	      while (i < len) {
	        promise = promise.then(chain[i++], chain[i++]);
	      }

	      return promise;
	    }

	    len = requestInterceptorChain.length;

	    let newConfig = config;

	    i = 0;

	    while (i < len) {
	      const onFulfilled = requestInterceptorChain[i++];
	      const onRejected = requestInterceptorChain[i++];
	      try {
	        newConfig = onFulfilled(newConfig);
	      } catch (error) {
	        onRejected.call(this, error);
	        break;
	      }
	    }

	    try {
	      promise = dispatchRequest.call(this, newConfig);
	    } catch (error) {
	      return Promise.reject(error);
	    }

	    i = 0;
	    len = responseInterceptorChain.length;

	    while (i < len) {
	      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
	    }

	    return promise;
	  }

	  getUri(config) {
	    config = mergeConfig(this.defaults, config);
	    const fullPath = buildFullPath(config.baseURL, config.url);
	    return buildURL(fullPath, config.params, config.paramsSerializer);
	  }
	}

	// Provide aliases for supported request methods
	utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
	  /*eslint func-names:0*/
	  Axios.prototype[method] = function(url, config) {
	    return this.request(mergeConfig(config || {}, {
	      method,
	      url,
	      data: (config || {}).data
	    }));
	  };
	});

	utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
	  /*eslint func-names:0*/

	  function generateHTTPMethod(isForm) {
	    return function httpMethod(url, data, config) {
	      return this.request(mergeConfig(config || {}, {
	        method,
	        headers: isForm ? {
	          'Content-Type': 'multipart/form-data'
	        } : {},
	        url,
	        data
	      }));
	    };
	  }

	  Axios.prototype[method] = generateHTTPMethod();

	  Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
	});

	var Axios$1 = Axios;

	/**
	 * A `CancelToken` is an object that can be used to request cancellation of an operation.
	 *
	 * @param {Function} executor The executor function.
	 *
	 * @returns {CancelToken}
	 */
	class CancelToken {
	  constructor(executor) {
	    if (typeof executor !== 'function') {
	      throw new TypeError('executor must be a function.');
	    }

	    let resolvePromise;

	    this.promise = new Promise(function promiseExecutor(resolve) {
	      resolvePromise = resolve;
	    });

	    const token = this;

	    // eslint-disable-next-line func-names
	    this.promise.then(cancel => {
	      if (!token._listeners) return;

	      let i = token._listeners.length;

	      while (i-- > 0) {
	        token._listeners[i](cancel);
	      }
	      token._listeners = null;
	    });

	    // eslint-disable-next-line func-names
	    this.promise.then = onfulfilled => {
	      let _resolve;
	      // eslint-disable-next-line func-names
	      const promise = new Promise(resolve => {
	        token.subscribe(resolve);
	        _resolve = resolve;
	      }).then(onfulfilled);

	      promise.cancel = function reject() {
	        token.unsubscribe(_resolve);
	      };

	      return promise;
	    };

	    executor(function cancel(message, config, request) {
	      if (token.reason) {
	        // Cancellation has already been requested
	        return;
	      }

	      token.reason = new CanceledError(message, config, request);
	      resolvePromise(token.reason);
	    });
	  }

	  /**
	   * Throws a `CanceledError` if cancellation has been requested.
	   */
	  throwIfRequested() {
	    if (this.reason) {
	      throw this.reason;
	    }
	  }

	  /**
	   * Subscribe to the cancel signal
	   */

	  subscribe(listener) {
	    if (this.reason) {
	      listener(this.reason);
	      return;
	    }

	    if (this._listeners) {
	      this._listeners.push(listener);
	    } else {
	      this._listeners = [listener];
	    }
	  }

	  /**
	   * Unsubscribe from the cancel signal
	   */

	  unsubscribe(listener) {
	    if (!this._listeners) {
	      return;
	    }
	    const index = this._listeners.indexOf(listener);
	    if (index !== -1) {
	      this._listeners.splice(index, 1);
	    }
	  }

	  /**
	   * Returns an object that contains a new `CancelToken` and a function that, when called,
	   * cancels the `CancelToken`.
	   */
	  static source() {
	    let cancel;
	    const token = new CancelToken(function executor(c) {
	      cancel = c;
	    });
	    return {
	      token,
	      cancel
	    };
	  }
	}

	var CancelToken$1 = CancelToken;

	/**
	 * Syntactic sugar for invoking a function and expanding an array for arguments.
	 *
	 * Common use case would be to use `Function.prototype.apply`.
	 *
	 *  ```js
	 *  function f(x, y, z) {}
	 *  var args = [1, 2, 3];
	 *  f.apply(null, args);
	 *  ```
	 *
	 * With `spread` this example can be re-written.
	 *
	 *  ```js
	 *  spread(function(x, y, z) {})([1, 2, 3]);
	 *  ```
	 *
	 * @param {Function} callback
	 *
	 * @returns {Function}
	 */
	function spread(callback) {
	  return function wrap(arr) {
	    return callback.apply(null, arr);
	  };
	}

	/**
	 * Determines whether the payload is an error thrown by Axios
	 *
	 * @param {*} payload The value to test
	 *
	 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
	 */
	function isAxiosError(payload) {
	  return utils.isObject(payload) && (payload.isAxiosError === true);
	}

	const HttpStatusCode = {
	  Continue: 100,
	  SwitchingProtocols: 101,
	  Processing: 102,
	  EarlyHints: 103,
	  Ok: 200,
	  Created: 201,
	  Accepted: 202,
	  NonAuthoritativeInformation: 203,
	  NoContent: 204,
	  ResetContent: 205,
	  PartialContent: 206,
	  MultiStatus: 207,
	  AlreadyReported: 208,
	  ImUsed: 226,
	  MultipleChoices: 300,
	  MovedPermanently: 301,
	  Found: 302,
	  SeeOther: 303,
	  NotModified: 304,
	  UseProxy: 305,
	  Unused: 306,
	  TemporaryRedirect: 307,
	  PermanentRedirect: 308,
	  BadRequest: 400,
	  Unauthorized: 401,
	  PaymentRequired: 402,
	  Forbidden: 403,
	  NotFound: 404,
	  MethodNotAllowed: 405,
	  NotAcceptable: 406,
	  ProxyAuthenticationRequired: 407,
	  RequestTimeout: 408,
	  Conflict: 409,
	  Gone: 410,
	  LengthRequired: 411,
	  PreconditionFailed: 412,
	  PayloadTooLarge: 413,
	  UriTooLong: 414,
	  UnsupportedMediaType: 415,
	  RangeNotSatisfiable: 416,
	  ExpectationFailed: 417,
	  ImATeapot: 418,
	  MisdirectedRequest: 421,
	  UnprocessableEntity: 422,
	  Locked: 423,
	  FailedDependency: 424,
	  TooEarly: 425,
	  UpgradeRequired: 426,
	  PreconditionRequired: 428,
	  TooManyRequests: 429,
	  RequestHeaderFieldsTooLarge: 431,
	  UnavailableForLegalReasons: 451,
	  InternalServerError: 500,
	  NotImplemented: 501,
	  BadGateway: 502,
	  ServiceUnavailable: 503,
	  GatewayTimeout: 504,
	  HttpVersionNotSupported: 505,
	  VariantAlsoNegotiates: 506,
	  InsufficientStorage: 507,
	  LoopDetected: 508,
	  NotExtended: 510,
	  NetworkAuthenticationRequired: 511,
	};

	Object.entries(HttpStatusCode).forEach(([key, value]) => {
	  HttpStatusCode[value] = key;
	});

	var HttpStatusCode$1 = HttpStatusCode;

	/**
	 * Create an instance of Axios
	 *
	 * @param {Object} defaultConfig The default config for the instance
	 *
	 * @returns {Axios} A new instance of Axios
	 */
	function createInstance(defaultConfig) {
	  const context = new Axios$1(defaultConfig);
	  const instance = bind(Axios$1.prototype.request, context);

	  // Copy axios.prototype to instance
	  utils.extend(instance, Axios$1.prototype, context, {allOwnKeys: true});

	  // Copy context to instance
	  utils.extend(instance, context, null, {allOwnKeys: true});

	  // Factory for creating new instances
	  instance.create = function create(instanceConfig) {
	    return createInstance(mergeConfig(defaultConfig, instanceConfig));
	  };

	  return instance;
	}

	// Create the default instance to be exported
	const axios$1 = createInstance(defaults$1);

	// Expose Axios class to allow class inheritance
	axios$1.Axios = Axios$1;

	// Expose Cancel & CancelToken
	axios$1.CanceledError = CanceledError;
	axios$1.CancelToken = CancelToken$1;
	axios$1.isCancel = isCancel;
	axios$1.VERSION = VERSION;
	axios$1.toFormData = toFormData;

	// Expose AxiosError class
	axios$1.AxiosError = AxiosError;

	// alias for CanceledError for backward compatibility
	axios$1.Cancel = axios$1.CanceledError;

	// Expose all/spread
	axios$1.all = function all(promises) {
	  return Promise.all(promises);
	};

	axios$1.spread = spread;

	// Expose isAxiosError
	axios$1.isAxiosError = isAxiosError;

	// Expose mergeConfig
	axios$1.mergeConfig = mergeConfig;

	axios$1.AxiosHeaders = AxiosHeaders$1;

	axios$1.formToJSON = thing => formDataToJSON(utils.isHTMLForm(thing) ? new FormData(thing) : thing);

	axios$1.HttpStatusCode = HttpStatusCode$1;

	axios$1.default = axios$1;

	// this module should only have a default export
	var axios$2 = axios$1;

	const processQueue = (error) => {
	    failedQueue.forEach((prom) => {
	        if (error) {
	            prom.reject(error);
	        } else {
	            prom.resolve();
	        }
	    });

	    failedQueue = [];
	};

	function createAxiosClient({
	    options,
	    getCurrentAccessToken,
	    getCurrentRefreshToken,
	    refreshTokenUrl = null,
	    logout,
	    setRefreshedTokens,
	}) {
	    const client = axios$2.create(options);

	    client.interceptors.request.use(
	        (config) => {
	            if (config.authorization !== false) {
	                const token = getCurrentAccessToken();
	                if (token) {
	                    config.headers.Authorization = "Bearer " + token;
	                }
	            }
	            return config;
	        },
	        (error) => {
	            return Promise.reject(error);
	        }
	    );

	    client.interceptors.response.use(
	        (response) => {
	            // Any status code that lie within the range of 2xx cause this function to trigger
	            // Do something with response data
	            return response.data;
	        },
	        (error) => {
	            const originalRequest = error.config;
	            // In "axios": "^1.1.3" there is an issue with headers, and this is the workaround.
	            originalRequest.headers = JSON.parse(
	                JSON.stringify(originalRequest.headers || {})
	            );
	            const refreshToken = getCurrentRefreshToken();

	            // If error, process all the requests in the queue and logout the user.
	            const handleError = (error) => {
	                processQueue(error);
	                logout();
	                return Promise.reject(error);
	            };

	            // Refresh token conditions
	            if (
	                refreshToken &&
	                error.response?.status === 401 &&
	                error.response.data.message === "TokenExpiredError" &&
	                originalRequest?.url !== refreshTokenUrl &&
	                originalRequest?._retry !== true
	            ) {

	                if (isRefreshing) {
	                    return new Promise(function (resolve, reject) {
	                        failedQueue.push({ resolve, reject });
	                    })
	                        .then(() => {
	                            return client(originalRequest);
	                        })
	                        .catch((err) => {
	                            return Promise.reject(err);
	                        });
	                }
	                isRefreshing = true;
	                originalRequest._retry = true;
	                return client
	                    .post(refreshTokenUrl, {
	                        refreshToken: refreshToken,
	                    })
	                    .then((res) => {
	                        const tokens = {
	                            accessToken: res.data?.accessToken,
	                            refreshToken: res.data?.refreshToken,
	                        };
	                        setRefreshedTokens(tokens);
	                        processQueue(null);

	                        return client(originalRequest);
	                    }, handleError)
	                    .finally(() => {
	                        isRefreshing = false;
	                    });
	            }

	            // Refresh token missing or expired => logout user...
	            if (
	                error.response?.status === 401 &&
	                error.response?.data?.message === "TokenExpiredError"
	            ) {
	                return handleError(error);
	            }

	            // Any status codes that falls outside the range of 2xx cause this function to trigger
	            // Do something with response error
	            return Promise.reject(error);
	        }
	    );
	    return client;
	}

	function e(e){this.message=e;}e.prototype=new Error,e.prototype.name="InvalidCharacterError";var r="undefined"!=typeof window&&window.atob&&window.atob.bind(window)||function(r){var t=String(r).replace(/=+$/,"");if(t.length%4==1)throw new e("'atob' failed: The string to be decoded is not correctly encoded.");for(var n,o,a=0,i=0,c="";o=t.charAt(i++);~o&&(n=a%4?64*n+o:o,a++%4)?c+=String.fromCharCode(255&n>>(-2*a&6)):0)o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(o);return c};function t(e){var t=e.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw "Illegal base64url string!"}try{return function(e){return decodeURIComponent(r(e).replace(/(.)/g,(function(e,r){var t=r.charCodeAt(0).toString(16).toUpperCase();return t.length<2&&(t="0"+t),"%"+t})))}(t)}catch(e){return r(t)}}function n(e){this.message=e;}function o(e,r){if("string"!=typeof e)throw new n("Invalid token specified");var o=!0===(r=r||{}).header?0:1;try{return JSON.parse(t(e.split(".")[o]))}catch(e){throw new n("Invalid token specified: "+e.message)}}n.prototype=new Error,n.prototype.name="InvalidTokenError";

	function getCurrentAccessToken() {
	    const cat = localStorage.getItem("ngStorage-currentUser");
	    const objToken = JSON.parse(cat);
	    return objToken.token;
	    // this is how you access the zustand store outside of React.
	    //return useAuthStore.getState().accessToken;
	}

	function getCurrentRefreshToken() {
	    // this is how you access the zustand store outside of React.
	    //return useAuthStore.getState().refreshToken;
	}

	function setRefreshedTokens(tokens) {
	    console.log("set tokens...");
	}

	async function logout() {
	    console.log("logout...");
	}
	//console.log(getCurrentAccessToken());
	var decodedJwt = o(getCurrentAccessToken());
	//console.log(decodedJwt);

	const client = createAxiosClient({
	    options: {
	        baseURL: `${decodedJwt.urlGateway}`,
	        timeout: 300000,
	        headers: {
	            "Content-Type": "application/json",
	        },
	    },
	    getCurrentAccessToken,
	    getCurrentRefreshToken,
	    refreshTokenUrl: null,//refreshTokenUrl: REFRESH_TOKEN_URL,
	    logout,
	    setRefreshedTokens,
	});

	const clientFile = (url) => {
	   return axios({
	        url: `${decodedJwt.urlGateway}` + url,
	        method: 'POST',
	        responseType: 'blob',
	        headers: { 'Authorization': 'Bearer ' + getCurrentAccessToken() }
	    })
	};

	function toast({
	    type,
	    message,
	    title = null,
	    positionClass = null,
	    timeOut = null,
	    extendedTimeOut = null
	}) {
	    return toastr[type](message, title, {
	        closeButton: true,
	        debug: false,
	        newestOnTop: true,
	        progressBar: true,
	        positionClass: positionClass || 'toast-bottom-center',
	        preventDuplicates: true,
	        timeOut: timeOut || 5000,
	        extendedTimeOut: extendedTimeOut || 1000
	    })
	}

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	var sweetalert2_all = {exports: {}};

	/*!
	* sweetalert2 v11.7.18
	* Released under the MIT License.
	*/
	sweetalert2_all.exports;

	(function (module, exports) {
		(function (global, factory) {
		  module.exports = factory() ;
		})(commonjsGlobal, (function () {
		  const RESTORE_FOCUS_TIMEOUT = 100;

		  /** @type {GlobalState} */
		  const globalState = {};
		  const focusPreviousActiveElement = () => {
		    if (globalState.previousActiveElement instanceof HTMLElement) {
		      globalState.previousActiveElement.focus();
		      globalState.previousActiveElement = null;
		    } else if (document.body) {
		      document.body.focus();
		    }
		  };

		  /**
		   * Restore previous active (focused) element
		   *
		   * @param {boolean} returnFocus
		   * @returns {Promise<void>}
		   */
		  const restoreActiveElement = returnFocus => {
		    return new Promise(resolve => {
		      if (!returnFocus) {
		        return resolve();
		      }
		      const x = window.scrollX;
		      const y = window.scrollY;
		      globalState.restoreFocusTimeout = setTimeout(() => {
		        focusPreviousActiveElement();
		        resolve();
		      }, RESTORE_FOCUS_TIMEOUT); // issues/900

		      window.scrollTo(x, y);
		    });
		  };

		  /**
		   * This module contains `WeakMap`s for each effectively-"private  property" that a `Swal` has.
		   * For example, to set the private property "foo" of `this` to "bar", you can `privateProps.foo.set(this, 'bar')`
		   * This is the approach that Babel will probably take to implement private methods/fields
		   *   https://github.com/tc39/proposal-private-methods
		   *   https://github.com/babel/babel/pull/7555
		   * Once we have the changes from that PR in Babel, and our core class fits reasonable in *one module*
		   *   then we can use that language feature.
		   */

		  var privateProps = {
		    promise: new WeakMap(),
		    innerParams: new WeakMap(),
		    domCache: new WeakMap()
		  };

		  const swalPrefix = 'swal2-';

		  /**
		   * @typedef
		   * { | 'container'
		   *   | 'shown'
		   *   | 'height-auto'
		   *   | 'iosfix'
		   *   | 'popup'
		   *   | 'modal'
		   *   | 'no-backdrop'
		   *   | 'no-transition'
		   *   | 'toast'
		   *   | 'toast-shown'
		   *   | 'show'
		   *   | 'hide'
		   *   | 'close'
		   *   | 'title'
		   *   | 'html-container'
		   *   | 'actions'
		   *   | 'confirm'
		   *   | 'deny'
		   *   | 'cancel'
		   *   | 'default-outline'
		   *   | 'footer'
		   *   | 'icon'
		   *   | 'icon-content'
		   *   | 'image'
		   *   | 'input'
		   *   | 'file'
		   *   | 'range'
		   *   | 'select'
		   *   | 'radio'
		   *   | 'checkbox'
		   *   | 'label'
		   *   | 'textarea'
		   *   | 'inputerror'
		   *   | 'input-label'
		   *   | 'validation-message'
		   *   | 'progress-steps'
		   *   | 'active-progress-step'
		   *   | 'progress-step'
		   *   | 'progress-step-line'
		   *   | 'loader'
		   *   | 'loading'
		   *   | 'styled'
		   *   | 'top'
		   *   | 'top-start'
		   *   | 'top-end'
		   *   | 'top-left'
		   *   | 'top-right'
		   *   | 'center'
		   *   | 'center-start'
		   *   | 'center-end'
		   *   | 'center-left'
		   *   | 'center-right'
		   *   | 'bottom'
		   *   | 'bottom-start'
		   *   | 'bottom-end'
		   *   | 'bottom-left'
		   *   | 'bottom-right'
		   *   | 'grow-row'
		   *   | 'grow-column'
		   *   | 'grow-fullscreen'
		   *   | 'rtl'
		   *   | 'timer-progress-bar'
		   *   | 'timer-progress-bar-container'
		   *   | 'scrollbar-measure'
		   *   | 'icon-success'
		   *   | 'icon-warning'
		   *   | 'icon-info'
		   *   | 'icon-question'
		   *   | 'icon-error'
		   * } SwalClass
		   * @typedef {Record<SwalClass, string>} SwalClasses
		   */

		  /**
		   * @typedef {'success' | 'warning' | 'info' | 'question' | 'error'} SwalIcon
		   * @typedef {Record<SwalIcon, string>} SwalIcons
		   */

		  /** @type {SwalClass[]} */
		  const classNames = ['container', 'shown', 'height-auto', 'iosfix', 'popup', 'modal', 'no-backdrop', 'no-transition', 'toast', 'toast-shown', 'show', 'hide', 'close', 'title', 'html-container', 'actions', 'confirm', 'deny', 'cancel', 'default-outline', 'footer', 'icon', 'icon-content', 'image', 'input', 'file', 'range', 'select', 'radio', 'checkbox', 'label', 'textarea', 'inputerror', 'input-label', 'validation-message', 'progress-steps', 'active-progress-step', 'progress-step', 'progress-step-line', 'loader', 'loading', 'styled', 'top', 'top-start', 'top-end', 'top-left', 'top-right', 'center', 'center-start', 'center-end', 'center-left', 'center-right', 'bottom', 'bottom-start', 'bottom-end', 'bottom-left', 'bottom-right', 'grow-row', 'grow-column', 'grow-fullscreen', 'rtl', 'timer-progress-bar', 'timer-progress-bar-container', 'scrollbar-measure', 'icon-success', 'icon-warning', 'icon-info', 'icon-question', 'icon-error'];
		  const swalClasses = classNames.reduce((acc, className) => {
		    acc[className] = swalPrefix + className;
		    return acc;
		  }, /** @type {SwalClasses} */{});

		  /** @type {SwalIcon[]} */
		  const icons = ['success', 'warning', 'info', 'question', 'error'];
		  const iconTypes = icons.reduce((acc, icon) => {
		    acc[icon] = swalPrefix + icon;
		    return acc;
		  }, /** @type {SwalIcons} */{});

		  const consolePrefix = 'SweetAlert2:';

		  /**
		   * Capitalize the first letter of a string
		   *
		   * @param {string} str
		   * @returns {string}
		   */
		  const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1);

		  /**
		   * Standardize console warnings
		   *
		   * @param {string | string[]} message
		   */
		  const warn = message => {
		    console.warn(`${consolePrefix} ${typeof message === 'object' ? message.join(' ') : message}`);
		  };

		  /**
		   * Standardize console errors
		   *
		   * @param {string} message
		   */
		  const error = message => {
		    console.error(`${consolePrefix} ${message}`);
		  };

		  /**
		   * Private global state for `warnOnce`
		   *
		   * @type {string[]}
		   * @private
		   */
		  const previousWarnOnceMessages = [];

		  /**
		   * Show a console warning, but only if it hasn't already been shown
		   *
		   * @param {string} message
		   */
		  const warnOnce = message => {
		    if (!previousWarnOnceMessages.includes(message)) {
		      previousWarnOnceMessages.push(message);
		      warn(message);
		    }
		  };

		  /**
		   * Show a one-time console warning about deprecated params/methods
		   *
		   * @param {string} deprecatedParam
		   * @param {string} useInstead
		   */
		  const warnAboutDeprecation = (deprecatedParam, useInstead) => {
		    warnOnce(`"${deprecatedParam}" is deprecated and will be removed in the next major release. Please use "${useInstead}" instead.`);
		  };

		  /**
		   * If `arg` is a function, call it (with no arguments or context) and return the result.
		   * Otherwise, just pass the value through
		   *
		   * @param {Function | any} arg
		   * @returns {any}
		   */
		  const callIfFunction = arg => typeof arg === 'function' ? arg() : arg;

		  /**
		   * @param {any} arg
		   * @returns {boolean}
		   */
		  const hasToPromiseFn = arg => arg && typeof arg.toPromise === 'function';

		  /**
		   * @param {any} arg
		   * @returns {Promise<any>}
		   */
		  const asPromise = arg => hasToPromiseFn(arg) ? arg.toPromise() : Promise.resolve(arg);

		  /**
		   * @param {any} arg
		   * @returns {boolean}
		   */
		  const isPromise = arg => arg && Promise.resolve(arg) === arg;

		  /**
		   * Gets the popup container which contains the backdrop and the popup itself.
		   *
		   * @returns {HTMLElement | null}
		   */
		  const getContainer = () => document.body.querySelector(`.${swalClasses.container}`);

		  /**
		   * @param {string} selectorString
		   * @returns {HTMLElement | null}
		   */
		  const elementBySelector = selectorString => {
		    const container = getContainer();
		    return container ? container.querySelector(selectorString) : null;
		  };

		  /**
		   * @param {string} className
		   * @returns {HTMLElement | null}
		   */
		  const elementByClass = className => {
		    return elementBySelector(`.${className}`);
		  };

		  /**
		   * @returns {HTMLElement | null}
		   */
		  const getPopup = () => elementByClass(swalClasses.popup);

		  /**
		   * @returns {HTMLElement | null}
		   */
		  const getIcon = () => elementByClass(swalClasses.icon);

		  /**
		   * @returns {HTMLElement | null}
		   */
		  const getIconContent = () => elementByClass(swalClasses['icon-content']);

		  /**
		   * @returns {HTMLElement | null}
		   */
		  const getTitle = () => elementByClass(swalClasses.title);

		  /**
		   * @returns {HTMLElement | null}
		   */
		  const getHtmlContainer = () => elementByClass(swalClasses['html-container']);

		  /**
		   * @returns {HTMLElement | null}
		   */
		  const getImage = () => elementByClass(swalClasses.image);

		  /**
		   * @returns {HTMLElement | null}
		   */
		  const getProgressSteps = () => elementByClass(swalClasses['progress-steps']);

		  /**
		   * @returns {HTMLElement | null}
		   */
		  const getValidationMessage = () => elementByClass(swalClasses['validation-message']);

		  /**
		   * @returns {HTMLButtonElement | null}
		   */
		  const getConfirmButton = () => /** @type {HTMLButtonElement} */elementBySelector(`.${swalClasses.actions} .${swalClasses.confirm}`);

		  /**
		   * @returns {HTMLButtonElement | null}
		   */
		  const getCancelButton = () => /** @type {HTMLButtonElement} */elementBySelector(`.${swalClasses.actions} .${swalClasses.cancel}`);

		  /**
		   * @returns {HTMLButtonElement | null}
		   */
		  const getDenyButton = () => /** @type {HTMLButtonElement} */elementBySelector(`.${swalClasses.actions} .${swalClasses.deny}`);

		  /**
		   * @returns {HTMLElement | null}
		   */
		  const getInputLabel = () => elementByClass(swalClasses['input-label']);

		  /**
		   * @returns {HTMLElement | null}
		   */
		  const getLoader = () => elementBySelector(`.${swalClasses.loader}`);

		  /**
		   * @returns {HTMLElement | null}
		   */
		  const getActions = () => elementByClass(swalClasses.actions);

		  /**
		   * @returns {HTMLElement | null}
		   */
		  const getFooter = () => elementByClass(swalClasses.footer);

		  /**
		   * @returns {HTMLElement | null}
		   */
		  const getTimerProgressBar = () => elementByClass(swalClasses['timer-progress-bar']);

		  /**
		   * @returns {HTMLElement | null}
		   */
		  const getCloseButton = () => elementByClass(swalClasses.close);

		  // https://github.com/jkup/focusable/blob/master/index.js
		  const focusable = `
  a[href],
  area[href],
  input:not([disabled]),
  select:not([disabled]),
  textarea:not([disabled]),
  button:not([disabled]),
  iframe,
  object,
  embed,
  [tabindex="0"],
  [contenteditable],
  audio[controls],
  video[controls],
  summary
`;
		  /**
		   * @returns {HTMLElement[]}
		   */
		  const getFocusableElements = () => {
		    const popup = getPopup();
		    if (!popup) {
		      return [];
		    }
		    /** @type {NodeListOf<HTMLElement>} */
		    const focusableElementsWithTabindex = popup.querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])');
		    const focusableElementsWithTabindexSorted = Array.from(focusableElementsWithTabindex)
		    // sort according to tabindex
		    .sort((a, b) => {
		      const tabindexA = parseInt(a.getAttribute('tabindex') || '0');
		      const tabindexB = parseInt(b.getAttribute('tabindex') || '0');
		      if (tabindexA > tabindexB) {
		        return 1;
		      } else if (tabindexA < tabindexB) {
		        return -1;
		      }
		      return 0;
		    });

		    /** @type {NodeListOf<HTMLElement>} */
		    const otherFocusableElements = popup.querySelectorAll(focusable);
		    const otherFocusableElementsFiltered = Array.from(otherFocusableElements).filter(el => el.getAttribute('tabindex') !== '-1');
		    return [...new Set(focusableElementsWithTabindexSorted.concat(otherFocusableElementsFiltered))].filter(el => isVisible$1(el));
		  };

		  /**
		   * @returns {boolean}
		   */
		  const isModal = () => {
		    return hasClass(document.body, swalClasses.shown) && !hasClass(document.body, swalClasses['toast-shown']) && !hasClass(document.body, swalClasses['no-backdrop']);
		  };

		  /**
		   * @returns {boolean}
		   */
		  const isToast = () => {
		    const popup = getPopup();
		    if (!popup) {
		      return false;
		    }
		    return hasClass(popup, swalClasses.toast);
		  };

		  /**
		   * @returns {boolean}
		   */
		  const isLoading = () => {
		    const popup = getPopup();
		    if (!popup) {
		      return false;
		    }
		    return popup.hasAttribute('data-loading');
		  };

		  /**
		   * Securely set innerHTML of an element
		   * https://github.com/sweetalert2/sweetalert2/issues/1926
		   *
		   * @param {HTMLElement} elem
		   * @param {string} html
		   */
		  const setInnerHtml = (elem, html) => {
		    elem.textContent = '';
		    if (html) {
		      const parser = new DOMParser();
		      const parsed = parser.parseFromString(html, `text/html`);
		      Array.from(parsed.querySelector('head').childNodes).forEach(child => {
		        elem.appendChild(child);
		      });
		      Array.from(parsed.querySelector('body').childNodes).forEach(child => {
		        if (child instanceof HTMLVideoElement || child instanceof HTMLAudioElement) {
		          elem.appendChild(child.cloneNode(true)); // https://github.com/sweetalert2/sweetalert2/issues/2507
		        } else {
		          elem.appendChild(child);
		        }
		      });
		    }
		  };

		  /**
		   * @param {HTMLElement} elem
		   * @param {string} className
		   * @returns {boolean}
		   */
		  const hasClass = (elem, className) => {
		    if (!className) {
		      return false;
		    }
		    const classList = className.split(/\s+/);
		    for (let i = 0; i < classList.length; i++) {
		      if (!elem.classList.contains(classList[i])) {
		        return false;
		      }
		    }
		    return true;
		  };

		  /**
		   * @param {HTMLElement} elem
		   * @param {SweetAlertOptions} params
		   */
		  const removeCustomClasses = (elem, params) => {
		    Array.from(elem.classList).forEach(className => {
		      if (!Object.values(swalClasses).includes(className) && !Object.values(iconTypes).includes(className) && !Object.values(params.showClass).includes(className)) {
		        elem.classList.remove(className);
		      }
		    });
		  };

		  /**
		   * @param {HTMLElement} elem
		   * @param {SweetAlertOptions} params
		   * @param {string} className
		   */
		  const applyCustomClass = (elem, params, className) => {
		    removeCustomClasses(elem, params);
		    if (params.customClass && params.customClass[className]) {
		      if (typeof params.customClass[className] !== 'string' && !params.customClass[className].forEach) {
		        warn(`Invalid type of customClass.${className}! Expected string or iterable object, got "${typeof params.customClass[className]}"`);
		        return;
		      }
		      addClass(elem, params.customClass[className]);
		    }
		  };

		  /**
		   * @param {HTMLElement} popup
		   * @param {import('./renderers/renderInput').InputClass} inputClass
		   * @returns {HTMLInputElement | null}
		   */
		  const getInput$1 = (popup, inputClass) => {
		    if (!inputClass) {
		      return null;
		    }
		    switch (inputClass) {
		      case 'select':
		      case 'textarea':
		      case 'file':
		        return popup.querySelector(`.${swalClasses.popup} > .${swalClasses[inputClass]}`);
		      case 'checkbox':
		        return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.checkbox} input`);
		      case 'radio':
		        return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.radio} input:checked`) || popup.querySelector(`.${swalClasses.popup} > .${swalClasses.radio} input:first-child`);
		      case 'range':
		        return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.range} input`);
		      default:
		        return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.input}`);
		    }
		  };

		  /**
		   * @param {HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement} input
		   */
		  const focusInput = input => {
		    input.focus();

		    // place cursor at end of text in text input
		    if (input.type !== 'file') {
		      // http://stackoverflow.com/a/2345915
		      const val = input.value;
		      input.value = '';
		      input.value = val;
		    }
		  };

		  /**
		   * @param {HTMLElement | HTMLElement[] | null} target
		   * @param {string | string[] | readonly string[] | undefined} classList
		   * @param {boolean} condition
		   */
		  const toggleClass = (target, classList, condition) => {
		    if (!target || !classList) {
		      return;
		    }
		    if (typeof classList === 'string') {
		      classList = classList.split(/\s+/).filter(Boolean);
		    }
		    classList.forEach(className => {
		      if (Array.isArray(target)) {
		        target.forEach(elem => {
		          condition ? elem.classList.add(className) : elem.classList.remove(className);
		        });
		      } else {
		        condition ? target.classList.add(className) : target.classList.remove(className);
		      }
		    });
		  };

		  /**
		   * @param {HTMLElement | HTMLElement[] | null} target
		   * @param {string | string[] | readonly string[] | undefined} classList
		   */
		  const addClass = (target, classList) => {
		    toggleClass(target, classList, true);
		  };

		  /**
		   * @param {HTMLElement | HTMLElement[] | null} target
		   * @param {string | string[] | readonly string[] | undefined} classList
		   */
		  const removeClass = (target, classList) => {
		    toggleClass(target, classList, false);
		  };

		  /**
		   * Get direct child of an element by class name
		   *
		   * @param {HTMLElement} elem
		   * @param {string} className
		   * @returns {HTMLElement | undefined}
		   */
		  const getDirectChildByClass = (elem, className) => {
		    const children = Array.from(elem.children);
		    for (let i = 0; i < children.length; i++) {
		      const child = children[i];
		      if (child instanceof HTMLElement && hasClass(child, className)) {
		        return child;
		      }
		    }
		  };

		  /**
		   * @param {HTMLElement} elem
		   * @param {string} property
		   * @param {*} value
		   */
		  const applyNumericalStyle = (elem, property, value) => {
		    if (value === `${parseInt(value)}`) {
		      value = parseInt(value);
		    }
		    if (value || parseInt(value) === 0) {
		      elem.style[property] = typeof value === 'number' ? `${value}px` : value;
		    } else {
		      elem.style.removeProperty(property);
		    }
		  };

		  /**
		   * @param {HTMLElement | null} elem
		   * @param {string} display
		   */
		  const show = function (elem) {
		    let display = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'flex';
		    elem && (elem.style.display = display);
		  };

		  /**
		   * @param {HTMLElement | null} elem
		   */
		  const hide = elem => {
		    elem && (elem.style.display = 'none');
		  };

		  /**
		   * @param {HTMLElement} parent
		   * @param {string} selector
		   * @param {string} property
		   * @param {string} value
		   */
		  const setStyle = (parent, selector, property, value) => {
		    /** @type {HTMLElement} */
		    const el = parent.querySelector(selector);
		    if (el) {
		      el.style[property] = value;
		    }
		  };

		  /**
		   * @param {HTMLElement} elem
		   * @param {any} condition
		   * @param {string} display
		   */
		  const toggle = function (elem, condition) {
		    let display = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'flex';
		    condition ? show(elem, display) : hide(elem);
		  };

		  /**
		   * borrowed from jquery $(elem).is(':visible') implementation
		   *
		   * @param {HTMLElement} elem
		   * @returns {boolean}
		   */
		  const isVisible$1 = elem => !!(elem && (elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length));

		  /**
		   * @returns {boolean}
		   */
		  const allButtonsAreHidden = () => !isVisible$1(getConfirmButton()) && !isVisible$1(getDenyButton()) && !isVisible$1(getCancelButton());

		  /**
		   * @param {HTMLElement} elem
		   * @returns {boolean}
		   */
		  const isScrollable = elem => !!(elem.scrollHeight > elem.clientHeight);

		  /**
		   * borrowed from https://stackoverflow.com/a/46352119
		   *
		   * @param {HTMLElement} elem
		   * @returns {boolean}
		   */
		  const hasCssAnimation = elem => {
		    const style = window.getComputedStyle(elem);
		    const animDuration = parseFloat(style.getPropertyValue('animation-duration') || '0');
		    const transDuration = parseFloat(style.getPropertyValue('transition-duration') || '0');
		    return animDuration > 0 || transDuration > 0;
		  };

		  /**
		   * @param {number} timer
		   * @param {boolean} reset
		   */
		  const animateTimerProgressBar = function (timer) {
		    let reset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		    const timerProgressBar = getTimerProgressBar();
		    if (isVisible$1(timerProgressBar)) {
		      if (reset) {
		        timerProgressBar.style.transition = 'none';
		        timerProgressBar.style.width = '100%';
		      }
		      setTimeout(() => {
		        timerProgressBar.style.transition = `width ${timer / 1000}s linear`;
		        timerProgressBar.style.width = '0%';
		      }, 10);
		    }
		  };
		  const stopTimerProgressBar = () => {
		    const timerProgressBar = getTimerProgressBar();
		    const timerProgressBarWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
		    timerProgressBar.style.removeProperty('transition');
		    timerProgressBar.style.width = '100%';
		    const timerProgressBarFullWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
		    const timerProgressBarPercent = timerProgressBarWidth / timerProgressBarFullWidth * 100;
		    timerProgressBar.style.width = `${timerProgressBarPercent}%`;
		  };

		  /**
		   * Detect Node env
		   *
		   * @returns {boolean}
		   */
		  const isNodeEnv = () => typeof window === 'undefined' || typeof document === 'undefined';

		  const sweetHTML = `
 <div aria-labelledby="${swalClasses.title}" aria-describedby="${swalClasses['html-container']}" class="${swalClasses.popup}" tabindex="-1">
   <button type="button" class="${swalClasses.close}"></button>
   <ul class="${swalClasses['progress-steps']}"></ul>
   <div class="${swalClasses.icon}"></div>
   <img class="${swalClasses.image}" />
   <h2 class="${swalClasses.title}" id="${swalClasses.title}"></h2>
   <div class="${swalClasses['html-container']}" id="${swalClasses['html-container']}"></div>
   <input class="${swalClasses.input}" id="${swalClasses.input}" />
   <input type="file" class="${swalClasses.file}" />
   <div class="${swalClasses.range}">
     <input type="range" />
     <output></output>
   </div>
   <select class="${swalClasses.select}" id="${swalClasses.select}"></select>
   <div class="${swalClasses.radio}"></div>
   <label class="${swalClasses.checkbox}">
     <input type="checkbox" id="${swalClasses.checkbox}" />
     <span class="${swalClasses.label}"></span>
   </label>
   <textarea class="${swalClasses.textarea}" id="${swalClasses.textarea}"></textarea>
   <div class="${swalClasses['validation-message']}" id="${swalClasses['validation-message']}"></div>
   <div class="${swalClasses.actions}">
     <div class="${swalClasses.loader}"></div>
     <button type="button" class="${swalClasses.confirm}"></button>
     <button type="button" class="${swalClasses.deny}"></button>
     <button type="button" class="${swalClasses.cancel}"></button>
   </div>
   <div class="${swalClasses.footer}"></div>
   <div class="${swalClasses['timer-progress-bar-container']}">
     <div class="${swalClasses['timer-progress-bar']}"></div>
   </div>
 </div>
`.replace(/(^|\n)\s*/g, '');

		  /**
		   * @returns {boolean}
		   */
		  const resetOldContainer = () => {
		    const oldContainer = getContainer();
		    if (!oldContainer) {
		      return false;
		    }
		    oldContainer.remove();
		    removeClass([document.documentElement, document.body], [swalClasses['no-backdrop'], swalClasses['toast-shown'], swalClasses['has-column']]);
		    return true;
		  };
		  const resetValidationMessage$1 = () => {
		    globalState.currentInstance.resetValidationMessage();
		  };
		  const addInputChangeListeners = () => {
		    const popup = getPopup();
		    const input = getDirectChildByClass(popup, swalClasses.input);
		    const file = getDirectChildByClass(popup, swalClasses.file);
		    /** @type {HTMLInputElement} */
		    const range = popup.querySelector(`.${swalClasses.range} input`);
		    /** @type {HTMLOutputElement} */
		    const rangeOutput = popup.querySelector(`.${swalClasses.range} output`);
		    const select = getDirectChildByClass(popup, swalClasses.select);
		    /** @type {HTMLInputElement} */
		    const checkbox = popup.querySelector(`.${swalClasses.checkbox} input`);
		    const textarea = getDirectChildByClass(popup, swalClasses.textarea);
		    input.oninput = resetValidationMessage$1;
		    file.onchange = resetValidationMessage$1;
		    select.onchange = resetValidationMessage$1;
		    checkbox.onchange = resetValidationMessage$1;
		    textarea.oninput = resetValidationMessage$1;
		    range.oninput = () => {
		      resetValidationMessage$1();
		      rangeOutput.value = range.value;
		    };
		    range.onchange = () => {
		      resetValidationMessage$1();
		      rangeOutput.value = range.value;
		    };
		  };

		  /**
		   * @param {string | HTMLElement} target
		   * @returns {HTMLElement}
		   */
		  const getTarget = target => typeof target === 'string' ? document.querySelector(target) : target;

		  /**
		   * @param {SweetAlertOptions} params
		   */
		  const setupAccessibility = params => {
		    const popup = getPopup();
		    popup.setAttribute('role', params.toast ? 'alert' : 'dialog');
		    popup.setAttribute('aria-live', params.toast ? 'polite' : 'assertive');
		    if (!params.toast) {
		      popup.setAttribute('aria-modal', 'true');
		    }
		  };

		  /**
		   * @param {HTMLElement} targetElement
		   */
		  const setupRTL = targetElement => {
		    if (window.getComputedStyle(targetElement).direction === 'rtl') {
		      addClass(getContainer(), swalClasses.rtl);
		    }
		  };

		  /**
		   * Add modal + backdrop + no-war message for Russians to DOM
		   *
		   * @param {SweetAlertOptions} params
		   */
		  const init = params => {
		    // Clean up the old popup container if it exists
		    const oldContainerExisted = resetOldContainer();

		    /* istanbul ignore if */
		    if (isNodeEnv()) {
		      error('SweetAlert2 requires document to initialize');
		      return;
		    }
		    const container = document.createElement('div');
		    container.className = swalClasses.container;
		    if (oldContainerExisted) {
		      addClass(container, swalClasses['no-transition']);
		    }
		    setInnerHtml(container, sweetHTML);
		    const targetElement = getTarget(params.target);
		    targetElement.appendChild(container);
		    setupAccessibility(params);
		    setupRTL(targetElement);
		    addInputChangeListeners();
		  };

		  /**
		   * @param {HTMLElement | object | string} param
		   * @param {HTMLElement} target
		   */
		  const parseHtmlToContainer = (param, target) => {
		    // DOM element
		    if (param instanceof HTMLElement) {
		      target.appendChild(param);
		    }

		    // Object
		    else if (typeof param === 'object') {
		      handleObject(param, target);
		    }

		    // Plain string
		    else if (param) {
		      setInnerHtml(target, param);
		    }
		  };

		  /**
		   * @param {any} param
		   * @param {HTMLElement} target
		   */
		  const handleObject = (param, target) => {
		    // JQuery element(s)
		    if (param.jquery) {
		      handleJqueryElem(target, param);
		    }

		    // For other objects use their string representation
		    else {
		      setInnerHtml(target, param.toString());
		    }
		  };

		  /**
		   * @param {HTMLElement} target
		   * @param {any} elem
		   */
		  const handleJqueryElem = (target, elem) => {
		    target.textContent = '';
		    if (0 in elem) {
		      for (let i = 0; (i in elem); i++) {
		        target.appendChild(elem[i].cloneNode(true));
		      }
		    } else {
		      target.appendChild(elem.cloneNode(true));
		    }
		  };

		  /**
		   * @returns {'webkitAnimationEnd' | 'animationend' | false}
		   */
		  const animationEndEvent = (() => {
		    // Prevent run in Node env
		    /* istanbul ignore if */
		    if (isNodeEnv()) {
		      return false;
		    }
		    const testEl = document.createElement('div');
		    const transEndEventNames = {
		      WebkitAnimation: 'webkitAnimationEnd',
		      // Chrome, Safari and Opera
		      animation: 'animationend' // Standard syntax
		    };

		    for (const i in transEndEventNames) {
		      if (Object.prototype.hasOwnProperty.call(transEndEventNames, i) && typeof testEl.style[i] !== 'undefined') {
		        return transEndEventNames[i];
		      }
		    }
		    return false;
		  })();

		  /**
		   * @param {SweetAlert} instance
		   * @param {SweetAlertOptions} params
		   */
		  const renderActions = (instance, params) => {
		    const actions = getActions();
		    const loader = getLoader();
		    if (!actions || !loader) {
		      return;
		    }

		    // Actions (buttons) wrapper
		    if (!params.showConfirmButton && !params.showDenyButton && !params.showCancelButton) {
		      hide(actions);
		    } else {
		      show(actions);
		    }

		    // Custom class
		    applyCustomClass(actions, params, 'actions');

		    // Render all the buttons
		    renderButtons(actions, loader, params);

		    // Loader
		    setInnerHtml(loader, params.loaderHtml || '');
		    applyCustomClass(loader, params, 'loader');
		  };

		  /**
		   * @param {HTMLElement} actions
		   * @param {HTMLElement} loader
		   * @param {SweetAlertOptions} params
		   */
		  function renderButtons(actions, loader, params) {
		    const confirmButton = getConfirmButton();
		    const denyButton = getDenyButton();
		    const cancelButton = getCancelButton();
		    if (!confirmButton || !denyButton || !cancelButton) {
		      return;
		    }

		    // Render buttons
		    renderButton(confirmButton, 'confirm', params);
		    renderButton(denyButton, 'deny', params);
		    renderButton(cancelButton, 'cancel', params);
		    handleButtonsStyling(confirmButton, denyButton, cancelButton, params);
		    if (params.reverseButtons) {
		      if (params.toast) {
		        actions.insertBefore(cancelButton, confirmButton);
		        actions.insertBefore(denyButton, confirmButton);
		      } else {
		        actions.insertBefore(cancelButton, loader);
		        actions.insertBefore(denyButton, loader);
		        actions.insertBefore(confirmButton, loader);
		      }
		    }
		  }

		  /**
		   * @param {HTMLElement} confirmButton
		   * @param {HTMLElement} denyButton
		   * @param {HTMLElement} cancelButton
		   * @param {SweetAlertOptions} params
		   */
		  function handleButtonsStyling(confirmButton, denyButton, cancelButton, params) {
		    if (!params.buttonsStyling) {
		      removeClass([confirmButton, denyButton, cancelButton], swalClasses.styled);
		      return;
		    }
		    addClass([confirmButton, denyButton, cancelButton], swalClasses.styled);

		    // Buttons background colors
		    if (params.confirmButtonColor) {
		      confirmButton.style.backgroundColor = params.confirmButtonColor;
		      addClass(confirmButton, swalClasses['default-outline']);
		    }
		    if (params.denyButtonColor) {
		      denyButton.style.backgroundColor = params.denyButtonColor;
		      addClass(denyButton, swalClasses['default-outline']);
		    }
		    if (params.cancelButtonColor) {
		      cancelButton.style.backgroundColor = params.cancelButtonColor;
		      addClass(cancelButton, swalClasses['default-outline']);
		    }
		  }

		  /**
		   * @param {HTMLElement} button
		   * @param {'confirm' | 'deny' | 'cancel'} buttonType
		   * @param {SweetAlertOptions} params
		   */
		  function renderButton(button, buttonType, params) {
		    const buttonName = /** @type {'Confirm' | 'Deny' | 'Cancel'} */capitalizeFirstLetter(buttonType);
		    toggle(button, params[`show${buttonName}Button`], 'inline-block');
		    setInnerHtml(button, params[`${buttonType}ButtonText`] || ''); // Set caption text
		    button.setAttribute('aria-label', params[`${buttonType}ButtonAriaLabel`] || ''); // ARIA label

		    // Add buttons custom classes
		    button.className = swalClasses[buttonType];
		    applyCustomClass(button, params, `${buttonType}Button`);
		  }

		  /**
		   * @param {SweetAlert} instance
		   * @param {SweetAlertOptions} params
		   */
		  const renderCloseButton = (instance, params) => {
		    const closeButton = getCloseButton();
		    if (!closeButton) {
		      return;
		    }
		    setInnerHtml(closeButton, params.closeButtonHtml || '');

		    // Custom class
		    applyCustomClass(closeButton, params, 'closeButton');
		    toggle(closeButton, params.showCloseButton);
		    closeButton.setAttribute('aria-label', params.closeButtonAriaLabel || '');
		  };

		  /**
		   * @param {SweetAlert} instance
		   * @param {SweetAlertOptions} params
		   */
		  const renderContainer = (instance, params) => {
		    const container = getContainer();
		    if (!container) {
		      return;
		    }
		    handleBackdropParam(container, params.backdrop);
		    handlePositionParam(container, params.position);
		    handleGrowParam(container, params.grow);

		    // Custom class
		    applyCustomClass(container, params, 'container');
		  };

		  /**
		   * @param {HTMLElement} container
		   * @param {SweetAlertOptions['backdrop']} backdrop
		   */
		  function handleBackdropParam(container, backdrop) {
		    if (typeof backdrop === 'string') {
		      container.style.background = backdrop;
		    } else if (!backdrop) {
		      addClass([document.documentElement, document.body], swalClasses['no-backdrop']);
		    }
		  }

		  /**
		   * @param {HTMLElement} container
		   * @param {SweetAlertOptions['position']} position
		   */
		  function handlePositionParam(container, position) {
		    if (!position) {
		      return;
		    }
		    if (position in swalClasses) {
		      addClass(container, swalClasses[position]);
		    } else {
		      warn('The "position" parameter is not valid, defaulting to "center"');
		      addClass(container, swalClasses.center);
		    }
		  }

		  /**
		   * @param {HTMLElement} container
		   * @param {SweetAlertOptions['grow']} grow
		   */
		  function handleGrowParam(container, grow) {
		    if (!grow) {
		      return;
		    }
		    addClass(container, swalClasses[`grow-${grow}`]);
		  }

		  /// <reference path="../../../../sweetalert2.d.ts"/>


		  /** @type {InputClass[]} */
		  const inputClasses = ['input', 'file', 'range', 'select', 'radio', 'checkbox', 'textarea'];

		  /**
		   * @param {SweetAlert} instance
		   * @param {SweetAlertOptions} params
		   */
		  const renderInput = (instance, params) => {
		    const popup = getPopup();
		    const innerParams = privateProps.innerParams.get(instance);
		    const rerender = !innerParams || params.input !== innerParams.input;
		    inputClasses.forEach(inputClass => {
		      const inputContainer = getDirectChildByClass(popup, swalClasses[inputClass]);

		      // set attributes
		      setAttributes(inputClass, params.inputAttributes);

		      // set class
		      inputContainer.className = swalClasses[inputClass];
		      if (rerender) {
		        hide(inputContainer);
		      }
		    });
		    if (params.input) {
		      if (rerender) {
		        showInput(params);
		      }
		      // set custom class
		      setCustomClass(params);
		    }
		  };

		  /**
		   * @param {SweetAlertOptions} params
		   */
		  const showInput = params => {
		    if (!renderInputType[params.input]) {
		      error(`Unexpected type of input! Expected "text", "email", "password", "number", "tel", "select", "radio", "checkbox", "textarea", "file" or "url", got "${params.input}"`);
		      return;
		    }
		    const inputContainer = getInputContainer(params.input);
		    const input = renderInputType[params.input](inputContainer, params);
		    show(inputContainer);

		    // input autofocus
		    if (params.inputAutoFocus) {
		      setTimeout(() => {
		        focusInput(input);
		      });
		    }
		  };

		  /**
		   * @param {HTMLInputElement} input
		   */
		  const removeAttributes = input => {
		    for (let i = 0; i < input.attributes.length; i++) {
		      const attrName = input.attributes[i].name;
		      if (!['id', 'type', 'value', 'style'].includes(attrName)) {
		        input.removeAttribute(attrName);
		      }
		    }
		  };

		  /**
		   * @param {InputClass} inputClass
		   * @param {SweetAlertOptions['inputAttributes']} inputAttributes
		   */
		  const setAttributes = (inputClass, inputAttributes) => {
		    const input = getInput$1(getPopup(), inputClass);
		    if (!input) {
		      return;
		    }
		    removeAttributes(input);
		    for (const attr in inputAttributes) {
		      input.setAttribute(attr, inputAttributes[attr]);
		    }
		  };

		  /**
		   * @param {SweetAlertOptions} params
		   */
		  const setCustomClass = params => {
		    const inputContainer = getInputContainer(params.input);
		    if (typeof params.customClass === 'object') {
		      addClass(inputContainer, params.customClass.input);
		    }
		  };

		  /**
		   * @param {HTMLInputElement | HTMLTextAreaElement} input
		   * @param {SweetAlertOptions} params
		   */
		  const setInputPlaceholder = (input, params) => {
		    if (!input.placeholder || params.inputPlaceholder) {
		      input.placeholder = params.inputPlaceholder;
		    }
		  };

		  /**
		   * @param {Input} input
		   * @param {Input} prependTo
		   * @param {SweetAlertOptions} params
		   */
		  const setInputLabel = (input, prependTo, params) => {
		    if (params.inputLabel) {
		      const label = document.createElement('label');
		      const labelClass = swalClasses['input-label'];
		      label.setAttribute('for', input.id);
		      label.className = labelClass;
		      if (typeof params.customClass === 'object') {
		        addClass(label, params.customClass.inputLabel);
		      }
		      label.innerText = params.inputLabel;
		      prependTo.insertAdjacentElement('beforebegin', label);
		    }
		  };

		  /**
		   * @param {SweetAlertOptions['input']} inputType
		   * @returns {HTMLElement}
		   */
		  const getInputContainer = inputType => {
		    return getDirectChildByClass(getPopup(), swalClasses[inputType] || swalClasses.input);
		  };

		  /**
		   * @param {HTMLInputElement | HTMLOutputElement | HTMLTextAreaElement} input
		   * @param {SweetAlertOptions['inputValue']} inputValue
		   */
		  const checkAndSetInputValue = (input, inputValue) => {
		    if (['string', 'number'].includes(typeof inputValue)) {
		      input.value = `${inputValue}`;
		    } else if (!isPromise(inputValue)) {
		      warn(`Unexpected type of inputValue! Expected "string", "number" or "Promise", got "${typeof inputValue}"`);
		    }
		  };

		  /** @type {Record<string, (input: Input | HTMLElement, params: SweetAlertOptions) => Input>} */
		  const renderInputType = {};

		  /**
		   * @param {HTMLInputElement} input
		   * @param {SweetAlertOptions} params
		   * @returns {HTMLInputElement}
		   */
		  renderInputType.text = renderInputType.email = renderInputType.password = renderInputType.number = renderInputType.tel = renderInputType.url = (input, params) => {
		    checkAndSetInputValue(input, params.inputValue);
		    setInputLabel(input, input, params);
		    setInputPlaceholder(input, params);
		    input.type = params.input;
		    return input;
		  };

		  /**
		   * @param {HTMLInputElement} input
		   * @param {SweetAlertOptions} params
		   * @returns {HTMLInputElement}
		   */
		  renderInputType.file = (input, params) => {
		    setInputLabel(input, input, params);
		    setInputPlaceholder(input, params);
		    return input;
		  };

		  /**
		   * @param {HTMLInputElement} range
		   * @param {SweetAlertOptions} params
		   * @returns {HTMLInputElement}
		   */
		  renderInputType.range = (range, params) => {
		    const rangeInput = range.querySelector('input');
		    const rangeOutput = range.querySelector('output');
		    checkAndSetInputValue(rangeInput, params.inputValue);
		    rangeInput.type = params.input;
		    checkAndSetInputValue(rangeOutput, params.inputValue);
		    setInputLabel(rangeInput, range, params);
		    return range;
		  };

		  /**
		   * @param {HTMLSelectElement} select
		   * @param {SweetAlertOptions} params
		   * @returns {HTMLSelectElement}
		   */
		  renderInputType.select = (select, params) => {
		    select.textContent = '';
		    if (params.inputPlaceholder) {
		      const placeholder = document.createElement('option');
		      setInnerHtml(placeholder, params.inputPlaceholder);
		      placeholder.value = '';
		      placeholder.disabled = true;
		      placeholder.selected = true;
		      select.appendChild(placeholder);
		    }
		    setInputLabel(select, select, params);
		    return select;
		  };

		  /**
		   * @param {HTMLInputElement} radio
		   * @returns {HTMLInputElement}
		   */
		  renderInputType.radio = radio => {
		    radio.textContent = '';
		    return radio;
		  };

		  /**
		   * @param {HTMLLabelElement} checkboxContainer
		   * @param {SweetAlertOptions} params
		   * @returns {HTMLInputElement}
		   */
		  renderInputType.checkbox = (checkboxContainer, params) => {
		    const checkbox = getInput$1(getPopup(), 'checkbox');
		    checkbox.value = '1';
		    checkbox.checked = Boolean(params.inputValue);
		    const label = checkboxContainer.querySelector('span');
		    setInnerHtml(label, params.inputPlaceholder);
		    return checkbox;
		  };

		  /**
		   * @param {HTMLTextAreaElement} textarea
		   * @param {SweetAlertOptions} params
		   * @returns {HTMLTextAreaElement}
		   */
		  renderInputType.textarea = (textarea, params) => {
		    checkAndSetInputValue(textarea, params.inputValue);
		    setInputPlaceholder(textarea, params);
		    setInputLabel(textarea, textarea, params);

		    /**
		     * @param {HTMLElement} el
		     * @returns {number}
		     */
		    const getMargin = el => parseInt(window.getComputedStyle(el).marginLeft) + parseInt(window.getComputedStyle(el).marginRight);

		    // https://github.com/sweetalert2/sweetalert2/issues/2291
		    setTimeout(() => {
		      // https://github.com/sweetalert2/sweetalert2/issues/1699
		      if ('MutationObserver' in window) {
		        const initialPopupWidth = parseInt(window.getComputedStyle(getPopup()).width);
		        const textareaResizeHandler = () => {
		          // check if texarea is still in document (i.e. popup wasn't closed in the meantime)
		          if (!document.body.contains(textarea)) {
		            return;
		          }
		          const textareaWidth = textarea.offsetWidth + getMargin(textarea);
		          if (textareaWidth > initialPopupWidth) {
		            getPopup().style.width = `${textareaWidth}px`;
		          } else {
		            applyNumericalStyle(getPopup(), 'width', params.width);
		          }
		        };
		        new MutationObserver(textareaResizeHandler).observe(textarea, {
		          attributes: true,
		          attributeFilter: ['style']
		        });
		      }
		    });
		    return textarea;
		  };

		  /**
		   * @param {SweetAlert} instance
		   * @param {SweetAlertOptions} params
		   */
		  const renderContent = (instance, params) => {
		    const htmlContainer = getHtmlContainer();
		    if (!htmlContainer) {
		      return;
		    }
		    applyCustomClass(htmlContainer, params, 'htmlContainer');

		    // Content as HTML
		    if (params.html) {
		      parseHtmlToContainer(params.html, htmlContainer);
		      show(htmlContainer, 'block');
		    }

		    // Content as plain text
		    else if (params.text) {
		      htmlContainer.textContent = params.text;
		      show(htmlContainer, 'block');
		    }

		    // No content
		    else {
		      hide(htmlContainer);
		    }
		    renderInput(instance, params);
		  };

		  /**
		   * @param {SweetAlert} instance
		   * @param {SweetAlertOptions} params
		   */
		  const renderFooter = (instance, params) => {
		    const footer = getFooter();
		    if (!footer) {
		      return;
		    }
		    toggle(footer, params.footer);
		    if (params.footer) {
		      parseHtmlToContainer(params.footer, footer);
		    }

		    // Custom class
		    applyCustomClass(footer, params, 'footer');
		  };

		  /**
		   * @param {SweetAlert} instance
		   * @param {SweetAlertOptions} params
		   */
		  const renderIcon = (instance, params) => {
		    const innerParams = privateProps.innerParams.get(instance);
		    const icon = getIcon();
		    if (!icon) {
		      return;
		    }

		    // if the given icon already rendered, apply the styling without re-rendering the icon
		    if (innerParams && params.icon === innerParams.icon) {
		      // Custom or default content
		      setContent(icon, params);
		      applyStyles(icon, params);
		      return;
		    }
		    if (!params.icon && !params.iconHtml) {
		      hide(icon);
		      return;
		    }
		    if (params.icon && Object.keys(iconTypes).indexOf(params.icon) === -1) {
		      error(`Unknown icon! Expected "success", "error", "warning", "info" or "question", got "${params.icon}"`);
		      hide(icon);
		      return;
		    }
		    show(icon);

		    // Custom or default content
		    setContent(icon, params);
		    applyStyles(icon, params);

		    // Animate icon
		    addClass(icon, params.showClass && params.showClass.icon);
		  };

		  /**
		   * @param {HTMLElement} icon
		   * @param {SweetAlertOptions} params
		   */
		  const applyStyles = (icon, params) => {
		    for (const [iconType, iconClassName] of Object.entries(iconTypes)) {
		      if (params.icon !== iconType) {
		        removeClass(icon, iconClassName);
		      }
		    }
		    addClass(icon, params.icon && iconTypes[params.icon]);

		    // Icon color
		    setColor(icon, params);

		    // Success icon background color
		    adjustSuccessIconBackgroundColor();

		    // Custom class
		    applyCustomClass(icon, params, 'icon');
		  };

		  // Adjust success icon background color to match the popup background color
		  const adjustSuccessIconBackgroundColor = () => {
		    const popup = getPopup();
		    if (!popup) {
		      return;
		    }
		    const popupBackgroundColor = window.getComputedStyle(popup).getPropertyValue('background-color');
		    /** @type {NodeListOf<HTMLElement>} */
		    const successIconParts = popup.querySelectorAll('[class^=swal2-success-circular-line], .swal2-success-fix');
		    for (let i = 0; i < successIconParts.length; i++) {
		      successIconParts[i].style.backgroundColor = popupBackgroundColor;
		    }
		  };
		  const successIconHtml = `
  <div class="swal2-success-circular-line-left"></div>
  <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>
  <div class="swal2-success-ring"></div> <div class="swal2-success-fix"></div>
  <div class="swal2-success-circular-line-right"></div>
`;
		  const errorIconHtml = `
  <span class="swal2-x-mark">
    <span class="swal2-x-mark-line-left"></span>
    <span class="swal2-x-mark-line-right"></span>
  </span>
`;

		  /**
		   * @param {HTMLElement} icon
		   * @param {SweetAlertOptions} params
		   */
		  const setContent = (icon, params) => {
		    if (!params.icon) {
		      return;
		    }
		    let oldContent = icon.innerHTML;
		    let newContent;
		    if (params.iconHtml) {
		      newContent = iconContent(params.iconHtml);
		    } else if (params.icon === 'success') {
		      newContent = successIconHtml;
		      oldContent = oldContent.replace(/ style=".*?"/g, ''); // undo adjustSuccessIconBackgroundColor()
		    } else if (params.icon === 'error') {
		      newContent = errorIconHtml;
		    } else {
		      const defaultIconHtml = {
		        question: '?',
		        warning: '!',
		        info: 'i'
		      };
		      newContent = iconContent(defaultIconHtml[params.icon]);
		    }
		    if (oldContent.trim() !== newContent.trim()) {
		      setInnerHtml(icon, newContent);
		    }
		  };

		  /**
		   * @param {HTMLElement} icon
		   * @param {SweetAlertOptions} params
		   */
		  const setColor = (icon, params) => {
		    if (!params.iconColor) {
		      return;
		    }
		    icon.style.color = params.iconColor;
		    icon.style.borderColor = params.iconColor;
		    for (const sel of ['.swal2-success-line-tip', '.swal2-success-line-long', '.swal2-x-mark-line-left', '.swal2-x-mark-line-right']) {
		      setStyle(icon, sel, 'backgroundColor', params.iconColor);
		    }
		    setStyle(icon, '.swal2-success-ring', 'borderColor', params.iconColor);
		  };

		  /**
		   * @param {string} content
		   * @returns {string}
		   */
		  const iconContent = content => `<div class="${swalClasses['icon-content']}">${content}</div>`;

		  /**
		   * @param {SweetAlert} instance
		   * @param {SweetAlertOptions} params
		   */
		  const renderImage = (instance, params) => {
		    const image = getImage();
		    if (!image) {
		      return;
		    }
		    if (!params.imageUrl) {
		      hide(image);
		      return;
		    }
		    show(image, '');

		    // Src, alt
		    image.setAttribute('src', params.imageUrl);
		    image.setAttribute('alt', params.imageAlt || '');

		    // Width, height
		    applyNumericalStyle(image, 'width', params.imageWidth);
		    applyNumericalStyle(image, 'height', params.imageHeight);

		    // Class
		    image.className = swalClasses.image;
		    applyCustomClass(image, params, 'image');
		  };

		  /**
		   * @param {SweetAlert} instance
		   * @param {SweetAlertOptions} params
		   */
		  const renderPopup = (instance, params) => {
		    const container = getContainer();
		    const popup = getPopup();
		    if (!container || !popup) {
		      return;
		    }

		    // Width
		    // https://github.com/sweetalert2/sweetalert2/issues/2170
		    if (params.toast) {
		      applyNumericalStyle(container, 'width', params.width);
		      popup.style.width = '100%';
		      const loader = getLoader();
		      loader && popup.insertBefore(loader, getIcon());
		    } else {
		      applyNumericalStyle(popup, 'width', params.width);
		    }

		    // Padding
		    applyNumericalStyle(popup, 'padding', params.padding);

		    // Color
		    if (params.color) {
		      popup.style.color = params.color;
		    }

		    // Background
		    if (params.background) {
		      popup.style.background = params.background;
		    }
		    hide(getValidationMessage());

		    // Classes
		    addClasses$1(popup, params);
		  };

		  /**
		   * @param {HTMLElement} popup
		   * @param {SweetAlertOptions} params
		   */
		  const addClasses$1 = (popup, params) => {
		    const showClass = params.showClass || {};
		    // Default Class + showClass when updating Swal.update({})
		    popup.className = `${swalClasses.popup} ${isVisible$1(popup) ? showClass.popup : ''}`;
		    if (params.toast) {
		      addClass([document.documentElement, document.body], swalClasses['toast-shown']);
		      addClass(popup, swalClasses.toast);
		    } else {
		      addClass(popup, swalClasses.modal);
		    }

		    // Custom class
		    applyCustomClass(popup, params, 'popup');
		    if (typeof params.customClass === 'string') {
		      addClass(popup, params.customClass);
		    }

		    // Icon class (#1842)
		    if (params.icon) {
		      addClass(popup, swalClasses[`icon-${params.icon}`]);
		    }
		  };

		  /**
		   * @param {SweetAlert} instance
		   * @param {SweetAlertOptions} params
		   */
		  const renderProgressSteps = (instance, params) => {
		    const progressStepsContainer = getProgressSteps();
		    if (!progressStepsContainer) {
		      return;
		    }
		    const {
		      progressSteps,
		      currentProgressStep
		    } = params;
		    if (!progressSteps || progressSteps.length === 0 || currentProgressStep === undefined) {
		      hide(progressStepsContainer);
		      return;
		    }
		    show(progressStepsContainer);
		    progressStepsContainer.textContent = '';
		    if (currentProgressStep >= progressSteps.length) {
		      warn('Invalid currentProgressStep parameter, it should be less than progressSteps.length ' + '(currentProgressStep like JS arrays starts from 0)');
		    }
		    progressSteps.forEach((step, index) => {
		      const stepEl = createStepElement(step);
		      progressStepsContainer.appendChild(stepEl);
		      if (index === currentProgressStep) {
		        addClass(stepEl, swalClasses['active-progress-step']);
		      }
		      if (index !== progressSteps.length - 1) {
		        const lineEl = createLineElement(params);
		        progressStepsContainer.appendChild(lineEl);
		      }
		    });
		  };

		  /**
		   * @param {string} step
		   * @returns {HTMLLIElement}
		   */
		  const createStepElement = step => {
		    const stepEl = document.createElement('li');
		    addClass(stepEl, swalClasses['progress-step']);
		    setInnerHtml(stepEl, step);
		    return stepEl;
		  };

		  /**
		   * @param {SweetAlertOptions} params
		   * @returns {HTMLLIElement}
		   */
		  const createLineElement = params => {
		    const lineEl = document.createElement('li');
		    addClass(lineEl, swalClasses['progress-step-line']);
		    if (params.progressStepsDistance) {
		      applyNumericalStyle(lineEl, 'width', params.progressStepsDistance);
		    }
		    return lineEl;
		  };

		  /**
		   * @param {SweetAlert} instance
		   * @param {SweetAlertOptions} params
		   */
		  const renderTitle = (instance, params) => {
		    const title = getTitle();
		    if (!title) {
		      return;
		    }
		    toggle(title, params.title || params.titleText, 'block');
		    if (params.title) {
		      parseHtmlToContainer(params.title, title);
		    }
		    if (params.titleText) {
		      title.innerText = params.titleText;
		    }

		    // Custom class
		    applyCustomClass(title, params, 'title');
		  };

		  /**
		   * @param {SweetAlert} instance
		   * @param {SweetAlertOptions} params
		   */
		  const render = (instance, params) => {
		    renderPopup(instance, params);
		    renderContainer(instance, params);
		    renderProgressSteps(instance, params);
		    renderIcon(instance, params);
		    renderImage(instance, params);
		    renderTitle(instance, params);
		    renderCloseButton(instance, params);
		    renderContent(instance, params);
		    renderActions(instance, params);
		    renderFooter(instance, params);
		    const popup = getPopup();
		    if (typeof params.didRender === 'function' && popup) {
		      params.didRender(popup);
		    }
		  };

		  /*
		   * Global function to determine if SweetAlert2 popup is shown
		   */
		  const isVisible = () => {
		    return isVisible$1(getPopup());
		  };

		  /*
		   * Global function to click 'Confirm' button
		   */
		  const clickConfirm = () => getConfirmButton() && getConfirmButton().click();

		  /*
		   * Global function to click 'Deny' button
		   */
		  const clickDeny = () => getDenyButton() && getDenyButton().click();

		  /*
		   * Global function to click 'Cancel' button
		   */
		  const clickCancel = () => getCancelButton() && getCancelButton().click();

		  /** @typedef {'cancel' | 'backdrop' | 'close' | 'esc' | 'timer'} DismissReason */

		  /** @type {Record<DismissReason, DismissReason>} */
		  const DismissReason = Object.freeze({
		    cancel: 'cancel',
		    backdrop: 'backdrop',
		    close: 'close',
		    esc: 'esc',
		    timer: 'timer'
		  });

		  /**
		   * @param {GlobalState} globalState
		   */
		  const removeKeydownHandler = globalState => {
		    if (globalState.keydownTarget && globalState.keydownHandlerAdded) {
		      globalState.keydownTarget.removeEventListener('keydown', globalState.keydownHandler, {
		        capture: globalState.keydownListenerCapture
		      });
		      globalState.keydownHandlerAdded = false;
		    }
		  };

		  /**
		   * @param {SweetAlert} instance
		   * @param {GlobalState} globalState
		   * @param {SweetAlertOptions} innerParams
		   * @param {*} dismissWith
		   */
		  const addKeydownHandler = (instance, globalState, innerParams, dismissWith) => {
		    removeKeydownHandler(globalState);
		    if (!innerParams.toast) {
		      globalState.keydownHandler = e => keydownHandler(instance, e, dismissWith);
		      globalState.keydownTarget = innerParams.keydownListenerCapture ? window : getPopup();
		      globalState.keydownListenerCapture = innerParams.keydownListenerCapture;
		      globalState.keydownTarget.addEventListener('keydown', globalState.keydownHandler, {
		        capture: globalState.keydownListenerCapture
		      });
		      globalState.keydownHandlerAdded = true;
		    }
		  };

		  /**
		   * @param {number} index
		   * @param {number} increment
		   */
		  const setFocus = (index, increment) => {
		    const focusableElements = getFocusableElements();
		    // search for visible elements and select the next possible match
		    if (focusableElements.length) {
		      index = index + increment;

		      // rollover to first item
		      if (index === focusableElements.length) {
		        index = 0;

		        // go to last item
		      } else if (index === -1) {
		        index = focusableElements.length - 1;
		      }
		      focusableElements[index].focus();
		      return;
		    }
		    // no visible focusable elements, focus the popup
		    getPopup().focus();
		  };
		  const arrowKeysNextButton = ['ArrowRight', 'ArrowDown'];
		  const arrowKeysPreviousButton = ['ArrowLeft', 'ArrowUp'];

		  /**
		   * @param {SweetAlert} instance
		   * @param {KeyboardEvent} event
		   * @param {Function} dismissWith
		   */
		  const keydownHandler = (instance, event, dismissWith) => {
		    const innerParams = privateProps.innerParams.get(instance);
		    if (!innerParams) {
		      return; // This instance has already been destroyed
		    }

		    // Ignore keydown during IME composition
		    // https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event#ignoring_keydown_during_ime_composition
		    // https://github.com/sweetalert2/sweetalert2/issues/720
		    // https://github.com/sweetalert2/sweetalert2/issues/2406
		    if (event.isComposing || event.keyCode === 229) {
		      return;
		    }
		    if (innerParams.stopKeydownPropagation) {
		      event.stopPropagation();
		    }

		    // ENTER
		    if (event.key === 'Enter') {
		      handleEnter(instance, event, innerParams);
		    }

		    // TAB
		    else if (event.key === 'Tab') {
		      handleTab(event);
		    }

		    // ARROWS - switch focus between buttons
		    else if ([...arrowKeysNextButton, ...arrowKeysPreviousButton].includes(event.key)) {
		      handleArrows(event.key);
		    }

		    // ESC
		    else if (event.key === 'Escape') {
		      handleEsc(event, innerParams, dismissWith);
		    }
		  };

		  /**
		   * @param {SweetAlert} instance
		   * @param {KeyboardEvent} event
		   * @param {SweetAlertOptions} innerParams
		   */
		  const handleEnter = (instance, event, innerParams) => {
		    // https://github.com/sweetalert2/sweetalert2/issues/2386
		    if (!callIfFunction(innerParams.allowEnterKey)) {
		      return;
		    }
		    if (event.target && instance.getInput() && event.target instanceof HTMLElement && event.target.outerHTML === instance.getInput().outerHTML) {
		      if (['textarea', 'file'].includes(innerParams.input)) {
		        return; // do not submit
		      }

		      clickConfirm();
		      event.preventDefault();
		    }
		  };

		  /**
		   * @param {KeyboardEvent} event
		   */
		  const handleTab = event => {
		    const targetElement = event.target;
		    const focusableElements = getFocusableElements();
		    let btnIndex = -1;
		    for (let i = 0; i < focusableElements.length; i++) {
		      if (targetElement === focusableElements[i]) {
		        btnIndex = i;
		        break;
		      }
		    }

		    // Cycle to the next button
		    if (!event.shiftKey) {
		      setFocus(btnIndex, 1);
		    }

		    // Cycle to the prev button
		    else {
		      setFocus(btnIndex, -1);
		    }
		    event.stopPropagation();
		    event.preventDefault();
		  };

		  /**
		   * @param {string} key
		   */
		  const handleArrows = key => {
		    const confirmButton = getConfirmButton();
		    const denyButton = getDenyButton();
		    const cancelButton = getCancelButton();
		    /** @type HTMLElement[] */
		    const buttons = [confirmButton, denyButton, cancelButton];
		    if (document.activeElement instanceof HTMLElement && !buttons.includes(document.activeElement)) {
		      return;
		    }
		    const sibling = arrowKeysNextButton.includes(key) ? 'nextElementSibling' : 'previousElementSibling';
		    let buttonToFocus = document.activeElement;
		    for (let i = 0; i < getActions().children.length; i++) {
		      buttonToFocus = buttonToFocus[sibling];
		      if (!buttonToFocus) {
		        return;
		      }
		      if (buttonToFocus instanceof HTMLButtonElement && isVisible$1(buttonToFocus)) {
		        break;
		      }
		    }
		    if (buttonToFocus instanceof HTMLButtonElement) {
		      buttonToFocus.focus();
		    }
		  };

		  /**
		   * @param {KeyboardEvent} event
		   * @param {SweetAlertOptions} innerParams
		   * @param {Function} dismissWith
		   */
		  const handleEsc = (event, innerParams, dismissWith) => {
		    if (callIfFunction(innerParams.allowEscapeKey)) {
		      event.preventDefault();
		      dismissWith(DismissReason.esc);
		    }
		  };

		  /**
		   * This module contains `WeakMap`s for each effectively-"private  property" that a `Swal` has.
		   * For example, to set the private property "foo" of `this` to "bar", you can `privateProps.foo.set(this, 'bar')`
		   * This is the approach that Babel will probably take to implement private methods/fields
		   *   https://github.com/tc39/proposal-private-methods
		   *   https://github.com/babel/babel/pull/7555
		   * Once we have the changes from that PR in Babel, and our core class fits reasonable in *one module*
		   *   then we can use that language feature.
		   */

		  var privateMethods = {
		    swalPromiseResolve: new WeakMap(),
		    swalPromiseReject: new WeakMap()
		  };

		  // From https://developer.paciellogroup.com/blog/2018/06/the-current-state-of-modal-dialog-accessibility/
		  // Adding aria-hidden="true" to elements outside of the active modal dialog ensures that
		  // elements not within the active modal dialog will not be surfaced if a user opens a screen
		  // reader’s list of elements (headings, form controls, landmarks, etc.) in the document.

		  const setAriaHidden = () => {
		    const bodyChildren = Array.from(document.body.children);
		    bodyChildren.forEach(el => {
		      if (el === getContainer() || el.contains(getContainer())) {
		        return;
		      }
		      if (el.hasAttribute('aria-hidden')) {
		        el.setAttribute('data-previous-aria-hidden', el.getAttribute('aria-hidden') || '');
		      }
		      el.setAttribute('aria-hidden', 'true');
		    });
		  };
		  const unsetAriaHidden = () => {
		    const bodyChildren = Array.from(document.body.children);
		    bodyChildren.forEach(el => {
		      if (el.hasAttribute('data-previous-aria-hidden')) {
		        el.setAttribute('aria-hidden', el.getAttribute('data-previous-aria-hidden') || '');
		        el.removeAttribute('data-previous-aria-hidden');
		      } else {
		        el.removeAttribute('aria-hidden');
		      }
		    });
		  };

		  /* istanbul ignore file */

		  // @ts-ignore
		  const isSafariOrIOS = typeof window !== 'undefined' && !!window.GestureEvent; // true for Safari desktop + all iOS browsers https://stackoverflow.com/a/70585394

		  // Fix iOS scrolling http://stackoverflow.com/q/39626302

		  const iOSfix = () => {
		    if (isSafariOrIOS && !hasClass(document.body, swalClasses.iosfix)) {
		      const offset = document.body.scrollTop;
		      document.body.style.top = `${offset * -1}px`;
		      addClass(document.body, swalClasses.iosfix);
		      lockBodyScroll();
		    }
		  };

		  /**
		   * https://github.com/sweetalert2/sweetalert2/issues/1246
		   */
		  const lockBodyScroll = () => {
		    const container = getContainer();
		    let preventTouchMove;
		    /**
		     * @param {TouchEvent} event
		     */
		    container.ontouchstart = event => {
		      preventTouchMove = shouldPreventTouchMove(event);
		    };
		    /**
		     * @param {TouchEvent} event
		     */
		    container.ontouchmove = event => {
		      if (preventTouchMove) {
		        event.preventDefault();
		        event.stopPropagation();
		      }
		    };
		  };

		  /**
		   * @param {TouchEvent} event
		   * @returns {boolean}
		   */
		  const shouldPreventTouchMove = event => {
		    const target = event.target;
		    const container = getContainer();
		    if (isStylus(event) || isZoom(event)) {
		      return false;
		    }
		    if (target === container) {
		      return true;
		    }
		    if (!isScrollable(container) && target instanceof HTMLElement && target.tagName !== 'INPUT' &&
		    // #1603
		    target.tagName !== 'TEXTAREA' &&
		    // #2266
		    !(isScrollable(getHtmlContainer()) &&
		    // #1944
		    getHtmlContainer().contains(target))) {
		      return true;
		    }
		    return false;
		  };

		  /**
		   * https://github.com/sweetalert2/sweetalert2/issues/1786
		   *
		   * @param {*} event
		   * @returns {boolean}
		   */
		  const isStylus = event => {
		    return event.touches && event.touches.length && event.touches[0].touchType === 'stylus';
		  };

		  /**
		   * https://github.com/sweetalert2/sweetalert2/issues/1891
		   *
		   * @param {TouchEvent} event
		   * @returns {boolean}
		   */
		  const isZoom = event => {
		    return event.touches && event.touches.length > 1;
		  };
		  const undoIOSfix = () => {
		    if (hasClass(document.body, swalClasses.iosfix)) {
		      const offset = parseInt(document.body.style.top, 10);
		      removeClass(document.body, swalClasses.iosfix);
		      document.body.style.top = '';
		      document.body.scrollTop = offset * -1;
		    }
		  };

		  /**
		   * Measure scrollbar width for padding body during modal show/hide
		   * https://github.com/twbs/bootstrap/blob/master/js/src/modal.js
		   *
		   * @returns {number}
		   */
		  const measureScrollbar = () => {
		    const scrollDiv = document.createElement('div');
		    scrollDiv.className = swalClasses['scrollbar-measure'];
		    document.body.appendChild(scrollDiv);
		    const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
		    document.body.removeChild(scrollDiv);
		    return scrollbarWidth;
		  };

		  /**
		   * Remember state in cases where opening and handling a modal will fiddle with it.
		   * @type {number | null}
		   */
		  let previousBodyPadding = null;
		  const fixScrollbar = () => {
		    // for queues, do not do this more than once
		    if (previousBodyPadding !== null) {
		      return;
		    }
		    // if the body has overflow
		    if (document.body.scrollHeight > window.innerHeight) {
		      // add padding so the content doesn't shift after removal of scrollbar
		      previousBodyPadding = parseInt(window.getComputedStyle(document.body).getPropertyValue('padding-right'));
		      document.body.style.paddingRight = `${previousBodyPadding + measureScrollbar()}px`;
		    }
		  };
		  const undoScrollbar = () => {
		    if (previousBodyPadding !== null) {
		      document.body.style.paddingRight = `${previousBodyPadding}px`;
		      previousBodyPadding = null;
		    }
		  };

		  /**
		   * @param {SweetAlert} instance
		   * @param {HTMLElement} container
		   * @param {boolean} returnFocus
		   * @param {Function} didClose
		   */
		  function removePopupAndResetState(instance, container, returnFocus, didClose) {
		    if (isToast()) {
		      triggerDidCloseAndDispose(instance, didClose);
		    } else {
		      restoreActiveElement(returnFocus).then(() => triggerDidCloseAndDispose(instance, didClose));
		      removeKeydownHandler(globalState);
		    }

		    // workaround for https://github.com/sweetalert2/sweetalert2/issues/2088
		    // for some reason removing the container in Safari will scroll the document to bottom
		    if (isSafariOrIOS) {
		      container.setAttribute('style', 'display:none !important');
		      container.removeAttribute('class');
		      container.innerHTML = '';
		    } else {
		      container.remove();
		    }
		    if (isModal()) {
		      undoScrollbar();
		      undoIOSfix();
		      unsetAriaHidden();
		    }
		    removeBodyClasses();
		  }

		  /**
		   * Remove SweetAlert2 classes from body
		   */
		  function removeBodyClasses() {
		    removeClass([document.documentElement, document.body], [swalClasses.shown, swalClasses['height-auto'], swalClasses['no-backdrop'], swalClasses['toast-shown']]);
		  }

		  /**
		   * Instance method to close sweetAlert
		   *
		   * @param {any} resolveValue
		   */
		  function close(resolveValue) {
		    resolveValue = prepareResolveValue(resolveValue);
		    const swalPromiseResolve = privateMethods.swalPromiseResolve.get(this);
		    const didClose = triggerClosePopup(this);
		    if (this.isAwaitingPromise) {
		      // A swal awaiting for a promise (after a click on Confirm or Deny) cannot be dismissed anymore #2335
		      if (!resolveValue.isDismissed) {
		        handleAwaitingPromise(this);
		        swalPromiseResolve(resolveValue);
		      }
		    } else if (didClose) {
		      // Resolve Swal promise
		      swalPromiseResolve(resolveValue);
		    }
		  }
		  const triggerClosePopup = instance => {
		    const popup = getPopup();
		    if (!popup) {
		      return false;
		    }
		    const innerParams = privateProps.innerParams.get(instance);
		    if (!innerParams || hasClass(popup, innerParams.hideClass.popup)) {
		      return false;
		    }
		    removeClass(popup, innerParams.showClass.popup);
		    addClass(popup, innerParams.hideClass.popup);
		    const backdrop = getContainer();
		    removeClass(backdrop, innerParams.showClass.backdrop);
		    addClass(backdrop, innerParams.hideClass.backdrop);
		    handlePopupAnimation(instance, popup, innerParams);
		    return true;
		  };

		  /**
		   * @param {any} error
		   */
		  function rejectPromise(error) {
		    const rejectPromise = privateMethods.swalPromiseReject.get(this);
		    handleAwaitingPromise(this);
		    if (rejectPromise) {
		      // Reject Swal promise
		      rejectPromise(error);
		    }
		  }

		  /**
		   * @param {SweetAlert} instance
		   */
		  const handleAwaitingPromise = instance => {
		    if (instance.isAwaitingPromise) {
		      delete instance.isAwaitingPromise;
		      // The instance might have been previously partly destroyed, we must resume the destroy process in this case #2335
		      if (!privateProps.innerParams.get(instance)) {
		        instance._destroy();
		      }
		    }
		  };

		  /**
		   * @param {any} resolveValue
		   * @returns {SweetAlertResult}
		   */
		  const prepareResolveValue = resolveValue => {
		    // When user calls Swal.close()
		    if (typeof resolveValue === 'undefined') {
		      return {
		        isConfirmed: false,
		        isDenied: false,
		        isDismissed: true
		      };
		    }
		    return Object.assign({
		      isConfirmed: false,
		      isDenied: false,
		      isDismissed: false
		    }, resolveValue);
		  };

		  /**
		   * @param {SweetAlert} instance
		   * @param {HTMLElement} popup
		   * @param {SweetAlertOptions} innerParams
		   */
		  const handlePopupAnimation = (instance, popup, innerParams) => {
		    const container = getContainer();
		    // If animation is supported, animate
		    const animationIsSupported = animationEndEvent && hasCssAnimation(popup);
		    if (typeof innerParams.willClose === 'function') {
		      innerParams.willClose(popup);
		    }
		    if (animationIsSupported) {
		      animatePopup(instance, popup, container, innerParams.returnFocus, innerParams.didClose);
		    } else {
		      // Otherwise, remove immediately
		      removePopupAndResetState(instance, container, innerParams.returnFocus, innerParams.didClose);
		    }
		  };

		  /**
		   * @param {SweetAlert} instance
		   * @param {HTMLElement} popup
		   * @param {HTMLElement} container
		   * @param {boolean} returnFocus
		   * @param {Function} didClose
		   */
		  const animatePopup = (instance, popup, container, returnFocus, didClose) => {
		    globalState.swalCloseEventFinishedCallback = removePopupAndResetState.bind(null, instance, container, returnFocus, didClose);
		    popup.addEventListener(animationEndEvent, function (e) {
		      if (e.target === popup) {
		        globalState.swalCloseEventFinishedCallback();
		        delete globalState.swalCloseEventFinishedCallback;
		      }
		    });
		  };

		  /**
		   * @param {SweetAlert} instance
		   * @param {Function} didClose
		   */
		  const triggerDidCloseAndDispose = (instance, didClose) => {
		    setTimeout(() => {
		      if (typeof didClose === 'function') {
		        didClose.bind(instance.params)();
		      }
		      // instance might have been destroyed already
		      if (instance._destroy) {
		        instance._destroy();
		      }
		    });
		  };

		  /**
		   * Shows loader (spinner), this is useful with AJAX requests.
		   * By default the loader be shown instead of the "Confirm" button.
		   *
		   * @param {HTMLButtonElement} [buttonToReplace]
		   */
		  const showLoading = buttonToReplace => {
		    let popup = getPopup();
		    if (!popup) {
		      new Swal(); // eslint-disable-line no-new
		    }

		    popup = getPopup();
		    const loader = getLoader();
		    if (isToast()) {
		      hide(getIcon());
		    } else {
		      replaceButton(popup, buttonToReplace);
		    }
		    show(loader);
		    popup.setAttribute('data-loading', 'true');
		    popup.setAttribute('aria-busy', 'true');
		    popup.focus();
		  };

		  /**
		   * @param {HTMLElement} popup
		   * @param {HTMLButtonElement} [buttonToReplace]
		   */
		  const replaceButton = (popup, buttonToReplace) => {
		    const actions = getActions();
		    const loader = getLoader();
		    if (!buttonToReplace && isVisible$1(getConfirmButton())) {
		      buttonToReplace = getConfirmButton();
		    }
		    show(actions);
		    if (buttonToReplace) {
		      hide(buttonToReplace);
		      loader.setAttribute('data-button-to-replace', buttonToReplace.className);
		    }
		    loader.parentNode.insertBefore(loader, buttonToReplace);
		    addClass([popup, actions], swalClasses.loading);
		  };

		  /**
		   * @typedef { string | number | boolean } InputValue
		   */

		  /**
		   * @param {SweetAlert} instance
		   * @param {SweetAlertOptions} params
		   */
		  const handleInputOptionsAndValue = (instance, params) => {
		    if (params.input === 'select' || params.input === 'radio') {
		      handleInputOptions(instance, params);
		    } else if (['text', 'email', 'number', 'tel', 'textarea'].includes(params.input) && (hasToPromiseFn(params.inputValue) || isPromise(params.inputValue))) {
		      showLoading(getConfirmButton());
		      handleInputValue(instance, params);
		    }
		  };

		  /**
		   * @param {SweetAlert} instance
		   * @param {SweetAlertOptions} innerParams
		   * @returns {string | number | File | FileList | null}
		   */
		  const getInputValue = (instance, innerParams) => {
		    const input = instance.getInput();
		    if (!input) {
		      return null;
		    }
		    switch (innerParams.input) {
		      case 'checkbox':
		        return getCheckboxValue(input);
		      case 'radio':
		        return getRadioValue(input);
		      case 'file':
		        return getFileValue(input);
		      default:
		        return innerParams.inputAutoTrim ? input.value.trim() : input.value;
		    }
		  };

		  /**
		   * @param {HTMLInputElement} input
		   * @returns {number}
		   */
		  const getCheckboxValue = input => input.checked ? 1 : 0;

		  /**
		   * @param {HTMLInputElement} input
		   * @returns {string | null}
		   */
		  const getRadioValue = input => input.checked ? input.value : null;

		  /**
		   * @param {HTMLInputElement} input
		   * @returns {FileList | File | null}
		   */
		  const getFileValue = input => input.files.length ? input.getAttribute('multiple') !== null ? input.files : input.files[0] : null;

		  /**
		   * @param {SweetAlert} instance
		   * @param {SweetAlertOptions} params
		   */
		  const handleInputOptions = (instance, params) => {
		    const popup = getPopup();
		    /**
		     * @param {Record<string, any>} inputOptions
		     */
		    const processInputOptions = inputOptions => {
		      populateInputOptions[params.input](popup, formatInputOptions(inputOptions), params);
		    };
		    if (hasToPromiseFn(params.inputOptions) || isPromise(params.inputOptions)) {
		      showLoading(getConfirmButton());
		      asPromise(params.inputOptions).then(inputOptions => {
		        instance.hideLoading();
		        processInputOptions(inputOptions);
		      });
		    } else if (typeof params.inputOptions === 'object') {
		      processInputOptions(params.inputOptions);
		    } else {
		      error(`Unexpected type of inputOptions! Expected object, Map or Promise, got ${typeof params.inputOptions}`);
		    }
		  };

		  /**
		   * @param {SweetAlert} instance
		   * @param {SweetAlertOptions} params
		   */
		  const handleInputValue = (instance, params) => {
		    const input = instance.getInput();
		    hide(input);
		    asPromise(params.inputValue).then(inputValue => {
		      input.value = params.input === 'number' ? `${parseFloat(inputValue) || 0}` : `${inputValue}`;
		      show(input);
		      input.focus();
		      instance.hideLoading();
		    }).catch(err => {
		      error(`Error in inputValue promise: ${err}`);
		      input.value = '';
		      show(input);
		      input.focus();
		      instance.hideLoading();
		    });
		  };
		  const populateInputOptions = {
		    /**
		     * @param {HTMLElement} popup
		     * @param {Record<string, any>} inputOptions
		     * @param {SweetAlertOptions} params
		     */
		    select: (popup, inputOptions, params) => {
		      const select = getDirectChildByClass(popup, swalClasses.select);
		      /**
		       * @param {HTMLElement} parent
		       * @param {string} optionLabel
		       * @param {string} optionValue
		       */
		      const renderOption = (parent, optionLabel, optionValue) => {
		        const option = document.createElement('option');
		        option.value = optionValue;
		        setInnerHtml(option, optionLabel);
		        option.selected = isSelected(optionValue, params.inputValue);
		        parent.appendChild(option);
		      };
		      inputOptions.forEach(inputOption => {
		        const optionValue = inputOption[0];
		        const optionLabel = inputOption[1];
		        // <optgroup> spec:
		        // https://www.w3.org/TR/html401/interact/forms.html#h-17.6
		        // "...all OPTGROUP elements must be specified directly within a SELECT element (i.e., groups may not be nested)..."
		        // check whether this is a <optgroup>
		        if (Array.isArray(optionLabel)) {
		          // if it is an array, then it is an <optgroup>
		          const optgroup = document.createElement('optgroup');
		          optgroup.label = optionValue;
		          optgroup.disabled = false; // not configurable for now
		          select.appendChild(optgroup);
		          optionLabel.forEach(o => renderOption(optgroup, o[1], o[0]));
		        } else {
		          // case of <option>
		          renderOption(select, optionLabel, optionValue);
		        }
		      });
		      select.focus();
		    },
		    /**
		     * @param {HTMLElement} popup
		     * @param {Record<string, any>} inputOptions
		     * @param {SweetAlertOptions} params
		     */
		    radio: (popup, inputOptions, params) => {
		      const radio = getDirectChildByClass(popup, swalClasses.radio);
		      inputOptions.forEach(inputOption => {
		        const radioValue = inputOption[0];
		        const radioLabel = inputOption[1];
		        const radioInput = document.createElement('input');
		        const radioLabelElement = document.createElement('label');
		        radioInput.type = 'radio';
		        radioInput.name = swalClasses.radio;
		        radioInput.value = radioValue;
		        if (isSelected(radioValue, params.inputValue)) {
		          radioInput.checked = true;
		        }
		        const label = document.createElement('span');
		        setInnerHtml(label, radioLabel);
		        label.className = swalClasses.label;
		        radioLabelElement.appendChild(radioInput);
		        radioLabelElement.appendChild(label);
		        radio.appendChild(radioLabelElement);
		      });
		      const radios = radio.querySelectorAll('input');
		      if (radios.length) {
		        radios[0].focus();
		      }
		    }
		  };

		  /**
		   * Converts `inputOptions` into an array of `[value, label]`s
		   *
		   * @param {Record<string, any>} inputOptions
		   * @returns {Array<Array<string>>}
		   */
		  const formatInputOptions = inputOptions => {
		    const result = [];
		    if (typeof Map !== 'undefined' && inputOptions instanceof Map) {
		      inputOptions.forEach((value, key) => {
		        let valueFormatted = value;
		        if (typeof valueFormatted === 'object') {
		          // case of <optgroup>
		          valueFormatted = formatInputOptions(valueFormatted);
		        }
		        result.push([key, valueFormatted]);
		      });
		    } else {
		      Object.keys(inputOptions).forEach(key => {
		        let valueFormatted = inputOptions[key];
		        if (typeof valueFormatted === 'object') {
		          // case of <optgroup>
		          valueFormatted = formatInputOptions(valueFormatted);
		        }
		        result.push([key, valueFormatted]);
		      });
		    }
		    return result;
		  };

		  /**
		   * @param {string} optionValue
		   * @param {InputValue | Promise<InputValue> | { toPromise: () => InputValue }} inputValue
		   * @returns {boolean}
		   */
		  const isSelected = (optionValue, inputValue) => {
		    return inputValue && inputValue.toString() === optionValue.toString();
		  };

		  /**
		   * @param {SweetAlert} instance
		   */
		  const handleConfirmButtonClick = instance => {
		    const innerParams = privateProps.innerParams.get(instance);
		    instance.disableButtons();
		    if (innerParams.input) {
		      handleConfirmOrDenyWithInput(instance, 'confirm');
		    } else {
		      confirm(instance, true);
		    }
		  };

		  /**
		   * @param {SweetAlert} instance
		   */
		  const handleDenyButtonClick = instance => {
		    const innerParams = privateProps.innerParams.get(instance);
		    instance.disableButtons();
		    if (innerParams.returnInputValueOnDeny) {
		      handleConfirmOrDenyWithInput(instance, 'deny');
		    } else {
		      deny(instance, false);
		    }
		  };

		  /**
		   * @param {SweetAlert} instance
		   * @param {Function} dismissWith
		   */
		  const handleCancelButtonClick = (instance, dismissWith) => {
		    instance.disableButtons();
		    dismissWith(DismissReason.cancel);
		  };

		  /**
		   * @param {SweetAlert} instance
		   * @param {'confirm' | 'deny'} type
		   */
		  const handleConfirmOrDenyWithInput = (instance, type) => {
		    const innerParams = privateProps.innerParams.get(instance);
		    if (!innerParams.input) {
		      error(`The "input" parameter is needed to be set when using returnInputValueOn${capitalizeFirstLetter(type)}`);
		      return;
		    }
		    const inputValue = getInputValue(instance, innerParams);
		    if (innerParams.inputValidator) {
		      handleInputValidator(instance, inputValue, type);
		    } else if (!instance.getInput().checkValidity()) {
		      instance.enableButtons();
		      instance.showValidationMessage(innerParams.validationMessage);
		    } else if (type === 'deny') {
		      deny(instance, inputValue);
		    } else {
		      confirm(instance, inputValue);
		    }
		  };

		  /**
		   * @param {SweetAlert} instance
		   * @param {string | number | File | FileList | null} inputValue
		   * @param {'confirm' | 'deny'} type
		   */
		  const handleInputValidator = (instance, inputValue, type) => {
		    const innerParams = privateProps.innerParams.get(instance);
		    instance.disableInput();
		    const validationPromise = Promise.resolve().then(() => asPromise(innerParams.inputValidator(inputValue, innerParams.validationMessage)));
		    validationPromise.then(validationMessage => {
		      instance.enableButtons();
		      instance.enableInput();
		      if (validationMessage) {
		        instance.showValidationMessage(validationMessage);
		      } else if (type === 'deny') {
		        deny(instance, inputValue);
		      } else {
		        confirm(instance, inputValue);
		      }
		    });
		  };

		  /**
		   * @param {SweetAlert} instance
		   * @param {any} value
		   */
		  const deny = (instance, value) => {
		    const innerParams = privateProps.innerParams.get(instance || undefined);
		    if (innerParams.showLoaderOnDeny) {
		      showLoading(getDenyButton());
		    }
		    if (innerParams.preDeny) {
		      instance.isAwaitingPromise = true; // Flagging the instance as awaiting a promise so it's own promise's reject/resolve methods doesn't get destroyed until the result from this preDeny's promise is received
		      const preDenyPromise = Promise.resolve().then(() => asPromise(innerParams.preDeny(value, innerParams.validationMessage)));
		      preDenyPromise.then(preDenyValue => {
		        if (preDenyValue === false) {
		          instance.hideLoading();
		          handleAwaitingPromise(instance);
		        } else {
		          instance.close({
		            isDenied: true,
		            value: typeof preDenyValue === 'undefined' ? value : preDenyValue
		          });
		        }
		      }).catch(error => rejectWith(instance || undefined, error));
		    } else {
		      instance.close({
		        isDenied: true,
		        value
		      });
		    }
		  };

		  /**
		   * @param {SweetAlert} instance
		   * @param {any} value
		   */
		  const succeedWith = (instance, value) => {
		    instance.close({
		      isConfirmed: true,
		      value
		    });
		  };

		  /**
		   *
		   * @param {SweetAlert} instance
		   * @param {string} error
		   */
		  const rejectWith = (instance, error) => {
		    instance.rejectPromise(error);
		  };

		  /**
		   *
		   * @param {SweetAlert} instance
		   * @param {any} value
		   */
		  const confirm = (instance, value) => {
		    const innerParams = privateProps.innerParams.get(instance || undefined);
		    if (innerParams.showLoaderOnConfirm) {
		      showLoading();
		    }
		    if (innerParams.preConfirm) {
		      instance.resetValidationMessage();
		      instance.isAwaitingPromise = true; // Flagging the instance as awaiting a promise so it's own promise's reject/resolve methods doesn't get destroyed until the result from this preConfirm's promise is received
		      const preConfirmPromise = Promise.resolve().then(() => asPromise(innerParams.preConfirm(value, innerParams.validationMessage)));
		      preConfirmPromise.then(preConfirmValue => {
		        if (isVisible$1(getValidationMessage()) || preConfirmValue === false) {
		          instance.hideLoading();
		          handleAwaitingPromise(instance);
		        } else {
		          succeedWith(instance, typeof preConfirmValue === 'undefined' ? value : preConfirmValue);
		        }
		      }).catch(error => rejectWith(instance || undefined, error));
		    } else {
		      succeedWith(instance, value);
		    }
		  };

		  /**
		   * Hides loader and shows back the button which was hidden by .showLoading()
		   */
		  function hideLoading() {
		    // do nothing if popup is closed
		    const innerParams = privateProps.innerParams.get(this);
		    if (!innerParams) {
		      return;
		    }
		    const domCache = privateProps.domCache.get(this);
		    hide(domCache.loader);
		    if (isToast()) {
		      if (innerParams.icon) {
		        show(getIcon());
		      }
		    } else {
		      showRelatedButton(domCache);
		    }
		    removeClass([domCache.popup, domCache.actions], swalClasses.loading);
		    domCache.popup.removeAttribute('aria-busy');
		    domCache.popup.removeAttribute('data-loading');
		    domCache.confirmButton.disabled = false;
		    domCache.denyButton.disabled = false;
		    domCache.cancelButton.disabled = false;
		  }
		  const showRelatedButton = domCache => {
		    const buttonToReplace = domCache.popup.getElementsByClassName(domCache.loader.getAttribute('data-button-to-replace'));
		    if (buttonToReplace.length) {
		      show(buttonToReplace[0], 'inline-block');
		    } else if (allButtonsAreHidden()) {
		      hide(domCache.actions);
		    }
		  };

		  /**
		   * Gets the input DOM node, this method works with input parameter.
		   *
		   * @returns {HTMLInputElement | null}
		   */
		  function getInput() {
		    const innerParams = privateProps.innerParams.get(this);
		    const domCache = privateProps.domCache.get(this);
		    if (!domCache) {
		      return null;
		    }
		    return getInput$1(domCache.popup, innerParams.input);
		  }

		  /**
		   * @param {SweetAlert} instance
		   * @param {string[]} buttons
		   * @param {boolean} disabled
		   */
		  function setButtonsDisabled(instance, buttons, disabled) {
		    const domCache = privateProps.domCache.get(instance);
		    buttons.forEach(button => {
		      domCache[button].disabled = disabled;
		    });
		  }

		  /**
		   * @param {HTMLInputElement} input
		   * @param {boolean} disabled
		   */
		  function setInputDisabled(input, disabled) {
		    if (!input) {
		      return;
		    }
		    if (input.type === 'radio') {
		      const radiosContainer = input.parentNode.parentNode;
		      const radios = radiosContainer.querySelectorAll('input');
		      for (let i = 0; i < radios.length; i++) {
		        radios[i].disabled = disabled;
		      }
		    } else {
		      input.disabled = disabled;
		    }
		  }

		  /**
		   * Enable all the buttons
		   */
		  function enableButtons() {
		    setButtonsDisabled(this, ['confirmButton', 'denyButton', 'cancelButton'], false);
		  }

		  /**
		   * Disable all the buttons
		   */
		  function disableButtons() {
		    setButtonsDisabled(this, ['confirmButton', 'denyButton', 'cancelButton'], true);
		  }

		  /**
		   * Enable the input field
		   */
		  function enableInput() {
		    setInputDisabled(this.getInput(), false);
		  }

		  /**
		   * Disable the input field
		   */
		  function disableInput() {
		    setInputDisabled(this.getInput(), true);
		  }

		  /**
		   * Show block with validation message
		   *
		   * @param {string} error
		   */
		  function showValidationMessage(error) {
		    const domCache = privateProps.domCache.get(this);
		    const params = privateProps.innerParams.get(this);
		    setInnerHtml(domCache.validationMessage, error);
		    domCache.validationMessage.className = swalClasses['validation-message'];
		    if (params.customClass && params.customClass.validationMessage) {
		      addClass(domCache.validationMessage, params.customClass.validationMessage);
		    }
		    show(domCache.validationMessage);
		    const input = this.getInput();
		    if (input) {
		      input.setAttribute('aria-invalid', true);
		      input.setAttribute('aria-describedby', swalClasses['validation-message']);
		      focusInput(input);
		      addClass(input, swalClasses.inputerror);
		    }
		  }

		  /**
		   * Hide block with validation message
		   */
		  function resetValidationMessage() {
		    const domCache = privateProps.domCache.get(this);
		    if (domCache.validationMessage) {
		      hide(domCache.validationMessage);
		    }
		    const input = this.getInput();
		    if (input) {
		      input.removeAttribute('aria-invalid');
		      input.removeAttribute('aria-describedby');
		      removeClass(input, swalClasses.inputerror);
		    }
		  }

		  const defaultParams = {
		    title: '',
		    titleText: '',
		    text: '',
		    html: '',
		    footer: '',
		    icon: undefined,
		    iconColor: undefined,
		    iconHtml: undefined,
		    template: undefined,
		    toast: false,
		    showClass: {
		      popup: 'swal2-show',
		      backdrop: 'swal2-backdrop-show',
		      icon: 'swal2-icon-show'
		    },
		    hideClass: {
		      popup: 'swal2-hide',
		      backdrop: 'swal2-backdrop-hide',
		      icon: 'swal2-icon-hide'
		    },
		    customClass: {},
		    target: 'body',
		    color: undefined,
		    backdrop: true,
		    heightAuto: true,
		    allowOutsideClick: true,
		    allowEscapeKey: true,
		    allowEnterKey: true,
		    stopKeydownPropagation: true,
		    keydownListenerCapture: false,
		    showConfirmButton: true,
		    showDenyButton: false,
		    showCancelButton: false,
		    preConfirm: undefined,
		    preDeny: undefined,
		    confirmButtonText: 'OK',
		    confirmButtonAriaLabel: '',
		    confirmButtonColor: undefined,
		    denyButtonText: 'No',
		    denyButtonAriaLabel: '',
		    denyButtonColor: undefined,
		    cancelButtonText: 'Cancel',
		    cancelButtonAriaLabel: '',
		    cancelButtonColor: undefined,
		    buttonsStyling: true,
		    reverseButtons: false,
		    focusConfirm: true,
		    focusDeny: false,
		    focusCancel: false,
		    returnFocus: true,
		    showCloseButton: false,
		    closeButtonHtml: '&times;',
		    closeButtonAriaLabel: 'Close this dialog',
		    loaderHtml: '',
		    showLoaderOnConfirm: false,
		    showLoaderOnDeny: false,
		    imageUrl: undefined,
		    imageWidth: undefined,
		    imageHeight: undefined,
		    imageAlt: '',
		    timer: undefined,
		    timerProgressBar: false,
		    width: undefined,
		    padding: undefined,
		    background: undefined,
		    input: undefined,
		    inputPlaceholder: '',
		    inputLabel: '',
		    inputValue: '',
		    inputOptions: {},
		    inputAutoFocus: true,
		    inputAutoTrim: true,
		    inputAttributes: {},
		    inputValidator: undefined,
		    returnInputValueOnDeny: false,
		    validationMessage: undefined,
		    grow: false,
		    position: 'center',
		    progressSteps: [],
		    currentProgressStep: undefined,
		    progressStepsDistance: undefined,
		    willOpen: undefined,
		    didOpen: undefined,
		    didRender: undefined,
		    willClose: undefined,
		    didClose: undefined,
		    didDestroy: undefined,
		    scrollbarPadding: true
		  };
		  const updatableParams = ['allowEscapeKey', 'allowOutsideClick', 'background', 'buttonsStyling', 'cancelButtonAriaLabel', 'cancelButtonColor', 'cancelButtonText', 'closeButtonAriaLabel', 'closeButtonHtml', 'color', 'confirmButtonAriaLabel', 'confirmButtonColor', 'confirmButtonText', 'currentProgressStep', 'customClass', 'denyButtonAriaLabel', 'denyButtonColor', 'denyButtonText', 'didClose', 'didDestroy', 'footer', 'hideClass', 'html', 'icon', 'iconColor', 'iconHtml', 'imageAlt', 'imageHeight', 'imageUrl', 'imageWidth', 'preConfirm', 'preDeny', 'progressSteps', 'returnFocus', 'reverseButtons', 'showCancelButton', 'showCloseButton', 'showConfirmButton', 'showDenyButton', 'text', 'title', 'titleText', 'willClose'];

		  /** @type {Record<string, string>} */
		  const deprecatedParams = {};
		  const toastIncompatibleParams = ['allowOutsideClick', 'allowEnterKey', 'backdrop', 'focusConfirm', 'focusDeny', 'focusCancel', 'returnFocus', 'heightAuto', 'keydownListenerCapture'];

		  /**
		   * Is valid parameter
		   *
		   * @param {string} paramName
		   * @returns {boolean}
		   */
		  const isValidParameter = paramName => {
		    return Object.prototype.hasOwnProperty.call(defaultParams, paramName);
		  };

		  /**
		   * Is valid parameter for Swal.update() method
		   *
		   * @param {string} paramName
		   * @returns {boolean}
		   */
		  const isUpdatableParameter = paramName => {
		    return updatableParams.indexOf(paramName) !== -1;
		  };

		  /**
		   * Is deprecated parameter
		   *
		   * @param {string} paramName
		   * @returns {string | undefined}
		   */
		  const isDeprecatedParameter = paramName => {
		    return deprecatedParams[paramName];
		  };

		  /**
		   * @param {string} param
		   */
		  const checkIfParamIsValid = param => {
		    if (!isValidParameter(param)) {
		      warn(`Unknown parameter "${param}"`);
		    }
		  };

		  /**
		   * @param {string} param
		   */
		  const checkIfToastParamIsValid = param => {
		    if (toastIncompatibleParams.includes(param)) {
		      warn(`The parameter "${param}" is incompatible with toasts`);
		    }
		  };

		  /**
		   * @param {string} param
		   */
		  const checkIfParamIsDeprecated = param => {
		    const isDeprecated = isDeprecatedParameter(param);
		    if (isDeprecated) {
		      warnAboutDeprecation(param, isDeprecated);
		    }
		  };

		  /**
		   * Show relevant warnings for given params
		   *
		   * @param {SweetAlertOptions} params
		   */
		  const showWarningsForParams = params => {
		    if (params.backdrop === false && params.allowOutsideClick) {
		      warn('"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`');
		    }
		    for (const param in params) {
		      checkIfParamIsValid(param);
		      if (params.toast) {
		        checkIfToastParamIsValid(param);
		      }
		      checkIfParamIsDeprecated(param);
		    }
		  };

		  /**
		   * Updates popup parameters.
		   *
		   * @param {SweetAlertOptions} params
		   */
		  function update(params) {
		    const popup = getPopup();
		    const innerParams = privateProps.innerParams.get(this);
		    if (!popup || hasClass(popup, innerParams.hideClass.popup)) {
		      warn(`You're trying to update the closed or closing popup, that won't work. Use the update() method in preConfirm parameter or show a new popup.`);
		      return;
		    }
		    const validUpdatableParams = filterValidParams(params);
		    const updatedParams = Object.assign({}, innerParams, validUpdatableParams);
		    render(this, updatedParams);
		    privateProps.innerParams.set(this, updatedParams);
		    Object.defineProperties(this, {
		      params: {
		        value: Object.assign({}, this.params, params),
		        writable: false,
		        enumerable: true
		      }
		    });
		  }

		  /**
		   * @param {SweetAlertOptions} params
		   * @returns {SweetAlertOptions}
		   */
		  const filterValidParams = params => {
		    const validUpdatableParams = {};
		    Object.keys(params).forEach(param => {
		      if (isUpdatableParameter(param)) {
		        validUpdatableParams[param] = params[param];
		      } else {
		        warn(`Invalid parameter to update: ${param}`);
		      }
		    });
		    return validUpdatableParams;
		  };

		  /**
		   * Dispose the current SweetAlert2 instance
		   */
		  function _destroy() {
		    const domCache = privateProps.domCache.get(this);
		    const innerParams = privateProps.innerParams.get(this);
		    if (!innerParams) {
		      disposeWeakMaps(this); // The WeakMaps might have been partly destroyed, we must recall it to dispose any remaining WeakMaps #2335
		      return; // This instance has already been destroyed
		    }

		    // Check if there is another Swal closing
		    if (domCache.popup && globalState.swalCloseEventFinishedCallback) {
		      globalState.swalCloseEventFinishedCallback();
		      delete globalState.swalCloseEventFinishedCallback;
		    }
		    if (typeof innerParams.didDestroy === 'function') {
		      innerParams.didDestroy();
		    }
		    disposeSwal(this);
		  }

		  /**
		   * @param {SweetAlert} instance
		   */
		  const disposeSwal = instance => {
		    disposeWeakMaps(instance);
		    // Unset this.params so GC will dispose it (#1569)
		    delete instance.params;
		    // Unset globalState props so GC will dispose globalState (#1569)
		    delete globalState.keydownHandler;
		    delete globalState.keydownTarget;
		    // Unset currentInstance
		    delete globalState.currentInstance;
		  };

		  /**
		   * @param {SweetAlert} instance
		   */
		  const disposeWeakMaps = instance => {
		    // If the current instance is awaiting a promise result, we keep the privateMethods to call them once the promise result is retrieved #2335
		    if (instance.isAwaitingPromise) {
		      unsetWeakMaps(privateProps, instance);
		      instance.isAwaitingPromise = true;
		    } else {
		      unsetWeakMaps(privateMethods, instance);
		      unsetWeakMaps(privateProps, instance);
		      delete instance.isAwaitingPromise;
		      // Unset instance methods
		      delete instance.disableButtons;
		      delete instance.enableButtons;
		      delete instance.getInput;
		      delete instance.disableInput;
		      delete instance.enableInput;
		      delete instance.hideLoading;
		      delete instance.disableLoading;
		      delete instance.showValidationMessage;
		      delete instance.resetValidationMessage;
		      delete instance.close;
		      delete instance.closePopup;
		      delete instance.closeModal;
		      delete instance.closeToast;
		      delete instance.rejectPromise;
		      delete instance.update;
		      delete instance._destroy;
		    }
		  };

		  /**
		   * @param {object} obj
		   * @param {SweetAlert} instance
		   */
		  const unsetWeakMaps = (obj, instance) => {
		    for (const i in obj) {
		      obj[i].delete(instance);
		    }
		  };

		  var instanceMethods = /*#__PURE__*/Object.freeze({
		    __proto__: null,
		    _destroy: _destroy,
		    close: close,
		    closeModal: close,
		    closePopup: close,
		    closeToast: close,
		    disableButtons: disableButtons,
		    disableInput: disableInput,
		    disableLoading: hideLoading,
		    enableButtons: enableButtons,
		    enableInput: enableInput,
		    getInput: getInput,
		    handleAwaitingPromise: handleAwaitingPromise,
		    hideLoading: hideLoading,
		    rejectPromise: rejectPromise,
		    resetValidationMessage: resetValidationMessage,
		    showValidationMessage: showValidationMessage,
		    update: update
		  });

		  const handlePopupClick = (instance, domCache, dismissWith) => {
		    const innerParams = privateProps.innerParams.get(instance);
		    if (innerParams.toast) {
		      handleToastClick(instance, domCache, dismissWith);
		    } else {
		      // Ignore click events that had mousedown on the popup but mouseup on the container
		      // This can happen when the user drags a slider
		      handleModalMousedown(domCache);

		      // Ignore click events that had mousedown on the container but mouseup on the popup
		      handleContainerMousedown(domCache);
		      handleModalClick(instance, domCache, dismissWith);
		    }
		  };
		  const handleToastClick = (instance, domCache, dismissWith) => {
		    // Closing toast by internal click
		    domCache.popup.onclick = () => {
		      const innerParams = privateProps.innerParams.get(instance);
		      if (innerParams && (isAnyButtonShown(innerParams) || innerParams.timer || innerParams.input)) {
		        return;
		      }
		      dismissWith(DismissReason.close);
		    };
		  };

		  /**
		   * @param {*} innerParams
		   * @returns {boolean}
		   */
		  const isAnyButtonShown = innerParams => {
		    return innerParams.showConfirmButton || innerParams.showDenyButton || innerParams.showCancelButton || innerParams.showCloseButton;
		  };
		  let ignoreOutsideClick = false;
		  const handleModalMousedown = domCache => {
		    domCache.popup.onmousedown = () => {
		      domCache.container.onmouseup = function (e) {
		        domCache.container.onmouseup = undefined;
		        // We only check if the mouseup target is the container because usually it doesn't
		        // have any other direct children aside of the popup
		        if (e.target === domCache.container) {
		          ignoreOutsideClick = true;
		        }
		      };
		    };
		  };
		  const handleContainerMousedown = domCache => {
		    domCache.container.onmousedown = () => {
		      domCache.popup.onmouseup = function (e) {
		        domCache.popup.onmouseup = undefined;
		        // We also need to check if the mouseup target is a child of the popup
		        if (e.target === domCache.popup || domCache.popup.contains(e.target)) {
		          ignoreOutsideClick = true;
		        }
		      };
		    };
		  };
		  const handleModalClick = (instance, domCache, dismissWith) => {
		    domCache.container.onclick = e => {
		      const innerParams = privateProps.innerParams.get(instance);
		      if (ignoreOutsideClick) {
		        ignoreOutsideClick = false;
		        return;
		      }
		      if (e.target === domCache.container && callIfFunction(innerParams.allowOutsideClick)) {
		        dismissWith(DismissReason.backdrop);
		      }
		    };
		  };

		  const isJqueryElement = elem => typeof elem === 'object' && elem.jquery;
		  const isElement = elem => elem instanceof Element || isJqueryElement(elem);
		  const argsToParams = args => {
		    const params = {};
		    if (typeof args[0] === 'object' && !isElement(args[0])) {
		      Object.assign(params, args[0]);
		    } else {
		      ['title', 'html', 'icon'].forEach((name, index) => {
		        const arg = args[index];
		        if (typeof arg === 'string' || isElement(arg)) {
		          params[name] = arg;
		        } else if (arg !== undefined) {
		          error(`Unexpected type of ${name}! Expected "string" or "Element", got ${typeof arg}`);
		        }
		      });
		    }
		    return params;
		  };

		  /**
		   * Main method to create a new SweetAlert2 popup
		   *
		   * @param  {...SweetAlertOptions} args
		   * @returns {Promise<SweetAlertResult>}
		   */
		  function fire() {
		    const Swal = this; // eslint-disable-line @typescript-eslint/no-this-alias
		    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
		      args[_key] = arguments[_key];
		    }
		    return new Swal(...args);
		  }

		  /**
		   * Returns an extended version of `Swal` containing `params` as defaults.
		   * Useful for reusing Swal configuration.
		   *
		   * For example:
		   *
		   * Before:
		   * const textPromptOptions = { input: 'text', showCancelButton: true }
		   * const {value: firstName} = await Swal.fire({ ...textPromptOptions, title: 'What is your first name?' })
		   * const {value: lastName} = await Swal.fire({ ...textPromptOptions, title: 'What is your last name?' })
		   *
		   * After:
		   * const TextPrompt = Swal.mixin({ input: 'text', showCancelButton: true })
		   * const {value: firstName} = await TextPrompt('What is your first name?')
		   * const {value: lastName} = await TextPrompt('What is your last name?')
		   *
		   * @param {SweetAlertOptions} mixinParams
		   * @returns {SweetAlert}
		   */
		  function mixin(mixinParams) {
		    class MixinSwal extends this {
		      _main(params, priorityMixinParams) {
		        return super._main(params, Object.assign({}, mixinParams, priorityMixinParams));
		      }
		    }
		    // @ts-ignore
		    return MixinSwal;
		  }

		  /**
		   * If `timer` parameter is set, returns number of milliseconds of timer remained.
		   * Otherwise, returns undefined.
		   *
		   * @returns {number | undefined}
		   */
		  const getTimerLeft = () => {
		    return globalState.timeout && globalState.timeout.getTimerLeft();
		  };

		  /**
		   * Stop timer. Returns number of milliseconds of timer remained.
		   * If `timer` parameter isn't set, returns undefined.
		   *
		   * @returns {number | undefined}
		   */
		  const stopTimer = () => {
		    if (globalState.timeout) {
		      stopTimerProgressBar();
		      return globalState.timeout.stop();
		    }
		  };

		  /**
		   * Resume timer. Returns number of milliseconds of timer remained.
		   * If `timer` parameter isn't set, returns undefined.
		   *
		   * @returns {number | undefined}
		   */
		  const resumeTimer = () => {
		    if (globalState.timeout) {
		      const remaining = globalState.timeout.start();
		      animateTimerProgressBar(remaining);
		      return remaining;
		    }
		  };

		  /**
		   * Resume timer. Returns number of milliseconds of timer remained.
		   * If `timer` parameter isn't set, returns undefined.
		   *
		   * @returns {number | undefined}
		   */
		  const toggleTimer = () => {
		    const timer = globalState.timeout;
		    return timer && (timer.running ? stopTimer() : resumeTimer());
		  };

		  /**
		   * Increase timer. Returns number of milliseconds of an updated timer.
		   * If `timer` parameter isn't set, returns undefined.
		   *
		   * @param {number} n
		   * @returns {number | undefined}
		   */
		  const increaseTimer = n => {
		    if (globalState.timeout) {
		      const remaining = globalState.timeout.increase(n);
		      animateTimerProgressBar(remaining, true);
		      return remaining;
		    }
		  };

		  /**
		   * Check if timer is running. Returns true if timer is running
		   * or false if timer is paused or stopped.
		   * If `timer` parameter isn't set, returns undefined
		   *
		   * @returns {boolean}
		   */
		  const isTimerRunning = () => {
		    return !!(globalState.timeout && globalState.timeout.isRunning());
		  };

		  let bodyClickListenerAdded = false;
		  const clickHandlers = {};

		  /**
		   * @param {string} attr
		   */
		  function bindClickHandler() {
		    let attr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'data-swal-template';
		    clickHandlers[attr] = this;
		    if (!bodyClickListenerAdded) {
		      document.body.addEventListener('click', bodyClickListener);
		      bodyClickListenerAdded = true;
		    }
		  }
		  const bodyClickListener = event => {
		    for (let el = event.target; el && el !== document; el = el.parentNode) {
		      for (const attr in clickHandlers) {
		        const template = el.getAttribute(attr);
		        if (template) {
		          clickHandlers[attr].fire({
		            template
		          });
		          return;
		        }
		      }
		    }
		  };

		  var staticMethods = /*#__PURE__*/Object.freeze({
		    __proto__: null,
		    argsToParams: argsToParams,
		    bindClickHandler: bindClickHandler,
		    clickCancel: clickCancel,
		    clickConfirm: clickConfirm,
		    clickDeny: clickDeny,
		    enableLoading: showLoading,
		    fire: fire,
		    getActions: getActions,
		    getCancelButton: getCancelButton,
		    getCloseButton: getCloseButton,
		    getConfirmButton: getConfirmButton,
		    getContainer: getContainer,
		    getDenyButton: getDenyButton,
		    getFocusableElements: getFocusableElements,
		    getFooter: getFooter,
		    getHtmlContainer: getHtmlContainer,
		    getIcon: getIcon,
		    getIconContent: getIconContent,
		    getImage: getImage,
		    getInputLabel: getInputLabel,
		    getLoader: getLoader,
		    getPopup: getPopup,
		    getProgressSteps: getProgressSteps,
		    getTimerLeft: getTimerLeft,
		    getTimerProgressBar: getTimerProgressBar,
		    getTitle: getTitle,
		    getValidationMessage: getValidationMessage,
		    increaseTimer: increaseTimer,
		    isDeprecatedParameter: isDeprecatedParameter,
		    isLoading: isLoading,
		    isTimerRunning: isTimerRunning,
		    isUpdatableParameter: isUpdatableParameter,
		    isValidParameter: isValidParameter,
		    isVisible: isVisible,
		    mixin: mixin,
		    resumeTimer: resumeTimer,
		    showLoading: showLoading,
		    stopTimer: stopTimer,
		    toggleTimer: toggleTimer
		  });

		  class Timer {
		    /**
		     * @param {Function} callback
		     * @param {number} delay
		     */
		    constructor(callback, delay) {
		      this.callback = callback;
		      this.remaining = delay;
		      this.running = false;
		      this.start();
		    }

		    /**
		     * @returns {number}
		     */
		    start() {
		      if (!this.running) {
		        this.running = true;
		        this.started = new Date();
		        this.id = setTimeout(this.callback, this.remaining);
		      }
		      return this.remaining;
		    }

		    /**
		     * @returns {number}
		     */
		    stop() {
		      if (this.started && this.running) {
		        this.running = false;
		        clearTimeout(this.id);
		        this.remaining -= new Date().getTime() - this.started.getTime();
		      }
		      return this.remaining;
		    }

		    /**
		     * @param {number} n
		     * @returns {number}
		     */
		    increase(n) {
		      const running = this.running;
		      if (running) {
		        this.stop();
		      }
		      this.remaining += n;
		      if (running) {
		        this.start();
		      }
		      return this.remaining;
		    }

		    /**
		     * @returns {number}
		     */
		    getTimerLeft() {
		      if (this.running) {
		        this.stop();
		        this.start();
		      }
		      return this.remaining;
		    }

		    /**
		     * @returns {boolean}
		     */
		    isRunning() {
		      return this.running;
		    }
		  }

		  const swalStringParams = ['swal-title', 'swal-html', 'swal-footer'];

		  /**
		   * @param {SweetAlertOptions} params
		   * @returns {SweetAlertOptions}
		   */
		  const getTemplateParams = params => {
		    /** @type {HTMLTemplateElement} */
		    const template = typeof params.template === 'string' ? document.querySelector(params.template) : params.template;
		    if (!template) {
		      return {};
		    }
		    /** @type {DocumentFragment} */
		    const templateContent = template.content;
		    showWarningsForElements(templateContent);
		    const result = Object.assign(getSwalParams(templateContent), getSwalFunctionParams(templateContent), getSwalButtons(templateContent), getSwalImage(templateContent), getSwalIcon(templateContent), getSwalInput(templateContent), getSwalStringParams(templateContent, swalStringParams));
		    return result;
		  };

		  /**
		   * @param {DocumentFragment} templateContent
		   * @returns {SweetAlertOptions}
		   */
		  const getSwalParams = templateContent => {
		    const result = {};
		    /** @type {HTMLElement[]} */
		    const swalParams = Array.from(templateContent.querySelectorAll('swal-param'));
		    swalParams.forEach(param => {
		      showWarningsForAttributes(param, ['name', 'value']);
		      const paramName = param.getAttribute('name');
		      const value = param.getAttribute('value');
		      if (typeof defaultParams[paramName] === 'boolean') {
		        result[paramName] = value !== 'false';
		      } else if (typeof defaultParams[paramName] === 'object') {
		        result[paramName] = JSON.parse(value);
		      } else {
		        result[paramName] = value;
		      }
		    });
		    return result;
		  };

		  /**
		   * @param {DocumentFragment} templateContent
		   * @returns {SweetAlertOptions}
		   */
		  const getSwalFunctionParams = templateContent => {
		    const result = {};
		    /** @type {HTMLElement[]} */
		    const swalFunctions = Array.from(templateContent.querySelectorAll('swal-function-param'));
		    swalFunctions.forEach(param => {
		      const paramName = param.getAttribute('name');
		      const value = param.getAttribute('value');
		      result[paramName] = new Function(`return ${value}`)();
		    });
		    return result;
		  };

		  /**
		   * @param {DocumentFragment} templateContent
		   * @returns {SweetAlertOptions}
		   */
		  const getSwalButtons = templateContent => {
		    const result = {};
		    /** @type {HTMLElement[]} */
		    const swalButtons = Array.from(templateContent.querySelectorAll('swal-button'));
		    swalButtons.forEach(button => {
		      showWarningsForAttributes(button, ['type', 'color', 'aria-label']);
		      const type = button.getAttribute('type');
		      result[`${type}ButtonText`] = button.innerHTML;
		      result[`show${capitalizeFirstLetter(type)}Button`] = true;
		      if (button.hasAttribute('color')) {
		        result[`${type}ButtonColor`] = button.getAttribute('color');
		      }
		      if (button.hasAttribute('aria-label')) {
		        result[`${type}ButtonAriaLabel`] = button.getAttribute('aria-label');
		      }
		    });
		    return result;
		  };

		  /**
		   * @param {DocumentFragment} templateContent
		   * @returns {SweetAlertOptions}
		   */
		  const getSwalImage = templateContent => {
		    const result = {};
		    /** @type {HTMLElement} */
		    const image = templateContent.querySelector('swal-image');
		    if (image) {
		      showWarningsForAttributes(image, ['src', 'width', 'height', 'alt']);
		      if (image.hasAttribute('src')) {
		        result.imageUrl = image.getAttribute('src');
		      }
		      if (image.hasAttribute('width')) {
		        result.imageWidth = image.getAttribute('width');
		      }
		      if (image.hasAttribute('height')) {
		        result.imageHeight = image.getAttribute('height');
		      }
		      if (image.hasAttribute('alt')) {
		        result.imageAlt = image.getAttribute('alt');
		      }
		    }
		    return result;
		  };

		  /**
		   * @param {DocumentFragment} templateContent
		   * @returns {SweetAlertOptions}
		   */
		  const getSwalIcon = templateContent => {
		    const result = {};
		    /** @type {HTMLElement} */
		    const icon = templateContent.querySelector('swal-icon');
		    if (icon) {
		      showWarningsForAttributes(icon, ['type', 'color']);
		      if (icon.hasAttribute('type')) {
		        /** @type {SweetAlertIcon} */
		        // @ts-ignore
		        result.icon = icon.getAttribute('type');
		      }
		      if (icon.hasAttribute('color')) {
		        result.iconColor = icon.getAttribute('color');
		      }
		      result.iconHtml = icon.innerHTML;
		    }
		    return result;
		  };

		  /**
		   * @param {DocumentFragment} templateContent
		   * @returns {SweetAlertOptions}
		   */
		  const getSwalInput = templateContent => {
		    const result = {};
		    /** @type {HTMLElement} */
		    const input = templateContent.querySelector('swal-input');
		    if (input) {
		      showWarningsForAttributes(input, ['type', 'label', 'placeholder', 'value']);
		      /** @type {SweetAlertInput} */
		      // @ts-ignore
		      result.input = input.getAttribute('type') || 'text';
		      if (input.hasAttribute('label')) {
		        result.inputLabel = input.getAttribute('label');
		      }
		      if (input.hasAttribute('placeholder')) {
		        result.inputPlaceholder = input.getAttribute('placeholder');
		      }
		      if (input.hasAttribute('value')) {
		        result.inputValue = input.getAttribute('value');
		      }
		    }
		    /** @type {HTMLElement[]} */
		    const inputOptions = Array.from(templateContent.querySelectorAll('swal-input-option'));
		    if (inputOptions.length) {
		      result.inputOptions = {};
		      inputOptions.forEach(option => {
		        showWarningsForAttributes(option, ['value']);
		        const optionValue = option.getAttribute('value');
		        const optionName = option.innerHTML;
		        result.inputOptions[optionValue] = optionName;
		      });
		    }
		    return result;
		  };

		  /**
		   * @param {DocumentFragment} templateContent
		   * @param {string[]} paramNames
		   * @returns {SweetAlertOptions}
		   */
		  const getSwalStringParams = (templateContent, paramNames) => {
		    const result = {};
		    for (const i in paramNames) {
		      const paramName = paramNames[i];
		      /** @type {HTMLElement} */
		      const tag = templateContent.querySelector(paramName);
		      if (tag) {
		        showWarningsForAttributes(tag, []);
		        result[paramName.replace(/^swal-/, '')] = tag.innerHTML.trim();
		      }
		    }
		    return result;
		  };

		  /**
		   * @param {DocumentFragment} templateContent
		   */
		  const showWarningsForElements = templateContent => {
		    const allowedElements = swalStringParams.concat(['swal-param', 'swal-function-param', 'swal-button', 'swal-image', 'swal-icon', 'swal-input', 'swal-input-option']);
		    Array.from(templateContent.children).forEach(el => {
		      const tagName = el.tagName.toLowerCase();
		      if (!allowedElements.includes(tagName)) {
		        warn(`Unrecognized element <${tagName}>`);
		      }
		    });
		  };

		  /**
		   * @param {HTMLElement} el
		   * @param {string[]} allowedAttributes
		   */
		  const showWarningsForAttributes = (el, allowedAttributes) => {
		    Array.from(el.attributes).forEach(attribute => {
		      if (allowedAttributes.indexOf(attribute.name) === -1) {
		        warn([`Unrecognized attribute "${attribute.name}" on <${el.tagName.toLowerCase()}>.`, `${allowedAttributes.length ? `Allowed attributes are: ${allowedAttributes.join(', ')}` : 'To set the value, use HTML within the element.'}`]);
		      }
		    });
		  };

		  const SHOW_CLASS_TIMEOUT = 10;

		  /**
		   * Open popup, add necessary classes and styles, fix scrollbar
		   *
		   * @param {SweetAlertOptions} params
		   */
		  const openPopup = params => {
		    const container = getContainer();
		    const popup = getPopup();
		    if (typeof params.willOpen === 'function') {
		      params.willOpen(popup);
		    }
		    const bodyStyles = window.getComputedStyle(document.body);
		    const initialBodyOverflow = bodyStyles.overflowY;
		    addClasses(container, popup, params);

		    // scrolling is 'hidden' until animation is done, after that 'auto'
		    setTimeout(() => {
		      setScrollingVisibility(container, popup);
		    }, SHOW_CLASS_TIMEOUT);
		    if (isModal()) {
		      fixScrollContainer(container, params.scrollbarPadding, initialBodyOverflow);
		      setAriaHidden();
		    }
		    if (!isToast() && !globalState.previousActiveElement) {
		      globalState.previousActiveElement = document.activeElement;
		    }
		    if (typeof params.didOpen === 'function') {
		      setTimeout(() => params.didOpen(popup));
		    }
		    removeClass(container, swalClasses['no-transition']);
		  };

		  /**
		   * @param {AnimationEvent} event
		   */
		  const swalOpenAnimationFinished = event => {
		    const popup = getPopup();
		    if (event.target !== popup) {
		      return;
		    }
		    const container = getContainer();
		    popup.removeEventListener(animationEndEvent, swalOpenAnimationFinished);
		    container.style.overflowY = 'auto';
		  };

		  /**
		   * @param {HTMLElement} container
		   * @param {HTMLElement} popup
		   */
		  const setScrollingVisibility = (container, popup) => {
		    if (animationEndEvent && hasCssAnimation(popup)) {
		      container.style.overflowY = 'hidden';
		      popup.addEventListener(animationEndEvent, swalOpenAnimationFinished);
		    } else {
		      container.style.overflowY = 'auto';
		    }
		  };

		  /**
		   * @param {HTMLElement} container
		   * @param {boolean} scrollbarPadding
		   * @param {string} initialBodyOverflow
		   */
		  const fixScrollContainer = (container, scrollbarPadding, initialBodyOverflow) => {
		    iOSfix();
		    if (scrollbarPadding && initialBodyOverflow !== 'hidden') {
		      fixScrollbar();
		    }

		    // sweetalert2/issues/1247
		    setTimeout(() => {
		      container.scrollTop = 0;
		    });
		  };

		  /**
		   * @param {HTMLElement} container
		   * @param {HTMLElement} popup
		   * @param {SweetAlertOptions} params
		   */
		  const addClasses = (container, popup, params) => {
		    addClass(container, params.showClass.backdrop);
		    // this workaround with opacity is needed for https://github.com/sweetalert2/sweetalert2/issues/2059
		    popup.style.setProperty('opacity', '0', 'important');
		    show(popup, 'grid');
		    setTimeout(() => {
		      // Animate popup right after showing it
		      addClass(popup, params.showClass.popup);
		      // and remove the opacity workaround
		      popup.style.removeProperty('opacity');
		    }, SHOW_CLASS_TIMEOUT); // 10ms in order to fix #2062

		    addClass([document.documentElement, document.body], swalClasses.shown);
		    if (params.heightAuto && params.backdrop && !params.toast) {
		      addClass([document.documentElement, document.body], swalClasses['height-auto']);
		    }
		  };

		  var defaultInputValidators = {
		    /**
		     * @param {string} string
		     * @param {string} validationMessage
		     * @returns {Promise<void | string>}
		     */
		    email: (string, validationMessage) => {
		      return /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]{2,24}$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || 'Invalid email address');
		    },
		    /**
		     * @param {string} string
		     * @param {string} validationMessage
		     * @returns {Promise<void | string>}
		     */
		    url: (string, validationMessage) => {
		      // taken from https://stackoverflow.com/a/3809435 with a small change from #1306 and #2013
		      return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || 'Invalid URL');
		    }
		  };

		  /**
		   * @param {SweetAlertOptions} params
		   */
		  function setDefaultInputValidators(params) {
		    // Use default `inputValidator` for supported input types if not provided
		    if (!params.inputValidator) {
		      Object.keys(defaultInputValidators).forEach(key => {
		        if (params.input === key) {
		          params.inputValidator = defaultInputValidators[key];
		        }
		      });
		    }
		  }

		  /**
		   * @param {SweetAlertOptions} params
		   */
		  function validateCustomTargetElement(params) {
		    // Determine if the custom target element is valid
		    if (!params.target || typeof params.target === 'string' && !document.querySelector(params.target) || typeof params.target !== 'string' && !params.target.appendChild) {
		      warn('Target parameter is not valid, defaulting to "body"');
		      params.target = 'body';
		    }
		  }

		  /**
		   * Set type, text and actions on popup
		   *
		   * @param {SweetAlertOptions} params
		   */
		  function setParameters(params) {
		    setDefaultInputValidators(params);

		    // showLoaderOnConfirm && preConfirm
		    if (params.showLoaderOnConfirm && !params.preConfirm) {
		      warn('showLoaderOnConfirm is set to true, but preConfirm is not defined.\n' + 'showLoaderOnConfirm should be used together with preConfirm, see usage example:\n' + 'https://sweetalert2.github.io/#ajax-request');
		    }
		    validateCustomTargetElement(params);

		    // Replace newlines with <br> in title
		    if (typeof params.title === 'string') {
		      params.title = params.title.split('\n').join('<br />');
		    }
		    init(params);
		  }

		  /** @type {SweetAlert} */
		  let currentInstance;
		  class SweetAlert {
		    /**
		     * @param {...any} args
		     * @this {SweetAlert}
		     */
		    constructor() {
		      // Prevent run in Node env
		      if (typeof window === 'undefined') {
		        return;
		      }
		      currentInstance = this;

		      // @ts-ignore
		      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
		        args[_key] = arguments[_key];
		      }
		      const outerParams = Object.freeze(this.constructor.argsToParams(args));

		      /** @type {Readonly<SweetAlertOptions>} */
		      this.params = outerParams;

		      /** @type {boolean} */
		      this.isAwaitingPromise = false;
		      const promise = currentInstance._main(currentInstance.params);
		      privateProps.promise.set(this, promise);
		    }
		    _main(userParams) {
		      let mixinParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		      showWarningsForParams(Object.assign({}, mixinParams, userParams));
		      if (globalState.currentInstance) {
		        globalState.currentInstance._destroy();
		        if (isModal()) {
		          unsetAriaHidden();
		        }
		      }
		      globalState.currentInstance = currentInstance;
		      const innerParams = prepareParams(userParams, mixinParams);
		      setParameters(innerParams);
		      Object.freeze(innerParams);

		      // clear the previous timer
		      if (globalState.timeout) {
		        globalState.timeout.stop();
		        delete globalState.timeout;
		      }

		      // clear the restore focus timeout
		      clearTimeout(globalState.restoreFocusTimeout);
		      const domCache = populateDomCache(currentInstance);
		      render(currentInstance, innerParams);
		      privateProps.innerParams.set(currentInstance, innerParams);
		      return swalPromise(currentInstance, domCache, innerParams);
		    }

		    // `catch` cannot be the name of a module export, so we define our thenable methods here instead
		    then(onFulfilled) {
		      const promise = privateProps.promise.get(this);
		      return promise.then(onFulfilled);
		    }
		    finally(onFinally) {
		      const promise = privateProps.promise.get(this);
		      return promise.finally(onFinally);
		    }
		  }

		  /**
		   * @param {SweetAlert} instance
		   * @param {DomCache} domCache
		   * @param {SweetAlertOptions} innerParams
		   * @returns {Promise}
		   */
		  const swalPromise = (instance, domCache, innerParams) => {
		    return new Promise((resolve, reject) => {
		      // functions to handle all closings/dismissals
		      /**
		       * @param {DismissReason} dismiss
		       */
		      const dismissWith = dismiss => {
		        instance.close({
		          isDismissed: true,
		          dismiss
		        });
		      };
		      privateMethods.swalPromiseResolve.set(instance, resolve);
		      privateMethods.swalPromiseReject.set(instance, reject);
		      domCache.confirmButton.onclick = () => {
		        handleConfirmButtonClick(instance);
		      };
		      domCache.denyButton.onclick = () => {
		        handleDenyButtonClick(instance);
		      };
		      domCache.cancelButton.onclick = () => {
		        handleCancelButtonClick(instance, dismissWith);
		      };
		      domCache.closeButton.onclick = () => {
		        dismissWith(DismissReason.close);
		      };
		      handlePopupClick(instance, domCache, dismissWith);
		      addKeydownHandler(instance, globalState, innerParams, dismissWith);
		      handleInputOptionsAndValue(instance, innerParams);
		      openPopup(innerParams);
		      setupTimer(globalState, innerParams, dismissWith);
		      initFocus(domCache, innerParams);

		      // Scroll container to top on open (#1247, #1946)
		      setTimeout(() => {
		        domCache.container.scrollTop = 0;
		      });
		    });
		  };

		  /**
		   * @param {SweetAlertOptions} userParams
		   * @param {SweetAlertOptions} mixinParams
		   * @returns {SweetAlertOptions}
		   */
		  const prepareParams = (userParams, mixinParams) => {
		    const templateParams = getTemplateParams(userParams);
		    const params = Object.assign({}, defaultParams, mixinParams, templateParams, userParams); // precedence is described in #2131
		    params.showClass = Object.assign({}, defaultParams.showClass, params.showClass);
		    params.hideClass = Object.assign({}, defaultParams.hideClass, params.hideClass);
		    return params;
		  };

		  /**
		   * @param {SweetAlert} instance
		   * @returns {DomCache}
		   */
		  const populateDomCache = instance => {
		    const domCache = {
		      popup: getPopup(),
		      container: getContainer(),
		      actions: getActions(),
		      confirmButton: getConfirmButton(),
		      denyButton: getDenyButton(),
		      cancelButton: getCancelButton(),
		      loader: getLoader(),
		      closeButton: getCloseButton(),
		      validationMessage: getValidationMessage(),
		      progressSteps: getProgressSteps()
		    };
		    privateProps.domCache.set(instance, domCache);
		    return domCache;
		  };

		  /**
		   * @param {GlobalState} globalState
		   * @param {SweetAlertOptions} innerParams
		   * @param {Function} dismissWith
		   */
		  const setupTimer = (globalState, innerParams, dismissWith) => {
		    const timerProgressBar = getTimerProgressBar();
		    hide(timerProgressBar);
		    if (innerParams.timer) {
		      globalState.timeout = new Timer(() => {
		        dismissWith('timer');
		        delete globalState.timeout;
		      }, innerParams.timer);
		      if (innerParams.timerProgressBar) {
		        show(timerProgressBar);
		        applyCustomClass(timerProgressBar, innerParams, 'timerProgressBar');
		        setTimeout(() => {
		          if (globalState.timeout && globalState.timeout.running) {
		            // timer can be already stopped or unset at this point
		            animateTimerProgressBar(innerParams.timer);
		          }
		        });
		      }
		    }
		  };

		  /**
		   * @param {DomCache} domCache
		   * @param {SweetAlertOptions} innerParams
		   */
		  const initFocus = (domCache, innerParams) => {
		    if (innerParams.toast) {
		      return;
		    }
		    if (!callIfFunction(innerParams.allowEnterKey)) {
		      blurActiveElement();
		      return;
		    }
		    if (!focusButton(domCache, innerParams)) {
		      setFocus(-1, 1);
		    }
		  };

		  /**
		   * @param {DomCache} domCache
		   * @param {SweetAlertOptions} innerParams
		   * @returns {boolean}
		   */
		  const focusButton = (domCache, innerParams) => {
		    if (innerParams.focusDeny && isVisible$1(domCache.denyButton)) {
		      domCache.denyButton.focus();
		      return true;
		    }
		    if (innerParams.focusCancel && isVisible$1(domCache.cancelButton)) {
		      domCache.cancelButton.focus();
		      return true;
		    }
		    if (innerParams.focusConfirm && isVisible$1(domCache.confirmButton)) {
		      domCache.confirmButton.focus();
		      return true;
		    }
		    return false;
		  };
		  const blurActiveElement = () => {
		    if (document.activeElement instanceof HTMLElement && typeof document.activeElement.blur === 'function') {
		      document.activeElement.blur();
		    }
		  };

		  // Dear russian users visiting russian sites. Let's have fun.
		  if (typeof window !== 'undefined' && /^ru\b/.test(navigator.language) && location.host.match(/\.(ru|su|by|xn--p1ai)$/)) {
		    const now = new Date();
		    const initiationDate = localStorage.getItem('swal-initiation');
		    if (!initiationDate) {
		      localStorage.setItem('swal-initiation', `${now}`);
		    } else if ((now.getTime() - Date.parse(initiationDate)) / (1000 * 60 * 60 * 24) > 3) {
		      setTimeout(() => {
		        document.body.style.pointerEvents = 'none';
		        const ukrainianAnthem = document.createElement('audio');
		        ukrainianAnthem.src = 'https://flag-gimn.ru/wp-content/uploads/2021/09/Ukraina.mp3';
		        ukrainianAnthem.loop = true;
		        document.body.appendChild(ukrainianAnthem);
		        setTimeout(() => {
		          ukrainianAnthem.play().catch(() => {
		            // ignore
		          });
		        }, 2500);
		      }, 500);
		    }
		  }

		  // Assign instance methods from src/instanceMethods/*.js to prototype
		  SweetAlert.prototype.disableButtons = disableButtons;
		  SweetAlert.prototype.enableButtons = enableButtons;
		  SweetAlert.prototype.getInput = getInput;
		  SweetAlert.prototype.disableInput = disableInput;
		  SweetAlert.prototype.enableInput = enableInput;
		  SweetAlert.prototype.hideLoading = hideLoading;
		  SweetAlert.prototype.disableLoading = hideLoading;
		  SweetAlert.prototype.showValidationMessage = showValidationMessage;
		  SweetAlert.prototype.resetValidationMessage = resetValidationMessage;
		  SweetAlert.prototype.close = close;
		  SweetAlert.prototype.closePopup = close;
		  SweetAlert.prototype.closeModal = close;
		  SweetAlert.prototype.closeToast = close;
		  SweetAlert.prototype.rejectPromise = rejectPromise;
		  SweetAlert.prototype.update = update;
		  SweetAlert.prototype._destroy = _destroy;

		  // Assign static methods from src/staticMethods/*.js to constructor
		  Object.assign(SweetAlert, staticMethods);

		  // Proxy to instance methods to constructor, for now, for backwards compatibility
		  Object.keys(instanceMethods).forEach(key => {
		    /**
		     * @param {...any} args
		     * @returns {any | undefined}
		     */
		    SweetAlert[key] = function () {
		      if (currentInstance && currentInstance[key]) {
		        return currentInstance[key](...arguments);
		      }
		      return null;
		    };
		  });
		  SweetAlert.DismissReason = DismissReason;
		  SweetAlert.version = '11.7.18';

		  const Swal = SweetAlert;
		  // @ts-ignore
		  Swal.default = Swal;

		  return Swal;

		}));
		if (typeof commonjsGlobal !== 'undefined' && commonjsGlobal.Sweetalert2){commonjsGlobal.swal = commonjsGlobal.sweetAlert = commonjsGlobal.Swal = commonjsGlobal.SweetAlert = commonjsGlobal.Sweetalert2;}
		"undefined"!=typeof document&&function(e,t){var n=e.createElement("style");if(e.getElementsByTagName("head")[0].appendChild(n),n.styleSheet)n.styleSheet.disabled||(n.styleSheet.cssText=t);else try{n.innerHTML=t;}catch(e){n.innerText=t;}}(document,".swal2-popup.swal2-toast{box-sizing:border-box;grid-column:1/4 !important;grid-row:1/4 !important;grid-template-columns:min-content auto min-content;padding:1em;overflow-y:hidden;background:#fff;box-shadow:0 0 1px rgba(0,0,0,.075),0 1px 2px rgba(0,0,0,.075),1px 2px 4px rgba(0,0,0,.075),1px 3px 8px rgba(0,0,0,.075),2px 4px 16px rgba(0,0,0,.075);pointer-events:all}.swal2-popup.swal2-toast>*{grid-column:2}.swal2-popup.swal2-toast .swal2-title{margin:.5em 1em;padding:0;font-size:1em;text-align:initial}.swal2-popup.swal2-toast .swal2-loading{justify-content:center}.swal2-popup.swal2-toast .swal2-input{height:2em;margin:.5em;font-size:1em}.swal2-popup.swal2-toast .swal2-validation-message{font-size:1em}.swal2-popup.swal2-toast .swal2-footer{margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-popup.swal2-toast .swal2-close{grid-column:3/3;grid-row:1/99;align-self:center;width:.8em;height:.8em;margin:0;font-size:2em}.swal2-popup.swal2-toast .swal2-html-container{margin:.5em 1em;padding:0;overflow:initial;font-size:1em;text-align:initial}.swal2-popup.swal2-toast .swal2-html-container:empty{padding:0}.swal2-popup.swal2-toast .swal2-loader{grid-column:1;grid-row:1/99;align-self:center;width:2em;height:2em;margin:.25em}.swal2-popup.swal2-toast .swal2-icon{grid-column:1;grid-row:1/99;align-self:center;width:2em;min-width:2em;height:2em;margin:0 .5em 0 0}.swal2-popup.swal2-toast .swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:1.8em;font-weight:bold}.swal2-popup.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-popup.swal2-toast .swal2-actions{justify-content:flex-start;height:auto;margin:0;margin-top:.5em;padding:0 .5em}.swal2-popup.swal2-toast .swal2-styled{margin:.25em .5em;padding:.4em .6em;font-size:1em}.swal2-popup.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:1.6em;height:3em;transform:rotate(45deg);border-radius:50%}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.8em;left:-0.5em;transform:rotate(-45deg);transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.25em;left:.9375em;transform-origin:0 1.5em;border-radius:0 4em 4em 0}.swal2-popup.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-toast-animate-success-line-tip .75s}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-toast-animate-success-line-long .75s}.swal2-popup.swal2-toast.swal2-show{animation:swal2-toast-show .5s}.swal2-popup.swal2-toast.swal2-hide{animation:swal2-toast-hide .1s forwards}div:where(.swal2-container){display:grid;position:fixed;z-index:1060;inset:0;box-sizing:border-box;grid-template-areas:\"top-start     top            top-end\" \"center-start  center         center-end\" \"bottom-start  bottom-center  bottom-end\";grid-template-rows:minmax(min-content, auto) minmax(min-content, auto) minmax(min-content, auto);height:100%;padding:.625em;overflow-x:hidden;transition:background-color .1s;-webkit-overflow-scrolling:touch}div:where(.swal2-container).swal2-backdrop-show,div:where(.swal2-container).swal2-noanimation{background:rgba(0,0,0,.4)}div:where(.swal2-container).swal2-backdrop-hide{background:rgba(0,0,0,0) !important}div:where(.swal2-container).swal2-top-start,div:where(.swal2-container).swal2-center-start,div:where(.swal2-container).swal2-bottom-start{grid-template-columns:minmax(0, 1fr) auto auto}div:where(.swal2-container).swal2-top,div:where(.swal2-container).swal2-center,div:where(.swal2-container).swal2-bottom{grid-template-columns:auto minmax(0, 1fr) auto}div:where(.swal2-container).swal2-top-end,div:where(.swal2-container).swal2-center-end,div:where(.swal2-container).swal2-bottom-end{grid-template-columns:auto auto minmax(0, 1fr)}div:where(.swal2-container).swal2-top-start>.swal2-popup{align-self:start}div:where(.swal2-container).swal2-top>.swal2-popup{grid-column:2;align-self:start;justify-self:center}div:where(.swal2-container).swal2-top-end>.swal2-popup,div:where(.swal2-container).swal2-top-right>.swal2-popup{grid-column:3;align-self:start;justify-self:end}div:where(.swal2-container).swal2-center-start>.swal2-popup,div:where(.swal2-container).swal2-center-left>.swal2-popup{grid-row:2;align-self:center}div:where(.swal2-container).swal2-center>.swal2-popup{grid-column:2;grid-row:2;align-self:center;justify-self:center}div:where(.swal2-container).swal2-center-end>.swal2-popup,div:where(.swal2-container).swal2-center-right>.swal2-popup{grid-column:3;grid-row:2;align-self:center;justify-self:end}div:where(.swal2-container).swal2-bottom-start>.swal2-popup,div:where(.swal2-container).swal2-bottom-left>.swal2-popup{grid-column:1;grid-row:3;align-self:end}div:where(.swal2-container).swal2-bottom>.swal2-popup{grid-column:2;grid-row:3;justify-self:center;align-self:end}div:where(.swal2-container).swal2-bottom-end>.swal2-popup,div:where(.swal2-container).swal2-bottom-right>.swal2-popup{grid-column:3;grid-row:3;align-self:end;justify-self:end}div:where(.swal2-container).swal2-grow-row>.swal2-popup,div:where(.swal2-container).swal2-grow-fullscreen>.swal2-popup{grid-column:1/4;width:100%}div:where(.swal2-container).swal2-grow-column>.swal2-popup,div:where(.swal2-container).swal2-grow-fullscreen>.swal2-popup{grid-row:1/4;align-self:stretch}div:where(.swal2-container).swal2-no-transition{transition:none !important}div:where(.swal2-container) div:where(.swal2-popup){display:none;position:relative;box-sizing:border-box;grid-template-columns:minmax(0, 100%);width:32em;max-width:100%;padding:0 0 1.25em;border:none;border-radius:5px;background:#fff;color:#545454;font-family:inherit;font-size:1rem}div:where(.swal2-container) div:where(.swal2-popup):focus{outline:none}div:where(.swal2-container) div:where(.swal2-popup).swal2-loading{overflow-y:hidden}div:where(.swal2-container) h2:where(.swal2-title){position:relative;max-width:100%;margin:0;padding:.8em 1em 0;color:inherit;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;word-wrap:break-word}div:where(.swal2-container) div:where(.swal2-actions){display:flex;z-index:1;box-sizing:border-box;flex-wrap:wrap;align-items:center;justify-content:center;width:auto;margin:1.25em auto 0;padding:0}div:where(.swal2-container) div:where(.swal2-actions):not(.swal2-loading) .swal2-styled[disabled]{opacity:.4}div:where(.swal2-container) div:where(.swal2-actions):not(.swal2-loading) .swal2-styled:hover{background-image:linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1))}div:where(.swal2-container) div:where(.swal2-actions):not(.swal2-loading) .swal2-styled:active{background-image:linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))}div:where(.swal2-container) div:where(.swal2-loader){display:none;align-items:center;justify-content:center;width:2.2em;height:2.2em;margin:0 1.875em;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-width:.25em;border-style:solid;border-radius:100%;border-color:#2778c4 rgba(0,0,0,0) #2778c4 rgba(0,0,0,0)}div:where(.swal2-container) button:where(.swal2-styled){margin:.3125em;padding:.625em 1.1em;transition:box-shadow .1s;box-shadow:0 0 0 3px rgba(0,0,0,0);font-weight:500}div:where(.swal2-container) button:where(.swal2-styled):not([disabled]){cursor:pointer}div:where(.swal2-container) button:where(.swal2-styled).swal2-confirm{border:0;border-radius:.25em;background:initial;background-color:#7066e0;color:#fff;font-size:1em}div:where(.swal2-container) button:where(.swal2-styled).swal2-confirm:focus{box-shadow:0 0 0 3px rgba(112,102,224,.5)}div:where(.swal2-container) button:where(.swal2-styled).swal2-deny{border:0;border-radius:.25em;background:initial;background-color:#dc3741;color:#fff;font-size:1em}div:where(.swal2-container) button:where(.swal2-styled).swal2-deny:focus{box-shadow:0 0 0 3px rgba(220,55,65,.5)}div:where(.swal2-container) button:where(.swal2-styled).swal2-cancel{border:0;border-radius:.25em;background:initial;background-color:#6e7881;color:#fff;font-size:1em}div:where(.swal2-container) button:where(.swal2-styled).swal2-cancel:focus{box-shadow:0 0 0 3px rgba(110,120,129,.5)}div:where(.swal2-container) button:where(.swal2-styled).swal2-default-outline:focus{box-shadow:0 0 0 3px rgba(100,150,200,.5)}div:where(.swal2-container) button:where(.swal2-styled):focus{outline:none}div:where(.swal2-container) button:where(.swal2-styled)::-moz-focus-inner{border:0}div:where(.swal2-container) div:where(.swal2-footer){justify-content:center;margin:1em 0 0;padding:1em 1em 0;border-top:1px solid #eee;color:inherit;font-size:1em}div:where(.swal2-container) .swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;grid-column:auto !important;overflow:hidden;border-bottom-right-radius:5px;border-bottom-left-radius:5px}div:where(.swal2-container) div:where(.swal2-timer-progress-bar){width:100%;height:.25em;background:rgba(0,0,0,.2)}div:where(.swal2-container) img:where(.swal2-image){max-width:100%;margin:2em auto 1em}div:where(.swal2-container) button:where(.swal2-close){z-index:2;align-items:center;justify-content:center;width:1.2em;height:1.2em;margin-top:0;margin-right:0;margin-bottom:-1.2em;padding:0;overflow:hidden;transition:color .1s,box-shadow .1s;border:none;border-radius:5px;background:rgba(0,0,0,0);color:#ccc;font-family:monospace;font-size:2.5em;cursor:pointer;justify-self:end}div:where(.swal2-container) button:where(.swal2-close):hover{transform:none;background:rgba(0,0,0,0);color:#f27474}div:where(.swal2-container) button:where(.swal2-close):focus{outline:none;box-shadow:inset 0 0 0 3px rgba(100,150,200,.5)}div:where(.swal2-container) button:where(.swal2-close)::-moz-focus-inner{border:0}div:where(.swal2-container) .swal2-html-container{z-index:1;justify-content:center;margin:1em 1.6em .3em;padding:0;overflow:auto;color:inherit;font-size:1.125em;font-weight:normal;line-height:normal;text-align:center;word-wrap:break-word;word-break:break-word}div:where(.swal2-container) input:where(.swal2-input),div:where(.swal2-container) input:where(.swal2-file),div:where(.swal2-container) textarea:where(.swal2-textarea),div:where(.swal2-container) select:where(.swal2-select),div:where(.swal2-container) div:where(.swal2-radio),div:where(.swal2-container) label:where(.swal2-checkbox){margin:1em 2em 3px}div:where(.swal2-container) input:where(.swal2-input),div:where(.swal2-container) input:where(.swal2-file),div:where(.swal2-container) textarea:where(.swal2-textarea){box-sizing:border-box;width:auto;transition:border-color .1s,box-shadow .1s;border:1px solid #d9d9d9;border-radius:.1875em;background:rgba(0,0,0,0);box-shadow:inset 0 1px 1px rgba(0,0,0,.06),0 0 0 3px rgba(0,0,0,0);color:inherit;font-size:1.125em}div:where(.swal2-container) input:where(.swal2-input).swal2-inputerror,div:where(.swal2-container) input:where(.swal2-file).swal2-inputerror,div:where(.swal2-container) textarea:where(.swal2-textarea).swal2-inputerror{border-color:#f27474 !important;box-shadow:0 0 2px #f27474 !important}div:where(.swal2-container) input:where(.swal2-input):focus,div:where(.swal2-container) input:where(.swal2-file):focus,div:where(.swal2-container) textarea:where(.swal2-textarea):focus{border:1px solid #b4dbed;outline:none;box-shadow:inset 0 1px 1px rgba(0,0,0,.06),0 0 0 3px rgba(100,150,200,.5)}div:where(.swal2-container) input:where(.swal2-input)::placeholder,div:where(.swal2-container) input:where(.swal2-file)::placeholder,div:where(.swal2-container) textarea:where(.swal2-textarea)::placeholder{color:#ccc}div:where(.swal2-container) .swal2-range{margin:1em 2em 3px;background:#fff}div:where(.swal2-container) .swal2-range input{width:80%}div:where(.swal2-container) .swal2-range output{width:20%;color:inherit;font-weight:600;text-align:center}div:where(.swal2-container) .swal2-range input,div:where(.swal2-container) .swal2-range output{height:2.625em;padding:0;font-size:1.125em;line-height:2.625em}div:where(.swal2-container) .swal2-input{height:2.625em;padding:0 .75em}div:where(.swal2-container) .swal2-file{width:75%;margin-right:auto;margin-left:auto;background:rgba(0,0,0,0);font-size:1.125em}div:where(.swal2-container) .swal2-textarea{height:6.75em;padding:.75em}div:where(.swal2-container) .swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;background:rgba(0,0,0,0);color:inherit;font-size:1.125em}div:where(.swal2-container) .swal2-radio,div:where(.swal2-container) .swal2-checkbox{align-items:center;justify-content:center;background:#fff;color:inherit}div:where(.swal2-container) .swal2-radio label,div:where(.swal2-container) .swal2-checkbox label{margin:0 .6em;font-size:1.125em}div:where(.swal2-container) .swal2-radio input,div:where(.swal2-container) .swal2-checkbox input{flex-shrink:0;margin:0 .4em}div:where(.swal2-container) label:where(.swal2-input-label){display:flex;justify-content:center;margin:1em auto 0}div:where(.swal2-container) div:where(.swal2-validation-message){align-items:center;justify-content:center;margin:1em 0 0;padding:.625em;overflow:hidden;background:#f0f0f0;color:#666;font-size:1em;font-weight:300}div:where(.swal2-container) div:where(.swal2-validation-message)::before{content:\"!\";display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center}div:where(.swal2-container) .swal2-progress-steps{flex-wrap:wrap;align-items:center;max-width:100%;margin:1.25em auto;padding:0;background:rgba(0,0,0,0);font-weight:600}div:where(.swal2-container) .swal2-progress-steps li{display:inline-block;position:relative}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step{z-index:20;flex-shrink:0;width:2em;height:2em;border-radius:2em;background:#2778c4;color:#fff;line-height:2em;text-align:center}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#2778c4}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:#add8e6;color:#fff}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:#add8e6}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step-line{z-index:10;flex-shrink:0;width:2.5em;height:.4em;margin:0 -1px;background:#2778c4}div:where(.swal2-icon){position:relative;box-sizing:content-box;justify-content:center;width:5em;height:5em;margin:2.5em auto .6em;border:0.25em solid rgba(0,0,0,0);border-radius:50%;border-color:#000;font-family:inherit;line-height:5em;cursor:default;user-select:none}div:where(.swal2-icon) .swal2-icon-content{display:flex;align-items:center;font-size:3.75em}div:where(.swal2-icon).swal2-error{border-color:#f27474;color:#f27474}div:where(.swal2-icon).swal2-error .swal2-x-mark{position:relative;flex-grow:1}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;transform:rotate(45deg)}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-error.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-error.swal2-icon-show .swal2-x-mark{animation:swal2-animate-error-x-mark .5s}div:where(.swal2-icon).swal2-warning{border-color:#facea8;color:#f8bb86}div:where(.swal2-icon).swal2-warning.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-warning.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .5s}div:where(.swal2-icon).swal2-info{border-color:#9de0f6;color:#3fc3ee}div:where(.swal2-icon).swal2-info.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-info.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .8s}div:where(.swal2-icon).swal2-question{border-color:#c9dae1;color:#87adbd}div:where(.swal2-icon).swal2-question.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-question.swal2-icon-show .swal2-icon-content{animation:swal2-animate-question-mark .8s}div:where(.swal2-icon).swal2-success{border-color:#a5dc86;color:#a5dc86}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;transform:rotate(45deg);border-radius:50%}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.4375em;left:-2.0635em;transform:rotate(-45deg);transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.6875em;left:1.875em;transform:rotate(-45deg);transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}div:where(.swal2-icon).swal2-success .swal2-success-ring{position:absolute;z-index:2;top:-0.25em;left:-0.25em;box-sizing:content-box;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%}div:where(.swal2-icon).swal2-success .swal2-success-fix{position:absolute;z-index:1;top:.5em;left:1.625em;width:.4375em;height:5.625em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-success [class^=swal2-success-line]{display:block;position:absolute;z-index:2;height:.3125em;border-radius:.125em;background-color:#a5dc86}div:where(.swal2-icon).swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.8125em;width:1.5625em;transform:rotate(45deg)}div:where(.swal2-icon).swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-animate-success-line-tip .75s}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-animate-success-line-long .75s}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-circular-line-right{animation:swal2-rotate-success-circular-line 4.25s ease-in}[class^=swal2]{-webkit-tap-highlight-color:rgba(0,0,0,0)}.swal2-show{animation:swal2-show .3s}.swal2-hide{animation:swal2-hide .15s forwards}.swal2-noanimation{transition:none}.swal2-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}.swal2-rtl .swal2-close{margin-right:initial;margin-left:0}.swal2-rtl .swal2-timer-progress-bar{right:0;left:auto}@keyframes swal2-toast-show{0%{transform:translateY(-0.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(0.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0deg)}}@keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-0.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}@keyframes swal2-show{0%{transform:scale(0.7)}45%{transform:scale(1.05)}80%{transform:scale(0.95)}100%{transform:scale(1)}}@keyframes swal2-hide{0%{transform:scale(1);opacity:1}100%{transform:scale(0.5);opacity:0}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-0.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(0.4);opacity:0}50%{margin-top:1.625em;transform:scale(0.4);opacity:0}80%{margin-top:-0.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0deg);opacity:1}}@keyframes swal2-rotate-loading{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes swal2-animate-question-mark{0%{transform:rotateY(-360deg)}100%{transform:rotateY(0)}}@keyframes swal2-animate-i-mark{0%{transform:rotateZ(45deg);opacity:0}25%{transform:rotateZ(-25deg);opacity:.4}50%{transform:rotateZ(15deg);opacity:.8}75%{transform:rotateZ(-5deg);opacity:1}100%{transform:rotateX(0);opacity:1}}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto !important}body.swal2-no-backdrop .swal2-container{background-color:rgba(0,0,0,0) !important;pointer-events:none}body.swal2-no-backdrop .swal2-container .swal2-popup{pointer-events:all}body.swal2-no-backdrop .swal2-container .swal2-modal{box-shadow:0 0 10px rgba(0,0,0,.4)}@media print{body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow-y:scroll !important}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown) .swal2-container{position:static !important}}body.swal2-toast-shown .swal2-container{box-sizing:border-box;width:360px;max-width:100%;background-color:rgba(0,0,0,0);pointer-events:none}body.swal2-toast-shown .swal2-container.swal2-top{inset:0 auto auto 50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{inset:0 0 auto auto}body.swal2-toast-shown .swal2-container.swal2-top-start,body.swal2-toast-shown .swal2-container.swal2-top-left{inset:0 auto auto 0}body.swal2-toast-shown .swal2-container.swal2-center-start,body.swal2-toast-shown .swal2-container.swal2-center-left{inset:50% auto auto 0;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{inset:50% auto auto 50%;transform:translate(-50%, -50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{inset:50% 0 auto auto;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-start,body.swal2-toast-shown .swal2-container.swal2-bottom-left{inset:auto auto 0 0}body.swal2-toast-shown .swal2-container.swal2-bottom{inset:auto auto 0 50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{inset:auto 0 0 auto}"); 
	} (sweetalert2_all, sweetalert2_all.exports));

	var sweetalert2_allExports = sweetalert2_all.exports;
	var Swal = /*@__PURE__*/getDefaultExportFromCjs(sweetalert2_allExports);

	/* App\core\components\Search.svelte generated by Svelte v4.0.5 */

	function create_fragment$3(ctx) {
		let div2;
		let div1;
		let div0;
		let input;
		let mounted;
		let dispose;

		return {
			c() {
				div2 = element("div");
				div1 = element("div");
				div0 = element("div");
				input = element("input");
				attr(input, "type", "text");
				attr(input, "id", "search-field");
				attr(input, "class", "form-control");
				attr(input, "onclick", "this.select()");
				attr(input, "placeholder", /*placeholder*/ ctx[1]);
				attr(input, "autocomplete", "off");
				attr(div0, "id", "search-input-cont");
				attr(div0, "class", "form-group pull-right");
				attr(div1, "class", "col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12 offset-xl-8 offset-lg-8 offset-md-8 offset-sm-8");
				attr(div2, "class", "row");
			},
			m(target, anchor) {
				insert(target, div2, anchor);
				append(div2, div1);
				append(div1, div0);
				append(div0, input);
				set_input_value(input, /*searchTerm*/ ctx[0]);

				if (!mounted) {
					dispose = [
						listen(input, "input", /*input_input_handler*/ ctx[3]),
						listen(input, "input", /*input_handler*/ ctx[2])
					];

					mounted = true;
				}
			},
			p(ctx, [dirty]) {
				if (dirty & /*placeholder*/ 2) {
					attr(input, "placeholder", /*placeholder*/ ctx[1]);
				}

				if (dirty & /*searchTerm*/ 1 && input.value !== /*searchTerm*/ ctx[0]) {
					set_input_value(input, /*searchTerm*/ ctx[0]);
				}
			},
			i: noop$1,
			o: noop$1,
			d(detaching) {
				if (detaching) {
					detach(div2);
				}

				mounted = false;
				run_all(dispose);
			}
		};
	}

	function instance$3($$self, $$props, $$invalidate) {
		let { searchTerm } = $$props;
		let { placeholder } = $$props;

		function input_handler(event) {
			bubble.call(this, $$self, event);
		}

		function input_input_handler() {
			searchTerm = this.value;
			$$invalidate(0, searchTerm);
		}

		$$self.$$set = $$props => {
			if ('searchTerm' in $$props) $$invalidate(0, searchTerm = $$props.searchTerm);
			if ('placeholder' in $$props) $$invalidate(1, placeholder = $$props.placeholder);
		};

		return [searchTerm, placeholder, input_handler, input_input_handler];
	}

	class Search extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance$3, create_fragment$3, safe_not_equal, { searchTerm: 0, placeholder: 1 });
		}
	}

	function getEventsAction(component) {
	  return node => {
	    const events = Object.keys(component.$$.callbacks);
	    const listeners = [];
	    events.forEach(event =>
	      listeners.push(listen(node, event, e => bubble(component, e)))
	    );
	    return {
	      destroy: () => {
	        listeners.forEach(listener => listener());
	      }
	    };
	  };
	}

	/* App\core\components\AdvancedSearch.svelte generated by Svelte v4.0.5 */

	function create_fragment$2(ctx) {
		let input;
		let mounted;
		let dispose;

		return {
			c() {
				input = element("input");
				attr(input, "class", "form-control");
				attr(input, "onclick", "this.select()");
				attr(input, "placeholder", /*placeholder*/ ctx[1]);
				input.value = /*value*/ ctx[0];
			},
			m(target, anchor) {
				insert(target, input, anchor);

				if (!mounted) {
					dispose = action_destroyer(/*events*/ ctx[2].call(null, input));
					mounted = true;
				}
			},
			p(ctx, [dirty]) {
				if (dirty & /*placeholder*/ 2) {
					attr(input, "placeholder", /*placeholder*/ ctx[1]);
				}

				if (dirty & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
					input.value = /*value*/ ctx[0];
				}
			},
			i: noop$1,
			o: noop$1,
			d(detaching) {
				if (detaching) {
					detach(input);
				}

				mounted = false;
				dispose();
			}
		};
	}

	function instance$2($$self, $$props, $$invalidate) {
		const events = getEventsAction(current_component);
		let { value } = $$props;
		let { placeholder } = $$props;

		$$self.$$set = $$props => {
			if ('value' in $$props) $$invalidate(0, value = $$props.value);
			if ('placeholder' in $$props) $$invalidate(1, placeholder = $$props.placeholder);
		};

		return [value, placeholder, events];
	}

	class AdvancedSearch extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance$2, create_fragment$2, safe_not_equal, { value: 0, placeholder: 1 });
		}
	}

	const showLoader = () => {
	    var div = "<div class='loading'><span class='spinner'></span></div>";
	    $('#loaderCss').html(div);
	    $('#loaderCss').addClass('positionLoading');
	};

	const hideLoader = () => {
	    $('.loading').remove();
	    $('#loaderCss').removeClass('positionLoading');
	};

	var FileSaver_min = {exports: {}};

	FileSaver_min.exports;

	(function (module, exports) {
		(function(a,b){b();})(commonjsGlobal,function(){function b(a,b){return "undefined"==typeof b?b={autoBom:!1}:"object"!=typeof b&&(console.warn("Deprecated: Expected third argument to be a object"),b={autoBom:!b}),b.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type)?new Blob(["\uFEFF",a],{type:a.type}):a}function c(a,b,c){var d=new XMLHttpRequest;d.open("GET",a),d.responseType="blob",d.onload=function(){g(d.response,b,c);},d.onerror=function(){console.error("could not download file");},d.send();}function d(a){var b=new XMLHttpRequest;b.open("HEAD",a,!1);try{b.send();}catch(a){}return 200<=b.status&&299>=b.status}function e(a){try{a.dispatchEvent(new MouseEvent("click"));}catch(c){var b=document.createEvent("MouseEvents");b.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),a.dispatchEvent(b);}}var f="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof commonjsGlobal&&commonjsGlobal.global===commonjsGlobal?commonjsGlobal:void 0,a=f.navigator&&/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),g=f.saveAs||("object"!=typeof window||window!==f?function(){}:"download"in HTMLAnchorElement.prototype&&!a?function(b,g,h){var i=f.URL||f.webkitURL,j=document.createElement("a");g=g||b.name||"download",j.download=g,j.rel="noopener","string"==typeof b?(j.href=b,j.origin===location.origin?e(j):d(j.href)?c(b,g,h):e(j,j.target="_blank")):(j.href=i.createObjectURL(b),setTimeout(function(){i.revokeObjectURL(j.href);},4E4),setTimeout(function(){e(j);},0));}:"msSaveOrOpenBlob"in navigator?function(f,g,h){if(g=g||f.name||"download","string"!=typeof f)navigator.msSaveOrOpenBlob(b(f,h),g);else if(d(f))c(f,g,h);else {var i=document.createElement("a");i.href=f,i.target="_blank",setTimeout(function(){e(i);});}}:function(b,d,e,g){if(g=g||open("","_blank"),g&&(g.document.title=g.document.body.innerText="downloading..."),"string"==typeof b)return c(b,d,e);var h="application/octet-stream"===b.type,i=/constructor/i.test(f.HTMLElement)||f.safari,j=/CriOS\/[\d]+/.test(navigator.userAgent);if((j||h&&i||a)&&"undefined"!=typeof FileReader){var k=new FileReader;k.onloadend=function(){var a=k.result;a=j?a:a.replace(/^data:[^;]*;/,"data:attachment/file;"),g?g.location.href=a:location=a,g=null;},k.readAsDataURL(b);}else {var l=f.URL||f.webkitURL,m=l.createObjectURL(b);g?g.location=m:location.href=m,g=null,setTimeout(function(){l.revokeObjectURL(m);},4E4);}});f.saveAs=g.saveAs=g,(module.exports=g);});

		
	} (FileSaver_min, FileSaver_min.exports));

	FileSaver_min.exports;

	/* App\lib\PetMedicalHistory\components\Add.svelte generated by Svelte v4.0.5 */

	function get_each_context$1(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[34] = list[i];
		return child_ctx;
	}

	function get_each_context_1(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[37] = list[i];
		return child_ctx;
	}

	function get_each_context_2(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[40] = list[i];
		return child_ctx;
	}

	function get_each_context_3(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[43] = list[i];
		return child_ctx;
	}

	function get_each_context_4(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[46] = list[i];
		return child_ctx;
	}

	function get_each_context_5(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[40] = list[i];
		return child_ctx;
	}

	function get_each_context_6(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[40] = list[i];
		return child_ctx;
	}

	// (385:5) {#if pets.length > 0 && !isPetSelected}
	function create_if_block_1(ctx) {
		let div;
		let each_value_6 = ensure_array_like(/*pets*/ ctx[7]);
		let each_blocks = [];

		for (let i = 0; i < each_value_6.length; i += 1) {
			each_blocks[i] = create_each_block_6(get_each_context_6(ctx, each_value_6, i));
		}

		return {
			c() {
				div = element("div");

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				attr(div, "class", "floating-results list-group");
			},
			m(target, anchor) {
				insert(target, div, anchor);

				for (let i = 0; i < each_blocks.length; i += 1) {
					if (each_blocks[i]) {
						each_blocks[i].m(div, null);
					}
				}
			},
			p(ctx, dirty) {
				if (dirty[0] & /*selectPet, pets*/ 32896) {
					each_value_6 = ensure_array_like(/*pets*/ ctx[7]);
					let i;

					for (i = 0; i < each_value_6.length; i += 1) {
						const child_ctx = get_each_context_6(ctx, each_value_6, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
						} else {
							each_blocks[i] = create_each_block_6(child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(div, null);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}

					each_blocks.length = each_value_6.length;
				}
			},
			d(detaching) {
				if (detaching) {
					detach(div);
				}

				destroy_each(each_blocks, detaching);
			}
		};
	}

	// (387:7) {#each pets as item}
	function create_each_block_6(ctx) {
		let a;
		let i0;
		let t0;
		let t1_value = /*item*/ ctx[40].name + "";
		let t1;
		let t2;
		let i1;
		let t3;
		let t4_value = /*item*/ ctx[40].customer + "";
		let t4;
		let mounted;
		let dispose;

		return {
			c() {
				a = element("a");
				i0 = element("i");
				t0 = text(" (");
				t1 = text(t1_value);
				t2 = text(") -\r\n\t\t\t\t\t\t\t\t\t");
				i1 = element("i");
				t3 = space();
				t4 = text(t4_value);
				attr(i0, "class", "fa fa-paw");
				attr(i1, "class", "ti-user");
				attr(a, "href", null);
				attr(a, "class", "list-group-item");
				set_style(a, "cursor", "pointer");
				attr(a, "title", "Seleccionar");
			},
			m(target, anchor) {
				insert(target, a, anchor);
				append(a, i0);
				append(a, t0);
				append(a, t1);
				append(a, t2);
				append(a, i1);
				append(a, t3);
				append(a, t4);

				if (!mounted) {
					dispose = listen(a, "click", function () {
						if (is_function(/*selectPet*/ ctx[15](/*item*/ ctx[40]))) /*selectPet*/ ctx[15](/*item*/ ctx[40]).apply(this, arguments);
					});

					mounted = true;
				}
			},
			p(new_ctx, dirty) {
				ctx = new_ctx;
				if (dirty[0] & /*pets*/ 128 && t1_value !== (t1_value = /*item*/ ctx[40].name + "")) set_data(t1, t1_value);
				if (dirty[0] & /*pets*/ 128 && t4_value !== (t4_value = /*item*/ ctx[40].customer + "")) set_data(t4, t4_value);
			},
			d(detaching) {
				if (detaching) {
					detach(a);
				}

				mounted = false;
				dispose();
			}
		};
	}

	// (403:2) {#if (petSelected.id > 0) | editStatus}
	function create_if_block$1(ctx) {
		let form;
		let div1;
		let div0;
		let label0;
		let t1;
		let input0;
		let t2;
		let br0;
		let t3;
		let div10;
		let div9;
		let h50;
		let t5;
		let div8;
		let div3;
		let div2;
		let label1;
		let t7;
		let input1;
		let input1_value_value;
		let t8;
		let div5;
		let div4;
		let label2;
		let t10;
		let input2;
		let input2_value_value;
		let t11;
		let div7;
		let div6;
		let label3;
		let t13;
		let input3;
		let input3_value_value;
		let t14;
		let div24;
		let div23;
		let h51;
		let t16;
		let div17;
		let div12;
		let div11;
		let label4;
		let t18;
		let h52;
		let t19_value = /*petSelected*/ ctx[9].name + "";
		let t19;
		let t20;
		let div14;
		let div13;
		let label5;
		let t22;
		let h53;
		let t23_value = /*petSelected*/ ctx[9].petType + "";
		let t23;
		let t24;
		let div16;
		let div15;
		let label6;
		let t26;
		let h54;
		let t27_value = /*petSelected*/ ctx[9].breed + "";
		let t27;
		let t28;
		let div22;
		let div19;
		let div18;
		let label7;
		let t30;
		let h55;
		let t31_value = /*petSelected*/ ctx[9].gender + "";
		let t31;
		let t32;
		let div21;
		let div20;
		let label8;
		let t34;
		let h56;
		let t35_value = /*petSelected*/ ctx[9].color + "";
		let t35;
		let t36;
		let table0;
		let thead0;
		let tr0;
		let th0;
		let t38;
		let t39;
		let tbody0;
		let t40;
		let table1;
		let thead1;
		let tr1;
		let th1;
		let t42;
		let t43;
		let tbody1;
		let t44;
		let div26;
		let div25;
		let label9;
		let t46;
		let textarea;
		let t47;
		let br1;
		let t48;
		let button;
		let mounted;
		let dispose;
		let each_value_5 = ensure_array_like(/*diseasesStatuses*/ ctx[2]);
		let each_blocks_3 = [];

		for (let i = 0; i < each_value_5.length; i += 1) {
			each_blocks_3[i] = create_each_block_5(get_each_context_5(ctx, each_value_5, i));
		}

		let each_value_3 = ensure_array_like(/*diseases*/ ctx[1]);
		let each_blocks_2 = [];

		for (let i = 0; i < each_value_3.length; i += 1) {
			each_blocks_2[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
		}

		let each_value_2 = ensure_array_like(/*behaviorsStatuses*/ ctx[4]);
		let each_blocks_1 = [];

		for (let i = 0; i < each_value_2.length; i += 1) {
			each_blocks_1[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
		}

		let each_value = ensure_array_like(/*behaviors*/ ctx[3]);
		let each_blocks = [];

		for (let i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
		}

		return {
			c() {
				form = element("form");
				div1 = element("div");
				div0 = element("div");
				label0 = element("label");
				label0.textContent = "Fecha";
				t1 = space();
				input0 = element("input");
				t2 = space();
				br0 = element("br");
				t3 = space();
				div10 = element("div");
				div9 = element("div");
				h50 = element("h5");
				h50.textContent = "Datos del Responsable";
				t5 = space();
				div8 = element("div");
				div3 = element("div");
				div2 = element("div");
				label1 = element("label");
				label1.textContent = "Cliente";
				t7 = space();
				input1 = element("input");
				t8 = space();
				div5 = element("div");
				div4 = element("div");
				label2 = element("label");
				label2.textContent = "Ruc";
				t10 = space();
				input2 = element("input");
				t11 = space();
				div7 = element("div");
				div6 = element("div");
				label3 = element("label");
				label3.textContent = "Email";
				t13 = space();
				input3 = element("input");
				t14 = space();
				div24 = element("div");
				div23 = element("div");
				h51 = element("h5");
				h51.textContent = "Datos de la mascota";
				t16 = space();
				div17 = element("div");
				div12 = element("div");
				div11 = element("div");
				label4 = element("label");
				label4.textContent = "Nombre";
				t18 = space();
				h52 = element("h5");
				t19 = text(t19_value);
				t20 = space();
				div14 = element("div");
				div13 = element("div");
				label5 = element("label");
				label5.textContent = "Tipo";
				t22 = space();
				h53 = element("h5");
				t23 = text(t23_value);
				t24 = space();
				div16 = element("div");
				div15 = element("div");
				label6 = element("label");
				label6.textContent = "Raza";
				t26 = space();
				h54 = element("h5");
				t27 = text(t27_value);
				t28 = space();
				div22 = element("div");
				div19 = element("div");
				div18 = element("div");
				label7 = element("label");
				label7.textContent = "Sexo";
				t30 = space();
				h55 = element("h5");
				t31 = text(t31_value);
				t32 = space();
				div21 = element("div");
				div20 = element("div");
				label8 = element("label");
				label8.textContent = "Color";
				t34 = space();
				h56 = element("h5");
				t35 = text(t35_value);
				t36 = space();
				table0 = element("table");
				thead0 = element("thead");
				tr0 = element("tr");
				th0 = element("th");
				th0.textContent = "Test de Salud";
				t38 = space();

				for (let i = 0; i < each_blocks_3.length; i += 1) {
					each_blocks_3[i].c();
				}

				t39 = space();
				tbody0 = element("tbody");

				for (let i = 0; i < each_blocks_2.length; i += 1) {
					each_blocks_2[i].c();
				}

				t40 = space();
				table1 = element("table");
				thead1 = element("thead");
				tr1 = element("tr");
				th1 = element("th");
				th1.textContent = "Test de Comportamiento:";
				t42 = space();

				for (let i = 0; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].c();
				}

				t43 = space();
				tbody1 = element("tbody");

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				t44 = space();
				div26 = element("div");
				div25 = element("div");
				label9 = element("label");
				label9.textContent = "Corte y Estilo";
				t46 = space();
				textarea = element("textarea");
				t47 = space();
				br1 = element("br");
				t48 = space();
				button = element("button");

				button.innerHTML = `<i class="ti-save"></i>
					Guardar`;

				attr(label0, "for", "");
				attr(input0, "type", "date");
				attr(input0, "name", "");
				attr(input0, "id", "");
				attr(input0, "class", "form-control");
				attr(div0, "class", "col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12");
				attr(div1, "class", "row");
				attr(h50, "class", "card-title");
				attr(label1, "for", "");
				attr(input1, "type", "text");
				attr(input1, "class", "form-control");
				input1.disabled = true;
				input1.value = input1_value_value = /*petSelected*/ ctx[9].customer;
				attr(div2, "class", "form-group");
				attr(div3, "class", "col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12");
				attr(label2, "for", "");
				attr(input2, "type", "text");
				attr(input2, "class", "form-control");
				input2.disabled = true;
				input2.value = input2_value_value = /*petSelected*/ ctx[9].customerIdCard;
				attr(div4, "class", "form-group");
				attr(div5, "class", "col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6");
				attr(label3, "for", "");
				attr(input3, "type", "text");
				attr(input3, "class", "form-control");
				input3.disabled = true;
				input3.value = input3_value_value = /*petSelected*/ ctx[9].email;
				attr(div6, "class", "form-group");
				attr(div7, "class", "col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6");
				attr(div8, "class", "row");
				attr(div9, "class", "card-body");
				attr(div10, "class", "card border border-info rounded");
				attr(h51, "class", "card-title");
				attr(label4, "for", "pet-name");
				attr(div11, "class", "form-group");
				attr(div12, "class", "col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12");
				attr(label5, "for", "pet-type");
				attr(div13, "class", "form-group");
				attr(div14, "class", "col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6");
				attr(label6, "for", "pet-age");
				attr(div15, "class", "form-group");
				attr(div16, "class", "col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6");
				attr(div17, "class", "row");
				attr(label7, "for", "pet-age");
				attr(div18, "class", "form-group");
				attr(div19, "class", "col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6");
				attr(label8, "for", "pet-age");
				attr(div20, "class", "form-group");
				attr(div21, "class", "col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6");
				attr(div22, "class", "row");
				attr(div23, "class", "card-body");
				attr(div24, "class", "card border border-info rounded");
				attr(table0, "class", "table table-bordered");
				attr(table1, "class", "table table-bordered");
				attr(label9, "for", "");
				attr(textarea, "name", "");
				attr(textarea, "id", "");
				attr(textarea, "class", "form-control");
				attr(div25, "class", "col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12");
				attr(div26, "class", "row");
				attr(button, "type", "submit");
				attr(button, "class", "btn btn-success");
			},
			m(target, anchor) {
				insert(target, form, anchor);
				append(form, div1);
				append(div1, div0);
				append(div0, label0);
				append(div0, t1);
				append(div0, input0);
				set_input_value(input0, /*medicalHistory*/ ctx[5].date);
				append(form, t2);
				append(form, br0);
				append(form, t3);
				append(form, div10);
				append(div10, div9);
				append(div9, h50);
				append(div9, t5);
				append(div9, div8);
				append(div8, div3);
				append(div3, div2);
				append(div2, label1);
				append(div2, t7);
				append(div2, input1);
				append(div8, t8);
				append(div8, div5);
				append(div5, div4);
				append(div4, label2);
				append(div4, t10);
				append(div4, input2);
				append(div8, t11);
				append(div8, div7);
				append(div7, div6);
				append(div6, label3);
				append(div6, t13);
				append(div6, input3);
				append(form, t14);
				append(form, div24);
				append(div24, div23);
				append(div23, h51);
				append(div23, t16);
				append(div23, div17);
				append(div17, div12);
				append(div12, div11);
				append(div11, label4);
				append(div11, t18);
				append(div11, h52);
				append(h52, t19);
				append(div17, t20);
				append(div17, div14);
				append(div14, div13);
				append(div13, label5);
				append(div13, t22);
				append(div13, h53);
				append(h53, t23);
				append(div17, t24);
				append(div17, div16);
				append(div16, div15);
				append(div15, label6);
				append(div15, t26);
				append(div15, h54);
				append(h54, t27);
				append(div23, t28);
				append(div23, div22);
				append(div22, div19);
				append(div19, div18);
				append(div18, label7);
				append(div18, t30);
				append(div18, h55);
				append(h55, t31);
				append(div22, t32);
				append(div22, div21);
				append(div21, div20);
				append(div20, label8);
				append(div20, t34);
				append(div20, h56);
				append(h56, t35);
				append(form, t36);
				append(form, table0);
				append(table0, thead0);
				append(thead0, tr0);
				append(tr0, th0);
				append(tr0, t38);

				for (let i = 0; i < each_blocks_3.length; i += 1) {
					if (each_blocks_3[i]) {
						each_blocks_3[i].m(tr0, null);
					}
				}

				append(table0, t39);
				append(table0, tbody0);

				for (let i = 0; i < each_blocks_2.length; i += 1) {
					if (each_blocks_2[i]) {
						each_blocks_2[i].m(tbody0, null);
					}
				}

				append(form, t40);
				append(form, table1);
				append(table1, thead1);
				append(thead1, tr1);
				append(tr1, th1);
				append(tr1, t42);

				for (let i = 0; i < each_blocks_1.length; i += 1) {
					if (each_blocks_1[i]) {
						each_blocks_1[i].m(tr1, null);
					}
				}

				append(table1, t43);
				append(table1, tbody1);

				for (let i = 0; i < each_blocks.length; i += 1) {
					if (each_blocks[i]) {
						each_blocks[i].m(tbody1, null);
					}
				}

				append(form, t44);
				append(form, div26);
				append(div26, div25);
				append(div25, label9);
				append(div25, t46);
				append(div25, textarea);
				set_input_value(textarea, /*medicalHistory*/ ctx[5].observations);
				append(form, t47);
				append(form, br1);
				append(form, t48);
				append(form, button);

				if (!mounted) {
					dispose = [
						listen(input0, "input", /*input0_input_handler*/ ctx[20]),
						listen(textarea, "input", /*textarea_input_handler*/ ctx[23]),
						listen(form, "submit", prevent_default(/*onSubmitHandler*/ ctx[16]))
					];

					mounted = true;
				}
			},
			p(ctx, dirty) {
				if (dirty[0] & /*medicalHistory*/ 32) {
					set_input_value(input0, /*medicalHistory*/ ctx[5].date);
				}

				if (dirty[0] & /*petSelected*/ 512 && input1_value_value !== (input1_value_value = /*petSelected*/ ctx[9].customer) && input1.value !== input1_value_value) {
					input1.value = input1_value_value;
				}

				if (dirty[0] & /*petSelected*/ 512 && input2_value_value !== (input2_value_value = /*petSelected*/ ctx[9].customerIdCard) && input2.value !== input2_value_value) {
					input2.value = input2_value_value;
				}

				if (dirty[0] & /*petSelected*/ 512 && input3_value_value !== (input3_value_value = /*petSelected*/ ctx[9].email) && input3.value !== input3_value_value) {
					input3.value = input3_value_value;
				}

				if (dirty[0] & /*petSelected*/ 512 && t19_value !== (t19_value = /*petSelected*/ ctx[9].name + "")) set_data(t19, t19_value);
				if (dirty[0] & /*petSelected*/ 512 && t23_value !== (t23_value = /*petSelected*/ ctx[9].petType + "")) set_data(t23, t23_value);
				if (dirty[0] & /*petSelected*/ 512 && t27_value !== (t27_value = /*petSelected*/ ctx[9].breed + "")) set_data(t27, t27_value);
				if (dirty[0] & /*petSelected*/ 512 && t31_value !== (t31_value = /*petSelected*/ ctx[9].gender + "")) set_data(t31, t31_value);
				if (dirty[0] & /*petSelected*/ 512 && t35_value !== (t35_value = /*petSelected*/ ctx[9].color + "")) set_data(t35, t35_value);

				if (dirty[0] & /*diseasesStatuses*/ 4) {
					each_value_5 = ensure_array_like(/*diseasesStatuses*/ ctx[2]);
					let i;

					for (i = 0; i < each_value_5.length; i += 1) {
						const child_ctx = get_each_context_5(ctx, each_value_5, i);

						if (each_blocks_3[i]) {
							each_blocks_3[i].p(child_ctx, dirty);
						} else {
							each_blocks_3[i] = create_each_block_5(child_ctx);
							each_blocks_3[i].c();
							each_blocks_3[i].m(tr0, null);
						}
					}

					for (; i < each_blocks_3.length; i += 1) {
						each_blocks_3[i].d(1);
					}

					each_blocks_3.length = each_value_5.length;
				}

				if (dirty[0] & /*diseasesStatuses, diseases, addDiseaseStatus*/ 1030) {
					each_value_3 = ensure_array_like(/*diseases*/ ctx[1]);
					let i;

					for (i = 0; i < each_value_3.length; i += 1) {
						const child_ctx = get_each_context_3(ctx, each_value_3, i);

						if (each_blocks_2[i]) {
							each_blocks_2[i].p(child_ctx, dirty);
						} else {
							each_blocks_2[i] = create_each_block_3(child_ctx);
							each_blocks_2[i].c();
							each_blocks_2[i].m(tbody0, null);
						}
					}

					for (; i < each_blocks_2.length; i += 1) {
						each_blocks_2[i].d(1);
					}

					each_blocks_2.length = each_value_3.length;
				}

				if (dirty[0] & /*behaviorsStatuses*/ 16) {
					each_value_2 = ensure_array_like(/*behaviorsStatuses*/ ctx[4]);
					let i;

					for (i = 0; i < each_value_2.length; i += 1) {
						const child_ctx = get_each_context_2(ctx, each_value_2, i);

						if (each_blocks_1[i]) {
							each_blocks_1[i].p(child_ctx, dirty);
						} else {
							each_blocks_1[i] = create_each_block_2(child_ctx);
							each_blocks_1[i].c();
							each_blocks_1[i].m(tr1, null);
						}
					}

					for (; i < each_blocks_1.length; i += 1) {
						each_blocks_1[i].d(1);
					}

					each_blocks_1.length = each_value_2.length;
				}

				if (dirty[0] & /*behaviorsStatuses, behaviors, addBehaviorStatus*/ 2072) {
					each_value = ensure_array_like(/*behaviors*/ ctx[3]);
					let i;

					for (i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context$1(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
						} else {
							each_blocks[i] = create_each_block$1(child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(tbody1, null);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}

					each_blocks.length = each_value.length;
				}

				if (dirty[0] & /*medicalHistory*/ 32) {
					set_input_value(textarea, /*medicalHistory*/ ctx[5].observations);
				}
			},
			d(detaching) {
				if (detaching) {
					detach(form);
				}

				destroy_each(each_blocks_3, detaching);
				destroy_each(each_blocks_2, detaching);
				destroy_each(each_blocks_1, detaching);
				destroy_each(each_blocks, detaching);
				mounted = false;
				run_all(dispose);
			}
		};
	}

	// (518:7) {#each diseasesStatuses as item}
	function create_each_block_5(ctx) {
		let th;
		let t_value = /*item*/ ctx[40].name + "";
		let t;

		return {
			c() {
				th = element("th");
				t = text(t_value);
			},
			m(target, anchor) {
				insert(target, th, anchor);
				append(th, t);
			},
			p(ctx, dirty) {
				if (dirty[0] & /*diseasesStatuses*/ 4 && t_value !== (t_value = /*item*/ ctx[40].name + "")) set_data(t, t_value);
			},
			d(detaching) {
				if (detaching) {
					detach(th);
				}
			}
		};
	}

	// (527:8) {#each diseasesStatuses as ds}
	function create_each_block_4(ctx) {
		let td;
		let input;
		let input_id_value;
		let input_name_value;
		let mounted;
		let dispose;

		function change_handler() {
			return /*change_handler*/ ctx[21](/*d*/ ctx[43], /*ds*/ ctx[46]);
		}

		return {
			c() {
				td = element("td");
				input = element("input");
				attr(input, "type", "radio");
				attr(input, "id", input_id_value = "" + (/*d*/ ctx[43].id + "-" + /*ds*/ ctx[46].id + "-chkdds"));
				attr(input, "name", input_name_value = "" + (/*d*/ ctx[43].id + "-chkdds"));
			},
			m(target, anchor) {
				insert(target, td, anchor);
				append(td, input);

				if (!mounted) {
					dispose = listen(input, "change", change_handler);
					mounted = true;
				}
			},
			p(new_ctx, dirty) {
				ctx = new_ctx;

				if (dirty[0] & /*diseases, diseasesStatuses*/ 6 && input_id_value !== (input_id_value = "" + (/*d*/ ctx[43].id + "-" + /*ds*/ ctx[46].id + "-chkdds"))) {
					attr(input, "id", input_id_value);
				}

				if (dirty[0] & /*diseases*/ 2 && input_name_value !== (input_name_value = "" + (/*d*/ ctx[43].id + "-chkdds"))) {
					attr(input, "name", input_name_value);
				}
			},
			d(detaching) {
				if (detaching) {
					detach(td);
				}

				mounted = false;
				dispose();
			}
		};
	}

	// (524:6) {#each diseases as d}
	function create_each_block_3(ctx) {
		let tr;
		let td;
		let t0_value = /*d*/ ctx[43].name + "";
		let t0;
		let t1;
		let t2;
		let each_value_4 = ensure_array_like(/*diseasesStatuses*/ ctx[2]);
		let each_blocks = [];

		for (let i = 0; i < each_value_4.length; i += 1) {
			each_blocks[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
		}

		return {
			c() {
				tr = element("tr");
				td = element("td");
				t0 = text(t0_value);
				t1 = space();

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				t2 = space();
			},
			m(target, anchor) {
				insert(target, tr, anchor);
				append(tr, td);
				append(td, t0);
				append(tr, t1);

				for (let i = 0; i < each_blocks.length; i += 1) {
					if (each_blocks[i]) {
						each_blocks[i].m(tr, null);
					}
				}

				append(tr, t2);
			},
			p(ctx, dirty) {
				if (dirty[0] & /*diseases*/ 2 && t0_value !== (t0_value = /*d*/ ctx[43].name + "")) set_data(t0, t0_value);

				if (dirty[0] & /*diseases, diseasesStatuses, addDiseaseStatus*/ 1030) {
					each_value_4 = ensure_array_like(/*diseasesStatuses*/ ctx[2]);
					let i;

					for (i = 0; i < each_value_4.length; i += 1) {
						const child_ctx = get_each_context_4(ctx, each_value_4, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
						} else {
							each_blocks[i] = create_each_block_4(child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(tr, t2);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}

					each_blocks.length = each_value_4.length;
				}
			},
			d(detaching) {
				if (detaching) {
					detach(tr);
				}

				destroy_each(each_blocks, detaching);
			}
		};
	}

	// (551:7) {#each behaviorsStatuses as item}
	function create_each_block_2(ctx) {
		let th;
		let t_value = /*item*/ ctx[40].name + "";
		let t;

		return {
			c() {
				th = element("th");
				t = text(t_value);
			},
			m(target, anchor) {
				insert(target, th, anchor);
				append(th, t);
			},
			p(ctx, dirty) {
				if (dirty[0] & /*behaviorsStatuses*/ 16 && t_value !== (t_value = /*item*/ ctx[40].name + "")) set_data(t, t_value);
			},
			d(detaching) {
				if (detaching) {
					detach(th);
				}
			}
		};
	}

	// (560:8) {#each behaviorsStatuses as bs}
	function create_each_block_1(ctx) {
		let td;
		let input;
		let input_id_value;
		let input_name_value;
		let mounted;
		let dispose;

		function change_handler_1() {
			return /*change_handler_1*/ ctx[22](/*b*/ ctx[34], /*bs*/ ctx[37]);
		}

		return {
			c() {
				td = element("td");
				input = element("input");
				attr(input, "type", "radio");
				attr(input, "id", input_id_value = "" + (/*b*/ ctx[34].id + "-" + /*bs*/ ctx[37].id + "-chkbbs"));
				attr(input, "name", input_name_value = "" + (/*b*/ ctx[34].id + "-chkbbs"));
			},
			m(target, anchor) {
				insert(target, td, anchor);
				append(td, input);

				if (!mounted) {
					dispose = listen(input, "change", change_handler_1);
					mounted = true;
				}
			},
			p(new_ctx, dirty) {
				ctx = new_ctx;

				if (dirty[0] & /*behaviors, behaviorsStatuses*/ 24 && input_id_value !== (input_id_value = "" + (/*b*/ ctx[34].id + "-" + /*bs*/ ctx[37].id + "-chkbbs"))) {
					attr(input, "id", input_id_value);
				}

				if (dirty[0] & /*behaviors*/ 8 && input_name_value !== (input_name_value = "" + (/*b*/ ctx[34].id + "-chkbbs"))) {
					attr(input, "name", input_name_value);
				}
			},
			d(detaching) {
				if (detaching) {
					detach(td);
				}

				mounted = false;
				dispose();
			}
		};
	}

	// (557:6) {#each behaviors as b}
	function create_each_block$1(ctx) {
		let tr;
		let td;
		let t0_value = /*b*/ ctx[34].name + "";
		let t0;
		let t1;
		let t2;
		let each_value_1 = ensure_array_like(/*behaviorsStatuses*/ ctx[4]);
		let each_blocks = [];

		for (let i = 0; i < each_value_1.length; i += 1) {
			each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
		}

		return {
			c() {
				tr = element("tr");
				td = element("td");
				t0 = text(t0_value);
				t1 = space();

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				t2 = space();
			},
			m(target, anchor) {
				insert(target, tr, anchor);
				append(tr, td);
				append(td, t0);
				append(tr, t1);

				for (let i = 0; i < each_blocks.length; i += 1) {
					if (each_blocks[i]) {
						each_blocks[i].m(tr, null);
					}
				}

				append(tr, t2);
			},
			p(ctx, dirty) {
				if (dirty[0] & /*behaviors*/ 8 && t0_value !== (t0_value = /*b*/ ctx[34].name + "")) set_data(t0, t0_value);

				if (dirty[0] & /*behaviors, behaviorsStatuses, addBehaviorStatus*/ 2072) {
					each_value_1 = ensure_array_like(/*behaviorsStatuses*/ ctx[4]);
					let i;

					for (i = 0; i < each_value_1.length; i += 1) {
						const child_ctx = get_each_context_1(ctx, each_value_1, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
						} else {
							each_blocks[i] = create_each_block_1(child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(tr, t2);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}

					each_blocks.length = each_value_1.length;
				}
			},
			d(detaching) {
				if (detaching) {
					detach(tr);
				}

				destroy_each(each_blocks, detaching);
			}
		};
	}

	function create_fragment$1(ctx) {
		let div5;
		let div4;
		let div3;
		let div2;
		let div1;
		let div0;
		let advancedsearch;
		let t0;
		let t1;
		let current;

		advancedsearch = new AdvancedSearch({
				props: { value: /*value*/ ctx[6], placeholder }
			});

		advancedsearch.$on("input", /*onInput*/ ctx[12]);
		advancedsearch.$on("focus", /*onFocus*/ ctx[13]);
		advancedsearch.$on("blur", /*onBlur*/ ctx[14]);
		let if_block0 = /*pets*/ ctx[7].length > 0 && !/*isPetSelected*/ ctx[8] && create_if_block_1(ctx);
		let if_block1 = /*petSelected*/ ctx[9].id > 0 | /*editStatus*/ ctx[0] && create_if_block$1(ctx);

		return {
			c() {
				div5 = element("div");
				div4 = element("div");
				div3 = element("div");
				div2 = element("div");
				div1 = element("div");
				div0 = element("div");
				create_component(advancedsearch.$$.fragment);
				t0 = space();
				if (if_block0) if_block0.c();
				t1 = space();
				if (if_block1) if_block1.c();
				attr(div0, "class", "input-group");
				attr(div1, "class", "form-group");
				attr(div2, "class", "col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12");
				attr(div3, "class", "row");
				attr(div4, "class", "card-body");
				attr(div5, "class", "card");
			},
			m(target, anchor) {
				insert(target, div5, anchor);
				append(div5, div4);
				append(div4, div3);
				append(div3, div2);
				append(div2, div1);
				append(div1, div0);
				mount_component(advancedsearch, div0, null);
				append(div1, t0);
				if (if_block0) if_block0.m(div1, null);
				append(div4, t1);
				if (if_block1) if_block1.m(div4, null);
				current = true;
			},
			p(ctx, dirty) {
				const advancedsearch_changes = {};
				if (dirty[0] & /*value*/ 64) advancedsearch_changes.value = /*value*/ ctx[6];
				advancedsearch.$set(advancedsearch_changes);

				if (/*pets*/ ctx[7].length > 0 && !/*isPetSelected*/ ctx[8]) {
					if (if_block0) {
						if_block0.p(ctx, dirty);
					} else {
						if_block0 = create_if_block_1(ctx);
						if_block0.c();
						if_block0.m(div1, null);
					}
				} else if (if_block0) {
					if_block0.d(1);
					if_block0 = null;
				}

				if (/*petSelected*/ ctx[9].id > 0 | /*editStatus*/ ctx[0]) {
					if (if_block1) {
						if_block1.p(ctx, dirty);
					} else {
						if_block1 = create_if_block$1(ctx);
						if_block1.c();
						if_block1.m(div4, null);
					}
				} else if (if_block1) {
					if_block1.d(1);
					if_block1 = null;
				}
			},
			i(local) {
				if (current) return;
				transition_in(advancedsearch.$$.fragment, local);
				current = true;
			},
			o(local) {
				transition_out(advancedsearch.$$.fragment, local);
				current = false;
			},
			d(detaching) {
				if (detaching) {
					detach(div5);
				}

				destroy_component(advancedsearch);
				if (if_block0) if_block0.d();
				if (if_block1) if_block1.d();
			}
		};
	}

	let placeholder = "Buscar cliente/mascota";

	function instance$1($$self, $$props, $$invalidate) {
		let { newRecord } = $$props;
		let { editStatus } = $$props;
		let { historyEdited } = $$props;
		let { initialLoad } = $$props;
		let diseases = [], diseasesStatuses = [], behaviors = [], behaviorsStatuses = [];
		let healthChecks = [];

		let medicalHistory = {
			petId: "",
			date: "",
			healthChecks: [],
			behaviorTests: [],
			observations: ""
		};

		const formatDate = (date = null) => {
			let now = new Date();

			if (date) {
				now = new Date(date);
			}

			let month, day, year;

			//let dateString;
			(month = "" + (now.getMonth() + 1), day = "" + now.getDate(), year = now.getFullYear());

			if (month.length < 2) month = "0" + month;
			if (day.length < 2) day = "0" + day;
			return [year, month, day].join("-");
		};

		onMount(async () => {
			console.log("starting");

			await client.get("/gateway/Diseases/").then(response => {
				$$invalidate(1, diseases = response);
			});

			await client.get("/gateway/DiseaseStatus/").then(response => {
				$$invalidate(2, diseasesStatuses = response);
			});

			await client.get("/gateway/Behaviors/").then(response => {
				$$invalidate(3, behaviors = response);
			});

			await client.get("/gateway/BehaviorStatus/").then(response => {
				$$invalidate(4, behaviorsStatuses = response);
			});

			if (!editStatus) {
				$$invalidate(5, medicalHistory.date = formatDate(), medicalHistory);
			}

			if (editStatus) {
				await client.get("/gateway/MedicalHistories/" + historyEdited.id).then(response => {
					let tempArray = JSON.parse(response.payload);
					console.log(tempArray);
					console.log(behaviorsStatuses);
					let objData = tempArray[0][0];
					$$invalidate(9, petSelected.customer = objData.businessName, petSelected);
					$$invalidate(9, petSelected.customerIdCard = objData.idCard, petSelected);
					$$invalidate(9, petSelected.id = objData.petId, petSelected);
					$$invalidate(9, petSelected.name = objData.name, petSelected);
					$$invalidate(9, petSelected.email = objData.email, petSelected);
					$$invalidate(9, petSelected.petType = objData.pettype, petSelected);
					$$invalidate(9, petSelected.age = objData.age, petSelected);
					$$invalidate(9, petSelected.color = objData.color, petSelected);
					$$invalidate(9, petSelected.breed = objData.breed, petSelected);
					$$invalidate(9, petSelected.gender = objData.gender, petSelected);
					$$invalidate(5, medicalHistory.id = objData.id, medicalHistory);

					// let editedDate = new Date(objData.date);
					// console.log(editedDate);
					// (month = "" + (editedDate.getMonth() + 1)),
					// 	(day = "" + editedDate.getDate()),
					// 	(year = editedDate.getFullYear());
					// if (month.length < 2) month = "0" + month;
					// if (day.length < 2) day = "0" + day;
					// dateString = [year, month, day].join("-");
					$$invalidate(5, medicalHistory.date = formatDate(objData.date), medicalHistory);

					$$invalidate(5, medicalHistory.observations = objData.observations, medicalHistory);
					healthChecks = tempArray[1];

					tempArray[1].forEach((value, key) => {
						addDiseaseStatus(value.diseaseId, value.diseaseStatusId, false);
						document.getElementById(`${value.diseaseId}-${value.diseaseStatusId}-chkdds`).checked = true;
					});

					behaviorTests = tempArray[2];

					tempArray[2].forEach((value, key) => {
						addBehaviorStatus(value.behaviorId, value.behaviorStatusId);
						document.getElementById(`${value.behaviorId}-${value.behaviorStatusId}-chkbbs`).checked = true;
					});
				}).catch(error => {
					console.log(error);
				});
			}
		});

		function addDisease(d, ds) {
			healthChecks.push({
				medicalHistoryId: editStatus ? medicalHistory.id : 0,
				diseaseId: d,
				diseaseStatusId: ds
			});
		}

		const updateHealthCheck = async (d, ds) => {
			let id = healthChecks.find(check => check.diseaseId === d && check.diseaseStatusId === ds).id;

			let checkUpdated = {
				id,
				medicalHistoryId: medicalHistory.id,
				diseaseId: d,
				diseaseStatusId: ds
			};

			await client.put("/gateway/HealthChecks/" + id, checkUpdated).then(response => {
				toast({
					type: "success",
					message: "Actualizada exitosamente"
				});
			}).catch(error => {
				console.log(error);
			});
		};

		function addDiseaseStatus(d, ds, dbUp) {
			if (healthChecks.some(check => check.diseaseId === d)) {
				healthChecks.find(check => check.diseaseId === d).diseaseStatusId = ds;

				if (editStatus && dbUp) {
					updateHealthCheck(d, ds);
				}
			} else {
				addDisease(d, ds);
			}
		}

		let behaviorTests = [];

		function addBehavior(d, ds) {
			behaviorTests.push({
				medicalHistoryId: editStatus ? medicalHistory.id : 0,
				behaviorId: d,
				behaviorStatusId: ds
			});
		}

		const updateBehaviorTest = async (b, bs) => {
			let id = behaviorTests.find(behavior => behavior.behaviorId === b && behavior.behaviorStatusId === bs).id;

			let testUpdated = {
				id,
				medicalHistoryId: medicalHistory.id,
				behaviorId: b,
				behaviorStatusId: bs
			};

			await client.put("/gateway/BehaviorTests/" + id, testUpdated).then(response => {
				toast({
					type: "success",
					message: "Actualizado exitosamente"
				});
			}).catch(error => {
				console.log(error);
			});
		};

		function addBehaviorStatus(b, bs, dbUp) {
			if (behaviorTests.some(test => test.behaviorId === b)) {
				behaviorTests.find(test => test.behaviorId === b).behaviorStatusId = bs;

				if (editStatus && dbUp) {
					updateBehaviorTest(b, bs);
				}
			} else {
				addBehavior(d, ds);
			}
		}

		let value = "";

		//const onInput = (e) => (value = e.target.value)
		let pets = [];

		const onInput = async e => {
			$$invalidate(6, value = e.target.value);
			console.log(value);

			if (value.length >= 3) {
				showLoader();
				let data = { tipo: 2, textSearch: value };

				await client.get(`/gateway/pets/search?json=` + JSON.stringify(data)).then(response => {
					hideLoader();

					if (response.code == 1) {
						$$invalidate(7, pets = JSON.parse(response.payload));
						console.log(pets);
					}
				}).catch(error => {
					hideLoader();
					console.log(error);
				});
			} else if (pets.length > 0) {
				$$invalidate(7, pets = []);
			}
		};

		const onFocus = () => true;

		const onBlur = () => {
			if (!value) {
				$$invalidate(7, pets = []);
				$$invalidate(6, value = "");
			}
		};

		let isPetSelected = false;
		let petSelected = {};

		const selectPet = e => {
			$$invalidate(8, isPetSelected = true);
			$$invalidate(9, petSelected = e);
			$$invalidate(6, value = "");
			$$invalidate(7, pets = []);
		};

		const addHistory = async () => {
			if (!petSelected.id) {
				toast({
					type: "warning",
					message: "Debe asignar un cliente"
				});

				return;
			}

			if (healthChecks.length == 0) {
				toast({
					type: "warning",
					message: "Debe registrar el test de salud"
				});

				return;
			}

			if (behaviorTests.length == 0) {
				toast({
					type: "warning",
					message: "Debe de registrar los test de comportamiento"
				});

				return;
			}

			const newHistory = {
				petId: petSelected.id,
				date: medicalHistory.date,
				healthChecks,
				behaviorTests,
				observations: medicalHistory.observations
			};

			await client.post("/gateway/MedicalHistories/", newHistory).then(response => {
				toast({
					type: "success",
					message: "Registrado exitosamente"
				});

				$$invalidate(17, newRecord = false);

				setTimeout(
					() => {
						window.location.reload();
					},
					500
				);
			}).catch(error => {
				console.log(error);
			});

			$$invalidate(5, medicalHistory = {});
		};

		const updateHistory = async () => {
			if (!medicalHistory.id) {
				toast({
					type: "warning",
					message: "No se encontro el recurso para editar"
				});

				return;
			}

			if (healthChecks.length == 0) {
				toast({
					type: "warning",
					message: "Debe registrar el test de salud"
				});

				return;
			}

			if (behaviorTests.length == 0) {
				toast({
					type: "warning",
					message: "Debe de registrar los test de comportamiento"
				});

				return;
			}

			const updatedHistory = {
				id: medicalHistory.id,
				petId: petSelected.id,
				date: medicalHistory.date,
				healthChecks,
				behaviorTests,
				observations: medicalHistory.observations
			};

			await client.put("/gateway/MedicalHistories/" + medicalHistory.id, updatedHistory).then(response => {
				toast({
					type: "success",
					message: "Actualizada exitosamente"
				});

				$$invalidate(17, newRecord = false);

				setTimeout(
					() => {
						window.location.reload();
					},
					500
				);
			}).catch(error => {
				console.log(error);
			});

			$$invalidate(5, medicalHistory = {});
			$$invalidate(0, editStatus = false);
			initialLoad();
		};

		const onSubmitHandler = () => {
			if (editStatus) {
				updateHistory();
			} else {
				addHistory();
			}
		};

		function input0_input_handler() {
			medicalHistory.date = this.value;
			$$invalidate(5, medicalHistory);
		}

		const change_handler = (d, ds) => addDiseaseStatus(d.id, ds.id, true);
		const change_handler_1 = (b, bs) => addBehaviorStatus(b.id, bs.id, true);

		function textarea_input_handler() {
			medicalHistory.observations = this.value;
			$$invalidate(5, medicalHistory);
		}

		$$self.$$set = $$props => {
			if ('newRecord' in $$props) $$invalidate(17, newRecord = $$props.newRecord);
			if ('editStatus' in $$props) $$invalidate(0, editStatus = $$props.editStatus);
			if ('historyEdited' in $$props) $$invalidate(18, historyEdited = $$props.historyEdited);
			if ('initialLoad' in $$props) $$invalidate(19, initialLoad = $$props.initialLoad);
		};

		return [
			editStatus,
			diseases,
			diseasesStatuses,
			behaviors,
			behaviorsStatuses,
			medicalHistory,
			value,
			pets,
			isPetSelected,
			petSelected,
			addDiseaseStatus,
			addBehaviorStatus,
			onInput,
			onFocus,
			onBlur,
			selectPet,
			onSubmitHandler,
			newRecord,
			historyEdited,
			initialLoad,
			input0_input_handler,
			change_handler,
			change_handler_1,
			textarea_input_handler
		];
	}

	class Add extends SvelteComponent {
		constructor(options) {
			super();

			init(
				this,
				options,
				instance$1,
				create_fragment$1,
				safe_not_equal,
				{
					newRecord: 17,
					editStatus: 0,
					historyEdited: 18,
					initialLoad: 19
				},
				null,
				[-1, -1]
			);
		}
	}

	/* App\lib\PetMedicalHistory\PetMedicalHistory.svelte generated by Svelte v4.0.5 */

	function get_each_context(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[15] = list[i];
		return child_ctx;
	}

	// (181:0) {:else}
	function create_else_block(ctx) {
		let search;
		let updating_searchTerm;
		let current;

		function search_searchTerm_binding(value) {
			/*search_searchTerm_binding*/ ctx[13](value);
		}

		let search_props = { placeholder: "Buscar Mascota" };

		if (/*searchTerm*/ ctx[2] !== void 0) {
			search_props.searchTerm = /*searchTerm*/ ctx[2];
		}

		search = new Search({ props: search_props });
		binding_callbacks.push(() => bind$1(search, 'searchTerm', search_searchTerm_binding));
		search.$on("input", /*searchRecords*/ ctx[10]);

		return {
			c() {
				create_component(search.$$.fragment);
			},
			m(target, anchor) {
				mount_component(search, target, anchor);
				current = true;
			},
			p(ctx, dirty) {
				const search_changes = {};

				if (!updating_searchTerm && dirty & /*searchTerm*/ 4) {
					updating_searchTerm = true;
					search_changes.searchTerm = /*searchTerm*/ ctx[2];
					add_flush_callback(() => updating_searchTerm = false);
				}

				search.$set(search_changes);
			},
			i(local) {
				if (current) return;
				transition_in(search.$$.fragment, local);
				current = true;
			},
			o(local) {
				transition_out(search.$$.fragment, local);
				current = false;
			},
			d(detaching) {
				destroy_component(search, detaching);
			}
		};
	}

	// (179:0) {#if newRecord | editStatus}
	function create_if_block(ctx) {
		let add;
		let current;

		add = new Add({
				props: {
					newRecord: /*newRecord*/ ctx[0],
					editStatus: /*editStatus*/ ctx[3],
					historyEdited: /*historyEdited*/ ctx[4],
					initialLoad: /*initialLoad*/ ctx[6]
				}
			});

		return {
			c() {
				create_component(add.$$.fragment);
			},
			m(target, anchor) {
				mount_component(add, target, anchor);
				current = true;
			},
			p(ctx, dirty) {
				const add_changes = {};
				if (dirty & /*newRecord*/ 1) add_changes.newRecord = /*newRecord*/ ctx[0];
				if (dirty & /*editStatus*/ 8) add_changes.editStatus = /*editStatus*/ ctx[3];
				if (dirty & /*historyEdited*/ 16) add_changes.historyEdited = /*historyEdited*/ ctx[4];
				add.$set(add_changes);
			},
			i(local) {
				if (current) return;
				transition_in(add.$$.fragment, local);
				current = true;
			},
			o(local) {
				transition_out(add.$$.fragment, local);
				current = false;
			},
			d(detaching) {
				destroy_component(add, detaching);
			}
		};
	}

	// (203:5) {#each medicalHistories as item}
	function create_each_block(ctx) {
		let tr;
		let td0;
		let t0_value = /*item*/ ctx[15].customer + "";
		let t0;
		let t1;
		let td1;
		let t2_value = /*item*/ ctx[15].petName + "";
		let t2;
		let t3;
		let td2;
		let t4_value = /*formatDate*/ ctx[9](/*item*/ ctx[15].date) + "";
		let t4;
		let t5;
		let td3;
		let t6_value = /*item*/ ctx[15].observations + "";
		let t6;
		let t7;
		let td4;
		let button0;
		let t8;
		let button1;
		let t9;
		let button2;
		let t10;
		let mounted;
		let dispose;

		return {
			c() {
				tr = element("tr");
				td0 = element("td");
				t0 = text(t0_value);
				t1 = space();
				td1 = element("td");
				t2 = text(t2_value);
				t3 = space();
				td2 = element("td");
				t4 = text(t4_value);
				t5 = space();
				td3 = element("td");
				t6 = text(t6_value);
				t7 = space();
				td4 = element("td");
				button0 = element("button");
				button0.innerHTML = `<i class="ti-trash"></i>`;
				t8 = space();
				button1 = element("button");
				button1.innerHTML = `<i class="ti-pencil"></i>`;
				t9 = space();
				button2 = element("button");
				button2.innerHTML = `<i class="fa fa-file-pdf"></i>`;
				t10 = space();
				attr(button0, "class", "btn btn-outline-danger btn-sm");
				attr(button1, "class", "btn btn-outline-warning btn-sm");
				attr(button2, "class", "btn btn-outline-danger btn-sm");
				attr(button2, "title", "Obtener Reporte");
			},
			m(target, anchor) {
				insert(target, tr, anchor);
				append(tr, td0);
				append(td0, t0);
				append(tr, t1);
				append(tr, td1);
				append(td1, t2);
				append(tr, t3);
				append(tr, td2);
				append(td2, t4);
				append(tr, t5);
				append(tr, td3);
				append(td3, t6);
				append(tr, t7);
				append(tr, td4);
				append(td4, button0);
				append(td4, t8);
				append(td4, button1);
				append(td4, t9);
				append(td4, button2);
				append(tr, t10);

				if (!mounted) {
					dispose = [
						listen(button0, "click", function () {
							if (is_function(/*deleteHistory*/ ctx[8](/*item*/ ctx[15].id))) /*deleteHistory*/ ctx[8](/*item*/ ctx[15].id).apply(this, arguments);
						}),
						listen(button1, "click", function () {
							if (is_function(/*editHistory*/ ctx[11](/*item*/ ctx[15]))) /*editHistory*/ ctx[11](/*item*/ ctx[15]).apply(this, arguments);
						}),
						listen(button2, "click", function () {
							if (is_function(/*getReport*/ ctx[7](/*item*/ ctx[15].id))) /*getReport*/ ctx[7](/*item*/ ctx[15].id).apply(this, arguments);
						})
					];

					mounted = true;
				}
			},
			p(new_ctx, dirty) {
				ctx = new_ctx;
				if (dirty & /*medicalHistories*/ 2 && t0_value !== (t0_value = /*item*/ ctx[15].customer + "")) set_data(t0, t0_value);
				if (dirty & /*medicalHistories*/ 2 && t2_value !== (t2_value = /*item*/ ctx[15].petName + "")) set_data(t2, t2_value);
				if (dirty & /*medicalHistories*/ 2 && t4_value !== (t4_value = /*formatDate*/ ctx[9](/*item*/ ctx[15].date) + "")) set_data(t4, t4_value);
				if (dirty & /*medicalHistories*/ 2 && t6_value !== (t6_value = /*item*/ ctx[15].observations + "")) set_data(t6, t6_value);
			},
			d(detaching) {
				if (detaching) {
					detach(tr);
				}

				mounted = false;
				run_all(dispose);
			}
		};
	}

	function create_fragment(ctx) {
		let div3;
		let div0;
		let t1;
		let div2;
		let div1;
		let button;
		let t3;
		let current_block_type_index;
		let if_block;
		let t4;
		let div6;
		let div5;
		let div4;
		let table;
		let caption;
		let t6;
		let thead;
		let t14;
		let tbody;
		let current;
		let mounted;
		let dispose;
		const if_block_creators = [create_if_block, create_else_block];
		const if_blocks = [];

		function select_block_type(ctx, dirty) {
			if (/*newRecord*/ ctx[0] | /*editStatus*/ ctx[3]) return 0;
			return 1;
		}

		current_block_type_index = select_block_type(ctx);
		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
		let each_value = ensure_array_like(/*medicalHistories*/ ctx[1]);
		let each_blocks = [];

		for (let i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
		}

		return {
			c() {
				div3 = element("div");
				div0 = element("div");
				div0.innerHTML = `<h5 class="text-themecolor">Registro Informado de Estetica Canina</h5>`;
				t1 = space();
				div2 = element("div");
				div1 = element("div");
				button = element("button");
				button.innerHTML = `<i class="fa fa-plus-circle"></i> Nuevo`;
				t3 = space();
				if_block.c();
				t4 = space();
				div6 = element("div");
				div5 = element("div");
				div4 = element("div");
				table = element("table");
				caption = element("caption");
				caption.textContent = "Registros";
				t6 = space();
				thead = element("thead");
				thead.innerHTML = `<tr><th>Cliente</th> <th>Mascota</th> <th>Fecha</th> <th>Obs</th></tr>`;
				t14 = space();
				tbody = element("tbody");

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				attr(div0, "class", "col-md-5 align-self-center");
				attr(button, "type", "button");
				attr(button, "class", "btn btn-info d-block d-lg-inline-block m-l-15");
				attr(div1, "class", "d-flex justify-content-end align-items-center");
				attr(div2, "class", "col-md-7 align-self-center text-right");
				attr(div3, "class", "row page-titles");
				attr(table, "class", "table");
				attr(div4, "class", "table-responsive");
				attr(div5, "class", "card-body");
				attr(div6, "class", "card");
			},
			m(target, anchor) {
				insert(target, div3, anchor);
				append(div3, div0);
				append(div3, t1);
				append(div3, div2);
				append(div2, div1);
				append(div1, button);
				insert(target, t3, anchor);
				if_blocks[current_block_type_index].m(target, anchor);
				insert(target, t4, anchor);
				insert(target, div6, anchor);
				append(div6, div5);
				append(div5, div4);
				append(div4, table);
				append(table, caption);
				append(table, t6);
				append(table, thead);
				append(table, t14);
				append(table, tbody);

				for (let i = 0; i < each_blocks.length; i += 1) {
					if (each_blocks[i]) {
						each_blocks[i].m(tbody, null);
					}
				}

				current = true;

				if (!mounted) {
					dispose = listen(button, "click", /*click_handler*/ ctx[12]);
					mounted = true;
				}
			},
			p(ctx, [dirty]) {
				let previous_block_index = current_block_type_index;
				current_block_type_index = select_block_type(ctx);

				if (current_block_type_index === previous_block_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				} else {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
					if_block = if_blocks[current_block_type_index];

					if (!if_block) {
						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block.c();
					} else {
						if_block.p(ctx, dirty);
					}

					transition_in(if_block, 1);
					if_block.m(t4.parentNode, t4);
				}

				if (dirty & /*getReport, medicalHistories, editHistory, deleteHistory, formatDate*/ 2946) {
					each_value = ensure_array_like(/*medicalHistories*/ ctx[1]);
					let i;

					for (i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
						} else {
							each_blocks[i] = create_each_block(child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(tbody, null);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}

					each_blocks.length = each_value.length;
				}
			},
			i(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o(local) {
				transition_out(if_block);
				current = false;
			},
			d(detaching) {
				if (detaching) {
					detach(div3);
					detach(t3);
					detach(t4);
					detach(div6);
				}

				if_blocks[current_block_type_index].d(detaching);
				destroy_each(each_blocks, detaching);
				mounted = false;
				dispose();
			}
		};
	}

	function instance($$self, $$props, $$invalidate) {
		let newRecord = false;

		function openNew(open) {
			$$invalidate(0, newRecord = open);
		}

		let medicalHistories = [];

		onMount(async () => {
			initialLoad();
		});

		const initialLoad = async () => {
			showLoader();

			await client.get("/gateway/MedicalHistories/").then(response => {
				if (response.code == "1") {
					$$invalidate(1, medicalHistories = JSON.parse(response.payload));
				}
			}).catch(error => {
				hideLoader();
				console.log(error);
			});

			hideLoader();
		};

		const getReport = async id => {
			//Add authentication headers as params
			// var params = {
			//     access_token: "An access_token",
			//     other_header: "other_header",
			// };
			//Add authentication headers in URL
			//var url = [url_generating_pdf, $.param(params)].join("?");
			//Open window
			//window.open(url);
			showLoader();

			await clientFile(`/gateway/MedicalHistories/Report/` + id).then(response => {
				var ieEDGE = navigator.userAgent.match(/Edge/g);
				var ie = navigator.userAgent.match(/.NET/g); // IE 11+
				var oldIE = navigator.userAgent.match(/MSIE/g);
				var blob = new window.Blob([response.data], { type: "application/pdf" });

				if (ie || oldIE || ieEDGE) {
					window.navigator.msSaveBlob(blob, fileName);
				} else {
					var fileURL = URL.createObjectURL(blob);
					window.open(fileURL);
				}

				hideLoader();
				return;

				// let fileName = response
				//     .headers()["content-disposition"].split(";")[1]
				//     .split("=")[1];
				let fileName = response.headers["content-disposition"].split(";")[1].split("=")[1].replace('"', "");
			}).catch(error => {
				hideLoader();
				console.log(error);
			});
		};

		const deleteHistory = async id => {
			let { isConfirmed } = await Swal.fire({
				text: "Esta seguro de eliminar este registro?",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				confirmButtonText: "Si, proceder!",
				cancelButtonText: "No, cancelar"
			});

			if (isConfirmed) {
				await client.delete("/gateway/MedicalHistories/" + id).then(response => {
					console.log(response);

					toast({
						type: "success",
						message: "Eliminada exitosamente"
					});

					pets = pets.filter(pet => pet.id !== id);
				}).catch(error => {
					console.log(error);
				});
			}
		};

		const formatDate = inputDate => {
			let date = new Date(inputDate);
			const day = String(date.getDate()).padStart(2, "0");
			const month = String(date.getMonth() + 1).padStart(2, "0");
			const year = String(date.getFullYear());
			return `${day}/${month}/${year}`;
		};

		let searchTerm = "";

		const searchRecords = () => {
			return medicalHistories.filter(item => {
				let petName = item.pet.name.toLowerCase();
				return petName.includes(searchTerm.toLowerCase());
			});
		};

		let editStatus = false;
		let historyEdited = {};

		const editHistory = item => {
			//toast({ type: "info", message: "Funcionalidad en construccion" });
			$$invalidate(3, editStatus = true);

			$$invalidate(4, historyEdited = item);
		};

		const click_handler = () => openNew(true);

		function search_searchTerm_binding(value) {
			searchTerm = value;
			$$invalidate(2, searchTerm);
		}

		return [
			newRecord,
			medicalHistories,
			searchTerm,
			editStatus,
			historyEdited,
			openNew,
			initialLoad,
			getReport,
			deleteHistory,
			formatDate,
			searchRecords,
			editHistory,
			click_handler,
			search_searchTerm_binding
		];
	}

	class PetMedicalHistory extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance, create_fragment, safe_not_equal, {});
		}
	}

	// import App from "./App.svelte"
	// const app = new App({
	//     target: document.getElementById('app'),
	// })
	// export default app

	// const breed = new PetBreed({
	//     target: document.getElementById('pet-breed'),
	// })

	// export default breed

	// const pet = new Pet({
	//     target: document.getElementById('pet'),
	// })

	//export default pet

	const petMH = new PetMedicalHistory({
	    target: document.getElementById('petMH'),
	});

	return petMH;

})();
