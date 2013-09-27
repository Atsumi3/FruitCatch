enchant();

//システム定数
var WIN_X = 		320;
var WIN_Y =			320;
var DEF_FPS =		30;

//システム変数
var frameCount = 0; //フレームカウント
var appleInterval = 60; // リンゴどのくらいの感覚で落とすか
var speedInterval = 120; // どのくらいの感覚で落とすか
var bombInterval = 400; // どのくらいの感覚で落とすか
var endTime = 60; //終了時間 秒
var gameScore = 0; //自分のスコア
var enemyScore = 0; //相手のスコア

var server = 'http://localhost:10300/'; //接続先

// フラグ
//var F_initFirst = true; // 初期化するか
var F_appleFall = false; // リンゴを全部落とすか
var F_playSound = true; // 音を再生するか
var F_bear_walk = false;

//ソケット通信を立てる
var socket = io.connect(server);

var px = 0; var py = 0; //通信用Player座標
var ex = 0; var ey = 0; //通信用Enemy座標
var game_startFlag = false; //ゲームのほんとの始まり
var b_id = null; //自分のバトルID
var waiting = false; //バトル開始待機
var playerNum = 0; // 1Pか2Pか
var playerName = null; //プレイヤーネーム
var enemyName = null; //エネミーネーム

//画像ロード
/* 背景 */
var wood = "./img/wood.png";

/* 弾 */

/* キャラ */
var bear_img = "./img/chara1.gif";

/* 音 */
// 魔王魂さん http://maoudamashii.jokersounds.com
var Itemget = {
	0:'sound/se_maoudamashii_system49.wav',
	1:'sound/se_maoudamashii_system31.wav',
	2:'sound/se_maoudamashii_onepoint02.wav',
	3:'sound/se_maoudamashii_explosion05.wav'
	};

/* アイテム */
var item_img = "img/enemy.gif";

/* マップ */
// ぴぽや　http://piposozai.blog76.fc2.com/
var map_img = "./img/map.png";

// グループ
var showSystem = new Group(); // レベルとか
var mainField = new Group(); // ゲームフィールド

// システム 
function format(fmt) {
  for (i = 1; i < arguments.length; i++) {
    var reg = new RegExp("\\{" + (i - 1) + "\\}", "g")
    fmt = fmt.replace(reg,arguments[i]);
  }
  return fmt;
}

var randX = function(){
	return 10 + Math.floor( Math.random()* 241 );
};
var randY = function(){
	return 20 + Math.floor( Math.random() * 121 );
};

var fallTime = function(){
	return Math.floor(3+Math.random()*5);
};
var fruitKind = function(){
	return 15+Math.floor(Math.random()*3);
};

function enterRobby(){
	socket.on('connect', function() {
		socket.emit('enter robby',{
			'nickname': prompt("enter your nickname")
		});
	});
	socket.on('robby create', function(id){
		socket.id = id.sid; b_id = id.bid; playerName = id.rname;
		waiting = true; playerNum = 1;			
	});
	socket.on('user disconected', function(data) {
		console.log('user discvonnected:', data.id);
	});
	socket.on('show robby',function(data){
		for (var i in data) console.log(i);
	});
	socket.on('robby on', function(data) {
		socket.id = data.sid;
		b_id = data.bid;
		console.log(playerName+":"+enemyName);
		if(data.rname==playerName){
			enemyName = data.cname;
		}else{
			playerName = data.cname; enemyName = data.rname;
		}
		if(playerNum == 0) playerNum = 2; 
		socket.emit('ready',{bid:b_id});
		socket.emit('disconnect',{});
	});
	
	socket.on('game start', function(data) {
		if(b_id == data.bid) game_startFlag = true;
	});
}
