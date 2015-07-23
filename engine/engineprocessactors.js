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

//Engine process templates
Game.EngineLockerTemplate = {
    character: 'P01',
    race: 'engine process',
	speed: 1200,
    mixins: [Game.Mixins.EngineLockerActor]
};
