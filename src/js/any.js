/**
 * Created by mspark on 6/22/16.
 */

var CLASS_NAME = {
  VIEW: 'view',
  LIST: 'list',
  LIST_ITEM: 'list-item',
  LAYOUT: 'layout',
  LAYER: 'layer'
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
    var self = this;
    if (!self.listeners) {
      self.listeners = {};
    }
    if (!(name in self.listeners)) {
      return false;
    }
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
    var self = this;
    if (!(event.name in self.listeners)) {
      return;
    }
    var stack = self.listeners[event.name];
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
      self.dispatchEvent(new ItemUpdated(self, {index: index, item: item}))
    };
    return {
      List: List
    }
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
    }

    mixin(Control.prototype, EventTarget.prototype);

    function Item() {
      var self = this;
      Control.call(self, 'item');
    }

    Item.prototype = new Control();

    function ListItem() {
      var self = this, element;
      element = document.createElement('li');
      element.className = 'list-item';
      self.element = element;
    }

    ListItem.prototype = new Item();

    function View(className, list, itemTemplate) {
      var self = this;
      Control.call(self, 'view, ' + className);
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
      }
    }

    View.prototype = new Control();
    View.prototype.draw = function () {
      var self = this, list = self.list, element = self.element;
      while (element.hasChildNodes()) {
        element.removeChild(element.firstChild);
      }
      for (var i = 0, l = list.length; i < l; i++) {
        self.element.appendChild(self.itemTemplate(list[i]));
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
    function List(list, itemTemplate) {
      var self = this;
      View.call(self, CLASS_NAME.LIST, list, itemTemplate);
    }

    List.prototype = new View();
    List.prototype.onItemAdded = function (e) {
      var self = this;
      self.element.appendChild(self.itemTemplate(e.args));
    };
    List.prototype.onItemRemoved = function (e) {
      var self = this, args, index;
      args = e.args;
      index = args.index;
      if (isNumber(index)) {
        self.element.removeAt(index);
      }
    };
    List.prototype.onItemUpdated = function (e) {
      var self = this, args, index;
      args = e.args;
      index = args.index;
      if (isNumber(index)) {
        self.element.child()
      }
    };

    function Layout() {

    }

    Layout.prototype = new Control();

    function Layer() {

    }

    Layer.prototype = new Control();

    return {
      List: List,
      Layout: Layout,
      Layer: Layer
    }
  })();

  return {
    collections: collections,
    controls: controls
  };
})(any);

// module.exports = {
//   collections: any.collections,
//   views: any.views
// };
// var List = any.collections.List;
// var ListView = any.views.ListView;
// list = new List([{text: '1'}, {text: '2'}, {text: '3'}]);
// listView = new ListView(document.getElementsByTagName('body')[0], list, function (item) {
//   var div = document.createElement('div');
//   var text = document.createTextNode(item.text);
//   div.appendChild(text);
//   return div;
// });
// listView.draw();

