Game.RedmurksMaze = {
	map: null,
	entities: null,
	tiles: null,
	uiScreens: {},
	init: function() {
		this.initializeUI();
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
		
		uiParameters.push(this.menuButton, this.healingPotionButton, this.pauseButton, this.messageDisplay, this.statsDisplay);		
		
		this.uiScreens.playScreenUI = uiParameters;	 //FIXME - update to better accommodate multiple screens
	},
	menuButton: function() {	
		var displayObject = {
			type: 'button',
			text: ['Menu'],
			x: 0,
			y: (Game.interfaceObject.canvasTileHeight * Game.interfaceObject.tilePixelWidth) - (Game.interfaceObject.tilePixelWidth * 2),
			width: Game.interfaceObject.tilePixelWidth,
			height: Game.interfaceObject.tilePixelWidth
		}
		return displayObject;
	},
	healingPotionButton: function() {	
		var displayObject = {
			type: 'button',
			text: ['Heal'],
			x: (Game.interfaceObject.canvasTileWidth * Game.interfaceObject.tilePixelWidth) - Game.interfaceObject.tilePixelWidth,
			y: (Game.interfaceObject.canvasTileHeight * Game.interfaceObject.tilePixelWidth) - (Game.interfaceObject.tilePixelWidth * 2),
			width: Game.interfaceObject.tilePixelWidth,
			height: Game.interfaceObject.tilePixelWidth
		}
		return displayObject;
	},
	pauseButton: function() {	
		var displayObject = {
			type: 'button',
			text: ['Pause'],
			x: 0,
			y: (Game.interfaceObject.canvasTileHeight * Game.interfaceObject.tilePixelWidth) - Game.interfaceObject.tilePixelWidth,
			width: Game.interfaceObject.canvasTileWidth * Game.interfaceObject.tilePixelWidth,
			height: Game.interfaceObject.tilePixelWidth
		}
		return displayObject;
	},
	messageDisplay: function() {	
			var displayObject = {
			type: 'display',
			x: 0,
			y: 0,
			width:(Game.interfaceObject.canvasTileWidth * Game.interfaceObject.tilePixelWidth) - (Game.interfaceObject.tilePixelWidth * 2),
			height: Game.interfaceObject.tilePixelWidth,
			text: Game.Messages.getLatest() //FIXME
		}
		return displayObject;
	},
	statsDisplay: function() {		
		var displayObject = {
			type: 'display',
			x: (Game.interfaceObject.canvasTileWidth * Game.interfaceObject.tilePixelWidth) - Game.interfaceObject.tilePixelWidth,
			y: 0,
			width: Game.interfaceObject.tilePixelWidth,
			height: Game.interfaceObject.tilePixelWidth,
			//text: this.getStatsDisplay(Game.Screen.playScreen.player)
			text: [Game.Screen.playScreen.player.hp + "/" + Game.Screen.playScreen.player.maxHp, Game.Screen.playScreen.player.attackValue + "|" + Game.Screen.playScreen.player.defenseValue]
		}
		return displayObject;

	},
	/*otherStatsDisplay: function() {		
		var displayObject = {
			type: 'display',
			x: (Game.interfaceObject.canvasTileWidth * Game.interfaceObject.tilePixelWidth) - (Game.interfaceObject.tilePixelWidth * 2),
			y: 0,
			width: Game.interfaceObject.tilePixelWidth,
			height: Game.interfaceObject.tilePixelWidth,
			text: [''] //Game.Messages.queue[Game.Messages.queue.length - 1]
		}
		return displayObject;

	},*/
	getStatsDisplay: function(entity) {
	
		/*var healthIcon = "♥";
		var attackIcon = "†";
		var defenseIcon = "∇";*/
		var newDisplay = [entity.hp + "/" + entity.maxHp, entity.attackValue + "|" + entity.defenseValue];
		
		return newDisplay;
	}
}




