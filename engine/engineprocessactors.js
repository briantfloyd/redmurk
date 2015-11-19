// Engine Locker actor mixin
Game.Mixins.EngineLockerActor = {
    name: 'EngineLockerActor',
    groupName: 'Actor',
    act: function() {       
    	/*if (this.acting) {
    		return;
    	}
    	this.acting = true;*/
 //console.log('EngineLockerActor');	
		Game.refresh();     
		   
        //lock the engine
		Game.Screen.playScreen.engine.lock();
	
		//unlock engine after interval - 1/12 second - 83.33 miliseconds
		var mapEngine = Game.Screen.playScreen.engine;
		window.setTimeout(function(){mapEngine.unlock()}, 83); 

		//this.acting = false;
    }
};

// Game state saver actor mixin
Game.Mixins.GameStateSaverActor = {
    name: 'GameStateSaverActor',
    groupName: 'Actor',
    act: function() {       
		
		var saveData = Game.saveData;
		
		//save playscreen properties
		saveData.playScreen = {}; //reset
		saveData.playScreen.difficultySetting = Game.Screen.playScreen.difficultySetting;
		saveData.playScreen.depth = Game.Screen.playScreen.depth;
		saveData.playScreen.topLeftX = Game.Screen.playScreen.topLeftX;
		saveData.playScreen.topLeftY = Game.Screen.playScreen.topLeftY;
		saveData.playScreen.paused = Game.Screen.playScreen.paused;
		//skip other properties - allow to reset
		
		//playscreen map
		saveData.playScreen.map = this.saveMap(Game.Screen.playScreen.map);
		saveData.firstSaveTimeStamp = Game.loadedEnvironment.firstSaveTimeStamp;

		Game.saveGame();
    },
    saveMap: function(liveMap) {
		var savedMapData = {};
	
		savedMapData.width = liveMap.width;
		savedMapData.height = liveMap.height;
		//skip .fov - allow to reset
		
		//map entities
		savedMapData.entities = {}; //reset
		
		var mapEntities = liveMap.entities;
		for (var a in mapEntities) {
			savedMapData.entities[a] = {};
			
			//entity properties
			savedMapData.entities[a].templateType = mapEntities[a].templateType;
			savedMapData.entities[a].x = mapEntities[a].x;
			savedMapData.entities[a].y = mapEntities[a].y;
			//skip other properties - allow to reset
			
			//mixin check
			if (mapEntities[a].hasMixin('Destructible')) {	
				savedMapData.entities[a].maxHp = mapEntities[a].maxHp;
				savedMapData.entities[a].hp = mapEntities[a].hp;
				savedMapData.entities[a].defenseValue = mapEntities[a].defenseValue;
				//skip .restHealTimer - allow to reset
			}
			
			if (mapEntities[a].hasMixin('Attacker')) {	
				savedMapData.entities[a].attackValue = mapEntities[a].attackValue;
				//skip .attackTarget - allow to reset
			}
			
			if (mapEntities[a].hasMixin('Sight')) {	
				savedMapData.entities[a].sightRadius = mapEntities[a].sightRadius;
			}
			
			if (mapEntities[a].hasMixin('Equipper')) {			
				savedMapData.entities[a].equipped = {}; //reset
				
				//update check
				if (mapEntities[a].equipped.head) {
					savedMapData.entities[a].equipped.head = mapEntities[a].equipped.head.templateType;
				}
				
				if (mapEntities[a].equipped.body) {
					savedMapData.entities[a].equipped.body = mapEntities[a].equipped.body.templateType;
				}
				
				if (mapEntities[a].equipped.hand) {
					savedMapData.entities[a].equipped.hand = mapEntities[a].equipped.hand.templateType;
				}
				
				if (mapEntities[a].equipped.shieldhand) {
					savedMapData.entities[a].equipped.shieldhand = mapEntities[a].equipped.shieldhand.templateType;
				}
				
				if (mapEntities[a].equipped.accessory) {
					savedMapData.entities[a].equipped.accessory = mapEntities[a].equipped.accessory.templateType;
				}
			}
			
			/*
			if (mapEntities[a].hasMixin('InventoryCarrier')) {	
				savedMapData.entities[a].inventory = []; //reset
				for (var b in mapEntities[a].inventory) {				
					if (mapEntities[a].inventory[b].templateType) { //otherwise will try to save array methods as well
//console.log('saving entity inventory item: ' + mapEntities[a].inventory[b].templateType);
						savedMapData.entities[a].inventory.push(mapEntities[a].inventory[b].templateType);
					}
				}
//console.log(savedMapData.entities[a].inventory);
			}
			*/
			
			
			
			if (mapEntities[a].hasMixin('InventoryCarrier')) {	
				savedMapData.entities[a].inventory = []; //reset
				
				for (var b = 0, i = mapEntities[a].inventory.length; b < i; b++) {
					savedMapData.entities[a].inventory.push(mapEntities[a].inventory[b].templateType);
				}
			}

			
			
			
			if (mapEntities[a].hasMixin('ExperienceGainer')) {	
				savedMapData.entities[a].experiencePoints = mapEntities[a].experiencePoints;
				savedMapData.entities[a].nextExperiencePointThreshold = mapEntities[a].nextExperiencePointThreshold;
			}
		}
		
		//map items
		savedMapData.items = {}; //reset
		
		var mapItems = liveMap.items;
		for (var c in mapItems) {
			savedMapData.items[c] = {};
			savedMapData.items[c].templateType = mapItems[c].templateType;
			savedMapData.items[c].x = mapItems[c].x;
			savedMapData.items[c].y = mapItems[c].y;
		}
		
		//map explored
		savedMapData.explored = liveMap.explored;
		
		//map tiles	
		savedMapData.tiles = []; //reset
		
		for (var d = 0, e = savedMapData.width; d < e; d++) {
			savedMapData.tiles.push([]);
			for (var f = 0, g = savedMapData.height; f < g; f++) {
				savedMapData.tiles[d].push(liveMap.tiles[d][f].tileType);
			}
		}
		
		//map levelConnections
		savedMapData.levelConnections = {}; //reset
		
		for (var h in liveMap.levelConnections) {
			savedMapData.levelConnections[h] = {};
			savedMapData.levelConnections[h].templateType = liveMap.levelConnections[h].templateType;
			savedMapData.levelConnections[h].x = liveMap.levelConnections[h].x;
			savedMapData.levelConnections[h].y = liveMap.levelConnections[h].y;		
		}

		return savedMapData;    
    }
};

// Message display update actor mixin
Game.Mixins.MessageDisplayUpdateActor = {
    name: 'MessageDisplayUpdateActor',
    groupName: 'Actor',
    act: function() {       
 	
 		var player = Game.Screen.playScreen.player;
//console.log(player);		
		//play screen stats display
		Game.loadedEnvironment.uiComponents.playScreen.statsDisplay.text = [player.hp + "/" + player.maxHp, player.getAttackValue() + "|" + player.getDefenseValue(), player.experiencePoints + "|" + player.nextExperiencePointThreshold]; //FIXME - player		
		
		//play screen depth display
		Game.loadedEnvironment.uiComponents.playScreen.depthDisplay.text = [Game.Screen.playScreen.depth];				
		
		//play screen message display
		var playSelectedEntity = Game.Screen.playScreen.selectedEntity;
		var playSelectedItem = Game.Screen.playScreen.selectedItem;
		var playMessageDisplay = Game.loadedEnvironment.uiComponents.playScreen.messageDisplay;
		
		if (playSelectedEntity) {	
			playMessageDisplay.text = [playSelectedEntity.name, playSelectedEntity.hp + "/" + playSelectedEntity.maxHp, playSelectedEntity.getAttackValue() + "|" + playSelectedEntity.getDefenseValue()];
		} else if (playSelectedItem) {
			playMessageDisplay.text = [playSelectedItem.name];
		} else {
			playMessageDisplay.text = Game.Messages.getLatest(); //FIXME - temporary	
		}
		
		/*
		//inventory screen stats display
		Game.loadedEnvironment.uiComponents.inventoryScreen.statsDisplay.text = [player.hp + "/" + player.maxHp, player.getAttackValue() + "|" + player.getDefenseValue(), player.experiencePoints]; //FIXME - player		
		
		//inventory screen message display
		var inventorySelectedItem = Game.Screen.inventoryScreen.selectedItem;

		var inventoryMessageDisplay = Game.loadedEnvironment.uiComponents.inventoryScreen.messageDisplay;		

		if (inventorySelectedItem) {
			inventoryMessageDisplay.text = [inventorySelectedItem.name];
		}		
		*/

    }
};

//Engine process templates
Game.EngineLockerTemplate = {
    character: 'P01',
    race: 'engine process',
	speed: 1200,
    mixins: [Game.Mixins.EngineLockerActor]
};

Game.MessageDisplayUpdateTemplate = {
    character: 'P02',
    race: 'engine process',
	speed: 1200,
    mixins: [Game.Mixins.MessageDisplayUpdateActor]
};

Game.GameStateSaverTemplate = {
    character: 'P03',
    race: 'engine process',
	speed: 1200,
    mixins: [Game.Mixins.GameStateSaverActor]
};



