Game.Screen = {};

Game.Screen.menuScreen = {
    enter: function() {    
	},
    exit: function() { 
	},
    render: function(display) {
		display.drawText(0,0, "@");
    },
    handleInput: function(inputType, inputData) {
        if (inputType === 'keydown') {
            if (inputData.keyCode === ROT.VK_RETURN) {
                Game.switchScreen(Game.Screen.playScreen);
            }
        } else if (inputType === 'mouseup' || inputType === 'touchstart') {
			console.log('click');
        }
    }
}

//FIXME - move map generation details elsewhere so this can remain more template like
Game.Screen.playScreen = {
	map: null,
    player: null,
	enter: function() {  
		var map = [];
        var mapWidth = 50;
        var mapHeight = 50;		
		for (var x = 0; x < mapWidth; x++) {
			map.push([]);
			for (var y = 0; y < mapHeight; y++) {
				map[x].push(null);
			}
		}

		var generator = new ROT.Map.Cellular(mapWidth, mapHeight);
		generator.randomize(0.5);
		var totalIterations = 3;

		//smoothing map
		for (var i = 0; i < totalIterations - 1; i++) {
			generator.create();
		}
		//final smoothing then update
		generator.create(function(x,y,v) {
			if (v === 1) {
				map[x][y] = Game.Tile.floorTile;
			} else {
				map[x][y] = Game.Tile.wallTile;
			}
		});

	    this.player = new Game.Entity(Game.PlayerTemplate);
	    this.map = new Game.Map(map, this.player);
	    this.map.engine.start();		
	},
    exit: function() {
	},
	render: function(display) {
        var screenWidth = Game.screenWidth;
        var screenHeight = Game.screenHeight;

		var topLeftX = Math.max(0, this.player.x - ((screenWidth - 1) / 2)); //-1 from screenWidth/Height for even number
        topLeftX = Math.min(topLeftX, this.map.width - screenWidth);
        
		var topLeftY = Math.max(0, this.player.y - ((screenHeight - 1) / 2));
        topLeftY = Math.min(topLeftY, this.map.height - screenHeight)	

		for (var x = topLeftX; x < topLeftX + screenWidth; x++) {
			for (var y = topLeftY; y < topLeftY + screenHeight; y++) {
				var tile = this.map.getTile(x, y);
				display.draw(
					x - topLeftX, 
					y - topLeftY,
					tile.character);
			}
		}
        
        var entities = this.map.entities;
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            if (entity.x >= topLeftX && entity.y >= topLeftY &&
                entity.x < topLeftX + screenWidth &&
                entity.x < topLeftY + screenHeight) {
                display.draw(
                    entity.x - topLeftX, 
                    entity.y - topLeftY,    
                    entity.character
                );
            }
        }		
	},
    handleInput: function(inputType, inputData) {
        if (inputType === 'keydown') {
            if (inputData.keyCode === ROT.VK_LEFT) {
                this.move(-1, 0);
            } else if (inputData.keyCode === ROT.VK_RIGHT) {
                this.move(1, 0);
            } else if (inputData.keyCode === ROT.VK_UP) {
                this.move(0, -1);
            } else if (inputData.keyCode === ROT.VK_DOWN) {
                this.move(0, 1);
            }
            this.map.engine.unlock();
        } else if (inputType === 'mouseup' || inputType === 'touchstart') {
			console.log('click');
        }    
    },
	move: function(directionX, directionY) {
        var newX = this.player.x + directionX;
        var newY = this.player.y + directionY;
        this.player.tryMove(newX, newY, this.map);        
    }
}