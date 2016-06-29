/**
 * Created by mspark on 16. 6. 26.
 */
/*jshint browser:true */
/*globals any:false */

if (typeof any === 'undefined') {
  throw new Error('any.ui\'s JavaScript requires any');
}

(function () {
  var Page, Layer, Menu, List, Box, Item, ListView,
    page, layer, menu, list, header, photo, pickup, info, footer,
    headerInner, footerInner, headerLogo, headerMenu, img, copyright,
    pickup1, pickup2, pickup3, news, infoMain, infoSub, listMain, listSub, listViewMain, listViewSub;

  Page = any.controls.Page;
  Layer = any.controls.Layer;
  Menu = any.ui.Menu;
  List = any.collections.List;
  Box = any.controls.Box;
  Item = any.controls.Item;
  ListView = any.controls.ListView;

  list = new List([{
    name: '메인'
  }, {
    name: '연혁'
  }, {
    name: '사업 소개'
  }, {
    name: '채용 정보'
  }, {
    name: '문의'
  }]);

  page = new Page();
  layer = new Layer();
  menu = new Menu(list, '<a>{name}</a>');

  // header
  headerLogo = new Box(new Item('<div><h1>아버지는 어떻게 살아야 하는가?</h1></div>'));
  headerMenu = new Box(menu);
  headerInner = new Box();
  headerInner.addClass('header-inner horizontal');
  headerInner.append(headerLogo);
  headerInner.append(headerMenu);
  header = new Box();
  header.addClass('header');
  header.append(headerInner);
  layer.append(header);

  // photo
  photo = new Box(new Item('<div><img src="header.jpg"/></div>'));
  photo.addClass('photo');
  layer.append(photo);

  // pickup
  pickup1 = new Box();
  pickup2 = new Box();
  pickup3 = new Box();
  pickup = new Box();
  pickup.addClass('pickup horizontal');
  pickup.append(pickup1);
  pickup.append(pickup2);
  pickup.append(pickup3);
  layer.append(pickup);

  // info
  listMain = new List([{
    time: '10/15', content: '데이터센터 유지 보수를 수행합니다.'
  }, {
    time: '10/05', content: '안드로이드 애플리케이션 버전 1.2를 출시했습니다.'
  }, {
    time: '09/22', content: '세미나/캠페인과 관련된 공지사항'
  }, {
    time: '09/15', content: '그래프 표시의 변경 방식을 쉽게 바꿨습니다.'
  }]);
  listViewMain = new ListView(listMain, '<a><time>{time}</time><div>{comtent}</div></a>');
  listSub = new List([{
    shortClass: 'tw', class: 'twitter', name: 'Twitter'
  }, {
    shortClass: 'fb', class: 'facebook', name: 'Facebook'
  }, {
    shortClass: 'gp', class: 'google-plus', name: 'Google+'
  }]);
  listViewSub = new ListView(listSub, '<a class="follow-{shortClass}"><i class="fa fa-fw fa-{class}"></i>{name}</a>');
  news = new Box(listViewMain);
  news.addClass('news');
  infoMain = new Box(news);
  infoMain.addClass('info-main');
  infoSub = new Box(listViewSub);
  infoSub.addClass('info-sub');
  info = new Box();
  info.addClass('info horizontal');
  info.append(infoMain);
  info.append(infoSub);
  layer.append(info);

  // footer
  footerInner = new Box(new Item('<div class="copyright"><p>Copyright© totaldesigner</p></div>'));
  footerInner.addClass('footer-inner');
  footer = new Box(footerInner);
  footer.addClass('footer');
  layer.append(footer);

  page.append(layer);
  page.draw();
})();
