var FRUIT = enchant.Class.create(enchant.Sprite,{
	initialize: function(img,sound,pl,en,x,y,pframe,fall){
		enchant.Sprite.call(this,16,16);
		this.x = x; this.y = y; this.image = img;
		this.frame = pframe;	this.score = 0;
		switch(pframe){
			case 15:
				this.score = 10;
				break;
			case 16:
				this.score = 15;
				break;
			case 17:
				this.score = 20;
				break;
			case 18:
				this.score = 30;
				break;
			default:
				break;
		}
		this.vy = 2; this.count = 0; this.count_fall = 0;
		this.F_fall = false; this.fallTime = fall;
		this.addEventListener(Event.ENTER_FRAME, function(e){
			this.count++;
			if(this.F_fall){
				this.count_fall++;
				if(this.count_fall < DEF_FPS || F_appleFall){
					this.x += Math.sin(this.count_fall)*5;
					this.y += Math.cos(this.count_fall);
				}else{
					this.vy *= 1.05; this.y += this.vy;
				}
				if(F_appleFall) F_appleFall = false;
			}else{
				if(this.count > DEF_FPS*2 || F_appleFall){
					this.F_fall = true;
				}
			}
			if(this.y > WIN_Y-32) this.remove();
			if(this.x>pl.x-5&&this.x<pl.x+37&&this.y>pl.y-5&&this.y<pl.y+37) this.get(pl,sound);
			if(this.x>en.x-5&&this.x<en.x+37&&this.y>en.y-5&&this.y<en.y+37) this.enget(en,sound);
		});
		mainField.addChild(this);
	},
	remove: function(){
		mainField.removeChild(this);
	},
	get: function(pl,sound){
		gameScore += this.score;
		if (F_playSound){var se = sound.clone();se.play();}
		mainField.removeChild(this);
	},
	enget: function(en,sound){
		enemyScore += this.score;
		if (F_playSound){var se = sound.clone();se.play();}
		mainField.removeChild(this);
	}
});
//スピードアップ
var SPEED = enchant.Class.create(enchant.Sprite,{
	initialize: function(img,sound,pl,en,x,y,fall){
		enchant.Sprite.call(this,16,16);
		this.x = x; this.y = y; this.image = img;
		this.frame = 64;
		this.vy = 2; this.count = 0; this.count_fall = 0;
		this.F_fall = false; this.fallTime = fall;
		this.addEventListener(Event.ENTER_FRAME, function(e){
			this.count++;
			if( this.F_fall ){
				this.count_fall++;
				if( this.count_fall < DEF_FPS || F_appleFall ){
					this.x += Math.sin(this.count_fall)*5;
					this.y += Math.cos(this.count_fall);
				}else{
					this.vy *= 1.05; this.y += this.vy;
				}
				if( F_appleFall ) F_appleFall = false;
			}else{
				if( this.count > DEF_FPS*2 || F_appleFall ) this.F_fall = true;
			}
			if( this.y > WIN_Y-32 ) this.remove();
			if( this.x > pl.x-5 && this.x < pl.x + 32+5 && this.y > pl.y-5 && this.y < pl.y + 32+5 ) this.get(pl,sound);
			if( this.x > en.x-5 && this.x < en.x + 32+5 && this.y > en.y-5 && this.y < en.y + 32+5 ) this.enget(en,sound);
		});
		mainField.addChild(this);
	},
	remove: function(){
		mainField.removeChild(this);
	},
	get: function(pl,sound){
		pl.speedUp(); gameScore += 5;
		if(F_playSound){var se = sound.clone();se.play();}
		mainField.removeChild(this);
	},
	enget: function(en,sound){
		en.speedUp(); enemyScore += 5;
		if(F_playSound){var se = sound.clone();se.play();}
		mainField.removeChild(this);
	}
});
	//Bomb
var BOM = enchant.Class.create(enchant.Sprite,{
	initialize: function(img,sound,ds,x,y,fall){
		enchant.Sprite.call(this,16,16);
		this.x = x; this.y = y; this.image = img;
		this.frame = 25; this.count = 0; this.pframe = 1;
		if(F_playSound){var se = sound.clone();se.play();}
    this.Life = fall;
		this.addEventListener(Event.ENTER_FRAME, function(e){
			this.count++;
			if ( this.count % 10 == 0){
				this.pframe *= -1; this.frame = this.frame + this.pframe;
			}
			if (this.count > this.Life * DEF_FPS) this.remove(ds);
		});
		mainField.addChild(this);
	},
	remove: function(ds){
		if(F_playSound){var se = ds.clone();se.play();}
		F_appleFall = true;
		mainField.removeChild(this);
	}
});

var MAPChip = enchant.Class.create(enchant.Sprite,{
	initialize: function(img,x,y,pframe){
		enchant.Sprite.call(this,16,16);
		this.x = x; this.y = y; this.image = img;
		this.frame = pframe;
		mainField.addChild(this);
	}
});