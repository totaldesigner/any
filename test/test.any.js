var any = any || {};
var List, ListView, Layout, Layer, Page;
List = any.collections.List;
ListView = any.controls.ListView;
Layout = any.controls.Layout;
Layer = any.controls.Layer;
Page = any.controls.Page;

describe('any.js', function () {
  it('should return the item\'s name of List', function () {
    var List, list;
    List = any.collections.List;
    list = new List([{name: 'MS'}]);
    list.should.equal(list);
  });
  it('should display the ListView without error', function () {
    var div, listView, layout, layer, page;

    // List
    list = new List([{name: 'mspark1'}, {name: 'mspark2'}, {name: 'mspark3'}]);

    // ListView
    listView = new ListView(list, function (item) {
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
    page = new Page();
    page.append(layer);
    page.draw();

    list.add({
      name: 'mspark4'
    });

    list.removeAt(2);

    list.update(0, {
      name: 'mspark7'
    });
  });
});
