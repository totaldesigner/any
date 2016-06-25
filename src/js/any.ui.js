/**
 * Created by mspark on 16. 6. 25.
 */
/*jshint browser:true */
/*globals any:false */
'use strict';

if (typeof any === 'undefined') {
  throw new Error('any.ui\'s JavaScript requires any');
}

var UI_CLASS_NAME = {
  MENU: 'menu',
  MENU_ITEM: 'menu-item'
};

any.ui = (function () {
  var controls, ListView, Layer;
  controls = any.controls;
  ListView = controls.ListView;
  Layer = controls.Layer;

  function Menu() {
    var self = this;
    ListView.call(self, UI_CLASS_NAME.MENU);
  }

  Menu.prototype = new ListView();

  function ContextMenu() {

  }

  ContextMenu.prototype = new Menu();

  function Dialog() {

  }

  Dialog.prototype = new Layer();

  function Pagination() {

  }

  Pagination.prototype = new ListView();

  return {
    ContextMenu: ContextMenu,
    Dialog: Dialog,
    Menu: Menu,
    Pagination: Pagination
  };
}());
