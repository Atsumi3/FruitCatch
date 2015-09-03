# FruitCatch
くまを操作して、木から降ってくる物体を集める二人用対戦ゲームです.  
  
## サーバの起動
* Node.js と socket.ioを使うので準備します  
* server/serv.js:5 の 10300を任意のポートにして、あけてください
* node serv.js をして何もエラーがでなかったらサーバは起動完了です  
  
## クライアントの準備  
* client/system.js:17 の 接続先をサーバが起動しているURIに書き換えてください  
* この状態でゲームを開くと、待機状態となり  他の人が入って来れば名前入力画面になります  
* お互い名前入力が完了したらゲームがスタートします  
  
## これからしたいこと
* ロビー機能つける  
* マップなどのグラフィックにバリエーションをつける  

