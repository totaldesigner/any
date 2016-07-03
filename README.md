# AnyJS

The easiest responsive front-end framework for web development

## Inatall 
``` shell
git clone https://github.com/totaldesigner/any
npm install
bower install
or
bower install anyjs
```

## Usage
``` shell
gulp build
```
``` html
<link rel="stylesheet" href="any.css"/>
<script src="any.js"></script>
```
``` script
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
}]);
carousel = new controls.Carousel(list, '<div><a>{key}</a></div>');
box.append(carousel);
layer.append(box);
page.append(layer);
page.draw();
```

## Tagging
* Updating and maintenance
``` shell
git tag -a v0.0.1 -m "Release version 0.0.1"
git push origin master --tags
```
* Deleting a tag
``` shell
git tag -d v0.0.1
git push origin :refs/tags/v0.0.1
```
* Cleaning and installation
``` shell
rm -rf bower_components
bower cache clean
bower install
```

## Contributing
Pull requests for new features, bug fixes, and suggestions are welcome!

## License
See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).
