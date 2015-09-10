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
		
		Game.loadedEnvironment.uiComponents.playScreen.statsDisplay.text = [player.hp + "/" + player.maxHp, player.attackValue + "|" + player.defenseValue]; //FIXME - player		
		Game.loadedEnvironment.uiComponents.playScreen.messageDisplay.text = Game.Messages.getLatest(); //FIXME - temporary
		
		Game.loadedEnvironment.uiComponents.inventoryScreen.statsDisplay.text = [player.hp + "/" + player.maxHp, player.attackValue + "|" + player.defenseValue]; //FIXME - player		
		Game.loadedEnvironment.uiComponents.inventoryScreen.messageDisplay.text = Game.Messages.getLatest(); //FIXME - temporary

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



