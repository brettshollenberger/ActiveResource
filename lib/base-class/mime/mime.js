(function() {

  var Mime = {};

  angular
    .module('BaseClass')

    // @module BCMime
    //
    // The purpose of the MimeType module is to recognize and parse the
    // protocol semantics of various Content-Type headers that may be
    // returned from APIs. Each MimeType registered must be capable of
    // parsing a representation of a given type, such as XML, into a valid
    // Javascript object ready to be instantiated by a subclass of BaseClass.
    //
    // Protocol semantics make up one of two pieces of API data parsing.
    // Application semantics will be handled by BCProfile, which will parse 
    // Profiles (e.g. microformats and microdata), and BCClassSemantics, 
    // which can parse ad hoc semantics not defined by any 
    // machine-readable profile. 
    //
    // //////////////////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////////////////
    //
    // BCMime is the core BaseClass MimeType module. It exposes:
    //
    // * The BCMime.Format constructor, detailed below, which registers new
    // data formats. An example of a data format is 'xml', which
    // has core semantics that may belong to multiple mimetypes, like
    // 'application/xml', 'text/xml', and 'application/atom+xml.'
    //
    //    Example:
    //
    //    new BCMime.Format('json');
    //
    // //////////////////////////////////////////////////////////////////////
    // 
    // * The BCMime.Type constructor, detailed below, which registers new 
    // MimeTypes. MimeTypes are stricter than Formats; MimeTypes are required
    // to follow the 'type/subtype+suffix;optional=params' format defined in
    // IETF RFC 2046.
    //
    //    Example:
    //
    //    new BCMime.Type('application/atom+xml');
    //
    // //////////////////////////////////////////////////////////////////////
    //
    // * The BCMime.formats collection, which holds all formats registered
    // in the application and in BaseClass Core. BCMime.formats is an instance
    // of BCSet, which ensures uniqueness of keys through its `add` function.
    //
    // //////////////////////////////////////////////////////////////////////
    //
    // * The BCMime.types collection, which holds all mimetypes registered 
    // in the application and in BaseClass Core. BCMime.types is also an 
    // instance of BCSet.
    //
    // //////////////////////////////////////////////////////////////////////
    //
    // * The BCMime.parse function, which parses input from an API endpoint
    // into a Javascript object, ready to be interpreted by either an
    // application semantics parser, or a subclass of BaseClass itself.
    //
    // //////////////////////////////////////////////////////////////////////

    .factory('BCMime', ['BCMime.Format', 'BCMime.Type', 'BCMime.parse', 'BCSet',
      function(Format, MimeType, parse, Set) {

      Mime.Format  = Format;
      Mime.Type    = MimeType;
      Mime.formats = new Set();
      Mime.types   = new Set();
      Mime.parse   = parse;

      return Mime;
    }])

    // @class BCMime.Format
    //
    // @argument attributes {object} - A hash of options to register a new
    // Format. Must contain `name`, the name of the Format, and may
    // contain `parsers`, an array of functions used to parse API responses
    // of a given Format.
    //
    // Registers a new Format instance with the `BCMime.formats` set.
    //
    // //////////////////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////////////////
    //
    // @attribute `parsers` {array} - Array of functions used to parse
    // API responses of a given Format. The final, parsed data will be
    // handed off to BaseClass.Base subclasses when creating new
    // instances using API data. Each parser should return the object being
    // parsed to be handed off to the next parser in the chain.
    //
    // Parsers is an instance of BCFunctionChain, which exposes the following
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
    //      BCMime.formats['json']
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
    //      BCMime.formats['json']
    //        .parsers.remove(idGateway);
    //
    //      BCMime.formats['json']
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
    //      BCMime.formats['json']
    //        .parsers.removeAll();
    //
    // //////////////////////////////////////////////////////////////////////
    //
    //  @method BCMime.Format#parse
    //
    //    @argument data {object|string} - The data from an API endpoint to
    //    parse.
    //
    //  See BCMime.parse
    //
    //  Examples:
    //
    //    BCMime.Format['xml'].parse('<post>1</post>');
    //
    // //////////////////////////////////////////////////////////////////////

    .factory('BCMime.Format', ['BCStrictRequire', 'BCMime.parse', 
      'BCFunctionChain',
      function(strictRequire, parse, FunctionChain) {

      function Format(attributes) {
        strictRequire(attributes, ['name']);

        this.name    = attributes.name;
        this.parsers = new FunctionChain({functions: attributes.parsers, name: 'Parsers'});
        this.parse   = formatSpecificParse;

        if (attributes.mimetype != true) {
          Mime.formats.add({key: this.name, 
                            value: this, 
                            error: 'Format already registered with BaseClass. See BCMime documentation to customize this Format.'});
        }
      };

      function formatSpecificParse(data) {
        var format = this.name;
        if (_.isObject(data)) {
          strictRequire(data, ['data']);
          data = data.data;
        }
        return parse({type: format, data: data});
      };

      return Format;
    }])

    // @class BCMime.Type
    // @inherits BCMime.Format
    //
    // @argument attributes {object} - A hash of options to register a new
    // MimeType. Must contain `name`, the name of the MimeType, and may
    // contain `parsers`, an array of functions used to parse API responses
    // of a given MimeType.
    //
    // Registers a new MimeType instance with the `BCMime.types` set.
    //
    // BCMime.Type inherits from BCMime.Format. It obtains its own parsers
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
    .factory('BCMime.Type', ['BCStrictRequire', 'BCMime.parse', 
      'BCMime.Format',
      function(strictRequire, parse, Format) {

      function MimeType(attributes) {
        strictRequire(attributes, ['name']);
        attributes.mimetype = true;

        Format.call(this, attributes);
        parseName.call(this, attributes.name);

        Mime.types.add({key: this.name, 
                        value: this, 
                        error: 'MimeType already registered with BaseClass. See BCMime documentation to customize this MimeType.'});
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
    // returned, ready to be passed to a subclass of BaseClass for 
    // instantiation.
    //
    // This method is only guaranteed to work if the parse chain fulfills this
    // agreement to return a Javascript object. Otherwise, it will throw
    // a ParseError.
    //
    // //////////////////////////////////////////////////////////////////////
    .factory('BCMime.parse', ['BCStrictRequire', function(strictRequire) {
      function parseDataAccordingToMimeType(attributes) {
        strictRequire(attributes, ['type', 'data']);
        var parsers  = getParsers(attributes.type);

        _.each(parsers, function(parser) {
          attributes.data = parser(attributes.data); 
        });

        ensureParseChainSuccess(attributes.data, attributes.type);
        return attributes.data;
      };

      function getParsers(type) {
        var mimetype = getMimetype(type);
        var format   = _.isString(mimetype.name) ? getFormat(mimetype) : getFormat(type);

        return _.isUndefined(format) ? mimetype.parsers : _.flatten([format.parsers, mimetype.parsers]) 
      };

      function getMimetype(type) {
        return Mime.types.find(type) || {parsers: []};
      };

      function getFormat(mimetype) {
        return Mime.formats.find(mimetype) ||
                Mime.formats.find(mimetype.suffix) || 
                  Mime.formats.find(mimetype.subtypeName) ||
                    {parsers: []}
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
    }]);

})();
