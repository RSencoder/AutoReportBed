var appElement = document.querySelector('[ng-controller=chatSenderController]');
var $scope = angular.element(appElement).scope();
$scope.editAreaCtn = '我tm一定要搞出自动报寝脚本！！！';
var triggerTime = new Date(Date.parse("2019-02-07T22:22:45"));
var now = new Date();
setTimeout(function () {
  $scope.sendTextMessage();
}, triggerTime-now);