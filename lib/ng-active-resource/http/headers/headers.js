angular
  .module('ngActiveResource')
  .factory('ARHeaders', ['ARMixin', 'ARFunctional.Collection', function(mixin, FunctionalCollection) {

    return {
      register: function(headerParser) {
        this.parsers.push(headerParser);
      },

      parsers: mixin([], FunctionalCollection),

      parse: function(headers) {
        headers = headers();

        this.parsers.each(function(parser) {
          headers[parser.parses] = parser.parse(headers[parser.parses]);
        });

        return headers;
      }
    }

  }]);
