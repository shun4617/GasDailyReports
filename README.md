# GasDailyReports

GAS上に構築されたslackbotでの日報管理ツールです。
日報データ等の保存にGoogleSpreadSheetを利用します。

前提条件として、作業前に目標を記載し、作業完了後に日報を記載します。

### 主な機能

- 平日、休日（祝日含む）別指定時間による目標設定と日報のリマインド
- チャンネルに参加者の日報が投稿される
- チャンネルに投稿された日報は、スタンプにて評価できる
- スタンプの週間リポートを指定曜日の時間に自動的に投稿する


## 利用手順

### 前提条件
[Clasp](https://github.com/google/clasp)を利用することを前提としています。

### GASの準備

#### Google SpreadSheetを新規作成する。
Google SpreadSheetを新規に作成します。

#### Clasp利用の準備
新規作成したSpreadSheetの[ツール] > [スクリプト エディタ]を選びスクリプト エディタを起動する。

スクリプト エディタの[ファイル] > [プロジェクトのプロパティ]を開き`スクリプトID`をコピーする。

任意のディレクトリで本リポジトリをクローンしディレクトリへ移動します。

```
$ git clone https://github.com/shun4617/GasDailyReports
$ cd GasDailyReports
```

`.clasp.json`ファイルを作成します。

```
$ touch .clasp.json
```

'.clasp.json'の内容を下記の通り記載して保存します。(スクリプトIDは、先にコピーしたスクリプトIDに置き換えてください。)

```
{"scriptId":"スクリプトID"}
```

#### GASへコードをプッシュ

下記のコマンドを実行します。（claspを利用したことない場合は別途インストールを実行し、対象Googleアカウントへログインを実施してください。）

```
$ clasp push
```
下記の文言が表示されるので、`y`を入力する

```
? Manifest file has been updated. Do you want to push and overwrite? (y/N)
```

これが完了すれば、スクリプト エディタにコードが表示されます。


#### SpreadSheetの初期設定

スクリプト エディタより、`install.gs`を選択する。

[実行] > [関数を実行] > [install] を選択する。

スプレットシートを開くとダイアログが表示されているので、[はい]を選択する。

必要なシートが作成されます。

[Setting]シートで必要な設定を行います。
[Greeting]シートで朝と夕の最初の挨拶を追加できます。
[Users]と[DailyReports]は日報管理用シートです。

スクリプト エディタに戻り、

[公開]  > [ウェブ アプリケーションとして導入...]を選択する。

ダイアログが表示されるので、

[Who has access to the app:]を[Anyone,even anonymous]に変更する。

[変更]を押す。

権限について認証を求められるので認証する。

次にでてきたURLは、Slackに利用するので控えておく




#### Slackの設定

#### チャンネル設定
参加者の日報を投稿するチャンネルを作成する。
チャンネルのURLの/で区切られているもののCから始まる部分を
SpreadSheetの[Settings]シートにある[DailyReportChannelId]に記載する。

#### Slack Appの作成
[https://api.slack.com/app](https://api.slack.com/app)を開く

[Start Building]を開く

任意のApp Nameを入力し、　Development Slack Workspaceで対象のワークスペースを選択し、Create Appを選択

Appの設定画面に変わります。

下の方に[Verification Token]があるので
これを、先に用意したSpreadSheetの[Settings]シートにある[SlackEventApiToken]へ入力する。


#### Bot Userを作成
先の手順を実施すると、Appの設定に変わります。

そのサイドバーから[Bot User] を開き
Display name、Default usernameを入力し,
Always Show My Bot as Online を Onにして作成する。

#### OAuth & Permissionsの設定

サイドバーより、[OAuth & Permissions]を開き

[Add New Redirect URL]を押して、先ほど控えたURLを入力する。

[Save URLs]を押して保存する。


次に、[Install App to Workspace]を押す。
承認を求められるので、承認する。


画面が遷移し OAuth Access Tokenが発行される。
OAuth Access Token と Bot User OAuth Access Token　を
先に用意したSpreadSheetの[Settings]シートにある[OAuthAccessToken]と[Bot UserOAuthAccessToken]へ入力する。


#### Event Subscriptionsの設定
　サイバーより、[Event Subscriptions]を開き
[Enable Events]をONにする。

Request URLに先ほど控えたURLを改めて入力する。

Request URLの右側にVerifiedが表示されれば認証が成功。

[Subscribe to bot events]を開き
[Add Bot User Event]を押して
reaction_addedとreaction_removedを選択して追加する。

[Subscribe to workspace eventsを開き
[Add Bot User Event]を押して
team_joinを選択して追加する。


#### 先ほど作成したチャンネルにAppを追加する

先ほど作成したチャンネルを開きappを追加する。



### GASの設定

#### トリガーの設定
スクリプト エディタを開く。

[編集] > [現在のプロジェクトのトリガー] を選択

別画面が表示されるので、[トリガーの追加]を選択

実行する関数を選択に`runEverHour`を選択

実行するデプロイを選択を`Head`を選択

イベントのソース選択を`時間主導（時間ベースのタイマー）`を選択

時間の感覚を選択（時間）を`１時間おき`を選択

エラー通知設定は任意

保存を押す。

これで動作します。

## 注意点

GASを無料枠で動作させることを目的として、GoogleSpreadSheetを読みに行く時間を減らすために設定値などを`PropertiesService`経由で利用しています。
変更が反映されない場合は、スクリプト エディタの[ファイル] > [プロジェクトのプロパティ] > [スクリプトのプロパティ]の各値を確認してください。