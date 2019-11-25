
/**
* 毎朝投稿するもの
* @param  {SlackPostItem} slackitem 
* @return {object} slackapiの応答
*/
function postDailyMorningMessage(userid, today){
	var user = Users.findUserByUserId(userid)
	var channel = user.DMchannel
	//var Msg = randomGreeting('MoningGreeting') +'\n\n' 
	var message = Message.MorningMessage(today)
	var slack = new Slack()
	var postedslackitem =  slack.postMessage(channel, message)
	postedslackitem = new SlackItem(postedslackitem)
	console.log(JSON.stringify(postedslackitem))
	console.log('channel: '+channel + ' posted: '+ postedslackitem.ts)
	MessageBot.setTs( channel , postedslackitem.ts)
	console.log(JSON.stringify(postedslackitem))
}

/**
* 毎夕投稿するもの
* @param  {SlackPostItem} slackitem 
* @return {object} slackapiの応答
*/
function postDailyEveningMessage(userid, today){
	var user = Users.findUserByUserId(userid)
	var channel = user.DMchannel
	var userid = user.SlackUserId
	var dailyreport = DailyReports.findDailyReportByUserDate(userid, today)
	if(!dailyreport){
		//投稿していない場合
		var message = Message.NoPostEveningMessage(today)
	}else　if(dailyreport &&!dailyreport.work  && !dailyreport.consideration && !dailyreport.nextgoal){
		//日報のみ投稿されている場合
		var message = Message.NoPostEveningMessage(today)
	}else{
		//すでに日報が投稿されている場合
		var message = Message.PostedEveningMessage(today)
	}
	var ts = MessageBot.getTs(channel)
	var slack = new Slack()
	var postedslackitem =  slack.postMessage (channel, message)
	postedslackitem = new SlackItem(postedslackitem)
	slack.DeleteMessage(channel , ts)
	console.log(JSON.stringify(postedslackitem))
	console.log('channel: '+channel + ' posted: '+ postedslackitem.ts)
	MessageBot.setTs( channel , postedslackitem.ts)
	console.log(JSON.stringify(postedslackitem))
}
/**
* ダイアログで入力された内容で日報を登録する。
* @param  {SlackPostItem} slackitem 
* @param  {String} type 目標 or 日報
* @return {object} slackapiの応答
*/
function postDailyReportFromDailog(slackitem, type){
	var slack = new Slack()
	console.log('postDailyReport(): '+JSON.stringify(slackitem))
  
	//ユーザー情報確認
    var user = Users.findUserByUserId(slackitem.user)
    if(!user){
      throw new Error('invalid User : ' + user.SlackUserId)
	}
	//メッセージ作成判定
	if(type ==　'目標' ){
		console.log('判定：目標')
		var DMmsg = Message.GoalMessageForDM(slackitem)
		var DMmsg2 = Message.PostedGoalMessage(slackitem)
		var Channelmsg = Message.GoalMessageForChannel(slackitem, user)
	}
	if(type == '日報'){
		console.log('判定：日報')
		var DMmsg = Message.DailyReportMessageForDM(slackitem)
		var DMmsg2 = Message.PostedDailyReportMessage(slackitem)
		var Channelmsg = Message.DailyReportMessageForChannel(slackitem, user)
	}
	if(DMmsg && Channelmsg){
		new Error('postDailyReportFromDailog:定義されていない引数typeです。')
	}

	//投稿があるか確認
	var postedDailyReport = DailyReports.findDailyReportByUserDate(user.SlackUserId, slackitem.text.date)
	if(!postedDailyReport){
		//新規追加
		console.log('判定：新規')
		var PostedSlackDailyReportChannnel = slack.postMessage(KEYS.DailyReportChannelId, Channelmsg)
		var PostedSlackDM = slack.postMessage(user.DMchannel, DMmsg)
	}else{
		//更新
		console.log('判定：更新')
		var PostedSlackDailyReportChannnel = slack.updateMessage(KEYS.DailyReportChannelId, postedDailyReport.postts, Channelmsg)
		var PostedSlackDM = slack.updateMessage(user.DMchannel, postedDailyReport.ts, DMmsg)
	}


    //投稿できたか確認
    if (PostedSlackDailyReportChannnel.ok != true) {
        throw new Error('slackの日報チャンネルへの投稿に失敗しました。')
    }
    if (PostedSlackDM.ok != true) {
        throw new Error('slackの' + user.Name + 'へのDMの投稿に失敗しました。')
    }
    var PostedSlackDailyReportChannnelItem = new SlackItem(PostedSlackDailyReportChannnel)
    var PostedSlackDMItem = new SlackItem(PostedSlackDM)
	console.log('PostedSlackDMItem:' + JSON.stringify(PostedSlackDMItem))
	

    //sheetに投稿

    DailyReports.setDailyReport(slackitem, PostedSlackDMItem, PostedSlackDailyReportChannnelItem, postedDailyReport)
    var ts = MessageBot.getTs(user.DMchannel)
	
	//朝投稿したものを削除して新たに投稿する
	if(!postedDailyReport){
		console.log('deletetarget ts: '+ts +'channel: '+user.DMchannel)
		slack.DeleteMessage(user.DMchannel , ts)
		var posted = slack.postMessage(user.DMchannel, DMmsg2)
		if (posted.ok != true) {
			throw new Error('slackの' + user.Name + 'へのDMの投稿に失敗しました。')
		}
		var posteditem = new SlackItem(posted)
		MessageBot.setTs(user.DMchannel, posteditem.ts)
	}
    return
}


function totalWeeklyRanking(){
	WeekJp = ['(日)','(月)','(火)','(水)','(木)','(金)','(土)']
	//今日から7日前までの日報の情報を日付ごとに取得
	var today = Moment.moment().format('YYYY/MM/DD')
	//var today = '2019/06/23'
	var days = []
	for(var i = 6, m = 0; i >= m; i--){
		var day = Moment.moment(today,'YYYY/MM/DD').subtract(i,'day')
		
		// if( 0 < day.day() && day.day() <6){
		// 	days.push(day.format('YYYY/MM/DD'))
		// } 
		days.push(day.format('YYYY/MM/DD'))
	}



	var WeeklyDailyReports = []
	//日毎に反応の多い日報を抽出
	days.forEach(function(day){
		var users = []
		Users.getAllUsers().forEach(function(user){
			var dailyreport = DailyReports.findDailyReportsByUserDay(user.SlackUserId, day)
			var stamps = {}

			//スタンプが押されている場合
			if( dailyreport.length > 0 && dailyreport[0].stamp.length > 0){
				var stampforuser = {}
				dailyreport[0].stamp.forEach(function(stamp){
					//押されたスタンプを集計
					if(!stamps[stamp.stamp]){
						stamps[stamp.stamp] = 1
					}else{
						stamps[stamp.stamp] += 1
					}
				})
			users.push({name:user.Name, value:stamps})
			}
		})
		WeeklyDailyReports.push({date: day + WeekJp[Moment.moment(day, 'YYYY/MM/DD').day()], value: users})
	})


	console.log(JSON.stringify(WeeklyDailyReports))
	console.log(JSON.stringify(days))
	var message = Message.totalWeeklyRankingMessageForChannel(WeeklyDailyReports)
	var slack = new Slack()
	console.log(slack.postMessage(KEYS.DailyReportChannelId, message))
}

function joinNewMenber(){
	Users.getAllUsersBySlack()
}