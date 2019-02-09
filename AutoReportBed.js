/*
 * 获得发送窗口，显示脚本状态信息
 */
var appElement = document.querySelector('[ng-controller=chatSenderController]');
var $scope = angular.element(appElement).scope();

//在发送按钮所在div里显示脚本状态信息
var newaction = document.querySelector(".action");
if (document.querySelector(".bed-sending-status") == null) {  //检测是否已经有状态span，没有就新建
  var statusSpan = document.createElement("span");
  statusSpan.className = 'bed-sending-status desc';  //加上类名desc是为了蹭css样式
  var statusBed = document.createTextNode("等待确认报寝信息");
  statusSpan.appendChild(statusBed);
  newaction.insertBefore(statusSpan, newaction.firstChild);  //将显示状态的span标签插入按钮div最前面
}

/*
 * 处理报寝信息
 */
var bedMessage = "150342A晚查寝\n" +
    "男生：应到18人，实到18人\n" +
    "女生：应到22人。实到22人\n" +
    "共计：应到40人，实到40人";  //默认报寝信息（全到）
$scope.editAreaCtn = bedMessage;  //将报寝信息填写到发送框

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
  statusBed.appendData('已发送！');
}, triggerTime - now);

/*
 * 最后确认
 */
if (confirm('今天的发送时间：\n22:' + selectedMin.toString() + ':' + selectedSec.toString() + '\n'
    + '今天的发送内容：\n' + bedMessage)) {
  statusBed.nodeValue = '发送时间：22:' + selectedMin.toString() + ':' + selectedSec.toString() + '超时调用ID：' + timeouID.toString();
} else {
  clearTimeout(timeouID);
  alert('已取消发送任务！请重新运行脚本！');
  $scope.editAreaCtn = '';
  statusBed.nodeValue = '发送任务被取消！';
}
