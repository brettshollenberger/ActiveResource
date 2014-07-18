(function() {

  var Mime = {};

  angular
    .module('ngActiveResource')

    // @module ARMime
    //
    // The purpose of the MimeType module is to recognize and parse the
    // protocol semantics of various Content-Type headers that may be
    // returned from APIs. Each MimeType registered must be capable of
    // parsing a representation of a given type, such as XML, into a valid
    // Javascript object ready to be instantiated by a subclass of ngActiveResource.Base.
    //
    // Protocol semantics make up one of two pieces of API data parsing.
    // Application semantics will be handled by ARProfile, which will parse 
    // Profiles (e.g. microformats and microdata), and ARClassSemantics, 
    // which can parse ad hoc semantics not defined by any 
    // machine-readable profile. 
    //
    // //////////////////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////////////////
    //
    // ARMime is the core ngActiveResource MimeType module. It exposes:
    //
    // * The ARMime.Format constructor, detailed below, which registers new
    // data formats. An example of a data format is 'xml', which
    // has core semantics that may belong to multiple mimetypes, like
    // 'application/xml', 'text/xml', and 'application/atom+xml.'
    //
    //    Example:
    //
    //    new ARMime.Format('json');
    //
    // //////////////////////////////////////////////////////////////////////
    // 
    // * The ARMime.Type constructor, detailed below, which registers new 
    // MimeTypes. MimeTypes are stricter than Formats; MimeTypes are required
    // to follow the 'type/subtype+suffix;optional=params' format defined in
    // IETF RFC 2046.
    //
    //    Example:
    //
    //    new ARMime.Type('application/atom+xml');
    //
    // //////////////////////////////////////////////////////////////////////
    //
    // * The ARMime.formats collection, which holds all formats registered
    // in the application and in ngActiveResource Core. ARMime.formats is an instance
    // of ARSet, which ensures uniqueness of keys through its `add` function.
    //
    // //////////////////////////////////////////////////////////////////////
    //
    // * The ARMime.types collection, which holds all mimetypes registered 
    // in the application and in ngActiveResource Core. ARMime.types is also an 
    // instance of ARSet.
    //
    // //////////////////////////////////////////////////////////////////////
    //
    // * The ARMime.parse function, which parses input from an API endpoint
    // into a Javascript object, ready to be interpreted by either an
    // application semantics parser, or a subclass of ngActiveResource.Base itself.
    //
    // //////////////////////////////////////////////////////////////////////

    .factory('ARMime', ['ARMime.Format', 'ARMime.Type', 'ARMime.parse', 'ARMime.format', 'ARSet',
      function(Format, MimeType, parse, format, Set) {

      Mime.Format  = Format;
      Mime.Type    = MimeType;
      Mime.formats = new Set();
      Mime.types   = new Set();
      Mime.parse   = parse;
      Mime.format  = format;

      Mime.Type.find = function(formatOrType) {
        var mimetype = Mime.types.find(formatOrType),
            format   = Mime.formats.find(formatOrType);

        if (!_.isUndefined(mimetype)) { return mimetype; }

        if (_.isUndefined(format)) { throw new MimeTypeNotFoundError(formatOrType); }

        return Mime.types.find(Mime.Type.defaults[format.name]);
      }

      Mime.Type.defaults = {
        "json": "application/json",
        "xml":  "text/xml"
      }

      return Mime;
    }])

    // @class ARMime.Format
    //
    // @argument attributes {object} - A hash of options to register a new
    // Format. Must contain `name`, the name of the Format, and may
    // contain `parsers`, an array of functions used to parse API responses
    // of a given Format.
    //
    // Registers a new Format instance with the `ARMime.formats` set.
    //
    // //////////////////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////////////////
    //
    // @attribute `parsers` {array} - Array of functions used to parse
    // API responses of a given Format. The final, parsed data will be
    // handed off to ngActiveResource.Base subclasses when creating new
    // instances using API data. Each parser should return the object being
    // parsed to be handed off to the next parser in the chain.
    //
    // Parsers is an instance of ARFunctionChain, which exposes the following
    // functionality in a general way.
    //
    // //////////////////////////////////////////////////////////////////////
    //
    //    @method parsers#push
    //      @arguments parsers {functions} - Parser functions, which accept
    //      a single attribute, the API data to parse, and hand off the data
    //      to the next parser in the chain.
    //
    //    parsers#push is a special implementation of Array.prototype#push,
    //    in that it only accepts functions as parsers, and will otherwise
    //    throw a TypeError.
    //
    //    Example:
    //
    //      function idGateway(json) {
    //        json.id = json.postId;
    //        delete json.postId;
    //        return json;
    //      };
    //
    //      function nameRemovingParser(json) {
    //        delete json.name;
    //        return json;
    //      };
    //
    //      ARMime.formats['json']
    //        .parsers.push(idGateway, nameRemovingParser);
    //
    // //////////////////////////////////////////////////////////////////////
    //
    //    @method parsers#remove
    //      @argument parser {function|string} - The exact function, or name
    //      of the function to remove from the parsers array for the given
    //      MimeType.
    //
    //    If you wish to remove parsers, including the built-in parsers 
    //    by name, you can do that using the parsers#remove method.
    //
    //    Examples:
    //
    //      ARMime.formats['json']
    //        .parsers.remove(idGateway);
    //
    //      ARMime.formats['json']
    //        .parsers.remove('idGateway');
    //
    // //////////////////////////////////////////////////////////////////////
    //
    //    @method parsers#removeAll
    //
    //    Removes all parsers of a given MimeType. Use if you want to clear
    //    all built-in parsers before adding your own.
    //
    //    Example:
    //
    //      ARMime.formats['json']
    //        .parsers.removeAll();
    //
    // //////////////////////////////////////////////////////////////////////
    //
    //  @method ARMime.Format#parse
    //
    //    @argument data {object|string} - The data from an API endpoint to
    //    parse.
    //
    //  See ARMime.parse
    //
    //  Examples:
    //
    //    ARMime.Format['xml'].parse('<post>1</post>');
    //
    // //////////////////////////////////////////////////////////////////////

    .factory('ARMime.Format', ['ARStrictRequire', 'ARMime.parse', 'ARMime.format',
      'ARFunctionChain',
      function(strictRequire, parse, format, FunctionChain) {

      function Format(attributes) {
        strictRequire(attributes, ['name']);

        this.name       = attributes.name;
        this.parsers    = new FunctionChain({functions: attributes.parsers, name: 'Parsers'});
        this.formatters = new FunctionChain({functions: attributes.formatters, name: 'Formatters'});
        this.parse      = formatSpecificParse;
        this.format     = formatSpecificFormat;

        if (attributes.mimetype != true) {
          Mime.formats.add({key: this.name, 
                            value: this, 
                            error: 'Format already registered with ngActiveResource. See ARMime documentation to customize this Format.'});
        }
      };

      function formatSpecificParse(data) {
        return formatSpecificChain(this.name, data, parse);
      };

      function formatSpecificFormat(data) {
        return formatSpecificChain(this.name, data, format);
      }

      function formatSpecificChain(format, data, strategy) {
        return strategy({type: format, data: data});
      }

      return Format;
    }])

    // @class ARMime.Type
    // @inherits ARMime.Format
    //
    // @argument attributes {object} - A hash of options to register a new
    // MimeType. Must contain `name`, the name of the MimeType, and may
    // contain `parsers`, an array of functions used to parse API responses
    // of a given MimeType.
    //
    // Registers a new MimeType instance with the `ARMime.types` set.
    //
    // ARMime.Type inherits from ARMime.Format. It obtains its own parsers
    // array, and names the mimetype following the conventions of IETF RFC 2046.
    //
    // //////////////////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////////////////
    //
    // @attribute `topLevelName` {string} - The name of the top level format.
    // Common IANA top level formats include application, audio, example,
    // image, message, model, multipart, text, and video.
    //
    // //////////////////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////////////////
    //
    // @attribute `subtypeName` {string} - The name of the subtype.
    // Subtypes usually allude to their protocol semantics, such as json or xml,
    // but may not, as in the case of 'atom.'
    //
    // //////////////////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////////////////
    //
    // @attribute `suffix` {string} - An optional augmentation to the media type
    // definition to specify the underlying structure of the media type.
    //
    // Example:
    //
    //    'application/atom+xml'  // xml is the suffix
    //
    // //////////////////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////////////////
    //
    // @attribute `tree` {string} - An optional registration tree. By default,
    // a MimeType without a tree specified is in the standards tree.
    //
    // Example:
    //
    //    'application/vnd.ms-excel'  // vendor tree
    //    'application/json'          // standards tree
    //
    // //////////////////////////////////////////////////////////////////////
    .factory('ARMime.Type', ['ARStrictRequire', 'ARMime.parse', 
      'ARMime.Format',
      function(strictRequire, parse, Format) {

      function MimeType(attributes) {
        strictRequire(attributes, ['name']);
        attributes.mimetype = true;

        Format.call(this, attributes);
        parseName.call(this, attributes.name);

        Mime.types.add({key: this.name, 
                        value: this, 
                        error: 'MimeType already registered with ngActiveResource. See ARMime documentation to customize this MimeType.'});
      };

      function parseName(name) {
        ensureValidMimeType(name);

        this.topLevelName = topLevelDomain();
        name              = nameMinusTopLevelDomain();
        this.tree         = tree();
        name              = nameMinusTree();
        this.subtypeName  = subtypeName();
        this.suffix       = suffix();

        // 'application/vnd.atom+xml' => 'application'
        function topLevelDomain() {
          return name.split('/')[0];
        };

        // 'application/vnd.atom+xml' => 'vnd.atom+xml'
        function nameMinusTopLevelDomain() {
          return name.split('/')[1];
        };

        // 'vnd.atom+xml' => 'vnd'
        // 'prs.my-media' => 'prs'
        // 'json'         => 'standards'
        function tree() {
          return containsTree() ? name.split('.')[0] : 'standards';
        };

        // 'vnd.atom+xml' => 'atom+xml'
        // 'prs.my-media' => 'my-media'
        // 'json'         => 'json'
        function nameMinusTree() {
          return containsTree() ? name.split('.')[1] : name.split('.')[0];
        };

        // 'atom+xml' => 'atom'
        // 'json'     => 'json'
        function subtypeName() {
          return containsSuffix() ? name.split('+')[0] : name;
        };

        // 'atom+xml' => 'xml'
        // 'json'     => undefined
        function suffix() {
          return containsSuffix() ? name.split('+')[1] : undefined;
        };

        function containsTree() {
          return name.split('.')[1] !== undefined;
        };

        function containsSuffix() {
          return name.split('+')[1] !== undefined;
        };
      };

      function ensureValidMimeType(name) {
        if (name.match('/') === null) {
          throw {
            name: 'InvalidMimeTypeError',
            message: 'MimeType ' + name + ' must be in format top-level-name/subtype-name[+suffix]. E.g. application/json or application/atom+xml'
          }
        }
      };

      return MimeType;
    }])

    // @method parse
    //    @attribute attributes {object} - An options hash containing:
    //      @option - type - The string name of the mimetype to use for parsing
    //      @option - data - The raw data from the API to parse into a
    //      Javascript object
    //
    // At the end of the parse chain, a Plain Old Javascript Object should be
    // returned, ready to be passed to a subclass of ngActiveResource for 
    // instantiation.
    //
    // This method is only guaranteed to work if the parse chain fulfills this
    // agreement to return a Javascript object. Otherwise, it will throw
    // a ParseError.
    //
    // //////////////////////////////////////////////////////////////////////
    .factory('ARMime.parse', ['ARStrictRequire', function(strictRequire) {
      function parseDataAccordingToMimeType(attributes) {
        strictRequire(attributes, ['type', 'data']);
        parseOrFormatData(attributes, "parsers");
        ensureParseChainSuccess(attributes.data, attributes.type);

        return attributes.data;
      };

      function ensureParseChainSuccess(object, mimetype) {
        if (!_.isObject(object)) {
          throw {
            name: 'ParseError',
            message: 'Parse chain did not return a Javascript object for mimetype ' + mimetype
          }
        };
      };

      return parseDataAccordingToMimeType;
    }])

    // @method format
    //    @attribute attributes {object} - An options hash containing:
    //      @option - type - The string name of the mimetype to use for formatting
    //      @option - data - A Javascript object to format into the appropriate 
    //      Mimetype
    //
    // At the end of the format chain, the Javascript object will be formatted in the
    // appropriate Mimetype.
    //
    // //////////////////////////////////////////////////////////////////////
    .factory('ARMime.format', ['ARStrictRequire', function(strictRequire) {
      function formatDataAccordingToMimeType(attributes) {
        strictRequire(attributes, ['type', 'data']);

        return parseOrFormatData(attributes, "formatters");
      };

      return formatDataAccordingToMimeType;
    }]);

    function parseOrFormatData(attributes, parsersOrFormatters) {
      var functionChain  = getFunctionChain(attributes.type, parsersOrFormatters);

      _.each(functionChain, function(fn) {
        attributes.data = fn(attributes.data); 
      });

      return attributes.data;
    }

    function getFunctionChain(type, chainType) {
        var mimetype = getMimetype(type, chainType);
        var format   = _.isString(mimetype.name) ? getFormat(mimetype, chainType) : 
                                                   getFormat(type, chainType);

        return _.isUndefined(format) ? mimetype[chainType] : _.flatten([format[chainType], 
                                                                        mimetype[chainType]]) 
    }

    function getMimetype(type, chainType) {
      return Mime.types.find(type) || emptyResult(chainType);
    };

    function getFormat(mimetype, chainType) {
      return Mime.formats.find(mimetype) ||
        Mime.formats.find(mimetype.suffix) || 
        Mime.formats.find(mimetype.subtypeName) ||
        emptyResult(chainType);
    };

    function emptyResult(chainType) {
      var emptyResult = {};
      emptyResult[chainType] = [];
      return emptyResult;
    }

})();
