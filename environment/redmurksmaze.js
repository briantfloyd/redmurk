Game.RedmurksMaze = {
	tiles: {},
	uiScreens: {},
	uiComponents: {},
	mapParameters: {},
	gameKey: 'redmurksmaze', //something unique for identifying saved games in localStorage
	firstSaveTimeStamp: null,
	init: function() {
		this.initializeUI();
		this.initializeTiles();
	},
	initializeTiles: function() {
	
		var tilePixelWidth = Game.interfaceObject.tilePixelWidth;
	
		this.tiles.floorTile01 = new Game.Tile({
			tileType: 'floorTile01',
			character: 'floorTile01',
			spriteSheetX: 0, //multiple applied to Game.interfaceObject.tilePixelWidth to determine actual pixel coordinate on spritesheet
			spriteSheetY: 0,
			walkable: true
			});

		this.tiles.floorTile02 = new Game.Tile({
			tileType: 'floorTile02',
			character: 'floorTile02',
			spriteSheetX: 1, 
			spriteSheetY: 0,
			walkable: true
			});			

		this.tiles.floorTile03 = new Game.Tile({
			tileType: 'floorTile03',
			character: 'floorTile03',
			spriteSheetX: 2,
			spriteSheetY: 0,
			walkable: true
			});
			
		this.tiles.wallTile01 = new Game.Tile({
			tileType: 'wallTile01',
			character: 'wallTile01',
			spriteSheetX: 0,
			spriteSheetY: 1,
			blocksLight: true
		});

		this.tiles.wallTile02 = new Game.Tile({
			tileType: 'wallTile02',
			character: 'wallTile02',
			spriteSheetX: 1,
			spriteSheetY: 1,
			blocksLight: true
		});

		this.tiles.wallTile03 = new Game.Tile({
			tileType: 'wallTile03',
			character: 'wallTile03',
			spriteSheetX: 2,
			spriteSheetY: 1,
			blocksLight: true
		});
		
		var tileSetImage = new Image();
		tileSetImage.src = 'environment/art/tilesheet-master-01.png'; //-line-dark
				
		Game.display._options.tileSet = tileSetImage;
	},
	setMapParameters: function() {
		//define parameters
		this.mapParameters.mapWidth = 50;
		this.mapParameters.mapHeight = 50;
		this.mapParameters.mapBornSurvive = {
							born: [5, 6, 7, 8],
							survive: [4, 5, 6, 7, 8]
						};
		this.mapParameters.generatorType = 'cellular';
		this.mapParameters.generatorRandomize = 0.5;
		this.mapParameters.generatorIterations = 3;
		this.mapParameters.floorTileTypes = [
						this.tiles.floorTile01, 
						this.tiles.floorTile02, 
						this.tiles.floorTile03
						];
		this.mapParameters.wallTileTypes = [
						this.tiles.wallTile01, 
						this.tiles.wallTile02, 
						this.tiles.wallTile03
						];
	},
	/*addPlayer: function(map) { //FIXME - remove method?
		this.player = new Game.Entity(this.PlayerTemplate);
		Game.Screen.playScreen.player = this.player; //FIXME - Screens may not need this eventually - or have screens refer back to environment?
		map.addEntityAtRandomPosition(this.player);
	},*/
	addEntities: function(map) {
		//entity strength based on depth and difficulty setting, quantity based on walkable map size	
		var depth = Game.Screen.playScreen.depth;
		var difficultySetting = Game.Screen.playScreen.difficultySetting;   	
    	
		var emptyFloorPositions = map.getEmptyFloorPositions();
		if (emptyFloorPositions){
			emptyFloorPositions = map.getEmptyFloorPositions().length;
		} else {
			console.log('Insufficient empty floor positions to addEntities');
			return;
		}		

    	//items
    	var itemFloorPositions = Math.floor(emptyFloorPositions / 500); //FIXME? may want to tinker with this threshhold
		
		//item rarity evaluation
		//var maxRarity = 1 + (depth * difficultySetting); //FIXME - need to tinker with this threshhold
		var maxRarity = (difficultySetting / 2) + depth;
		
		var potentialItemsToDrop = [];
		
		//will fall through starting with highest match
		switch(maxRarity) {
			case (maxRarity >= 3):
				potentialItemsToDrop.push(this.WoodenShieldTemplate);
			case (maxRarity >= 2):
				potentialItemsToDrop.push(this.SmallSwordTemplate);
			default:
				potentialItemsToDrop.push(this.HealingPotionTemplate);
		}
		
		var dice;
    	for (var b = 0; b < itemFloorPositions; b++) {
			dice = Math.floor(Math.random() * potentialItemsToDrop.length);
			map.addItemAtRandomPosition(new Game.Item(potentialItemsToDrop[dice]));
    	}
		
		//entities
    	var entityFloorPositions =  Math.floor(emptyFloorPositions / 20); //FIXME? may want to tinker with this threshhold - 50 too few
	
    	for (var a = 0; a < entityFloorPositions; a++) {
    		var newEntity = new Game.Entity(this.SlimeTemplate);
    		
    		//difficulty range 1-4; if 1, then maxHp is halved; 
    		newEntity.maxHp = (newEntity.maxHp * (difficultySetting / 2)) + ((difficultySetting / 2) * (depth - 1));
			newEntity.attackValue = (newEntity.attackValue * (difficultySetting / 2)) + ((difficultySetting / 2) * (depth - 1));
    		newEntity.defenseValue = (newEntity.defenseValue * (difficultySetting / 2)) + ((difficultySetting / 2) * (depth - 1));
    		
    		newEntity.maxHp = Math.floor(newEntity.maxHp);
    		newEntity.attackValue = Math.floor(newEntity.attackValue);
    		newEntity.defenseValue = Math.floor(newEntity.defenseValue);
    		
    		map.addEntityAtRandomPosition(newEntity);
    		
    		//add random item to entity inventory
    		dice = Math.floor(Math.random() * potentialItemsToDrop.length);
    		newEntity.inventory.push(new Game.Item(potentialItemsToDrop[dice]));
    	}
    	

    	

		/*
		for (var i = 0; i < 50; i++) { //FIXME - temporary
        	Game.Screen.playScreen.map.addEntityAtRandomPosition(new Game.Entity(this.SlimeTemplate));
    	}      	    	
		for (var i = 0; i < 10; i++) { //FIXME - temporary
			Game.Screen.playScreen.map.addItemAtRandomPosition(new Game.Item(this.SmallSwordTemplate));
			Game.Screen.playScreen.map.addItemAtRandomPosition(new Game.Item(this.WoodenShieldTemplate));
    	} 
		for (var i = 0; i < 10; i++) { //FIXME - temporary
			Game.Screen.playScreen.map.addItemAtRandomPosition(new Game.Item(this.HealingPotionTemplate));
    	} 
    	*/
    	
    	
		/*for (var i = 0; i < 1000; i++) { //FIXME - temporary
			Game.Screen.playScreen.map.addItemAtRandomPosition(new Game.Item(this.HealingPotionTemplate));
			Game.Screen.playScreen.map.addItemAtRandomPosition(new Game.Item(this.SmallSwordTemplate));
			Game.Screen.playScreen.map.addItemAtRandomPosition(new Game.Item(this.WoodenShieldTemplate));
    	}*/
	},
	initializeUI: function() {

		var interfaceObject = Game.interfaceObject;
		
		//menu screen UI components
		this.uiComponents.menuScreen = {};	
		var menuComponents = this.uiComponents.menuScreen;

		menuComponents.newGameButton = 
			{	
				backgroundStyle: 'button01', //'button01', 'dark01', 'light01', 'none' //required
				roundedCorners: true, //optional
				//transparency: true, //optional
				x: (((interfaceObject.canvasTileWidth - 1) / 2) - 1) * interfaceObject.tilePixelWidth, //positioning on screen //required
				y: interfaceObject.tilePixelWidth, //required
				width: interfaceObject.tilePixelWidth * 3, //positioning and sizing is defined relative to tile grid //required
				height: interfaceObject.tilePixelWidth, //required
				text: ["Begin new game"], //optional
				//icon: interfaceObject.uiIcons.menuIcon, //optional
				clickAction: function() { //optional
					Game.Screen.playScreen.map = null; //reset
					Game.switchScreen(Game.Screen.newGameScreen);
				}					
			};

		menuComponents.resumeGameButton = 
			{	
				backgroundStyle: 'button01',
				roundedCorners: true,
				x: (((interfaceObject.canvasTileWidth - 1) / 2) - 1) * interfaceObject.tilePixelWidth,
				y: interfaceObject.tilePixelWidth * 2,
				width: interfaceObject.tilePixelWidth * 3,
				height: interfaceObject.tilePixelWidth,
				text: ["Resume saved game"],
				clickAction: function() {
					Game.switchScreen(Game.Screen.loadGameScreen);
				}					
			};

		//component parameters to be read by interface drawUI()
		this.uiScreens.menuScreenUI = [menuComponents.newGameButton, menuComponents.resumeGameButton];		
		
		//play screen UI components
		this.uiComponents.playScreen = {};	
		var playComponents = this.uiComponents.playScreen;

		playComponents.menuButton = 
			{	
				backgroundStyle: 'button01',
				roundedCorners: true,
				icon: interfaceObject.uiIcons.menuIcon,
				x: 0, 
				y: 0,
				width: interfaceObject.tilePixelWidth, 
				height: interfaceObject.tilePixelWidth,
				clickAction: function() {
					Game.switchScreen(Game.Screen.menuScreen);
				}					
			};

		playComponents.healButton = 
			{	
				backgroundStyle: 'button01',
				roundedCorners: true,
				icon: interfaceObject.uiIcons.healIcon,
				x: (interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth,
				y: (interfaceObject.canvasTileHeight * interfaceObject.tilePixelWidth) - (interfaceObject.tilePixelWidth * 2),
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				clickAction: function() {
					Game.Screen.playScreen.player.useHealingPotion();
				}				
			};
			
		playComponents.pauseButton = 
			{	
				backgroundStyle: 'button01',
				roundedCorners: true,
				icon: interfaceObject.uiIcons.pauseIcon,
				x: 0,
				y: (interfaceObject.canvasTileHeight * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth,
				width: interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				clickAction: function() {
					Game.Screen.playScreen.pauseToggle();
				}			
			};			

		playComponents.messageDisplay = 
			{	 
				backgroundStyle: 'dark01',
				roundedCorners: true, 
				transparency: true,
				x: interfaceObject.tilePixelWidth,
				y: 0,
				width:(interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - (interfaceObject.tilePixelWidth * 2),
				height: interfaceObject.tilePixelWidth,
				text: null //set by engine process actor				
			};
			
		playComponents.statsDisplay = 
			{	
				backgroundStyle: 'dark01',
				roundedCorners: true, 
				transparency: true,
				x: (interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth,
				y: 0,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				text: null		
			};
		
		playComponents.depthDisplay = 
			{	
				backgroundStyle: 'dark01',
				roundedCorners: true, 
				transparency: true,
				x: (interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth,
				y: interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				text: null		
			};				

		playComponents.mapButton = 
			{	
				backgroundStyle: 'button01',
				roundedCorners: true,
				icon: interfaceObject.uiIcons.compassIcon,
				x: 0, 
				y: (interfaceObject.canvasTileHeight * interfaceObject.tilePixelWidth) - (interfaceObject.tilePixelWidth * 2),
				width: interfaceObject.tilePixelWidth, 
				height: interfaceObject.tilePixelWidth,
				clickAction: function() {
					Game.switchScreen(Game.Screen.mapScreen);
				}					
			};

		this.uiScreens.playScreenUI = [playComponents.menuButton, playComponents.healButton, playComponents.pauseButton, playComponents.messageDisplay, playComponents.statsDisplay, playComponents.depthDisplay, playComponents.mapButton];		
		
		//inventory screen UI components
		this.uiComponents.inventoryScreen = {};	
		var inventoryComponents = this.uiComponents.inventoryScreen;

		inventoryComponents.closeButton = 
			{	
				backgroundStyle: 'button01',
				roundedCorners: true,
				icon: interfaceObject.uiIcons.closeIcon,
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
				backgroundStyle: 'none',
				x: interfaceObject.tilePixelWidth,
				y: 0,
				width:(interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - (interfaceObject.tilePixelWidth * 2),
				height: interfaceObject.tilePixelWidth,
				text: null						
			};

		inventoryComponents.statsDisplay = 
			{	
				backgroundStyle: 'dark01',
				roundedCorners: true, 
				transparency: true,
				x: (interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth,
				y: 0,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				text: null					
			};

		inventoryComponents.groundInventorySwapButton = 
			{
				backgroundStyle: 'button01',
				roundedCorners: true,
				icon: interfaceObject.uiIcons.arrowIconRightLeft,
				x: (interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - (interfaceObject.tilePixelWidth * 3),
				y: interfaceObject.tilePixelWidth * 3,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth * 2,
				clickAction: function() {
					var player = Game.Screen.playScreen.player; //location of item to remove
					var	selectedItem = Game.Screen.inventoryScreen.selectedItem;
					var inventoryScreen = Game.Screen.inventoryScreen;
					inventoryScreen.itemInventoryGroundSwap(selectedItem, player);
					inventoryScreen.render();
				}						
			};

		inventoryComponents.inventoryEquippedSwapButton = 
			{
				backgroundStyle: 'button01',
				roundedCorners: true,
				icon: interfaceObject.uiIcons.arrowIconUpDown,
				x: 0,
				y: interfaceObject.tilePixelWidth * 2,
				width: interfaceObject.tilePixelWidth * 2,
				height: interfaceObject.tilePixelWidth,
				clickAction: function() {
					var player = Game.Screen.playScreen.player;
					var selectedItem = Game.Screen.inventoryScreen.selectedItem;
					var inventoryScreen = Game.Screen.inventoryScreen;
					inventoryScreen.itemInventoryEquippedSwap(selectedItem, player);
					inventoryScreen.render();
				}						
			};

		inventoryComponents.groundScrollUpButton = 
			{
				backgroundStyle: 'button01',
				roundedCorners: true,
				icon: interfaceObject.uiIcons.arrowIconUp,
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
				backgroundStyle: 'button01',
				roundedCorners: true,
				icon: interfaceObject.uiIcons.arrowIconDown,
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
				backgroundStyle: 'button01',
				roundedCorners: true,
				icon: interfaceObject.uiIcons.arrowIconUp,
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
				backgroundStyle: 'button01',
				roundedCorners: true,
				icon: interfaceObject.uiIcons.arrowIconDown,
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
				backgroundStyle: 'light01',
				roundedCorners: true, 
				x: 0,
				y: interfaceObject.tilePixelWidth,
				width: interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth						
			};

		inventoryComponents.inventoryDisplay = 
			{
				backgroundStyle: 'light01',
				roundedCorners: true, 
				x: interfaceObject.tilePixelWidth,
				y: interfaceObject.tilePixelWidth * 3,
				width: (interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - (interfaceObject.tilePixelWidth * 4),
				height: (interfaceObject.canvasTileHeight * interfaceObject.tilePixelWidth) - (interfaceObject.tilePixelWidth * 2)					
			};

		inventoryComponents.groundDisplay = 
			{
				backgroundStyle: 'light01',
				roundedCorners: true, 
				x: (interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - (interfaceObject.tilePixelWidth * 2),
				y: interfaceObject.tilePixelWidth * 3,
				width: interfaceObject.tilePixelWidth,
				height: (interfaceObject.canvasTileHeight * interfaceObject.tilePixelWidth) - (interfaceObject.tilePixelWidth * 2)				
			};
			
		this.uiScreens.inventoryScreenUI = [inventoryComponents.closeButton, inventoryComponents.messageDisplay, inventoryComponents.statsDisplay, inventoryComponents.groundInventorySwapButton, inventoryComponents.equippedDisplay, inventoryComponents.inventoryDisplay, inventoryComponents.groundDisplay, inventoryComponents.groundScrollUpButton, inventoryComponents.groundScrollDownButton, inventoryComponents.inventoryScrollUpButton, inventoryComponents.inventoryScrollDownButton, inventoryComponents.inventoryEquippedSwapButton];
		
		
		//stat assignment screen UI components
		this.uiComponents.statAssignmentScreen = {};	
		var statAssignmentComponents = this.uiComponents.statAssignmentScreen;

		statAssignmentComponents.saveButton = 
			{	
				backgroundStyle: 'button01',
				roundedCorners: true,
				x: ((((interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth) / 2) - interfaceObject.tilePixelWidth),
				y: interfaceObject.tilePixelWidth * 6,
				width: interfaceObject.tilePixelWidth * 3,
				height: interfaceObject.tilePixelWidth,
				text: ["Confirm and continue"],
				clickAction: function() {			
					if (Game.Screen.statAssignmentScreen.statRaising) {
						Game.Screen.statAssignmentScreen.statAssignment();
						Game.switchScreen(Game.Screen.playScreen);
					}					
				}					
			};
			
		statAssignmentComponents.instructionsDisplay = 
			{	
				backgroundStyle: 'none',
				x: (((interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth) / 2) - interfaceObject.tilePixelWidth,
				y: interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth * 3,
				height: interfaceObject.tilePixelWidth,
				text: ["Select a skill to improve."]			
			};	

		statAssignmentComponents.currentValueLabel = 
			{	
				backgroundStyle: 'none',
				x: (((interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth) / 2) - interfaceObject.tilePixelWidth,
				y: interfaceObject.tilePixelWidth * 2,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				text: ["Current","Value"]			
			};

		statAssignmentComponents.newValueLabel = 
			{	
				backgroundStyle: 'none',
				x: (((interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth) / 2) + interfaceObject.tilePixelWidth,
				y: interfaceObject.tilePixelWidth * 2,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				text: ["New","Value"]			
			};

		statAssignmentComponents.attackLabel = 
			{	 
				backgroundStyle: 'none',
				x: (((interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth) / 2) - (interfaceObject.tilePixelWidth * 2),
				y: interfaceObject.tilePixelWidth * 3,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				text: ["Attack"]			
			};

		statAssignmentComponents.defenseLabel = 
			{	
				backgroundStyle: 'none',
				x: (((interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth) / 2) - (interfaceObject.tilePixelWidth * 2),
				y: interfaceObject.tilePixelWidth * 4,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				text: ["Defense"]			
			};

		statAssignmentComponents.hpLabel = 
			{	
				backgroundStyle: 'none',
				x: (((interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth) / 2) - (interfaceObject.tilePixelWidth * 2),
				y: interfaceObject.tilePixelWidth * 5,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				text: ["Health"]			
			}

		statAssignmentComponents.attackCurrentValueDisplay = 
			{	
				backgroundStyle: 'none',
				x: (((interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth) / 2) - interfaceObject.tilePixelWidth,
				y: interfaceObject.tilePixelWidth * 3,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				text: null			
			};

		statAssignmentComponents.defenseCurrentValueDisplay = 
			{	
				backgroundStyle: 'none',
				x: (((interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth) / 2) - interfaceObject.tilePixelWidth,
				y: interfaceObject.tilePixelWidth * 4,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				text: null			
			};

		statAssignmentComponents.hpCurrentValueDisplay = 
			{	
				backgroundStyle: 'none',
				x: (((interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth) / 2) - interfaceObject.tilePixelWidth,
				y: interfaceObject.tilePixelWidth * 5,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				text: null			
			};

		statAssignmentComponents.attackIncreaseButton = 
			{
				backgroundStyle: 'button01',
				roundedCorners: true,
				icon: interfaceObject.uiIcons.plusIcon,
				x: (((interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth) / 2),
				y: interfaceObject.tilePixelWidth * 3,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				clickAction: function() {
					Game.Screen.statAssignmentScreen.statRaising = "attack";
					Game.Screen.statAssignmentScreen.render();
				}						
			};

		statAssignmentComponents.defenseIncreaseButton = 
			{
				backgroundStyle: 'button01',
				roundedCorners: true,
				icon: interfaceObject.uiIcons.plusIcon,
				x: (((interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth) / 2),
				y: interfaceObject.tilePixelWidth * 4,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				clickAction: function() {
					Game.Screen.statAssignmentScreen.statRaising = "defense";
					Game.Screen.statAssignmentScreen.render();
				}						
			};			

		statAssignmentComponents.hpIncreaseButton = 
			{
				backgroundStyle: 'button01',
				roundedCorners: true,
				icon: interfaceObject.uiIcons.plusIcon,
				x: (((interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth) / 2),
				y: interfaceObject.tilePixelWidth * 5,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				clickAction: function() {
					Game.Screen.statAssignmentScreen.statRaising = "health";
					Game.Screen.statAssignmentScreen.render();
				}						
			};	

		statAssignmentComponents.attackNewValueDisplay = 
			{	
				backgroundStyle: 'none',
				x: (((interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth) / 2) + interfaceObject.tilePixelWidth,
				y: interfaceObject.tilePixelWidth * 3,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				text: null			
			};

		statAssignmentComponents.defenseNewValueDisplay = 
			{	
				backgroundStyle: 'none',
				x: (((interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth) / 2) + interfaceObject.tilePixelWidth,
				y: interfaceObject.tilePixelWidth * 4,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				text: null			
			};

		statAssignmentComponents.hpNewValueDisplay = 
			{	
				backgroundStyle: 'none',
				x: (((interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth) / 2) + interfaceObject.tilePixelWidth,
				y: interfaceObject.tilePixelWidth * 5,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				text: null			
			};			

		this.uiScreens.statAssignmentScreenUI = [statAssignmentComponents.saveButton, statAssignmentComponents.instructionsDisplay, statAssignmentComponents.currentValueLabel, statAssignmentComponents.newValueLabel, statAssignmentComponents.attackLabel, statAssignmentComponents.defenseLabel, statAssignmentComponents.hpLabel, statAssignmentComponents.attackCurrentValueDisplay, statAssignmentComponents.defenseCurrentValueDisplay, statAssignmentComponents.hpCurrentValueDisplay, statAssignmentComponents.attackIncreaseButton, statAssignmentComponents.defenseIncreaseButton, statAssignmentComponents.hpIncreaseButton, statAssignmentComponents.attackNewValueDisplay, statAssignmentComponents.defenseNewValueDisplay, statAssignmentComponents.hpNewValueDisplay];

		//map screen UI components
		this.uiComponents.mapScreen = {};	
		var mapComponents = this.uiComponents.mapScreen;

		mapComponents.closeButton = 
			{	
				backgroundStyle: 'button01',
				roundedCorners: true,
				icon: interfaceObject.uiIcons.closeIcon,
				x: 0,
				y: 0,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				clickAction: function() {
					Game.SpecialEffects.clearCanvas();
					Game.switchScreen(Game.Screen.playScreen);
				}					
			};

		this.uiScreens.mapScreenUI = [mapComponents.closeButton];

		//player death screen UI components
		this.uiComponents.playerDeathScreen = {};	
		var playerDeathComponents = this.uiComponents.playerDeathScreen;
		
		playerDeathComponents.slainMessageDisplay = 
			{	
				backgroundStyle: 'none',
				x: (((interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth) / 2) - interfaceObject.tilePixelWidth,
				y: interfaceObject.tilePixelWidth * 2,
				width: interfaceObject.tilePixelWidth * 3,
				height: interfaceObject.tilePixelWidth,
				text: ["You have been slain"]			
			};	
			
		playerDeathComponents.continueButton = 
			{	
				backgroundStyle: 'button01',
				roundedCorners: true,
				x: (((interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth) / 2) - interfaceObject.tilePixelWidth,
				y: interfaceObject.tilePixelWidth * 3,
				width: interfaceObject.tilePixelWidth * 3,
				height: interfaceObject.tilePixelWidth,
				text: ["Rise from the dead"],
				clickAction: function() {
					Game.loadedEnvironment.playerResurrect();	
					Game.SpecialEffects.clearCanvas();
					Game.switchScreen(Game.Screen.playScreen);
				}					
			};
		
		playerDeathComponents.menuButton = 
			{	
				backgroundStyle: 'button01',
				roundedCorners: true,
				icon: interfaceObject.uiIcons.menuIcon,
				x: 0, 
				y: 0,
				width: interfaceObject.tilePixelWidth, 
				height: interfaceObject.tilePixelWidth,
				clickAction: function() {
					Game.switchScreen(Game.Screen.menuScreen);
				}					
			};	

		this.uiScreens.playerDeathScreenUI = [playerDeathComponents.menuButton, playerDeathComponents.slainMessageDisplay, playerDeathComponents.continueButton];

		//newGameScreenUI
		
		//new game screen UI components
		this.uiComponents.newGameScreen = {};	
		var newGameComponents = this.uiComponents.newGameScreen;
	
		newGameComponents.menuButton = 
			{	
				backgroundStyle: 'button01',
				roundedCorners: true,
				icon: interfaceObject.uiIcons.menuIcon,
				x: 0, 
				y: 0,
				width: interfaceObject.tilePixelWidth, 
				height: interfaceObject.tilePixelWidth,
				clickAction: function() {
					Game.switchScreen(Game.Screen.menuScreen);
				}					
			};

		newGameComponents.difficultyMessageDisplay = 
			{	
				backgroundStyle: 'none',
				x: (((interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth) / 2) - interfaceObject.tilePixelWidth,
				y: interfaceObject.tilePixelWidth * 2,
				width: interfaceObject.tilePixelWidth * 3,
				height: interfaceObject.tilePixelWidth,
				text: ["Select difficulty level"]			
			};

		newGameComponents.difficultySelectedMessageDisplay = 
			{	
				backgroundStyle: 'none',
				x: (((interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth) / 2) - interfaceObject.tilePixelWidth,
				y: interfaceObject.tilePixelWidth * 3,
				width: interfaceObject.tilePixelWidth * 3,
				height: interfaceObject.tilePixelWidth,
				text: null			
			};

		newGameComponents.difficultyIncreaseButton = 
			{
				backgroundStyle: 'button01',
				roundedCorners: true,
				icon: interfaceObject.uiIcons.plusIcon,
				x: (((interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth) / 2) + (interfaceObject.tilePixelWidth * 2),
				y: interfaceObject.tilePixelWidth * 3,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				clickAction: function() {
					Game.Screen.newGameScreen.raiseDifficultySetting();
					Game.Screen.newGameScreen.render();
				}						
			};

		newGameComponents.difficultyDecreaseButton = 
			{
				backgroundStyle: 'button01',
				roundedCorners: true,
				icon: interfaceObject.uiIcons.minusIcon,
				x: (((interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth) / 2) - (interfaceObject.tilePixelWidth * 2),
				y: interfaceObject.tilePixelWidth * 3,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				clickAction: function() {
					Game.Screen.newGameScreen.lowerDifficultySetting();
					Game.Screen.newGameScreen.render();
				}						
			};
		
		newGameComponents.beginButton = 
			{	
				backgroundStyle: 'button01',
				roundedCorners: true,
				x: (((interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth) / 2) - interfaceObject.tilePixelWidth,
				y: interfaceObject.tilePixelWidth * 4,
				width: interfaceObject.tilePixelWidth * 3,
				height: interfaceObject.tilePixelWidth,
				text: ["Begin game"],
				clickAction: function() {
					Game.switchScreen(Game.Screen.playScreen);
				}					
			};
		
		this.uiScreens.newGameScreenUI = [newGameComponents.menuButton, newGameComponents.difficultyMessageDisplay, newGameComponents.difficultySelectedMessageDisplay, newGameComponents.difficultyDecreaseButton, newGameComponents.difficultyIncreaseButton, newGameComponents.beginButton];
		
		//load game screen UI components
		this.uiComponents.loadGameScreen = {};	
		var loadGameComponents = this.uiComponents.loadGameScreen;

		loadGameComponents.menuButton = 
			{	
				backgroundStyle: 'button01',
				roundedCorners: true,
				icon: interfaceObject.uiIcons.menuIcon,
				x: 0,
				y: 0,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				clickAction: function() {
					Game.switchScreen(Game.Screen.menuScreen);
				}					
			};

		loadGameComponents.instructionsDisplay = 
			{	
				backgroundStyle: 'none',
				x: (((interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth) / 2) - interfaceObject.tilePixelWidth,
				y: 0,
				width: interfaceObject.tilePixelWidth * 3,
				height: interfaceObject.tilePixelWidth,
				text: ["Select game to resume."]			
			};	

		loadGameComponents.loadGameButton = 
			{	
				backgroundStyle: 'button01',
				roundedCorners: true,
				x: (((interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth) / 2) - interfaceObject.tilePixelWidth,
				y: (interfaceObject.canvasTileHeight * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth * 3,
				height: interfaceObject.tilePixelWidth,
				text: ["Resume game"],
				clickAction: function() {
					if (Game.Screen.loadGameScreen.selectedSavedGame) {
						Game.resumeGame(Game.Screen.loadGameScreen.selectedSavedGame);
					}
				}					
			};
		
		loadGameComponents.savedGameDisplay = 
			{
				backgroundStyle: 'light01',
				roundedCorners: true, 
				x: interfaceObject.tilePixelWidth,
				y: interfaceObject.tilePixelWidth,
				width: (interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - (interfaceObject.tilePixelWidth * 2),
				height: (interfaceObject.canvasTileHeight * interfaceObject.tilePixelWidth) - (interfaceObject.tilePixelWidth * 2)				
			};

		loadGameComponents.savedGameScrollUpButton = 
			{
				backgroundStyle: 'button01',
				roundedCorners: true,
				icon: interfaceObject.uiIcons.arrowIconUp,
				x: (interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth,
				y: interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				clickAction: function() {				
					var direction = 'up';
					Game.Screen.loadGameScreen.savedGameDisplayScroll(direction);
				}					
			};

		loadGameComponents.savedGameScrollDownButton = 
			{
				backgroundStyle: 'button01',
				roundedCorners: true,
				icon: interfaceObject.uiIcons.arrowIconDown,
				x: (interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth,
				y: (interfaceObject.canvasTileHeight * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				clickAction: function() {
					var direction = 'down';
					Game.Screen.loadGameScreen.savedGameDisplayScroll(direction);		
				}						
			};

		this.uiScreens.loadGameScreenUI = [loadGameComponents.menuButton, loadGameComponents.instructionsDisplay, loadGameComponents.savedGameDisplay, loadGameComponents.savedGameScrollUpButton, loadGameComponents.savedGameScrollDownButton, loadGameComponents.loadGameButton];

	},
	playerDeath: function() {
		Game.switchScreen(Game.Screen.playerDeathScreen);	
	},
	playerResurrect: function() {				
		var playScreen = Game.Screen.playScreen;		
		
		//want to go up one level, so subtract 2 as 1 will be added when new level generated
		if (playScreen.depth > 1) {
			playScreen.depth = playScreen.depth - 2; //want to go up one level, so subtract 2 as 1 will be added when new level generated
		} else{
			playScreen.depth = playScreen.depth - 1;
		}
		
		playScreen.loadLevel();
		playScreen.player.changeLevels(playScreen.map);	
		
		//set health to about 5% of max
		playScreen.player.hp = Math.floor(playScreen.player.maxHp * .05) + 1;
		
		//cycle through all equipped and inventory items - 50% chance of losing each
		var player = playScreen.player;
		var dice;
		
		for (var a in player.equipped) {		
			dice = Math.floor(Math.random() * 2);
			
			if (dice === 0 && player.equipped[a] != null) {
				console.log('equipped item lost: ' + player.equipped[a].name);
				player.equipped[a] = null;
			}
		}
		
		var inventoryLength = player.inventory.length - 1;
		for (var b = inventoryLength, c = 0; b >= c; b--) { //decrementing due to splicing below
			dice = Math.floor(Math.random() * 2);
			
			if (dice === 0) {
				console.log('inventory item lost: ' + player.inventory[b].name);
				player.inventory.splice(b,1);				
			}		
		}
		
		//reset
		playScreen.player.attackTarget = null;
		playScreen.player.pathCoordinates = [];
		playScreen.player.destinationCoordinates = null;
	}
}

Game.RedmurksMaze.Mixins = {};

Game.RedmurksMaze.Mixins.PlayerActor = {
    name: 'PlayerActor',
    groupName: 'Actor',
    actThrottleTimer: 0,
    act: function() {
//console.log('player acting');
    	if (this.actThrottleTimer === 0) {    	
			if (this.attackTarget) {	
				var range = 1;
				if (this.map.inRange(this, this.attackTarget, range)) {
					this.tryMove(this.attackTarget.x, this.attackTarget.y);    		
				} else {    		
					var newDestinationCoordinates = {};
					newDestinationCoordinates.x = this.attackTarget.x;
					newDestinationCoordinates.y = this.attackTarget.y;
				
					this.destinationCoordinates = newDestinationCoordinates; //FIXME - player
					this.pathCoordinates = [];  //reset
				} 
			} else {
				this.restHeal();
			}
		}

		if (this.destinationCoordinates !== null && this.pathCoordinates.length === 0) {

			var sourceEntity = this;
			var destX = this.destinationCoordinates.x;
			var destY = this.destinationCoordinates.y;

			this.findPath(sourceEntity, destX, destY);		
		}
			
		//if (this.actThrottleTimer === 0 || this.actThrottleTimer === 6) { //slow movement rate?
			if (this.pathCoordinates.length > 0) { 
				this.followPath();
				this.justChangedLevels = null; //reset
			}
    	//}
    	
    	if (this.actThrottleTimer === 0) {
    		this.actThrottleTimer = this.speed / 100; //reset
    	}
    	
    	this.actThrottleTimer--;
    	
    	//if level connection at coordinate and not midway following path
    	var levelConnection = this.map.getLevelConnectionAt(this.x, this.y);
    	
    	//if on levelconnection, if has direction (collapsed connections do not), if have stopped walking, and if have not just changed levels via a level connection
    	if (levelConnection && levelConnection.direction && this.pathCoordinates.length === 0 && this.justChangedLevels !== true) {
    		Game.Screen.playScreen.loadLevel(levelConnection);
    		this.changeLevels(levelConnection); //levelChanger entity mixin
    	}

    	//if items at coordinate and not midway following path and number of items is greater than 0
    	else if (this.map.getItemsAt(this.x, this.y) && this.pathCoordinates.length === 0 && this.map.getItemsAt(this.x, this.y).length > 0) {
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
		}
    },
    useHealingPotion: function() {
		for (var x = 0, y = this.inventory.length; x < y; x++) {
		
			if (this.inventory[x].name === 'Healing potion') {
				
				//remove item from player inventory
				var potion = this.inventory.splice(x,1);

				//heal player				
				potion[0].eat(this);
				
				break;								
			}
		}
    }
}

Game.RedmurksMaze.PlayerTemplate = {
    templateType: 'PlayerTemplate',
    name: 'Player',
    character: '@',
	spriteSheetX: 0, //multiple applied to Game.interfaceObject.tilePixelWidth to determine actual pixel coordinate on spritesheet
    spriteSheetY: 8, //5
    maxHp: 10,
    attackValue: 2,
    defenseValue: 1,
    sightRadius: 4,
    speed: 1200,
    mixins: [Game.RedmurksMaze.Mixins.PlayerActor,
    		Game.Mixins.Attacker, Game.Mixins.Destructible,
    		Game.Mixins.Sight, Game.Mixins.Equipper,
    		Game.Mixins.ExperienceGainer, Game.Mixins.StatAssigner,
    		Game.Mixins.LevelChanger, Game.Mixins.InventoryCarrier]
}

Game.RedmurksMaze.Mixins.SlimeActor = {
    name: 'SlimeActor',
    groupName: 'Actor'
}

Game.RedmurksMaze.SlimeTemplate = {
    templateType: 'SlimeTemplate',
    name: 'Slime',
    character: 'S',
	spriteSheetX: 0,
    spriteSheetY: 12, //9
	maxHp: 10,
	attackValue: 2,
    defenseValue: 1,
	speed: 100,
	tasks: ['hunt', 'heal', 'wander'],
    mixins: [Game.RedmurksMaze.Mixins.SlimeActor, 
    		Game.Mixins.TaskActor, Game.Mixins.Sight,
    		Game.Mixins.Destructible, Game.Mixins.Attacker,
    		Game.Mixins.InventoryCarrier]
}

Game.RedmurksMaze.HealingPotionTemplate = {
	templateType: 'HealingPotionTemplate',
	name: 'Healing potion',
	//rarity: 1,
	character: 'P',
	spriteSheetX: 0,
    spriteSheetY: 2,	
	healingValue: 10,
	consumptions: 1,
	mixins: [Game.ItemMixins.HealingDose]
}

Game.RedmurksMaze.SmallSwordTemplate = {
	templateType: 'SmallSwordTemplate',
	name: 'Small sword',
	//rarity: 2,
	character: 'smallsword',
	spriteSheetX: 0,
    spriteSheetY: 3,	
	attackValue: 5,
	equippable: 'hand', //must match one of the .equipped property names in Game.Mixins.Equipper - needed for inventory equipping
	mixins: [Game.ItemMixins.Equippable]
}

Game.RedmurksMaze.WoodenShieldTemplate = {
	templateType: 'WoodenShieldTemplate',
	name: 'Wooden shield',
	//rarity: 2,
	character: 'woodenshield',
	spriteSheetX: 0,
    spriteSheetY: 4,	
	defenseValue: 5,
	equippable: 'shieldhand',
	mixins: [Game.ItemMixins.Equippable]
}

Game.RedmurksMaze.StairsDownTemplate = {
	templateType: 'StairsDownTemplate',
	character: 'stairsdown',
	spriteSheetX: 0,
    spriteSheetY: 5,
    direction: 'down',
    x: null,
    y: null,
    connectingLevel: null,
    connectingLevelX: null,
    connectingLevelY: null
}

Game.RedmurksMaze.StairsUpTemplate = {
	templateType: 'StairsUpTemplate',
	character: 'stairsup',
	spriteSheetX: 0,
    spriteSheetY: 6,
    direction: 'up',
    x: null,
    y: null,
    connectingLevel: null,
    connectingLevelX: null,
    connectingLevelY: null
}

Game.RedmurksMaze.StairsCollapsedTemplate = {
	templateType: 'StairsCollapsedTemplate',
	character: 'stairscollapsed',
	spriteSheetX: 0,
    spriteSheetY: 7,
    x: null,
    y: null
}