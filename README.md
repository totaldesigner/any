# AnyJS

The easiest responsive front-end framework for web development

## Inatall 
``` shell
git clone https://github.com/totaldesigner/any
npm install
bower install
```

## Usage
``` shell
gulp build
```

## Bower
* Registering a package
``` shell
bower register anyjs https://github.com/totaldesigner/any.git  
```
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
