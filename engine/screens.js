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
    topLeftX: null,
    topLeftY: null,
    selectedEntity: null,
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
        /*var screenWidth = Game.screenWidth;
        var screenHeight = Game.screenHeight;

		var topLeftX = Math.max(0, this.player.x - ((screenWidth - 1) / 2)); //-1 from screenWidth/Height for even number
        topLeftX = Math.min(topLeftX, this.map.width - screenWidth);

		var topLeftY = Math.max(0, this.player.y - ((screenHeight - 1) / 2));
        topLeftY = Math.min(topLeftY, this.map.height - screenHeight)	*/
        
        this.updateTopLeft();
        
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

		for (var x = this.topLeftX; x < this.topLeftX + Game.screenWidth; x++) {
			for (var y = this.topLeftY; y < this.topLeftY + Game.screenHeight; y++) {
				if (this.map.isExplored(x, y)) {			
					
					//default tinting - none
					var tintForeground = 'transparent';
					var tintBackground = "rgba(1, 1, 1, 0.0)"; //passing 'transparent' has some problem
					
					//visible / distance tinting
					if (!visibleCells[x + ',' + y]) {
						tintForeground = "rgba(1, 1, 1, 0.8)";
					} else if (x > (this.player.x + 3) || x < (this.player.x - 3) || y > (this.player.y + 3) || y < (this.player.y - 3)) { 
						tintForeground = "rgba(1, 1, 1, 0.7)";
					} else if (x > (this.player.x + 2) || x < (this.player.x - 2) || y > (this.player.y + 2) || y < (this.player.y - 2)) { 
						tintForeground = "rgba(1, 1, 1, 0.5)";
					} else if (x > (this.player.x + 1) || x < (this.player.x - 1) || y > (this.player.y + 1) || y < (this.player.y - 1)) { 
						tintForeground = "rgba(1, 1, 1, 0.3)";
					}
					
					//destination tinting
					if (this.player.destinationCoordinates && x === this.player.destinationCoordinates.x && y === this.player.destinationCoordinates.y) {
						tintForeground = "rgba(0, 255, 0, 0.1)";
					}
					
					//selected entity tinting
					//selectedEntity
					if (this.selectedEntity && x === this.selectedEntity.x && y === this.selectedEntity.y) {
						tintForeground = "rgba(255, 0, 0, 0.1)";
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
						x - this.topLeftX, 
						y - this.topLeftY,
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
            	this.player.speed = 1200; //FIXME
                this.move(-1, 0);
            } else if (inputData.keyCode === ROT.VK_RIGHT) {
                this.player.speed = 1200; //FIXME
                this.move(1, 0);
            } else if (inputData.keyCode === ROT.VK_UP) {
                this.player.speed = 1200; //FIXME
                this.move(0, -1);
            } else if (inputData.keyCode === ROT.VK_DOWN) {
                this.player.speed = 1200; //FIXME
                this.move(0, 1);
            }
        } else if (inputType === 'mouseup' || inputType === 'touchstart') {			
			var eventPosition = Game.display.eventToPosition(inputData);
			if (eventPosition[0] > 0 && eventPosition[1] > 0) {
				this.clickEvaluation(eventPosition);
			}
        }    
    },
	move: function(directionX, directionY) {
        var newX = this.player.x + directionX; //FIXME - player
        var newY = this.player.y + directionY;
        
        this.player.tryMove(newX, newY);        
    },
    clickEvaluation: function(eventPosition) {
       
   		//convert event positions to map coordinates   		
   		this.updateTopLeft();
   		
   		var eventMapX = this.topLeftX + eventPosition[0];
   		var eventMapY = this.topLeftY + eventPosition[1];

 
   		if (this.map.isEmptyFloor(eventMapX, eventMapY)) {
   		
   			var newDestinationCoordinates = {};
   			newDestinationCoordinates.x = eventMapX;
   			newDestinationCoordinates.y = eventMapY;
   			
   			this.player.destinationCoordinates = newDestinationCoordinates; //FIXME - player
   			this.player.pathCoordinates = [];
   			
   			this.selectedEntity = null;
   			
   		} else if (this.map.getEntityAt(eventMapX, eventMapY)) {
    		
    		this.selectedEntity = this.map.getEntityAt(eventMapX, eventMapY);
    		
    	}
    	
    	//if on item
    	//this.map.isEmptyFloor //checks walkable and getEntityAt
    	//this.map.getItemsAt //returns array    	
    	
    	
    	//is explored
    	//this.map.isExplored
    	
    	//if on player
    	
    	
    	
    
    },
    updateTopLeft: function() {
   		var screenWidth = Game.screenWidth;
        var screenHeight = Game.screenHeight;
        
   		var newTopLeftX = Math.max(0, this.player.x - ((screenWidth - 1) / 2)); //-1 from screenWidth/Height for even number
        this.topLeftX = Math.min(newTopLeftX, this.map.width - screenWidth);

		var newTopLeftY = Math.max(0, this.player.y - ((screenHeight - 1) / 2));
        this.topLeftY = Math.min(newTopLeftY, this.map.height - screenHeight)	    
    }
}