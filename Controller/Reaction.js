function addReaction(slackitem){
	var User = Users.findUserByUserId(slackitem.user)
    if(!User){
	  //throw new Error('invalid User : ' + User)
	  return
	}
	var slack = new Slack()
	var targetDailyReport = DailyReports.getStanpsByPostts(slackitem.target.ts)
	console.log(JSON.stringify(targetDailyReport))
	//stampsに内容があるかどうか確認
	if(!targetDailyReport.stamp){
		var stamps = []
	}else{
		var stamps = JSON.parse(targetDailyReport.stamp)
	}
	var auth = Users.findUserByUserId(targetDailyReport.userid)
	stamps.push({stamp:slackitem.reaction, user:slackitem.user})
	console.log('stammpp:'+JSON.stringify(stamps))
	DailyReports.setStanpByRowNum(targetDailyReport.RowNum, stamps)
	slack.addReaction(auth.DMchannel, targetDailyReport.ts, slackitem.reaction)
	return
}



function deleteReaction(slackitem){
	var User = Users.findUserByUserId(slackitem.user)
    if(!User){
	  //throw new Error('invalid User : ' + User)
	  return
	}
	var slack = new Slack()
	var targetDailyReport = DailyReports.getStanpsByPostts(slackitem.target.ts)
	if(!stamps){
		var stamps = []
	}else{
		var stamps = JSON.parse(targetDailyReport.stamps)
	}
	var auth = Users.findUserByUserId(targetDailyReport.userid)
	if(stamps.length > 0){
		stamps = stamps.filter(function(item){
			return !(item.stamp == slackitem.reaction && item.user == slackitem.user)
		})
		console.log('stamps:'+JSON.stringify(stamps))
		if(stamps.length == 0){
			DailyReports.setStanpByRowNum(targetDailyReport.RowNum, '')
			deleteStanpToDM(targetDailyReport.channelid, slackitem.reaction, targetDailyReport.ts)
			return
		}
	DailyReports.setStanpByRowNum(targetDailyReport.RowNum, stamps)
	slack.removeReaction(auth.DMchannel, targetDailyReport.ts, slackitem.reaction)
	return
	}
}