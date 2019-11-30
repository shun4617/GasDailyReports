function install() {
    var sheets = ['Settings', 'Users', 'DailyReports', 'Greeting']
    var existsheets =[]
    sheets.forEach(function (elem) {
      if(SPREAD_SHEET.getSheetByName(elem) !== null){
        existsheets.push(elem)
      }
        
    })

    //対象シートがすでに存在している場合に処理を継続するか確認
    if (existsheets.length !== 0){
        
        var doSheetExist = Browser.msgBox("シートが存在します。", "インストール処理を継続しますか？", Browser.Buttons.OK_CANCEL)
            if (doSheetExist  == 'cancel') {
                Browser.msgBox("処理を中止します。")
                return
            }
    }

    sheets.forEach(function (elem) {
        if (SPREAD_SHEET.getSheetByName(elem) == null) {
            //存在しない場合
            SPREAD_SHEET.insertSheet(elem)
        } else {
            //存在する場合
            SPREAD_SHEET.deleteSheet(SPREAD_SHEET.getSheetByName(elem))
            SPREAD_SHEET.insertSheet(elem)
        }
    })

    //Settingsの内容
        var SS =  SPREAD_SHEET.getSheetByName('Settings')
        
        
        SS.getRange('A4').setValue('１日の始まり').setBackground('#434343').setFontColor('#ffffff').setFontSize(12)
        SS.getRange('B4').setBackground('#434343').setFontColor('#ffffff')
        
        SS.getRange('A5').setValue('時間').setBackground('#434343').setFontColor('#ffffff').setFontSize(10)
        SS.getRange('B5').setValue('9:00').setBorder(true, true, true, true, false, false).setDataValidation(SpreadsheetApp.newDataValidation().requireFormulaSatisfied('=AND(LT(B5, 1), ISDATE(B5))').setAllowInvalid(false).build())
        
        
        SS.getRange('A7').setValue('日次リマインダー').setBackground('#434343').setFontColor('#ffffff').setFontSize(12)
        SS.getRange('B7').setBackground('#434343').setFontColor('#ffffff')
        
        SS.getRange('A8').setValue('朝　時間').setBackground('#434343').setFontColor('#ffffff').setFontSize(10)
        SS.getRange('B8').setValue('8:00').setBorder(true, true, true, true, false, false).setDataValidation(SpreadsheetApp.newDataValidation().requireFormulaSatisfied('=AND(LT(B8, 1), ISDATE(B8))').setAllowInvalid(false).build())
        
        SS.getRange('A9').setValue('夕　時間').setBackground('#434343').setFontColor('#ffffff').setFontSize(10)
        SS.getRange('B9').setValue('16:00').setBorder(true, true, true, true, false, false).setDataValidation(SpreadsheetApp.newDataValidation().requireFormulaSatisfied('=AND(LT(B9, 1), ISDATE(B9))').setAllowInvalid(false).build())
        
        SS.getRange('A10').setValue('平日（月〜金）').setBackground('#434343').setFontColor('#ffffff').setFontSize(10)
        SS.getRange('B10').setValue('通知する').setBorder(true, true, true, true, false, false).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['通知する', '通知しない']).setAllowInvalid(false).build())
        
        SS.getRange('A11').setValue('休日・祝日').setBackground('#434343').setFontColor('#ffffff').setFontSize(10)
        SS.getRange('B11').setValue('通知しない').setBorder(true, true, true, true, false, false).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['通知する', '通知しない']).setAllowInvalid(false).build())
        
        
        SS.getRange('A13').setValue('週間集計投稿設定').setBackground('#434343').setFontColor('#ffffff').setFontSize(12)
        SS.getRange('B13').setBackground('#434343').setFontColor('#ffffff')
        
        SS.getRange('A14').setValue('時間').setBackground('#434343').setFontColor('#ffffff').setFontSize(10)
        SS.getRange('B14').setValue('8:00').setBorder(true, true, true, true, false, false).setDataValidation(SpreadsheetApp.newDataValidation().requireFormulaSatisfied('=AND(LT(B14, 1), ISDATE(B14))').setAllowInvalid(false).build())

        SS.getRange('A15').setValue('時間').setBackground('#434343').setFontColor('#ffffff').setFontSize(10)
        SS.getRange('B15').setValue('月').setBorder(true, true, true, true, false, false).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['日', '月', '火', '水', '木', '金', '土']).setAllowInvalid(false).build())

        
        SS.getRange('D4').setValue('Bot関連').setBackground('#434343').setFontColor('#ffffff').setFontSize(12)
        SS.getRange('E4').setBackground('#434343').setFontColor('#ffffff')
        
        SS.getRange('D5').setValue('OAuthAccessToken').setBackground('#434343').setFontColor('#ffffff').setFontSize(10)
        SS.getRange('E5').setValue('').setBorder(true, true, true, true, false, false)
        
        SS.getRange('D6').setValue('BotUserId').setBackground('#434343').setFontColor('#ffffff').setFontSize(10)
        SS.getRange('E6').setValue('').setBorder(true, true, true, true, false, false)

        
        //Usersの内容
         SS =  SPREAD_SHEET.getSheetByName('Users')
         
         SS.getRange('A1').setValue('Name').setBackground('#434343').setFontColor('#ffffff')
         SS.getRange('B1').setValue('SlackUserId').setBackground('#434343').setFontColor('#ffffff')
         SS.getRange('C1').setValue('Authority').setBackground('#434343').setFontColor('#ffffff')
         SS.getRange('D1').setValue('DMchannel').setBackground('#434343').setFontColor('#ffffff')
        
        //DailyReports
          SS =  SPREAD_SHEET.getSheetByName('DailyReports')
         
         SS.getRange('A1').setValue('date').setBackground('#434343').setFontColor('#ffffff')
         SS.getRange('B1').setValue('userid').setBackground('#434343').setFontColor('#ffffff')
         SS.getRange('C1').setValue('ts').setBackground('#434343').setFontColor('#ffffff')
         SS.getRange('D1').setValue('channelid').setBackground('#434343').setFontColor('#ffffff')
         SS.getRange('E1').setValue('postts').setBackground('#434343').setFontColor('#ffffff')
         SS.getRange('F1').setValue('postchannel').setBackground('#434343').setFontColor('#ffffff')
         SS.getRange('G1').setValue('goal').setBackground('#434343').setFontColor('#ffffff')
         SS.getRange('H1').setValue('work').setBackground('#434343').setFontColor('#ffffff')
         SS.getRange('I1').setValue('consideration').setBackground('#434343').setFontColor('#ffffff')
         SS.getRange('J1').setValue('nextgoal').setBackground('#434343').setFontColor('#ffffff')
         SS.getRange('K1').setValue('stamp').setBackground('#434343').setFontColor('#ffffff')

         
        //Greetingの内容
         SS =  SPREAD_SHEET.getSheetByName('Greeting')
         
         SS.getRange('A1').setValue('MoningGreeting').setBackground('#434343').setFontColor('#ffffff')
         SS.getRange('B1').setValue('Farewell').setBackground('#434343').setFontColor('#ffffff')
         SS.getRange('A2').setValue('おはようございます')
         SS.getRange('B2').setValue('お疲れ様です')
         SS.getRange('A3').setValue('Good morning')
         SS.getRange('B3').setValue('Good job today')       

}