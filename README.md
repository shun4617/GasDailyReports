# GasDailyReports

GAS上に構築されたslackbotでの日報管理ツールです。
日報データ等の保存にGoogleSpreadSheetを利用します。

前提条件として、作業前に目標を記載し、作業完了後に日報を記載します。

### 主な機能

- 平日、休日（祝日含む）別指定時間による目標設定と日報のリマインド
- 週間リポートを指定曜日の時間に自動投稿


## 利用手順

### 前提条件
[Clasp](https://github.com/google/clasp)を利用することを前提としています。

### GASの準備

#### 本スクリプトをローカルにダウンロードする。

#### Google SpreadSheetを新規作成する。
Google SpreadSheetを新規に作成します。

#### Claspの準備
新規作成したSpreadSheetの[ツール] > [スクリプトエディタ]を選びスクリプトエディタを起動する。

スクリプトエディタの[ファイル] > [プロジェクトのプロパティ]を開き`スクリプトID`をコピーする。

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

これが完了すれば、スクリプトエディタにコードが表示されます。



## 注意点

GASを無料枠で動作させることを目的として、GoogleSpreadSheetを読みに行く時間を減らすために設定値などを`PropertiesService`経由で利用しています。
変更が反映されない場合は、スクリプトエディタの[ファイル] > [プロジェクトのプロパティ] > [スクリプトのプロパティ]の各値を確認してください。