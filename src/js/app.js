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
  var Page, Layer, Menu, List, Box, Item,
    page, layer, menu, list, header, photo, pickup, info, footer, headerLogo, headerMenu, logo, copyright;

  Page = any.controls.Page;
  Layer = any.controls.Layer;
  Menu = any.ui.Menu;
  List = any.collections.List;
  Box = any.controls.Box;
  Item = any.controls.Item;

  list = new List([{
    name: '메인'
  }, {
    name: '연혁'
  }, {
    name: '사업 소개'
  }, {
    name: '채용 정보'
  }, {
    name: '문의'
  }]);

  page = new Page();
  layer = new Layer();
  menu = new Menu(list, function (item) {
    var a = document.createElement('a');
    a.appendChild(document.createTextNode(item.name));
    return a;
  });

  header = new Box();
  header.addClass('header horizontal');
  photo = new Box();
  photo.addClass('photo');
  pickup = new Box();
  pickup.addClass('pickup');
  info = new Box();
  info.addClass('info');
  footer = new Box();
  footer.addClass('footer');
  //layer.append(photo);
  //layer.append(pickup);
  //layer.append(info);

  // header
  logo = document.createElement('div')
    .appendChild(document.createElement('h1')
      .appendChild(document.createTextNode('Anyplace, Anywhere, Anytime')));
  headerLogo = new Box(new Item(logo));
  headerMenu = new Box(menu);
  header.append(headerLogo);
  header.append(headerMenu);
  layer.append(header);

  // footer
  copyright = document.createElement('div')
    .appendChild(document.createElement('p')
      .appendChild(document.createTextNode('Copyright© totaldesigner')));
  footer.append(new Item(copyright));
  layer.append(footer);

  page.append(layer);
  page.draw();
})();
