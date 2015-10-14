var Game =  {
    interfaceObject: null,
    display: null,
	currentScreen: null, 
    loadedEnvironment: null, 
	init: function() {
		
		var interfaceObject = Game.interfaceObject;
			
        this.display = new ROT.Display({
        	layout: 'tile',
        	width: interfaceObject.canvasTileWidth,
        	height: interfaceObject.canvasTileHeight, 
        	tileWidth: interfaceObject.tilePixelWidth,
        	tileHeight: interfaceObject.tilePixelWidth,
        	tileSet: null, //new Image(), src set by environment
        	tileMap: {}, //mapping set during entity/item/tile creation
        	forceSquareRatio:true,
			tileColorize:true
        	});    
		
		var game = this;
		var bindEventToScreen = function(event) {
			window.addEventListener(event, function(e) {
				if (game.currentScreen !== null) {
					game.currentScreen.handleInput(event, e);	
					e.preventDefault(); //to prevent mouseup/touchstart from both firing
				}
			});
		}
		bindEventToScreen('keydown');			
		bindEventToScreen('mouseup');
		bindEventToScreen('touchstart');
		
		window.addEventListener('resize', this.resizeCanvas());								
    },
	switchScreen: function(screen) {
		if (this.currentScreen !== null) {
			this.currentScreen.exit();
		}
		this.display.clear();
		this.currentScreen = screen;
		if (!this.currentScreen !== null) {
			this.currentScreen.enter();
			this.refresh();
		}
	},
	refresh: function() {
		this.display.clear();
        this.currentScreen.render(this.display);
	},
	resizeCanvas: function() {		
		var interfaceObject = Game.interfaceObject;	
		this.display.setOptions({height: interfaceObject.canvasTileHeight, width: interfaceObject.canvasTileWidth});			
	},
	saveGame: function() {
		if (!this.supportLocalStorage) {
			return false;
		} else {

		}
	},
	resumeGame: function() {
		if (!this.supportLocalStorage) {
			return false;
		} else {

		}	
	},
	supportLocalStorage: function() {
	    //check for local storage support
        if(typeof(Storage) !== "undefined") {
			return true;			
		} else {
			console.log('No Web Storage support');
			return false;
		}
	}
}

window.onload = function() {
    if (!ROT.isSupported()) {
        alert("The rot.js library isn't supported by your browser.");
    } else {             
        Game.interfaceObject = Interface;
        Game.interfaceObject.init();    
        
        Game.init(); 
        
        Game.interfaceObject.canvasContainer.appendChild(Game.display.getContainer());
        
        Game.SpecialEffects.init();
        
        Game.interfaceObject.createUICanvas();
        
        Game.loadedEnvironment = Game.RedmurksMaze;
        Game.loadedEnvironment.init();
                
		Game.switchScreen(Game.Screen.menuScreen);
    }
}