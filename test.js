function testpostDailyMorningMessage(){
    postDailyMorningMessage("UHAT291LJ")
}
function testpostDailyEveningMessage(){
    postDailyEveningMessage("UHAT291LJ")
}

function setdata(){

    DailyReports.setLastRow()
}

function settingreset(){
    Settings.set()
}

function getusers(){
    var slack = new Slack()
    console.log(slack.userList())
}

function getuserrr(){
    Users.getAllUsersBySlack()
}