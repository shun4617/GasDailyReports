/**
* 日報関連のモジュール
* @param  {string} 
* @return {object} {date:<string>, userid:<string>,ts:<string>,channelid:<string>, postts:<string>, postchannel:<string>}
*/
var DailyReports = {

    //対象シートを指定
    sheet: function(){return DAILYREPORTSHEET},

    //日報のデータをストック
    cache: [],

    /**
    * cacheに日報の情報を全てキャッシュする
    */
    Init: function(){
        var LastRow = this.getLastRow()
        var Datas = this.sheet().getRange(1, 1, LastRow, 11).getDisplayValues()
        var result = []
        for (var i = 1, mi = Datas.length; i < mi; i++) {
            var row = {}
            for (var j = 0, mj = Datas[0].length; j < mj; j++) {
                row[Datas[0][j]] = ''+ Datas[i][j]
                if(Datas[0][j] == 'stamp' && Datas[i][j] ){
                    row[Datas[0][j]] = JSON.parse(''+ Datas[i][j])
                }
            }
            row.RowNum = i + 1
            result.push(row)
        }
        this.cache = result
    },

    getLastRow: function(){
        var num = PropertiesService.getScriptProperties().getProperty('DailyReportLastRow')
        if(num === null){
            num = 0
        }
        return  Number(num)
    },

    addLastRow: function(){
        var num  = Number(this.getLastRow())
        PropertiesService.getScriptProperties().setProperty('DailyReportLastRow', num+1)
    }
    ,

    setLastRow: function(num){
        var num = num || this.sheet().getLastRow()
        PropertiesService.getScriptProperties().setProperty('DailyReportLastRow', num)
    },
    
    /**
     * 同一ユーザー同一日付の日報を検索
     * @param  {string} UserId  (required) 
     * @param  {string} date    (required) YYYY/MM/DD
     * @return {array} {date:<string>, userid:<string>,ts:<string>,channelid:<string>, postts:<string>, postchannel:<string>}
     */
    findDailyReportByUserDate: function (UserId, date) {
        if (this.cache.length == 0) {
            this.Init()
        }
        var result = this.cache.filter(function (e) {
            return e.userid === UserId && e.date === date
        })
        if(result.length == 0){
            return 
        }
        return result[0]
    },

    /**
     * 同一posttsの日報を検索
     * @param  {string} postts
     * @return {object} {date:<string>, userid:<string>,ts:<string>,channelid:<string>, postts:<string>, postchannel:<string>}
     */
    findDailyReportByPostts: function (postts) {
        if (this.cache.length == 0) {
            this.Init()
        }
        var result = this.cache.filter(function (e) {
            return  e.postts === postts
        })
        if(result.length == 0){
            return 
        }
        return result[0]
    },

      /**
     * 指定日の日報を全て検索（処理に時間がかかる可能性あり）
     * @param  <string> day  検索する日付 YYYY/MM/DD
     * @return <object> {date:<string>, userid:<string>,ts:<string>,channelid:<string>, postts:<string>, postchannel:<string>, 1:<string>, 2:<string>, 3:<stirng>, 4:<string>, stamp:<string>}
     */
    findDailyReportsByDay: function(day){
        if(this.cache.length == 0 || !this.cache[0] || !this.cache[0].stamp){
            this.Init()
        }
        var result = this.cache.filter(function (e) {
            return e.date　== day
        })
        return result
    },

          /**
     * 指定ユーザーの指定日の日報を全て検索（処理に時間がかかる可能性あり）
     * @param  <string> day  検索する日付 YYYY/MM/DD
     * @return <object> {date:<string>, userid:<string>,ts:<string>,channelid:<string>, postts:<string>, postchannel:<string>, 1:<string>, 2:<string>, 3:<stirng>, 4:<string>, stamp:<string>}
     */
    findDailyReportsByUserDay: function(User,day){
        if(this.cache.length == 0 || !this.cache[0] || !this.cache[0].stamp){
            this.Init()
        }
        var result = this.cache.filter(function (e) {
            return e.date　== day && e.userid == User
        })
        return result
    },

    /**
     * 指定行の日報の全ての情報を取得
     * @param  <string> RowNum  (required) 
     * @return <object> {date:<string>, userid:<string>,ts:<string>,channelid:<string>, postts:<string>, postchannel:<string>, 1:<string>, 2:<string>, 3:<stirng>, 4:<string>, stamp:<string>}
     */
    getDailyReportByRowNum: function (RowNum){
        return  this.sheet().getRange(1, RowNum, 1, 12).getDisplayValues()
    },

    /**
     * 日報を追加する
     * @param  {SlackPostItem} slackitem 
     * @param  {SlackPostItem} postedslackitem 
     */
    setDailyReport: function(slackitem, PostedSlackDMItem, PostedSlackDailyReportChannnelItem){
        console.log('DailyReportModuls.setDailyReport: '+JSON.stringify(slackitem)+', '+JSON.stringify(PostedSlackDMItem)+', '+JSON.stringify(PostedSlackDailyReportChannnelItem) +', '+JSON.stringify(PostedSlackDailyReportChannnelItem))
        var date =  slackitem.text.date
        var UserId = slackitem.user
        var Ts = PostedSlackDMItem.ts
        var ChannelId = PostedSlackDMItem.channel
        var PostedTs = PostedSlackDailyReportChannnelItem.ts
        var PostedChannelId = PostedSlackDailyReportChannnelItem.channel
        var Text =  slackitem.text
        if(!PostedTs) {
            PostedTs = slackitem.PostedDailyReportInSheet.postts
        }

        var arryDailyReport = [[date, UserId, Ts, ChannelId, PostedTs, PostedChannelId, Text.goal, Text.work, Text.consideration, Text.nextgoal]]
        var post = this.findDailyReportByUserDate(UserId, date)
        if(!post){
            //初投稿時
            this.sheet().getRange(this.getLastRow()+1, 1, 1, 10).setValues(arryDailyReport)
            this.addLastRow()
        }else{
            //更新時
            this.sheet().getRange(post.RowNum, 1, 1, 10).setValues(arryDailyReport)
        }
        return
    },
    getStanpsByPostts: function(postts){
       return this.findDailyReportByPostts(postts)
    },
    setStanpByRowNum: function(RowNum, stamps){
        this.sheet().getRange(RowNum,11).setValue(JSON.stringify(stamps))
    }

}