/* Copyright (c) 2015, Brian T. Floyd. FreeBSD License. */
var Game =  {
    interfaceObject: null,
    display: null,
	currentScreen: null, 
    loadedEnvironment: null,
    saveData: {}, 
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
	switchScreen: function(screen, options) { //'options' optional parameter //only used for passing saved game data to entering playScreen
		if (this.currentScreen !== null) {
			this.currentScreen.exit();
		}
		this.display.clear();
		this.currentScreen = screen;
		if (!this.currentScreen !== null) {
			if (options) {
				this.currentScreen.enter(options);
			} else {
				this.currentScreen.enter();
			}
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
			//check if game has been saved previously
			if (!Game.loadedEnvironment.firstSaveTimeStamp) {
				Game.loadedEnvironment.firstSaveTimeStamp = new Date().getTime();			
			}
			
			Game.loadedEnvironment.currentSaveTimeStamp = new Date().getTime();
			
			//saved game key
			var savedGameKey = Game.loadedEnvironment.gameKey + "-" + Game.loadedEnvironment.firstSaveTimeStamp;
			
			localStorage.setItem(savedGameKey, JSON.stringify(Game.saveData));
		}
	},
	resumeGame: function(selectedSavedGame) {
		if (!this.supportLocalStorage) {
			return false;
		} else {
			//var resumedGame = JSON.parse(localStorage.getItem('redmurksave01'));	
			var resumedGame = JSON.parse(localStorage.getItem(selectedSavedGame));
	
			/*Game.Screen.playScreen.scheduler = null;
			Game.Screen.playScreen.engine = null;
			Game.Screen.playScreen.map = null;*/
			//Game.loadedEnvironment.firstSaveTimeStamp = null;
			
			Game.switchScreen(Game.Screen.playScreen,resumedGame);
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
        
        Game.interfaceObject.createUIBackCanvas();
		Game.interfaceObject.createUICanvas();

		//default 'clear' method in refresh method only fills with background color
		//hide display canvas so it isn't obscuring background canvas when in use
		Game.display.getContainer().style.visibility = "hidden";
		
        Game.loadedEnvironment.init();
                
		//Game.switchScreen(Game.Screen.menuScreen);
    }
}