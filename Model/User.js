var Users = {
    sheet: function(){return USERSSHEET},
    cache: [],
    /**
     * Usersを取得する
     * @param  {SlackPostItem} slackitem 
     * @param  {SlackPostItem} postedslackitem 
     */
    init: function() {
        var Lists = PropertiesService.getScriptProperties().getProperty('Users')
        if(Lists != null){
            Lists =  JSON.parse(Lists)
        }else{
            Lists = []
        }
        this.cache = Lists
    },

    /**
     * 指定のユーザー情報を取得
     * @param  {string} UserId
     * @return {object} {Name	SlackUserId	DMchannel	Authority}
     */
    findUserByUserId: function(UserId){
        if(this.cache.length == 0){
            this.init()
        }
        for (i = 0, m = this.cache.length; i < m; i++) {
            if (this.cache[i].SlackUserId == UserId) {
                return this.cache[i]
            }
        }
        return ''
    },

    /**
     * シートからプロパティに上書き
     * @param  {string} UserId
     * @return {object} {Name	SlackUserId	DMchannel	Authority}
     */
    setPropFromSheet: function(){
        var SheetValues = this.sheet().getDataRange().getDisplayValues()
        var Result = [];
        for (var i = 1, mi = SheetValues.length; i < mi; i++) {
            var row = {};
            for (var j = 0; j < SheetValues[1].length; j++) {
                row[SheetValues[0][j]] = SheetValues[i][j];
            }
            row.RowNum = i + 1
            Result.push(row);
        }
        if(Result.length > 0){
            PropertiesService.getScriptProperties().setProperty("Users",JSON.stringify(Result));
        }
    },

        /**
     * 全ユーザー情報を取得。
     * @param  {string} UserId  
     * @return {string} DMchannelId
     */
    getAllUsers: function(){
        if(this.cache.length == 0){
            this.init()
        }
        return this.cache
    },

    /**
     * 投稿されたDMの情報を元にユーザーごとのDMのチャンネルIDをUsersシートに追記
     * @param  {SlackPostItem} slackitem 
     * @param  {SlackPostItem} postedslackitem 
     */
    changeUserDMchannelFromDM: function(SlackUserId, DMchannel){
        if(this.cache.length == 0){
            this.init()
        }
        var user = this.findUserByUserId(SlackUserId)
        user.SlackDmId = DMchannel
        if(!user.Name || !user.SlackUserId || !user.Authority || !user.RowNum ){
            throw new Error('引数オブジェクトが不正です 値：'+JSON.stringify(User))
        }
        this.sheet().getRange(user.RowNum, 1, 1, 4).setValues([[user.Name, user.SlackuserId, user.Authority, user.SlackDmId]])
        this.setPropFromSheet()
        this.init()
        console.log('Userシートを更新しました。Name:'+ user.Name+' SlackUserId:'+user.SlackUserId+' Authority:'+user.Authority+' DMchannel:'+ user.DMchannel)
    },

    /**
     * 投稿されたDMの情報を元にユーザーごとのDMのチャンネルIDをUsersシートに追記
     * @param  {SlackPostItem} slackitem 
     * @param  {SlackPostItem} postedslackitem 
     */
    changeUserDMchannelFromDM: function(SlackUserId, DMchannel){
        if(this.cache.length == 0){
            this.init()
        }
        var user = this.findUserByUserId(SlackUserId)
        user.SlackDmId = DMchannel
        if(!user.Name || !user.SlackUserId || !user.Authority || !user.RowNum ){
            throw new Error('引数オブジェクトが不正です 値：'+JSON.stringify(User))
        }
        this.sheet().getRange(user.RowNum, 1, 1, 4).setValues([[user.Name, user.SlackuserId, user.Authority, user.SlackDmId]])
        this.setPropFromSheet()
        this.init()
        console.log('Userシートを更新しました。Name:'+ user.Name+' SlackUserId:'+user.SlackUserId+' Authority:'+user.Authority+' DMchannel:'+ user.DMchannel)
    },


    /**
     * Slackから全ユーザー情報を取得し更新する。
     * @param  {string} UserId  
     * @return {string} DMchannelId
     */
    getAllUsersBySlack: function(){
        var self = this
        self.setPropFromSheet()
        self.init()
        var base = self.cache.concat()
        var slack = new Slack()
        var response = slack.userList()
        if(!response.ok){
            throw new Error('Slackでの処理に失敗しました。'+ JSON.stringfiy(response))
        }
        response = new SlackItem(response)
        console.log('Slackのメンバーリストから取得を開始')
        response.users.forEach(function(e){
            var row = {}
            //bot判定
            if(e.is_bot == false){
                //nameにbotの文字がないか判定
                if(!/.*bot.*/.test(e.name)){
                    var user = self.findUserByUserId(e.id)
                    if(user){
                         //更新
                        row = user
                        var DMchannelId = self.getDMchannelById(e.id)
                        if(user.DMchannel != DMchannelId){
                            row.DMchannel = DMchannelId
                        }
                        for(var i = 0,m = base.length; i<m; i++){
                            if(base[i].SlackUserId == row.SlackUserId){
                                base[i] = row
                                console.log('[更新] :'+JSON.stringify(row))
                                break
                            }
                        }
                    }else{
                        //新規
                        row = {
                            Name: e.profile.real_name,
                            SlackUserId: e.id,
                            Authority: "user",
                            DMchannel: self.getDMchannelById(e.id)
                        }
                        console.log('[新規] :'+JSON.stringify(row))
                        base.push(row)
                    }
                }
            }
        })
        var result = []
        base.forEach(function(e){
            result.push([e.Name, e.SlackUserId, e.Authority, e.DMchannel])
        })
        self.sheet.getRange(2, 1, result.length, 4).setValues(result)
        self.setPropFromSheet()
        self.init()
        console.log('Slackのメンバーリストから取得を完了')
    },

    /**
     * IDを元にDMのIDを取得する
     * @param  {string} UserId  
     * @return {string} DMchannelId
     */
    getDMchannelById: function(id){
        var slack = new Slack()
        var response = slack.imOpen(id)
        if(!response.ok){
        throw new Error('Slackでの処理に失敗しました。'+ JSON.stringfiy)
        }
        response = new SlackItem(response)
        return response.id
    }


}