Game.Screen = {};

Game.Screen.menuScreen = {
	uiParameters: null,
    enter: function() { 
    	   //this.uiParameters = Game.loadedEnvironment.
	},
    exit: function() { 
	},
    render: function(display) {
		display.drawText(0,0, "");
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
	    
	    this.addEngineProcessActors();
	    	    
	    this.uiParameters = Game.loadedEnvironment.uiScreens.playScreenUI;	    
	    
	    this.map.engine.start();	
	},
    exit: function() {
	},
	addEngineProcessActors: function() {
		this.map.addEngineProcessActor(new Game.Entity(Game.EngineLockerTemplate));
	},
	render: function(display) {
        var screenWidth = Game.screenWidth;
        var screenHeight = Game.screenHeight;

		var topLeftX = Math.max(0, this.player.x - ((screenWidth - 1) / 2)); //-1 from screenWidth/Height for even number
        topLeftX = Math.min(topLeftX, this.map.width - screenWidth);

		var topLeftY = Math.max(0, this.player.y - ((screenHeight - 1) / 2));
        topLeftY = Math.min(topLeftY, this.map.height - screenHeight)	
        
        var visibleCells = {};
        
        var currentDepth = this.map.depth; //FIXME - depth
        
        var map = this.map;        
        this.map.fov[currentDepth].compute( //FIXME - depth
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
					
					var tintForeground = 'transparent';
					var tintBackground = "rgba(1, 1, 1, 0.0)"; //passing 'transparent' has some problem
					
					if (!visibleCells[x + ',' + y]) {
						tintForeground = "rgba(1, 1, 1, 0.8)";
					} else if (x > (this.player.x + 3) || x < (this.player.x - 3) || y > (this.player.y + 3) || y < (this.player.y - 3)) { 
						tintForeground = "rgba(1, 1, 1, 0.7)";
					} else if (x > (this.player.x + 2) || x < (this.player.x - 2) || y > (this.player.y + 2) || y < (this.player.y - 2)) { 
						tintForeground = "rgba(1, 1, 1, 0.5)";
					} else if (x > (this.player.x + 1) || x < (this.player.x - 1) || y > (this.player.y + 1) || y < (this.player.y - 1)) { 
						tintForeground = "rgba(1, 1, 1, 0.3)";
					}
					
					var charactersToDraw = [];
										
					charactersToDraw.push(this.map.getTile(x, y).character);
					
					if (visibleCells[x + ',' + y]) {
					
						var items = this.map.getItemsAt(x, y);
						if (items) {
                            var item = items[items.length - 1];  //FIXME - only grabs topmost item to draw     
                            charactersToDraw.push(item.character);
                        }
						
						var entity = this.map.getEntityAt(x, y);
						if (entity) {	
							charactersToDraw.push(entity.character);
						}
					}

					display.draw(
						x - topLeftX, 
						y - topLeftY,
						charactersToDraw,
						tintForeground,
						tintBackground
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
        } else if (inputType === 'mouseup' || inputType === 'touchstart') {
			console.log('click');
        }    
    },
	move: function(directionX, directionY) {
        var newX = this.player.x + directionX; //FIXME - player
        var newY = this.player.y + directionY;
        
        this.player.tryMove(newX, newY);        
    }
}