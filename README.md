# seat-reservation-for-whu-library
武汉大学信息学部图书馆抢座后台

```sql
create database seatreservation CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
(使用指南草稿，还未完成，先写个指南摆着看)
使用抢座服务请发送邮件到 xxxxxx@sina.com 
（注意：邮件格式中的双引号一律不要删除修改）
注册账号邮件格式
主题：register
内容：
{
"username":"这里填学号",
"password":"这里填密码"
}
例如：
{
"username":"2019100000158",
"password":"123456"
}

选座邮件格式
主题：choose
内容：
{
"preferSeat":"[6028,6029,6030]",
"mon":"8 30 21 30",
"tue": "8 30 21 30",
"wed": "8 30 21 30",
"thu": "8 30 21 30",
"fri": "8 30 21 30",
"sat": "8 30 21 30",
"sun": "8 30 21 30",
"effectiveDate": "2017/11/3",
"expireDate": "2017/12/2"
}
解释："preferSeat":"[6028,6029,6030]" 中括号里面的是想选的座位，至少一个；mon——sun 是指每天想选座的时间段，上例指的是从8:30-21:30，如果某一天不想选座那就不用填，最后两个字段是指，有效期，从哪天开始到哪天结束

