window.onload = function () {
	var game = new Game(320, 320);
	game.fps = DEF_FPS;	
	
	game.rootScene.backgroundColor = "#3F7F7F";
	game.preload( item_img ,bear_img ,map_img ,wood );
	if (F_playSound) game.preload( Itemget[0] ,Itemget[1] ,Itemget[2], Itemget[3] );
	
	/* Player  */
	
	var PLAYER = enchant.Class.create(enchant.Sprite,{
	initialize: function(x,f){
		enchant.Sprite.call(this,32,32);
		this.x = x; this.y = WIN_Y - 64; this.vx = 2; this.count = 0;
		this.image = game.assets[bear_img]; this.speedLv = 1;
		
		this.frameID = (f==0)?0:5;
		this.frame = this.frameID;
		mainField.addChild(this);
		
		this.addEventListener(Event.ENTER_FRAME, function(e){
			F_bear_walk = false;
			this.count++; px = this.x;
			this.vx = 2*(this.speedLv*1.05);
			if(F_bear_walk) this.frame = this.frameID +(this.count % 3);				
			if (f==0){	
				if (game.input.left && this.x > 0){
					this.move(-this.vx); if(this.scaleX > 0) this.scaleX *= -1; 
				}
				if (game.input.right && this.x < game.height - 32 ){
					this.move(this.vx);	if(this.scaleX < 0) this.scaleX *= -1; 
				}
			}else if (f==1)this.x = ex;
		});
	},
	remove: function(){mainField.removeChild(this);},
	speedUp: function(){if(this.speedLv<5)this.speedLv += 1;},
	move: function(x){this.x += x;  F_bear_walk = true;}
});
	
	/* Player end  */
	game.onload = function () {
		var bg = new Sprite(WIN_X, WIN_Y);
		bg.backgroundColor = "#99cccc";
		bg.image = game.assets[wood];
		game.rootScene.addChild(bg);
		
		//地形の描画
		for(var i = WIN_Y; WIN_Y - 64 <= i; i = i -16){
			for(var j = 0; j < WIN_X; j = j +16){
				new MAPChip(game.assets[map_img],j, i, 32);
			} 
		}
		
		var enFruit = function(x,y,k,f){
			new FRUIT( game.assets[item_img]
		  , (F_playSound)?game.assets[Itemget[0]]:null
			, bear , enemy , x , y , k, f);
		};
		var enSpeed = function(x,y,f){
			new SPEED( game.assets[item_img]
			, (F_playSound)?game.assets[Itemget[1]]:null
			, bear , enemy , x , y , f);
		};
		var enBomb = function(x,y,f){
			new BOM( game.assets[item_img]
			, (F_playSound)?game.assets[Itemget[2]]:null 
			, (F_playSound)?game.assets[Itemget[3]]:null
			, x , y , f);
		};		
		var appFruit = function(){
			var x = randX(); var y = randY();
			var fluit = fruitKind(); var fall = fallTime();
			socket.emit('app',{ bid:b_id, type:'fluit', x:x, y:y, k:fluit, f:fall });
		  new FRUIT( game.assets[item_img]
		  , (F_playSound)?game.assets[Itemget[0]]:null
			, bear , enemy , x , y , fluit, fall);
		};
		var appSpeed = function(){
			var x = randX(); var y = randY(); var fall = fallTime();
			socket.emit('app',{bid:b_id,type:'speed',x:x, y:y, f:fall});			
			new SPEED( game.assets[item_img]
			, (F_playSound)?game.assets[Itemget[1]]:null
			, bear , enemy , x , y , fall);
		};
		var appBomb = function(){
			var x = randX(); var y = randY();	var fall = fallTime();
			socket.emit('app',{bid:b_id,type:'bom',x:x, y:y, f:fall});
		  new BOM( game.assets[item_img]
			, (F_playSound)?game.assets[Itemget[2]]:null 
			, (F_playSound)?game.assets[Itemget[3]]:null
			, x , y	, fall);
		};
		
		
		enterRobby();

		var bear = new PLAYER((playerNum==1)?72:game.width-195,0);
		var enemy = new PLAYER((playerNum==1)?game.width-195:72,1);	

		var Score = new Label();Score.y = 5;
		showSystem.addChild(Score);
	
		var deb = new Label();deb.y=50;deb.text = "部屋番号:<br>EX:<br>PN:<br>EN:";
		showSystem.addChild(deb);
		
		var deb2 = new Label();
		deb2.y=120;
		deb2.text = "Status:";
		showSystem.addChild(deb2);
				
		px = bear.x; ex = enemy.x;
		
		socket.on('move', function(data) {
			if(data.bid == b_id) ex = data.x;
		});
		socket.on('app', function(data) {
			if(data.bid == b_id){
				switch(data.type){
					case 'fluit':
						enFruit(data.x,data.y,data.k,data.f);break;
					case 'speed':
						enSpeed(data.x,data.y,data.f);break;
					case 'bom':
						enBomb(data.x,data.y,data.f);break;
					default:
						break;
				}
			}
		});
		game.addEventListener(Event.ENTER_FRAME, function (e) {
		//Status:
		deb2.text = format("Status:{0}<br>GameF:{1}",(enemyName)?enemyName:"通信待機中",game_startFlag);
			if(game_startFlag&&enemyName&&playerName){
				frameCount++;
				deb.text = format("部屋番号:{0}<br>EX:{1}<br>PN:{2}<br>EN:{3}<br>PlayerNUM:{4}",b_id,ex,playerName,enemyName,playerNum);
				if(playerNum == 1){
					if(frameCount % appleInterval == 0) appFruit();
					if(frameCount % speedInterval == 0) appSpeed();
					if(frameCount % bombInterval == 0) appBomb();
				}
				Score.text = format(
					"Score:{0}    残り時間:{1}秒<br>SpeedLv:{2}",
					gameScore,
					endTime-Math.floor(frameCount/game.fps),
					bear.speedLv
				);
				if(Math.floor(frameCount/game.fps) > endTime - 1){
					game_startFlag = false;
				}
				//Socket Send
				if(F_bear_walk) socket.emit('move', { bid: b_id, x: px });
				//Socket Receive
				//} //game.started
			}
		} );
		game.rootScene.addChild(mainField);
		game.rootScene.addChild(showSystem);
	}
	game.start();
};