/**
 *
 * @namespace _.M
 */
;(function (_) {
    /*
     |--------------------------------------------------------------------------
     | Type Definitions
     |--------------------------------------------------------------------------
     */
    /**
     * Loop callback. Useful in _.each, _.map, _.omit,...
     * @callback loopCallback
     * @param value Item value
     * @param key Item name/index
     * @param object object of items
     *
     * @see http://underscorejs.org/#each
     * @see http://underscorejs.org/#map
     * @see http://underscorejs.org/#omit
     *
     * @example <caption>Alerts each number value in turn...</caption>
     * _.each([1, 2, 3], alert);
     * _.each({one: 1, two: 2, three: 3}, alert);
     * @example <caption>Log to console each number value in turn...</caption>
     * var logger = function(item, key, object){
     *  console.log(key, '=>', item, '<------ Object', object);
     * };
     * _.each([1, 2, 3], logger);
     * _.each({one: 1, two: 2, three: 3}, logger);
     *
     */

    /*
     |--------------------------------------------------------------------------
     | Core
     |--------------------------------------------------------------------------
     */

    /**
     * MaDnhJS version
     * @constant {string} VERSION
     * @default
     */
    var version = '1.2.4';

    var M = {};
    Object.defineProperty(M, 'VERSION', {
        value: version
    });

    var slice = Array.prototype.slice;


    /** Mixin method "module" to UnderscoreJS
     * This method help us to structure UnderscoreJS extensions as module
     */
    _.mixin({
        /**
         * @memberOf _
         * @param name Name of module, UPPER CASE
         * @param exports Module export object
         */
        module: function (name, exports) {
            Object.defineProperty(_, name.toString(), {
                value: exports
            });
        }
    });
    _.module('M', M);

    /**
     * Slice arguments of a function as array
     * @param args
     * @param {Number} [start]
     * @param {Number} [end]
     * @return {*}
     */
    M.sliceArguments = function (args, start, end) {
        return slice.apply(args, slice.call(arguments, 1));
    };

    /**
     * Loop over array or object like _.each but breakable
     * @param {object|array} obj Loop object
     * @param {loopCallback} callback callback apply on every item, return break value to break the loop
     * @param {string} [break_on=break] Value of callback result that break the loop, default is 'break'
     * @returns {*}
     * @example
     * _.M.loop([1,2,3,4,5], function(item){
     *  console.log('Number', item);
     *  if(item > 3){
     *      return 'break';
     *  }
     * });
     * //Console will log:
     * // Number 1
     * // Number 2
     * // Number 3
     *  @example
     * _.M.loop([1,2,3,4,5], function(item){
     *  console.log('Number', item);
     *  if(item > 3){
     *      return 'yahoo';
     *  }
     * }, 'yahoo');
     * //Console will log:
     * // Number 1
     * // Number 2
     * // Number 3
     *
     */
    M.loop = function (obj, callback, break_on) {
        var i, length;
        if (_.isUndefined(break_on)) {
            break_on = 'break';
        }
        if (_.isArray(obj)) {
            for (i = 0, length = obj.length; i < length; i++) {
                if (callback(obj[i], i, obj) === break_on) {
                    break;
                }
            }
        } else {
            var keys = _.keys(obj);
            for (i = 0, length = keys.length; i < length; i++) {
                if (callback(obj[keys[i]], keys[i], obj) === break_on) {
                    break;
                }
            }
        }
        return obj;
    };

    /**
     * Remove object keys
     * @param {object} obj Object
     * @param {string[]|loopCallback} args Array of item name or callback. If use callback then callback must return
     *     true/false to remove/keep item
     */
    M.removeItem = function (obj, args) {
        var keys = _.flatten(slice.call(arguments, 1));
        var removed = [], old_items = Object.keys(obj);

        if (keys.length == 1 && _.isFunction(keys[0])) {
            obj = _.omit(obj, keys[0]);
            removed = _.difference(old_items, _.keys(obj));
        } else {
            _.each(keys, function (key) {
                if (_.has(obj, key)) {
                    removed.push(key);
                    obj[key] = undefined;
                    delete  obj[key];
                }
            });
        }

        return removed;
    };

    var idCounter = {};
    /**
     * Return Next ID of type
     * @param {string} [type="unique_id"] Type of ID
     * @param {boolean} [type_as_prefix = true]  Use type as prefix of return ID
     * @returns {string|number}
     * @example <caption>Default type</caption>
     * _.M.nextID(); //unique_id_0
     * _.M.nextID(); //unique_id_1
     * _.M.nextID(null, false); //2
     * _.M.nextID('superman'); //superman_0
     * _.M.nextID('superman'); //superman_1
     * _.M.nextID(); //unique_id_3
     * _.M.nextID('superman', false); //2
     *
     */
    M.nextID = function (type, type_as_prefix) {
        if (_.isEmpty(type)) {
            type = 'unique_id';
        }
        if (!_.has(idCounter, type)) {
            idCounter[type] = 0;
        }

        var id = idCounter[type]++;

        return type_as_prefix || _.isUndefined(type_as_prefix) ? type + '_' + id : id;
    };

    /**
     * Return current ID of type
     * @param {string} [type="unique_id"] Type of ID
     * @param {boolean} [type_as_prefix = true] Use type as prefix of return ID
     * @returns {string|number}
     * @example
     * _.M.nextID(); //unique_id_0
     * _.M.nextID(); //unique_id_1
     * _.M.currentID(); //unique_id_1
     * _.M.currentID(null, false); //1
     * _.M.nextID('superman'); //superman_0
     * _.M.nextID('superman'); //superman_1
     * _.M.currentID('superman'); //superman_1
     * _.M.currentID('superman', false); //1
     * _.M.nextID(); //2
     * _.M.currentID(); //unique_id_2
     */
    M.currentID = function (type, type_as_prefix) {
        var id = 0;

        if (_.isEmpty(type)) {
            type = 'unique_id';
        }
        if (_.has(idCounter, type)) {
            id = idCounter[type] - 1;
        }


        return type_as_prefix || _.isUndefined(type_as_prefix) ? type + '_' + id : id;
    };


    /**
     * Get constructor name of object
     * @param obj
     * @param {boolean} [constructor_only = false] Return object's constructor name only
     * @returns {string}
     * @example
     * _.M.className(_.App); //"[object Object]"
     * _.M.className(_.App, true); //App
     * _.M.className(new _.M.EventEmitter(), true); //EventEmitter
     */
    M.className = function (obj, constructor_only) {
        if (constructor_only) {
            return obj.constructor.name;
        }
        return Object.prototype.toString.call(obj);
    };

    /**
     * Get type of content. If is object then return constructor name
     * @param content
     * @returns {string}
     * @example
     * _.M.contentType(123); //number
     * _.M.contentType('123'); //string
     * _.M.contentType('Yahooooooo'); //string
     * _.M.contentType(true); //boolean
     * _.M.contentType(true); //boolean
     * _.M.contentType([1,2]); //array
     * _.M.contentType(_.App); //App
     */
    M.contentType = function (content) {
        var type = typeof content;

        if (type === 'object') {
            var class_name = M.className(content, true);

            if (class_name) {
                return class_name;
            }
        }

        return type;
    };

    /**
     * Check object is an instance of a constructor type
     * @param {*} obj
     * @param {string} class_name Name of class
     * @returns {boolean}
     * @example
     * _.M.isInstanceOf(_.App, 'App');//true
     * _.M.isInstanceOf(123, 'Object'); //false
     * _.M.isInstanceOf(123, 'Number'); //true
     * _.M.isInstanceOf('123', 'String'); //true
     * _.M.isInstanceOf(new _.M.EventEmitter(), 'EventEmitter'); //true
     */
    M.isInstanceOf = function (obj, class_name) {
        return this.className(obj, true) === class_name;
    };

    /**
     * Check if object is primitive type: null, string, number, boolean
     * @param obj
     * @returns {boolean}
     * @example
     * _.M.isPrimitiveType(123); //true
     * _.M.isPrimitiveType('123'); //true
     * _.M.isPrimitiveType(null); //true
     * _.M.isPrimitiveType(); //true
     * _.M.isPrimitiveType(_.App); //false
     */
    M.isPrimitiveType = function (obj) {
        var type = typeof obj;
        return obj == null || type === 'string' || type === 'number' || type === 'boolean';
    };

    /**
     * Make sure function parameter is array
     * @param {*} value
     * @returns {Array}
     * @example
     * _.M.asArray([123]) => [123]
     * _.M.asArray(123) => [123]
     */
    M.asArray = function (value) {
        if (_.isArray(value)) {
            return value;
        }
        return [value];
    };

    /**
     * Make sure first argument is object or arguments are name and value of object
     * @param {*} [name]
     * @param {*} [value]
     * @returns {*}
     * @example
     * _.M.asObject(); //{}
     * _.M.asObject(['foo', 'bar', 123]); //{0: "a", 1: 'bar', 2: 123}
     * _.M.asObject('yahoo'); //{0: "yahoo"}
     * _.M.asObject(235); //{0: 235}
     * _.M.asObject('yahoo', 123); //{yahoo: 123}
     * _.M.asObject({yahoo: 123, goooo:'ASDWd'}); //{yahoo: 123, goooo:'ASDWd'}
     *
     */
    M.asObject = function (name, value) {
        switch (true) {
            case arguments.length == 1:
                if (_.isObject(name)) {
                    return name;
                } else if (_.isArray(name) || _.isArguments(name)) {
                    return _.object(Object.keys(name), name);
                }

                return {0: name};
                break;

            case arguments.length >= 2:
                if (_.isObject(name)) {
                    return name;
                }
                var obj = {};

                obj[name] = value;

                return obj;
        }

        return {};
    };

    /**
     * Merge multiple array
     * @return {Array}
     */
    M.mergeArray = function () {
        var result = [];

        _.each(arguments, function (arr) {
            _.each(arr, function (item) {
                result.push(item);
            });
        });

        return result;
    };

    M.mergeObject = function () {
        var result = {}, next_index = 0;

        _.each(arguments, function (obj) {
            if (_.isArray(obj) || !_.isObject(obj)) {
                obj = M.asArray(obj);
                obj = _.object(_.range(next_index, next_index += obj.length), obj);
            }

            _.extend(result, obj);
        });

        return result;
    };

    function is_diff_strict_cb(value_1, value_2) {
        return value_1 !== value_2;
    }

    function is_diff_loose_cb(value_1, value_2) {
        return value_1 != value_2;
    }

    /**
     * Get dirty of object with others object
     * @param {function} cb Callback return true if 2 item is difference
     * @param object
     * @param [others...]
     * @return {{}}
     */
    function diff_object(cb, object, others) {
        if (arguments.length < 2) {
            return {};
        }

        var result = {};

        if (!_.isFunction(cb)) {
            cb = cb ? is_diff_strict_cb : is_diff_loose_cb;
        }

        others = M.mergeObject.apply(M, slice.call(arguments, 2));

        _.each(object, function (value, key) {
            if (!others.hasOwnProperty(key)) {
                result[key] = value;
            } else {
                if (cb(value, others[key])) {
                    result[key] = value;
                }
            }
        });

        return result;
    }

    /**
     * Get dirty of object with others object. Strict comparison
     * @param callback
     * @param object
     * @param others
     * @return {*}
     */
    M.diffObject = function (callback, object, others) {
        var args = _.toArray(arguments);

        args.unshift(is_diff_strict_cb);

        return diff_object.apply(null, args);
    };

    /**
     * Get dirty of object with others object. Loose comparison
     * @param callback
     * @param object
     * @param others
     * @return {*}
     */
    M.diffObjectLoose = function (callback, object, others) {
        var args = _.toArray(arguments);

        args.unshift(is_diff_loose_cb);

        return diff_object.apply(null, args);
    };

    M.diffObjectWithCallback = function (callback, object, others) {
        return diff_object.apply(null, slice.apply(arguments))
    };

    /**
     * Check if value has a deep path
     * @param {*} object
     * @param {string|number|[]} deep
     * @param {string} [separator='.'] Character to split deep string to array of deeps
     * @returns {boolean}
     * @example
     * var obj = {a: {a1: {a2: true}}, b: 'hihi'};
     * _.M.hasDeep(obj, 'a.a1'); //true
     * _.M.hasDeep(obj, 'a.yahoo'); //false
     * _.M.hasDeep([obj, 123], 1); //true
     * _.M.hasDeep([obj, 123], 10); //false
     */
    M.hasDeep = function (object, deep, separator) {
        if (!_.isArray(deep)) {
            deep = (deep + '').split(separator || '.');
        }

        var pointer = object, field;

        while (field = deep.shift()) {
            if (pointer.hasOwnProperty(field)) {
                pointer = pointer[field];
                continue;
            }

            return false;
        }

        return true;
    };

    /**
     * Define object value in a deep path
     * @param {*} object
     * @param {string|[]} deep
     * @param {*} value
     * @param {string} [separator='.']
     */
    M.defineDeep = function (object, deep, value, separator) {
        if (!_.isArray(deep)) {
            deep = (deep + '').split(separator || '.');
        }
        var pointer = object, field, last_field = deep.pop();

        while (field = deep.shift()) {
            if (!pointer.hasOwnProperty(field)) {
                pointer[field] = {};
            }
            pointer = pointer[field];
        }

        pointer[last_field] = value;
    };

    /**
     * Get object's value at a deep path
     * @param {*} object
     * @param {string|[]} deep
     * @param {*} [default_value=undefined]
     * @param {string} [separator='.']
     * @returns {*}
     */
    M.getDeep = function (object, deep, default_value, separator) {
        if (!_.isArray(deep)) {
            deep = (deep + '').split(separator || '.');
        }

        var pointer = object, field, found = true;

        while (field = deep.shift()) {
            if (pointer.hasOwnProperty(field)) {
                pointer = pointer[field];
                continue;
            }

            found = false;
            break;
        }

        if (found) {
            return pointer;
        }

        return default_value;
    };

    M.updateDeep = function (object, deep, callback) {
        if (!M.hasDeep(object, deep)) {
            throw new Error('Update undefined deep');
        }
        var deep_value = _.M.getDeep(object, deep);

        M.defineDeep(object, deep, callback(deep_value));
    };

    M.appendDeep = function (object, deep, value) {
        M.updateDeep(object, deep, function (current_value) {
            if (M.isLikeString(current_value)) {
                current_value += value + '';
            } else if (_.isArray(current_value)) {
                current_value.push(value);
            } else {
                current_value = [current_value, value];
            }

            return current_value;
        });
    };

    /**
     * Make sure that a value is in a range
     * @param {number} value
     * @param {number} min
     * @param {number} max
     * @returns {number}
     * @example
     * _.M.minMax(10, -15, 50); //10
     * _.M.minMax(10, 20, 50); //20
     * _.M.minMax(100, 20, 50); //50
     */
    M.minMax = function (value, min, max) {
        return Math.max(min, Math.min(value, max));
    };

    /**
     * Get random string
     * @param {number} length
     * @param {string} [chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ']
     * @returns {string}
     * @example
     * _.M.randomString(10); //'mYJeC1xBcl'
     * _.M.randomString(10, 'ABCDEF'); //'CDABBEFADE'
     */
    M.randomString = function (length, chars) {
        var result = '', chars_length, i;
        if (_.isUndefined(chars) || !chars.toString().length) {
            chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        }
        chars_length = chars.length;

        for (i = length; i > 0; --i) {
            result += chars[Math.round(Math.random() * (chars_length - 1))];
        }
        return result;
    };

    M.randomInteger = function (min, max) {
        if (arguments.length == 0) {
            min = 0;
            max = 10;
        } else if (arguments.length == 1) {
            max = 0;
        }
        var tmp = max;

        max = Math.max(Math.floor(min), Math.floor(max));
        min = Math.min(Math.floor(tmp), Math.floor(min));

        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    /**
     * Setup a object with field name and value or object of fields
     * @param {Object} object host object
     * @param {(string|Object)} option field name of object of fields
     * @param {*} value value of field when option param is field name
     * @returns {*}
     * @example
     * var obj = {a: 'A', b: 'B'}
     * _.M.setup(obj, 'a', '123'); //obj -> {a: '123', b: 'B'}
     * _.M.setup(obj, {b: 'Yahoo', c: 'ASD'}); //obj -> {a: 123, b: 'Yahoo', c: 'ASD'}
     */
    M.setup = function (object, option, value) {
        if (!_.isObject(object)) {
            object = {};
        }
        switch (arguments.length) {
            case 2:
                if (_.isObject(option)) {
                    object = _.extend({}, object, option);
                }
                break;
            case 3:
                object[option] = value;
        }

        return object;
    };

    /**
     * Return first value of arguments that isn't empty
     * @returns {*}
     * @example
     * _.M.firstNotEmpty(['', 0, false, 123]); //123
     */
    M.firstNotEmpty = function () {
        return _.find(_.flatten(slice.call(arguments, 0)), function (value) {
            if (_.isString(value)) {
                return value.length > 0;
            }
            if (M.isNumeric(value)) {
                var parsedValue = parseFloat(value);
                return parsedValue !== 0 && !_.isNaN(parseFloat(value)) && !_.isFinite(parsedValue);
            }
            if (value === true) {
                return true;
            }
            return !_.isEmpty(value);
        });
    };

    /**
     * Like _.pairs but array item is an object with field is "key", "value"
     * @param object
     * @returns {Array}
     * @example
     * _.M.pairsAsObject({one: 1, two: 2, three: 3});
     * => [{key: 'one', value: 1},{key: 'two', value: 2},{key: 'three', value: 3}]
     */
    M.pairsAsObject = function (object) {
        var result = [];

        _.each(object, function (value, key) {
            result.push({
                key: key,
                value: value
            });
        });

        return result;
    };
    /**
     * A convenient version of what is perhaps the most common use-case for map: extracting a list of property values, with a column as key.
     * @param {object[]} collection
     * @param {string} key_field If key field not found then use as "undefined"
     * @param {string} value_field If value field not found then use as "undefined"
     * @returns {{}}
     * @example
     * var stooges = [{name: 'moe', id: 1, age: 40}, {name: 'larry', id: 2, age: 50}, {name: 'curly', id: 4, age: 60}];
     * _.M.pluckBy(stooges, 'id', 'name');
     * => {1: 'moe', 2: 'larry', 3: 'curly'}
     */
    M.pluckBy = function (collection, key_field, value_field) {
        var result = {};

        _.each(collection, function (object) {
            var key = object.hasOwnProperty(key_field) ? object[key_field] : undefined;
            var value = object.hasOwnProperty(value_field) ? object[value_field] : undefined;

            result[key] = value;
        });

        return result;
    };

    /**
     * Repeat value by times
     * @param {*} value
     * @param {number} times Repeat times, >= 0
     * @param {boolean} [as_array = false] Return result as array, default is return as string
     * @returns {*}
     * @example
     * _.M.repeat('a', 5); //'aaaaa'
     * _.M.repeat('a', 5, true); //['a', 'a', 'a', 'a', 'a']
     *
     */
    M.repeat = function (value, times, as_array) {
        var result = [];
        times = Math.max(0, times);
        for (var i = 0; i < times; i++) {
            result.push(value);
        }
        return as_array ? result : result.join('');
    };

    /**
     * Add missing value to fit value's length
     * @param {string|number} value
     * @param {number} length Number of result need to fit
     * @param {string} span_character add value
     * @param {boolean} [before = true]
     * @returns {string}
     * @example
     * _.M.span(123, 5, '_'); //'__123'
     * _.M.span(123, 5, '_', false); //'123__'
     * _.M.span('ABCDEF', 5, '_'); //'ABCDEF'
     */
    M.span = function (value, length, span_character, before) {
        if (_.isUndefined(before)) {
            before = true;
        }
        value += '';
        if (value.length < length) {
            span_character = M.repeat((span_character + '').charAt(0), length - value.length);
            value = before ? span_character + '' + value : value + '' + span_character;
        }
        return value;
    };

    /**
     * Get n characters from left of string
     * @param {string} string
     * @param {number} [length = 1] Number of characters
     * @returns {string}
     * @example
     * _.M.left('ABC', 2); //'AB'
     */
    M.left = function (string, length) {
        if (_.isUndefined(length)) {
            length = 1;
        }

        if (length <= 0) {
            return '';
        }
        return string.toString().substr(0, length);
    };

    /**
     * Get n characters from right of value
     * @param {string} string
     * @param {number} [length = 1] Number of characters, default is 1
     * @returns {string}
     * @example
     * _.M.right('ABC', 2); //'BC'
     */
    M.right = function (string, length) {
        var tmpVal = string.toString();

        if (_.isUndefined(length)) {
            length = 1;
        }
        if (length <= 0) {
            return '';
        }

        return tmpVal.substr(Math.max(0, tmpVal.length - length), length);
    };

    /**
     * Padding number with 0 and sign
     * @param {number} num
     * @param {number} place
     * @param {boolean} sign Include number sign. If number is less than 0 then include sign, override this parameter
     * @param {number} [base=10] Base of number
     * @returns {string}
     * @example
     * _.M.padNumber(2,2); //"02"
     * _.M.padNumber(2,15); //"000000000000002"
     * _.M.padNumber(-2,2) //"-02"
     * _.M.padNumber(-2,2, true) //"-02"
     * _.M.padNumber(2,2, true); //"+02"
     *
     */
    M.padNumber = function (num, place, sign, base) {
        var str = Math.abs(num).toString(base || 10);
        str = this.repeat('0', place - str.replace(/\.\d+/, '').length) + str;
        if (sign || num < 0) {
            str = (num < 0 ? '-' : '+') + str;
        }
        return str;
    };

    /**
     * Check value is numeric
     * @param value
     * @returns {boolean}
     *
     * @example
     * _.M.isNumeric(123); //true
     * _.M.isNumeric(123.5); //true
     * _.M.isNumeric('123.5'); //true
     */
    M.isNumeric = function (value) {
        return !_.isArray(value) && (value - parseFloat(value) + 1) >= 0;
    };

    /**
     * Check if numeric value is integer
     * @param {number} number
     * @returns {boolean}
     * @example
     * _.M.isInteger(123); //true
     * _.M.isInteger(123.5); //false
     * _.M.isInteger('123'); //true
     */
    M.isInteger = function (number) {
        return number % 1 === 0;
    };

    /**
     * Check if a numeric is multiple of other
     * @param {number} n1
     * @param {number} n2
     * @returns {boolean}
     * @example
     * _.M.isMultiple(12, 3); //true
     * _.M.isMultiple(12, 5); // false
     * _.M.isMultiple(12, '4'); // true
     * _.M.isMultiple(12, 0); //false
     */
    M.isMultiple = function (n1, n2) {
        try {
            return n1 % n2 === 0;
        } catch (e) {
            return false;
        }
    };
    /**
     * Check if a numeric is odd
     * @param number
     * @returns {boolean}
     * @example
     * _.M.isOdd(5); //true
     * _.M.isOdd(4); //false
     * _.M.isOdd('11'); //true
     */
    M.isOdd = function (number) {
        return M.isInteger(number) && !M.isMultiple(number, 2);
    };
    /**
     * Check if a number is even
     * @param number
     * @returns {boolean}
     * @example
     * _.M.isOdd(5); //false
     * _.M.isOdd(4); //true
     * _.M.isOdd('11'); //false
     * _.M.isOdd('8'); //true
     */
    M.isEven = function (number) {
        return this.isMultiple(number, 2);
    };

    /**
     * Make sure value is in array
     * @param {*} value
     * @param {Array} values
     * @param {*} [default_value] Default value if not found value in values
     * @returns {*} If found then return value itself, else, return default_value or first item of array
     * @example
     * var items = [1,2,3,'a'];
     * _.M.oneOf(1, items); // 1
     * _.M.oneOf(0, items); // 1
     * _.M.oneOf('a', items); // 'a'
     * _.M.oneOf('b', items, 'C'); // 'C'
     */
    M.oneOf = function (value, values, default_value) {
        if (-1 !== values.indexOf(value)) {
            return value;
        }

        if (arguments.length >= 3) {
            return default_value;
        }

        return _.first(values);
    };

    /**
     * Capitalize a string
     * @param {string} str
     * @param {boolean} [all = true] True - all words of string, False - Only first word
     * @returns {string}
     * @example
     * _.M.capitalize('XIN CHAO ban'); //'Xin Chao Ban'
     * _.M.capitalize('XIN CHAO ban', false); //'Xin chao ban'
     */
    M.capitalize = function (str, all) {
        var lastResponded;
        return str.toLowerCase().replace(all ? /[^']/g : /^\S/, function (lower) {
            var upper = lower.toUpperCase(), result;
            result = lastResponded ? lower : upper;
            lastResponded = upper !== lower;
            return result;
        });
    };

    /**
     * Check input is string or number
     * @param {*} value
     * @returns {boolean}
     * @example
     * _.M.isLikeString('yahoo'); // true
     * _.M.isLikeString(123); // true
     * _.M.isLikeString({}); // false
     * _.M.isLikeString(true); // false
     */
    M.isLikeString = function (value) {
        return _.isString(value) || this.isNumeric(value);
    };

    /**
     * Return reverse of string
     * @param {string} str
     * @returns {string}
     * @example
     * _.M.reverseString('yahoo'); // 'oohay'
     */
    M.reverseString = function (str) {
        return str.split('').reverse().join('');
    };
    /**
     * Check if a trimmed string is empty
     * @param {string} str
     * @returns {boolean}
     * @example
     * _.M.isBlank('abc'); // false
     * _.M.isBlank(''); // true
     * _.M.isBlank('    '); // true
     */
    M.isBlank = function (str) {
        return str.trim().length === 0;
    };

    /**
     * Return current unix timestamp as seconds
     * @returns {Number}
     * @example
     * _.M.nowSecond(); // 1450622822
     */
    M.nowSecond = function () {
        return parseInt(Math.floor(_.now() / 1000));
    };

    /**
     * Escape URL
     * @param {string} url
     * @param {boolean} [param = false] Include param?
     * @returns {string}
     */
    M.escapeURL = function (url, param) {
        return param ? encodeURIComponent(url) : encodeURI(url);
    };

    /**
     * Unescape URL
     * @param {string} url
     * @param {boolean} [param = false] Include param?
     * @returns {string}
     */
    M.unescapeURL = function (url, param) {
        return param ? decodeURI(url) : decodeURIComponent(url);
    };

    /**
     * Escape HTML
     * @param content
     * @returns {string}
     * @example
     * _.M.escapeHTML('<b>Yahoo</b>'); //&lt;b&gt;Yahoo&lt;&#x2f;b&gt;"
     */
    M.escapeHTML = function (content) {
        return (content + '').replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;')
            .replace(/\//g, '&#x2f;').toString();
    };

    /**
     * Return array value at index
     * @param {string|number|Array} array String or array of items
     * @param {number} index
     * @returns {*}
     * @example
     * var arr = ['a', 'b', 'c'];
     * var str = 'Yahoo';
     * _.M.valueAt(a, 1); //'b'
     * _.M.valueAt(a, 5); //'c'
     * _.M.valueAt(a, -1); //'c'
     * _.M.valueAt(a, -2); //'b'
     * _.M.valueAt(str, 2); //'h'
     * _.M.valueAt(str, -2); //'o'
     */
    M.valueAt = function (array, index) {
        if (_.isLikeString(array)) {
            array = (array + '').split('');
        }
        if (!_.isArray(array)) {
            array += '';
        }

        var arr_len = array.length;
        index = index % arr_len;
        if (index < 0) {
            index += arr_len;
        }
        return array[index];
    };

    /**
     * Split array to chunks, each chunk has n element
     * @param {Array} array Items
     * @param {number} n Items per chunk
     * @returns {Array}
     * @example
     * var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
     * _.M.chunk(arr, 3)
     * => [
     *  [0, 1, 2],
     *  [3, 4, 5],
     *  [6, 7, 8],
     *  [9],
     * ]
     *
     */
    M.chunk = function (array, n) {
        var lists = _.groupBy(array, function (element, index) {
            return Math.floor(index / n);
        });
        return _.toArray(lists);
    };

    /**
     * Split array to n of chunks
     * @param {Array} array
     * @param {number} chunks Number of chunks
     * @return {Array}
     * @example
     * var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
     * _.M.chunks(arr, 3)
     * => [
     *   [0, 1, 2, 3],
     *   [4, 5, 6, 7],
     *   [8, 9]
     * ]
     */
    M.chunks = function (array, chunks) {
        return M.chunk(array, Math.ceil(array.length / chunks));
    };

    /**
     * Toggle array's elements
     * @param {Array} array
     * @param {Array} elements
     * @param {boolean} status If this param is boolean then add/remove base on it value. By default it is undefined -
     *     add if none exists, remove if existed
     * @returns {array}
     * @example
     * var arr = ['A', 'B', 'C', 'D'];
     * _.M.toggle(arr, ['A', 'V']) => ['B', 'C', 'D', 'V']
     * _.M.toggle(arr, ['A', 'V'], true) => ['A', 'B', 'C', 'D', 'V']
     * _.M.toggle(arr, ['A', 'V'], false) => ['B', 'C', 'D']
     */
    M.toggle = function (array, elements, status) {
        elements = _.uniq(_.asArray(elements));
        if (_.isUndefined(status)) {
            var exclude = _.intersection(array, elements);
            var include = _.difference(elements, array);

            array = _.union(_.difference(array, exclude), include);
        } else {
            if (status) {
                array = _.union(array, elements);
            } else {
                array = _.difference(array, elements);
            }
        }
        return array;
    };

    /**
     * Create, define and return a object with properties. Object's properties are fixed and enumerable
     * @param {{}} properties
     * @returns {{}}
     * @example
     * var obj = _.M.defineObject({name: 'Manh', old: 123, hello: function(){
     *  alert('Hello ' + this.name);
     * }});
     *
     * obj.old = 10;
     * console.log(obj); //{name: 'Manh', old: 123}
     * _.each(obj, function(value, key){
     *  console.log(key, '=>', value);
     * });
     * //name => Manh
     * //old => 123
     */
    M.defineObject = function (properties) {
        var obj = {};
        _.each(properties, function (value, key) {
            key = key.trim();
            if (!_.has(obj, key)) {
                Object.defineProperty(obj, key, {
                    enumerable: !_.isFunction(value),
                    value: value
                });
            }
        });
        return obj;
    };

    /**
     * Check if a MaDnh constant is defined or not
     * @param {string} name
     * @returns {boolean}
     * @example
     * _.M.isDefinedConstant('TEST') => false
     */
    M.isDefinedConstant = function (name) {
        return _.has(this, name.trim().toUpperCase());
    };

    /**
     * Define a MaDnh constant
     * @param {(string|Object)} name
     * @param {*} [value = undefined]
     * @example
     * _.M.defineConstant('TEST', 123) => _.M.TEST = 123
     */
    M.defineConstant = function (name, value) {
        var obj = {},
            result = [],
            self = this;

        if (!_.isObject(name)) {
            obj[name] = value;
        } else {
            obj = name;
        }
        _.each(obj, function (value, key) {
            key = key.trim().toUpperCase();
            if (!M.isDefinedConstant(key)) {
                Object.defineProperty(self, key, {
                    enumerable: true,
                    value: value
                });
                result.push(key);
            }
        });
        return result;
    };

    /**
     * Inherit constructor prototype
     * @param {function} destination Destination constructor
     * @param {function} source Source constructor
     * @param {boolean} [addSuper = true] Add property to destination prototype that reference back to source prototype
     *
     * @see https://github.com/Olical/Heir
     *
     * @example
     * function MyEE(){
     *  _.M.EventEmitter.call(this);
     * }
     *
     * _.M.inherit(MyEE, _.M.EventEmitter);
     */
    M.inherit = function (destination, source, addSuper) {
        var proto = destination.prototype = Object.create(source.prototype);
        proto.constructor = destination;

        if (addSuper || _.isUndefined(addSuper)) {
            proto._super = source.prototype;
        }
    };

    /**
     * Call callback with arguments
     * @param {string|function|Array} callback
     * @param {*} [args] Callback arguments, if only one argument as array passed then it must be wrapped by array, eg:
     *     [users]
     * @param {Object|null} context context of "this" keyword
     * @returns {*}
     *
     * @example
     * _.M.callFunc(null, alert, 123);
     * _.M.callFunc(null, function(name, old){
     *      alert('My name is ' + name + ', ' + old + 'years old');
     * }, ['Manh', 10]);
     *
     * var obj = {name: 'Manh', old: 10};
     * _.M.callFunc(obj, function(say_hi){
     *      alert((say_hi ? 'Hi' : 'Hello') + '! my name is ' + this.name + ', ' + this.old + ' years old');
     * }, true);
     */
    M.callFunc = function (callback, args, context) {
        if (arguments.length > 2) {
            if (arguments.length == 3) {
                args = M.asArray(args);
            } else {
                args = slice.apply(arguments, 2);
            }
        } else {
            args = [];
        }

        if (callback) {
            if (_.isString(callback)) {
                if (M.WAITER.has(callback)) {
                    return M.WAITER.run(callback, args, context);
                }
                if (_.has(window, callback) && _.isFunction(window[callback])) {
                    return window[callback].apply(context || window, args);
                }

                throw new Error('Invalid callback!');
            } else if (_.isFunction(callback)) {

                return callback.apply(context, args);
            } else if (_.isArray(callback)) {
                var result = [],
                    this_func = arguments.callee;

                _.each(callback, function (tmpFunc) {
                    result.push(this_func(tmpFunc, args, context));
                });
                return result;
            }
        }
        return undefined;
    };

    /**
     * Call callback asynchronous. Similar to _.M.callFunc
     *
     * @param {(string|function|Array)} callback
     * @param {*} [args] Callback arguments, if only one argument as array passed then it must be wrapped by array, eg:
     *     [users]
     * @param {number} [delay=1] Delay milliseconds
     * @param {Object|null} context context of "this" keyword
     * @see callFunc
     */
    M.async = function (callback, args, delay, context) {
        delay = parseInt(delay);
        if (_.isNaN(delay)) {
            delay = 1;
        }

        return setTimeout(function () {
            M.callFunc(callback, args, context || null);
        }, Math.max(1, delay));
    };

    function createConsoleCB(name, description) {
        var args = [];
        if (arguments.length > 1) {
            args.push(description);
        }

        return function () {
            console[name].apply(console, args.concat(slice.apply(arguments)));
        }
    }

    /**
     * Like console.log with dynamic arguments
     * @example
     * var args = [1,2,3,4];
     * _.M.logArgs('a',123);
     * _.M.logArgs.apply(null, args);
     */
    M.logArgs = function () {
        console.log.apply(console, slice.apply(arguments));
    };

    /**
     * Create console log callback with description as first arguments
     * @param {string} description
     * @returns {*}
     * @example
     * var cb = _.M.logCb('Test 1');
     * cb(1,2,3); // Console log: 'Test 1' 1 2 3
     */
    M.logCb = function (description) {
        return createConsoleCB.apply(null, ['log'].concat(slice.apply(arguments)));
    };

    /**
     * Like console.warn with dynamic arguments
     * @example
     * var args = [1,2,3,4];
     * _.M.warnArgs('a',123);
     * _.M.warnArgs.apply(null, args);
     */
    M.warnArgs = function () {
        console.warn.apply(console, slice.apply(arguments));
    };

    /**
     * Create console waring callback with description as first arguments
     * @param {string} description
     * @returns {*}
     * @example
     * var cb = _.M.warnCb('Test 1');
     * cb(1,2,3); // Console warn as: 'Test 1' 1 2 3
     */
    M.warnCb = function (description) {
        return createConsoleCB.apply(null, ['warn'].concat(slice.apply(arguments)));
    };

    /**
     * Like console.error with dynamic arguments
     * @example
     * var args = [1,2,3,4];
     * _.M.errorArgs('a',123);
     * _.M.errorArgs.apply(null, args);
     */
    M.errorArgs = function () {
        console.error.apply(console, slice.apply(arguments));
    };

    /**
     * Create console error callback with description as first arguments
     * @param {string} description
     * @returns {*}
     * @example
     * var cb = _.M.errorCb('Test 1');
     * cb(1,2,3); // Console error as: 'Test 1' 1 2 3
     */
    M.errorCb = function (description) {
        return createConsoleCB.apply(null, ['error'].concat(slice.apply(arguments)));
    };

    /**
     *
     * @param args
     * @param order
     * @param rules
     * @returns {{}}
     * @example
     * var order = ['int', 'bool', 'str'],
     * rules = {int: 'number', bool: 'boolean', str: 'string'};
     *
     * _.M.optionalArgs([1, true, 'A'], order, rules); //{int: 1, bool: true, str: "A"}
     * _.M.optionalArgs([true, 'A'], order, rules);//{bool: true, str: "A"}
     * _.M.optionalArgs(['A'], order, rules); //{str: "A"}
     * _.M.optionalArgs(['A', 'V'], order, rules); //{int: "A", bool: "V"}
     * _.M.optionalArgs([1, []], order, rules); //{int: 1, bool: Array[0]}
     * _.M.optionalArgs([true, []], order, rules); //{bool: true, str: Array[0]}
     * _.M.optionalArgs(['A', []], order, rules); //{int: "A", bool: Array[0]}
     * _.M.optionalArgs([[], []], order, rules); //{int: Array[0], bool: Array[0]}
     *
     * _.M.optionalArgs(['A', 'V'], ['int', 'bool', 'str', 'str2'], {int: 'number', bool: 'boolean', str: 'string', str2: 'string'});
     * //=> {str: "A", str2: "V"}
     */
    M.optionalArgs = function (args, order, rules) {
        var result = {},
            arg, index = 0, last_index, missing_rules, type, args_cloned, args_with_type, found;

        missing_rules = _.difference(order, Object.keys(rules));
        missing_rules.forEach(function (missing) {
            rules[missing] = true;
        });

        args_with_type = order.map(function (arg_name) {
            return rules[arg_name];
        });

        if (_.isEmpty(args)) {
            return result;
        }
        if (args.length >= order.length) {
            result = _.object(order, args.slice(0, order.length));
        } else {
            args_cloned = args.slice(0);

            while (arg = args_cloned.shift()) {
                type = M.contentType(arg);
                found = false;
                last_index = index;

                _.M.loop(args_with_type.slice(index), (function (tmp_arg, tmp_type) {
                    return function (types) {
                        if (types === true || tmp_type === types
                            || (_.isArray(types) && -1 != types.indexOf(tmp_type))
                            || (_.isFunction(types) && types(tmp_arg))) {
                            found = true;

                            return 'break';
                        }

                        index++;
                    }
                })(arg, type));

                if (!found) {
                    result = _.object(order.slice(0, args.length), args);
                    break;
                }

                result[order[index++]] = arg;
            }
        }

        return result;
    };

    /**
     * Sort number asc
     */
    function sortNumberCallback(a, b) {
        return a - b;
    }

    /**
     * Sort number desc
     */
    function sortNumberDescCallback(a, b) {
        return b - a;
    }

    function is_equal_strict(a, b) {
        return a === b;
    }

    function is_equal_loose(a, b) {
        return a == b;
    }


    M.defineConstant({
        /**
         * Array sort compare function. Sort number
         * @constant
         * @example
         * var scores = [1, 10, 2, 21];
         * scores.sort(); // [1, 10, 2, 21]
         * scores.sort(_.M.SORT_NUMBER); // [1, 2, 10, 21]
         */
        SORT_NUMBER: sortNumberCallback,
        /**
         * Array sort compare function. Sort number desc
         * @constant
         * @example
         * var scores = [1, 10, 2, 21];
         * scores.sort(_.M.SORT_NUMBER_DESC); // [21, 10, 2, 1]
         */
        SORT_NUMBER_DESC: sortNumberDescCallback,

        /**
         * Compare 2 value is equal, loose comparison
         * @constant
         * @example
         * _.M.IS_EQUAL(1, 1); //true
         * _.M.IS_EQUAL(1, '1'); //true
         * _.M.IS_EQUAL(1, true); //true
         * _.M.IS_EQUAL(1, false); //false
         * _.M.IS_EQUAL(1, 2); //false
         */
        IS_EQUAL: is_equal_loose,

        /**
         * Compare 2 value is equal, strict comparison
         * @constant
         * @example
         * _.M.IS_STRICT_EQUAL(1, 1); //true
         * _.M.IS_STRICT_EQUAL(1, '1'); //false
         */
        IS_STRICT_EQUAL: is_equal_strict
    });
})(_);