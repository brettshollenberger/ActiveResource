angular.module('ngActiveResource', []).factory('ngActiveResource', [
  'ARAPI',
  'ARBase',
  'ARConfigurable',
  'ARDirty',
  'ARWatchable',
  function (API, Base, Configurable, Dirty, Watchable) {
    ngActiveResource = {};
    ngActiveResource.API = API;
    ngActiveResource.Base = Base;
    ngActiveResource.Configurable = Configurable;
    ngActiveResource.Dirty = Dirty;
    ngActiveResource.Watchable = Watchable;
    return ngActiveResource;
  }
]);
Function.prototype.inherits = function (baseclass) {
  var _constructor = this;
  _constructor = baseclass.apply(_constructor);
};
Function.prototype.extend = function (Module) {
  var properties = new Module(), propertyNames = Object.getOwnPropertyNames(properties), classPropNames = _.remove(propertyNames, function (propName) {
      return propName.slice(0, 2) != '__';
    });
  _.each(classPropNames, function (cpn) {
    var propertyDescriptor = Object.getOwnPropertyDescriptor(properties, cpn);
    Object.defineProperty(this, cpn, propertyDescriptor);
  }, this);
  if (_.isFunction(Module.extended)) {
    Module.extended(this);
  }
};
Object.defineProperty(Object.prototype, 'extend', {
  enumerable: false,
  configurable: true,
  value: Function.prototype.extend
});
Function.prototype.include = function (Module) {
  var methods = new Module(), propNames = Object.getOwnPropertyNames(methods), instancePropNames = _.remove(propNames, function (val) {
      return val.slice(0, 2) == '__';
    });
  _.each(instancePropNames, function (ipn) {
    var propDescriptor = Object.getOwnPropertyDescriptor(methods, ipn);
    Object.defineProperty(this.prototype, ipn.slice(2), propDescriptor);
  }, this);
  if (_.isFunction(Module.included)) {
    Module.included(this);
  }
};
function privateVariable(object, name, value) {
  var val;
  Object.defineProperty(object, name, {
    enumerable: false,
    configurable: true,
    get: function () {
      return val;
    },
    set: function (newval) {
      val = newval;
    }
  });
  if (value !== undefined)
    object[name] = value;
}
;
Object.defineProperty(Array.prototype, 'nodupush', {
  enumerable: false,
  configurable: true,
  value: function (val) {
    if (!_.include(this, val))
      this.push(val);
  }
});
// @module ARAPI
//
// The purpose of the API module is to get and set endpoints for RESTful API actions.
//
// //////////////////////////////////////////////////////////////////////
//
// ARAPI can be configured at a global level by requiring ARAPI:
//
//    .config(['ARAPI', function(API) {
//      API.configure(function(config) {
//        config.baseURL = "https://api.edmodo.com";
//        config.format  = "application/json";
//      });
//    }])
//
// Defaults can be overridden on a per-model basis:
//
//    MyModel.api.configure(function(config) {
//      config.format = "text/xml";
//
//      // do not append .xml to URLs
//      config.appendFormat = false;
//    });
//
// By default, model APIs create 5 RESTful URLs: 
//
//    Post.api.baseURL   = "https://api.edmodo.com"
//
//    Post.api.indexURL  = "/posts"
//    Post.api.createURL = "/posts"
//    Post.api.showURL   = "/posts/:primaryKey"
//    Post.api.updateURL = "/posts/:primaryKey"
//    Post.api.deleteURL = "/posts/:primaryKey"
//
// The primary key of these URLs is the primaryKey of the model, which defaults to :id.
//
// URLs can be overridden on an individual basis by simply setting the URL:
//
//    Post.api.configure(function(config) {
//      config.showURL = "/posts/:title"
//    });
//
// //////////////////////////////////////////////////////////////////////
//
// @method api#get
//
// @argument action {string} - The name of the RESTful action ("show", "index", 
//                             "delete", "update", or "create")
//
// @argument params {object} - The parameters to parameterize the URL with
//
// Retrieve a parameterized URL for a given action. GET type actions will append a querystring, while
// all other actions will only replace parameters:
//
//    Post.api.get("show", {id: 1}))
//    >> "https://api.edmodo.com/posts/1"
//
//    Post.api.get("show", {id: 1, title: "My Great Title"}))
//    >> "https://api.edmodo.com/posts/1?title=My Great Title"
//
//    Post.api.get("index", {author_id: 1, published: true})
//    >> "https://api.edmodo.com/posts?author_id=1&published=true"
//
//    Post.api.get("create", {title: "My Great Title"})
//    >> "https://api.edmodo.com/posts"
//
//    Post.api.get("delete", {id: 1, title: "My Great Title"})
//    >> "https://api.edmodo.com/posts/1"
//
//    Post.api.get("update", {id: 1, title: "My Great Title"})
//    >> "https://api.edmodo.com/posts/1"
//
// Certain parameterized URLs, like munged post titles, may require special 
// parameterization functions. For these, simply add a method to your API 
// in the format "parameterizeParamName"
//
//    Post.api.showURL = "/posts/:title"
//
//    Post.api.parameterizeTitle = function(title) {
//      return title.split(" ").join("-").toLowerCase();
//    }
//
//    Post.api.get("show", {id: 1, title: "My Great Title"})
//    >> "https://api.edmodo.com/posts/my-great-title"
//
// The name of this special function should be camelcase, regardless of the param itself:
//
//    Post.api.showURL = "/posts/:the_title"
//    Post.api.parameterizeTheTitle = function() { ... }
//
//    Post.api.showURL = "/posts/:myTitle"
//    Post.api.parameterizeMyTitle = function() { ... }
//
// //////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////
angular.module('ngActiveResource').factory('ARAPI', [
  'ARQueryString',
  'ARMime',
  'ARSerializeAssociations',
  function (querystring, Mime, serializeAssociations) {
    API.prototype.appendFormat = true;
    API.prototype.baseURL = 'http://api.override.com';
    API.prototype.$http = {};
    API.prototype.format = 'application/json';
    API.included = function (klass) {
      klass.api = new API(klass);
    };
    API.configure = function (config) {
      return config(API.prototype);
    };
    function API(klass) {
      var api = this;
      api.klass = klass;
      api.GETURLs = [
        'indexURL',
        'showURL'
      ];
      api.configure = function (configuration) {
        return configuration(api);
      };
      api.setIndexURL = function () {
        api.indexURL = api.resourcesURL();
        return api.indexURL;
      };
      api.setCreateURL = function () {
        api.createURL = api.resourcesURL();
        return api.createURL;
      };
      api.setShowURL = function () {
        api.showURL = api.resourceURL();
        return api.showURL;
      };
      api.setUpdateURL = function () {
        api.updateURL = api.resourceURL();
        return api.updateURL;
      };
      api.setDeleteURL = function () {
        api.deleteURL = api.resourceURL();
        return api.deleteURL;
      };
      api.get = function (action, params) {
        return parameterize(getEndpoint(action), params, isGETURL(action));
      };
      api.resourceName = function () {
        return api.resource ? api.resource : api.klass.name;
      };
      api.resourcesURL = function resourcesURL() {
        return '/' + api.resourceName().underscore().pluralize();
      };
      api.resourceURL = function () {
        return api.resourcesURL() + '/:' + api.klass.primaryKey;
      };
      api.mimetype = function () {
        return Mime.Type.find(api.format);
      };
      function standardizeBaseURL(baseURL) {
        baseURL = removeTrailingSlash(baseURL);
        baseURL = standardizeProtocol(baseURL);
        return baseURL;
      }
      function isGETURL(action) {
        return _.include(api.GETURLs, action + 'URL');
      }
      function getEndpoint(action) {
        var endpoint = api[action + 'URL'];
        if (_.isUndefined(endpoint)) {
          endpoint = api['set' + action.capitalize() + 'URL']();
        }
        return standardizeBaseURL(api.baseURL) + endpoint;
      }
      function parameterize(url, params, isGETURL) {
        if (klass.reflections) {
          params = serializeAssociations(params, klass.reflections);
        }
        if (isGETURL) {
          url = appendQueryString(url, params);
        }
        if (api.appendFormat) {
          url = appendFormat(url);
        }
        url = replaceParams(url, params);
        return url;
      }
      function appendQueryString(url, params) {
        var query = buildQueryString(url, params);
        return query.length ? url + '?' + query : url;
      }
      function buildQueryString(url, params) {
        return querystring.stringify(_.chain(params).cloneDeep().omit(_.isUndefined).omit(parameterizable).value());
        function parameterizable(value, key) {
          return _.include(parameterizableParams(url), key);
        }
      }
      function parameterizableParams(url) {
        return _.chain(url.split('/')).reject(function (urlPiece) {
          return urlPiece[0] != ':';
        }).map(function (param) {
          return param.slice(1);
        }).value();
      }
      function replaceParams(url, params) {
        return url.replace(/\:(\w+)/g, function (colon, param) {
          if (isPort(param)) {
            return ':' + param;
          }
          return replaceParam(param, params[param]);
        });
      }
      function isPort(param) {
        return !isNaN(param);
      }
      function appendFormat(url) {
        var pieces = url.split('?');
        pieces[0] = pieces[0] + '.' + api.mimetype().subtypeName;
        return pieces.join('?');
      }
      function replaceParam(paramName, param) {
        if (_.isFunction(specialParameterizationFunction(paramName))) {
          return specialParameterizationFunction(paramName)(param);
        }
        return param;
      }
      function specialParameterizationFunction(paramName) {
        return api['parameterize' + paramName.classify()];
      }
      function standardizeProtocol(baseURL) {
        if (containsProtocol(baseURL)) {
          return baseURL;
        }
        return standardProtocol() + baseURL;
      }
      function containsProtocol(url) {
        return !!url.match(protocolRegex());
      }
      function protocolRegex() {
        return /\w+\:\/\//;
      }
      function standardProtocol() {
        return 'http://';
      }
      function removeTrailingSlash(baseURL) {
        if (baseURL.slice(-1) == '/') {
          return baseURL.slice(0, -1);
        }
        return baseURL;
      }
    }
    return API;
  }
]);
angular.module('ngActiveResource').factory('ARAssociatable', [function () {
    Associatable.included = function (klass) {
      klass.during('new', setAssociations);
      klass.during('update', setAssociations);
      function setAssociations(instance, attributes) {
        _.each(klass.reflections, function (reflection) {
          reflection.initialize(instance, attributes);
        });
      }
    };
    function Associatable() {
    }
    return Associatable;
  }]);
angular.module('ngActiveResource').factory('ARAssociatable.CollectionAssociation', [
  'ARMixin',
  'ARFunctional.Collection',
  'ARDelegatable',
  function (mixin, FunctionalCollection, Delegatable) {
    function CollectionAssociation(owner, reflection) {
      var collection = mixin([], FunctionalCollection);
      privateVariable(collection, 'constructor', CollectionAssociation);
      collection.extend(Delegatable);
      collection.delegate([
        'name',
        'klass',
        'options',
        'associationPrimaryKey',
        'inverse',
        'inverseKlass'
      ]).to(reflection);
      collection.new = function (attributes) {
        attributes = attributes || {};
        mixin(attributes, NewAttributes);
        return collection.klass().new(attributes.standardize());
      };
      collection.$create = function (attributes) {
        return collection.new(attributes).$save();
      };
      collection.where = function (attributes) {
        attributes = attributes || {};
        mixin(attributes, WhereAttributes);
        return collection.klass().where(attributes.standardize());
      };
      collection.findAll = function () {
        return collection.where({});
      };
      function NewAttributes() {
        privateVariable(this, 'standardize', function () {
          var defaults = {};
          defaults[collection.inverse().name] = owner;
          return _.defaults({}, this, defaults);
        });
      }
      function WhereAttributes() {
        privateVariable(this, 'standardize', function () {
          var defaults = {};
          defaults[collection.inverse().foreignKey] = owner[collection.klass().primaryKey];
          return _.defaults({}, this, defaults);
        });
      }
      return collection;
    }
    return CollectionAssociation;
  }
]);
'use strict';
angular.module('ngActiveResource').factory('ARBase', [
  'AREventable',
  'ARCreatable',
  'ARUpdatable',
  'ARSaveable',
  'ARQueryable',
  'ARFindable',
  'ARDeletable',
  'ARSerializable',
  'ARDeserializable',
  'ARValidatable',
  'ARPrimaryKey',
  'ARWatchable',
  'ARDirty',
  'ARAPI',
  'ARAssociatable',
  'ARCacheable',
  'ARErrorable',
  'ARMime.Formattable',
  'ARDefinable',
  'ARComputedProperty',
  'ARFunctional',
  'ARPromiseable',
  'ARReflections',
  function (Eventable, Creatable, Updatable, Saveable, Queryable, Findable, Deletable, Serializable, Deserializable, Validatable, PrimaryKey, Watchable, Dirty, API, Associatable, Cacheable, Formattable, Errorable, Definable, ComputedProperty, Functional, Promiseable, Reflections) {
    function Base(attributes) {
      this.extend(Eventable);
      this.extend(Creatable);
      this.extend(Queryable);
      this.extend(Findable);
      this.extend(Serializable);
      this.extend(Deserializable);
      this.extend(Validatable);
      this.extend(PrimaryKey);
      this.extend(Watchable);
      this.extend(Dirty);
      this.include(Updatable);
      this.include(Saveable);
      this.include(Deletable);
      this.include(API);
      this.include(Associatable);
      this.include(Reflections);
      this.include(Cacheable);
      this.include(Formattable);
      this.include(Validatable);
      this.include(Errorable);
      this.include(Definable);
      this.include(ComputedProperty);
      this.include(Functional);
      this.include(Promiseable);
    }
    return Base;
  }
]);
angular.module('ngActiveResource').factory('ARCacheable', [
  'ARMixin',
  'ARFunctional.Collection',
  function (mixin, FunctionalCollection) {
    Cache.included = function (klass) {
      klass.cached = new Cache();
      klass.cache = klass.cached.cache;
      klass.findCached = klass.cached.findCached;
      klass.removeCached = klass.cached.removeCached;
      klass.after('new', klass.cache);
      klass.after('find', klass.cache);
      klass.after('save', klass.cache);
      klass.after('delete', klass.removeCached);
    };
    function Cache() {
      mixin(this, FunctionalCollection);
      privateVariable(this, 'cache', function (instance) {
        var primaryKey = this.primaryKey;
        if (instance && instance[primaryKey] !== undefined) {
          this.cached[instance[primaryKey]] = instance;
        }
        ;
      });
      privateVariable(this, 'findCached', function (attributes) {
        return this.cached[attributes[this.primaryKey]];
      });
      privateVariable(this, 'removeCached', function (instance) {
        delete this.cached[instance[this.primaryKey]];
      });
      privateVariable(this, 'find', function (primaryKey) {
        return this[primaryKey];
      });
    }
    ;
    return Cache;
  }
]);
angular.module('ngActiveResource').factory('ARComputedProperty', [function () {
    function ComputedProperty() {
      // Instance#computedProperty(name, valueFn, dependents)
      //
      // @param name       {string}         - The name of the property to be computed from other properties
      //
      // @param valueFn    {func}           - The function used to compute the new property from the others
      //
      // @param dependents {string | array} - The name of the property or list of the properties that this 
      //                                      property depends upon.
      //
      // Example:
      //
      //    function Tshirt(attributes) {
      //      this.number('price');
      //
      //      this.computedProperty('salePrice', function() {
      //        return this.price - (this.price * 0.2);
      //      }, 'price');
      //
      //      this.computedProperty('superSalePrice', function() {
      //        return this.price - this.salePrice;
      //      }, ['price', 'salePrice']);
      //    }
      //
      // The computed property function creates configurable getters and setters (that can thus be reconfigured).
      // In the first example, the price setter calls the salePrice setter whenever it updates. In the second
      // example, the salePrice setter continues to be called by the price setter, and additionally calls the
      // superSalePrice setter afterward.
      //
      // This chainability allows us to create complex inter-dependencies, where an update to one property
      // updates many others. In order to all this to occur, we use the `__lookupSetter__` function to retrieve
      // the value of the previous setter.
      this.__computedProperty = function (name, valueFn, dependents) {
        var instance = this;
        var data = this.constructor.constructing.attributes;
        if (!dependents)
          dependents = [];
        if (!dependents.push)
          dependents = [dependents];
        var local2;
        Object.defineProperty(instance, name, {
          enumerable: true,
          configurable: true,
          get: function () {
            return local2;
          },
          set: function () {
            local2 = valueFn.apply(instance);
            return local2;
          }
        });
        _.each(dependents, function (dependent) {
          var local;
          var previousSetter = instance.__lookupSetter__(dependent);
          var dependentVal = instance[dependent];
          Object.defineProperty(instance, dependent, {
            enumerable: true,
            configurable: true,
            get: function () {
              return local;
            },
            set: function (val) {
              if (val !== undefined && val != 'set')
                local = val;
              if (previousSetter) {
                if (local == val)
                  previousSetter();
                else
                  local = previousSetter();
              }
              instance[name] = 'set';
              return local;
            }
          });
          if (data && data[dependent])
            instance[dependent] = data[dependent];
          else
            instance[dependent] = dependentVal;
        });
      };
    }
    return ComputedProperty;
  }]);
// Configurable
//
// Configuration objects should be easy to change, leaving little room for client error.
//
// Take for example an $http configuration object:
//
//  $httpConfig = {
//    cache: true,
//    headers: {
//      "Content-Type": "application/json",
//      "Accept": "application/json"
//    }
//  }
//
// Let's say a user wanted to add their own headers:
//
//  ngActiveResource.api.configure(function(config) {
//    config.headers = {
//      "My-Special-Header": "Good"
//    }
//  });
//
// We don't want this user overriding the other headers. The Configurable module ensures they don't.
//
//  $httpConfig.extend(ngActiveResource.Configurable);
//
angular.module('ngActiveResource').factory('ARConfigurable', [function () {
    Configurable.extended = function (klass) {
      Configurable(klass);
    };
    function Configurable(object) {
      object = object || {};
      var propertyNames = Object.getOwnPropertyNames(object);
      _.each(propertyNames, function (propertyName) {
        var value = object[propertyName];
        Object.defineProperty(object, propertyName, {
          configurable: true,
          enumerable: true,
          get: function () {
            return value;
          },
          set: function (v) {
            if (_.isObject(value)) {
              value = _.merge({}, v, value, _.defaults);
              Configurable(value);
            } else {
              value = v;
            }
          }
        });
        if (_.isObject(value)) {
          Configurable(value);
        }
      });
    }
    return Configurable;
  }]);
angular.module('ngActiveResource').factory('ARDefinable', [function () {
    Definable.included = function (klass) {
      klass.before('new', function (attributes) {
        klass.constructing = { attributes: attributes };
      });
      klass.after('new', function () {
        delete klass.constructing;
      });
    };
    function Definable() {
      var instance = this;
      new AttributeDefiner('string');
      new AttributeDefiner('integer', { integer: { ignore: /\,/g } });
      new AttributeDefiner('number', { numericality: { ignore: /\,/g } });
      new AttributeDefiner('boolean', { boolean: true });
      function AttributeDefiner(name, validates) {
        instance['__' + name] = function (propertyName) {
          if (_.isObject(validates)) {
            var validations = {};
            validations[propertyName] = validates;
            this.constructor.validates(validations);
          }
          this[propertyName] = this.constructor.constructing.attributes[propertyName];
        };
      }
    }
    return Definable;
  }]);
angular.module('ngActiveResource').factory('ARDelegatable', [function () {
    Delegatable.extended = function (klass) {
      klass.delegate = new Delegatable().__delegate;
    };
    function Delegatable() {
      this.__delegate = function (methodNames) {
        var methodNames = _.isArray(methodNames) ? methodNames : [methodNames], delegator = this;
        methodNames.to = function (delegatee) {
          _.each(methodNames, function (methodName) {
            Object.defineProperty(delegator, methodName, {
              enumerable: false,
              configurable: true,
              value: delegateMethod(delegatee, methodName)
            });
          });
        };
        return methodNames;
      };
      function delegateMethod(delegatee, methodName) {
        if (_.isFunction(delegatee[methodName])) {
          if (isClass()) {
            return accessorMethod(delegatee, methodName);
          }
          return _.bind(delegatee[methodName], delegatee);
        }
        if (delegatee[methodName]) {
          return accessorMethod(delegatee, methodName);
        }
        function isClass() {
          return _.isFunction(delegatee[methodName].new);
        }
      }
      function accessorMethod(delegatee, methodName) {
        return function () {
          return delegatee[methodName];
        };
      }
    }
    return Delegatable;
  }]);
// module ARDirty
//
// ARDirty adds methods for determining whether or not instance contain change attributes since
// they were last saved.
//
// /////////////////////////////////////////////////////////////////////////////////////////////
//
// method dirty
//
// @param options {object} - Options include:
//
//                            -- ignoreAssociations: Whether or not to consider foreign keys and
//                            associated instances when deciding whether or not an instance has changed.
//
//                            By default, ignoreAssociations is false.
//
// @returns boolean - Instance has been changed since last save
//
// Examples:
//
// 1)
//   comment = Comment.new();
//   comment.dirty();
//   >> false
//
//   comment.update({body: "Great post!"});
//   comment.dirty();
//   >> true
//
//   comment.save();
//   comment.dirty();
//   >> false
//
// 2)
//   post    = Post.find(1);
//   comment = post.comments.new();
//   comment.dirty();
//   >> false
//
//   comment.dirty({ignoreAssociations: false});
//   >> true // post_id has changed to 1 and the comment has not been saved
//
// /////////////////////////////////////////////////////////////////////////////////////////////
//
// method changedAttributes
//
// @param options {object} - Options include:
//
//                            -- ignoreAssociations: Whether or not to consider foreign keys and
//                            associated instances when deciding whether or not an instance has changed.
//
//                            By default, ignoreAssociations is false.
//
// @returns array - Attributes that have changed since last save
//
// Examples:
//
// 1)
//   comment = Comment.new();
//   comment.changedAttributes();
//   >> []
//
//   comment.update({body: "Great post!"});
//   comment.changedAttributes();
//   >> ["body"]
//
//   comment.save();
//   comment.changedAttributes();
//   >> []
//
// 2)
//   post    = Post.find(1);
//   comment = post.comments.new();
//   comment.changedAttributes();
//   >> []
//
//   comment.changedAttributes({ignoreAssociations: false});
//   >> ["post_id"]
//
angular.module('ngActiveResource').factory('ARDirty', [
  'ARMixin',
  function (mixin) {
    Dirty.extended = function (klass) {
      klass.after('new', function (instance) {
        mixin(instance, Dirty);
      });
      klass.after('save', function (instance) {
        privateVariable(instance, 'lastSave', _.cloneDeep(instance));
      });
    };
    function Dirty() {
      privateVariable(this, 'dirty', function (options) {
        options = new DirtyOptions(options);
        return this.changedAttributes(options).length > 0;
      });
      privateVariable(this, 'changedAttributes', function (options) {
        var options = new DirtyOptions(options), lastSave = this.lastSave || {}, currentAttributes = _.cloneDeep(this), klass = this.constructor, reflections = klass.reflections || {};
        lastSave = this.constructor.deserialize(this.constructor.serialize(lastSave));
        currentAttributes = this.constructor.deserialize(this.constructor.serialize(currentAttributes));
        if (options.ignoreAssociations) {
          lastSave = dropAssociations(lastSave, reflections);
          currentAttributes = dropAssociations(currentAttributes, reflections);
        }
        return _.compact(_.map(Object.keys(currentAttributes), function (attributeName) {
          if (attributeChanged(attributeName, currentAttributes, lastSave)) {
            return attributeName;
          }
        }, this));
      });
    }
    function DirtyOptions(options) {
      options = options || {};
      return _.defaults(options, { ignoreAssociations: true });
    }
    function dropAssociations(object, reflections) {
      if (!_.isFunction(reflections.each)) {
        return object;
      }
      reflections.each(function (reflection) {
        delete object[reflection.name];
        delete object[reflection.foreignKey];
      });
      return object;
    }
    function attributeChanged(attributeName, currentAttributes, lastSave) {
      if (_.isUndefined(lastSave[attributeName])) {
        lastSave[attributeName] = '';
      }
      if (_.isObject(currentAttributes[attributeName])) {
        return objectsDifferent(currentAttributes[attributeName], lastSave[attributeName]);
      }
      return String(currentAttributes[attributeName]) !== String(lastSave[attributeName]);
    }
    function objectsDifferent(obj1, obj2) {
      return obj2string(obj1) !== obj2string(obj2);
    }
    function obj2string(obj) {
      var keys = _.keys(obj).sort();
      return JSON.stringify(_.inject(keys, function (str, key) {
        str[key] = obj[key];
        return str;
      }, {}));
    }
    return Dirty;
  }
]);
angular.module('ngActiveResource').factory('ARErrorable', [function () {
    function Errorable() {
      var _$errors = {};
      privateVariable(_$errors, 'add', function (fieldName, errorMessage) {
        if (_.isUndefined(_$errors[fieldName]))
          _$errors[fieldName] = [];
        if (!_.include(_$errors[fieldName], errorMessage)) {
          _$errors[fieldName].push(errorMessage);
          _$errors.count++;
        }
      });
      privateVariable(_$errors, 'clear', function (fieldName, errorMessage) {
        if (!_.isUndefined(errorMessage)) {
          clearErrorMessage(fieldName, errorMessage);
        } else {
          var toClear = [];
          if (_.isArray(fieldName))
            toClear = fieldName;
          if (_.isString(fieldName))
            toClear.push(fieldName);
          if (_.isUndefined(fieldName))
            toClear = _.keys(_$errors);
          _.each(toClear, removeFieldOfErrors);
        }
      });
      privateVariable(_$errors, 'countFor', function (fieldName) {
        if (_.isUndefined(fieldName))
          return _$errors.count;
        else
          return _$errors[fieldName] ? _$errors[fieldName].length : 0;
      });
      function removeFieldOfErrors(fieldName) {
        var count = _$errors[fieldName].length;
        delete _$errors[fieldName];
        _$errors.count -= count;
      }
      function clearErrorMessage(fieldName, errorMessage) {
        if (_.include(_$errors[fieldName], errorMessage)) {
          _.pull(_$errors[fieldName], errorMessage);
          _$errors.count--;
          if (_$errors[fieldName].length === 0)
            delete _$errors[fieldName];
        }
      }
      privateVariable(_$errors, 'count', 0);
      this.__$errors = _$errors;
    }
    return Errorable;
  }]);
angular.module('ngActiveResource').factory('AREventable', [function () {
    function Eventable() {
      var events = { handlers: {} };
      Object.defineProperty(this, 'emit', {
        enumerable: true,
        value: function (eventType) {
          if (!events.handlers[eventType])
            return;
          var handlerArgs = Array.prototype.slice.call(arguments, 1);
          _.each(events.handlers[eventType], function (handler) {
            handler.apply(this, handlerArgs);
          }, this);
          return events;
        }
      });
      function addAspect(eventType, handler) {
        if (!(eventType in events.handlers)) {
          events.handlers[eventType] = [];
        }
        events.handlers[eventType].push(handler);
        return this;
      }
      ;
      this.on = function (eventType, handler) {
        return addAspect(eventType, handler);
      };
      this.before = function (eventType, handler) {
        return addAspect(eventType + ':called', handler);
      };
      this.during = function (eventType, handler) {
        return addAspect(eventType + ':beginning', handler);
      };
      this.data = function (eventType, handler) {
        return addAspect(eventType + ':data', handler);
      };
      this.after = function (eventType, handler) {
        return addAspect(eventType + ':complete', handler);
      };
      this.fail = function (eventType, handler) {
        return addAspect(eventType + ':fail', handler);
      };
    }
    ;
    return Eventable;
  }]);
angular.module('ngActiveResource').factory('ARForeignKeyify', [function () {
    return function foreignKeyify(instance) {
      var reflections = instance.constructor.reflections, instance = _.cloneDeep(instance);
      return _.transform(reflections, function (keyified, reflection) {
        if (reflection.foreignKey && instance[reflection.name]) {
          instance[reflection.foreignKey] = instance[reflection.name][reflection.associationPrimaryKey()];
          delete instance[reflection.name];
        }
      }, instance);
    };
  }]);
(function () {
  angular.module('ngActiveResource').factory('ARFunctionChain', [function () {
      function FunctionChain(attributes) {
        if (attributes === undefined)
          attributes = {};
        ensureFunctionChainValidity(attributes.functions);
        var functionChain = attributes.functions || [];
        functionChain.name = attributes.name || 'Function chain';
        functionChain.push = fnChainPush;
        functionChain.unshift = fnChainUnshift;
        functionChain.remove = removeFn;
        functionChain.removeAll = removeAllFns;
        return functionChain;
      }
      ;
      function ensureFunctionChainValidity(functions) {
        if (functions === undefined)
          return;
        if (!_.isArray(functions)) {
          throw new FunctionChainInitializationError();
        }
        _.each(functions, function (fn) {
          if (!_.isFunction(fn)) {
            throw new FunctionChainInitializationError();
          }
        });
      }
      ;
      function FunctionChainInitializationError() {
        this.name = 'FunctionChainInitializationError';
        this.message = 'Function chain must be an array of functions';
      }
      ;
      function fnChainPush() {
        callCoreIfFunction.apply(this, _.flatten([
          'push',
          arguments
        ]));
      }
      ;
      function fnChainUnshift() {
        callCoreIfFunction.apply(this, _.flatten([
          'unshift',
          arguments
        ]));
      }
      ;
      function callCoreIfFunction(coreFn) {
        var functionChain = this;
        _.each(Array.prototype.slice.call(arguments, 1), function (argument) {
          ensureFunction.call(this, argument);
          Array.prototype[coreFn].call(functionChain, argument);
        });
      }
      ;
      function ensureFunction(argument) {
        if (!_.isFunction(argument)) {
          throw new TypeError(this.name + ' must contain functions');
        }
      }
      ;
      function removeFn(fn) {
        var functionChain = this;
        if (_.isFunction(fn))
          removeFunction(functionChain, fn);
        if (_.isString(fn))
          removeFunctionByName(functionChain, fn);
      }
      ;
      function removeFunction(functionChain, fn) {
        _.remove(functionChain, fn);
      }
      ;
      function removeFunctionByName(functionChain, fn) {
        _.remove(functionChain, function (f) {
          return f.name == fn;
        });
      }
      ;
      function removeAllFns() {
        var functionChain = this;
        _.remove(functionChain, function (fn) {
          return _.isFunction(fn);
        });
      }
      ;
      return FunctionChain;
    }]);
}());
// FunctionalCollection
//
// Functional programming methods exposed as collection iterators. Primarily these
// are wrappers around Lodash methods, with a few mutating versions added.
//
//  collection.map  => Lodash version, collection bound as context
//  collection.$map => Mutates the collection in-place
//
// All mutating methods are prefaced with a dollar sign (e.g. $map, $reduce, $select,
// $filter, $reject, $compact)
//
angular.module('ngActiveResource').factory('ARFunctional.Collection', [
  'ARMixin',
  function (mixin) {
    function FunctionalCollection() {
      privateVariable(this, 'each', function (callback) {
        return _.each(this, callback, this);
      });
      privateVariable(this, 'map', function (callback) {
        return mixin(_.map(this, callback, this), FunctionalCollection);
      });
      // Mutating O(n) map
      privateVariable(this, '$map', function (callback) {
        for (var i in this) {
          this[i] = callback(this[i]);
        }
        return this;
      });
      privateVariable(this, 'collect', function (callback) {
        return this.map(callback, this);
      });
      // Mutating O(n) collect
      privateVariable(this, '$collect', function (callback) {
        return this.$map(callback, this);
      });
      privateVariable(this, 'pluck', function (attribute) {
        return mixin(_.pluck(this, attribute), FunctionalCollection);
      });
      privateVariable(this, 'inject', function (callback, accumulator) {
        return _.inject(this, callback, accumulator);
      });
      privateVariable(this, 'reduce', function (callback, accumulator) {
        return this.inject(callback, acculumulator);
      });
      privateVariable(this, 'all', function (callback) {
        return _.all(this, callback, this);
      });
      privateVariable(this, 'every', function (callback) {
        return this.all(callback, this);
      });
      privateVariable(this, 'any', function (callback) {
        return _.any(this, callback, this);
      });
      privateVariable(this, 'max', function (callback) {
        return _.max(this, callback, this);
      });
      privateVariable(this, 'min', function (callback) {
        return _.min(this, callback, this);
      });
      privateVariable(this, 'filter', function (callback) {
        return mixin(_.filter(this, callback, this), FunctionalCollection);
      });
      // Mutating O(n) filter
      privateVariable(this, '$filter', function (callback) {
        return this.$map(function (element) {
          if (callback(element)) {
            return element;
          }
        }).$compact();
        ;
      });
      privateVariable(this, 'select', function (callback) {
        return this.filter(callback);
      });
      // Mutating O(n) select
      privateVariable(this, '$select', function (callback) {
        return this.$filter(callback);
      });
      privateVariable(this, 'reject', function (callback) {
        return mixin(_.reject(this, callback, this), FunctionalCollection);
      });
      // Mutating O(n) reject
      privateVariable(this, '$reject', function (callback) {
        return this.$map(function (element) {
          if (!callback(element)) {
            return element;
          }
        }).$compact();
        ;
      });
      privateVariable(this, 'include', function (element) {
        return _.include(this, element);
      });
      privateVariable(this, 'contains', function (element) {
        return this.include(element);
      });
      privateVariable(this, 'sortBy', function (callback) {
        return _.sortBy(this, callback, this);
      });
      privateVariable(this, 'transform', function (callback, accumulator) {
        return _.transform(this, callback, accumulator);
      });
      privateVariable(this, 'toObject', function (callback) {
        return this.transform(callback, {});
      });
      privateVariable(this, 'compact', function () {
        return mixin(_.compact(this), FunctionalCollection);
      });
      // Mutating O(n) compact
      privateVariable(this, '$compact', function () {
        for (var i = this.length; i--;) {
          if (_.isUndefined(this[i]) || _.isNull(this[i]) || this[i] === 0 || this[i] == '' || this[i] === false) {
            this.splice(i, 1);
          }
        }
        return this;
      });
      // Mutating O(n) removeAll
      privateVariable(this, '$removeAll', function () {
        return this.$map(function (n) {
          return;
        }).$compact();
      });
      privateVariable(this, 'count', function (callback) {
        return this.inject(function (sum, el) {
          if (callback(el))
            sum += 1;
          return sum;
        }, 0);
      });
      privateVariable(this, 'where', function (terms) {
        return mixin(_.where(this, terms, this), FunctionalCollection);
      });
      privateVariable(this, 'first', function () {
        return _.first(this);
      });
      privateVariable(this, 'last', function () {
        return _.last(this);
      });
      privateVariable(this, 'isEmpty', function () {
        return _.isEmpty(this);
      });
      privateVariable(this, 'empty', function () {
        return this.isEmpty();
      });
    }
    return FunctionalCollection;
  }
]);
angular.module('ngActiveResource').factory('ARFunctional', [function () {
    function Functional() {
      this.__tap = function (fn) {
        fn(this);
        return this;
      };
    }
    return Functional;
  }]);
angular.module('ngActiveResource').factory('ARHTTPConfig', [
  '$http',
  function ($http) {
    function httpConfig(klass) {
      return _.merge({}, klass.api.$http, {
        headers: {
          'Content-Type': klass.api.mimetype().name,
          'Accept': klass.api.mimetype().name
        }
      }, _.defaults);
    }
    return httpConfig;
  }
]);
// Unified handler for remote responses
//
// Override default behavior via Class.whereHandler, Class.createHandler, etc.
//
// Custom handlers should return true if the response is not an error, and false
// if the response is an error.
angular.module('ngActiveResource').factory('ARHTTPResponseHandler', [
  'ARStrictRequire',
  function (strictRequire) {
    function HTTPResponseHandler(options) {
      strictRequire(options, [
        'action',
        'response',
        'deferred',
        'klass',
        'params'
      ]);
      this.action = options.action;
      this.request = {
        url: options.url,
        params: options.params
      }, this.response = options.response;
      this.status = options.status || 200;
      this.headers = options.headers || function () {
        return {};
      };
      this.deferred = options.deferred;
      this.klass = options.klass;
      this.params = options.params;
      this.success = options.success;
      this.error = options.error;
      this.handler = function () {
        return _.isFunction(this.klass[this.action + 'Handler']) ? this.klass[this.action + 'Handler'] : defaultHandler;
      };
      this.klass.emit(this.action + ':data', this.response);
      this.resolve = this.handler()(this.response, this.status, this.headers);
      return this.resolve ? new Resolver(this) : new Rejecter(this);
    }
    function defaultHandler(response, status, headers) {
      status = String(status);
      return status[0] != '4' && status[0] != '5';
    }
    function Resolver(options) {
      options.response = options.klass.deserialize(options.response.data);
      options.success(options);
      options.klass.emit(options.action + ':complete', options.deferred, options.response, options.request);
      options.deferred.resolve(options.response);
    }
    function Rejecter(options) {
      options.response.status = options.response.status || options.status;
      options.response.headers = options.response.headers || options.headers;
      options.error(options);
      options.klass.emit(options.action + ':fail', options.deferred, options.response, options.request);
      options.deferred.reject();
    }
    return HTTPResponseHandler;
  }
]);
angular.module('ngActiveResource').factory('ARMime.Formattable', [
  'ARMime',
  'ARMime.XML',
  'ARMime.JSON',
  function (Mime, XML, JSON) {
    function Formattable() {
      this.__toXml = function () {
        return Mime.format({
          type: 'xml',
          data: this
        });
      };
      this.__toJson = function () {
        return Mime.format({
          type: 'json',
          data: this
        });
      };
    }
    return Formattable;
  }
]);
angular.module('ngActiveResource').factory('ARMime.JSON', [
  'ARMime',
  function (Mime) {
    var json = new Mime.Format({ name: 'json' }), applicationJson = new Mime.Type({ name: 'application/json' });
    Mime.formats['json'].parsers.push(function (json) {
      if (_.isObject(json)) {
        return json;
      }
      if (_.isString(json)) {
        return JSON.parse(json);
      }
    });
    Mime.formats['json'].formatters.push(JSON.stringify);
    return JSON;
  }
]);
(function () {
  var Mime = {};
  angular.module('ngActiveResource').factory('ARMime', [
    'ARMime.Format',
    'ARMime.Type',
    'ARMime.parse',
    'ARMime.format',
    'ARSet',
    function (Format, MimeType, parse, format, Set) {
      Mime.Format = Format;
      Mime.Type = MimeType;
      Mime.formats = new Set();
      Mime.types = new Set();
      Mime.parse = parse;
      Mime.format = format;
      Mime.Type.find = function (formatOrType) {
        var mimetype = Mime.types.find(formatOrType), format = Mime.formats.find(formatOrType);
        if (!_.isUndefined(mimetype)) {
          return mimetype;
        }
        if (_.isUndefined(format)) {
          throw new MimeTypeNotFoundError(formatOrType);
        }
        return Mime.types.find(Mime.Type.defaults[format.name]);
      };
      Mime.Type.defaults = {
        'json': 'application/json',
        'xml': 'text/xml'
      };
      return Mime;
    }
  ]).factory('ARMime.Format', [
    'ARStrictRequire',
    'ARMime.parse',
    'ARMime.format',
    'ARFunctionChain',
    function (strictRequire, parse, format, FunctionChain) {
      function Format(attributes) {
        strictRequire(attributes, ['name']);
        this.name = attributes.name;
        this.parsers = new FunctionChain({
          functions: attributes.parsers,
          name: 'Parsers'
        });
        this.formatters = new FunctionChain({
          functions: attributes.formatters,
          name: 'Formatters'
        });
        this.parse = formatSpecificParse;
        this.format = formatSpecificFormat;
        if (attributes.mimetype != true) {
          Mime.formats.add({
            key: this.name,
            value: this,
            error: 'Format already registered with ngActiveResource. See ARMime documentation to customize this Format.'
          });
        }
      }
      ;
      function formatSpecificParse(data) {
        return formatSpecificChain(this.name, data, parse);
      }
      ;
      function formatSpecificFormat(data) {
        return formatSpecificChain(this.name, data, format);
      }
      function formatSpecificChain(format, data, strategy) {
        return strategy({
          type: format,
          data: data
        });
      }
      return Format;
    }
  ]).factory('ARMime.Type', [
    'ARStrictRequire',
    'ARMime.parse',
    'ARMime.Format',
    function (strictRequire, parse, Format) {
      function MimeType(attributes) {
        strictRequire(attributes, ['name']);
        attributes.mimetype = true;
        Format.call(this, attributes);
        parseName.call(this, attributes.name);
        Mime.types.add({
          key: this.name,
          value: this,
          error: 'MimeType already registered with ngActiveResource. See ARMime documentation to customize this MimeType.'
        });
      }
      ;
      function parseName(name) {
        ensureValidMimeType(name);
        this.topLevelName = topLevelDomain();
        name = nameMinusTopLevelDomain();
        this.tree = tree();
        name = nameMinusTree();
        this.subtypeName = subtypeName();
        this.suffix = suffix();
        // 'application/vnd.atom+xml' => 'application'
        function topLevelDomain() {
          return name.split('/')[0];
        }
        ;
        // 'application/vnd.atom+xml' => 'vnd.atom+xml'
        function nameMinusTopLevelDomain() {
          return name.split('/')[1];
        }
        ;
        // 'vnd.atom+xml' => 'vnd'
        // 'prs.my-media' => 'prs'
        // 'json'         => 'standards'
        function tree() {
          return containsTree() ? name.split('.')[0] : 'standards';
        }
        ;
        // 'vnd.atom+xml' => 'atom+xml'
        // 'prs.my-media' => 'my-media'
        // 'json'         => 'json'
        function nameMinusTree() {
          return containsTree() ? name.split('.')[1] : name.split('.')[0];
        }
        ;
        // 'atom+xml' => 'atom'
        // 'json'     => 'json'
        function subtypeName() {
          return containsSuffix() ? name.split('+')[0] : name;
        }
        ;
        // 'atom+xml' => 'xml'
        // 'json'     => undefined
        function suffix() {
          return containsSuffix() ? name.split('+')[1] : undefined;
        }
        ;
        function containsTree() {
          return name.split('.')[1] !== undefined;
        }
        ;
        function containsSuffix() {
          return name.split('+')[1] !== undefined;
        }
        ;
      }
      ;
      function ensureValidMimeType(name) {
        if (name.match('/') === null) {
          throw {
            name: 'InvalidMimeTypeError',
            message: 'MimeType ' + name + ' must be in format top-level-name/subtype-name[+suffix]. E.g. application/json or application/atom+xml'
          };
        }
      }
      ;
      return MimeType;
    }
  ]).factory('ARMime.parse', [
    'ARStrictRequire',
    function (strictRequire) {
      function parseDataAccordingToMimeType(attributes) {
        strictRequire(attributes, [
          'type',
          'data'
        ]);
        parseOrFormatData(attributes, 'parsers');
        ensureParseChainSuccess(attributes.data, attributes.type);
        return attributes.data;
      }
      ;
      function ensureParseChainSuccess(object, mimetype) {
        if (!_.isObject(object)) {
          throw {
            name: 'ParseError',
            message: 'Parse chain did not return a Javascript object for mimetype ' + mimetype
          };
        }
        ;
      }
      ;
      return parseDataAccordingToMimeType;
    }
  ]).factory('ARMime.format', [
    'ARStrictRequire',
    function (strictRequire) {
      function formatDataAccordingToMimeType(attributes) {
        strictRequire(attributes, [
          'type',
          'data'
        ]);
        return parseOrFormatData(attributes, 'formatters');
      }
      ;
      return formatDataAccordingToMimeType;
    }
  ]);
  function parseOrFormatData(attributes, parsersOrFormatters) {
    var functionChain = getFunctionChain(attributes.type, parsersOrFormatters);
    _.each(functionChain, function (fn) {
      attributes.data = fn(attributes.data);
    });
    return attributes.data;
  }
  function getFunctionChain(type, chainType) {
    var mimetype = getMimetype(type, chainType);
    var format = _.isString(mimetype.name) ? getFormat(mimetype, chainType) : getFormat(type, chainType);
    return _.isUndefined(format) ? mimetype[chainType] : _.flatten([
      format[chainType],
      mimetype[chainType]
    ]);
  }
  function getMimetype(type, chainType) {
    return Mime.types.find(type) || emptyResult(chainType);
  }
  ;
  function getFormat(mimetype, chainType) {
    return Mime.formats.find(mimetype) || Mime.formats.find(mimetype.suffix) || Mime.formats.find(mimetype.subtypeName) || emptyResult(chainType);
  }
  ;
  function emptyResult(chainType) {
    var emptyResult = {};
    emptyResult[chainType] = [];
    return emptyResult;
  }
}());
angular.module('ngActiveResource').factory('ARMime.toNativeTypes', [function () {
    return function toNativeTypes(object) {
      return _.transform(object, function (result, val, key) {
        if (_.isArray(val)) {
          result[key] = _.map(val, toNativeTypes);
        } else if (_.isObject(val)) {
          result[key] = toNativeTypes(val);
        } else if (isNaN(val)) {
          result[key] = val;
        } else {
          result[key] = parseFloat(val);
        }
      }, {});
    };
  }]);
'use strict';
/*
 Copyright 2011-2014 Abdulla Abdurakhmanov & Brett Shollenberger
 Original sources are available at https://code.google.com/p/x2js/

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
angular.module('ngActiveResource').factory('ARMime.XML', [
  'ARMime',
  'ARMime.toNativeTypes',
  function (Mime, toNativeTypes) {
    var XML = new Mime.Format({ name: 'xml' }), textXML = new Mime.Type({ name: 'text/xml' }), parser = new X2JS();
    Mime.formats['xml'].parsers.push(_.bind(parser.xml_str2json, parser));
    Mime.formats['xml'].parsers.push(toNativeTypes);
    Mime.formats['xml'].formatters.push(_.bind(parser.json2xml_str, parser));
    return XML;
    function X2JS(config) {
      var VERSION = '1.1.5';
      config = config || {};
      initConfigDefaults();
      initRequiredPolyfills();
      function initConfigDefaults() {
        if (config.escapeMode === undefined) {
          config.escapeMode = true;
        }
        config.attributePrefix = config.attributePrefix || '_';
        config.arrayAccessForm = config.arrayAccessForm || 'none';
        config.emptyNodeForm = config.emptyNodeForm || 'text';
        if (config.enableToStringFunc === undefined) {
          config.enableToStringFunc = true;
        }
        config.arrayAccessFormPaths = config.arrayAccessFormPaths || [];
        if (config.skipEmptyTextNodesForObj === undefined) {
          config.skipEmptyTextNodesForObj = true;
        }
        if (config.stripWhitespaces === undefined) {
          config.stripWhitespaces = true;
        }
        config.datetimeAccessFormPaths = config.datetimeAccessFormPaths || [];
      }
      var DOMNodeTypes = {
          ELEMENT_NODE: 1,
          TEXT_NODE: 3,
          CDATA_SECTION_NODE: 4,
          COMMENT_NODE: 8,
          DOCUMENT_NODE: 9
        };
      function initRequiredPolyfills() {
        function pad(number) {
          var r = String(number);
          if (r.length === 1) {
            r = '0' + r;
          }
          return r;
        }
        // Hello IE8-
        if (typeof String.prototype.trim !== 'function') {
          String.prototype.trim = function () {
            return this.replace(/^\s+|^\n+|(\s|\n)+$/g, '');
          };
        }
        if (typeof Date.prototype.toISOString !== 'function') {
          // Implementation from http://stackoverflow.com/questions/2573521/how-do-i-output-an-iso-8601-formatted-string-in-javascript
          Date.prototype.toISOString = function () {
            return this.getUTCFullYear() + '-' + pad(this.getUTCMonth() + 1) + '-' + pad(this.getUTCDate()) + 'T' + pad(this.getUTCHours()) + ':' + pad(this.getUTCMinutes()) + ':' + pad(this.getUTCSeconds()) + '.' + String((this.getUTCMilliseconds() / 1000).toFixed(3)).slice(2, 5) + 'Z';
          };
        }
      }
      function getNodeLocalName(node) {
        var nodeLocalName = node.localName;
        if (nodeLocalName == null)
          // Yeah, this is IE!! 
          nodeLocalName = node.baseName;
        if (nodeLocalName == null || nodeLocalName == '')
          // =="" is IE too
          nodeLocalName = node.nodeName;
        return nodeLocalName;
      }
      function getNodePrefix(node) {
        return node.prefix;
      }
      function escapeXmlChars(str) {
        if (typeof str == 'string')
          return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g, '&#x2F;');
        else
          return str;
      }
      function unescapeXmlChars(str) {
        return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, '\'').replace(/&#x2F;/g, '/');
      }
      function toArrayAccessForm(obj, childName, path) {
        switch (config.arrayAccessForm) {
        case 'property':
          if (!(obj[childName] instanceof Array))
            obj[childName + '_asArray'] = [obj[childName]];
          else
            obj[childName + '_asArray'] = obj[childName];
          break;  /*case "none":
              break;*/
        }
        if (!(obj[childName] instanceof Array) && config.arrayAccessFormPaths.length > 0) {
          var idx = 0;
          for (; idx < config.arrayAccessFormPaths.length; idx++) {
            var arrayPath = config.arrayAccessFormPaths[idx];
            if (typeof arrayPath === 'string') {
              if (arrayPath == path)
                break;
            } else if (arrayPath instanceof RegExp) {
              if (arrayPath.test(path))
                break;
            } else if (typeof arrayPath === 'function') {
              if (arrayPath(obj, childName, path))
                break;
            }
          }
          if (idx != config.arrayAccessFormPaths.length) {
            obj[childName] = [obj[childName]];
          }
        }
      }
      function fromXmlDateTime(prop) {
        // Implementation based up on http://stackoverflow.com/questions/8178598/xml-datetime-to-javascript-date-object
        // Improved to support full spec and optional parts
        var bits = prop.split(/[-T:+Z]/g);
        var d = new Date(bits[0], bits[1] - 1, bits[2]);
        var secondBits = bits[5].split('.');
        d.setHours(bits[3], bits[4], secondBits[0]);
        if (secondBits.length > 1)
          d.setMilliseconds(secondBits[1]);
        // Get supplied time zone offset in minutes
        if (bits[6] && bits[7]) {
          var offsetMinutes = bits[6] * 60 + Number(bits[7]);
          var sign = /\d\d-\d\d:\d\d$/.test(prop) ? '-' : '+';
          // Apply the sign
          offsetMinutes = 0 + (sign == '-' ? -1 * offsetMinutes : offsetMinutes);
          // Apply offset and local timezone
          d.setMinutes(d.getMinutes() - offsetMinutes - d.getTimezoneOffset());
        } else if (prop.indexOf('Z', prop.length - 1) !== -1) {
          d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()));
        }
        // d is now a local time equivalent to the supplied time
        return d;
      }
      function checkFromXmlDateTimePaths(value, childName, fullPath) {
        if (config.datetimeAccessFormPaths.length > 0) {
          var path = fullPath.split('.#')[0];
          var idx = 0;
          for (; idx < config.datetimeAccessFormPaths.length; idx++) {
            var dtPath = config.datetimeAccessFormPaths[idx];
            if (typeof dtPath === 'string') {
              if (dtPath == path)
                break;
            } else if (dtPath instanceof RegExp) {
              if (dtPath.test(path))
                break;
            } else if (typeof dtPath === 'function') {
              if (dtPath(obj, childName, path))
                break;
            }
          }
          if (idx != config.datetimeAccessFormPaths.length) {
            return fromXmlDateTime(value);
          } else
            return value;
        } else
          return value;
      }
      function parseDOMChildren(node, path) {
        if (node.nodeType == DOMNodeTypes.DOCUMENT_NODE) {
          var result = new Object();
          var nodeChildren = node.childNodes;
          // Alternative for firstElementChild which is not supported in some environments
          for (var cidx = 0; cidx < nodeChildren.length; cidx++) {
            var child = nodeChildren.item(cidx);
            if (child.nodeType == DOMNodeTypes.ELEMENT_NODE) {
              var childName = getNodeLocalName(child);
              result[childName] = parseDOMChildren(child, childName);
            }
          }
          return result;
        } else if (node.nodeType == DOMNodeTypes.ELEMENT_NODE) {
          var result = new Object();
          result.__cnt = 0;
          var nodeChildren = node.childNodes;
          // Children nodes
          for (var cidx = 0; cidx < nodeChildren.length; cidx++) {
            var child = nodeChildren.item(cidx);
            // nodeChildren[cidx];
            var childName = getNodeLocalName(child);
            if (child.nodeType != DOMNodeTypes.COMMENT_NODE) {
              result.__cnt++;
              if (result[childName] == null) {
                result[childName] = parseDOMChildren(child, path + '.' + childName);
                toArrayAccessForm(result, childName, path + '.' + childName);
              } else {
                if (result[childName] != null) {
                  if (!(result[childName] instanceof Array)) {
                    result[childName] = [result[childName]];
                    toArrayAccessForm(result, childName, path + '.' + childName);
                  }
                }
                result[childName][result[childName].length] = parseDOMChildren(child, path + '.' + childName);
              }
            }
          }
          // Attributes
          for (var aidx = 0; aidx < node.attributes.length; aidx++) {
            var attr = node.attributes.item(aidx);
            // [aidx];
            result.__cnt++;
            result[config.attributePrefix + attr.name] = attr.value;
          }
          // Node namespace prefix
          var nodePrefix = getNodePrefix(node);
          if (nodePrefix != null && nodePrefix != '') {
            result.__cnt++;
            result.__prefix = nodePrefix;
          }
          if (result['#text'] != null) {
            result.__text = result['#text'];
            if (result.__text instanceof Array) {
              result.__text = result.__text.join('\n');
            }
            if (config.escapeMode)
              result.__text = unescapeXmlChars(result.__text);
            if (config.stripWhitespaces)
              result.__text = result.__text.trim();
            delete result['#text'];
            if (config.arrayAccessForm == 'property')
              delete result['#text_asArray'];
            result.__text = checkFromXmlDateTimePaths(result.__text, childName, path + '.' + childName);
          }
          if (result['#cdata-section'] != null) {
            result.__cdata = result['#cdata-section'];
            delete result['#cdata-section'];
            if (config.arrayAccessForm == 'property')
              delete result['#cdata-section_asArray'];
          }
          if (result.__cnt == 1 && result.__text != null) {
            result = result.__text;
          } else if (result.__cnt == 0 && config.emptyNodeForm == 'text') {
            result = '';
          } else if (result.__cnt > 1 && result.__text != null && config.skipEmptyTextNodesForObj) {
            if (config.stripWhitespaces && result.__text == '' || result.__text.trim() == '') {
              delete result.__text;
            }
          }
          delete result.__cnt;
          if (config.enableToStringFunc && (result.__text != null || result.__cdata != null)) {
            result.toString = function () {
              return (this.__text != null ? this.__text : '') + (this.__cdata != null ? this.__cdata : '');
            };
          }
          return result;
        } else if (node.nodeType == DOMNodeTypes.TEXT_NODE || node.nodeType == DOMNodeTypes.CDATA_SECTION_NODE) {
          return node.nodeValue;
        }
      }
      function startTag(jsonObj, element, attrList, closed) {
        var resultStr = '<' + (jsonObj != null && jsonObj.__prefix != null ? jsonObj.__prefix + ':' : '') + element;
        if (attrList != null) {
          for (var aidx = 0; aidx < attrList.length; aidx++) {
            var attrName = attrList[aidx];
            var attrVal = jsonObj[attrName];
            if (config.escapeMode)
              attrVal = escapeXmlChars(attrVal);
            resultStr += ' ' + attrName.substr(config.attributePrefix.length) + '=\'' + attrVal + '\'';
          }
        }
        if (!closed)
          resultStr += '>';
        else
          resultStr += '/>';
        return resultStr;
      }
      function endTag(jsonObj, elementName) {
        return '</' + (jsonObj.__prefix != null ? jsonObj.__prefix + ':' : '') + elementName + '>';
      }
      function endsWith(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
      }
      function jsonXmlSpecialElem(jsonObj, jsonObjField) {
        if (config.arrayAccessForm == 'property' && endsWith(jsonObjField.toString(), '_asArray') || jsonObjField.toString().indexOf(config.attributePrefix) == 0 || jsonObjField.toString().indexOf('__') == 0 || jsonObj[jsonObjField] instanceof Function)
          return true;
        else
          return false;
      }
      function jsonXmlElemCount(jsonObj) {
        var elementsCnt = 0;
        if (jsonObj instanceof Object) {
          for (var it in jsonObj) {
            if (jsonXmlSpecialElem(jsonObj, it))
              continue;
            elementsCnt++;
          }
        }
        return elementsCnt;
      }
      function parseJSONAttributes(jsonObj) {
        var attrList = [];
        if (jsonObj instanceof Object) {
          for (var ait in jsonObj) {
            if (ait.toString().indexOf('__') == -1 && ait.toString().indexOf(config.attributePrefix) == 0) {
              attrList.push(ait);
            }
          }
        }
        return attrList;
      }
      function parseJSONTextAttrs(jsonTxtObj) {
        var result = '';
        if (jsonTxtObj.__cdata != null) {
          result += '<![CDATA[' + jsonTxtObj.__cdata + ']]>';
        }
        if (jsonTxtObj.__text != null) {
          if (config.escapeMode)
            result += escapeXmlChars(jsonTxtObj.__text);
          else
            result += jsonTxtObj.__text;
        }
        return result;
      }
      function parseJSONTextObject(jsonTxtObj) {
        var result = '';
        if (jsonTxtObj instanceof Object) {
          result += parseJSONTextAttrs(jsonTxtObj);
        } else if (jsonTxtObj != null) {
          if (config.escapeMode)
            result += escapeXmlChars(jsonTxtObj);
          else
            result += jsonTxtObj;
        }
        return result;
      }
      function parseJSONArray(jsonArrRoot, jsonArrObj, attrList) {
        var result = '';
        if (jsonArrRoot.length == 0) {
          result += startTag(jsonArrRoot, jsonArrObj, attrList, true);
        } else {
          for (var arIdx = 0; arIdx < jsonArrRoot.length; arIdx++) {
            result += startTag(jsonArrRoot[arIdx], jsonArrObj, parseJSONAttributes(jsonArrRoot[arIdx]), false);
            result += parseJSONObject(jsonArrRoot[arIdx]);
            result += endTag(jsonArrRoot[arIdx], jsonArrObj);
          }
        }
        return result;
      }
      function parseJSONObject(jsonObj) {
        var result = '';
        var elementsCnt = jsonXmlElemCount(jsonObj);
        if (elementsCnt > 0) {
          for (var it in jsonObj) {
            if (jsonXmlSpecialElem(jsonObj, it))
              continue;
            var subObj = jsonObj[it];
            var attrList = parseJSONAttributes(subObj);
            if (subObj == null || subObj == undefined) {
              result += startTag(subObj, it, attrList, true);
            } else if (subObj instanceof Object) {
              if (subObj instanceof Array) {
                result += parseJSONArray(subObj, it, attrList);
              } else if (subObj instanceof Date) {
                result += startTag(subObj, it, attrList, false);
                result += subObj.toISOString();
                result += endTag(subObj, it);
              } else {
                var subObjElementsCnt = jsonXmlElemCount(subObj);
                if (subObjElementsCnt > 0 || subObj.__text != null || subObj.__cdata != null) {
                  result += startTag(subObj, it, attrList, false);
                  result += parseJSONObject(subObj);
                  result += endTag(subObj, it);
                } else {
                  result += startTag(subObj, it, attrList, true);
                }
              }
            } else {
              result += startTag(subObj, it, attrList, false);
              result += parseJSONTextObject(subObj);
              result += endTag(subObj, it);
            }
          }
        }
        result += parseJSONTextObject(jsonObj);
        return result;
      }
      this.parseXmlString = function (xmlDocStr) {
        var isIEParser = window.ActiveXObject || 'ActiveXObject' in window;
        if (xmlDocStr === undefined) {
          return null;
        }
        var xmlDoc;
        if (window.DOMParser) {
          var parser = new window.DOMParser();
          var parsererrorNS = null;
          // IE9+ now is here
          if (!isIEParser) {
            try {
              parsererrorNS = parser.parseFromString('INVALID', 'text/xml').childNodes[0].namespaceURI;
            } catch (err) {
              parsererrorNS = null;
            }
          }
          try {
            xmlDoc = parser.parseFromString(xmlDocStr, 'text/xml');
            if (parsererrorNS != null && xmlDoc.getElementsByTagNameNS(parsererrorNS, 'parsererror').length > 0) {
              //throw new Error('Error parsing XML: '+xmlDocStr);
              xmlDoc = null;
            }
          } catch (err) {
            xmlDoc = null;
          }
        } else {
          // IE :(
          if (xmlDocStr.indexOf('<?') == 0) {
            xmlDocStr = xmlDocStr.substr(xmlDocStr.indexOf('?>') + 2);
          }
          xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
          xmlDoc.async = 'false';
          xmlDoc.loadXML(xmlDocStr);
        }
        return xmlDoc;
      };
      this.asArray = function (prop) {
        if (prop instanceof Array)
          return prop;
        else
          return [prop];
      };
      this.toXmlDateTime = function (dt) {
        if (dt instanceof Date)
          return dt.toISOString();
        else if (typeof dt === 'number')
          return new Date(dt).toISOString();
        else
          return null;
      };
      this.asDateTime = function (prop) {
        if (typeof prop == 'string') {
          return fromXmlDateTime(prop);
        } else
          return prop;
      };
      this.xml2json = function (xmlDoc) {
        return parseDOMChildren(xmlDoc);
      };
      this.xml_str2json = function (xmlDocStr) {
        var xmlDoc = this.parseXmlString(xmlDocStr);
        if (xmlDoc != null)
          return this.xml2json(xmlDoc);
        else
          return null;
      };
      this.json2xml_str = function (jsonObj) {
        return parseJSONObject(jsonObj);
      };
      this.json2xml = function (jsonObj) {
        var xmlDocStr = this.json2xml_str(jsonObj);
        return this.parseXmlString(xmlDocStr);
      };
      this.getVersion = function () {
        return VERSION;
      };
    }
  }
]);
angular.module('ngActiveResource').factory('ARMixin', [function () {
    function mixin(receiver, Module) {
      var instance = new Module(), propNames = Object.getOwnPropertyNames(instance);
      _.each(propNames, function (propName) {
        if (!receiver.hasOwnProperty(propName)) {
          var descriptor = Object.getOwnPropertyDescriptor(instance, propName);
          Object.defineProperty(receiver, propName, descriptor);
        }
      });
      if (_.isFunction(Module.mixedIn)) {
        Module.mixedIn(receiver);
      }
      return receiver;
    }
    return mixin;
  }]);
angular.module('ngActiveResource').factory('ARUnwrapRoot', [function () {
    return function unwrapRoot(oldObject) {
      return _.transform(oldObject, function (newObject, value, key) {
        _.each(oldObject[key], function (v, k) {
          newObject[k] = v;
        });
        return newObject;
      }, {});
    };
  }]);
angular.module('ngActiveResource').factory('ARCreatable', [function () {
    function Creatable() {
      this.new = function (attributes) {
        attributes = attributes || {};
        this.emit('new:called', attributes);
        var instance = new this(attributes);
        this.emit('new:beginning', instance, attributes);
        this.emit('new:complete', instance);
        return instance;
      };
      this.$create = function (attributes, config) {
        return this.new().$save(attributes, config);
      };
      this.createOrUpdate = function (attributes) {
        attributes = attributes || {};
        if (this.findCached(attributes)) {
          return this.findCached(attributes).update(attributes);
        }
        return this.new(attributes);
      };
    }
    return Creatable;
  }]);
angular.module('ngActiveResource').factory('ARDeletable', [
  '$http',
  'ARHTTPResponseHandler',
  'ARHTTPConfig',
  function ($http, HTTPResponseHandler, httpConfig) {
    function Deletable() {
      this.__$delete = function (config) {
        var instance = this, klass = instance.constructor, url = klass.api.get('delete', instance);
        config = _.merge({}, config, httpConfig(klass), _.defaults);
        klass.emit('delete:called', instance);
        instance.defer();
        $http.delete(url, config).error(handleResponse).then(handleResponse);
        return instance;
        function handleResponse(response, status, headers) {
          new HTTPResponseHandler({
            action: 'delete',
            url: url,
            response: response,
            status: status,
            headers: headers,
            deferred: instance,
            klass: klass,
            params: {},
            success: onSuccess,
            error: onError
          });
        }
      };
    }
    function onSuccess(success) {
    }
    function onError() {
    }
    return Deletable;
  }
]);
angular.module('ngActiveResource').factory('ARFindable', [
  '$http',
  'ARHTTPResponseHandler',
  'ARHTTPConfig',
  function ($http, HTTPResponseHandler, httpConfig) {
    function Findable() {
      this.find = function (terms, config) {
        var klass = this;
        terms = standardizeTerms(), config = _.merge({}, config, httpConfig(klass), _.defaults);
        klass.emit('find:called', terms);
        return foundCached() ? returnCached() : returnRemote();
        // Private
        //////////////////////////////////
        function standardizeTerms() {
          return _.isObject(terms) ? terms : _.inject([terms], function (terms, id) {
            terms[klass.primaryKey] = id;
            return terms;
          }, {});
        }
        function foundCached() {
          return !!findCached();
        }
        function findCached() {
          return klass.cached[terms[klass.primaryKey]];
        }
        function returnCached() {
          var instance = findCached();
          instance.defer();
          instance.resolve({
            status: 'local',
            data: { message: 'Local instance returned from cache' }
          });
          return instance;
        }
        function returnRemote() {
          var instance = klass.new(), url = klass.api.get('show', terms);
          $http.get(url, config).error(handleResponse).then(handleResponse);
          function handleResponse(response, status, headers) {
            new HTTPResponseHandler({
              action: 'find',
              url: url,
              response: response,
              status: status,
              headers: headers,
              deferred: instance,
              klass: klass,
              params: terms,
              success: onSuccess,
              error: onError
            });
          }
          instance.defer();
          return instance;
        }
      };
      function onSuccess(success) {
      }
      function onError(response) {
      }
    }
    return Findable;
  }
]);
angular.module('ngActiveResource').factory('ARPrimaryKey', [function () {
    PrimaryKey.extended = function (klass) {
      klass.during('new', function (instance, attributes) {
        instance.integer(klass.primaryKey);
        privateVariable(instance, 'hasPrimaryKey', function () {
          return !_.isUndefined(instance[klass.primaryKey]) && !_.isNull(instance[klass.primaryKey]);
        });
      });
    };
    function PrimaryKey() {
      var primaryKey = 'id';
      Object.defineProperty(this, 'primaryKey', {
        configurable: true,
        get: function () {
          return primaryKey;
        },
        set: function (value) {
          primaryKey = value;
        }
      });
    }
    return PrimaryKey;
  }]);
angular.module('ngActiveResource').factory('ARQueryable', [
  '$http',
  'ARMixin',
  'ARFunctional.Collection',
  'ARPromiseable',
  'ARHTTPResponseHandler',
  'ARHTTPConfig',
  function ($http, mixin, FunctionalCollection, Promiseable, HTTPResponseHandler, httpConfig) {
    function Queryable() {
      this.findAll = function (config) {
        return this.where({}, config);
      };
      this.where = function (terms, config) {
        var klass = this, queryResults = mixin([], FunctionalCollection), config = _.merge({}, config, httpConfig(klass), _.defaults);
        queryResults.extend(Promiseable);
        this.watchedCollections.push(queryResults);
        klass.emit('where:called', terms);
        terms = standardizeTerms();
        return returnRemote();
        function standardizeTerms() {
          return _.isObject(terms) ? terms : {};
        }
        function returnRemote() {
          var url = klass.api.get('index', terms);
          $http.get(url, config).error(handleResponse).then(handleResponse);
          function handleResponse(response, status, headers) {
            new HTTPResponseHandler({
              action: 'where',
              url: url,
              response: response,
              status: status,
              headers: headers,
              deferred: queryResults,
              klass: klass,
              params: terms,
              success: onSuccess,
              error: onError
            });
          }
          queryResults.defer();
          return queryResults;
        }
      };
      function onSuccess(success) {
        _.each(success.response, function (attributes) {
          success.deferred.push(success.klass.createOrUpdate(attributes));
        }, success.klass);
      }
      function onError(response) {
        response.deferred.response = response.response;
        if (response.deferred.response.data) {
          response.deferred.response = response.deferred.response.data;
        }
      }
    }
    return Queryable;
  }
]);
angular.module('ngActiveResource').factory('ARSaveable', [
  '$http',
  'ARHTTPConfig',
  'ARHTTPResponseHandler',
  function ($http, httpConfig, HTTPResponseHandler) {
    function Saveable() {
      this.__$save = function (attributes, config) {
        var instance = this, klass = instance.constructor, attributes = attributes || {}, config = _.merge({}, config, httpConfig(klass), _.defaults);
        klass.emit('save:called', instance, attributes);
        instance.defer();
        instance.update(attributes);
        if (instance.$valid) {
          var url = klass.api.get(createOrUpdate(), instance);
          $http[method()](url, instance.serialize(), config).error(handleResponse).then(handleResponse);
          function handleResponse(response, status, headers) {
            new HTTPResponseHandler({
              action: 'save',
              url: url,
              response: response,
              status: status,
              headers: headers,
              deferred: instance,
              klass: klass,
              params: attributes,
              success: onSuccess,
              error: onError
            });
          }
        } else {
          instance.reject(instance.$errors);
        }
        return instance;
        function method() {
          return _.isUndefined(instance.id) ? 'post' : 'put';
        }
        function createOrUpdate() {
          return _.isUndefined(instance.id) ? 'create' : 'update';
        }
        function onSuccess(response) {
        }
        function onError(error, status, fn) {
        }
      };
    }
    return Saveable;
  }
]);
angular.module('ngActiveResource').factory('ARUpdatable', [function () {
    Updatable.included = function (klass) {
      klass.after('find', updateInstance);
      klass.after('save', updateInstance);
    };
    function Updatable() {
      this.__update = function (attributes) {
        this.constructor.emit('update:called', this, attributes);
        _.each(attributes, this.updateAttribute, this);
        this.constructor.emit('update:beginning', this, attributes);
        this.constructor.emit('update:complete', this, attributes);
        return this;
      };
      this.__updateAttribute = function (val, key) {
        if (_.isUndefined(this.constructor.reflectOnAssociation(key))) {
          this[key] = val;
        }
      };
      this.__$update = function (attributes, config) {
        return this.$save(attributes, config);
      };
    }
    ;
    function updateInstance(instance, response) {
      instance.update(response);
    }
    return Updatable;
  }]);
angular.module('ngActiveResource').factory('ARPromiseable', [
  '$q',
  function ($q) {
    Promiseable.extended = function (klass) {
      klass.defer = new Promiseable().__defer;
    };
    function Promiseable() {
      var instance = this;
      privateVariable(instance, '__defer', function () {
        privateVariable(this, 'deferred', $q.defer());
        privateVariable(this, 'then', function () {
          this.deferred.promise.then.apply(this, arguments);
          return this;
        });
        privateVariable(this, 'catch', function () {
          this.deferred.promise.catch.apply(this, arguments);
          return this;
        });
        privateVariable(this, 'finally', function () {
          this.deferred.promise.finally;
          return this;
        });
        privateVariable(this, 'resolve', function () {
          this.deferred.resolve.apply(this, arguments);
        });
        privateVariable(this, 'reject', function () {
          this.deferred.reject.apply(this, arguments);
        });
      });
    }
    return Promiseable;
  }
]);
angular.module('ngActiveResource').factory('ARQueryString', [function () {
    /**
     * Object#toString() ref for stringify().
     */
    var toString = Object.prototype.toString;
    /**
     * Object#hasOwnProperty ref
     */
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    /**
     * Array#indexOf shim.
     */
    var indexOf = typeof Array.prototype.indexOf === 'function' ? function (arr, el) {
        return arr.indexOf(el);
      } : function (arr, el) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i] === el)
            return i;
        }
        return -1;
      };
    /**
   * Array.isArray shim.
   */
    var isArray = Array.isArray || function (arr) {
        return toString.call(arr) == '[object Array]';
      };
    /**
   * Object.keys shim.
   */
    var objectKeys = Object.keys || function (obj) {
        var ret = [];
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            ret.push(key);
          }
        }
        return ret;
      };
    /**
   * Array#forEach shim.
   */
    var forEach = typeof Array.prototype.forEach === 'function' ? function (arr, fn) {
        return arr.forEach(fn);
      } : function (arr, fn) {
        for (var i = 0; i < arr.length; i++)
          fn(arr[i]);
      };
    /**
   * Array#reduce shim.
   */
    var reduce = function (arr, fn, initial) {
      if (typeof arr.reduce === 'function')
        return arr.reduce(fn, initial);
      var res = initial;
      for (var i = 0; i < arr.length; i++)
        res = fn(res, arr[i]);
      return res;
    };
    /**
   * Cache non-integer test regexp.
   */
    var isint = /^[0-9]+$/;
    function promote(parent, key) {
      if (parent[key].length == 0)
        return parent[key] = {};
      var t = {};
      for (var i in parent[key]) {
        if (hasOwnProperty.call(parent[key], i)) {
          t[i] = parent[key][i];
        }
      }
      parent[key] = t;
      return t;
    }
    function parse(parts, parent, key, val) {
      var part = parts.shift();
      // illegal
      if (hasOwnProperty.call(Object.prototype, key))
        return;
      // end
      if (!part) {
        if (isArray(parent[key])) {
          parent[key].push(val);
        } else if ('object' == typeof parent[key]) {
          parent[key] = val;
        } else if ('undefined' == typeof parent[key]) {
          parent[key] = val;
        } else {
          parent[key] = [
            parent[key],
            val
          ];
        }  // array
      } else {
        var obj = parent[key] = parent[key] || [];
        if (']' == part) {
          if (isArray(obj)) {
            if ('' != val)
              obj.push(val);
          } else if ('object' == typeof obj) {
            obj[objectKeys(obj).length] = val;
          } else {
            obj = parent[key] = [
              parent[key],
              val
            ];
          }  // prop
        } else if (~indexOf(part, ']')) {
          part = part.substr(0, part.length - 1);
          if (!isint.test(part) && isArray(obj))
            obj = promote(parent, key);
          parse(parts, obj, part, val);  // key
        } else {
          if (!isint.test(part) && isArray(obj))
            obj = promote(parent, key);
          parse(parts, obj, part, val);
        }
      }
    }
    /**
   * Merge parent key/val pair.
   */
    function merge(parent, key, val) {
      if (~indexOf(key, ']')) {
        var parts = key.split('['), len = parts.length, last = len - 1;
        parse(parts, parent, 'base', val);  // optimize
      } else {
        if (!isint.test(key) && isArray(parent.base)) {
          var t = {};
          for (var k in parent.base)
            t[k] = parent.base[k];
          parent.base = t;
        }
        set(parent.base, key, val);
      }
      return parent;
    }
    /**
   * Compact sparse arrays.
   */
    function compact(obj) {
      if ('object' != typeof obj)
        return obj;
      if (isArray(obj)) {
        var ret = [];
        for (var i in obj) {
          if (hasOwnProperty.call(obj, i)) {
            ret.push(obj[i]);
          }
        }
        return ret;
      }
      for (var key in obj) {
        obj[key] = compact(obj[key]);
      }
      return obj;
    }
    /**
   * Parse the given obj.
   */
    function parseObject(obj) {
      var ret = { base: {} };
      forEach(objectKeys(obj), function (name) {
        merge(ret, name, obj[name]);
      });
      return compact(ret.base);
    }
    /**
   * Parse the given str.
   */
    function parseString(str, options) {
      var ret = reduce(String(str).split(options.separator), function (ret, pair) {
          var eql = indexOf(pair, '='), brace = lastBraceInKey(pair), key = pair.substr(0, brace || eql), val = pair.substr(brace || eql, pair.length), val = val.substr(indexOf(val, '=') + 1, val.length);
          // ?foo
          if ('' == key)
            key = pair, val = '';
          if ('' == key)
            return ret;
          return merge(ret, decode(key), decode(val));
        }, { base: {} }).base;
      return compact(ret);
    }
    /**
   * Parse the given query `str` or `obj`, returning an object.
   *
   * @param {String} str | {Object} obj
   * @return {Object}
   * @api public
   */
    querystring = {};
    querystring.parse = function (str, options) {
      if (null == str || '' == str)
        return {};
      options = options || {};
      options.separator = options.separator || '&';
      return 'object' == typeof str ? parseObject(str) : parseString(str, options);
    };
    /**
   * Turn the given `obj` into a query string
   *
   * @param {Object} obj
   * @return {String}
   * @api public
   */
    var stringify = querystring.stringify = function (obj, prefix) {
        if (isArray(obj)) {
          return stringifyArray(obj, prefix);
        } else if ('[object Object]' == toString.call(obj)) {
          return stringifyObject(obj, prefix);
        } else if ('string' == typeof obj) {
          return stringifyString(obj, prefix);
        } else {
          return prefix + '=' + encodeURIComponent(String(obj));
        }
      };
    /**
   * Stringify the given `str`.
   *
   * @param {String} str
   * @param {String} prefix
   * @return {String}
   * @api private
   */
    function stringifyString(str, prefix) {
      if (!prefix)
        throw new TypeError('stringify expects an object');
      return prefix + '=' + encodeURIComponent(str);
    }
    /**
   * Stringify the given `arr`.
   *
   * @param {Array} arr
   * @param {String} prefix
   * @return {String}
   * @api private
   */
    function stringifyArray(arr, prefix) {
      var ret = [];
      if (!prefix)
        throw new TypeError('stringify expects an object');
      for (var i = 0; i < arr.length; i++) {
        ret.push(stringify(arr[i], prefix + '[' + i + ']'));
      }
      return ret.join('&');
    }
    /**
   * Stringify the given `obj`.
   *
   * @param {Object} obj
   * @param {String} prefix
   * @return {String}
   * @api private
   */
    function stringifyObject(obj, prefix) {
      var ret = [], keys = objectKeys(obj), key;
      for (var i = 0, len = keys.length; i < len; ++i) {
        key = keys[i];
        if ('' == key)
          continue;
        if (null == obj[key]) {
          ret.push(encodeURIComponent(key) + '=');
        } else {
          ret.push(stringify(obj[key], prefix ? prefix + '[' + encodeURIComponent(key) + ']' : encodeURIComponent(key)));
        }
      }
      return ret.join('&');
    }
    /**
   * Set `obj`'s `key` to `val` respecting
   * the weird and wonderful syntax of a qs,
   * where "foo=bar&foo=baz" becomes an array.
   *
   * @param {Object} obj
   * @param {String} key
   * @param {String} val
   * @api private
   */
    function set(obj, key, val) {
      var v = obj[key];
      if (hasOwnProperty.call(Object.prototype, key))
        return;
      if (undefined === v) {
        obj[key] = val;
      } else if (isArray(v)) {
        v.push(val);
      } else {
        obj[key] = [
          v,
          val
        ];
      }
    }
    /**
   * Locate last brace in `str` within the key.
   *
   * @param {String} str
   * @return {Number}
   * @api private
   */
    function lastBraceInKey(str) {
      var len = str.length, brace, c;
      for (var i = 0; i < len; ++i) {
        c = str[i];
        if (']' == c)
          brace = false;
        if ('[' == c)
          brace = true;
        if ('=' == c && !brace)
          return i;
      }
    }
    /**
   * Decode `str`.
   *
   * @param {String} str
   * @return {String}
   * @api private
   */
    function decode(str) {
      try {
        return decodeURIComponent(str.replace(/\+/g, ' '));
      } catch (err) {
        return str;
      }
    }
    return querystring;
  }]);
angular.module('ngActiveResource').factory('ARReflections.AbstractReflection', [
  '$injector',
  function ($injector) {
    function AbstractReflection(name, options) {
      this.name = name;
      this.options = options;
      this.macro = options.macro;
      this.isBelongsTo = macroIs('belongsTo');
      this.isHasMany = macroIs('hasMany');
      this.foreignKey = options.foreignKey || deriveForeignKey.call(this);
      this.associationPrimaryKey = function () {
        return options.primaryKey || this.klass.primaryKey;
      };
      this.inverse = function () {
        return this.klass.reflections.where({ klass: this.inverseKlass() }).first();
      };
      this.inverseKlass = function () {
        return options.inverseOf;
      };
      this.containsAssociation = function (object) {
        return !_.isUndefined(object[this.name]);
      };
      this.containsForeignKey = function (object) {
        return _.chain(object).keys().include(this.foreignKey).value();
      };
      this.initializeFor = function (instance, value) {
        instance[this.name] = value;
        return instance;
      };
      Object.defineProperty(this, 'klass', {
        enumerable: true,
        get: function () {
          return getClass.call(this);
        }
      });
      function deriveForeignKey() {
        if (this.isBelongsTo()) {
          return name.toForeignKey();
        }
      }
      function getClass() {
        return this.options.provider ? get(this.options.provider) : get(guessClassName.call(this));
      }
      function get(providerName) {
        if (!!cached(providerName)) {
          return cached(providerName);
        }
        cache(providerName);
        return get(providerName);
      }
      function cached(providerName) {
        return AbstractReflection.models[providerName];
      }
      function cache(providerName) {
        AbstractReflection.models[providerName] = $injector.get(providerName);
      }
      function guessClassName() {
        return this.name.classify();
      }
      function macroIs(macroName) {
        return function () {
          return this.macro == macroName;
        };
      }
    }
    AbstractReflection.models = {};
    return AbstractReflection;
  }
]);
angular.module('ngActiveResource').factory('ARReflections.BelongsToReflection', [
  'ARReflections.AbstractReflection',
  'ARMixin',
  function (AbstractReflection, mixin) {
    function BelongsToReflection(name, options) {
      var reflection = this;
      AbstractReflection.call(reflection, name, options);
      reflection.initialize = function (instance, attributes) {
        mixin(attributes, InitializeAttributes);
        this.initializeByReference(instance, attributes);
        this.initializeFromForeignKey(instance, attributes);
        this.initializeInverse(instance, attributes);
        return this;
      };
      reflection.initializeByReference = function (instance, attributes) {
        if (this.containsAssociation(attributes)) {
          this.initializeFor(instance, attributes[this.name]);
        }
      };
      reflection.initializeFromForeignKey = function (instance, attributes) {
        if (this.containsForeignKey(attributes)) {
          this.initializeFor(instance, this.klass.cached.find(attributes.foreignKey()));
          if (!_.isUndefined(instance[reflection.name])) {
            delete instance[reflection.foreignKey];
          }
        }
      };
      reflection.initializeInverse = function (instance, attributes) {
        if (this.containsAssociation(instance)) {
          if (instance.hasPrimaryKey() || options.includeWithoutPrimaryKey) {
            instance[this.name][this.inverse().name].nodupush(instance);
          }
        }
      };
      function InitializeAttributes() {
        privateVariable(this, 'foreignKey', function () {
          return this[reflection.foreignKey];
        });
      }
    }
    return BelongsToReflection;
  }
]);
angular.module('ngActiveResource').factory('ARReflections.HasManyReflection', [
  'ARReflections.AbstractReflection',
  'ARAssociatable.CollectionAssociation',
  function (AbstractReflection, CollectionAssociation) {
    function HasManyReflection(name, options) {
      AbstractReflection.call(this, name, options);
      this.initialize = function (instance, attributes) {
        this.initializeEmptyCollection(instance, attributes);
        this.initializeFromAttributes(instance, attributes);
        this.initializeInverse(instance, attributes);
        return this;
      };
      this.initializeEmptyCollection = function (instance, attributes) {
        if (!this.containsAssociation(instance)) {
          var collection = new CollectionAssociation(instance, this);
          this.initializeFor(instance, collection);
          this.options.inverseOf.watchedCollections.push(collection);
        }
      };
      this.initializeFromAttributes = function (instance, attributes) {
        if (this.containsAssociation(attributes)) {
          instance[this.name].$removeAll();
          _.each(_.flatten([attributes[this.name]]), function (association) {
            instance[this.name].nodupush(association);
          }, this);
        }
      };
      this.initializeInverse = function (instance, attributes) {
        if (this.containsAssociation(instance)) {
          _.each(instance[this.name], function (association) {
            this.inverse().initialize(association, _.zipObject([this.inverse().name], [instance]));
          }, this);
        }
      };
    }
    return HasManyReflection;
  }
]);
// Reflections
//
// Reflections represent the meta-information about associations between classes.
//
// Classes return their reflections as a hash:
//
//    Post.hasMany("comments");
//
//    Post.reflections =>
//    {
//      comments: {
//        macro:                  "hasMany"                 // the name of the relationship
//        klass:                  Comment,                  // the class of the association
//        foreignKey:             undefined,                // hasMany associations have none
//        #associationPrimaryKey: "id",                     // the primary key of the Comment class
//        #inverse:               Comment.reflections.post, // the inverse association, if one exists
//      }
//    }
//
//    Comment.belongsTo("post");
//
//    Comment.reflections =>
//    {
//      post: {
//        macro:                  "belongsTo"                // the name of the relationship
//        klass:                  Post,                      // the class of the association
//        foreignKey:             "post_id",                 // default, can be overridden
//        #associationPrimaryKey: "id",                      // the primary key of the Post class
//        #inverse:               Post.reflections.comments, // the inverse association, if one exists
//      }
//    }
//
angular.module('ngActiveResource').factory('ARReflections', [
  'ARMixin',
  'ARFunctional.Collection',
  'ARReflections.AbstractReflection',
  'ARReflections.HasManyReflection',
  'ARReflections.BelongsToReflection',
  function (mixin, FunctionalCollection, AbstractReflection, HasManyReflection, BelongsToReflection) {
    Reflections.AbstractReflection = AbstractReflection;
    Reflections.HasManyReflection = HasManyReflection;
    Reflections.BelongsToReflection = BelongsToReflection;
    Reflections.included = function (klass) {
      privateVariable(klass, 'reflections', new Reflections(klass));
      klass.hasMany = reflectionMacro('hasMany');
      klass.belongsTo = reflectionMacro('belongsTo');
      klass.reflectOnAllAssociations = function (macro) {
        if (!_.isString(macro)) {
          return klass.reflections;
        }
        return klass.reflections.select(function (reflection) {
          return reflection.macro == macro;
        }).toObject(function (reflections, reflection) {
          reflections[reflection.name] = reflection;
        });
      };
      klass.reflectOnAssociation = function (association) {
        return klass.reflections[association];
      };
      function reflectionMacro(macro) {
        return function (associationName, options) {
          options = options || {};
          return klass.reflections.create(macro, associationName, options);
        };
      }
    };
    function Reflections(klass) {
      privateVariable(this, 'klass', klass);
      privateVariable(this, 'create', function (macro, name, options) {
        var MacroClass;
        switch (macro) {
        case 'hasMany':
          MacroClass = HasManyReflection;
          break;
        case 'belongsTo':
          MacroClass = BelongsToReflection;
          break;
        default:
          throw 'Unsupported macro ' + macro;
        }
        klass.reflections[name] = new MacroClass(name, _.merge({
          macro: macro,
          inverseOf: klass
        }, options));
      });
      mixin(this, FunctionalCollection);
    }
    return Reflections;
  }
]);
angular.module('ngActiveResource').factory('ARDeserializable', [
  'ARUnwrapRoot',
  function (unwrapRoot) {
    function Deserializable() {
      this.deserialize = function (object) {
        var deserialized;
        this.emit('deserialize:called', object);
        if (_.isString(object) && _.isEmpty(object)) {
          deserialized = {};
        } else {
          deserialized = this.api.mimetype().parse(object);
        }
        if (this.api.unwrapRootElement) {
          deserialized = unwrapRoot(deserialized);
        }
        if (_.isFunction(this.parse)) {
          deserialized = modelSpecificParse(this, deserialized);
        }
        this.emit('deserialize:complete', object);
        return deserialized;
      };
      function modelSpecificParse(model, object) {
        if (_.isArray(object)) {
          return _.map(object, model.parse);
        } else {
          return model.parse(object);
        }
      }
    }
    return Deserializable;
  }
]);
angular.module('ngActiveResource').factory('DropHasMany', [function () {
    return function DropHasMany(instance, reflections) {
      var reflections = reflections || instance.constructor.reflections, clone = _.cloneDeep(instance);
      reflections.select(function (reflection) {
        return reflection.macro == 'hasMany';
      }).each(function (reflection) {
        delete clone[reflection.name];
      });
      return clone;
    };
  }]);
// Comment { post: { id: 1, title: "My Great Title" } }
// => Comment { post_id: 1 }
angular.module('ngActiveResource').factory('Foreignkeyify', [function () {
    return function foreignkeyify(instance, reflections) {
      var reflections = reflections || instance.constructor.reflections, clone = _.cloneDeep(instance);
      return _.transform(reflections, function (keyified, reflection) {
        if (reflection.foreignKey && clone[reflection.name]) {
          clone[reflection.foreignKey] = clone[reflection.name][reflection.associationPrimaryKey()];
          delete clone[reflection.name];
        }
      }, clone);
    };
  }]);
angular.module('ngActiveResource').factory('ARSerializeAssociations', [
  'Foreignkeyify',
  'DropHasMany',
  function (foreignkeyify, dropHasMany) {
    return function serializeAssociations(instance, reflections) {
      var reflections = reflections || instance.constructor.reflections, clone = _.cloneDeep(instance);
      clone = foreignkeyify(clone, reflections);
      clone = dropHasMany(clone, reflections);
      return clone;
    };
  }
]);
angular.module('ngActiveResource').factory('ARSerializable', [
  'ARSerializeAssociations',
  function (serializeAssociations) {
    Serializable.extended = function (klass) {
      klass.prototype.serialize = function () {
        return klass.serialize(this);
      };
    };
    function Serializable() {
      this.serialize = function (object) {
        var klass = this, serialized = serializeAssociations(object, klass.reflections);
        if (_.isFunction(klass.format)) {
          serialized = modelSpecificFormat(klass, serialized);
        }
        serialized = klass.api.mimetype().format(serialized);
        return serialized;
      };
      function modelSpecificFormat(model, object) {
        if (_.isArray(object)) {
          return _.map(object, model.format);
        } else {
          return model.format(object);
        }
      }
    }
    return Serializable;
  }
]);
(function () {
  angular.module('ngActiveResource').factory('ARSet', [
    'ARStrictRequire',
    function (strictRequire) {
      function Set() {
        var set = {};
        privateVariable(set, 'find', function (item) {
          return set[item];
        });
        privateVariable(set, 'add', function (attributes) {
          strictRequire(attributes, [
            'key',
            'value'
          ]);
          ensureUniqueKey(attributes.key, attributes.error);
          set[attributes.key] = attributes.value;
        });
        function ensureUniqueKey(key, error) {
          var error = error || 'Key already exists in set';
          if (set[key] !== undefined) {
            throw {
              name: 'DuplicateSetKeyError',
              message: error
            };
          }
        }
        ;
        return set;
      }
      ;
      return Set;
    }
  ]);
}());
angular.module('ngActiveResource').factory('ARStrictRequire', [function () {
    function strictRequire(initializationObject, requiredAttributes) {
      _.each(requiredAttributes, function (requiredAttribute) {
        if (initializationObject[requiredAttribute] === undefined) {
          throw new StrictRequireError(requiredAttribute);
        }
        ;
      });
    }
    ;
    function StrictRequireError(attribute) {
      this.name = 'StrictRequireError';
      this.message = attribute + ' must be defined.';
    }
    ;
    StrictRequireError.prototype = Error.prototype;
    return strictRequire;
  }]);
angular.module('ngActiveResource').factory('ARValidatable', [
  'ARValidatable.Field',
  'ARValidatable.validators.absence',
  'ARValidatable.validators.acceptance',
  'ARValidatable.validators.boolean',
  'ARValidatable.validators.confirmation',
  'ARValidatable.validators.exclusion',
  'ARValidatable.validators.format',
  'ARValidatable.validators.inclusion',
  'ARValidatable.validators.integer',
  'ARValidatable.validators.length',
  'ARValidatable.validators.numericality',
  'ARValidatable.validators.required',
  'ARValidatable.validators.requiredIf',
  function (Field) {
    function Validatable() {
      var _validations = {};
      privateVariable(_validations, 'add', function (validationSpec) {
        _.each(validationSpec, addField);
      });
      privateVariable(_validations, 'validate', function (instance, fieldName) {
        var toValidate = getFieldsToValidate(fieldName);
        _.each(toValidate, _.curry(validateField)(instance));
        return instance.$errors.countFor(fieldName) === 0;
      });
      function validateField(instance, validation) {
        if (validation.validate(instance) === false) {
          instance.$errors.add(validation.field, validation.message);
        } else {
          instance.$errors.clear(validation.field, validation.message);
        }
      }
      function getFieldsToValidate(fieldName) {
        if (fieldName && _validations[fieldName])
          return _validations[fieldName];
        return _.chain(_validations).map(function (validations) {
          return validations;
        }).flatten().value();
      }
      function addField(validationSet, fieldName) {
        if (_validations[fieldName])
          _validations[fieldName].addValidators(validationSet);
        else
          _validations[fieldName] = new Field(fieldName, validationSet);
      }
      this.validations = _validations;
      this.validates = _validations.add;
      this.__validate = function (fieldName) {
        return this.constructor.validations.validate(this, fieldName);
      };
      Object.defineProperty(this, '__$valid', {
        get: function () {
          return this.constructor.validations.validate(this);
        }
      });
      Object.defineProperty(this, '__$invalid', {
        get: function () {
          return !this.constructor.validations.validate(this);
        }
      });
    }
    return Validatable;
  }
]);
angular.module('ngActiveResource').factory('ARValidatable.Field', [
  'ARValidatable.Validator',
  'ARValidatable.Validation',
  'ARValidatable.validators',
  'ARValidatable.ValidationMessageNotFoundError',
  function (Validator, Validation, validators, ValidationMessageNotFoundError) {
    function Field(name, validationSet) {
      var field = [];
      field.addValidators = function (validationSet) {
        _.each(validationSet, field.addValidator);
      };
      field.addValidator = function (options, validationName) {
        var validator = validators.find(validationName) || new Validator(options, validationName), configuredFns = _.flatten([validator.configure(options)]);
        if (_.isUndefined(validator.message)) {
          throw new ValidationMessageNotFoundError(validationName, name);
        }
        _.each(configuredFns, function (configuredFn) {
          field.push(new Validation(name, configuredFn));
        });
      };
      field.addValidators(validationSet);
      return field;
    }
    return Field;
  }
]);
angular.module('ngActiveResource').factory('ARValidatable.Validation', [function () {
    function Validation(field, validationFn) {
      this.field = field;
      this.message = validationFn.message;
      this.validate = function (instance) {
        return validationFn(instance[field], instance, field);
      };
    }
    return Validation;
  }]);
angular.module('ngActiveResource').factory('ARValidatable.DuplicateValidatorError', [function () {
    function DuplicateValidatorError(name) {
      this.name = 'DuplicateValidatorError';
      this.message = 'A validator by the name \'' + name + '\' has already been registered.';
    }
    DuplicateValidatorError.prototype = Error.prototype;
    return DuplicateValidatorError;
  }]);
angular.module('ngActiveResource').factory('ARValidatable.ValidationMessageNotFoundError', [function () {
    function ValidationMessageNotFoundError(validatorName, fieldName) {
      this.name = 'ValidationMessageNotFound';
      this.message = 'Validation message not found for validator \'' + validatorName + '\' on the field \'' + fieldName + '.\' Validation messages must be added to validators in order to provide your users with useful error messages.';
    }
    ValidationMessageNotFoundError.prototype = Error.prototype;
    return ValidationMessageNotFoundError;
  }]);
angular.module('ngActiveResource').factory('ARValidatable.ValidatorNotFoundError', [function () {
    function ValidatorNotFoundError(name) {
      this.name = 'ValidatorNotFoundError';
      this.message = 'No validator found by the name of `' + name + '`. Custom validators must define a `validator` key containing the custom validation function.';
    }
    ValidatorNotFoundError.prototype = Error.prototype;
    return ValidatorNotFoundError;
  }]);
angular.module('ngActiveResource').factory('ARValidatable.ValidationFn', [function () {
    function ValidationFn(validationFn, options) {
      var fn = _.bind(validationFn, options);
      fn.message = configureMessage();
      function configureMessage() {
        if (_.isString(options.message))
          return options.message;
        if (_.isFunction(options.message))
          return options.message.apply(options);
      }
      return fn;
    }
    return ValidationFn;
  }]);
angular.module('ngActiveResource').factory('ARValidatable.Validator', [
  'ARValidatable.ValidationFn',
  'ARValidatable.validators',
  'ARValidatable.ValidatorNotFoundError',
  function (ValidationFn, validators, ValidatorNotFoundError) {
    function AnonymousValidator(options, name) {
      if (_.isFunction(options.validator)) {
        if (options.message)
          options.validator.message = options.message;
        return new Validator(options.validator, name);
      }
    }
    function Validator(validationFn, name) {
      if (validationFn.validator)
        return new AnonymousValidator(validationFn, name);
      if (!_.isFunction(validationFn))
        throw new ValidatorNotFoundError(name);
      this.name = validationFn.name || name;
      this.title = validationFn.title || name;
      this.message = validationFn.message;
      this.configure = function (options) {
        options = defaultOptions(options);
        if (hasChildren())
          return configuredChildren(options);
        return new ValidationFn(validationFn, _.defaults(options, this));
      };
      var validator = this;
      this.childValidators = {};
      addChildValidators(validationFn.options);
      validators.register(validator);
      function addChildValidators(options) {
        _.each(options, function (value, key) {
          if (isValidator(value))
            validator.childValidators[key] = value;
        });
      }
      function isValidator(option) {
        return option.constructor.name == 'Validator';
      }
      function hasChildren() {
        return Object.keys(validator.childValidators).length > 0;
      }
      function configuredChildren(options) {
        return _.chain(validator.childValidators).map(function (childValidator, name) {
          if (options[name])
            return childValidator.configure(options[name]);
        }).compact().value();
      }
      function defaultOptions(options) {
        if (!_.isObject(options) || _.isArray(options) || _.isFunction(options)) {
          options = {
            value: options,
            message: this.message
          };
        }
        if (!_.isUndefined(validationFn.name) && _.isUndefined(options[validationFn.name])) {
          options[validationFn.name] = options.value;
        }
        return options;
      }
    }
    return Validator;
  }
]);
angular.module('ngActiveResource').factory('ARValidatable.validators.absence', [
  'ARValidatable.Validator',
  function (Validator) {
    function absence(value, instance, field) {
      if (value === undefined || value === null)
        return true;
      if (value.constructor.name == 'String') {
        return !!!value.length;
      }
      return false;
    }
    ;
    absence.message = 'must be blank.';
    absence.title = 'absence';
    return new Validator(absence);
  }
]);
angular.module('ngActiveResource').factory('ARValidatable.validators.acceptance', [
  'ARValidatable.Validator',
  function (Validator) {
    function acceptance(value, instance, field) {
      if (not(value))
        return true;
      return value == true;
    }
    ;
    function not(value) {
      if (value === false)
        return false;
      return !value;
    }
    ;
    acceptance.message = function () {
      return 'must be accepted.';
    };
    acceptance.title = 'acceptance';
    return new Validator(acceptance);
  }
]);
angular.module('ngActiveResource').factory('ARValidatable.validators.boolean', [
  'ARValidatable.Validator',
  function (Validator) {
    function boolean(value, instance, field) {
      if (value === undefined || value === '' || value === null)
        return true;
      return value == true || value === false || value == 'true' || value == 'false';
    }
    ;
    boolean.message = function () {
      return 'is not a boolean';
    };
    boolean.title = 'boolean';
    return new Validator(boolean);
  }
]);
angular.module('ngActiveResource').factory('ARValidatable.validators.confirmation', [
  'ARValidatable.Validator',
  function (Validator) {
    function confirmation(value, instance, field) {
      var confirmationName = field + 'Confirmation';
      var confirmationField = instance[confirmationName];
      return value == confirmationField;
    }
    ;
    confirmation.message = function () {
      return 'must match confirmation field.';
    };
    confirmation.title = 'confirmation';
    return new Validator(confirmation);
  }
]);
angular.module('ngActiveResource').factory('ARValidatable.validators.exclusion', [
  'ARValidatable.Validator',
  function (Validator) {
    function exclusion(value, instance, field) {
      if (value === undefined || value === '' || value === null)
        return true;
      if (!this.from)
        throw 'Exclusion validator must specify \'from\' attribute.';
      var included = true;
      this.from.forEach(function (i) {
        if (i == value) {
          included = false;
        }
      });
      return included;
    }
    ;
    exclusion.message = function () {
      lastVal = 'or ' + this.from.slice(-1);
      joinedArray = this.from.slice(0, -1);
      joinedArray.push(lastVal);
      if (joinedArray.length >= 3)
        list = joinedArray.join(', ');
      else
        list = joinedArray.join(' ');
      return 'must not be ' + list + '.';
    };
    exclusion.title = 'exclusion';
    return new Validator(exclusion);
  }
]);
angular.module('ngActiveResource').factory('ARValidatable.validators.format.email', [
  'ARValidatable.Validator',
  function (Validator) {
    function email(value, instance, field) {
      if (value === undefined || value === '' || value === null)
        return true;
      return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/.test(value);
    }
    ;
    email.message = function () {
      return 'is not a valid email.';
    };
    email.title = 'email';
    return new Validator(email);
  }
]);
angular.module('ngActiveResource').factory('ARValidatable.validators.format', [
  'ARValidatable.Validator',
  'ARValidatable.validators.format.email',
  'ARValidatable.validators.format.zip',
  'ARValidatable.validators.format.regex',
  function (Validator, email, zip, regex) {
    function format() {
    }
    ;
    format.message = 'is not the correct format.';
    format.options = {
      email: email,
      zip: zip,
      regex: regex
    };
    format.title = 'format';
    return new Validator(format);
  }
]);
angular.module('ngActiveResource').factory('ARValidatable.validators.format.regex', [
  'ARValidatable.Validator',
  function (Validator) {
    function regex(value, instance, field) {
      if (value === undefined || value === '' || value === null)
        return true;
      return this.regex.test(value);
    }
    ;
    regex.message = function () {
      return 'does not match the pattern.';
    };
    regex.title = 'regex';
    return new Validator(regex);
  }
]);
angular.module('ngActiveResource').factory('ARValidatable.validators.format.zip', [
  'ARValidatable.Validator',
  function (Validator) {
    function zip(value, instance, field) {
      if (value === undefined || value === '' || value === null)
        return true;
      return /(^\d{5}$)|(^\d{5}-{0,1}\d{4}$)/.test(value);
    }
    ;
    zip.message = function () {
      return 'is not a valid zip code.';
    };
    zip.title = 'zip';
    return new Validator(zip);
  }
]);
angular.module('ngActiveResource').factory('ARValidatable.validators.inclusion', [
  'ARValidatable.Validator',
  function (Validator) {
    function inclusion(value, instance, field) {
      if (value === undefined || value === '' || value === null)
        return true;
      if (!this.in)
        throw 'Inclusion validator must specify \'in\' attribute.';
      var included = false;
      this.in.forEach(function (i) {
        if (i == value) {
          included = true;
        }
      });
      return included;
    }
    ;
    inclusion.message = function () {
      lastVal = 'or ' + this.in.slice(-1);
      joinedArray = this.in.slice(0, -1);
      joinedArray.push(lastVal);
      if (joinedArray.length >= 3)
        list = joinedArray.join(', ');
      else
        list = joinedArray.join(' ');
      return 'must be included in ' + list + '.';
    };
    inclusion.title = 'inclusion';
    return new Validator(inclusion);
  }
]);
angular.module('ngActiveResource').factory('ARValidatable.validators.integer', [
  'ARValidatable.Validator',
  function (Validator) {
    function integer(value, instance, field) {
      if (!value)
        return true;
      if (value.constructor.name == 'Array')
        return false;
      if (value.constructor.name == 'Object')
        return false;
      value = String(value);
      if (value.match(/\./))
        return false;
      if (this.ignore) {
        value = value.replace(this.ignore, '');
      }
      return !isNaN(Number(value));
    }
    ;
    integer.message = function () {
      return 'is not an integer.';
    };
    integer.title = 'integer';
    return new Validator(integer);
  }
]);
angular.module('ngActiveResource').factory('ARValidatable.validators.length.in', [
  'ARValidatable.Validator',
  function (Validator) {
    function inRange(value, instance, field) {
      if (value === undefined || value === '' || value === null)
        return true;
      return value.length >= this.inRange[0] && value.length <= this.inRange.slice(-1)[0];
    }
    ;
    inRange.message = function () {
      return 'must be between ' + this.inRange[0] + ' and ' + this.inRange.slice(-1)[0] + ' characters.';
    };
    inRange.title = 'in';
    return new Validator(inRange);
  }
]);
angular.module('ngActiveResource').factory('ARValidatable.validators.length.is', [
  'ARValidatable.Validator',
  function (Validator) {
    function is(value, instance, field) {
      if (value === undefined || value === '' || value === null)
        return true;
      return value.length == this.is;
    }
    ;
    is.message = function () {
      return 'must be ' + this.is + ' characters.';
    };
    is.title = 'is';
    return new Validator(is);
  }
]);
angular.module('ngActiveResource').factory('ARValidatable.validators.length', [
  'ARValidatable.Validator',
  'ARValidatable.validators.length.max',
  'ARValidatable.validators.length.min',
  'ARValidatable.validators.length.in',
  'ARValidatable.validators.length.is',
  function (Validator, max, min, inRange, is) {
    function length() {
    }
    ;
    length.message = 'does not meet the length requirements.';
    length.options = {
      max: max,
      min: min,
      in: inRange,
      is: is
    };
    length.title = 'length';
    return new Validator(length);
  }
]);
angular.module('ngActiveResource').factory('ARValidatable.validators.length.max', [
  'ARValidatable.Validator',
  function (Validator) {
    function max(value, instance, field) {
      if (value === undefined || value === '' || value === null)
        return true;
      return value.length <= this.max;
    }
    ;
    max.message = function () {
      return 'Must be no more than ' + this.max + ' characters';
    };
    max.title = 'max';
    return new Validator(max);
  }
]);
angular.module('ngActiveResource').factory('ARValidatable.validators.length.min', [
  'ARValidatable.Validator',
  function (Validator) {
    function min(value, instance, field) {
      if (value === undefined || value === '' || value === null)
        return true;
      return value.length >= this.min;
    }
    min.message = function () {
      return 'Must be at least ' + this.min + ' characters';
    };
    min.title = 'min';
    return new Validator(min);
  }
]);
angular.module('ngActiveResource').factory('ARValidatable.validators.numericality', [
  'ARValidatable.Validator',
  function (Validator) {
    function numericality(value, instance, field) {
      if (!value)
        return true;
      value = String(value);
      if (this.ignore) {
        value = value.replace(this.ignore, '');
      }
      return !isNaN(Number(value));
    }
    ;
    numericality.message = function () {
      return 'is not a number.';
    };
    numericality.title = 'numericality';
    return new Validator(numericality);
  }
]);
angular.module('ngActiveResource').factory('ARValidatable.validators.requiredIf', [
  'ARValidatable.Validator',
  function (Validator) {
    function requiredIf(value, instance, field) {
      if (!this.requiredIf(value, instance, field)) {
        return true;
      } else {
        if (value === undefined || value === null)
          return false;
        if (value.constructor.name == 'String') {
          return !!(value && value.length || typeof value == 'object');
        }
        return value !== undefined;
      }
    }
    ;
    requiredIf.message = 'cannot be blank.';
    requiredIf.title = 'requiredIf';
    return new Validator(requiredIf);
  }
]);
angular.module('ngActiveResource').factory('ARValidatable.validators.required', [
  'ARValidatable.Validator',
  function (Validator) {
    function required(value, instance, field) {
      if (value === undefined || value === null)
        return false;
      if (value.constructor.name == 'String') {
        return !!(value && value.length || typeof value == 'object');
      }
      return value !== undefined;
    }
    ;
    required.message = 'cannot be blank.';
    required.title = 'required';
    return new Validator(required);
  }
]);
angular.module('ngActiveResource').factory('ARValidatable.validators', [
  'ARValidatable.DuplicateValidatorError',
  function (DuplicateValidatorError) {
    var validators = {};
    validators.register = function (validator) {
      var title = validator.title || validator.name;
      if (_.isUndefined(validators[title]))
        validators[title] = validator;
      else
        throw new DuplicateValidatorError(title);
    };
    validators.find = function (validatorName) {
      return validators[validatorName];
    };
    return validators;
  }
]);
angular.module('ngActiveResource').factory('ARWatchable', [
  'ARMixin',
  'ARFunctional.Collection',
  function (mixin, FunctionalCollection) {
    Watchable.extended = function (klass) {
      klass.after('delete', klass.watchedCollections.$remove);
    };
    function Watchable() {
      this.watchedCollections = Watchable.watchedCollections;
    }
    Watchable.watchedCollections = mixin([], FunctionalCollection);
    Watchable.watchedCollections.$remove = function (instance) {
      Watchable.watchedCollections.each(function (watchedCollection) {
        watchedCollection.$reject(function (watchedInstance) {
          return watchedInstance === instance;
        });
      });
    };
    return Watchable;
  }
]);