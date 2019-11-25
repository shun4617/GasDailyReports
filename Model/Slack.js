
(function(global){

    var Slack = (function() {
      /**
      * Slackを初期化
      * @param  {String} token(option 初期値：KEYS.BotUserOAuthAccessToken)
      */
      function Slack(token){
        var options = options || {};
        this.EntryURL ="https://slack.com/api/";
        this.token = token || KEYS.BotUserOAuthAccessToken // APIトークン　（デフォルト値を設定）
      }

      /**
      * Slackへ指定チャンネルにポスト(method chat.postMessage')
      * @param  {String} slackitem 
      * @param  {Object} payload
      * @return {object} slackapiの応答
      */
      Slack.prototype.postMessage =  function(channel_id, payload) {
        var self = this;
        if(!payload){
            new Error('メッセージがありません')
        }
        payload.token = self.token
        payload.channel = channel_id
        var response  = UrlFetchApp.fetch(self.EntryURL+'chat.postMessage', {
          "method" : "POST",
          "payload" : payload
        });
        response = JSON.parse(response)
        if (response.ok != true) {
          throw new Error('slackへの投稿に失敗しました。:'+JSON.stringify(response)+' reqest:' + JSON.stringify(payload))
        }
        return response
      };

            /**
      * Slackへ指定チャンネルにポスト(method chat.postMessage')
      * @param  {String} slackitem 
      * @param  {Object} payload
      * @return {object} slackapiの応答
      */
     Slack.prototype.postEphemeral =  function(channel_id, user_id, payload) {
      var self = this;
      if(!payload){
          new Error('メッセージがありません')
      }
      payload.token = self.token
      payload.channel = channel_id
      payload.user = user_id
      var response  = UrlFetchApp.fetch(self.EntryURL+'chat.postEphemeral', {
        "method" : "POST",
        "payload" : payload
      });
      response = JSON.parse(response)
      if (response.ok != true) {
        throw new Error('slackへの投稿に失敗しました。:'+JSON.stringify(response)+' reqest:' + JSON.stringify(payload))
      }
      return response
    };
  
      /**
      * Slackへ指定チャンネルにダイアログをポスト
      * @param  {String} slackitem 
      * @param  {Object} payload
      * @return {object} slackapiの応答
      */
      Slack.prototype.postDialog =  function(channel_id, trigger_id, dialog) {
        var self = this;
        var response  = UrlFetchApp.fetch(self.EntryURL+'dialog.open', {
          "method" : "POST",
          "payload" : {
            token: self.token,
            trigger_id:trigger_id,
            channel: channel_id,
            dialog: dialog
          }
        });
        // ContentService.createTextOutput()
        response = JSON.parse(response)
        if (response.ok != true) {
          throw new Error('slackへの投稿に失敗しました。:'+JSON.stringify(response)+' reqest:' + JSON.stringify(dialog))
        }
        return response
      };
  
        /**
      * 指定したメッセージを削除
      * @param  {String} channel_id
      * @param  {String} ts
      * @return {object} slackapiの応答
      */
      Slack.prototype.DeleteMessage =  function(channel_id, ts) {
        var self = this;
        var response  = UrlFetchApp.fetch(self.EntryURL+'chat.delete', {
          "method" : "POST",
          "payload" : {
            token: self.token,
            ts: ts,
            channel: channel_id
          }
        });
        // ContentService.createTextOutput()
        response = JSON.parse(response)
        if (response.ok != true) {
          throw new Error('slackへの投稿に失敗しました。')
        }
        return response
      };
  
          /**
      * 指定したメッセージを削除
      * @param  {String} channel_id
      * @param  {String} ts
      * @return {object} slackapiの応答
      */
      Slack.prototype.updateMessage =  function(channel_id, ts, payload) {
        var self = this;
        payload.token = self.token
        payload.channel = channel_id
        payload.ts = ts
      
        var response  = UrlFetchApp.fetch(self.EntryURL+'chat.update', {
          "method" : "POST",
          "payload" : payload
        });
        response = JSON.parse(response)
        if (response.ok != true) {
          throw new Error('slackへの投稿に失敗しました。:'+JSON.stringify(response)+' reqest:' + JSON.stringify(payload))
        }
        return response
      };
  
      Slack.prototype.addReaction = function(channel_id, ts, reaction) {
        var self = this
        var peyload = {
          'method' : 'POST',
          'payload': {
            token: self.token,
            channel: channel_id,
            name: reaction,
            timestamp: ts
          }
        }
        var response  = UrlFetchApp.fetch(self.EntryURL+'reactions.add', peyload );
        console.log('respons:'+response)
        response = JSON.parse(response)
        if (response.ok != true) {
          throw new Error('slackへの投稿に失敗しました。:'+JSON.stringify(response)+' reqest:' + JSON.stringify(payload))
        }
        return response
      }
  
      Slack.prototype.removeReaction = function(channel_id, ts, reaction) {
        var self = this
        var peyload = {
          'method' : 'POST',
          'payload': {
            token: self.token,
            channel: channel_id,
            name: reaction,
            timestamp: ts
          }
        }
        var response  = UrlFetchApp.fetch(self.EntryURL+'reactions.remove', peyload);
        console.log('respons:'+response)
        response = JSON.parse(response)
        if (response.ok != true) {
          throw new Error('slackへの投稿に失敗しました。:'+JSON.stringify(response)+' reqest:' + JSON.stringify(payload))
        }
        return response
      }

      /**
      * DMを開く
      * @param  {String} channel_id
      * @param  {String} ts
      * @return {object} slackapiの応答
      */
      Slack.prototype.imOpen = function(user) {
        var self = this
        var peyload = {
          'method' : 'POST',
          'payload': {
            token: self.token,
            user: user
          }
        }
        var response  = UrlFetchApp.fetch(self.EntryURL+'im.open', peyload);
        console.log('respons:'+response)
        response = JSON.parse(response)
        if (response.ok != true) {
          throw new Error('slackへの投稿に失敗しました。:'+JSON.stringify(response)+' reqest:' + JSON.stringify(payload))
        }
        return response
      }

            /**
      * チームのユーザーを取得
      * @param  {String} channel_id
      * @param  {String} ts
      * @return {object} slackapiの応答
      */
     Slack.prototype.userList = function() {
      var self = this
      var peyload = {
        'method' : 'POST',
        'payload': {
          token: self.token,
        }
      }
      var response  = UrlFetchApp.fetch(self.EntryURL+'users.list', peyload);
      console.log('respons:'+response)
      response = JSON.parse(response)
      if (response.ok != true) {
        throw new Error('slackへの投稿に失敗しました。:'+JSON.stringify(response)+' reqest:' + JSON.stringify(payload))
      }
      return response
    }
      return Slack;
    })();
  
    global.Slack = Slack;
  })(this);