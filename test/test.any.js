var any = any || {};

describe('test any.js', function () {
  it('should return the name of item', function () {
    var List, list;
    List = any.collections.List;
    list = new List([{name: 'MS'}]);
    list.should.equal(list);
  });
  it('should return the page', function () {
    var List, ListView, Layout, Layer, Page;
    var body, div, listView, layout, layer, page;

    List = any.collections.List;
    ListView = any.controls.ListView;
    Layout = any.controls.Layout;
    Layer = any.controls.Layer;
    Page = any.controls.Page;

    // List
    list = new List([{
      name: 'mspark1'
    }, {
      name: 'mspark2'
    }, {
      name: 'mspark3'
    }]);

    // ListView
    listView = new ListView(list, function(item) {
      d = document.createElement('div');
      d.appendChild(document.createTextNode(item.name));
      return d;
    });

    // Layout
    layout = new Layout();
    layout.append(listView);

    // Layer
    layer = new Layer();
    layer.append(layout);

    // Page
    body = document.getElementsByTagName('body')[0];
    div = document.createElement('div');
    div.className = 'any';
    body.appendChild(div);
    page = new Page(div);
    page.append(layer);
    page.draw();

    list.add({
      name: 'mspark4'
    });

    list.removeAt(2);

    list.update(1, {
      name: 'mspark7'
    });
  });
});
