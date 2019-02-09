/*
 * 获得发送窗口
 */
var appElement = document.querySelector('[ng-controller=chatSenderController]');
var $scope = angular.element(appElement).scope();

/*
 * 处理报寝信息
 */
var defaultBedMessage = "150342A晚查寝\n" +
    "男生：应到18人，实到18人\n" +
    "女生：应到22人。实到22人\n" +
    "共计：应到40人，实到40人";  //默认报寝信息（全到）
$scope.editAreaCtn = defaultBedMessage;  //将报寝信息填写到发送框

/*
 * 处理日期与时间
 * 发送时间在每天22:(31-34):(0-59)之间随机选择
 */
var now = new Date();

// 在一定范围内选择一个随机数
function selectFrom(lowerValue, upperValue) {
  var choices = upperValue - lowerValue + 1;
  return Math.floor(Math.random() * choices + lowerValue);
}

var selectedMin = selectFrom(31, 34);
var selectedSec = selectFrom(0, 59);
var triggerTime = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
    22, selectedMin, selectedSec));

/*
 * 采用超时调用在指定时间发送
 */
var timeouID = setTimeout(function () {
  $scope.sendTextMessage();
}, triggerTime - now);

/*
 * 最后确认
 */
if (!confirm('今天的发送时间：\n22:' + selectedMin.toString() + ':' + selectedSec.toString() + '\n'
    + '今天的发送内容：\n' + bedMessage)) {
  clearTimeout(timeouID);
  alert('已取消发送任务！请重新运行脚本！');
}
