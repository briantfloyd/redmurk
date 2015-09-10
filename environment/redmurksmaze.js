Game.RedmurksMaze = {
	tiles: {},
	//items: {},
	uiScreens: {},
	uiComponents: {},
	init: function() {
		this.initializeUI();
		this.initializeTiles();
	},
	initializeTiles: function() {
	
		var tilePixelWidth = Game.interfaceObject.tilePixelWidth;
	
		this.tiles.floorTile01 = new Game.Tile({
			character: '.',
			spriteSheetX: 0, //multiple applied to Game.interfaceObject.tilePixelWidth to determine actual pixel coordinate on spritesheet
			spriteSheetY: 0,
			walkable: true
			});

		this.tiles.floorTile02 = new Game.Tile({
			character: '.01',
			spriteSheetX: 1, 
			spriteSheetY: 0,
			walkable: true
			});			

		this.tiles.floorTile03 = new Game.Tile({
			character: '.02',
			spriteSheetX: 2,
			spriteSheetY: 0,
			walkable: true
			});
			
		this.tiles.wallTile01 = new Game.Tile({
			character: '#',
			spriteSheetX: 0,
			spriteSheetY: 1,
			blocksLight: true
		});

		this.tiles.wallTile02 = new Game.Tile({
			character: '#01',
			spriteSheetX: 1,
			spriteSheetY: 1,
			blocksLight: true
		});

		this.tiles.wallTile03 = new Game.Tile({
			character: '#02',
			spriteSheetX: 2,
			spriteSheetY: 1,
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
	},
	generateMap: function() {
		var map = [];
        var mapWidth = 50; //FIXME
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
		
		for (var i = 0; i < 50; i++) { //FIXME - temporary
        	Game.Screen.playScreen.map.addEntityAtRandomPosition(new Game.Entity(this.SlimeTemplate));
			Game.Screen.playScreen.map.addItemAtRandomPosition(new Game.Item(this.HealingPotionTemplate));
			Game.Screen.playScreen.map.addItemAtRandomPosition(new Game.Item(this.SmallSwordTemplate));
			Game.Screen.playScreen.map.addItemAtRandomPosition(new Game.Item(this.WoodenShieldTemplate));
    	}      	    	
		for (var i = 0; i < 1000; i++) { //FIXME - temporary
			Game.Screen.playScreen.map.addItemAtRandomPosition(new Game.Item(this.HealingPotionTemplate));
			Game.Screen.playScreen.map.addItemAtRandomPosition(new Game.Item(this.SmallSwordTemplate));
			Game.Screen.playScreen.map.addItemAtRandomPosition(new Game.Item(this.WoodenShieldTemplate));
    	}

	},
	initializeUI: function() {

		var interfaceObject = Game.interfaceObject;
		//var player = Game.Screen.playScreen.player;
		
		//menu screen UI components
		this.uiComponents.menuScreen = {};	
		var menuComponents = this.uiComponents.menuScreen;

		menuComponents.menuButton = 
			{	
				type: 'button',
				icon: interfaceObject.uiIcons.menuIcon,
				x: (((interfaceObject.canvasTileWidth - 1) / 2) - 1) * interfaceObject.tilePixelWidth,
				y: interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth * 3,
				height: interfaceObject.tilePixelWidth,
				clickAction: function() {
					Game.switchScreen(Game.Screen.playScreen);
				}					
			};

		//component parameters to be read by interface drawUI()
		this.uiScreens.menuScreenUI = [menuComponents.menuButton];		
		
		//play screen UI components
		this.uiComponents.playScreen = {};	
		var playComponents = this.uiComponents.playScreen;

		playComponents.menuButton = 
			{	
				type: 'button',
				icon: interfaceObject.uiIcons.menuIcon,
				x: 0, //positioning on screen
				y: 0,
				width: interfaceObject.tilePixelWidth, //positioning and sizing is defined relative to tile grid
				height: interfaceObject.tilePixelWidth,
				clickAction: function() {
					Game.switchScreen(Game.Screen.menuScreen);
				}					
			};

		playComponents.healButton = 
			{	
				type: 'button',
				icon: interfaceObject.uiIcons.healIcon,
				x: (interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth,
				y: (interfaceObject.canvasTileHeight * interfaceObject.tilePixelWidth) - (interfaceObject.tilePixelWidth * 2),
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth			
			};
			
		playComponents.pauseButton = 
			{	
				type: 'button',
				icon: interfaceObject.uiIcons.pauseIcon,
				x: 0,
				y: (interfaceObject.canvasTileHeight * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth,
				width: interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth			
			};			

		playComponents.messageDisplay = 
			{	
				type: 'message display',
				x: interfaceObject.tilePixelWidth,
				y: 0,
				width:(interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - (interfaceObject.tilePixelWidth * 2),
				height: interfaceObject.tilePixelWidth,
				text: null //set by engine process actor				
			};
			
		playComponents.statsDisplay = 
			{	
				type: 'stats display',
				x: (interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth,
				y: 0,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				text: null		
			};			

		this.uiScreens.playScreenUI = [playComponents.menuButton, playComponents.healButton, playComponents.pauseButton, playComponents.messageDisplay, playComponents.statsDisplay];		
		
		//inventory screen UI components
		this.uiComponents.inventoryScreen = {};	
		var inventoryComponents = this.uiComponents.inventoryScreen;

		inventoryComponents.menuButton = 
			{	
				type: 'button',
				icon: interfaceObject.uiIcons.menuIcon,
				x: 0,
				y: 0,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				clickAction: function() {
					Game.switchScreen(Game.Screen.playScreen);
				}					
			};

		inventoryComponents.messageDisplay = 
			{	
				type: 'message display',
				x: interfaceObject.tilePixelWidth,
				y: 0,
				width:(interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - (interfaceObject.tilePixelWidth * 2),
				height: interfaceObject.tilePixelWidth,
				text: null						
			};

		inventoryComponents.statsDisplay = 
			{	
				type: 'stats display',
				x: (interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth,
				y: 0,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				text: null					
			};

		inventoryComponents.groundToInventoryButton = 
			{
				type: 'button',
				icon: interfaceObject.uiIcons.arrowIcon,
				x: (interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - (interfaceObject.tilePixelWidth * 3),
				y: interfaceObject.tilePixelWidth * 3,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth * 2,
				clickAction: function() {
					var player = Game.Screen.playScreen.player;
					var	selectedItem = Game.Screen.inventoryScreen.selectedItem;
					var groundItems = Game.Screen.playScreen.map.items[player.x + ',' + player.y];
						
					if (player && selectedItem && groundItems) {						
		
						for (var x = 0, y = groundItems.length; x < y; x++){ 
						
							if (groundItems[x] === selectedItem) {
								
								//remove item from ground
								groundItems.splice(x,1);			
								Game.Screen.playScreen.map.setItemsAt(player.x, player.y, groundItems);	
								
								//add to player inventory
								player.inventory.push(selectedItem);								
								
								break;
							}				
						}
					}
					Game.Screen.inventoryScreen.render();
				}						
			};
			
		inventoryComponents.inventoryToGroundButton = 
			{
				type: 'button',
				icon: interfaceObject.uiIcons.arrowIcon,
				x: (interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - (interfaceObject.tilePixelWidth * 3),
				y: interfaceObject.tilePixelWidth * 5,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth * 2,
				clickAction: function() {
					var player = Game.Screen.playScreen.player;
					var selectedItem = Game.Screen.inventoryScreen.selectedItem;
					
					if (player && selectedItem) {
						
						for (var x = 0, y = player.inventory.length; x < y; x++) {
						
							if (player.inventory[x] === selectedItem) {
								
								//remove item from player inventory
								player.inventory.splice(x,1);

								//add item to ground
								var groundItems = Game.Screen.playScreen.map.items[player.x + ',' + player.y];
							
								if (groundItems) {
									groundItems.push(selectedItem);
								} else{
									groundItems = [selectedItem];
								}
							
								Game.Screen.playScreen.map.setItemsAt(player.x, player.y, groundItems);
						
								break;								
							}
						}
					}
					Game.Screen.inventoryScreen.render();
				}						
			};

		inventoryComponents.inventoryToEquippedButton = 
			{
				type: 'button',
				icon: interfaceObject.uiIcons.arrowIcon,
				x: 0,
				y: interfaceObject.tilePixelWidth * 2,
				width: interfaceObject.tilePixelWidth * 2,
				height: interfaceObject.tilePixelWidth,
				clickAction: function() {
					var player = Game.Screen.playScreen.player;
					var selectedItem = Game.Screen.inventoryScreen.selectedItem;
						
					if (player && selectedItem && selectedItem.equippable) {
		
						for (var x = 0, y = player.inventory.length; x < y; x++) {
						
							if (player.inventory[x] === selectedItem) {
								
								//remove item from player inventory
								player.inventory.splice(x,1);
								
								//check if something already equipped
								if (player.equipped[selectedItem.equippable]) {
									
									//move previously equipped item back to inventory
									player.inventory.push(player.equipped[selectedItem.equippable]);	
								
								}
								
								//equip new item
								player.equipped[selectedItem.equippable] = selectedItem;

								break;								
							}
						}
					}
					Game.Screen.inventoryScreen.render();
				}						
			};

		inventoryComponents.equippedToInventoryButton = 
			{
				type: 'button',
				icon: interfaceObject.uiIcons.arrowIcon,
				x: interfaceObject.tilePixelWidth * 2,
				y: interfaceObject.tilePixelWidth * 2,
				width: interfaceObject.tilePixelWidth * 2,
				height: interfaceObject.tilePixelWidth,
				clickAction: function() {
					var player = Game.Screen.playScreen.player;
					var selectedItem = Game.Screen.inventoryScreen.selectedItem;
						
					if (player && selectedItem) {
						
						for (var x in player.equipped) {
							if (player.equipped[x] === selectedItem) {
							
								//remove item from equipped
								player.equipped[x] = null;
								
								//add item to inventory
								player.inventory.push(selectedItem);
								
								break;
							}
						}
					}
					Game.Screen.inventoryScreen.render();
				}						
			};

		inventoryComponents.groundScrollUpButton = 
			{
				type: 'button',
				icon: interfaceObject.uiIcons.arrowIcon,
				x: (interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth,
				y: interfaceObject.tilePixelWidth * 3,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				clickAction: function() {
					var display = Game.loadedEnvironment.uiComponents.inventoryScreen.groundDisplay;
					var direction = 'up';
					var displayType = 'ground';
					var items = Game.Screen.playScreen.map.getItemsAt(Game.Screen.playScreen.player.x, Game.Screen.playScreen.player.y);
					Game.Screen.inventoryScreen.itemDisplayScroll(display, displayType, direction, items);
				}					
			};

		inventoryComponents.groundScrollDownButton = 
			{
				type: 'button',
				icon: interfaceObject.uiIcons.arrowIcon,
				x: (interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth,
				y: (interfaceObject.canvasTileHeight * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				clickAction: function() {
					var display = Game.loadedEnvironment.uiComponents.inventoryScreen.groundDisplay;
					var direction = 'down';
					var displayType = 'ground';
					var items = Game.Screen.playScreen.map.getItemsAt(Game.Screen.playScreen.player.x, Game.Screen.playScreen.player.y);
					Game.Screen.inventoryScreen.itemDisplayScroll(display, displayType, direction, items);					
				}						
			};

		inventoryComponents.inventoryScrollUpButton = 
			{
				type: 'button',
				icon: interfaceObject.uiIcons.arrowIcon,
				x: 0,
				y: interfaceObject.tilePixelWidth * 3,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				clickAction: function() {
					var display = Game.loadedEnvironment.uiComponents.inventoryScreen.inventoryDisplay;
					var direction = 'up';
					var displayType = 'inventory';
					var items = Game.Screen.playScreen.player.inventory;
					Game.Screen.inventoryScreen.itemDisplayScroll(display, displayType, direction, items);
				}					
			};

		inventoryComponents.inventoryScrollDownButton = 
			{
				type: 'button',
				icon: interfaceObject.uiIcons.arrowIcon,
				x: 0,
				y: (interfaceObject.canvasTileHeight * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				clickAction: function() {
					var display = Game.loadedEnvironment.uiComponents.inventoryScreen.inventoryDisplay;
					var direction = 'down';
					var displayType = 'inventory';
					var items = Game.Screen.playScreen.player.inventory;
					Game.Screen.inventoryScreen.itemDisplayScroll(display, displayType, direction, items);					
				}						
			};
			
		inventoryComponents.equippedDisplay = 
			{
				type: 'inventory display',
				x: 0,
				y: interfaceObject.tilePixelWidth,
				width: interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth						
			};

		inventoryComponents.inventoryDisplay = 
			{
				type: 'inventory display',
				x: interfaceObject.tilePixelWidth,
				y: interfaceObject.tilePixelWidth * 3,
				width: (interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - (interfaceObject.tilePixelWidth * 4),
				height: (interfaceObject.canvasTileHeight * interfaceObject.tilePixelWidth) - (interfaceObject.tilePixelWidth * 2)					
			};

		inventoryComponents.groundDisplay = 
			{
				type: 'inventory display',
				x: (interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - (interfaceObject.tilePixelWidth * 2),
				y: interfaceObject.tilePixelWidth * 3,
				width: interfaceObject.tilePixelWidth,
				height: (interfaceObject.canvasTileHeight * interfaceObject.tilePixelWidth) - (interfaceObject.tilePixelWidth * 2)				
			};
			
		this.uiScreens.inventoryScreenUI = [inventoryComponents.menuButton, inventoryComponents.messageDisplay, inventoryComponents.statsDisplay, inventoryComponents.groundToInventoryButton, inventoryComponents.inventoryToGroundButton, inventoryComponents.equippedDisplay, inventoryComponents.inventoryDisplay, inventoryComponents.groundDisplay, inventoryComponents.groundScrollUpButton, inventoryComponents.groundScrollDownButton, inventoryComponents.inventoryScrollUpButton, inventoryComponents.inventoryScrollDownButton, inventoryComponents.inventoryToEquippedButton, inventoryComponents.equippedToInventoryButton];
		
	}
}

Game.RedmurksMaze.Mixins = {};

Game.RedmurksMaze.Mixins.PlayerActor = {
    name: 'PlayerActor',
    groupName: 'Actor',
    act: function() {
    	
    	if (this.attackTarget) {	
    		var range = 1;
    		if (this.map.inRange(this, this.attackTarget, range)) {
    			this.tryMove(this.attackTarget.x, this.attackTarget.y);    		
    		} else {    		
				var newDestinationCoordinates = {};
				//newDestinationCoordinates.x = eventMapX; //FIXME - eventMapX not defined
				//newDestinationCoordinates.y = eventMapY;

				newDestinationCoordinates.x = this.attackTarget.x;
				newDestinationCoordinates.y = this.attackTarget.y;
				
				this.destinationCoordinates = newDestinationCoordinates; //FIXME - player
				this.pathCoordinates = [];  //reset
			} 
		}

    	if (this.destinationCoordinates !== null && this.pathCoordinates.length === 0) {

			var sourceEntity = this;
			var destX = this.destinationCoordinates.x;
			var destY = this.destinationCoordinates.y;
	
			this.findPath(sourceEntity, destX, destY);		
    	}
    	
    	if (this.pathCoordinates.length > 0) { 
    		this.speed = 600; //FIXME
    		this.followPath();
    	}
    	
    	//if items at coordinate and not midway following path and number of items is greater than 0
    	if (this.map.getItemsAt(this.x, this.y) && this.pathCoordinates.length === 0 && this.map.getItemsAt(this.x, this.y).length > 0) {
    		if (Game.Screen.inventoryScreen.justViewed !== true) {
    			Game.switchScreen(Game.Screen.inventoryScreen);
    		}
    	}
    	
    },
    followPath: function () {
		var nextCoordinate = this.pathCoordinates.splice(0, 1);
		var nextCoordinateX = nextCoordinate[0].x;
		var nextCoordinateY = nextCoordinate[0].y;
	
		Game.Screen.inventoryScreen.justViewed = null;
		this.tryMove(nextCoordinateX, nextCoordinateY);
		
		if (this.pathCoordinates.length === 0) {
			this.destinationCoordinates = null;
			this.speed = 1200; //FIXME
		}
    },
    move: function(directionX, directionY) {
        this.speed = 1200; //FIXME
        
        var newX = this.x + directionX; //FIXME - player
        var newY = this.y + directionY;
        
        Game.Screen.inventoryScreen.viewed = null;
        this.tryMove(newX, newY);        
    }
}



Game.RedmurksMaze.PlayerTemplate = {
    name: 'Player',
    character: '@',
	spriteSheetX: 0, //multiple applied to Game.interfaceObject.tilePixelWidth to determine actual pixel coordinate on spritesheet
    spriteSheetY: 5,
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
    name: 'Slime',
    character: 'S',
	spriteSheetX: 0,
    spriteSheetY: 9,
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
    spriteSheetY: 2,	
	healingValue: 10,
	consumptions: 1,
	mixins: [Game.ItemMixins.HealingDose]
}

Game.RedmurksMaze.SmallSwordTemplate = {
	name: 'Small sword',
	character: 'smallsword',
	spriteSheetX: 0,
    spriteSheetY: 3,	
	attackValue: 5,
	//wieldable: true,
	equippable: 'hand', //must match one of the .equipped property names in Game.Mixins.Equipper - needed for inventory equipping
	mixins: [Game.ItemMixins.Equippable]
}

Game.RedmurksMaze.WoodenShieldTemplate = {
	name: 'Wooden shield',
	character: 'woodenshield',
	spriteSheetX: 0,
    spriteSheetY: 4,	
	defenseValue: 5,
	//wearable: true,
	equippable: 'shieldhand',
	mixins: [Game.ItemMixins.Equippable]
}