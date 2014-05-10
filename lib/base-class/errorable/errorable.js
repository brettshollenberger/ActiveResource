angular
  .module('BaseClass')
  .factory('BCErrorable', [function() {
    function Errorable() {
      var _$errors = {};

      privateVariable(_$errors, 'add', function(fieldName, errorMessage) {
        if (_.isUndefined(_$errors[fieldName])) _$errors[fieldName] = [];
        if (!_.include(_$errors[fieldName], errorMessage)) {
          _$errors[fieldName].push(errorMessage);
          _$errors.count++;
        }
      });

      privateVariable(_$errors, 'clear', function(fieldName, errorMessage) {
        if (!_.isUndefined(errorMessage)) { 
          clearErrorMessage(fieldName, errorMessage); 
        } else {
          var toClear = [];

          if (_.isArray(fieldName))     toClear = fieldName;
          if (_.isString(fieldName))    toClear.push(fieldName);
          if (_.isUndefined(fieldName)) toClear = _.keys(_$errors);

          _.each(toClear, removeFieldOfErrors);
        }
      });

      privateVariable(_$errors, 'countFor', function(fieldName) {
        if (_.isUndefined(fieldName)) return _$errors.count;
        else return _$errors[fieldName] ? _$errors[fieldName].length : 0;
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
          if (_$errors[fieldName].length === 0) delete _$errors[fieldName];
        }
      }

      privateVariable(_$errors, 'count', 0);

      this.__$errors = _$errors;
    }

    return Errorable;
  }]);
