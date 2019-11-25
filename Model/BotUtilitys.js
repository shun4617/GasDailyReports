var MessageBot = {
    /**
    * botが送付したメッセージのtsをchannelをキーに登録する
    * @param  {string} channel
    * @return {object} slackapiの応答
    */
    getTs: function(channel){
        var botMessage = {}
        if(PropertiesService.getScriptProperties().getProperty("botMessage")){
            var prop = PropertiesService.getScriptProperties().getProperty("botMessage")
            if(typeof prop !=''){
                botMessage = JSON.parse(prop)
            }
        }
        return  botMessage[channel]
    },

    /**
    * botが送付したメッセージのtsを登録する
    * @param  {string} channel
    * @return {object} slackapiの応答
    */
    setTs: function(channel, ts){
        var botMessage = {}
        if(PropertiesService.getScriptProperties().getProperty("botMessage")){
            var prop = PropertiesService.getScriptProperties().getProperty("botMessage")
            if(typeof prop !=''){
                botMessage = JSON.parse(prop)
            }
                
        }
        botMessage[channel] = ts
        PropertiesService.getScriptProperties().setProperty("botMessage", JSON.stringify(botMessage))
    },
    randomGreeting: function(key){
        if(!GREETING[key]){
            throw new Error('GREETINGの中に'+ key +'がありません')
            return 
        }
        return GREETING[key][ Math.floor( Math.random() * GREETING[key].length ) ] ;
    }



}

var BotKeys = {
    getkeys: function(){
        var keys = PropertiesService.getScriptProperties().getProperty("Keys")
        return JSON.parse(keys)
    },
    setKeys: function(){

    }
}
