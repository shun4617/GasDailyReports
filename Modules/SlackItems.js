//slackからのJSONをいい感じに処理するやつ
var SlackItem = function (e) {
    console.log('e : '+ JSON.stringify(e))
    var items = this.init(e)
    return items
}

SlackItem.prototype.init = function (e){
    var result = {}
    //投稿結果
    if(e.ok){
        result.ok = ''+e.ok
        if(e.ts){
            result.ts = ''+e.ts 
        }
        if(e.channel){
            result.channel = ''+e.channel
        }
        if(e.members){
            result.users= e.members.concat()
        }
        if(e.channel){
            result.id = e.channel.id
        }
        return result
    }
    //コマンド
    if(e.parameters.command){
        result.type = 'コマンド'
        result.token = ''+ e.parameters.token[0]
        result.command = ''+e.parameters.command[0]
        result.triggerid = ''+e.parameters.trigger_id[0]
        result.user = ''+e.parameters.user_id[0]
        result.channel   = ''+e.parameters.channel_id[0]
        return result
    }
    if(e.parameters.command){
        result.type = 'コマンド'
        result.token = ''+ e.parameters.token[0]
        result.command = ''+e.parameters.command[0]
        result.triggerid = ''+e.parameters.trigger_id[0]
        result.user = ''+e.parameters.user_id[0]
        result.channel   = ''+e.parameters.channel_id[0]
        return result
    }

    //ダイアログ返し
    if(e.parameters.payload){
        var payload = JSON.parse(e.parameters.payload)
        
        if(payload.actions){
            //目標設定ボタン
            if(payload.actions[0].action_id =='openGoalDialog'){
                result.type = '目標ダイアログ'
                result.token = ''+ payload.token
                result.user = ''+payload.user.id
                result.channel   = ''+payload.channel.id
                result.triggerid = ''+payload.trigger_id
                result.targetDate = ''+payload.actions[0].value
                result.message = ''+payload.message
                return result
            }
            //日報設定ボタン
            if(payload.actions[0].action_id =='openDailyReportDialog'){
                result.type = '日報ダイアログ'
                result.token = ''+ payload.token
                result.user = ''+payload.user.id
                result.channel   = ''+payload.channel.id
                result.triggerid = ''+payload.trigger_id
                result.targetDate = ''+payload.actions[0].value
                result.message = ''+payload.message
                return result
            }
        }
        //目標設定用ダイアログ
        if(payload.callback_id && payload.callback_id == 'DailyReportGoal_dialog'){
            result.type = '目標作成'
            result.token = ''+payload.token
            result.user = ''+payload.user.id
            result.channel   = ''+payload.channel.id
            result.text = {}
            result.text.goal = ''+ payload.submission.Goal
            result.text.work = ''
            result.text.consideration = ''
            result.text.nextgoal = ''
            result.text.date = ''+payload.state
            result.message = payload.message || ''
            return result
        }
        if(payload.callback_id && payload.callback_id == 'DailyReport_dialog'){
            result.type = '日報作成'
            result.token = ''+payload.token
            result.user = ''+payload.user.id
            result.channel   = ''+payload.channel.id
            result.text = {}
            result.text.goal = ''+ payload.submission.Goal
            result.text.work = ''+ payload.submission.Work
            result.text.consideration = ''+ payload.submission.Consideration
            result.text.nextgoal = ''+ payload.submission.NextGoal
            result.text.date = ''+payload.state
            result.message = payload.message || ''
            return result
        }
        result.type = '日報新規投稿'
        result.token = ''+payload.token
        result.text = {}
        for(var key in payload.submission){
            result.text[key] = ''+payload.submission[key]
        }
        result.user = ''+payload.user.id
        result.channel   = ''+payload.channel.id
        return result
    }

    if(!e.postData.contents){
        throw new Error('e.postData.contentsがありません')
    }
    var postData = JSON.parse(e.postData.contents)
	if (postData.event.type === 'message') {

        //DM新規投稿
        
		if (!postData.event.subtype) {
            result.type = 'DM新規投稿'
            result.token = ''+postData.token
            result.text = ''+postData.event.text
            result.user = ''+postData.event.user
            result.ts   = ''+postData.event.ts
            result.eventts = ''+postData.event.event_ts
            result.eventid = ''+postData.event_id
            result.channel   = ''+postData.event.channel
            if(postData.event.bot_id){
                result.botid = postData.event.bot_id
            }
            return result
		}

		//DM編集
		if (postData.event.subtype === 'message_changed') {
            result.type = 'DM編集'
            result.token = ''+postData.token
            result.text = ''+postData.event.message.text
            result.user = ''+postData.event.message.user
            result.ts   = ''+postData.event.message.ts
            result.eventts = ''+postData.event.event_ts
            result.eventid = ''+postData.event_id
            result.channel    = ''+postData.event.channel
            result.terget      = {}
            result.terget.text = ''+postData.event.previous_message.text
            result.terget.user = ''+postData.event.previous_message.user
            result.terget.ts   = ''+postData.event.previous_message.ts
            if(postData.event.bot_id){
                result.botid = postData.event.bot_id
            }
            return result
		}
	}

	//スタンプ追加
	if (postData.event.type === 'reaction_added') {
        result.type = 'スタンプ追加'
        result.token = ''+postData.token
        result.user     = ''+postData.event.user
        result.reaction = ''+postData.event.reaction
        result.eventts = ''+postData.event.event_ts
        result.eventid = ''+postData.event_id
        result.target = {}
        result.target.channel = ''+postData.event.item.channel
        result.target.ts      = ''+postData.event.item.ts
        if(postData.event.bot_id){
            result.botid = postData.event.bot_id
        }
        return result

	}

	//スタンプ削除
	if (postData.event.type === 'reaction_removed') {
        result.type = 'スタンプ削除'
        result.token = ''+postData.token
        result.user     = ''+postData.event.user
        result.reaction = ''+postData.event.reaction
        result.eventts = ''+postData.event.event_ts
        result.eventid = ''+postData.event_id
        result.target = {}
        result.target.channel = ''+postData.event.item.channel
        result.target.ts      = ''+postData.event.item.ts
        if(postData.event.bot_id ){
            result.botid = postData.event.bot_id
        }
        return result
    }
    	//メンバー追加
	if (postData.event.type === 'team_join') {
        result.type = 'メンバー追加'
        result.user     = ''+postData.event.user
        return result
	}
}