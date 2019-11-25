# GasDailyReports

GAS上に構築されたslackbotでの日報管理ツールです。
日報データ等の保存にGoogleSpreadSheetを利用します。

前提条件として、作業前に目標を記載し、作業完了後に日報を記載します。

### 主な機能

- 平日、休日（祝日含む）別指定時間による目標設定と日報のリマインド
- 週間リポートを指定曜日の時間に自動投稿


## GasDailyReportsをGASへのインストール方法

　--スクリプト準備中

## 注意点

GASを無料枠で動作させることを目的として、GoogleSpreadSheetを読みに行く時間を減らすために設定値などを`PropertiesService`経由で利用しています。
変更が反映されない場合は、GASの`ファイル` ＞ `プロジェクトのプロパティ` ＞ `スクリプトのプロパティ`の値を確認してください。