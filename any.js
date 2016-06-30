/**
 * Created by mspark on 6/29/16.
 */
/*jshint browser:true */
/*globals any:false */
'use strict';

if (typeof any === 'undefined') {
  throw new Error('any.ani\'s JavaScript requires any');
}

any.ani = (function () {
  var utils, events;
  utils = any.events;
  events = any.utils;

  function Animation() {

  }
  utils.mixin(Animation.prototype, events.EventTarget);

  return {
    Animation: Animation
  };
}());

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

  function Menu(list, itemTemplate) {
    var self = this;
    ListView.call(self, list, itemTemplate, UI_CLASS_NAME.MENU);
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

/**
 * Created by mspark on 6/22/16.
 */
/*jshint browser:true */
'use strict';

var CLASS_NAME = {
  BOX: 'box',
  VIEW: 'view',
  ITEM: 'item',
  LIST_VIEW: 'list-view',
  LIST_VIEW_ITEM: 'list-view-item',
  LAYOUT: 'layout',
  LAYER: 'layer',
  PAGE: 'page'
};

var any = any || {};
any = (function () {
  var utils, events, collections, controls;

  utils = (function () {
    function mixin(target, source) {
      function copyProperty(key) {
        target[key] = source[key];
      }

      if (arguments.length > 2) {
        Array.prototype.slice.call(arguments, 2).forEach(copyProperty);
      } else {
        Object.keys(source).forEach(copyProperty);
      }
    }

    return {
      mixin: mixin
    };
  })();

  events = (function () {
    /**
     * Event
     * @param name
     * @param sender
     * @param args
     * @constructor
     */
    function Event(name, sender, args) {
      var self = this;
      self.name = name;
      self.sender = sender;
      self.args = args;
    }

    /**
     * ItemAdded
     * @param sender
     * @param args
     * @constructor
     */
    function ItemAdded(sender, args) {
      Event.call(this, 'ItemAdded', sender, args);
    }

    ItemAdded.prototype = new Event();

    /**
     * ItemRemoved
     * @param sender
     * @param args
     * @constructor
     */
    function ItemRemoved(sender, args) {
      Event.call(this, 'ItemRemoved', sender, args);
    }

    ItemRemoved.prototype = new Event();

    /**
     * ItemUpdated
     * @param sender
     * @param args
     * @constructor
     */
    function ItemUpdated(sender, args) {
      Event.call(this, 'ItemUpdated', sender, args);
    }

    ItemUpdated.prototype = new Event();

    /**
     * EventTarget
     * @constructor
     */
    function EventTarget() {
    }

    EventTarget.prototype.addEventListener = function (name, callback) {
      var self = this;
      if (!self.listeners) {
        self.listeners = {};
      }
      if (!(name in self.listeners)) {
        self.listeners[name] = [];
      }
      self.listeners[name].push(callback);
    };
    EventTarget.prototype.removeEventListener = function (name, callback) {
      var self = this, stack;
      if (!self.listeners) {
        self.listeners = {};
      }
      if (!(name in self.listeners)) {
        return false;
      }
      stack = self.listeners[name];
      if (callback) {
        for (var i = 0, l = stack.length; i < l; i++) {
          if (stack[i] === callback) {
            stack.splice(i, 1);
            return self.removeEventListener(name, callback);
          }
        }
      } else {
        delete self.listeners[name];
      }
    };
    EventTarget.prototype.dispatchEvent = function (event) {
      var self = this, stack;
      if (!(event.name in self.listeners)) {
        return;
      }
      stack = self.listeners[event.name];
      event.target = self;
      for (var i = 0, l = stack.length; i < l; i++) {
        stack[i].call(self, event);
      }
    };

    return {
      Event: Event,
      EventTarget: EventTarget,
      ItemAdded: ItemAdded,
      ItemRemoved: ItemRemoved,
      ItemUpdated: ItemUpdated
    };
  })();

  /**
   * collections
   * @type {{List}}
   */
  collections = (function () {
    /**
     * Collection
     * @constructor
     */
    function Collection() {

    }

    Collection.prototype = [];
    utils.mixin(Collection.prototype, events.EventTarget.prototype);
    Collection.prototype.items = function (index) {
      return this[index];
    };

    /**
     * List
     * @constructor
     */
    function List(items) {
      var self = this;
      if (items instanceof Array) {
        self.splice.apply(self, [0, 0].concat(items));
      }
    }

    List.prototype = new Collection();
    List.prototype.add = function (item) {
      var self = this;
      self.push(item);
      self.dispatchEvent(new events.ItemAdded(self, {item: item}));
    };
    List.prototype.removeAt = function (index) {
      var self = this;
      self.splice(index, 1);
      self.dispatchEvent(new events.ItemRemoved(self, {index: index}));
    };
    List.prototype.update = function (index, item) {
      var self = this;
      self[index] = item;
      self.dispatchEvent(new events.ItemUpdated(self, {index: index, item: item}));
    };
    return {
      List: List
    };
  })();

  /**
   * controls
   * @type {{ListView, Layout, Layer, Page}}
   */
  controls = (function () {
    /**
     * Control
     * @param className
     * @constructor
     */
    function Control(className) {
      var self = this, element;
      element = document.createElement('div');
      element.className = className;
      self.element = element;
      self.items = [];
    }

    utils.mixin(Control.prototype, events.EventTarget.prototype);
    Control.prototype.append = function (item) {
      var self = this;
      self.items.push(item);
    };
    Control.prototype.empty = function () {
      var self = this, element = self.element;
      while (element.hasChildNodes()) {
        element.removeChild(element.firstChild);
      }
      self.items = [];
    };
    Control.prototype.draw = function () {
      var self = this, item, items = self.items, element = self.element;
      //self.empty();
      for (var i = 0, l = items.length; i < l; i++) {
        item = items[i];
        if (element.className.indexOf('horizontal') > -1) {
          item.element.style.width = (100 / l) + '%';
        }
        element.appendChild(item.element);
        item.draw();
      }
    };
    Control.prototype.addClass = function (className) {
      this.element.className += ' ' + className;
    };

    /**
     * Item
     * @constructor
     */
    function Item(element) {
      var self = this;
      self.element = element;
      self.items = [];
    }

    Item.prototype = new Control();

    /**
     * ListViewItem
     * @param className
     * @constructor
     */
    function ListViewItem(className) {
      var self = this, element;
      element = document.createElement('li');
      element.className = className;
      self.element = element;
    }

    ListViewItem.prototype = new Item();
    ListViewItem.prototype.draw = function (child) {
      var self = this;
      self.element.appendChild(child);
    };

    /**
     * ListView
     * @param list
     * @param itemTemplate
     * @param className
     * @constructor
     */
    function ListView(list, itemTemplate, className) {
      var self = this, element;
      self.className = className || CLASS_NAME.LIST_VIEW;
      element = document.createElement('ul');
      element.className = self.className;
      self.element = element;
      if (list) {
        list.addEventListener('ItemAdded', function (e) {
          self.onItemAdded(e);
        });
        list.addEventListener('ItemRemoved', function (e) {
          self.onItemRemoved(e);
        });
        list.addEventListener('ItemUpdated', function (e) {
          self.onItemUpdated(e);
        });
        self.itemTemplate = itemTemplate;
        self.list = list;
      }
    }

    ListView.prototype = new Control();
    ListView.prototype.draw = function () {
      var self = this, list = self.list, item, element = self.element,
        itemTemplate = self.itemTemplate;
      //self.empty();
      for (var i = 0, l = list.length; i < l; i++) {
        item = new ListViewItem(self.className + '-item');
        item.draw(itemTemplate(list[i]));
        element.appendChild(item.element);
      }
    };
    ListView.prototype.onItemAdded = function (e) {
      var self = this, args, item;
      args = e.args;
      item = new ListViewItem(self.className + '-item');
      item.draw(self.itemTemplate(args.item));
      self.element.appendChild(item.element);
    };
    ListView.prototype.onItemRemoved = function (e) {
      var self = this, args, index, child;
      args = e.args;
      index = args.index;
      if (!isNaN(index)) {
        child = document.querySelector('.' + self.className + '-item:nth-child(' + (index + 1) + ')');
        self.element.removeChild(child);
      }
    };
    ListView.prototype.onItemUpdated = function (e) {
      var self = this, args, index, item, child;
      args = e.args;
      index = args.index;
      if (!isNaN(index)) {
        child = document.querySelector('.' + self.className + '-item:nth-child(' + (index + 1) + ')');
        item = new ListViewItem(self.className + '-item');
        item.draw(self.itemTemplate(args.item));
        self.element.replaceChild(item.element, child);
      }
    };

    /**
     * Box
     * @param child
     * @constructor
     */
    function Box(child) {
      var self = this;
      Control.call(self, CLASS_NAME.BOX);
      if (child) {
        self.items.push(child);
      }
    }

    Box.prototype = new Control();

    /**
     * Layer
     * @constructor
     */
    function Layer() {
      var self = this;
      Control.call(self, CLASS_NAME.LAYER);
    }

    Layer.prototype = new Control();

    function Page() {
      var self = this;
      Control.call(self, CLASS_NAME.PAGE);
    }

    /**
     * Page
     * @type {Control}
     */
    Page.prototype = new Control();
    Page.prototype.draw = function () {
      var self = this, body;
      body = document.getElementsByTagName('body')[0];
      body.className = 'any';
      Control.prototype.draw.call(self);
      body.appendChild(self.element);
    };

    return {
      Item: Item,
      Box: Box,
      ListView: ListView,
      Layer: Layer,
      Page: Page
    };
  })();

  return {
    utils: utils,
    events: events,
    collections: collections,
    controls: controls
  };
})(any);
