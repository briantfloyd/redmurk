var Game =  {
    interfaceObject: null,
    display: null,
	currentScreen: null, 
    screenWidth: null,
    screenHeight: null,
    tileWidth: null, 
	init: function() {	
        this.display = new ROT.Display({
        	width: this.screenWidth, 
        	height: this.screenHeight, 
        	tileWidth: this.tileWidth, 
        	tileHeight: this.tileWidth, 
        	forceSquareRatio:true
        	});
        	
		var game = this;
		
		var bindEventToScreen = function(event) {
			window.addEventListener(event, function(e) {
				if (game.currentScreen !== null) {
					game.currentScreen.handleInput(event, e);
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
	}
}

window.onload = function() {
    if (!ROT.isSupported()) {
        alert("The rot.js library isn't supported by your browser.");
    } else {    
        Interface.init();
        
		Game.screenWidth = Interface.canvasTileWidth;
		Game.screenHeight = Interface.canvasTileHeight;
		Game.tileWidth = Interface.tilePixelWidth;
        
        Game.init();
        
        Interface.canvasContainer.appendChild(Game.display.getContainer());
        
		Game.switchScreen(Game.Screen.menuScreen);
    }
}