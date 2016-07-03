window.addEventListener('load', function() {
    var controls, collections, page, layer, box, carousel, list;
    controls = any.controls;
    collections = any.collections;
    page = new controls.Page();
    layer = new controls.Layer();
    box = new controls.Box();
    list = new collections.List([{
        key: 1
    }, {
        key: 2
    }, {
        key: 3
    }, {
        key: 4
    }, {
        key: 5
    }, {
        key: 6
    }, {
        key: 7
    }, {
        key: 8
    }, {
        key: 9
    }, {
        key: 10
    }]);
    carousel = new controls.Carousel(list, '<div><a>{key}</a></div>');
    box.append(carousel);
    layer.append(box);
    page.append(layer);
    page.draw();
}, false);
