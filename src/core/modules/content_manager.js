/**
 * Store data by key and data type. Support add, check exists, get and delete
 * @module _.M.ContentManager
 * @memberOf _.M
 * @requires _.M.BaseClass
 */
;(function (_) {

    _.M.defineConstant({
        /**
         * @constant {string}
         * @default
         */
        CONTENT_TYPE_STRING: 'string',
        /**
         * @constant {string}
         * @default
         */
        CONTENT_TYPE_NUMBER: 'number',
        /**
         * @memberOf ContentManager
         * @constant {string}
         * @default
         */
        CONTENT_TYPE_BOOLEAN: 'boolean',
        /**
         * @constant {string}
         * @default
         */
        CONTENT_TYPE_ARRAY: 'array',
        /**
         * @constant {string}
         * @default
         */
        CONTENT_TYPE_FUNCTION: 'function',
        /**
         * @constant {string}
         * @default
         */
        CONTENT_TYPE_OBJECT: 'object',
        /**
         * @constant {string}
         * @default
         */
        CONTENT_TYPE_MIXED: 'mixed'
    });

    /**
     * Extract key to get content {string} type
     * @param {string} key
     * @returns {(string|boolean)} False when invalid key
     */
    function getContentTypeFromKey(key) {
        var info = key.split('_');

        if (info.length > 2) {
            return info[1];
        }
        return false;
    }

    /**
     * @class _.M.ContentManager
     */
    function ContentManager() {
        this.type_prefix = 'content';
        _.M.BaseClass.call(this);

        this._contents = {};
        this._usings = {};
    }

    /**
     * Check if content type is exists
     * @param {string} type
     * @returns {boolean}
     */
    ContentManager.prototype.hasType = function (type) {
        return this._contents.hasOwnProperty(type);
    };

    /**
     * Get array of content types
     * @returns {Array}
     */
    ContentManager.prototype.types = function () {
        return Object.keys(this._contents);
    };

    /**
     * Filter content by callback, return position of valid contents
     * @param callback Callback arguments: content, meta, content key, content type. Return true on valid content, otherwise
     * @param types
     * @returns {Array} Each item is object:
     *  - type: content type
     *  - key: content key
     *  - content: content
     *  - meta: content meta
     */
    ContentManager.prototype.filter = function (callback, types) {
        var result = [],
            type_checked = false,
            type, self = this;

        if (_.isUndefined(types)) {
            types = Object.keys(this._contents);
            type_checked = true;
        } else {
            types = _.M.beArray(types);
        }

        _.M.loop(types, function (type) {
            if (type_checked || self._contents.hasOwnProperty(type)) {
                _.M.loop(Object.keys(self._contents[type]), function (key) {
                    if (callback(_.clone(self._contents[type][key].content), _.clone(self._contents[type][key].meta), key, type)) {
                        result.push({
                            type: type,
                            key: key,
                            content: _.clone(self._contents[type][key].content),
                            meta: _.clone(self._contents[type][key].meta)
                        });
                    }
                });
            } else {
                throw new Error('Content type not found');
            }
        });

        return result;
    };

    /**
     * Find first position of valid content
     * @param callback Callback arguments: content, meta, content key, content type. Return true on valid content, otherwise
     * @param types
     * @returns {boolean|{}} False if not found, else return object:
     *  - type: content type
     *  - key: content key
     *  - content: content
     */
    ContentManager.prototype.find = function (callback, types) {
        var found = false,
            type_checked = false,
            type, self = this;

        if (_.isUndefined(types)) {
            types = Object.keys(this._contents);
            type_checked = true;
        } else {
            types = _.M.beArray(types);
        }

        _.M.loop(types, function (type) {
            if (type_checked || self._contents.hasOwnProperty(type)) {
                _.M.loop(Object.keys(self._contents[type]), function (key) {
                    if (callback(_.clone(self._contents[type][key].content), _.clone(self._contents[type][key].meta), key, type)) {
                        found = {
                            type: type,
                            key: key,
                            content: _.clone(self._contents[type][key].content)
                        };

                        return 'break';
                    }
                });

                if (found) {
                    return 'break';
                }
            } else {
                throw new Error('Invalid content type');
            }
        });

        return found;
    };

    /**
     * Find positions of content by content and [types]
     * @param {*} content
     * @param {string} [types] Find in this types, if missing then auto detect
     * @returns {Array} Array of object with keys: type, key
     */
    ContentManager.prototype.contentPositions = function (content, types) {
        var callback = function (check_content) {
            return content === check_content;
        };

        return this.filter(callback, types);
    };

    /**
     * Check if key is valid
     * @param {string} key
     * @returns {boolean}
     */
    ContentManager.prototype.isValidKey = function (key) {
        return false !== getContentTypeFromKey(key);
    };

    /**
     * Find content exists
     * @param content
     * @param types
     * @returns {boolean}
     */
    ContentManager.prototype.hasContent = function (content, types) {
        var callback = function (check_content) {
            return content === check_content;
        };

        return false !== this.find(callback, types);
    };

    /**
     * Check if key is exists
     * @param {string} key
     * @returns {boolean}
     */
    ContentManager.prototype.hasKey = function (key) {
        if (this.isUsing(key)) {
            return true;
        }

        if(!this.isValidKey(key)){
            return false;
        }

        var type = getContentTypeFromKey(key);

        return this._contents.hasOwnProperty(type) && this._contents[type].hasOwnProperty(key);
    };

    /**
     * Clean empty type
     */
    ContentManager.prototype.clean = function () {
        var self = this;
        Object.keys(this._contents).forEach(function (type) {
            if (self._contents.hasOwnProperty(type) && _.isEmpty(self._contents[type])) {
                delete self._contents[type];
            }
        });
    };

    /**
     * Add content
     * @param {*} content
     * @param {*} meta
     * @param {string} [type] Auto detect when missing
     * @returns {string} Content key
     */
    ContentManager.prototype.add = function (content, meta, type) {
        if (!type) {
            type = _.M.contentType(content);
        }

        var key = _.M.nextID(this.type_prefix + '_' + type, true);

        if (!this._contents.hasOwnProperty(type)) {
            this._contents[type] = {};
        }
        this._contents[type][key] = {
            content: content,
            meta: meta
        };

        return key;
    };

    /**
     * Add unique content
     * @param {*} content
     * @param {*} meta
     * @param {string} [type] Auto detect when missing
     * @returns {string} Content key
     */
    ContentManager.prototype.addUnique = function (content, meta, type) {
        if (!type) {
            type = _.M.contentType(content);
        }

        var positions = this.contentPositions(content, type);

        if (positions.length == 0) {
            return this.add(content, meta, type);
        }

        return positions.shift().key;
    };

    /**
     *
     * @param {string|string[]} keys
     * @param with_meta
     * @return {{}}
     */
    ContentManager.prototype.items = function (keys, with_meta) {
        var result = {},
            type,
            key,
            callback;

        if (with_meta) {
            callback = function (item) {
                return _.clone(item)
            };
        } else {
            callback = function (item) {
                return _.clone(item.content);
            }
        }
        if (!_.isEmpty(keys)) {
            var type_grouped = _.groupBy(_.M.beArray(keys), getContentTypeFromKey);

            for (type in type_grouped) {
                if (type_grouped.hasOwnProperty(type)) {
                    _.each(_.pick(this._contents[type], type_grouped[type]), function (value, key) {
                        result[key] = callback(value);
                    });
                }
            }
        } else {
            for (type in this._contents) {
                if (this._contents.hasOwnProperty(type)) {
                    for (key in this._contents[type]) {
                        if (this._contents[type].hasOwnProperty(key)) {
                            result[key] = callback(this._contents[type][key]);
                        }
                    }
                }
            }
        }


        return result;
    };

    /**
     * Check if content key is using
     * @param {string} key
     * @returns {boolean}
     */
    ContentManager.prototype.isUsing = function (key) {
        return this._usings.hasOwnProperty(key);
    };

    /**
     * Check if content is using
     * @param {*} content
     * @param {string} [type] Auto detect when missing
     * @returns {boolean}
     */
    ContentManager.prototype.isUsingContent = function (content, type) {
        var positions = this.contentPositions(content, type);

        if(!_.isEmpty(positions)){
            return !_.isEmpty(_.intersection(_.pluck(positions, 'key'), Object.keys(this._usings)));
        }

        return false;
    };

    /**
     * Toggle using key
     * @param {string} key
     * @param {boolean} [is_using = true]
     * @return {boolean} True -> key is exists and set using status success. False -> key is not exists
     */
    ContentManager.prototype.using = function (key, is_using) {
        if (this.hasKey(key)) {
            if (_.isUndefined(is_using) || is_using) {
                this._usings[key] = true;
            } else {
                delete this._usings[key];
            }

            return true;
        }

        return false;
    };

    /**
     * Set keys to unused
     * @param {string|string[]}keys
     */
    ContentManager.prototype.unused = function (keys) {
        this._usings = _.omit(this._usings, _.flatten(_.toArray(arguments)));
    };

    /**
     * Get using keys
     * @param {boolean} [grouped=false] Group keys by type
     * @return {string[], {}}
     */
    ContentManager.prototype.usingKeys = function (grouped) {
        if (grouped) {
            return _.groupBy(Object.keys(this._usings), getContentTypeFromKey);
        }

        return Object.keys(this._usings);
    };
    /**
     * Get unused keys
     * @param {boolean} [grouped=false] Group keys by type
     * @return {{}|string[]}
     */
    ContentManager.prototype.unusedKeys = function (grouped) {
        var using_grouped = this.usingKeys(true),
            result = {};

        for (var type in this._contents) {
            if (this._contents.hasOwnProperty(type)) {
                if (!using_grouped.hasOwnProperty(type)) {
                    result[type] = Object.keys(this._contents[type]);
                } else {
                    result[type] = _.difference(Object.keys(this._contents[type]), using_grouped[type]);
                }

                if (_.isEmpty(result[type])) {
                    delete result[type];
                }
            }
        }

        if (!grouped) {
            return _.flatten(_.values(result));
        }

        return result;
    };

    /**
     * Get content and meta by key
     * @param {string} key
     * @returns {*}
     */
    ContentManager.prototype.get = function (key) {
        var type = getContentTypeFromKey(key);

        if (false !== type && this._contents[type].hasOwnProperty(key)) {
            return _.clone(this._contents[type][key]);
        }

        return false;
    };

    /**
     * Get type contents
     * @param {string} type
     * @returns {({}|boolean)}
     */
    ContentManager.prototype.getType = function (type) {
        if (this.hasType(type)) {
            return _.clone(this._contents[type]);
        }

        return false;
    };

    /**
     * Get content by key
     * @param {string} key
     * @param {*} [default_value]
     * @returns {*}
     */
    ContentManager.prototype.getContent = function (key, default_value) {
        var result = this.get(key);

        if (false !== result) {

            return _.clone(result.content);
        }

        return default_value;
    };

    /**
     * Get content meta by key
     * @param {string} key
     * @param {*} [default_value]
     * @returns {*}
     */
    ContentManager.prototype.getMeta = function (key, default_value) {
        var result = this.get(key);

        if (false !== result) {

            return _.clone(result.meta);
        }

        return default_value;
    };

    /**
     * Remove content by key. Return removed keys
     * @param {string|string[]} keys
     */
    ContentManager.prototype.remove = function (keys) {
        var removes = [],
            key_grouped = _.groupBy(_.flatten(_.toArray(arguments)), getContentTypeFromKey);

        delete key_grouped['false'];

        for (var type in key_grouped) {
            if (key_grouped.hasOwnProperty(type) && this._contents.hasOwnProperty(type)) {
                for (var index in key_grouped[type]) {
                    if (key_grouped[type].hasOwnProperty(index)) {
                        removes.push({
                            type: type,
                            key: key_grouped[type][index]
                        });

                        delete this._contents[type][key_grouped[type][index]];
                        delete this._usings[key_grouped[type][index]];
                    }
                }
            }
        }

        this.clean();

        return removes;
    };

    /**
     * Remove content, return content key
     * @param {*} content
     * @param {string} [type]
     * @returns {Array} Removed positions
     */
    ContentManager.prototype.removeContent = function (content, type) {
        var positions = this.contentPositions(content, type),
            self = this;

        if (positions.length) {
            _.each(positions, function (pos) {
                delete self._contents[pos.type][pos.key];
                delete self._usings[pos.key];
            });
        }

        this.clean();

        return positions;
    };

    /**
     * Update content and meta
     * @param {string} key
     * @param {*} content
     * @param {*} [meta]
     * @returns {boolean}
     */
    ContentManager.prototype.update = function (key, content, meta) {
        if (this.hasKey(key)) {
            var type = getContentTypeFromKey(key);

            this._contents[type][key].content = content;

            if (arguments.length >= 3) {
                this._contents[type][key].meta = meta;
            }

            return true;
        }

        return false;
    };

    /**
     * Update meta
     * @param {string} key
     * @param {*} meta
     * @returns {boolean}
     */
    ContentManager.prototype.updateMeta = function (key, meta) {
        if (this.hasKey(key)) {
            var type = getContentTypeFromKey(key);

            this._contents[type][key].meta = meta;

            return true;
        }

        return false;
    };


    /**
     * Remove using content
     * @returns {Array} Removed position
     */
    ContentManager.prototype.removeUsing = function () {
        return this.remove(Object.keys(this._usings));
    };

    /**
     * Remove using content
     * @returns {array} Removed position
     */
    ContentManager.prototype.removeUnusing = function () {
        return this.remove(this.unusedKeys());
    };

    /**
     * Get status
     * @returns {{using: string[], types: {}}}
     */
    ContentManager.prototype.status = function () {
        var status = {
                using: Object.keys(this._usings),
                types: {}
            },
            self = this;

        Object.keys(this._contents).forEach(function (type) {
            status.types[type] = Object.keys(self._contents[type]);
        });

        return status;
    };

    /**
     *
     * @type {_.M.ContentManager}
     */
    _.M.ContentManager = ContentManager;

})(_);