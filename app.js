/**
 * Created by Administrator on 2016/9/27.
 */

(function(){
    var doubanApp = angular.module("doubanApp",['ngRoute','doubanApp.DetailModule','doubanApp.ListModule','doubanApp.httpModule']);

    doubanApp.config(["$routeProvider",function($routeProvider){
        $routeProvider.
            otherwise({
                redirectTo: '/in_theaters'
            });
    }]);

    doubanApp.constant('appConstant',{
        ListUrl: "https://api.douban.com/v2/movie/",
        detailUrl: "https://api.douban.com/v2/movie/subject/",
        count: 5
    });

    //搜索指令
    doubanApp.directive('search',['$location','$route','$routeParams','$timeout','$rootScope',
        function($location,$route,$routeParams,$timeout,$rootScope){
        return {
            replace: true,
            template:'<form class="navbar-form navbar-right" ng-submit="search()">\
                            <input type="text" class="form-control" placeholder="Search..." ng-model="input">\
                         </form>',
            link: function($scope,ele,attr){
               $scope.search = function(){
                   var input = $scope.input;
                   $rootScope.input = input;
                   if(input.length=0 || typeof (input) == 'undefined') return;
                   if($routeParams.list){
                       $route.updateParams({list:"search",q:input});
                   }else{
                       $location.path('search');
                       $timeout(function(){
                           $route.updateParams({list:"search",q:input});
                       },0);
                   }
               }
            }
        }
    }])

    //按钮指令
    doubanApp.directive('page',[function(){
        return {
            replace:true,
            template:' <ul class="pagination ">\
                          <li ng-click="huddlePage(item)" ng-class="{active:current == item}" ng-repeat="item in pages" ><a >{{item}}</a></li>\
                       </ul>',
            link: function($scope,iEle,attr){
                $scope.$watch('pageConfig',function(n){
                    if(!n) return;
                    //一共有30页 页面上显示5个分页按钮 当前在第9页, 7,8,9,10,11
                    var total   = n.total;
                    var show    = n.show;
                    var current = n.current;

                    var region  = Math.floor(show /2);

                    //左右两边数字的个数
                    var begin   = current - region;
                    //开始值最小值为1
                    begin = Math.max(begin,1);
                    var end     =  begin + show - 1;
                    if(end > total){
                        end = total;
                        begin = total - show + 1;
                        begin = Math.max(begin,1);
                    }
                    var pages = [];
                    $scope.pages = pages;
                    $scope.current = current;

                    $scope.huddlePage = function(index){
                        n.click(index);
                    }
                    for(var i = begin; i <= end; i++){
                        pages.push(i);
                    }
                })

            }
        }
    }])
})()