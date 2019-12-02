//初期化処理
var SPREAD_SHEET = SpreadsheetApp.getActiveSpreadsheet()
var KEYSSHEET = SPREAD_SHEET.getSheetByName('Keys')
var SETTINGSSHEET = SPREAD_SHEET.getSheetByName('Settings')
var USERSSHEET = SPREAD_SHEET.getSheetByName('Users')
var DAILYREPORTSHEET = SPREAD_SHEET.getSheetByName('DailyReports')
var GREETINGSHEET = SPREAD_SHEET.getSheetByName('Greeting')
var KEYS = JSON.parse(PropertiesService.getScriptProperties().getProperty("Keys"))
//var SETTINGS = getSettingsToProp();
//var USERS = getUsersToProp()
var GREETING = JSON.parse(PropertiesService.getScriptProperties().getProperty("Greeting"))

//処理時間短縮のため変数宣言のみ
var InfoDaliyReport = ''
var DebugSheet = SPREAD_SHEET.getSheetByName('Debug');

//投稿時時の関数
function doPost(e) {
	var settings = Settings.get()
	console.log('e : '+ JSON.stringify(e))
	if(!e.postData){
		throw new Error('payloadが不正です' + JSON.stringify(e))
	}
	var slackitem = new SlackItem(e)
	console.log('slackitem : '+ JSON.stringify(slackitem))
	
	//tokenチェック
	if (settings.bot.SlackEventApiToken !== slackitem.token) {
		throw new Error('トークンがありません')
	}
	//確認関連
	//slackitem.typeがあるか確認
	if (!slackitem.type) { 
		//対象外イベントのため終了
		console.log('対象外イベントのため中断')
		return
	}
	//botによる投稿であるか判定
	if (slackitem.botid) {
		console.log('Botのため中断')
		return
	}
	
	//イベント分岐
	//コマンドか確認
	if(slackitem.type =='コマンド'){
		if(slackitem.command == '/dr'){
			postDailyReportDailog(slackitem)
			return　ContentService.createTextOutput()
		}
	}
	if(slackitem.type =='コマンド'){
		if(slackitem.command == '/dr'){
			postChangeDailyReportDailog(slackitem)
			return　ContentService.createTextOutput()
		}
	}
	if(slackitem.type == '目標ダイアログ'){
		console.log('EventType :  目標ダイアログ')
		postGoalDailog(slackitem)
	}
	if(slackitem.type == '日報ダイアログ'){
		console.log('EventType :  日報ダイアログ')
		postDailyReportDailog(slackitem)
	}
	if(slackitem.type == '目標作成'){
		console.log('EventType :  目標作成')
		postDailyReportFromDailog(slackitem, '目標')
		return　ContentService.createTextOutput()
	}
	if(slackitem.type == '日報作成'){
		console.log('EventType :  日報作成')
		postDailyReportFromDailog(slackitem, '日報')
		return　ContentService.createTextOutput()
	}

	console.log(JSON.stringify(slackitem))
	//Message関連か確認
	if(slackitem.type =='DM新規投稿'){
		if (/\[日付\]|\[今日の目標\]|\[今日の作業\]|\[今日の考察\]|\[明日の目標\]/.test(slackitem.text)) {
			console.log('EventType :  DM新規投稿 日報投稿')
			postDailyReport(slackitem)
			return
		}
		//日報と記載のあるものを判定
		if (/日報/.test(slackitem.text)) {
			console.log('EventType :  DM新規投稿　日報テンプレ投稿')
			postDailyReportTemplate(slackitem)
			return
		}
	}
	if(slackitem.type =='DM編集'){
		console.log('EventType :  DM編集')
		chengeDailyReport(slackitem)
	}
	if(slackitem.type =='スタンプ追加'){
		console.log('EventType :  スタンプ追加')
		addReaction(slackitem)
	}
	if(slackitem.type =='スタンプ削除'){
		console.log('EventType :  スタンプ削除')
		deleteReaction(slackitem)
	}
	if(slackitem.type == 'メンバー追加'){

	}
	if(slackitem.type == 'url_verification'){
		return ContentService.createTextOutput(JSON.stringify({'challenge': slackitem.challenge})).setMimeType(ContentService.MimeType.JSON)
	}
}


function runEverHour(){
	var settings = Settings.get()
	var now = Moment.moment()
	var remind = settings.remindtime
	var weeklyagg = settings.weeklyagg
	var weekday = isWeekDay(now)
	if(weekday ==='平日' && remind.weekday){
		if(isTime(remind.morning.time, now)){
			postDaliyMorning()
			console.log('evening')
		}
		if(isTime(remind.evening.time, now)){
			postDailyEvening()
			console.log('evening')
		}
	}
	if(weekday ==='休日'　&& remind.holiday){
		if(isTime(remind.morning.time, now)){
			postDaliyMorning()
			console.log('evening')
		}
		if(isTime(remind.evening.time, now)){
			postDailyEvening()
			console.log('evening')
		}
	}
	if(weekday ==='祝日'　&& remind.pubholiday){
		if(isTime(remind.morning.time, now)){
			postDaliyMorning()
			console.log('evening')
		}
		if(isTime(remind.evening.time, now)){
			postDailyEvening()
			console.log('evening')
		}
	}
	if(['日','月','火','水','木','金','土'][now.day()] == weeklyagg.day){
		var clock = Moment.moment(weeklyagg.time, 'h:m')
		if(now.hours() == clock.hours()){
			postWeeklyTotalRanks()
			console.log('agg')
		}
	}
}


function isWeekDay(now){
	var day = Moment.moment(now,'YYYY/MM/DD').toDate()
	var calendars = CalendarApp.getCalendarsByName('日本の祝日')
	//平日判定
	if(now.day() >=1 || now.day() <=5){
		//祝日判定
		if(calendars[0].getEventsForDay(day).length !==  0){
			console.log('祝日')
			return '祝日'
		}
		console.log('平日')
		return '平日'
	}else{
		//休日判定
		console.log('休日')
		return '休日'
	}
}

function isTime(time, now){
	var clock = Moment.moment(time, 'H:m')
	if(now.hours() == clock.hours()){
		return true
	}
	return false
}


function postDaliyMorning(){
	var today = Moment.moment().format('YYYY/MM/DD')
	PropertiesService.getScriptProperties().setProperty('ToDay', today)
	var users = Users.getAllUsers()
	for(var i = 0 , m = users.length; i < m ; i++){
		var user = users[i]
		if(!user.DMchannel){
			continue
		}
		postDailyMorningMessage(user.SlackUserId, today)
	}
}

function postDailyEvening(){
	var today = PropertiesService.getScriptProperties().getProperty('ToDay')
	var users = Users.getAllUsers()
	for(var i = 0 , m = users.length; i < m ; i++){
		var user = users[i]
		if(!user.DMchannel){
			continue
		}
		postDailyEveningMessage(user.SlackUserId, today)
	}
}

function postWeeklyTotalRanks(){
	totalWeeklyRanking()	
}

//UserId(SlackUserId)でUsersに記載のある該当のユーザー情報を検索　
function findUserByUserId(UserId) {
	for (i = 0, m = USERS.length; i < m; i++) {
		if (USERS[i].SlackUserId == UserId) {
			return USERS[i]
		}
	}
	return ''
}


function vaildts(ts) {
	if (typeof ts != "string") {
		ts = '' + ts
	}
	ts = ts.split('.')
	ts[1] = (ts[1] + '000000').slice(0, 6)
	ts = '' + ts[0] + '.' + ts[1]
	console.log('ts : ' + ts)
	return ts
}


function setDebug(str) {
	var LastRow = DebugSheet.getLastRow();
	DebugSheet.getRange(LastRow + 1, 1).setValue(Moment.moment().format('YYYY/MM/DD HH:mm:ss'));
	DebugSheet.getRange(LastRow + 1, 2).setValue(str);
}



