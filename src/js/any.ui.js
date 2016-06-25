/**
 * Created by mspark on 16. 6. 25.
 */
/*jshint browser:true */
/*globals any:false */
'use strict';

if (typeof any === 'undefined') {
  throw new Error('any.ui\'s JavaScript requires any');
}
any.ui = (function () {
  var controls = any.controls;

  function Menu() {

  }

  Menu.prototype = new controls.List();

  function ContextMenu() {

  }

  ContextMenu.prototype = new Menu();

  function Dialog() {

  }

  Dialog.prototype = new controls.Layer();

  function Pagination() {

  }

  Pagination.prototype = new controls.List();

  return {
    ContextMenu: ContextMenu,
    Dialog: Dialog,
    Menu: Menu,
    Pagination: Pagination
  };
}());
