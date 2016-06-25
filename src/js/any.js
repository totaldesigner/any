/**
 * Created by mspark on 6/22/16.
 */
/*jshint browser:true */
'use strict';

var CLASS_NAME = {
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
  var collections, controls;

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
    mixin(Collection.prototype, EventTarget.prototype);
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
      self.dispatchEvent(new ItemAdded(self, {item: item}));
    };
    List.prototype.removeAt = function (index) {
      var self = this;
      self.splice(index, 1);
      self.dispatchEvent(new ItemRemoved(self, {index: index}));
    };
    List.prototype.update = function (index, item) {
      var self = this;
      self[index] = item;
      self.dispatchEvent(new ItemUpdated(self, {index: index, item: item}));
    };
    return {
      List: List
    };
  })();

  /**
   * controls
   * @type {{List, Layout, Layer}}
   */
  controls = (function () {
    /**
     * Control
     * @constructor
     */
    function Control(className) {
      var self = this, element;
      element = document.createElement('div');
      element.className = className;
      self.element = element;
      self.items = [];
    }

    mixin(Control.prototype, EventTarget.prototype);
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
      self.empty();
      for (var i = 0, l = items.length; i < l; i++) {
        item = items[i];
        element.appendChild(item.element);
        item.draw();
      }
    };

    function View(className, list, itemTemplate) {
      var self = this;
      Control.call(self, 'view ' + className);
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

    View.prototype = new Control();
    View.prototype.draw = function () {
      var self = this, list = self.list, element = self.element, child,
        itemTemplate = self.itemTemplate;
      self.empty();
      for (var i = 0, l = list.length; i < l; i++) {
        child = itemTemplate(list[i]);
        child.className = CLASS_NAME.LIST_VIEW_ITEM;
        element.appendChild(child);
      }
    };
    View.prototype.onItemAdded = null;
    View.prototype.onItemRemoved = null;
    View.prototype.onItemUpdated = null;

    /**
     * List
     * @param element
     * @param list
     * @param itemTemplate
     * @constructor
     */
    function ListView(list, itemTemplate) {
      var self = this;
      View.call(self, CLASS_NAME.LIST_VIEW, list, itemTemplate);
    }

    ListView.prototype = new View();
    ListView.prototype.onItemAdded = function (e) {
      var self = this, args, item;
      args = e.args;
      item = args.item;
      item = self.itemTemplate(item);
      item.className = CLASS_NAME.LIST_VIEW_ITEM;
      self.element.appendChild(item);
    };
    ListView.prototype.onItemRemoved = function (e) {
      var self = this, args, index, child;
      args = e.args;
      index = args.index;
      if (!isNaN(index)) {
        child = document.querySelector('.' + CLASS_NAME.LIST_VIEW_ITEM + ':nth-child(' + (index + 1) + ')');
        self.element.removeChild(child);
      }
    };
    ListView.prototype.onItemUpdated = function (e) {
      var self = this, args, index, item, child;
      args = e.args;
      index = args.index;
      item = args.item;
      if (!isNaN(index)) {
        child = document.querySelector('.' + CLASS_NAME.LIST_VIEW_ITEM + ':nth-child(' + (index + 1) + ')');
        item = self.itemTemplate(item);
        item.className = CLASS_NAME.LIST_VIEW_ITEM;
        self.element.replaceChild(item, child);
      }
    };

    function Layout() {
      var self = this;
      Control.call(self, CLASS_NAME.LAYOUT);
    }

    Layout.prototype = new Control();

    function Layer() {
      var self = this;
      Control.call(self, CLASS_NAME.LAYER);
    }

    Layer.prototype = new Control();

    function Page(parent) {
      var self = this;
      Control.call(self, CLASS_NAME.PAGE);
      self.parent = parent;
    }

    Page.prototype = new Control();
    Page.prototype.draw = function() {
      var self = this;
      Control.prototype.draw.call(self);
      self.parent.appendChild(self.element);
    };

    return {
      ListView: ListView,
      Layout: Layout,
      Layer: Layer,
      Page: Page
    };
  })();

  return {
    collections: collections,
    controls: controls
  };
})(any);
