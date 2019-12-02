var Settings = {
    sheet: function(){return SETTINGSSHEET},

    get: function () {
        var result = PropertiesService.getScriptProperties().getProperty('Settings')
        if (result == 'null') {
            this.set()
            result = PropertiesService.getScriptProperties().getProperty('Settings')
        }
        return JSON.parse(result)
    },
    set: function () {
        var values = {
            startdaytime: this.sheet().getRange(5, 2).getValue(),
            remindtime: {
                weekday: this.sheet().getRange(10, 2).getValue() == '通知する',
                holiday: this.sheet().getRange(11, 2).getValue() == '通知する',
                pubholiday: this.sheet().getRange(11, 2).getValue() == '通知する',
                morning: {
                    time: this.sheet().getRange(8, 2).getDisplayValue(),
                },
                evening: {
                    time: this.sheet().getRange(9, 2).getDisplayValue(),
                }
            },
            weeklyagg: {
                time: this.sheet().getRange(14, 2).getDisplayValue(),
                day: this.sheet().getRange(15, 2).getValue()
            },
            bot: {
                OAuthAccessToken: this.sheet().getRange(5, 5).getValue(),
                BotUserOAuthAccessToken: this.sheet().getRange(6, 5).getValue(),
                SlackEventApiToken: this.sheet().getRange(7, 5).getValue(),
                DailyReportChannelId: this.sheet().getRange(8, 5).getValue()
            }
        }
        
        PropertiesService.getScriptProperties().setProperty('Settings',JSON.stringify(values));
        console.log('設定が更新されました。')
        console.log(JSON.stringify(values))
    }
}
