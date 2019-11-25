/**
* 目標入力用ダイアログを送信する
* @param  {SlackPostItem} slackitem 
* @return {object} slackapiの応答
*/
function postGoalDailog(slackitem){
	console.log('postDailyReportDaialog')
	slackitem.userinfo = Users.findUserByUserId(slackitem.user)
	if(!slackitem.userinfo){
		throw new Error('invalid User : ' + slackitem.userinfo.SlackUserId)
	}
	if(slackitem.userinfo.DMchannel != slackitem.channel){
		Users.changeUserDMchannel(slackitem.userinfo.SlackUserId, slackitem.channel)
	}
	var dailyreport = DailyReports.findDailyReportByUserDate(slackitem.userinfo.SlackUserId, slackitem.targetDate)
	var slack = new Slack()
	var dialog = Message.GoalDialog(slackitem, dailyreport)
	var respons = slack.postDialog(slackitem.channel, slackitem.triggerid ,dialog)
	console.log(respons)
	if(slackitem.message.ts && slackitem.message.channel){
		daleteSlackMessageToDM(slackitem.message.channel, slackitem.message.ts)
	}
	return
}



/**
* 目標入力用ダイアログを送信する
* @param  {SlackPostItem} slackitem 
* @return {object} slackapiの応答
*/
function postDailyReportDailog(slackitem){
	console.log('postDailyReportDaialog')
	slackitem.userinfo = Users.findUserByUserId(slackitem.user)
	if(!slackitem.userinfo){
		throw new Error('invalid User : ' + slackitem.userinfo.SlackUserId)
	}
	if(slackitem.userinfo.DMchannel != slackitem.channel){
		Users.changeUserDMchannel(slackitem.userinfo.SlackUserId, slackitem.channel)
	}
	var dailyreport = DailyReports.findDailyReportByUserDate(slackitem.userinfo.SlackUserId, slackitem.targetDate)
	var slack = new Slack()
	var dialog = Message.DailyReportDialog(slackitem, dailyreport)
	var respons = slack.postDialog(slackitem.channel, slackitem.triggerid ,dialog)
	console.log(respons)
	if(slackitem.message.ts && slackitem.message.channel){
		daleteSlackMessageToDM(slackitem.message.channel, slackitem.message.ts)
	}
	return
}