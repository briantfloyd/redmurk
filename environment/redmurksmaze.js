Game.RedmurksMaze = {
	map: null,
	entities: null,
	tiles: null,
	init: function() {
	},
	generateMap: function() {
		var map = [];
        var mapWidth = 50;
        var mapHeight = 50;		
		for (var x = 0; x < mapWidth; x++) {
			map.push([]);
			for (var y = 0; y < mapHeight; y++) {
				map[x].push(null);
			}
		}

		var generator = new ROT.Map.Cellular(mapWidth, mapHeight);
		generator.randomize(0.5);
		var totalIterations = 3;

		//smoothing map
		for (var i = 0; i < totalIterations - 1; i++) {
			generator.create();
		}
		//final smoothing then update
		generator.create(function(x,y,v) {
			if (v === 1) {
				map[x][y] = Game.Tile.floorTile;
			} else {
				map[x][y] = Game.Tile.wallTile;
			}
		});
		
		this.map = map;
		return this.map;
	},
	createPlayer: function() {
		this.player = new Game.Entity(Game.PlayerTemplate);
		Game.Screen.playScreen.player = this.player; //FIXME - Screens may not need this eventually
		return this.player;
	},
	addEntities: function() {
		this.createPlayer();
		Game.Screen.playScreen.map.addEntityAtRandomPosition(this.player);
		
		for (var i = 0; i < 50; i++) {
        	Game.Screen.playScreen.map.addEntityAtRandomPosition(new Game.Entity(Game.SlimeTemplate));
    	}  
	},
	initializeUI: function() {
		var uiParameters = [];
		
		var messageDisplay = {		
			type: 'display', //display or button
			x: 0,
			y: 0,
			width:(Interface.canvasTileWidth * Interface.tilePixelWidth) - (Interface.tilePixelWidth * 2),
			height: Interface.tilePixelWidth
		};
		
		var otherStatsDisplay = {		
			type: 'display',
			x: (Interface.canvasTileWidth * Interface.tilePixelWidth) - (Interface.tilePixelWidth * 2),
			y: 0,
			width: Interface.tilePixelWidth,
			height: Interface.tilePixelWidth
		};		

		var statsDisplay = {		
			type: 'display',
			x: (Interface.canvasTileWidth * Interface.tilePixelWidth) - Interface.tilePixelWidth,
			y: 0,
			width: Interface.tilePixelWidth,
			height: Interface.tilePixelWidth
		};
		
		var menuButton = {		
			type: 'button',
			text: 'Menu',
			x: 0,
			y: (Interface.canvasTileHeight * Interface.tilePixelWidth) - (Interface.tilePixelWidth * 2),
			width: Interface.tilePixelWidth,
			height: Interface.tilePixelWidth
		};
		
		var healingPotionButton = {		
			type: 'button',
			text: 'Heal',
			x: (Interface.canvasTileWidth * Interface.tilePixelWidth) - Interface.tilePixelWidth,
			y: (Interface.canvasTileHeight * Interface.tilePixelWidth) - (Interface.tilePixelWidth * 2),
			width: Interface.tilePixelWidth,
			height: Interface.tilePixelWidth
		};
		
		var pauseButton = {		
			type: 'button',
			text: 'Pause',
			x: 0,
			y: (Interface.canvasTileHeight * Interface.tilePixelWidth) - Interface.tilePixelWidth,
			width: Interface.canvasTileWidth * Interface.tilePixelWidth,
			height: Interface.tilePixelWidth
		};
		
		uiParameters.push(messageDisplay, otherStatsDisplay, statsDisplay, menuButton, healingPotionButton, pauseButton);
		
		Interface.buildUI(uiParameters);
	
	}
}




