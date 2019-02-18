# AutoReportBed

网页端微信自动报寝脚本，在设定的时刻向选定联系人发送消息。

This is a script running at WeChat-web which aims at sending bed-checking message at a certain time.

## 功能

+ 定时发送控件，在22:31-34:00-59范围内随机选择一个时刻，可根据需要进行修改。
+ 消息输入框自动填入默认报寝信息，在定时发送之前可以修改。
+ 点击确认按钮挂载定时发送任务，显示发送倒计时。
+ 点击取消按钮可卸载定时发送任务。
+ 对时间的输入进行了字符串过滤，只允许输入1到2位数字字符。

## 使用方法

1. 登录网页端微信。
2. 点击选择待发送联系人。
3. 在浏览器中打开js控制台。

![运行效果](https://github.com/RSencoder/AutoReportBed/blob/master/%E8%BF%90%E8%A1%8C%E7%BB%93%E6%9E%9C1.png)

4. 复制粘贴脚本，回车运行。

## 注意事项

+ 如果定时发送时刻早于现在时刻，按下确认按钮就会立即发送。
+ 保持网页的持续活动。
+ 只在firefox下进行充分测试。
