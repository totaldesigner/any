/**
 * Created by mspark on 16. 6. 26.
 */
/*jshint browser:true */
/*globals any:false */
'use strict';

if (typeof any === 'undefined') {
  throw new Error('any.ui\'s JavaScript requires any');
}

(function () {
  var Page, Layer, Layout, Menu, List;
  var page, layer, layout, menu, list;

  List = any.collections.List;
  Page = any.controls.Page;
  Layer = any.controls.Layer;
  Layout = any.controls.Layout;
  Menu = any.ui.Menu;

  list = new List([{
    name: '메인'
  }, {
    name: '잡화'
  }, {
    name: '도구'
  }, {
    name: '외출'
  }, {
    name: '음식'
  }, {
    name: '문의'
  }]);
  page = new Page();
  layer = new Layer();
  layout = new Layout();
  menu = new Menu(list, function (item) {
    var a = document.createElement('a');
    a.appendChild(document.createTextNode(item.name));
    return a;
  });

  layout.append(menu);
  layer.append(layout);
  page.append(layer);
  page.draw();
})();
