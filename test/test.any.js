var any = any || {};

describe('test any.js', function () {
  it('should return the name of item', function () {
    var List = any.collections.List;
    var list = new List([{name: 'MS'}]);
    list.should.equal(list);
  });
});
