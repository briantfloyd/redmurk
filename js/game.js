var Game =  {
    display: null,
	currentScreen: null, 
    screenWidth: 80,
    screenHeight: 24, 
	init: function() {
        this.display = new ROT.Display({width: this.screenWidth, height: this.screenHeight});
		var game = this;
		var bindEventToScreen = function(event) {
			window.addEventListener(event, function(e) {
				if (game.currentScreen !== null) {
					game.currentScreen.handleInput(event, e);
					game.display.clear();
                    game.currentScreen.render(game.display);
				}
			});
		}
		bindEventToScreen('keydown');			
		bindEventToScreen('mouseup');
		bindEventToScreen('touchstart');		
    },
	switchScreen: function(screen) {
		if (this.currentScreen !== null) {
			this.currentScreen.exit();
		}
		this.display.clear();
		this.currentScreen = screen;
		if (!this.currentScreen !== null) {
			this.currentScreen.enter();
			this.currentScreen.render(this.display);
		}
	}
}

window.onload = function() {
    if (!ROT.isSupported()) {
        alert("The rot.js library isn't supported by your browser.");
    } else {
        Game.init();
        document.body.appendChild(Game.display.getContainer());
		Game.switchScreen(Game.Screen.menuScreen);
    }
}