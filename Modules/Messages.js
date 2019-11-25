var Message = {
    /**
    * 個人向け朝用のメッセージを生成する
    * @param  {SlackPostItem} slackitem 
    * @return {object} メッセージ
    */
    MorningMessage: function (today) {
        return {
            text: today + "目標を設定しましょう。",
            blocks: JSON.stringify([
                {
                    "type": "section",
                    "text": {
                        "type": "plain_text",
                        "text": MessageBot.randomGreeting('MoningGreeting'),
                        "emoji": true
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "plain_text",
                        "text": today + "です。\n今日の目標を設定しましょう。",
                        "emoji": true
                    }
                },
                {
                    "type": "actions",
                    "elements": [
                        {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "目標を設定する",
                                "emoji": true
                            },
                            "action_id": "openGoalDialog",
                            "style": "primary",
                            "value": today
                        }
                    ]
                }
            ])
        }
    },

    /**
    * 個人向け夕方の日報を投稿していない用のメッセージを生成する
    * @param  {string} today 
    * @return {object} メッセージ
    */
    NoPostEveningMessage: function (today) {
        return {
            text: today + "の日報を書きましょう",
            blocks: JSON.stringify([
                {
                    "type": "section",
                    "text": {
                        "type": "plain_text",
                        "text": MessageBot.randomGreeting('Farewell'),
                        "emoji": true
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "plain_text",
                        "text": "今日の日報を書きましょう。",
                        "emoji": true
                    }
                },
                {
                    "type": "actions",
                    "elements": [
                        {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "emoji": true,
                                "text": "日報を書く"
                            },
                            "style": "primary",
                            "value": today,
                            "action_id": "openDailyReportDialog"
                        }
                    ]
                }
            ])
        }
    },
    /**
* 個人向け夕方の日報を投稿した用のメッセージを生成する
* @param  {string} today
* @return {object} メッセージ
*/
    PostedEveningMessage: function (today) {
        return {
            text: "今日もお疲れ様でした。",
            blocks: JSON.stringify([
                {
                    "type": "section",
                    "text": {
                        "type": "plain_text",
                        "text": MessageBot.randomGreeting('Farewell'),
                        "emoji": true
                    }
                },
                {
                    "type": "actions",
                    "elements": [
                        {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "emoji": true,
                                "text": "日報を変更する"
                            },
                            "style": "primary",
                            "value": today,
                            "action_id": "openDailyReportDialog"
                        }
                    ]
                }
            ])
        }
    },
    /**
    * 目標投票後のメッセージ
    * @param  {SlackPostItem} slackitem 
    * @return {object} メッセージ
    */
    PostedGoalMessage: function (slackitem) {
        return {
            text: slackitem.text.date + "の目標の投稿が完了しました。",
            blocks: JSON.stringify([
                {
                    "type": "actions",
                    "elements": [
                        {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "emoji": true,
                                "text": "日報を書く"
                            },
                            "style": "primary",
                            "value": slackitem.text.date,
                            "action_id": "openDailyReportDialog"
                        },
                        {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "emoji": true,
                                "text": "目標を変更する"
                            },
                            "value": slackitem.text.date,
                            "action_id": "openGoalDialog"
                        }
                    ]
                }
            ])
        }
    },
    /**
* 日報投稿後のメッセージ
* @param  {SlackPostItem} slackitem 
* @return {object} メッセージ
*/
    PostedDailyReportMessage: function (slackitem) {
        return {
            text: "今日の日報の投稿が完了しました。",
            blocks: JSON.stringify([
                {
                    "type": "actions",
                    "elements": [
                        {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "emoji": true,
                                "text": "日報を変更する"
                            },
                            "style": "primary",
                            "value": slackitem.text.date,
                            "action_id": "openDailyReportDialog"
                        }
                    ]
                }
            ])
        }
    },
    /**
    * 目標設定用ダイアログを生成
    * @param  {SlackPostItem} slackitem 
    * @return {object} メッセージ
    */
    GoalDialog: function (slackitem, dailyreport) {
        if (!dailyreport) {
            var dailyreport = {}
        }
        if (dailyreport.goal == 'undefined') { dailyreport.goal = '' }
        return JSON.stringify({
            'callback_id': 'DailyReportGoal_dialog',
            'title': slackitem.targetDate + 'の目標',
            'submit_label': '投稿する',
            'state': slackitem.targetDate,
            'elements': [
                {
                    'type': 'textarea',
                    'label': '今日の目標',
                    'name': 'Goal',
                    'value': dailyreport.goal
                }
            ]
        })
    },

    /**
    * 個人向け目標投稿後のメッセージを生成する
    * @param  {SlackPostItem} slackitem 
    * @return {object} メッセージ
    */
    GoalMessageForDM: function (slackitem) {
        return {
            blocks: JSON.stringify([
                {
                    "type": "divider"
                },
                {
                    "type": "section",
                    "fields": [
                        {
                            "type": "mrkdwn",
                            "text": slackitem.text.date
                        }
                    ]
                },

                {
                    "type": "context",
                    "elements": [
                        {
                            "type": "mrkdwn",
                            "text": "*今日の目標*"
                        },

                        {
                            "type": "mrkdwn",
                            "text": slackitem.text.goal
                        }
                    ]
                }
            ])
        }
    },

    /**
* チャンネル向け目標投稿後のメッセージを生成する
* @param  {SlackPostItem} slackitem 
* @return {object} メッセージ
*/
    GoalMessageForChannel: function (slackitem, user) {
        return {
            text: user.Name + "さんが" + slackitem.text.date + "目標を投稿しました。",
            blocks: JSON.stringify([
                {
                    "type": "divider"
                },
                {
                    "type": "section",
                    "fields": [
                        {
                            "type": "mrkdwn",
                            "text": slackitem.text.date
                        },
                        {
                            "type": "mrkdwn",
                            "text": user.Name
                        }
                    ]
                },

                {
                    "type": "context",
                    "elements": [
                        {
                            "type": "mrkdwn",
                            "text": "*今日の目標*"
                        },

                        {
                            "type": "mrkdwn",
                            "text": slackitem.text.goal
                        }
                    ]
                }
            ])
        }
    },

    /**
    * 日報設定用ダイアログを生成
    * @param  {SlackPostItem} slackitem 
    * @return {object} メッセージ
    */
    DailyReportDialog: function (slackitem, dailyreport) {
        if (!dailyreport) {
            console.log('ないっすね')
            var dailyreport = {}
        }
        console.log(JSON.stringify(dailyreport))
        return JSON.stringify({
            'callback_id': 'DailyReport_dialog',
            'title': slackitem.targetDate + 'の日報',
            'submit_label': '投稿する',
            'state': slackitem.targetDate,
            'elements': [
                {
                    'type': 'textarea',
                    'label': '今日の目標',
                    'name': 'Goal',
                    'value': dailyreport.goal || ''
                },
                {
                    'type': 'textarea',
                    'label': '今日の作業',
                    'name': 'Work',
                    'value': dailyreport.work || ''
                },
                {
                    'type': 'textarea',
                    'label': '今日の考察',
                    'name': 'Consideration',
                    'value': dailyreport.consideration || ''
                },
                {
                    'type': 'textarea',
                    'label': '明日の目標',
                    'name': 'NextGoal',
                    'value': dailyreport.nextgoal || ''
                }
            ]
        })
    },

    /**
    * 個人向け日報投稿後のメッセージを生成する
    * @param  {SlackPostItem} slackitem 
    * @return {object} メッセージ
    */
    DailyReportMessageForDM: function (slackitem) {

        return {
            blocks: JSON.stringify([
                {
                    "type": "divider"
                },
                {
                    "type": "section",
                    "fields": [
                        {
                            "type": "mrkdwn",
                            "text": slackitem.text.date
                        }
                    ]
                },
                {
                    "type": "context",
                    "elements": [
                        {
                            "type": "mrkdwn",
                            "text": "*今日の目標*"
                        },
                        {
                            "type": "mrkdwn",
                            "text": slackitem.text.goal
                        }
                    ]
                },
                {
                    "type": "context",
                    "elements": [
                        {
                            "type": "mrkdwn",
                            "text": "*今日の作業*"
                        },
                        {
                            "type": "mrkdwn",
                            "text": slackitem.text.work
                        }
                    ]
                },
                {
                    "type": "context",
                    "elements": [
                        {
                            "type": "mrkdwn",
                            "text": "*今日の考察*"
                        },
                        {
                            "type": "mrkdwn",
                            "text": slackitem.text.consideration
                        }
                    ]
                },
                {
                    "type": "context",
                    "elements": [
                        {
                            "type": "mrkdwn",
                            "text": "*明日の目標*"
                        },
                        {
                            "type": "mrkdwn",
                            "text": slackitem.text.nextgoal
                        }
                    ]
                },

            ])
        }
    },

    /**
    * チャンネル向け日報投稿後のメッセージを生成する
    * @param  {SlackPostItem} slackitem 
    * @return {object} メッセージ
    */
    DailyReportMessageForChannel: function (slackitem, user) {
        return {
            text: user.Name + "さんが" + slackitem.text.date + "日報を投稿しました。",
            blocks: JSON.stringify([
                {
                    "type": "divider"
                },
                {
                    "type": "section",
                    "fields": [
                        {
                            "type": "mrkdwn",
                            "text": slackitem.text.date
                        },
                        {
                            "type": "mrkdwn",
                            "text": user.Name
                        }
                    ]
                },

                {
                    "type": "context",
                    "elements": [
                        {
                            "type": "mrkdwn",
                            "text": "*今日の目標*"
                        },
                        {
                            "type": "mrkdwn",
                            "text": slackitem.text.goal
                        }
                    ]
                },
                {
                    "type": "context",
                    "elements": [
                        {
                            "type": "mrkdwn",
                            "text": "*今日の作業*"
                        },

                        {
                            "type": "mrkdwn",
                            "text": slackitem.text.work
                        }
                    ]
                },
                {
                    "type": "context",
                    "elements": [
                        {
                            "type": "mrkdwn",
                            "text": "*今日の考察*"
                        },

                        {
                            "type": "mrkdwn",
                            "text": slackitem.text.consideration
                        }
                    ]
                },
                {
                    "type": "context",
                    "elements": [
                        {
                            "type": "mrkdwn",
                            "text": "*明日の目標*"
                        },

                        {
                            "type": "mrkdwn",
                            "text": slackitem.text.nextgoal
                        }
                    ]
                },
            ])
        }
    },

    /**
    * 週間統計のメッセージを生成する
    * @param  {SlackPostItem} slackitem 
    * @return {object} メッセージ
    */
    totalWeeklyRankingMessageForChannel: function (WeeklyDailyReports) {
        var blocks = []
        blocks.push({ "type": "divider" })
        blocks.push({
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": '*' + WeeklyDailyReports[0].date + '*' + ' 〜 ' + '*' + WeeklyDailyReports[6].date + '* の集計結果'
            }
        })

        WeeklyDailyReports.forEach(function (day) {
            blocks.push({
                "type": "context",
                "elements": [
                    {
                        "type": "mrkdwn",
                        "text": '*' + day.date + '*'
                    }
                ]
            })
            day.value.forEach(function (name) {
                var reportforday = {
                    "type": "context",
                    "elements": [
                        {
                            "type": "mrkdwn",
                            "text": '　　'
                        },
                        {
                            "type": "mrkdwn",
                            "text": '*' + name.name + '*'
                        }
                    ]
                }
                var strstamps = ''
                var sumstamp = 0
                for (stamps in name.value) {
                    var strstamp = ':' + stamps + ':'
                    for (var i = 0; i < name.value[stamps]; i++) {
                        strstamps += strstamp
                        sumstamp++
                    }
                }
                reportforday.elements.push({
                    "type": "mrkdwn",
                    "text": ' : ' + strstamps
                })
                blocks.push(reportforday)
            })
        })
        console.log(blocks)
        return {
            text: WeeklyDailyReports[0].date + ' 〜 ' + WeeklyDailyReports[6].date + ' の集計結果を投稿しました。',
            blocks: JSON.stringify(blocks)
        }
    }
}

