/** **********************Angular*************************** */
// Angular相关配置
var app = angular.module('app', ['ui.router','ngSanitize']);
app.run(['$rootScope', '$transitions', '$state', function ($rootScope, $transitions, $state) {
    $transitions.onStart({}, function (trans) {
        var toStateName = trans.to().name;
        $rootScope.module = toStateName;
        switch(toStateName){
        case 'home':
        	$rootScope.moduleName="首页";
        	break;
        case 'posts':
        	$rootScope.moduleName="详情";
        	break;
        case 'categorys':
        	$rootScope.moduleName="分类";
        	break;
        case 'archives':
        	$rootScope.moduleName="归档";
        	break;
        case 'tags':
        	$rootScope.moduleName="标签";
        	break;
        case 'subject':
        	$rootScope.moduleName="专题";
        	break;
        case 'about':
        	$rootScope.moduleName="关于";
        	break;
        case 'search':
        	$rootScope.moduleName="搜索";
        	break;
        
        	default:
        	$rootScope.moduleName=null;
        }
        $rootScope.moduleName=$rootScope.moduleName+' | 原子蛋の博客';
        // 离开搜索页面，清空
        if(toStateName!='search'){
        	$('#search').val("");
        }
    })
}]);
// 定义一个 Service ，把它作为 Interceptors 的处理函数
app.factory('HttpInterceptor', ['$q', HttpInterceptor]);
function HttpInterceptor($q) {
  return {
    request: function(config){
      return config;
    },
    requestError: function(err){
      return $q.reject(err);
    },
    response: function(res){
      return res;
    },
    responseError: function(err){
      if(-1 === err.status) {
        // 远程服务器无响应
      } else if(500 === err.status) {
        // 处理各类自定义错误
      } else if(501 === err.status) {
        // ...
      }
      console.log(err);
      return $q.reject(err);
    }
  };
}
// 路由配置
app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider','$locationProvider', function ($stateProvider, $urlRouterProvider, $httpProvider,$locationProvider) {
	
	$urlRouterProvider.otherwise('/');
    $stateProvider.state('home', {
        // 首页
        url: '/',
        templateUrl: 'app/home/home.html'
    }).state('posts', {
        // 博客详情
        url: '/posts/:id',
        templateUrl: 'app/posts/posts.html'
    }).state('markdown', {
        // 博客markdown文本
        url: '/markdown/:id',
        templateUrl: 'app/markdown/markdown.html'
    }).state('categorys', {
        // 博客分类
        url: '/categorys/',
        params:{id:null,name:null},
        templateUrl: 'app/categorys/categorys.html'
    }).state('archives', {
        // 博客归档
        url: '/archives/',
        params:{id:null,name:null},
        templateUrl: 'app/archives/archives.html'
    }).state('tags', {
        // 博客标签
        url: '/tags/',
        params:{id:null,name:null},
        templateUrl: 'app/tags/tags.html'
    }).state('subject', {
        // 专题
        url: '/subject',
        templateUrl: 'app/subject/subject.html'
    }).state('about', {
        // 关于
        url: '/about',
        templateUrl: 'app/about/about.html'
    }).state('search', {
        // 全文搜索
        url: '/search/',
        params:{searchText:null},
        templateUrl: 'app/search/search.html'
    });
    $locationProvider.html5Mode(true); 
    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");
    $httpProvider.defaults.headers.post[header] = token;
    
    $httpProvider.interceptors.push(HttpInterceptor);

}]);
// app控制器
app.controller('appController', ['$scope', '$state', function ($scope, $state) {

	// 全文搜索
	$scope.search=function(){
	// 跳转到搜索页面
		$state.go('search',{searchText:$scope.searchText});
	}
}]);
// 公共过滤器
app.filter('unsafe', ['$sce',function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    }; }]);
/** **********************jquery全局函数*************************** */
// 静态方法
$.extend({
    // 获取浏览器信息
    getBrowserInfo: function () {
        var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var re = /(msie|firefox|chrome|opera|version).*?([\d.]+)/;
        var m = ua.match(re);
        Sys.browser = m[1].replace(/version/, "safari");
        Sys.ver = m[2];
        return Sys;
    }
});
// 成员函数
$.fn.extend({
    initDoc: function (selector) {
        // 找到最高一级的目录
        var hLevel = 1;
        for (; hLevel <= 6; hLevel++) {
            var list = $(selector + ' h' + hLevel);
            if (list.length > 0)
                break;
        }
        if (hLevel > 6)
            return;

        var firstList = $(selector + ' h' + hLevel);
        $(this).html(generateContent(firstList, hLevel, ''));
        
        // 滚动定位
        $('.doc-nav a').on('click', function () {
            var target = $(this).attr("href");
            window.scrollTo(0, $(target).offset().top-60);
            return false;
        });
    },
    tipsBox: function (options) {
		options = $.extend({
			obj: null,  // jq对象，要在那个html标签上显示
			str: "+1",  // 字符串，要显示的内容;也可以传一段html，如: "<b
						// style='font-family:Microsoft YaHei;'>+1</b>"
			startSize: "12px",  // 动画开始的文字大小
			endSize: "30px",    // 动画结束的文字大小
			interval: 600,  // 动画时间间隔
			color: "red",    // 文字颜色
			callback: function () { }    // 回调函数
		}, options);
		$("body").append("<span class='num'>" + options.str + "</span>");
		var box = $(".num");
		var left = options.obj.offset().left + options.obj.width() / 2;
		var top = options.obj.offset().top - options.obj.height();
		box.css({
			"position": "absolute",
			"left": left + "px",
			"top": top + "px",
			"z-index": 9999,
			"font-size": options.startSize,
			"line-height": options.endSize,
			"color": options.color
		});
		box.animate({
			"font-size": options.endSize,
			"opacity": "0",
			"top": top - parseInt(options.endSize) + "px"
		}, options.interval, function () {
			box.remove();
			options.callback();
		});
	}
});
// 递归生成目录
function generateContent(list, level, prefix) {
    var content_ul = '';
    var weight = prefix.length;
    if (list != null && list.length > 0) {
        content_ul += '<nav class="nav nav-pills flex-column">';
        for (var i = 0; i < list.length; i++) {
            var newPrefix = prefix + (i + 1) + '.';
            var text = newPrefix + $(list[i]).text();
            var href = $(list[i]).attr('id');
            content_ul += '<a class="nav-link my-1" style="padding-left:' 
            	+ (5 + weight * 6) + 'px;font-weight:'+(500-weight*50)+';" href="#' + href + '">' + text + '</a>'
            var subList = $(list[i]).nextUntil('h' + level, 'h' + (level + 1));
            content_ul += generateContent(subList, (level + 1), newPrefix);
            content_ul += '';
        }
        content_ul += '</nav >';
    }
    return content_ul;
}
/** **********************启动初始化*************************** */
$(() => {
	// 初始化WOW动画
    new WOW().init();
    // 返回顶部开始
	$('.to-top').toTop();
})
