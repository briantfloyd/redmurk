Game.Mixins.PlayerActor = {
    name: 'PlayerActor',
    groupName: 'Actor',
    act: function() {
        Game.refresh();
        this.map.engine.lock();        
    }
}

Game.PlayerTemplate = {
    character: '@',
	spriteSheetY: 120,
    maxHp: 40,
    attackValue: 10,
    defenseValue: 10,
    sightRadius: 4,
    mixins: [Game.Mixins.PlayerActor,
    		Game.Mixins.Attacker, Game.Mixins.Destructible,
    		Game.Mixins.Sight]
}

Game.Mixins.SlimeActor = {
    name: 'SlimeActor',
    groupName: 'Actor',
    act: function() { }
}

Game.SlimeTemplate = {
    character: 'S',
	spriteSheetY: 360,
	maxHp: 10,
    mixins: [Game.Mixins.SlimeActor, Game.Mixins.WanderActor, 
    		Game.Mixins.Destructible, Game.Mixins.Attacker]
}



Game.RedmurksMaze = {
	//map: null,
	//entities: null,
	tiles: {},
	uiScreens: {},
	init: function() {
		this.initializeUI();
		this.initializeTiles();
	},
	initializeTiles: function() {
	
		this.tiles.floorTile01 = new Game.Tile({
			character: '.',
			spriteSheetX: 0,
			spriteSheetY: 0,
			walkable: true
			});

		this.tiles.floorTile02 = new Game.Tile({
			character: '.01',
			spriteSheetX: 60,
			spriteSheetY: 0,
			walkable: true
			});			

		this.tiles.floorTile03 = new Game.Tile({
			character: '.02',
			spriteSheetX: 120,
			spriteSheetY: 0,
			walkable: true
			});
			
		this.tiles.wallTile01 = new Game.Tile({
			character: '#',
			spriteSheetX: 0,
			spriteSheetY: 60,
			blocksLight: true
		});

		this.tiles.wallTile02 = new Game.Tile({
			character: '#01',
			spriteSheetX: 60,
			spriteSheetY: 60,
			blocksLight: true
		});

		this.tiles.wallTile03 = new Game.Tile({
			character: '#02',
			spriteSheetX: 120,
			spriteSheetY: 60,
			blocksLight: true
		});
		
		/*this.tiles.stairsUpTile = new Game.Tile({
			character: '<'
		});

		this.tiles.stairsDownTile = new Game.Tile({
			character: '>'
		});*/
		
		
		var tileSetImage = new Image();
		tileSetImage.src = 'environment/art/tilesheet-master-01.png';
		Game.display._options.tileSet = tileSetImage;

console.log();
console.log();
console.log();
		
		Game.display._options.tileMap[this.tiles.floorTile01.character] = [this.tiles.floorTile01.spriteSheetX, this.tiles.floorTile01.spriteSheetY];
		Game.display._options.tileMap[this.tiles.floorTile02.character] = [this.tiles.floorTile02.spriteSheetX, this.tiles.floorTile02.spriteSheetY];
		Game.display._options.tileMap[this.tiles.floorTile03.character] = [this.tiles.floorTile03.spriteSheetX, this.tiles.floorTile03.spriteSheetY];
		Game.display._options.tileMap[this.tiles.wallTile01.character] = [this.tiles.wallTile01.spriteSheetX, this.tiles.wallTile01.spriteSheetY];
		Game.display._options.tileMap[this.tiles.wallTile02.character] = [this.tiles.wallTile02.spriteSheetX, this.tiles.wallTile02.spriteSheetY];
		Game.display._options.tileMap[this.tiles.wallTile03.character] = [this.tiles.wallTile03.spriteSheetX, this.tiles.wallTile03.spriteSheetY];
		Game.display._options.tileMap[Game.PlayerTemplate.character] = [0, Game.PlayerTemplate.spriteSheetY];
		Game.display._options.tileMap[Game.SlimeTemplate.character] = [0, Game.SlimeTemplate.spriteSheetY];
	},
	generateMap: function() {
		var map = [];
        var mapWidth = 50;
        var mapHeight = 50;		
		
		//FIXME - define parameters here, but call on code in the engine
		//move below to engine
		for (var x = 0; x < mapWidth; x++) {
			map.push([]);
			for (var y = 0; y < mapHeight; y++) {
				map[x].push(null);
			}
		}

		var generator = new ROT.Map.Cellular(mapWidth, mapHeight);
		generator.randomize(0.5);
		var totalIterations = 3; //3

		//smoothing map
		for (var i = 0; i < totalIterations - 1; i++) {
			generator.create();
		}
		//final smoothing pass then update
		var environment = this;
		generator.create(function(x,y,v) {
			var tileVersion, tileVersionTile;
			if (v === 1) {
				tileVersion = Math.floor(Math.random() * 3);
				
				if (tileVersion === 0) {
					tileVersionTile = environment.tiles.floorTile01;
				} else if (tileVersion === 1) {
					tileVersionTile = environment.tiles.floorTile02;
				} else if (tileVersion === 2) {
					tileVersionTile = environment.tiles.floorTile03;	
				}

				map[x][y] = tileVersionTile;
				
			} else {
				tileVersion = Math.floor(Math.random() * 3);
				
				if (tileVersion === 0) {
					tileVersionTile = environment.tiles.wallTile01;
				} else if (tileVersion === 1) {
					tileVersionTile = environment.tiles.wallTile02;
				} else if (tileVersion === 2) {
					tileVersionTile = environment.tiles.wallTile03;	
				}

				map[x][y] = tileVersionTile;
			}
		});
		
		return map;
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
			//text: ['Menu'],
			icon: Game.interfaceObject.uiIcons.menuIcon,
			x: 0,
			y: 0,
			width: Game.interfaceObject.tilePixelWidth,
			height: Game.interfaceObject.tilePixelWidth
		}
		return displayObject;
	},
	healingPotionButton: function() {	
		var displayObject = {
			type: 'button',
			//text: ['Heal'],
			icon: Game.interfaceObject.uiIcons.healIcon,
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
			//text: ['Pause'],
			icon: Game.interfaceObject.uiIcons.pauseIcon,
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
			x: Game.interfaceObject.tilePixelWidth,
			y: 0,
			width:(Game.interfaceObject.canvasTileWidth * Game.interfaceObject.tilePixelWidth) - (Game.interfaceObject.tilePixelWidth * 2),
			height: Game.interfaceObject.tilePixelWidth,
			font: "italic 12px sans-serif",
			text: Game.Messages.getLatest() //FIXME - temporary
		}
		return displayObject;
	},
	statsDisplay: function() {		
		var displayObject = {
			type: 'display',
			/*icon: {
					health: Game.interfaceObject.uiIcons.healthIcon,
					attack: Game.interfaceObject.uiIcons.attackIcon,
					defense: Game.interfaceObject.uiIcons.defenseIcon,
				},*/
			x: (Game.interfaceObject.canvasTileWidth * Game.interfaceObject.tilePixelWidth) - Game.interfaceObject.tilePixelWidth,
			y: 0,
			width: Game.interfaceObject.tilePixelWidth,
			height: Game.interfaceObject.tilePixelWidth,
			//text: this.getStatsDisplay(Game.Screen.playScreen.player),
			font: "bold 16px sans-serif",
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
	/*getStatsDisplay: function(entity) {
	
		var newDisplay = [entity.hp + "/" + entity.maxHp, entity.attackValue + "|" + entity.defenseValue];
		
		return newDisplay;
	}*/
}




