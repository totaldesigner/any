/*jshint browser:true */
'use strict';

var CLASS_NAME = {
    BOX: 'box',
    VIEW: 'view',
    ITEM: 'item',
    LIST_VIEW_ITEM: 'list-view-item',
    LIST_VIEW: 'list-view',
    MENU_ITEM: 'menu-item',
    MENU: 'menu',
    CONTEXT_MENU_ITEM: 'context-menu-item',
    CONTEXT_MENU: 'context-menu',
    PAGINATION_ITEM: 'pagination-item',
    PAGINATION: 'pagination',
    CAROUSEL_ITEM: 'carousel-item',
    CAROUSEL: 'carousel',
    LAYOUT: 'layout',
    LAYER: 'layer',
    PAGE: 'page',
    SELECTED: 'selected'
};
var ANIMATION_DURATION = 1000;

var any = any || {};
any = (function () {
    var utils, events, collections, controls, win;

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

        function format(s, context) {
            var l = s.split(/\{(.+?)\}/);
            for (var i = 1; i < l.length; i += 2) {
                l[i] = context[l[i]];
            }
            return l.join('');
        }

        return {
            mixin: mixin,
            format: format
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

        function WindowResizing(sender, args) {
            Event.call(this, 'WindowResizing', sender, args);
        }

        WindowResizing.prototype = new Event();

        function WindowResizeEnd(sender, args) {
            Event.call(this, 'WindowResizeEnd', sender, args);
        }

        WindowResizeEnd.prototype = new Event();

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
         * MenuItemSelected
         * @param sender
         * @param args
         * @constructor
         */
        function MenuItemSelected(sender, args) {
            Event.call(this, 'MenuItemSelected', sender, args);
        }

        MenuItemSelected.prototype = new Event();

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
            ItemUpdated: ItemUpdated,
            MenuItemSelected: MenuItemSelected,
            WindowResizing: WindowResizing,
            WindowResizeEnd: WindowResizeEnd
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
         * @param tagName
         * @constructor
         */
        function Control(className, tagName) {
            var self = this, element;
            self.className = className;
            element = document.createElement(tagName || 'div');
            element.classList.add(className);
            self.element = element;
            self.children = [];
            self.html = null;
            self.transitioning = false;
        }

        utils.mixin(Control.prototype, events.EventTarget.prototype);
        Control.prototype.append = function (child) {
            var self = this;
            self.children.push(child);
        };
        Control.prototype.empty = function () {
            var self = this, element = self.element;
            while (element.hasChildNodes()) {
                element.removeChild(element.firstChild);
            }
        };
        Control.prototype.draw = function () {
            var self = this, child, children = self.children, element = self.element;
            self.empty();
            if (self.html) {
                element.innerHTML = self.html;
            }
            for (var i = 0, l = children.length; i < l; i++) {
                child = children[i];
                if (element.classList.contains('horizontal')) {
                    child.element.style.width = (100 / l) + '%';
                }
                child.draw();
                element.appendChild(child.element);
            }
        };
        Control.prototype.transit = function (css, transition, complete) {
            var self = this, element, classList, transitions, transitionEnds;
            element = self.element;
            classList = element.classList;
            transitions = ['-webkit-transition', '-moz-transition', '-o-transition', 'transition'];
            transitionEnds = ['webkitTransitionEnd', 'transitionend', 'msTransitionEnd', 'oTransitionEnd'];
            if (transition) {
                self.transitioning = true;
                for (var i = 0; i < transitions.length; i++) {
                    element.style[transitions[i]] = transition;
                }
                if (complete) {
                    transitionEnds.forEach(function (e) {
                        var listener = function () {
                            transitionEnds.forEach(function (e) {
                                element.removeEventListener(e, listener);
                            });
                            self.transitioning = false;
                            complete();
                        };
                        self.element.addEventListener(e, listener, false);
                    });
                }
            }
            setTimeout(function () {
                if (css instanceof String) {
                    if (classList.contains(css)) {
                        classList.remove(css);
                    } else {
                        classList.add(css);
                    }
                } else {
                    for (var key in css) {
                        if (css.hasOwnProperty(key)) {
                            element.style[key] = css[key];
                        }
                    }
                }
            }, 0);
        };
        Control.prototype.show = function (duration, complete) {
            var self = this, css = 'hidden', transition, element = self.element, classList = element.classList;
            if (classList.contains(css)) {
                if (duration) {
                    transition = utils.format('opacity {duration}ms', {
                        duration: duration
                    });
                }
                self.transit(css, transition, complete);
            }
        };
        Control.prototype.hide = function (duration, complete) {
            var self = this, css = 'hidden', transition, element = self.element, classList = element.classList;
            if (!classList.contains(css)) {
                if (duration) {
                    transition = utils.format('opacity {duration}ms ease', {
                        duration: duration
                    });
                }
                self.transit(css, transition, complete);
            }
        };
        Control.prototype.moveTo = function (x, y, speed, complete) {
            var self = this, transition, style;
            if (speed) {
                transition = utils.format('all {speed}ms ease', {
                    speed: speed
                });
            }
            //style = utils.format('translate3d({x}px, {y}px, {z}px)', {
            //    x: x,
            //    y: y,
            //    z: 0
            //});
            style = utils.format('translate({x}px, {y}px)', {
                x: x,
                y: y
            });
            self.transit({
                '-webkit-transform': style,
                '-moz-transform': style,
                '-o-transform': style,
                '-ms-transform': style,
                'transform': style
            }, transition, complete);
        };
        Control.prototype.addClass = function (className) {
            var self = this, element = self.element, classList;
            classList = className.split(' ');
            for (var i = 0, l = classList.length; i < l; i++) {
                if (!element.classList.contains(classList[i])) {
                    element.classList.add(classList[i]);
                }
            }
        };

        /**
         * Item
         * @param html
         * @param className
         * @param tagName
         * @constructor
         */
        function Item(html, className, tagName) {
            var self = this;
            Control.call(self, className || CLASS_NAME.ITEM, tagName);
            self.html = html;
        }

        Item.prototype = new Control();

        /**
         * ListViewItem
         * @param html
         * @param className
         * @constructor
         */
        function ListViewItem(html, className) {
            var self = this;
            Item.call(self, html, className || CLASS_NAME.LIST_VIEW_ITEM, 'li');
        }

        ListViewItem.prototype = new Item();

        /**
         * ListView
         * @param list
         * @param itemTemplate
         * @param className
         * @constructor
         */
        function ListView(list, itemTemplate, className) {
            var self = this;
            Control.call(self, className || CLASS_NAME.LIST_VIEW, 'ul');
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
                for (var i = 0, l = list.length; i < l; i++) {
                    self.append(new ListViewItem(utils.format(itemTemplate, list[i]), self.className + '-item'));
                }
            }
        }

        ListView.prototype = new Control();
        ListView.prototype.getNodeIndex = function (node) {
            var index = 0;
            while ((node = node.previousSibling)) {
                if (node.nodeType !== 3 || !/^\s*$/.test(node.data)) {
                    index++;
                }
            }
            return index;
        };
        ListView.prototype.onItemAdded = function (e) {
            var self = this, args, item;
            args = e.args;
            item = new ListViewItem(utils.format(self.itemTemplate, args.item), self.className + '-item');
            item.draw();
            self.children.push(item);
            self.element.appendChild(item.element);
        };
        ListView.prototype.onItemRemoved = function (e) {
            var self = this, args, index, child;
            args = e.args;
            index = args.index;
            if (!isNaN(index)) {
                child = document.querySelector(utils.format('.{className}-item:nth-child({index})', {
                    className: self.className,
                    index: index + 1
                }));
                self.children.splice(index, 1);
                self.element.removeChild(child);
            }
        };
        ListView.prototype.onItemUpdated = function (e) {
            var self = this, args, index, item, child;
            args = e.args;
            index = args.index;
            if (!isNaN(index)) {
                child = document.querySelector(utils.format('.{className}-item:nth-child({index})', {
                    className: self.className,
                    index: index + 1
                }));
                item = new ListViewItem(utils.format(self.itemTemplate, args.item), self.className + '-item');
                item.draw();
                self.children[index] = item;
                self.element.replaceChild(item.element, child);
            }
        };

        /**
         * Menu
         * @param list
         * @param itemTemplate
         * @constructor
         */
        function Menu(list, itemTemplate) {
            var self = this;
            self.selectedIndex = 0;
            ListView.call(self, list, itemTemplate, CLASS_NAME.MENU);
        }

        Menu.prototype = new ListView();
        Menu.prototype.draw = function () {
            var self = this, child, children;
            ListView.prototype.draw.call(self);
            children = self.element.querySelectorAll('.' + self.className + '-item');
            for (var i = 0, l = children.length; i < l; i++) {
                child = children[i];
                self.addClickEvent(child);
            }
            children[0].classList.add(CLASS_NAME.SELECTED);
        };
        Menu.prototype.addClickEvent = function (child) {
            var self = this;
            child.addEventListener('click', function () {
                var index, c = child;
                (function click() {
                    index = self.getNodeIndex(c);
                    self.select(index);
                    self.dispatchEvent(new events.MenuItemSelected(self, {
                        index: index,
                        item: self.children[index]
                    }));
                })();
            });
        };
        Menu.prototype.select = function (index, prevent) {
            var self = this, selected;
            selected = self.element.querySelector('.' + CLASS_NAME.SELECTED);
            if (selected) {
                selected.classList.remove(CLASS_NAME.SELECTED);
            }
            self.children[index].element.classList.add(CLASS_NAME.SELECTED);
            self.selectedIndex = index;
            if (!prevent) {
                self.children[index].element.click();
            }
        };

        /**
         * ContextMenu
         * @constructor
         */
        function ContextMenu() {

        }

        ContextMenu.prototype = new Menu();

        function Navigation(prev, next) {
            var self = this, prevItem, nextItem;
            prevItem = new Item(prev);
            nextItem = new Item(next);
            prevItem.addClass('prev');
            nextItem.addClass('next');
            self.append(prevItem);
            self.append(nextItem);
            self.addClass('navigation');
        }

        Navigation.prototype = new Control();

        /**
         * Pagination
         * @constructor
         */
        function Pagination(list, itemTemplate) {
            var self = this;
            ListView.call(self, list, itemTemplate, CLASS_NAME.PAGINATION);
        }

        Pagination.prototype = new Menu();
        Pagination.prototype.draw = function () {
            var self = this;
            Menu.prototype.draw.call(self);
        };

        /**
         * Carousel
         * @param list
         * @param itemTemplate
         * @param options
         * @constructor
         */
        function Carousel(list, itemTemplate, options) {
            var self = this, settings;
            settings = {
                visibleItems: 3,
                speed: ANIMATION_DURATION,
                delay: 5000,
                pagination: true
            };
            utils.mixin(settings, options || {});
            self.settings = settings;
            ListView.call(self, list, itemTemplate, CLASS_NAME.CAROUSEL);
            self.wrapper = new controls.Box();
            self.wrapper.addClass('carousel-wrapper');
            self.currentIndex = 0;
            win.addEventListener('WindowResizeEnd', function (e) {
                self.onWindowResizeEnd(e);
            });
        }

        Carousel.prototype = new ListView();
        Carousel.prototype.draw = function () {
            var self = this, wrapper, firstChild, child, children, visibleItems, childWidth;
            wrapper = self.wrapper;
            children = self.children;
            visibleItems = self.settings.visibleItems;
            childWidth = 100 / visibleItems;
            for (var i = 0; i < visibleItems; i++) {
                child = children[i];
                child.draw();
                child.element.style.width = childWidth + '%';
                wrapper.element.appendChild(child.element);
            }
            self.element.appendChild(wrapper.element);
            setTimeout(function () {
                firstChild = children[0];
                childWidth = firstChild.element.clientWidth;
                wrapper.element.style.width = (childWidth * children.length) + 'px';
                for (var i = 0, l = children.length; i < l; i++) {
                    child = children[i];
                    child.element.style.width = childWidth + 'px';
                    if (i >= visibleItems) {
                        child.draw();
                        wrapper.element.appendChild(child.element);
                    }
                }
                if (self.settings.pagination) {
                    self.createPagination();
                }
            }, 0);
            self.start();
        };
        Carousel.prototype.createPagination = function () {
            var self = this, children, visibleItems, slides, pagination, data;
            visibleItems = self.settings.visibleItems;
            children = self.children;
            slides = Math.ceil(children.length / visibleItems);
            data = [];
            for (var i = 0; i < slides; i++) {
                data.push({
                    index: i
                });
            }
            pagination = new controls.Pagination(new collections.List(data), '<div><span></span></div>');
            pagination.addEventListener('MenuItemSelected', function (e) {
                var args = e.args;
                self.slide(args.index);
            });
            pagination.draw();
            self.element.appendChild(pagination.element);
            self.pagination = pagination;
        };
        Carousel.prototype.slide = function (slideIndex) {
            var self = this, wrapper = self.wrapper;
            self.restart();
            wrapper.moveTo(self.getNewPosition(slideIndex), 0, self.settings.speed, function () {
                if (self.pagination) {
                    self.pagination.select(self.getCurrentSlideIndex(), true);
                }
                setTimeout(function () {
                    if (self.delayedTask) {
                        self.delayedTask();
                        self.delayedTask = null;
                    }
                }, 0);
            });
        };
        Carousel.prototype.prev = function () {
            var self = this;
            this.slide(self.getCurrentSlideIndex() - 1);
        };
        Carousel.prototype.next = function () {
            var self = this;
            this.slide(self.getCurrentSlideIndex() + 1);
        };
        Carousel.prototype.getCurrentSlideIndex = function () {
            var self = this;
            return Math.ceil(self.currentIndex / self.settings.visibleItems);
        };
        Carousel.prototype.getNewPosition = function (slideIndex) {
            var self = this, children, visibleItems, currentIndex, maxIndex, newPosition, itemWidth;
            children = self.children;
            visibleItems = self.settings.visibleItems;
            maxIndex = children.length - visibleItems;
            if (slideIndex < 0) {
                currentIndex = maxIndex;
            } else {
                currentIndex = slideIndex * visibleItems;
                currentIndex = Math.min(currentIndex > children.length ? 0 : currentIndex, maxIndex);
            }
            itemWidth = children[0].element.clientWidth;
            newPosition = (-itemWidth) * currentIndex;
            self.currentIndex = currentIndex;
            return newPosition;
        };
        Carousel.prototype.start = function () {
            var self = this;
            self.slideTimer = setInterval(function () {
                self.next();
            }, self.settings.delay);
        };
        Carousel.prototype.stop = function () {
            clearInterval(this.slideTimer);
        };
        Carousel.prototype.restart = function () {
            var self = this;
            self.stop();
            self.start();
        };
        //Carousel.prototype.onWindowResizing = function() {
        //    console.log('WindowResizing: ' + new Date());
        //};
        Carousel.prototype.onWindowResizeEnd = function () {
            var self = this, child, children, visibleItems, wrapper, width, childWidth;
            children = self.children;
            wrapper = self.wrapper;
            if (wrapper.transitioning) {
                self.delayedTask = self.onWindowResizeEnd;
            } else {
                visibleItems = self.settings.visibleItems;
                width = self.element.clientWidth;
                childWidth = width / visibleItems;
                wrapper.element.style.width = (childWidth * children.length) + 'px';
                for (var i = 0, l = children.length; i < l; i++) {
                    child = children[i];
                    child.element.style.width = childWidth + 'px';
                }
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
                self.children.push(child);
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

        /**
         * Dialog = self.wrapper
         * @constructor
         */
        function Dialog() {

        }

        Dialog.prototype = new Layer();

        /**
         * Page
         * @type {Control}
         */
        function Page() {
            var self = this;
            Control.call(self, CLASS_NAME.PAGE);
        }

        Page.prototype = new Control();
        Page.prototype.draw = function () {
            var self = this, body;
            body = document.body;
            body.className = 'any';
            body.addEventListener('keydown', self.onKeyDown);
            Control.prototype.draw.call(self);
            body.appendChild(self.element);
        };
        Page.prototype.removeTopLayer = function () {
            var self = this, topLayer, children = self.children;
            if (children.length > 0) {
                topLayer = children.splice(children.length - 1, 1);
                self.element.removeChild(topLayer.element);
                return true;
            }
            return false;
        };
        Page.prototype.onKeyDown = function (e) {
            var self = this, keyCode = e.keyCode || e.which;
            if (keyCode === 8 /* BACKSPACE */) {
                if (self.removeTopLayer()) {
                    if (e.stopPropagation) {
                        e.stopPropagation();
                    }
                    if (!e.cancelBubble) {
                        e.cancelBubble = true;
                    }
                    if (e.preventDefault) {
                        e.preventDefault();
                    }
                }
            }
        };

        function Window() {
            var self = this;
            window.addEventListener('resize', function () {
                clearTimeout(window.resizeEnd);
                window.resizeEnd = setTimeout(function () {
                    self.dispatchEvent(new events.WindowResizeEnd(self));
                }, 200);
                self.dispatchEvent(new events.WindowResizing(self));
            }, false);
        }

        Window.prototype = new Control();

        return {
            Item: Item,
            Box: Box,
            ListView: ListView,
            Menu: Menu,
            Carousel: Carousel,
            ContextMenu: ContextMenu,
            Pagination: Pagination,
            Navigation: Navigation,
            Layer: Layer,
            Dialog: Dialog,
            Page: Page,
            Window: Window
        };
    })();

    win = new controls.Window();

    return {
        utils: utils,
        events: events,
        collections: collections,
        controls: controls
    };
})(any);
