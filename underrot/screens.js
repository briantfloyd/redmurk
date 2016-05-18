/* Copyright (c) 2015, Brian T. Floyd. FreeBSD License. */
Game.Screen = {};

Game.Screen.menuScreen = {
	uiParameters: null,
    enter: function() { 
    	this.uiParameters = Game.loadedEnvironment.uiScreens.menuScreenUI;
	},
    exit: function() { 
	},
    render: function(display) {
		Game.interfaceObject.drawUI(this.uiParameters);
    },
    handleInput: function(inputType, inputData) {    
        if (inputType === 'mouseup' || inputType === 'touchstart') {	        		
			var eventPosition = Game.display.eventToPosition(inputData);	
			if (eventPosition[0] >= 0 && eventPosition[1] >= 0) {
				this.clickEvaluation(eventPosition);
			}
        } 
    },
    clickEvaluation: function(eventPosition) {  
    	Game.Screen.UIClickEvaluation(eventPosition, this.uiParameters);
    }
}

Game.Screen.playScreen = {
	scheduler: null,
	engine: null,
	map: null, //individual (current) level
    player: null, //FIXME - move to environment?
    difficultySetting: null, //setting in newGameScreen //2, //FIXME - move elsewhere eventually? 1, 2, 3, 4 scale
    depth: 0, //FIXME should this be here?
    uiParameters: null,
    topLeftX: null,
    topLeftY: null,
    selectedEntity: null,
    selectedItem: null,
	paused: false,
	enter: function(saveData) { //optional parameter passed in on resume saved game    
	    this.selectedEntity = null; //FIXME - best place for this? intended to address mobs remaining selected after death and resurrection on another level
		this.selectedItem = null; //FIXME - same as above - inventory items remain selected after exiting inventory
	    
	    if (this.map === null) {
			this.scheduler = new ROT.Scheduler.Speed();
			this.engine = new ROT.Engine(this.scheduler); 
			
			Game.loadedEnvironment.setMapParameters();
			
			//if resuming saved game
			if (saveData) {
				this.resumeSavedGameLevel(saveData); //assigns map to this.map
			} else {
				this.loadLevel(); //assigns map to this.map
			}
			
			this.map.addEngineProcessActor(new Game.Entity(Game.EngineLockerTemplate));
			this.map.addEngineProcessActor(new Game.Entity(Game.MessageDisplayUpdateTemplate));
			this.map.addEngineProcessActor(new Game.Entity(Game.GameStateSaverTemplate));
			
			this.uiParameters = Game.loadedEnvironment.uiScreens.playScreenUI;
			
			//FIXME? move into else statement above, or does player need to be added after engineprocess actors for some reason?
			if (!saveData) { //if resuming - player added in resumeSavedGameLevel
				this.player = new Game.Entity(Game.loadedEnvironment.PlayerTemplate); //FIXME - move creation back to environment
				this.map.addEntityAtRandomPosition(this.player);
			}
			
			this.engine.start(); //FIXME - must be after player creation due to player dependencies	
			
	    } else if (this.paused === false) {
	    	console.log('unlocking engine');
			this.engine.unlock();
	    }	    			
	},
    exit: function() {
    	if (this.paused === false) {
    		console.log('locking engine');
			this.engine.lock();
		}
		
		Game.SpecialEffects.clearCanvas(); //FIXME? centralize?
	},
	render: function(display) {        
        Game.Screen.updateTopLeft();
        
        //clear special effects canvas 
		Game.SpecialEffects.clearCanvas(); //FIXME? centralize?
        
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
		
		var entityLocations = []; //for entity stat overlay drawing
		
		for (var x = this.topLeftX; x < this.topLeftX + interfaceObject.canvasTileWidth; x++) {
			for (var y = this.topLeftY; y < this.topLeftY + interfaceObject.canvasTileHeight; y++) {
				if (this.map.isExplored(x, y)) {			
					
					//default tinting - none
					//
					//tintForeground = "rgb(255, 0, 0)";
					//var tintForeground = "rgba(1, 1, 1, 0.0)";
					//
					
					//var tintBackground = "rgb(255, 0, 0)";
					//var tintBackground = "rgba(0,0,255,0.3)"; //works - so know it is possible
					//var tintForeground = "rgba(0,0,255,0.3)"; //why doesnt this
					//var tintForeground = "#000000";
					
					
					var tintForeground = 'transparent';
					var tintBackground = "rgba(1, 1, 1, 0.0)"; //passing 'transparent' seems to have some problem
					
					//visible / distance tinting
					if (!visibleCells[x + ',' + y]) {
						tintBackground = "rgba(1,1,1,0.8)";
					} else if (x > (this.player.x + 3) || x < (this.player.x - 3) || y > (this.player.y + 3) || y < (this.player.y - 3)) { //FIXME - player
						tintBackground = "rgba(1,1,1,0.7)";
					} else if (x > (this.player.x + 2) || x < (this.player.x - 2) || y > (this.player.y + 2) || y < (this.player.y - 2)) { 
						tintBackground = "rgba(1,1,1,0.5)";
					} else if (x > (this.player.x + 1) || x < (this.player.x - 1) || y > (this.player.y + 1) || y < (this.player.y - 1)) { 
						tintBackground = "rgba(1, 1, 1, 0.3)";
						//console.log('red tinting');
						//var tintForeground = "rgba(255,0,0,0.7)";
						//tintForeground = "rgb(255, 0, 0)";
						//tintBackground = "rgb(255, 0, 0))";
					}// else{
					//	var tintForeground = "rgba(1,1,1,0.0)";
					//}
					
					
					//FIXME - convert belowto background
					
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
						
						var levelConnection = this.map.getLevelConnectionAt(x, y);
						
						if (levelConnection) {
							charactersToDraw.push(levelConnection.character);
						}
						
						var items = this.map.getItemsAt(x, y);				
						if (items) {
                            var item = items[items.length - 1];  //FIXME - only grabs topmost item to draw     
                            charactersToDraw.push(item.character);
                        }
						
						var entity = this.map.getEntityAt(x, y);
						if (entity) {	
							charactersToDraw.push(entity.character);
							
							//save location for entity stat overlay drawing
							//FIXME - add qualifying parameters - distance, hostile, etc.
							var entityLocationCoordinates = {};
							entityLocationCoordinates.x = x;
							entityLocationCoordinates.y = y;
							entityLocationCoordinates.entity = entity;
							entityLocations.push(entityLocationCoordinates);
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

		//draw entity stat overlay
		if (entityLocations.length > 0) {
		
			var ctx = Game.SpecialEffects.specialEffectsCanvas.getContext("2d");
			var nextEntityX, nextEntityY, nextEntity, fontSize, healthPercentage;
			
			var iconSize = 20;
			
			var valueTextLength, marginHorizontal, marginVertical, entityAttackValue, entityDefenseValue, entityHealthValue;
			
			for (var a = 0, b = entityLocations.length; a < b; a++) {
				nextEntityX = (entityLocations[a].x - this.topLeftX) * interfaceObject.tilePixelWidth;
				nextEntityY = ((entityLocations[a].y - this.topLeftY) * interfaceObject.tilePixelWidth) + interfaceObject.tilePixelWidth - iconSize;
				nextEntity = entityLocations[a].entity;
				
				ctx.fillStyle = "rgba(255, 255, 255, 1.0)";				
				fontSize = 12;
				ctx.font = fontSize + "px sans-serif";

				//attack value
				entityAttackValue = nextEntity.getAttackValue();				
				valueTextLength = ctx.measureText(entityAttackValue).width;
				marginHorizontal = (iconSize - valueTextLength) / 2;
				marginVertical = (iconSize - fontSize) / 2; //only need to calculate this once
				
				ctx.drawImage(interfaceObject.uiIcons.attackIcon, nextEntityX, nextEntityY, iconSize, iconSize);
				ctx.fillText(entityAttackValue,nextEntityX + marginHorizontal, nextEntityY + fontSize + marginVertical);
				nextEntityX += iconSize;
				
				//defense value
				entityDefenseValue = nextEntity.getDefenseValue();				
				valueTextLength = ctx.measureText(entityDefenseValue).width;
				marginHorizontal = (iconSize - valueTextLength) / 2;	
				
				ctx.drawImage(interfaceObject.uiIcons.defenseIcon, nextEntityX, nextEntityY, iconSize, iconSize);
				ctx.fillText(entityDefenseValue,nextEntityX + marginHorizontal, nextEntityY + fontSize + marginVertical);
				nextEntityX += iconSize;	
				
				//health value
				healthPercentage = nextEntity.hp / nextEntity.maxHp;
				if (healthPercentage < .33) {
					ctx.fillStyle = "rgba(255, 0, 0, 1.0)";
				} else if (healthPercentage < .66) {
					ctx.fillStyle = "rgba(252, 171, 0, 1.0)";
				}
				
				entityHealthValue = nextEntity.hp.toString();				
				valueTextLength = ctx.measureText(entityHealthValue).width;
				marginHorizontal = (iconSize - valueTextLength) / 2;	
				
				ctx.drawImage(interfaceObject.uiIcons.healthIcon, nextEntityX, nextEntityY, iconSize, iconSize);
				ctx.fillText(entityHealthValue,nextEntityX + marginHorizontal, nextEntityY + fontSize + marginVertical);
			}
		}
		
		//draw UI    
        interfaceObject.drawUI(this.uiParameters);
	},
    handleInput: function(inputType, inputData) {
        if (inputType === 'keydown') {
        	Game.Screen.inventoryScreen.viewed = null;
        	
            if (inputData.keyCode === ROT.VK_LEFT) {
                this.player.tryMove(this.player.x -1, this.player.y); //FIXME - player
            } else if (inputData.keyCode === ROT.VK_RIGHT) {
                this.player.tryMove(this.player.x + 1, this.player.y);
            } else if (inputData.keyCode === ROT.VK_UP) {
                this.player.tryMove(this.player.x, this.player.y - 1);
            } else if (inputData.keyCode === ROT.VK_DOWN) {
                this.player.tryMove(this.player.x, this.player.y + 1);
            }
        } else if (inputType === 'mouseup' || inputType === 'touchstart') {			
			var eventPosition = Game.display.eventToPosition(inputData);	
			if (eventPosition[0] >= 0 && eventPosition[1] >= 0) {
				this.clickEvaluation(eventPosition);
			}
        }    
    },
    clickEvaluation: function(eventPosition) {	  		
   		
   		var componentClicked = Game.Screen.UIClickEvaluation(eventPosition, this.uiParameters);
 		
   		if (componentClicked === false) {
			//convert event positions to map coordinates 
			Game.Screen.updateTopLeft();
		
			var eventMapX = this.topLeftX + (eventPosition[0]);
			var eventMapY = this.topLeftY + (eventPosition[1]);

			var clickedEntity = this.map.getEntityAt(eventMapX, eventMapY);
			if (clickedEntity) {

				this.selectedItem = null;
				this.player.attackTarget = null;
				
				if (clickedEntity === this.player) {
					Game.switchScreen(Game.Screen.inventoryScreen);
				} else if (clickedEntity === this.selectedEntity) {
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
			
			} else if (this.map.getTile(eventMapX, eventMapY) && this.map.getTile(eventMapX, eventMapY).walkable) { //NOTE - Can't use Map.isEmptyFloor - because it includes level connection check, and entity check was performed above
			
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
    	}
    },
    pauseToggle: function() {
		if(this.paused === true) {
			console.log('unlocking engine');
			this.engine.unlock();
			this.paused = false;
		} else {
			console.log('locking engine');
			this.engine.lock();				
			this.paused = true;
		}
    },
    newLevel: function(necessaryConnections, sendingLevelConnection) { //sendingLevelConnection optional, not used when creating initial map or for resurrect map
		var newMap;
		
		//FIXME? consolidate repeated code
console.log(necessaryConnections);		
		//initial level 0 map (& post resurrect on level 0 map)
		if (necessaryConnections.down && !necessaryConnections.back && !necessaryConnections.up) {
			
			var newStairsDown, newStairsDownPosition;
			
			while (!newStairsDownPosition) {
				console.log('generating new map and down connection');
				newMap = new Game.Map(Game.MapGenerator.generateMap(Game.loadedEnvironment.mapParameters));
				newMap.scheduler = this.scheduler;
				newMap.engine = this.engine;
				
				//stairs down
				newStairsDown = new Game.LevelConnection(Game.loadedEnvironment.StairsDownTemplate);
				newStairsDownPosition = newMap.addLevelConnectionAtRandomPosition(newStairsDown);
			}
		}

		//other level 0 maps
		else if (necessaryConnections.down && necessaryConnections.back && !necessaryConnections.up) {
			
			var newStairsDown, newStairsDownPosition, newStairsBack, newStairsBackPosition;
			
			while (!newStairsDownPosition || !newStairsBackPosition) {
				console.log('generating new map and receiving and down connections');
				newMap = new Game.Map(Game.MapGenerator.generateMap(Game.loadedEnvironment.mapParameters));
				newMap.scheduler = this.scheduler;
				newMap.engine = this.engine;
				
				//stairs back
				if (sendingLevelConnection.direction === 'down') {
					newStairsBack = new Game.LevelConnection(Game.loadedEnvironment.StairsUpTemplate); 
				} else {
					newStairsBack = new Game.LevelConnection(Game.loadedEnvironment.StairsDownTemplate);
				}
				
				newStairsBackPosition = newMap.addLevelConnectionAtRandomPosition(newStairsBack);
				
				//stairs down
				newStairsDown = new Game.LevelConnection(Game.loadedEnvironment.StairsDownTemplate);
				newStairsDownPosition = newMap.addLevelConnectionAtRandomPosition(newStairsDown);
			}
			
			newStairsBack.connectingLevel = this.map;
			newStairsBack.connectingLevelX = sendingLevelConnection.x;
			newStairsBack.connectingLevelY = sendingLevelConnection.y;
			
			//add new receiving level connection coordinates to sending level connection for back and forth travel
			sendingLevelConnection.connectingLevelX = newStairsBackPosition.x;
			sendingLevelConnection.connectingLevelY = newStairsBackPosition.y;  				
		}		

		//other level maps
		else if (necessaryConnections.down && necessaryConnections.back && necessaryConnections.up) {
			
			var newStairsDown, newStairsDownPosition, newStairsBack, newStairsBackPosition, newStairsUp, newStairsUpPosition;
			
			while (!newStairsDownPosition || !newStairsBackPosition || !newStairsUpPosition) {
				console.log('generating new map and receiving and down and up connections');
				newMap = new Game.Map(Game.MapGenerator.generateMap(Game.loadedEnvironment.mapParameters));
				newMap.scheduler = this.scheduler;
				newMap.engine = this.engine;
				
				//stairs back
				if (sendingLevelConnection.direction === 'down') {
					newStairsBack = new Game.LevelConnection(Game.loadedEnvironment.StairsUpTemplate); 
				} else {
					newStairsBack = new Game.LevelConnection(Game.loadedEnvironment.StairsDownTemplate);
				}
				
				newStairsBackPosition = newMap.addLevelConnectionAtRandomPosition(newStairsBack);
				
				//stairs down
				newStairsDown = new Game.LevelConnection(Game.loadedEnvironment.StairsDownTemplate);
				newStairsDownPosition = newMap.addLevelConnectionAtRandomPosition(newStairsDown);
				
				//stairs up
				newStairsUp = new Game.LevelConnection(Game.loadedEnvironment.StairsUpTemplate);
				newStairsUpPosition = newMap.addLevelConnectionAtRandomPosition(newStairsUp);
			}
			
			newStairsBack.connectingLevel = this.map;
			newStairsBack.connectingLevelX = sendingLevelConnection.x;
			newStairsBack.connectingLevelY = sendingLevelConnection.y;
			
			//add new receiving level connection coordinates to sending level connection for back and forth travel
			sendingLevelConnection.connectingLevelX = newStairsBackPosition.x;
			sendingLevelConnection.connectingLevelY = newStairsBackPosition.y; 
		}
		
		//other level (post resurrect) maps
		else if (necessaryConnections.down && !necessaryConnections.back && necessaryConnections.up) {
			
			var newStairsDown, newStairsDownPosition, newStairsUp, newStairsUpPosition;

			while (!newStairsDownPosition || !newStairsUpPosition) {
				console.log('generating new map and down and up connections');
				newMap = new Game.Map(Game.MapGenerator.generateMap(Game.loadedEnvironment.mapParameters));
				newMap.scheduler = this.scheduler;
				newMap.engine = this.engine;

				//stairs down
				newStairsDown = new Game.LevelConnection(Game.loadedEnvironment.StairsDownTemplate);
				newStairsDownPosition = newMap.addLevelConnectionAtRandomPosition(newStairsDown);
				
				//stairs up
				newStairsUp = new Game.LevelConnection(Game.loadedEnvironment.StairsUpTemplate);
				newStairsUpPosition = newMap.addLevelConnectionAtRandomPosition(newStairsUp);
			}
		}
		
		
		return newMap;
    },
    loadLevel: function(levelConnection) { //levelConnection - optional parameter
		//update depth
    	if (levelConnection && levelConnection.direction === 'up') {
    		this.depth--;
    	} else {
    		this.depth++;
    	}
		console.log('new depth: ' + this.depth);	
    	
    	//if no levelConnection passed (new game, player resurrect) or no connectingLevel 
    	if (!levelConnection || levelConnection && !levelConnection.connectingLevel) {
    		
    		var necessaryConnections = {};
    		necessaryConnections.back = true;
			necessaryConnections.down = true;
			necessaryConnections.up = false;
				
    		if (!levelConnection) {
				necessaryConnections.back = false;
    		}
    		
    		if (this.depth > 1) {
				necessaryConnections.up = true;
			}
    		
    		//create new level
    		var newLevel;
    		if (levelConnection) {
    			newLevel = this.newLevel(necessaryConnections, levelConnection);
    		} else {
    			newLevel = this.newLevel(necessaryConnections);
    		}

			//add entities
			Game.loadedEnvironment.addEntities(newLevel);
			
			if (levelConnection && !levelConnection.connectingLevel) {
				//save new level reference in sending level connection so it knows where it's going in future
				levelConnection.connectingLevel = newLevel; 
  
				//clear level connections two nodes distant
				levelConnection.connectingLevel.distantLevelConnectionPurge();
			}
			
			//set new playscreen map
    		this.map = newLevel;
			
    	} else { //if levelConnection.connectingLevel true
    		
    		//set new playscreen map
    		this.map = levelConnection.connectingLevel;
    	}
    },
    resumeSavedGameLevel: function (saveData) { 
    	
    	Game.loadedEnvironment.firstSaveTimeStamp = saveData.firstSaveTimeStamp;
    	this.depth = saveData.playScreen.depth;
    	
    	var mapData = saveData.playScreen.map;
    	
		//create new level map (cycles through saveData recreating tiles
		var newMap = new Game.Map(Game.MapGenerator.reGenerateMap(mapData));
		newMap.scheduler = Game.Screen.playScreen.scheduler;
		newMap.engine = Game.Screen.playScreen.engine;
		
		//update map properties
		newMap.explored = mapData.explored;

		//cycle through and add saved level connections  	
		var savedLevelConnections = mapData.levelConnections;
		var nextLevelConnection;
		var nextLevelConnectionTemplateType;
	
		for (var a in savedLevelConnections) {		
			nextLevelConnectionTemplateType = savedLevelConnections[a].templateType;				
			nextLevelConnection = new Game.LevelConnection(Game.loadedEnvironment[nextLevelConnectionTemplateType]);	
			newMap.addLevelConnection(savedLevelConnections[a].x, savedLevelConnections[a].y, nextLevelConnection);	
		}

		//cycle through and add saved entities
		var savedEntities = mapData.entities;
		var nextEntity;
		
		for (var b in savedEntities) {
			//new entity
			nextEntity = new Game.Entity(Game.loadedEnvironment[savedEntities[b].templateType]);	
			
			if (savedEntities[b].templateType === 'PlayerTemplate') {
				Game.Screen.playScreen.player = nextEntity;
			}	
			
			//update entity properties with saved values
			nextEntity.x = savedEntities[b].x;
			nextEntity.y = savedEntities[b].y;
			
			//mixin check
			if (nextEntity.hasMixin('Destructible')) {	
				nextEntity.maxHp = savedEntities[b].maxHp;
				nextEntity.hp = savedEntities[b].hp;
				nextEntity.defenseValue = savedEntities[b].defenseValue;
			}
		
			if (nextEntity.hasMixin('Attacker')) {	
				nextEntity.attackValue = savedEntities[b].attackValue;
			}
		
			if (nextEntity.hasMixin('Sight')) {	
				nextEntity.sightRadius = savedEntities[b].sightRadius;
			}
		
			if (nextEntity.hasMixin('Equipper')) {			
				nextEntity.equipped = {}; //reset
			
				//update check
				if (savedEntities[b].equipped.head) {
					nextEntity.equipped.head = new Game.Item(Game.loadedEnvironment[savedEntities[b].equipped.head]);
				}
			
				if (savedEntities[b].equipped.body) {
					nextEntity.equipped.body = new Game.Item(Game.loadedEnvironment[savedEntities[b].equipped.body]);
				}
			
				if (savedEntities[b].equipped.hand) {
					nextEntity.equipped.hand = new Game.Item(Game.loadedEnvironment[savedEntities[b].equipped.hand]);
				}
			
				if (savedEntities[b].equipped.shieldhand) {
					nextEntity.equipped.shieldhand = new Game.Item(Game.loadedEnvironment[savedEntities[b].equipped.shieldhand]);
				}
			
				if (savedEntities[b].equipped.accessory) {
					nextEntity.equipped.accessory = new Game.Item(Game.loadedEnvironment[savedEntities[b].equipped.accessory]);
				}
			}
		
			if (nextEntity.hasMixin('InventoryCarrier')) {	
				nextEntity.inventory = []; //reset

//FIXME - issue may be due to reading empty inventory of newly created entity as opposed to save object data
/*console.log(savedEntities[b]);
				for (var c in savedEntities[b].inventory) {	
console.log(c);
console.log(savedEntities[b].inventory[c].templateType)
					if (savedEntities[b].inventory[c].templateType) { //otherwise will try to save array methods as well
						nextEntity.inventory.push(new Game.Item(Game.loadedEnvironment[savedEntities[b].inventory[c].templateType]));
					}
				}
	console.log(nextEntity.inventory);	*/
	
			
//console.log(savedEntities[b].inventory);
				var nextInventoryItem;
				for (var c = 0, e = savedEntities[b].inventory.length; c < e; c++) {
					//nextInventoryItem = savedEntities[b].inventory[c].templateType;
					nextInventoryItem = savedEntities[b].inventory[c];
//console.log(savedEntities[b].inventory[c]);
//console.log(nextInventoryItem);
					nextEntity.inventory.push(new Game.Item(Game.loadedEnvironment[nextInventoryItem]));
				
				}
//console.log(nextEntity.inventory);				

			}
		
			if (nextEntity.hasMixin('ExperienceGainer')) {	
				nextEntity.experiencePoints = savedEntities[b].experiencePoints;
				nextEntity.nextExperiencePointThreshold = savedEntities[b].nextExperiencePointThreshold;
			}					

			//addEntity to map
			newMap.addEntity(nextEntity);
		}	
		
		//cycle through and add saved items
		var savedItems = mapData.items;
		var nextItem;
		
		for (var d in savedItems) {
//console.log(savedItems[d]);		
			//multiple items may be at single coordinate
			for (var e = 0, f = savedItems[d].length; e < f; e++) {
				nextItem = new Game.Item(Game.loadedEnvironment[savedItems[d][e].templateType]);
//console.log(nextItem);
//console.log(savedItems[d][e].x);
//console.log(savedItems[d][e].y);				
				newMap.addItem(savedItems[d][e].x, savedItems[d][e].y, nextItem);
			}
		}
				
    	//set new playscreen map
    	this.map = newMap; //initiate
    }
}

Game.Screen.inventoryScreen = {
	uiParameters: null,
	justViewed: true,
	displayedItems: [],
	displaysFirstItemsDisplayed: {
			inventory: 0,
			ground: 0,
			equipped: 0
	},
	selectedItem: null,
    enter: function() { 
    	   this.uiParameters = Game.loadedEnvironment.uiScreens.inventoryScreenUI;
	},
    exit: function() { 
    	this.justViewed = true;
    	//Game.loadedEnvironment.uiComponents.inventoryScreen.messageDisplay.content = [['']]; //FIXME? Right place to be clearing this display?
	},
    render: function(display) {
    	var player = Game.Screen.playScreen.player; //FIXME - player
    	
    	this.displayedItems = []; //reset

		//UPDATE STAT DISPLAY
		Game.loadedEnvironment.setStatsDisplayContent();
		
		//message display
		var inventorySelectedItem = this.selectedItem;

		var inventoryMessageDisplay = Game.loadedEnvironment.uiComponents.inventoryScreen.messageDisplay;		

		if (inventorySelectedItem) {
			//inventoryMessageDisplay.text = [inventorySelectedItem.name];
			inventoryMessageDisplay.content = [[inventorySelectedItem.name]];
		} else {
			//inventoryMessageDisplay.text = [''];
			inventoryMessageDisplay.content = [['']];
		}	
		
    	//DRAW UI
		var interfaceObject = Game.interfaceObject;		
		interfaceObject.drawUI(this.uiParameters);

		//DRAW ITEMS OVER UI
		//equipped display area
		this.equippedItems = [];
		for (var x in Game.Screen.playScreen.player.equipped) {
			if (Game.Screen.playScreen.player.equipped[x]) {
				this.equippedItems.push(Game.Screen.playScreen.player.equipped[x]);
			}
		}
		this.equippedItemsDisplayArea = Game.loadedEnvironment.uiComponents.inventoryScreen.equippedDisplay;
		this.equippedDisplayFirstItemDisplayed = this.displaysFirstItemsDisplayed.equipped;
		
		//inventory display area
		this.inventoryItems = Game.Screen.playScreen.player.inventory;
		this.inventoryItemsDisplayArea = Game.loadedEnvironment.uiComponents.inventoryScreen.inventoryDisplay;
		this.inventoryDisplayFirstItemDisplayed = this.displaysFirstItemsDisplayed.inventory;
		
		//ground display area
		this.groundItems = Game.Screen.playScreen.map.getItemsAt(player.x, player.y);
		this.groundItemsDisplayArea = Game.loadedEnvironment.uiComponents.inventoryScreen.groundDisplay;
		this.groundDisplayFirstItemDisplayed = this.displaysFirstItemsDisplayed.ground;
		
		var itemGroups= [
			[this.groundItems,this.groundItemsDisplayArea,this.groundDisplayFirstItemDisplayed], 
			[this.inventoryItems,this.inventoryItemsDisplayArea,this.inventoryDisplayFirstItemDisplayed],
			[this.equippedItems,this.equippedItemsDisplayArea,this.equippedDisplayFirstItemDisplayed]
		];

		//loop through display areas drawing appropriate items
		var spriteSheet = Game.display._options.tileSet;
		var tilePixelWidth = interfaceObject.tilePixelWidth;
		var ctx = interfaceObject.uiCanvas.getContext("2d");
		
		for (var i = 0, j = itemGroups.length; i < j; i++) {

			var displayArea = itemGroups[i][1];

			//how many display positions are available
			var displayAreaPositions = (displayArea.width * displayArea.height) / tilePixelWidth;
			
			//where to begin drawing on UI canvas
			var displayAreaNextPositionX = displayArea.x;
			var displayAreaNextPositionY = displayArea.y;			

			var items = itemGroups[i][0];

			if (items) {	
				var characterToDraw, itemImageX, itemImageY, newDisplayedItem;

				for (var l = itemGroups[i][2], m = items.length; l < m; l++) {
								
					//break out if no more available display positions
					if (l >= displayAreaPositions) { break;}
					
					characterToDraw = items[l].character;	
					itemImageY = items[l].spriteSheetY;
					itemImageX = items[l].spriteSheetX;
				
					//drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
					ctx.drawImage(spriteSheet, itemImageX, itemImageY, tilePixelWidth, tilePixelWidth, displayAreaNextPositionX, displayAreaNextPositionY, tilePixelWidth, tilePixelWidth);				
					
					//selected item tinting	
					if (items[l] === this.selectedItem) {
						ctx.fillStyle = "rgba(0, 255, 0, 0.1)";
						ctx.fillRect(displayAreaNextPositionX,displayAreaNextPositionY,tilePixelWidth,tilePixelWidth);
					}
					
					//add to displayed (visible) items (used for click evaluation)
					newDisplayedItem = {};
					newDisplayedItem.x = displayAreaNextPositionX;
					newDisplayedItem.y = displayAreaNextPositionY;
					newDisplayedItem.item = items[l];
					newDisplayedItem.itemsArrayPosition = l;
					this.displayedItems.push(newDisplayedItem);
					
					//check if another display position to the right exists, or go down to next row
					if ((displayAreaNextPositionX + tilePixelWidth) < displayArea.width) {
						displayAreaNextPositionX += tilePixelWidth;
					} else {
						displayAreaNextPositionY += tilePixelWidth;
						displayAreaNextPositionX = displayArea.x;
					}
				}		
			}	
		}
    },
    handleInput: function(inputType, inputData) {    
        if (inputType === 'mouseup' || inputType === 'touchstart') {	        		
			var eventPosition = Game.display.eventToPosition(inputData);	
			if (eventPosition[0] >= 0 && eventPosition[1] >= 0) {
				this.clickEvaluation(eventPosition);
			}
        } 
    },
    clickEvaluation: function(eventPosition) {
    	var componentClicked = Game.Screen.UIClickEvaluation(eventPosition, this.uiParameters);
    	
    	if (componentClicked === false) {
    		this.displayedItemClickEvaluation(eventPosition);    	
    	}
    },	
    itemDisplayScroll: function(display, displayType, direction, items) {
    	var tilePixelWidth = Game.interfaceObject.tilePixelWidth;
		var firstItemsDisplayed = this.displaysFirstItemsDisplayed;
    	if (direction === "up" && firstItemsDisplayed[displayType] > 0) {
    		firstItemsDisplayed[displayType] = firstItemsDisplayed[displayType] - (display.width  / tilePixelWidth);
    	
    	} else if (direction === "down") {
    		var player = Game.Screen.playScreen.player; //FIXME - player
    		
    		if (items && firstItemsDisplayed[displayType] + (display.width  / tilePixelWidth) <= items.length) { //FIXME - need to limit when no more items to display
    			firstItemsDisplayed[displayType] = firstItemsDisplayed[displayType] + (display.width  / tilePixelWidth);
    		}
    	}
    	this.render();    	
    },
    displayedItemClickEvaluation: function(eventPosition) {
		var tilePixelWidth = Game.interfaceObject.tilePixelWidth;	
		var clickX = eventPosition[0] * tilePixelWidth;
		var clickY = eventPosition[1] * tilePixelWidth;
		var itemClicked = false;
	
		var displayedItems = this.displayedItems;
	
		//loop through displayed items checking for position match
		for (var i = 0, j = displayedItems.length; i < j; i++) {
		
			//if within item boundary coordinates
			if (clickX >= displayedItems[i].x && clickX < (displayedItems[i].x + tilePixelWidth) && clickY >= displayedItems[i].y && clickY < (displayedItems[i].y + tilePixelWidth)) { 
				this.selectedItem = displayedItems[i].item;
				itemClicked = true;
				break;
			}
		}
		
		if (itemClicked === false) {
			this.selectedItem = null;
		} 
		
		this.render();    
	},
	itemInventoryGroundSwap: function(item, entity) {
		
		if (item && entity) {
		
			var positionX = entity.x;
			var positionY = entity.y;
		
			var groundItems = Game.Screen.playScreen.map.items[positionX + ',' + positionY];
			
			//check if item is ground item first - likely shorter list
			if (groundItems) {
				for (var x = 0, y = groundItems.length; x < y; x++){ 
		
					if (groundItems[x] === item) {
						
						//remove from ground
						groundItems.splice(x,1);	
						
						//add to inventory
						entity.inventory.push(item);		
						
						//Game.Screen.playScreen.map.setItemsAt(positionX, positionY, groundItems);	
						
						//reset ground - delete everything at position
						delete Game.Screen.playScreen.map.items[positionX + ',' + positionY];
						
						//cycle through remaining items and add back
						for (var i = 0, j = groundItems.length; i < j; i++) {
							Game.Screen.playScreen.map.addItem(positionX, positionY, groundItems[i]);
						}

						return;
					}				
				}
			}
			
			//now check ground if not already returned out
			var inventoryItems = entity.inventory;
			
			for (var i = 0, j = inventoryItems.length; i < j; i++) {
			
				if (inventoryItems[i] === item) {
					
					//remove item from entity inventory
					inventoryItems.splice(i,1);

					//add item to ground
					/*if (groundItems) {
						groundItems.push(item);
					} else{
						groundItems = [item];
					}
				
					Game.Screen.playScreen.map.setItemsAt(positionX, positionY, groundItems);*/	
					
					Game.Screen.playScreen.map.addItem(positionX, positionY, item);
					
					return;								
				}
			}			
		}
	},
	itemInventoryEquippedSwap: function(item, entity) {

		if (item && item.equippable && entity) {
			
			//check if item is equipped item first - likely shorter list
			for (var x in entity.equipped) {
				if (entity.equipped[x] === item) {
				
					//remove item from equipped
					entity.equipped[x] = null;
					
					//add item to inventory
					entity.inventory.push(item);
					return;
				}
			}
			
			//now check inventory if not already returned out
			for (var i = 0, j = entity.inventory.length; i < j; i++) {
			
				if (entity.inventory[i] === item) {
					
					//remove item from entity inventory
					entity.inventory.splice(i,1);
					
					//check if something already equipped
					if (entity.equipped[item.equippable]) {
						
						//move previously equipped item back to inventory
						entity.inventory.push(player.equipped[item.equippable]);	
					}
					
					//equip new item
					entity.equipped[item.equippable] = item;
					return;								
				}
			}			
		}
	}
}

Game.Screen.loadGameScreen = {
	uiParameters: null,
	savedGames: [],
	displayedSavedGames: [],
	firstSavedGameDisplayed: 0,
	selectedSavedGame: null,
    enter: function() { 
    	   this.uiParameters = Game.loadedEnvironment.uiScreens.loadGameScreenUI;
    	   this.selectedSavedGame = null; //reset
	},
    exit: function() { 
	},
    render: function(display) {
    	var player = Game.Screen.playScreen.player; //FIXME - player
    	
    	this.savedGames = []; //reset
    	this.displayedSavedGames = []; 
    	
    	//DRAW UI
		var interfaceObject = Game.interfaceObject;		
		interfaceObject.drawUI(this.uiParameters);
		
		//localStorage.clear(); //temp - saved game deletion
		
		//indentify saved games, add to array	
		var keyMatch;
		for (var x in localStorage) {
			//console.log(localStorage[x]);

			keyMatch = true;
			for (var y = 0, z = Game.loadedEnvironment.gameKey.length; y < z; y++) {	
				//console.log(x[y] + " - " + Game.loadedEnvironment.gameKey[y]);
				
				//if any letter at the start of the localStorage object name does not match the game key, break out and move on to next localStorage item
				if (x[y] != Game.loadedEnvironment.gameKey[y]) { 
					//console.log('key mismatch');
					keyMatch = false;
					break;
				}
			}
			
			if (keyMatch) {
				//console.log('key match');
				this.savedGames.push(x);
			}
		}
		
		if (this.savedGames.length > 0) {
		
			//draw identified saved games over UI display area
			var spriteSheet = Game.display._options.tileSet;
			var tilePixelWidth = interfaceObject.tilePixelWidth;
			var ctx = interfaceObject.uiCanvas.getContext("2d");

			var savedGameDisplayArea = Game.loadedEnvironment.uiComponents.loadGameScreen.savedGameDisplay;

			//how many display positions are available
			var displayAreaPositions = savedGameDisplayArea.height / tilePixelWidth;
		
			//where to begin drawing on UI canvas
			var displayAreaNextPositionX = savedGameDisplayArea.x;
			var displayAreaNextPositionY = savedGameDisplayArea.y;	
		
			//for (var a = 0, b = this.savedGames.length; a < b; a++) {
			for (var a = this.firstSavedGameDisplayed, b = this.savedGames.length; a < b; a++) {
				//console.log(this.savedGames[a]);
			
				//break out if no more available display positions
				if (a >= displayAreaPositions ) { break;}

				ctx.fillStyle = "rgba(255, 255, 255, 1.0)"; //FIXME - shouldn't this be housed in interface.js?
				ctx.font = "12px sans-serif";

				var textX = displayAreaNextPositionX;// + (savedGameDisplayArea.width / 2) - (ctx.measureText(this.savedGames[a]).width / 2);
				var textY = displayAreaNextPositionY + tilePixelWidth;// + (ctx.measureText(this.savedGames[a]).height / 2);
		
				ctx.fillText(this.savedGames[a],textX,textY);					
				
								
				//selectedSavedGame tinting	
				if (this.savedGames[a] === this.selectedSavedGame) {
					ctx.fillStyle = "rgba(0, 255, 0, 0.1)";
					ctx.fillRect(displayAreaNextPositionX,displayAreaNextPositionY,savedGameDisplayArea.width,tilePixelWidth);
				}
			
				//add to displayed (visible) saved games (used for click evaluation)
				var newDisplayedSavedGame = {};
				newDisplayedSavedGame.x = displayAreaNextPositionX;
				newDisplayedSavedGame.y = displayAreaNextPositionY;
				newDisplayedSavedGame.savedGame = this.savedGames[a];
				this.displayedSavedGames.push(newDisplayedSavedGame);
				
				displayAreaNextPositionY += tilePixelWidth;
			}
		}
		
		//FIXME - saved game display details player name, depth, difficulty setting, and time stamp of last save

		
		
    },
    handleInput: function(inputType, inputData) {    
        if (inputType === 'mouseup' || inputType === 'touchstart') {	        		
			var eventPosition = Game.display.eventToPosition(inputData);	
			if (eventPosition[0] >= 0 && eventPosition[1] >= 0) {
				this.clickEvaluation(eventPosition);
			}
        } 
    },
    clickEvaluation: function(eventPosition) {
    	var componentClicked = Game.Screen.UIClickEvaluation(eventPosition, this.uiParameters);
    	
    	if (componentClicked === false) {
    		this.displayedSavedGameClickEvaluation(eventPosition);    	
    	}
    },	
    savedGameDisplayScroll: function(/*display, displayType, */direction/*, items*/) {
    	if (direction === "up" && this.firstSavedGameDisplayed > 0) {
    		this.firstSavedGameDisplayed--;
    	
    	} else if (direction === "down") {
    		this.firstSavedGameDisplayed++;
    	}
    	this.render();    	
    },
    displayedSavedGameClickEvaluation: function(eventPosition) {
		var tilePixelWidth = Game.interfaceObject.tilePixelWidth;	
		var clickX = eventPosition[0] * tilePixelWidth;
		var clickY = eventPosition[1] * tilePixelWidth;
		
		var savedGameClicked = false;

		//loop through displayed items checking for position match
		for (var i = 0, j = this.displayedSavedGames.length; i < j; i++) {
		
			var savedGameDisplayWidth = Game.loadedEnvironment.uiComponents.loadGameScreen.savedGameDisplay.width;
			
			//if within item boundary coordinates
			if (clickX >= this.displayedSavedGames[i].x && clickX < (this.displayedSavedGames[i].x + savedGameDisplayWidth) && clickY >= this.displayedSavedGames[i].y && clickY < (this.displayedSavedGames[i].y + tilePixelWidth)) {
				this.selectedSavedGame = this.displayedSavedGames[i].savedGame;
				savedGameClicked = true;
				break;
			}
		}
		
		if (savedGameClicked === false) {
			this.selectedSavedGame = null;
		} 
		
		this.render();    
	}
}



Game.Screen.statAssignmentScreen = {
	uiParameters: null,
	statRaising: null,
    enter: function() { 
    	this.uiParameters = Game.loadedEnvironment.uiScreens.statAssignmentScreenUI;
	},
    exit: function() { 
	},
    render: function(display) {
    	var player = Game.Screen.playScreen.player; //FIXME - player
		
		var currentAttackDisplay = Game.loadedEnvironment.uiComponents.statAssignmentScreen.attackCurrentValueDisplay;
		currentAttackDisplay.content = [[(player.attackValue).toString()]];
		
		var currentDefenseDisplay = Game.loadedEnvironment.uiComponents.statAssignmentScreen.defenseCurrentValueDisplay;
		currentDefenseDisplay.content = [[(player.defenseValue).toString()]];
		
		var currentHpDisplay = Game.loadedEnvironment.uiComponents.statAssignmentScreen.hpCurrentValueDisplay;		
		currentHpDisplay.content = [[(player.maxHp).toString()]];
		
		/*var newAttackDisplay = Game.loadedEnvironment.uiComponents.statAssignmentScreen.attackNewValueDisplay;
		newAttackDisplay.content = null;
		
		var newDefenseDisplay = Game.loadedEnvironment.uiComponents.statAssignmentScreen.defenseNewValueDisplay;
		newDefenseDisplay.content = null;
		
		var newHpDisplay = Game.loadedEnvironment.uiComponents.statAssignmentScreen.hpNewValueDisplay;
		newHpDisplay.content = null;*/
		
		if (this.statRaising) {
			switch(this.statRaising){
				case "attack":
					//newAttackDisplay.content = [[(player.attackValue + 1).toString()]];
					currentAttackDisplay.content = [[(player.attackValue + 1).toString()]];
					break;
				case "defense":
					//newDefenseDisplay.content = [[(player.defenseValue + 1).toString()]];
					currentDefenseDisplay.content = [[(player.defenseValue + 1).toString()]];
					break;
				case "health":
					//newHpDisplay.content = [[(player.maxHp + 1).toString()]];
					currentHpDisplay.content = [[(player.maxHp + 1).toString()]];
					break;
			}
		}
		
    	//DRAW UI
		var interfaceObject = Game.interfaceObject;		
		interfaceObject.drawUI(this.uiParameters);

    },
    handleInput: function(inputType, inputData) {    
        if (inputType === 'mouseup' || inputType === 'touchstart') {	        		
			var eventPosition = Game.display.eventToPosition(inputData);	
			if (eventPosition[0] >= 0 && eventPosition[1] >= 0) {
				this.clickEvaluation(eventPosition);
			}
        } 
    },
    clickEvaluation: function(eventPosition) {
    	//Game.Screen.UIClickEvaluation(eventPosition, this.uiParameters);
		var clickedAButton = Game.Screen.UIClickEvaluation(eventPosition, this.uiParameters);
		if (!clickedAButton) {
			this.statRaising = null;
			this.render();
		}
    },
    statAssignment: function() {
    	var player = Game.Screen.playScreen.player;
    	
    	switch(this.statRaising){
			case "attack":
				player.attackValue++;
				break;
			case "defense":
				player.defenseValue++;
				break;
			case "health":
				player.maxHp++;
				break;
			default:
				console.log('No matching stat assignment');
		}
		this.statRaising = null;
    }
}

Game.Screen.mapScreen = {
	uiParameters: null,
	statRaising: null,
    enter: function() { 
    	this.uiParameters = Game.loadedEnvironment.uiScreens.mapScreenUI;
	},
    exit: function() { 
	},
    render: function(display) {
    	var map = Game.Screen.playScreen.map;
    	
    	//map width & height    	
    	var tiles = map.tiles;
    	var tilesWidth = tiles.length;
    	var tilesHeight = tiles[0].length;
    	
    	//canvas width & height in pixels
    	var interfaceObject = Game.interfaceObject;
    	var canvasPixelWidth = interfaceObject.canvasContainer.offsetWidth;
    	var canvasPixelHeight = interfaceObject.canvasContainer.offsetHeight;
    	
    	//map screen tile pixel dimensions - minimum canvas width/height in pixels divided by maximum canvas width/height in tiles
    	var mapScreenTilePixelWidth = Math.floor(Math.min(canvasPixelWidth, canvasPixelHeight) / Math.max(tilesWidth, tilesHeight));
    	
    	//vertical/horizontal centering adjustment
    	var verticalCenteringAdjustment = Math.floor((canvasPixelHeight - (tilesHeight * mapScreenTilePixelWidth)) / 2);
    	var horizontalCenteringAdjustment = Math.floor((canvasPixelWidth - (tilesWidth * mapScreenTilePixelWidth)) / 2);
    	
    	//player position
    	var player = Game.Screen.playScreen.player; //FIXME - player
    	var playerX = player.x;
    	var playerY = player.y;
    	
    	var ctx = Game.SpecialEffects.specialEffectsCanvas.getContext("2d");
    	ctx.fillStyle = "rgba(160, 160, 160, 1.0)";
    	
    	var tileX, tileY;
   	
    	for (var i = 0; i < tilesWidth; i++) {
    		for (var j = 0; j < tilesHeight; j++) {
   			
    			tileX = (i * mapScreenTilePixelWidth);// + horizontalCenteringAdjustment;
				tileY = (j * mapScreenTilePixelWidth);// + verticalCenteringAdjustment;
    			
    			//draw square if walkable tile
    			if (tiles[i][j].walkable) {		
					ctx.fillStyle = "rgba(96, 96, 96, 1.0)";
					ctx.fillRect(tileX, tileY, mapScreenTilePixelWidth, mapScreenTilePixelWidth);
    			}
    			
    			/*//highlight explored tiles
    			if (map.isExplored(i, j)) { //FIXME - includes visible wall tiles, need to rethink order and shades of fills
 					ctx.fillStyle = "rgba(160, 160, 160, .5)";
 					ctx.fillRect(tileX, tileY, mapScreenTilePixelWidth, mapScreenTilePixelWidth);   			
    			}*/

    			//draw level connection positions //temporary or keep? only shown if in explored region?
    			if (map.getLevelConnectionAt(i, j)) {					
					ctx.fillStyle = "rgba(51, 51, 255, 1.0)";
					ctx.fillRect(tileX, tileY, mapScreenTilePixelWidth, mapScreenTilePixelWidth);
    			}
    			
    			//draw player position
    			if (i === playerX && j === playerY) {					
					ctx.fillStyle = "rgba(0, 255, 0, 1.0)";
					ctx.fillRect(tileX, tileY, mapScreenTilePixelWidth, mapScreenTilePixelWidth);
    			}
    		}
    	}
    	
    	//DRAW UI
		//var interfaceObject = Game.interfaceObject;		
		interfaceObject.drawUI(this.uiParameters);

    },
    handleInput: function(inputType, inputData) {    
        if (inputType === 'mouseup' || inputType === 'touchstart') {	        		
			var eventPosition = Game.display.eventToPosition(inputData);	
			if (eventPosition[0] >= 0 && eventPosition[1] >= 0) {
				this.clickEvaluation(eventPosition);
			}
        } 
    },
    clickEvaluation: function(eventPosition) {
    	Game.Screen.UIClickEvaluation(eventPosition, this.uiParameters);
    }
}

Game.Screen.playerDeathScreen = {
	uiParameters: null,
    enter: function() { 
    	this.uiParameters = Game.loadedEnvironment.uiScreens.playerDeathScreenUI;
		},
    exit: function() { 
	},
    render: function(display) {
    	//var player = Game.Screen.playScreen.player; //FIXME - player

    	//DRAW UI
		var interfaceObject = Game.interfaceObject;		
		interfaceObject.drawUI(this.uiParameters);
    },
    handleInput: function(inputType, inputData) {    
        if (inputType === 'mouseup' || inputType === 'touchstart') {	        		
			var eventPosition = Game.display.eventToPosition(inputData);	
			if (eventPosition[0] >= 0 && eventPosition[1] >= 0) {
				this.clickEvaluation(eventPosition);
			}
        } 
    },
    clickEvaluation: function(eventPosition) {
    	Game.Screen.UIClickEvaluation(eventPosition, this.uiParameters);
    }
}

Game.Screen.confirmScreen = {
	uiParameters: null,
	confirmationMessage: null,
	confirmationCommandObject: null, //object with method to execute
	confirmationCommandMethod: null, //function to execute
	confirmationCommandParameters: null, //parameters to pass into function
	returnScreen: null,
    enter: function() { 
    	this.uiParameters = Game.loadedEnvironment.uiScreens.confirmScreenUI;    	
	},
    exit: function() { 
    	this.reset();
	},
    render: function(display) {
		//set confirmation message
		Game.loadedEnvironment.uiComponents.confirmScreen.confirmMessageDisplay.content = this.confirmationMessage;
		
    	//DRAW UI
		var interfaceObject = Game.interfaceObject;		
		interfaceObject.drawUI(this.uiParameters);
    },
    handleInput: function(inputType, inputData) {    
        if (inputType === 'mouseup' || inputType === 'touchstart') {	        		
			var eventPosition = Game.display.eventToPosition(inputData);	
			if (eventPosition[0] >= 0 && eventPosition[1] >= 0) {
				this.clickEvaluation(eventPosition);
			}
        } 
    },
    clickEvaluation: function(eventPosition) {
    	Game.Screen.UIClickEvaluation(eventPosition, this.uiParameters);
    },
    reset: function() {
    	this.confirmationMessage = null;
    	this.confirmationCommandObject = null;
    	this.confirmationCommandMethod = null;
    	this.confirmationCommandParameters = null;
    	this.returnScreen = null;
    }
}

Game.Screen.newGameScreen = {
	uiParameters: null,
	difficultySelection: 2,//null, //FIXME? manually setting default value here and on button in environment
    enter: function() { 
    	this.uiParameters = Game.loadedEnvironment.uiScreens.newGameScreenUI;
	},
    exit: function() { 
		Game.Screen.UIclearSelectedComponents(this.uiParameters);
		this.difficultySelection = null;
	},
	setDifficultySetting: function(difficulty) {
		switch(difficulty) {
			case 'easy':
				this.difficultySelection = 1;
				break;
			case 'medium':
				this.difficultySelection = 2;
				break;
			case 'hard':
				this.difficultySelection = 3;
				break;
			case 'nightmare':
				this.difficultySelection = 4;
				break;
			default:
				this.difficultySelection = null;
				break;
		}		
	},
	difficultySelected: function() {
		return this.difficultySelection;
	},
    render: function(display) {
    	//DRAW UI
		var interfaceObject = Game.interfaceObject;		
		interfaceObject.drawUI(this.uiParameters);
    },
    handleInput: function(inputType, inputData) {    
        if (inputType === 'mouseup' || inputType === 'touchstart') {	        		
			var eventPosition = Game.display.eventToPosition(inputData);	
			if (eventPosition[0] >= 0 && eventPosition[1] >= 0) {
				this.clickEvaluation(eventPosition);
			}
        } 
    },
    clickEvaluation: function(eventPosition) {
    	//Game.Screen.UIClickEvaluation(this, eventPosition, this.uiParameters);	
		var clickedAButton = Game.Screen.UIClickEvaluation(eventPosition, this.uiParameters);
		if (!clickedAButton) {
			this.difficultySelection = null;
			this.render();
		}
    }
}

Game.Screen.updateTopLeft = function() {
   		var interfaceObject = Game.interfaceObject;	
   		var screenWidth = interfaceObject.canvasTileWidth;
        var screenHeight = interfaceObject.canvasTileHeight;
        
        var playScreen = Game.Screen.playScreen; //FIXME? - play screen dependent

   		var newTopLeftX = Math.max(0, playScreen.player.x - ((screenWidth - 1) / 2)); //-1 from screenWidth/Height for even number
        playScreen.topLeftX = Math.min(newTopLeftX, playScreen.map.width - screenWidth);

		var newTopLeftY = Math.max(0, playScreen.player.y - ((screenHeight - 1) / 2));
        playScreen.topLeftY = Math.min(newTopLeftY, playScreen.map.height - screenHeight);	    
}

Game.Screen.UIClickEvaluation = function(eventPosition, uiParameters) {
	var tilePixelWidth = Game.interfaceObject.tilePixelWidth;	
	var clickX = eventPosition[0] * tilePixelWidth;
	var clickY = eventPosition[1] * tilePixelWidth;
	var componentClicked = false;
	
	//clear current selection 
	Game.Screen.UIclearSelectedComponents(uiParameters);
	
	//loop through UI components checking for position match
	for (var i = 0, j = uiParameters.length; i < j; i++) {
		
		//if within button boundary coordinates
		if (clickX >= uiParameters[i].x && clickX < (uiParameters[i].x + uiParameters[i].width) && clickY >= uiParameters[i].y && clickY < (uiParameters[i].y + uiParameters[i].height)) { 
			if (uiParameters[i].clickAction) {
				uiParameters[i].clickAction();
				componentClicked = true;
			}
		}
	}
	return componentClicked;               
}

Game.Screen.UIclearSelectedComponents = function(uiParameters) {
	for (var i = 0, j = uiParameters.length; i < j; i++) {
		if (uiParameters[i].hasOwnProperty('selected')) {
			uiParameters[i].selected = false;
		}
	}
}	
