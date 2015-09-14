// Engine Locker actor mixin
Game.Mixins.EngineLockerActor = {
    name: 'EngineLockerActor',
    groupName: 'Actor',
    act: function() {       
    	/*if (this.acting) {
    		return;
    	}
    	this.acting = true;*/
 	
		Game.refresh();     
		   
        //lock the engine
        this.map.engine.lock();
	
		//unlock engine after interval - 1/12 second - 83.33 miliseconds
		var mapEngine = this.map.engine;
		window.setTimeout(function(){mapEngine.unlock()}, 83); 
		
		//this.acting = false;
    }
};

// Message display update actor mixin
Game.Mixins.MessageDisplayUpdateActor = {
    name: 'MessageDisplayUpdateActor',
    groupName: 'Actor',
    act: function() {       
 	
 		var player = Game.Screen.playScreen.player;
		
		//play screen stats display
		Game.loadedEnvironment.uiComponents.playScreen.statsDisplay.text = [player.hp + "/" + player.maxHp, player.getAttackValue() + "|" + player.getDefenseValue(), player.experiencePoints]; //FIXME - player		
		
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



