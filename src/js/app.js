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
    page, layer, menu, list, header, photo, pickup, info, footer,
    headerInner, footerInner, headerLogo, headerMenu, logo, img, copyright,
    pickup1, pickup2, pickup3;

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

  // header
  logo = document.createElement('div').appendChild(document.createElement('h1')
      .appendChild(document.createTextNode('_')));
  headerLogo = new Box(new Item(logo));
  headerMenu = new Box(menu);
  headerInner = new Box();
  headerInner.addClass('header-inner horizontal');
  headerInner.append(headerLogo);
  headerInner.append(headerMenu);
  header = new Box();
  header.addClass('header');
  header.append(headerInner);
  layer.append(header);

  // photo
  img = document.createElement('img');
  img.setAttribute('src', '../img/header.jpg');
  photo = new Box(new Item(document.createElement('div').appendChild(img)));
  photo.addClass('photo');
  layer.append(photo);

  // pickup
  pickup1 = new Box();
  pickup2 = new Box();
  pickup3 = new Box();
  pickup = new Box();
  pickup.addClass('pickup');
  layer.append(pickup);

  // info
  info = new Box();
  info.addClass('info');
  layer.append(info);

  // footer
  copyright = document.createElement('div');
  copyright.className = 'copyright';
  copyright.innerHTML = '<p>Copyright© totaldesigner</p>';
  footerInner = new Box(new Item(copyright));
  footerInner.addClass('footer-inner');
  footer = new Box(footerInner);
  footer.addClass('footer');
  layer.append(footer);

  page.append(layer);
  page.draw();
})();
