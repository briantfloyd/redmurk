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
        if (inputType === 'keydown' || inputType === 'mouseup' || inputType === 'touchstart') {
            Game.switchScreen(Game.Screen.playScreen);
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
    selectedItem: null,
	enter: function() {  	        
	    if (this.map === null) {
	    	this.map = new Game.Map(Game.loadedEnvironment.generateMap());

			Game.loadedEnvironment.addEntities();
		
			this.addEngineProcessActors();
				
			this.uiParameters = Game.loadedEnvironment.uiScreens.playScreenUI;
			
			this.map.engine.start();	
				    
	    } else {
	    	console.log('unlocking engine');
	    	this.map.engine.unlock();	
	    }
	    
	},
    exit: function() {
    	console.log('locking engine');
    	this.map.engine.lock();
	},
	addEngineProcessActors: function() {
		this.map.addEngineProcessActor(new Game.Entity(Game.EngineLockerTemplate));
	},
	render: function(display) {        
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
		
		var interfaceObject = Game.interfaceObject;	
		for (var x = this.topLeftX; x < this.topLeftX + interfaceObject.canvasTileWidth; x++) {
			for (var y = this.topLeftY; y < this.topLeftY + interfaceObject.canvasTileHeight; y++) {
				if (this.map.isExplored(x, y)) {			
					
					//default tinting - none
					var tintForeground = 'transparent';
					var tintBackground = "rgba(1, 1, 1, 0.0)"; //passing 'transparent' seems to have some problem
					
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
					if (this.selectedEntity && x === this.selectedEntity.x && y === this.selectedEntity.y) {
						tintForeground = "rgba(255, 0, 0, 0.1)";
					}
					
					//selected item tinting
					/*console.log(this.selectedItem);
					//console.log(this.selectedItem.x + "," + this.selectedItem.y);
					if (this.selectedItem && x === this.selectedItem.x && y === this.selectedItem.y) {
						console.log('here');
						tintForeground = "rgba(0, 255, 0, 0.1)";
					}*/
					
					
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
                this.player.move(-1, 0); //FIXME - player
            } else if (inputData.keyCode === ROT.VK_RIGHT) {
                this.player.move(1, 0); //FIXME - player
            } else if (inputData.keyCode === ROT.VK_UP) {
                this.player.move(0, -1); //FIXME - player
            } else if (inputData.keyCode === ROT.VK_DOWN) {
                this.player.move(0, 1); //FIXME - player
            }
        } else if (inputType === 'mouseup' || inputType === 'touchstart') {			
			var eventPosition = Game.display.eventToPosition(inputData);	
			if (eventPosition[0] >= 0 && eventPosition[1] >= 0) {
				this.clickEvaluation(eventPosition);
			}
        }    
    },
    clickEvaluation: function(eventPosition) {
   		//convert event positions to map coordinates   		
   		this.updateTopLeft();
   
   		var eventMapX = this.topLeftX + (eventPosition[0]);
   		var eventMapY = this.topLeftY + (eventPosition[1]);

   		if (this.map.getEntityAt(eventMapX, eventMapY)) {

   			this.selectedItem = null;
   			this.player.attackTarget = null;
   			
    		var clickedEntity = this.map.getEntityAt(eventMapX, eventMapY);	
    		if (clickedEntity === this.selectedEntity) {
				this.player.attackTarget = clickedEntity; //FIXME - player
    		
    		} else {
    			this.selectedEntity = clickedEntity;
    		}
    		
    	} else if (this.map.getItemsAt(eventMapX, eventMapY) && this.map.getItemsAt(eventMapX, eventMapY).length > 0) {
    		
    		this.selectedEntity = null;
   			this.player.attackTarget = null;
    		
    		var items = this.map.getItemsAt(eventMapX, eventMapY);
    		if (items[items.length - 1] === this.selectedItem) {
				var newDestinationCoordinates = {};
				newDestinationCoordinates.x = eventMapX;
				newDestinationCoordinates.y = eventMapY;
			
				this.player.destinationCoordinates = newDestinationCoordinates; //FIXME - player
				this.player.pathCoordinates = [];
    			
    		} else {
    			this.selectedItem = items[items.length - 1];
    		}
    		
    	} else if (this.map.isEmptyFloor(eventMapX, eventMapY)) {
   			
   			this.selectedEntity = null;
   			this.selectedItem = null;
   			this.player.attackTarget = null;
   			
   			var newDestinationCoordinates = {};
   			newDestinationCoordinates.x = eventMapX;
   			newDestinationCoordinates.y = eventMapY;
   			
   			this.player.destinationCoordinates = newDestinationCoordinates; //FIXME - player
   			this.player.pathCoordinates = [];

   		}  
    	
    	//is explored
    	//this.map.isExplored
    	
    	//if on player
    
    },
    updateTopLeft: function() {
   		var interfaceObject = Game.interfaceObject;	
   		var screenWidth = interfaceObject.canvasTileWidth;
        var screenHeight = interfaceObject.canvasTileHeight;

   		var newTopLeftX = Math.max(0, this.player.x - ((screenWidth - 1) / 2)); //-1 from screenWidth/Height for even number
        this.topLeftX = Math.min(newTopLeftX, this.map.width - screenWidth);

		var newTopLeftY = Math.max(0, this.player.y - ((screenHeight - 1) / 2));
        this.topLeftY = Math.min(newTopLeftY, this.map.height - screenHeight);	    

	}
}

Game.Screen.inventoryScreen = {
	//uiParameters: null,
	justViewed: true,
    enter: function() { 
    	   //this.uiParameters = Game.loadedEnvironment.
	},
    exit: function() { 
    	this.justViewed = true;
	},
    render: function(display) {
		display.drawText(0,0, "");
		console.log('inventory screen');
    },
    handleInput: function(inputType, inputData) {    
        if (inputType === 'keydown' || inputType === 'mouseup' || inputType === 'touchstart') {
            Game.switchScreen(Game.Screen.playScreen);
        }
    }
}