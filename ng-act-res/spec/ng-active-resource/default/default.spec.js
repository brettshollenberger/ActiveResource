describe('ARDefault', function() {
  var defaultTo;
  beforeEach(inject(function(_ARDefault_) {
    defaultTo = _ARDefault_;
  }));

  describe('#emptyObject', function() {
    it('defaults an argument to an empty object', function() {
      var obj;
      obj = defaultTo.emptyObject(obj);
      expect(obj).toEqual({});
    });

    it('will not overwrite a variable with a value', function() {
      var obj = {hi: 'there'};
      obj = defaultTo.emptyObject(obj);
      expect(obj).toEqual({hi: 'there'});
    });
  });

  describe('#emptyArray', function() {
    it('defaults an argument to an empty array', function() {
      var arr;
      arr = defaultTo.emptyArray(arr);
      expect(arr).toEqual([]);
    });

    it('will not overwrite a variable with a value', function() {
      var arr = [1, 2, 3];
      arr = defaultTo.emptyArray(arr);
      expect(arr).toEqual([1, 2, 3]);
    });
  });
});
