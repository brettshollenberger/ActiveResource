describe('ARMime', function() {

  var Mime;
  beforeEach(inject(function(_ARMime_) {
    Mime = _ARMime_;
  }));

  it('contains default mimetypes', function() {
    expect(Mime.types.first).toEqual('json');
  });

  it('adds #register(s) additional mimetypes', function() {
    Mime.types.register('xml');
    expect(Mime.types.last).toEqual('xml');
  });

  it('does not re-register mimetypes', function() {
    Mime.types.register('json');
    expect(Mime.types.length).toEqual(1);
  });
});
