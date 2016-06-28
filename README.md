# AnyJS

반응형 웹 사이트를 쉽게 제작하기 위한 솔루션

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
1. Registering your package with Bower
``` shell
bower register anyjs https://github.com/totaldesigner/totaldesigner.git  
```
2. Updating and maintenance
``` shell
git tag -a v0.0.1 -m "Release version 0.0.1"
git push origin master --tags
```
3. Deleting a tag
``` shell
git tag -d v0.0.1
git push origin master --tags
git push origin :refs/tags/v0.0.1
```
4. Cleaning and installation
``` shell
rm -rf bower_components
bower cache clean
bower install
```

## Contributing
Pull requests for new features, bug fixes, and suggestions are welcome!

## License
See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).
