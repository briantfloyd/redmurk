Game.RedmurksMaze = {
	tiles: {},
	//items: {},
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
		
		Game.display._options.tileMap[this.tiles.floorTile01.character] = [this.tiles.floorTile01.spriteSheetX, this.tiles.floorTile01.spriteSheetY];
		Game.display._options.tileMap[this.tiles.floorTile02.character] = [this.tiles.floorTile02.spriteSheetX, this.tiles.floorTile02.spriteSheetY];
		Game.display._options.tileMap[this.tiles.floorTile03.character] = [this.tiles.floorTile03.spriteSheetX, this.tiles.floorTile03.spriteSheetY];
		Game.display._options.tileMap[this.tiles.wallTile01.character] = [this.tiles.wallTile01.spriteSheetX, this.tiles.wallTile01.spriteSheetY];
		Game.display._options.tileMap[this.tiles.wallTile02.character] = [this.tiles.wallTile02.spriteSheetX, this.tiles.wallTile02.spriteSheetY];
		Game.display._options.tileMap[this.tiles.wallTile03.character] = [this.tiles.wallTile03.spriteSheetX, this.tiles.wallTile03.spriteSheetY];
		
		Game.display._options.tileMap[this.HealingPotionTemplate.character] = [this.HealingPotionTemplate.spriteSheetX, this.HealingPotionTemplate.spriteSheetY];
		Game.display._options.tileMap[this.SmallSwordTemplate.character] = [this.SmallSwordTemplate.spriteSheetX, this.SmallSwordTemplate.spriteSheetY];
		Game.display._options.tileMap[this.WoodenShieldTemplate.character] = [this.WoodenShieldTemplate.spriteSheetX, this.WoodenShieldTemplate.spriteSheetY];
		
		Game.display._options.tileMap[this.PlayerTemplate.character] = [this.PlayerTemplate.spriteSheetX, this.PlayerTemplate.spriteSheetY];
		Game.display._options.tileMap[this.SlimeTemplate.character] = [this.SlimeTemplate.spriteSheetX, this.SlimeTemplate.spriteSheetY];
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
	addEntities: function() {
		this.player = new Game.Entity(this.PlayerTemplate);
		Game.Screen.playScreen.player = this.player; //FIXME - Screens may not need this eventually - or have screens refer back to environment?
		Game.Screen.playScreen.map.addEntityAtRandomPosition(this.player);
		
		for (var i = 0; i < 50; i++) {
        	Game.Screen.playScreen.map.addEntityAtRandomPosition(new Game.Entity(this.SlimeTemplate));
    	}  
    	
    	for (var i = 0; i < 50; i++) {
        	Game.Screen.playScreen.map.addItemAtRandomPosition(new Game.Item(this.HealingPotionTemplate));
    	} 

    	for (var i = 0; i < 50; i++) {
        	Game.Screen.playScreen.map.addItemAtRandomPosition(new Game.Item(this.SmallSwordTemplate));
    	} 

    	for (var i = 0; i < 50; i++) {
        	Game.Screen.playScreen.map.addItemAtRandomPosition(new Game.Item(this.WoodenShieldTemplate));
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



Game.RedmurksMaze.Mixins = {};

Game.RedmurksMaze.Mixins.PlayerActor = {
    name: 'PlayerActor',
    groupName: 'Actor',
    act: function() {
    
    	if (this.destinationCoordinates !== null) {

			var sourceEntity = this;
			var destX = this.destinationCoordinates.x;
			var destY = this.destinationCoordinates.y;
	
			this.findPath(sourceEntity, destX, destY);
			
			//this.destinationCoordinates = null;
		
    	}
    	
    	if (this.pathCoordinates.length > 0) { 
    		this.speed = 600; //FIXME
    		this.followPath();
    	}
    },
    followPath: function () {
		var nextCoordinate = this.pathCoordinates.splice(0, 1);
		var nextCoordinateX = nextCoordinate[0].x;
		var nextCoordinateY = nextCoordinate[0].y;
	
		this.tryMove(nextCoordinateX, nextCoordinateY);
		
		if (this.pathCoordinates.length === 0) {
			this.destinationCoordinates = null;
			this.speed = 1200; //FIXME
		}
    }
}

Game.RedmurksMaze.PlayerTemplate = {
    character: '@',
	spriteSheetX: 0,
	spriteSheetY: 300,
    maxHp: 40,
    attackValue: 10,
    defenseValue: 10,
    sightRadius: 4,
    speed: 1200,
    mixins: [Game.RedmurksMaze.Mixins.PlayerActor,
    		Game.Mixins.Attacker, Game.Mixins.Destructible,
    		Game.Mixins.Sight, Game.Mixins.Equipper]
}

Game.RedmurksMaze.Mixins.SlimeActor = {
    name: 'SlimeActor',
    groupName: 'Actor'
}

Game.RedmurksMaze.SlimeTemplate = {
    character: 'S',
	spriteSheetX: 0,
	spriteSheetY: 540,
	maxHp: 10,
	speed: 100,
	tasks: ['hunt', 'wander'],
    mixins: [Game.RedmurksMaze.Mixins.SlimeActor, 
    		Game.Mixins.TaskActor, Game.Mixins.Sight,
    		Game.Mixins.Destructible, Game.Mixins.Attacker]
}


Game.RedmurksMaze.HealingPotionTemplate = {
	name: 'Healing potion',
	character: 'P',
	spriteSheetX: 0,
	spriteSheetY: 120,
	healingValue: 10,
	consumptions: 1,
	mixins: [Game.ItemMixins.HealingDose]
}

Game.RedmurksMaze.SmallSwordTemplate = {
	name: 'Small sword',
	character: 'smallsword',
	spriteSheetX: 0,
	spriteSheetY: 180,
	attackValue: 5,
	wieldable: true,
	mixins: [Game.ItemMixins.Equippable]
}

Game.RedmurksMaze.WoodenShieldTemplate = {
	name: 'Wooden shield',
	character: 'woodenshield',
	spriteSheetX: 0,
	spriteSheetY: 240,
	defenseValue: 5,
	wearable: true,
	mixins: [Game.ItemMixins.Equippable]
}