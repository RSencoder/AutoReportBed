/*
 * 添加自动报寝控件
 */
var newAction = document.querySelector(".action");
if (document.querySelector(".bed-sending-status") == null) {
    var autoReportBedDiv = document.createElement("div");
    autoReportBedDiv.className = "bed-sending-control desc";
    newAction.insertBefore(autoReportBedDiv, newAction.firstChild);
    autoReportBedDiv.innerHTML = "时：<input type='text' id='hour' size='1'>" +
        "分：<input type='text' id='minute' size='1'>" +
        "秒：<input type='text' id='second' size='1'>" +
        "<input type='button' id='confirm' value='确认'>" +
        "<input type='button' id='cancel' value='取消'>" +
        "倒计时：" + "<span class='count-down'>未计划</span>";
    var sheet = document.styleSheets[0];
    sheet.insertRule(".bed-sending-control { float: left }", 0);
}

/*
 * 设置报寝信息默认值
 */
var wxPreInput = document.querySelector("#editArea");  //网页端微信消息输入框
wxPreInput.innerHTML = "150342A晚查寝：\n" +
    "男生：应到18人，实到18人\n" +
    "女生：应到22人，实到22人\n" +
    "共计：应到40人，实到40人";

/*
 * 在一定范围内选择一个随机数
 * 每天22:(31-34):(0-59)之间随机选择，填入自动报寝控件当作默认值
 */
function selectFrom(lowerValue, upperValue) {
    var choices = upperValue - lowerValue + 1;
    return Math.floor(Math.random() * choices + lowerValue);
}

var hourInput = document.querySelector("#hour");
var minuteInput = document.querySelector("#minute");
var secondInput = document.querySelector("#second");

hourInput.value = 22;
minuteInput.value = selectFrom(31, 34);
secondInput.value = selectFrom(0, 59);

/*
 * 取得网页端微信输入框文本
 * 注意发送前最后一刻才调用，放在超时调用函数里
 */
function getwxInput() {
    wxPreInput = document.querySelector("#editArea");  //网页端微信消息输入框
    wxPreInput.normalize();  //规范化文本节点，因为鼠标点击现有文本后会切割文本节点，需要使用normalize()方法合并为一个文本节点
    return wxPreInput.firstChild.nodeValue;
}

/*
 * 获得本地时区的当前时间
 */
function localTime() {
    let gmt = new Date();  //GMT时间，格林威治时间，0时区时间
    let offsetGMT = new Date().getTimezoneOffset();  //本地时间与格林威治时间的时差，单位为分钟
    return new Date(gmt - offsetGMT * 60 * 1000);
}

/*
 * 格式化倒计时显示
 */
function formatCountDown(ms) {
    let countDownTime = {
        hour : 0,
        minute : 0,
        second : 0
    };

    countDownTime.hour = Math.floor(ms / (60 * 60 * 1000));
    ms -= countDownTime.hour * 60 * 60 * 1000;
    countDownTime.minute = Math.floor(ms / (60 * 1000));
    ms -= countDownTime.minute * 60 * 1000;
    countDownTime.second = Math.floor(ms / 1000);

    return countDownTime.hour + "h" + countDownTime.minute + "m" + countDownTime.second + "s";
}

/*
 * 设置按钮点击时间监听程序
 */
var btnConfirm = document.querySelector("#confirm");
var btnCancel = document.querySelector("#cancel");

var timeoutID = 777;  //设置超时时间，以便未来取消超时调用
var intervalID = 666;  //间歇调用ID，以便未来取消间歇调用
var totalms = -1;  //从点击确认按钮到发送时刻的总毫秒数
var countDown = document.querySelector(".count-down");  //倒计时控件

var appElement = document.querySelector('[ng-controller=chatSenderController]');
var $scope = angular.element(appElement).scope();

var hasSchedued = false;  //是否已有定时发送计划标志

//确认按钮点击事件处理程序
var btnConfirmHandler = function () {
    //alert弹窗会导致更新倒计时控件的间歇调用停滞，导致定时发送出去的那一刻倒计时还没有跑完的bug
    //计算alert弹窗所占用的时间，totalms减去这部分时间，修复这个bug
    let beforeAlert;
    let afterAlert;

    if (hasSchedued) {
        beforeAlert = new Date();
        alert("已有定时发送计划！");
        afterAlert = new Date();
        totalms -= afterAlert - beforeAlert;
        return;
    }

    var now = localTime();
    var triggerTime = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
        hourInput.value, minuteInput.value, secondInput.value));

    //由于firefox现在还不支持textInput事件，无法过滤通过输入法输入的字符，所以点击按钮的时候再过滤一次
    if (!(regExpJudge(hourInput.value) && regExpJudge(minuteInput.value) && regExpJudge(secondInput.value))) {
        alert("非法输入！");
        return;
    }

    //超时调用，定时发送消息
    timeoutID = setTimeout(function () {
        var bedMessage = getwxInput();
        appElement = document.querySelector('[ng-controller=chatSenderController]');
        $scope = angular.element(appElement).scope();
        $scope.editAreaCtn = bedMessage;
        $scope.sendTextMessage();
        hasSchedued = false;
    }, triggerTime - now);

    totalms = triggerTime - now;
    //间歇调用，更新倒计时控件
    intervalID = setInterval(function () {
        if (totalms / 1000 > 1) {
            countDown.firstChild.nodeValue = formatCountDown(totalms);
        } else {
            countDown.firstChild.nodeValue = "时间到！";
            clearInterval(intervalID);
        }
        totalms -= 1000;
    }, 1000);

    hasSchedued = true;
};

//取消按钮点击事件处理程序
var btnCancelHandler = function () {
    if (!hasSchedued) {
        alert("没有可取消的定时发送计划！");
    }

    clearTimeout(timeoutID);
    clearInterval(intervalID);
    countDown.firstChild.nodeValue = "未计划";
    hasSchedued = false;
};

btnConfirm.addEventListener("click", btnConfirmHandler, false);
btnCancel.addEventListener("click", btnCancelHandler, false);

/*
 * 文本框输入过滤，通过设置按键事件监听程序实现
 */
function regExpJudge(content) {
    let pattern = /^[0-9]{1,2}$/;  //1到2位数字
    return pattern.test(content);
}

var inputFilterMethod = function (event) {
    let target = event.target;
    switch (target.id) {  //未来找个设计模式优化一下，策略模式？
        case "hour":
            if (!regExpJudge(hourInput.value + event.key)) {
                event.preventDefault();
            }
            break;
        case "minute":
            if (!regExpJudge(minuteInput.value + event.key)) {
                event.preventDefault();
            }
            break;
        case "second":
            if (!regExpJudge(secondInput.value + event.key)) {
                event.preventDefault();
            }
            break;
    }
};

//在名为bed-sending-control的div上设置事件委托
var bedSendingControl = document.querySelector(".bed-sending-control");
bedSendingControl.addEventListener("keypress", inputFilterMethod, false);
