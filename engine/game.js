var Game =  {
    interfaceObject: null,
    display: null,
	currentScreen: null, 
    screenWidth: null,
    screenHeight: null,
    tileWidth: null,
    loadedEnvironment: null, 
	init: function() {
			
        this.display = new ROT.Display({
        	layout: 'tile',
        	width: this.screenWidth, 
        	height: this.screenHeight, 
        	tileWidth: this.tileWidth, 
        	tileHeight: this.tileWidth, 
        	tileSet: null,//new Image(), src set by environment
        	tileMap: {},//mapping set by environment
        	forceSquareRatio:true,
			tileColorize:true
        	});    
        	
		var game = this;
		var bindEventToScreen = function(event) {
			window.addEventListener(event, function(e) {
				if (game.currentScreen !== null) {
					game.currentScreen.handleInput(event, e);	
					e.preventDefault(); //to mouseup/touchstart from both firing
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
		this.display.setOptions({height: this.screenHeight, width: this.screenWidth});			
		//console.log('game.resize: ' + this.screenHeight + ',' + this.screenWidth);		
	}
}

window.onload = function() {
    if (!ROT.isSupported()) {
        alert("The rot.js library isn't supported by your browser.");
    } else {    
        Game.interfaceObject = Interface;
        Game.interfaceObject.init();    
        
		Game.screenWidth = Game.interfaceObject.canvasTileWidth;
		Game.screenHeight = Game.interfaceObject.canvasTileHeight;
		Game.tileWidth = Game.interfaceObject.tilePixelWidth;
        
        Game.init(); 
        Game.interfaceObject.canvasContainer.appendChild(Game.display.getContainer());
        
        Game.interfaceObject.createUICanvas();
        
        Game.loadedEnvironment = Game.RedmurksMaze;
        Game.loadedEnvironment.init();
        
		Game.switchScreen(Game.Screen.menuScreen);
    }
}