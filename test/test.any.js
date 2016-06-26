var any = any || {};
var List, ListView, Layout, Layer, Page, Menu;
List = any.collections.List;
ListView = any.controls.ListView;
Layout = any.controls.Layout;
Layer = any.controls.Layer;
Page = any.controls.Page;
Menu = any.ui.Menu;

describe('any.js', function () {
  it('should return the item\'s name of List', function () {
    var List, list;
    List = any.collections.List;
    list = new List([{name: 'MS'}]);
    list.should.equal(list);
  });
  it('should display the ListView without error', function () {
    var div, listView, layer, page;

    // List
    list = new List([{name: 'mspark1'}, {name: 'mspark2'}, {name: 'mspark3'}]);

    // ListView
    listView = new ListView(list, function (item) {
      d = document.createElement('div');
      d.appendChild(document.createTextNode(item.name));
      return d;
    });

    // Layer
    layer = new Layer();
    layer.append(listView);

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
  it('should display the Menu without error', function () {
    var a, list, menu, layer, page;

    // List
    list = new List([{name: '메인'}, {name: '잡화'}, {name: '도구'}, {name: '외출'}, {name: '음식'}, {name: '문의'}]);

    // Menu
    menu = new Menu(list, function (item) {
      a = document.createElement('a');
      a.appendChild(document.createTextNode(item.name));
      return a;
    });

    // Layer
    layer = new Layer();
    layer.append(menu);

    // Page
    page = new Page();
    page.append(layer);
    page.draw();

    list.add({
      name: '위치'
    });

    list.removeAt(2);

    list.update(0, {
      name: '홈'
    });
  });
});
