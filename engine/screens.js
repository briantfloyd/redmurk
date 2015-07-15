Game.Screen = {};

Game.Screen.menuScreen = {
	uiParameters: null,
    enter: function() { 
    	   //this.uiParameters = Game.loadedEnvironment.
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

Game.Screen.playScreen = {
	map: null,
    player: null,
    uiParameters: null,
	enter: function() {  	    
	    this.map = new Game.Map(Game.loadedEnvironment.generateMap());
	    
	    Game.loadedEnvironment.addEntities();
	    	    
	    this.uiParameters = Game.loadedEnvironment.uiScreens.playScreenUI;	    
	    
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
        
        var visibleCells = {};
        
        var currentDepth = this.map.depth; //FIXME
        
        var map = this.map; //for call back in function below
        
        this.map.fov[currentDepth].compute( //FIXME
            this.player.x, 
            this.player.y, 
            this.player.sightRadius, 
            function(x, y, radius, visibility) {
                visibleCells[x + "," + y] = true;
                map.setExplored(x, y, true);
            });

		for (var x = topLeftX; x < topLeftX + screenWidth; x++) {
			for (var y = topLeftY; y < topLeftY + screenHeight; y++) {
				if (this.map.isExplored(x, y)) {
				//if (visibleCells[x + ',' + y]) {
					var tile = this.map.getTile(x, y);
					
					var foreground = visibleCells[x + ',' + y] ? 'white' : '#333333'; //FIXME - replace with tinting for graphic tiles
					
					display.draw(
						x - topLeftX, 
						y - topLeftY,
						tile.character,
						foreground); //FIXME - replace with tinting for graphic tiles
				}
			}
		}
        
        var entities = this.map.entities;

        for (var key in entities) {
            var entity = entities[key];
           
            if (entity.x >= topLeftX && 
            	entity.y >= topLeftY &&
                entity.x < topLeftX + screenWidth &&
                entity.y < topLeftY + screenHeight) {
                if (visibleCells[entity.x + ',' + entity.y]) {
                    display.draw(
                        entity.x - topLeftX, 
                        entity.y - topLeftY,    
                        entity.character
                    );
                }
            }
        }
        
        Game.interfaceObject.drawUI(this.uiParameters);
        		
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