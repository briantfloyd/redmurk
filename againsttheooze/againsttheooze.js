/* Copyright (c) 2015, Brian T. Floyd. */
Game.AgainstTheOoze = { //set as loaded environment below
	tiles: {},
	uiScreens: {},
	uiComponents: {},
	mapParameters: {},
	gameKey: 'againsttheooze', //something unique for identifying saved games in localStorage
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
		tileSetImage.src = '../againsttheooze/art/tilesheet-master-01.png';

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
		var maxRarity = (difficultySetting / 2) + depth;
		
		var potentialItemsToDrop = [];
		
		//below all available at depth 1 at medium (2) difficulty //add more at higher maxRarity eventually
		if (maxRarity >= 6){
			potentialItemsToDrop.push(this.GreenAmuletTemplate);
		}
		if (maxRarity >= 5){
			potentialItemsToDrop.push(this.WoodenArmorTemplate);
		}
		if (maxRarity >= 4){
			potentialItemsToDrop.push(this.WoodenHelmTemplate);
		}
		if (maxRarity >= 3){
			potentialItemsToDrop.push(this.WoodenShieldTemplate);
		}
		if (maxRarity >= 2){
			potentialItemsToDrop.push(this.SmallSwordTemplate);
		}
		
		potentialItemsToDrop.push(this.HealingPotionTemplate);
			
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
    		
			//chance of having a item - easy 100%, medium 50/50, hard 1/3,..
    		dice = Math.floor(Math.random() * difficultySetting);
			if (dice === 0) {
				//add random item to entity inventory
				dice = Math.floor(Math.random() * potentialItemsToDrop.length);
				newEntity.inventory.push(new Game.Item(potentialItemsToDrop[dice]));
			}
    	}
	},
	setStatsDisplayContent: function() {
		
		var player = Game.Screen.playScreen.player;
		var interfaceObject = Game.interfaceObject;
		
		//inventory stats display (entity stat overlays drawn by playScreen render)
		var attackValueDisplay, defenseValueDisplay, healthValueDisplay, experienceValueDisplay;
		attackValueDisplay = player.getAttackValue().toString();
		defenseValueDisplay = player.getDefenseValue().toString();
		healthValueDisplay = /*player.hp.toString() + "|" + */player.maxHp.toString();
		experienceValueDisplay = player.experiencePoints.toString()/* + "|" + player.nextExperiencePointThreshold*/;
		
		//this.uiComponents.inventoryScreen.statsDisplayAttack.content = [[attackValueDisplay]];
		//this.uiComponents.inventoryScreen.statsDisplayDefense.content = [[defenseValueDisplay]];
		//this.uiComponents.inventoryScreen.statsDisplayHealth.content = [[healthValueDisplay]];
		//this.uiComponents.inventoryScreen.statsDisplayExperience.content = [[experienceValueDisplay]];
		//this.uiComponents.inventoryScreen.statsDisplayExperience.content = [[player.experiencePoints.toString()],[player.nextExperiencePointThreshold.toString()]];
		//this.uiComponents.inventoryScreen.statDisplay.content = [[attackValueDisplay,interfaceObject.uiIcons.attackIcon],[defenseValueDisplay,interfaceObject.uiIcons.defenseIcon],[healthValueDisplay,interfaceObject.uiIcons.healthIcon],[(player.experiencePoints.toString() + '/' + player.nextExperiencePointThreshold.toString()),interfaceObject.uiIcons.trophyIcon]];
		//this.uiComponents.inventoryScreen.statAttackDefenseDisplay.content = [[attackValueDisplay,interfaceObject.uiIcons.attackIcon],[defenseValueDisplay,interfaceObject.uiIcons.defenseIcon]];
		//this.uiComponents.inventoryScreen.statHealthExpDisplay.content = [[healthValueDisplay,interfaceObject.uiIcons.healthIcon],[experienceValueDisplay,interfaceObject.uiIcons.trophyIcon]];
		
		this.uiComponents.inventoryScreen.statDisplay.content = [[attackValueDisplay,interfaceObject.uiIcons.attackIcon,' ',defenseValueDisplay,interfaceObject.uiIcons.defenseIcon,' ',healthValueDisplay,interfaceObject.uiIcons.healthIcon],[experienceValueDisplay,interfaceObject.uiIcons.trophyIcon]];
		
		//depth display update
		var depthString = Game.Screen.playScreen.depth.toString();
		//this.uiComponents.playScreen.depthDisplay.content = [[depthString]];	
		this.uiComponents.mapScreen.depthDisplay.content = [[depthString]];		
						
	},
	initializeUI: function() {
		
		var interfaceObject = Game.interfaceObject;
		
		//FIXME? move background image loading somewhere else?
		var menuBackgroundImage = new Image();
		menuBackgroundImage.onload = function() {
			//image is now loaded
			Game.switchScreen(Game.Screen.menuScreen); //FIXME - THIS IS PROBLEMATIC - this occasionally loads and fires before everything else has loaded
		};
		menuBackgroundImage.src = '../againsttheooze/art/ato-title-bg-660x660.jpg';		
		
		var tunnelBackgroundImage = new Image(); 
		tunnelBackgroundImage.src = '../againsttheooze/art/ato-tunnel-bg-660x660.jpg';
		
		
		
		//inventory screen display area background tile images
		var burlap01TextureTile = new Image();
		burlap01TextureTile.src = '../againsttheooze/art/texture-tile-burlap-01-60x60.jpg';
		
		var ground01TextureTile = new Image();
		ground01TextureTile.src = '../againsttheooze/art/texture-tile-ground-01-60x60.jpg';
		
		/*
		//unexplored tile image
		//using in ground spritesheet - additional use?
		var unexplored01Tile = new Image();
		unexplored01Tile.src = '../againsttheooze/art/texture-tile-fog-01-60x60.jpg';*/

		/*
		//component options
		exampleScreenComponents.exampleComponent = 
			{	
				backgroundStyle: 'hud01', //optional //'button01', 'light01' 
				backgroundTile: burlap01TextureTile, //optional
				imageBackground: '', //optional
				screenBackground: '', //optional - for full screen, back UI canvas display
				horizontalRule: '', //optional //'bottom', 'top',
				noInset: true, //optional
				roundedCorners: true, //optional
				transparency: true, //optional //applies to background
				outline: true, //optional
				textStyle: 'buttonText01', //optional
				x: interfaceObject.tilePixelWidth, //required  //positioning and sizing is defined relative to tile grid 
				y: interfaceObject.tilePixelWidth, //required //use combinations of interfaceObject.canvasTileWidth, interfaceObject.canvasTileHeight and interfaceObject.tilePixelWidthd
				width: interfaceObject.tilePixelWidth, //required
				height: interfaceObject.tilePixelWidth, //required
				content: [[interfaceObject.uiIcons.compassIcon," New Game"]], //optional //1st array dimension represents separate rows, 2nd dimension are items in the row
				label: 'Start new game', //optional //empty label(" ") can be used to match button/icon sizing to others w/labels
				selected: false, //optional
				highlighted: false, //optional
				availabilityCheck: function() { //optional
					//code to check button availability
				},
				clickAction: function() { //optional
					//code to execute on click
				}					
			};		
		
		//component parameters to be read by interface drawUI()
		//components will be drawn on interface canvas in order of array below
		this.uiScreens.exampleScreenUI = [exampleScreenComponents.exampleComponent];		

		*/
		
		
		//menu screen UI components
		this.uiComponents.menuScreen = {};	
		var menuComponents = this.uiComponents.menuScreen;
		
		menuComponents.gameTitleBackground = 
			{	
				screenBackground: menuBackgroundImage,
				noInset: true,
				x: (((interfaceObject.backCanvasTileWidth - 1) / 2) - 5) * interfaceObject.tilePixelWidth, //alternate interfaceObject property for display on larger background UI canvas
				y: (((interfaceObject.backCanvasTileHeight - 1) / 2) - 5) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth * 11,
				height: interfaceObject.tilePixelWidth * 11/*,
				content: null*/
			};
			
		menuComponents.exitButton = 
			{	
				backgroundStyle: 'menu01',
				roundedCorners: true,
				transparency: true,
				outline: true,
				content: [[interfaceObject.uiIcons.closeIcon]],
				label: 'Exit',
				x: interfaceObject.uiTileHorizontalMargin() * interfaceObject.tilePixelWidth,
				y: interfaceObject.uiTileVerticalMargin() * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth, 
				height: interfaceObject.tilePixelWidth,
				availabilityCheck: function() {
					return false;//FIXME - temporary
				}/*,
				clickAction: function() {
					//if (this.availabilityCheck()) {
						//Game.Screen.playScreen.player.useHealingPotion();
					//}
				}	*/				
			};	
			
		menuComponents.continueGameButton = 
			{	
				backgroundStyle: 'menu01',
				roundedCorners: true,
				transparency: true,
				outline: true,
				x: (((interfaceObject.canvasTileWidth - 1) / 2) - 2) * interfaceObject.tilePixelWidth, //positioning on screen //required
				y: ((interfaceObject.canvasTileHeight - 1) / 2) * interfaceObject.tilePixelWidth, //required
				width: interfaceObject.tilePixelWidth * 5,
				height: interfaceObject.tilePixelWidth,
				content: [[interfaceObject.uiIcons.arrowIconRight,"Continue"]],
				highlighted: false,
				availabilityCheck: function() {
					Game.Screen.loadGameScreen.updateSavedGameKeyList();
					
					//reset highlighting
					menuComponents.continueGameButton.highlighted = false;
					menuComponents.newGameButton.highlighted = true;
					
					var savedGames = Game.Screen.loadGameScreen.savedGames.length > 0;
					
					if (savedGames) { 
						menuComponents.continueGameButton.highlighted = true;
						menuComponents.newGameButton.highlighted = false;
					}

					return savedGames;					
				},
				clickAction: function() {
					var saves = Game.Screen.loadGameScreen.savedGames;
					var savedGameObject;
					
					//for determining most recent time stamp
					var recentSaveTimeStamps = [];
					
					//for loading most recent save - recent time stamps as properties with save keys as values
					var recentSaveKeys = {};
					
					for (var x in saves){
						savedGameObject = JSON.parse(localStorage.getItem(saves[x]));
						if (savedGameObject) {
							recentSaveTimeStamps.push(savedGameObject.currentSaveTimeStamp);
							recentSaveKeys[savedGameObject.currentSaveTimeStamp] = saves[x];
						}
					}
					
					var mostRecentSaveTimeStamp = Math.max.apply(null, recentSaveTimeStamps);
					Game.resumeGame(recentSaveKeys[mostRecentSaveTimeStamp]);

				}					
			};
			
		menuComponents.loadGameButton = 
			{	
				backgroundStyle: 'menu01',
				roundedCorners: true,
				transparency: true,
				outline: true,
				x: (((interfaceObject.canvasTileWidth - 1) / 2) - 2) * interfaceObject.tilePixelWidth, //positioning on screen //required
				y: (((interfaceObject.canvasTileHeight - 1) / 2) + 1) * interfaceObject.tilePixelWidth, //required
				width: interfaceObject.tilePixelWidth * 5,
				height: interfaceObject.tilePixelWidth,
				content: [[interfaceObject.uiIcons.loadGameIcon," Load"]],
				availabilityCheck: function() {
					Game.Screen.loadGameScreen.updateSavedGameKeyList();
					return Game.Screen.loadGameScreen.savedGames.length > 0;
				},
				clickAction: function() {
					Game.switchScreen(Game.Screen.loadGameScreen);
				}					
			};	
			
		menuComponents.newGameButton = 
			{	
				backgroundStyle: 'menu01',
				roundedCorners: true,
				transparency: true,
				outline: true,
				x: (((interfaceObject.canvasTileWidth - 1) / 2) - 2) * interfaceObject.tilePixelWidth,
				y: (((interfaceObject.canvasTileHeight - 1) / 2) + 2) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth * 5,
				height: interfaceObject.tilePixelWidth,
				content: [[interfaceObject.uiIcons.newGameIcon," New"]],
				highlighted: false,
				clickAction: function() {
					Game.Screen.playScreen.map = null; //reset
					Game.switchScreen(Game.Screen.newGameScreen);
				}					
			};

		this.uiScreens.menuScreenUI = [menuComponents.gameTitleBackground, menuComponents.exitButton, menuComponents.continueGameButton, menuComponents.loadGameButton, menuComponents.newGameButton];		
		
		//play screen UI components
		this.uiComponents.playScreen = {};	
		var playComponents = this.uiComponents.playScreen;

		playComponents.menuButton = 
			{	
				backgroundStyle: 'menu01',//'hud01',
				roundedCorners: true,
				transparency: true,
				outline: true,
				content: [[interfaceObject.uiIcons.menuIcon]],
				label: 'Menu',
				//x: 0, 
				//y: 0,
				x: interfaceObject.uiTileHorizontalMargin() * interfaceObject.tilePixelWidth,
				//x: interfaceObject.uiTileHorizontalMargin() * interfaceObject.tilePixelWidth,
				//((interfaceObject.uiMenuScreenTileWidth() > 7) ? 3 : interfaceObject.uiTileVerticalMargin())
				//y: interfaceObject.uiTileVerticalMargin() * interfaceObject.tilePixelWidth,
				//y: (interfaceObject.canvasTileHeight - 2) * interfaceObject.tilePixelWidth,
				y: ((interfaceObject.uiMenuScreenTileWidth() > 7) ? (interfaceObject.canvasTileHeight - 1) : 0) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth, 
				height: interfaceObject.tilePixelWidth,
				clickAction: function() {
					Game.switchScreen(Game.Screen.menuScreen);
				}					
			};

		playComponents.healButton = 
			{	
				backgroundStyle: 'menu01',
				//backgroundStyle: 'heal01',
				roundedCorners: true,
				transparency: true,
				outline: true,
				content: [[interfaceObject.uiIcons.healIcon]],
				label: 'Heal',
				//x: (interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth,
				//y: (interfaceObject.canvasTileHeight * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth,
				//x: (interfaceObject.uiTileHorizontalMargin() + interfaceObject.uiMenuScreenTileWidth() - 2 /*interfaceObject.uiHalfTilesWide() + ((interfaceObject.uiMenuScreenTileWidth() > 5) ? 3 : 2)*/) * interfaceObject.tilePixelWidth,
				//x: (interfaceObject.uiHalfTilesWide() + 1) * interfaceObject.tilePixelWidth,
				x: (interfaceObject.uiTileHorizontalMargin() + interfaceObject.uiMenuScreenTileWidth() - interfaceObject.uiHalfTilesWide()) * interfaceObject.tilePixelWidth,
				//y: (interfaceObject.uiTileVerticalMargin() + interfaceObject.uiMenuScreenTileHeight() - 1 ) * interfaceObject.tilePixelWidth,
				//y: (interfaceObject.getBackCanvasHeight() - 5 ) * interfaceObject.tilePixelWidth,
				y: (interfaceObject.canvasTileHeight - 1) * interfaceObject.tilePixelWidth,
				//width: interfaceObject.tilePixelWidth,
				//width: 2 * interfaceObject.tilePixelWidth,
				//width: (interfaceObject.uiHalfTilesWide()) * interfaceObject.tilePixelWidth,
				width: ((interfaceObject.uiMenuScreenTileWidth() > 7) ? (interfaceObject.uiHalfTilesWide() - 2) : interfaceObject.uiHalfTilesWide()) * interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				availabilityCheck: function() {
					return Game.Screen.playScreen.player.haveHealingPotion();
				},
				clickAction: function() {
					Game.Screen.playScreen.player.useHealingPotion();
				}				
			};
			
		playComponents.pauseButton = 
			{	
				backgroundStyle: 'menu01',
				roundedCorners: true,
				transparency: true,
				outline: true,
				content:[[interfaceObject.uiIcons.pauseIcon]],
				label: 'Pause',
				//x: interfaceObject.tilePixelWidth,
				//x: (interfaceObject.uiTileHorizontalMargin() + 1) * interfaceObject.tilePixelWidth,
				x: ((interfaceObject.uiMenuScreenTileWidth() > 7) ? (interfaceObject.uiTileHorizontalMargin() + 2) : interfaceObject.uiTileHorizontalMargin()) * interfaceObject.tilePixelWidth,
				y: (interfaceObject.canvasTileHeight - 1) * interfaceObject.tilePixelWidth,
				//width: (interfaceObject.uiMenuScreenTileWidth() - 2) * interfaceObject.tilePixelWidth,
				//width: 2 * interfaceObject.tilePixelWidth,
				width: ((interfaceObject.uiMenuScreenTileWidth() > 7) ? (interfaceObject.uiHalfTilesWide() - 2) : interfaceObject.uiHalfTilesWide()) * interfaceObject.tilePixelWidth,
				//width: (interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - (interfaceObject.tilePixelWidth * 2),
				height: interfaceObject.tilePixelWidth,
				clickAction: function() {
					Game.Screen.playScreen.pauseToggle();
				}			
			};			

		playComponents.messageDisplay = 
			{	 
				textStyle: 'headingText02',
				x: interfaceObject.tilePixelWidth,
				y: 0,
				width:(interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - (interfaceObject.tilePixelWidth * 2),
				height: interfaceObject.tilePixelWidth,
				content: null //set by engine process actor	
			};
		
		/*playComponents.depthDisplay = 
			{	
				transparency: true,
				imageBackground: interfaceObject.uiIcons.stairsIcon,
				textStyle: 'headingText01',
				x: (interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth,
				y: 0,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				content: null,
				label: 'Depth',
			};*/				

		playComponents.mapButton = 
			{	
				backgroundStyle: 'menu01',
				roundedCorners: true,
				transparency: true,
				outline: true,
				content: [[interfaceObject.uiIcons.compassIcon]],
				label: 'Map',
				//x: interfaceObject.uiTileHorizontalMargin() * interfaceObject.tilePixelWidth,
				x: (interfaceObject.uiTileHorizontalMargin() + interfaceObject.uiMenuScreenTileWidth() - 1 ) * interfaceObject.tilePixelWidth,
				//y: (interfaceObject.uiTileVerticalMargin()  + interfaceObject.uiMenuScreenTileHeight() - 1 ) * interfaceObject.tilePixelWidth,
				//y: (interfaceObject.canvasTileHeight - 1) * interfaceObject.tilePixelWidth,
				y: ((interfaceObject.uiMenuScreenTileWidth() > 7) ? (interfaceObject.canvasTileHeight - 1) : 0) * interfaceObject.tilePixelWidth,				
				//x: 0, 
				//y: (interfaceObject.canvasTileHeight * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth, 
				height: interfaceObject.tilePixelWidth,
				clickAction: function() {
					Game.switchScreen(Game.Screen.mapScreen);
				}					
			};

		this.uiScreens.playScreenUI = [playComponents.menuButton, playComponents.healButton, playComponents.pauseButton, playComponents.messageDisplay, /*playComponents.depthDisplay, */playComponents.mapButton];		
		
		//inventory screen UI components
		this.uiComponents.inventoryScreen = {};	
		var inventoryComponents = this.uiComponents.inventoryScreen;

		inventoryComponents.screenBackground = 
			{	
				screenBackground: tunnelBackgroundImage,
				noInset: true,
				x: (((interfaceObject.backCanvasTileWidth - 1) / 2) - 5) * interfaceObject.tilePixelWidth,
				y: (((interfaceObject.backCanvasTileHeight - 1) / 2) - 5) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth * 11,
				height: interfaceObject.tilePixelWidth * 11,
				content: null
			};
		
		inventoryComponents.closeButton = 
			{	
				backgroundStyle: 'menu01',
				roundedCorners: true,
				transparency: true,
				outline: true,
				content: [[interfaceObject.uiIcons.arrowIconLeft]],
				label: 'Back',
				//x: 0,
				//y: 0,
				x: interfaceObject.uiTileHorizontalMargin() * interfaceObject.tilePixelWidth,
				y: interfaceObject.uiTileVerticalMargin() * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				clickAction: function() {
					Game.switchScreen(Game.Screen.playScreen);
				}					
			};

		inventoryComponents.messageDisplay = 
			{	
				//x: interfaceObject.tilePixelWidth,
				//y: 0,
				//x: (interfaceObject.uiTileHorizontalMargin() + 1) * interfaceObject.tilePixelWidth,
				x: (interfaceObject.uiTileHorizontalMargin() + interfaceObject.uiHalfTilesWide() - 1) * interfaceObject.tilePixelWidth,
				y: interfaceObject.uiTileVerticalMargin() * interfaceObject.tilePixelWidth,
				//width:(interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - (interfaceObject.tilePixelWidth * 2),
				width: interfaceObject.tilePixelWidth * 3,
				height: interfaceObject.tilePixelWidth,
				content: null
			};
		
		inventoryComponents.statDisplay = 
			{	
				backgroundStyle: 'equipped01',
				roundedCorners: true,
				transparency: true,
				//outline: true,
				textStyle: 'statText01',
				content: null, //set by inventory screen render calling setStatsDisplayContent method above
				x: (interfaceObject.uiTileHorizontalMargin() + interfaceObject.uiMenuScreenTileWidth() - 2 /*interfaceObject.uiHalfTilesWide() + ((interfaceObject.uiMenuScreenTileWidth() > 5) ? 3 : 2)*/) * interfaceObject.tilePixelWidth,				
				y: (interfaceObject.uiTileVerticalMargin() + 2) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth * 2,
				height: interfaceObject.tilePixelWidth
			};
			
		inventoryComponents.groundInventorySwapButton = 
			{
				backgroundStyle: 'menu01',
				roundedCorners: true,
				transparency: true,
				outline: true,
				content: [[interfaceObject.uiIcons.arrowIconRightLeft]],
				label: 'Move',
				highlighted: false,
				x: (interfaceObject.uiTileHorizontalMargin() + interfaceObject.uiMenuScreenTileWidth() - 3 /*interfaceObject.uiHalfTilesWide() + ((interfaceObject.uiMenuScreenTileWidth() > 5) ? 3 : 2)*/) * interfaceObject.tilePixelWidth,
				y: (interfaceObject.uiTileVerticalMargin() + 4) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth,
				height: (interfaceObject.uiMenuScreenTileHeight() - 5) * interfaceObject.tilePixelWidth,
				availabilityCheck: function() {	
					//default
					this.content = [[interfaceObject.uiIcons.arrowIconRightLeft]];
					this.label = 'Move';
					this.highlighted = false;
											
					//return false if nothing selected
					var	selectedItem = Game.Screen.inventoryScreen.selectedItem;
					if (!selectedItem) {
						return false;
					}
					
					var player = Game.Screen.playScreen.player;
					var inventoryScreen = Game.Screen.inventoryScreen;
					
					var groundItemSelected = inventoryScreen.isGroundItem(selectedItem, player);
					var inventoryItemSelected = inventoryScreen.isInventoryItem(selectedItem, player);

					if (groundItemSelected || inventoryItemSelected) {
						this.content = [[interfaceObject.uiIcons.arrowIconLeft]];
						this.label = 'Pick up';
						
						if (inventoryItemSelected) {
							this.content = [[interfaceObject.uiIcons.arrowIconRight]];
							this.label = 'Drop';
						}
					
						this.highlighted = true;
						return true;
					} else {
						return false;
					}
				},
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
				backgroundStyle: 'menu01',
				roundedCorners: true,
				transparency: true,
				outline: true,
				content: [[interfaceObject.uiIcons.arrowIconUpDown]],
				label: 'Move',
				highlighted: false,
				x: (interfaceObject.uiTileHorizontalMargin() + interfaceObject.uiHalfTilesWide() - 2) * interfaceObject.tilePixelWidth,
				y: (interfaceObject.uiTileVerticalMargin() + 2) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth * 3,
				//width: (interfaceObject.uiMenuScreenTileWidth() - 5) * interfaceObject.tilePixelWidth,
				//x: interfaceObject.tilePixelWidth,//0,
				//y: interfaceObject.tilePixelWidth * 2,
				//width: (interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - (interfaceObject.tilePixelWidth * 4),//interfaceObject.tilePixelWidth * 2,
				height: interfaceObject.tilePixelWidth,
				availabilityCheck: function() {	
					//default
					this.content = [[interfaceObject.uiIcons.arrowIconUpDown]];
					this.label = 'Move';
					this.highlighted = false;
					
					//return false if nothing selected or un-equippable item selected
					var	selectedItem = Game.Screen.inventoryScreen.selectedItem;
					if (!selectedItem || !selectedItem.equippable) {
						return false;
					}
									
					var player = Game.Screen.playScreen.player;
					var inventoryScreen = Game.Screen.inventoryScreen;
				
					var equippedItemSelected = inventoryScreen.isEquippedItem(selectedItem, player);
					var inventoryItemSelected = inventoryScreen.isInventoryItem(selectedItem, player);

					if (equippedItemSelected || inventoryItemSelected) {
						this.content = [[interfaceObject.uiIcons.arrowIconDown]];
						this.label = 'Remove';
						
						if (inventoryItemSelected) {
							this.content = [[interfaceObject.uiIcons.arrowIconUp]];
							this.label = 'Equip';
						}
					
						this.highlighted = true;
						return true;
					} else {
						return false;
					}
				},
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
				backgroundStyle: 'menu01',
				roundedCorners: true,
				transparency: true,
				outline: true,
				content: [[interfaceObject.uiIcons.arrowIconUp]],
				label: ' ',
				//x: (interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth,
				x: (interfaceObject.uiTileHorizontalMargin() + interfaceObject.uiMenuScreenTileWidth() - 1 /*interfaceObject.uiHalfTilesWide() + ((interfaceObject.uiMenuScreenTileWidth() > 5) ? 3 : 2)*/) * interfaceObject.tilePixelWidth,
				y: (interfaceObject.uiTileVerticalMargin() + 3 ) * interfaceObject.tilePixelWidth, // * 3,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				availabilityCheck: function() {					
					if (Game.Screen.inventoryScreen.displaysFirstItemsDisplayed.ground > 0) {
						return true;
					} else {
						return false;
					}
				},
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
				backgroundStyle: 'menu01',
				roundedCorners: true,
				transparency: true,
				outline: true,
				content: [[interfaceObject.uiIcons.arrowIconDown]],
				label: ' ',
				//x: (interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth,
				//y: (interfaceObject.canvasTileHeight * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth,
				x: (interfaceObject.uiTileHorizontalMargin() + interfaceObject.uiMenuScreenTileWidth() - 1 /*interfaceObject.uiHalfTilesWide() + ((interfaceObject.uiMenuScreenTileWidth() > 5) ? 3 : 2)*/) * interfaceObject.tilePixelWidth,
				y: (interfaceObject.uiTileVerticalMargin()  + interfaceObject.uiMenuScreenTileHeight() - 1 ) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				availabilityCheck: function() {	
					//return out if nothing on ground
					var groundItems = Game.Screen.inventoryScreen.groundItems;
					if (!groundItems || groundItems.length === 0) {
						return false;
					}				

					var displayComponent = Game.loadedEnvironment.uiComponents.inventoryScreen.groundDisplay
					var interfaceObject = Game.interfaceObject;
					var tilePixelWidth = interfaceObject.tilePixelWidth;
					var displaySlots = (displayComponent.height / tilePixelWidth) * (displayComponent.width / tilePixelWidth);
					var totalItems = groundItems.length;
					var firstDisplayedItem = Game.Screen.inventoryScreen.displaysFirstItemsDisplayed.ground;
					
					if (totalItems > displaySlots && totalItems > firstDisplayedItem + displaySlots) {
						return true;
					} else {
						return false;
					}
				},
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
				backgroundStyle: 'menu01',
				roundedCorners: true,
				transparency: true,
				outline: true,
				content: [[interfaceObject.uiIcons.arrowIconUp]],
				label: ' ',
				x: interfaceObject.uiTileHorizontalMargin() * interfaceObject.tilePixelWidth,
				y: (interfaceObject.uiTileVerticalMargin() + 3) * interfaceObject.tilePixelWidth,
				//x: 0,
				//y: interfaceObject.tilePixelWidth * 3,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				availabilityCheck: function() {					
					if (Game.Screen.inventoryScreen.displaysFirstItemsDisplayed.inventory > 0) {
						return true;
					} else {
						return false;
					}
				},
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
				backgroundStyle: 'menu01',
				roundedCorners: true,
				transparency: true,
				outline: true,
				content: [[interfaceObject.uiIcons.arrowIconDown]],
				label: ' ',
				x: interfaceObject.uiTileHorizontalMargin() * interfaceObject.tilePixelWidth,
				y: (interfaceObject.uiTileVerticalMargin()  + interfaceObject.uiMenuScreenTileHeight() - 1 ) * interfaceObject.tilePixelWidth,
				//x: 0,
				//y: (interfaceObject.canvasTileHeight * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				availabilityCheck: function() {	
					//return out if nothing in inventory
					var inventoryItems = Game.Screen.inventoryScreen.inventoryItems;
					if (!inventoryItems || inventoryItems.length === 0) {
						return false;
					}				

					var displayComponent = Game.loadedEnvironment.uiComponents.inventoryScreen.inventoryDisplay
					var interfaceObject = Game.interfaceObject;
					var tilePixelWidth = interfaceObject.tilePixelWidth;
					var displaySlots = (displayComponent.height / tilePixelWidth) * (displayComponent.width / tilePixelWidth);
					var totalItems = inventoryItems.length;
					var firstDisplayedItem = Game.Screen.inventoryScreen.displaysFirstItemsDisplayed.inventory;
					
					if (totalItems > displaySlots && totalItems > firstDisplayedItem + displaySlots) {
						return true;
					} else {
						return false;
					}
				},
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
				//backgroundStyle: 'menu01',
				//roundedCorners: true,
				//transparency: true,
				//outline: true,
				//x: 0,
				//y: interfaceObject.tilePixelWidth,
				//width: interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth,
				//x: (interfaceObject.uiTileHorizontalMargin() + interfaceObject.uiHalfTilesWide() - 2) * interfaceObject.tilePixelWidth,
				x: (interfaceObject.uiTileHorizontalMargin() + interfaceObject.uiHalfTilesWide() - ((interfaceObject.uiMenuScreenTileWidth() > 10) ? 3 : 2)) * interfaceObject.tilePixelWidth,
				y: (interfaceObject.uiTileVerticalMargin() + 1) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth * 5,
				height: interfaceObject.tilePixelWidth						
			};
			
		inventoryComponents.equippedDisplayHelmIcon = 
			{
				backgroundStyle: 'equipped01',
				imageBackground: interfaceObject.uiIcons.helmIconWhite,
				roundedCorners: true,
				transparency: true,
				//outline: true,
				//content: [[interfaceObject.uiIcons.helmIconWhite]],
				x: (interfaceObject.uiTileHorizontalMargin() + interfaceObject.uiHalfTilesWide() - ((interfaceObject.uiMenuScreenTileWidth() > 10 ? 3 : 2))) * interfaceObject.tilePixelWidth,
				y: (interfaceObject.uiTileVerticalMargin() + 1) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth						
			};
		
		inventoryComponents.equippedDisplayArmorIcon = 
			{
				backgroundStyle: 'equipped01',
				imageBackground: interfaceObject.uiIcons.armorIconWhite,
				roundedCorners: true,
				transparency: true,
				//outline: true,
				//content: [[interfaceObject.uiIcons.helmIconWhite]],
				x: (interfaceObject.uiTileHorizontalMargin() + interfaceObject.uiHalfTilesWide() - ((interfaceObject.uiMenuScreenTileWidth() > 10 ? 2 : 1))) * interfaceObject.tilePixelWidth,
				y: (interfaceObject.uiTileVerticalMargin() + 1) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth						
			};
		
		inventoryComponents.equippedDisplayAttackIcon = 
			{
				backgroundStyle: 'equipped01',
				imageBackground: interfaceObject.uiIcons.attackIconWhite,
				roundedCorners: true,
				transparency: true,
				//outline: true,
				//content: [[interfaceObject.uiIcons.helmIconWhite]],
				x: (interfaceObject.uiTileHorizontalMargin() + interfaceObject.uiHalfTilesWide() - ((interfaceObject.uiMenuScreenTileWidth() > 10 ? 1 : 0))) * interfaceObject.tilePixelWidth,
				y: (interfaceObject.uiTileVerticalMargin() + 1) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth						
			};
			
		inventoryComponents.equippedDisplayDefenseIcon = 
			{
				backgroundStyle: 'equipped01',
				imageBackground: interfaceObject.uiIcons.defenseIconWhite,
				roundedCorners: true,
				transparency: true,
				//outline: true,
				//content: [[interfaceObject.uiIcons.helmIconWhite]],
				x: (interfaceObject.uiTileHorizontalMargin() + interfaceObject.uiHalfTilesWide() + ((interfaceObject.uiMenuScreenTileWidth() > 10 ? 0 : 1))) * interfaceObject.tilePixelWidth,
				y: (interfaceObject.uiTileVerticalMargin() + 1) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth						
			};
			
		inventoryComponents.equippedDisplayAmuletIcon = 
			{
				backgroundStyle: 'equipped01',
				imageBackground: interfaceObject.uiIcons.amuletIconWhite,
				roundedCorners: true,
				transparency: true,
				//outline: true,
				//content: [[interfaceObject.uiIcons.helmIconWhite]],
				x: (interfaceObject.uiTileHorizontalMargin() + interfaceObject.uiHalfTilesWide() + ((interfaceObject.uiMenuScreenTileWidth() > 10 ? 1 : 2))) * interfaceObject.tilePixelWidth,
				y: (interfaceObject.uiTileVerticalMargin() + 1) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth						
			};
		

		inventoryComponents.inventoryDisplay = 
			{
				backgroundStyle: 'tile01',
				backgroundTile: burlap01TextureTile,
				roundedCorners: true,
				transparency: true,
				outline: true,
				//x: interfaceObject.tilePixelWidth,
				//y: interfaceObject.tilePixelWidth * 3,
				x: (interfaceObject.uiTileHorizontalMargin() + 1) * interfaceObject.tilePixelWidth,
				y: (interfaceObject.uiTileVerticalMargin() + 3) * interfaceObject.tilePixelWidth,
				//width: (interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - (interfaceObject.tilePixelWidth * 4),
				width: (interfaceObject.uiMenuScreenTileWidth() - 4) * interfaceObject.tilePixelWidth,
				//height: (interfaceObject.canvasTileHeight * interfaceObject.tilePixelWidth) - (interfaceObject.tilePixelWidth * 3)
				height: (interfaceObject.uiMenuScreenTileHeight() - 3) * interfaceObject.tilePixelWidth			
			};

		inventoryComponents.groundDisplay = 
			{
				backgroundStyle: 'tile01',
				backgroundTile: ground01TextureTile,
				roundedCorners: true,
				transparency: true,
				outline: true,
				x: (interfaceObject.uiTileHorizontalMargin() + interfaceObject.uiMenuScreenTileWidth() - 2 /*interfaceObject.uiHalfTilesWide() + ((interfaceObject.uiMenuScreenTileWidth() > 5) ? 3 : 2)*/) * interfaceObject.tilePixelWidth,
				//x: (interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - (interfaceObject.tilePixelWidth * 2),
				y: (interfaceObject.uiTileVerticalMargin() + 3) * interfaceObject.tilePixelWidth,
				//y: interfaceObject.tilePixelWidth * 3,
				width: interfaceObject.tilePixelWidth,
				height: (interfaceObject.uiMenuScreenTileHeight() - 3) * interfaceObject.tilePixelWidth
				//height: (interfaceObject.canvasTileHeight * interfaceObject.tilePixelWidth) - (interfaceObject.tilePixelWidth * 3)				
			};
			
		this.uiScreens.inventoryScreenUI = [inventoryComponents.screenBackground, inventoryComponents.closeButton, inventoryComponents.messageDisplay, /*inventoryComponents.statAttackDefenseDisplay, inventoryComponents.statHealthExpDisplay,*/ inventoryComponents.statDisplay, /*inventoryComponents.statsDisplayAttack, inventoryComponents.statsDisplayDefense, inventoryComponents.statsDisplayHealth, inventoryComponents.statsDisplayExperience, */inventoryComponents.groundInventorySwapButton, inventoryComponents.equippedDisplay, inventoryComponents.equippedDisplayHelmIcon, inventoryComponents.equippedDisplayArmorIcon, inventoryComponents.equippedDisplayAttackIcon, inventoryComponents.equippedDisplayDefenseIcon, inventoryComponents.equippedDisplayAmuletIcon, inventoryComponents.inventoryDisplay, inventoryComponents.groundDisplay, inventoryComponents.groundScrollUpButton, inventoryComponents.groundScrollDownButton, inventoryComponents.inventoryScrollUpButton, inventoryComponents.inventoryScrollDownButton, inventoryComponents.inventoryEquippedSwapButton];
		
		//stat assignment screen UI components
		this.uiComponents.statAssignmentScreen = {};	
		var statAssignmentComponents = this.uiComponents.statAssignmentScreen;

		statAssignmentComponents.screenBackground = 
			{	
				screenBackground: tunnelBackgroundImage,
				noInset: true,
				x: (((interfaceObject.backCanvasTileWidth - 1) / 2) - 5) * interfaceObject.tilePixelWidth,
				y: (((interfaceObject.backCanvasTileHeight - 1) / 2) - 5) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth * 11,
				height: interfaceObject.tilePixelWidth * 11,
				content: null
			};

		statAssignmentComponents.saveButton = 
			{	
				backgroundStyle: 'menu01',
				roundedCorners: true,
				transparency: true,
				outline: true,	
				x: (((interfaceObject.canvasTileWidth - 1) / 2) - 2)  * interfaceObject.tilePixelWidth,
				y: (((interfaceObject.canvasTileHeight - 1) / 2) + 2) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth * 5,
				height: interfaceObject.tilePixelWidth,
				content: [[interfaceObject.uiIcons.checkmarkIcon, "Confirm"]],
				highlighted: false,
				availabilityCheck: function() {
					var availability = Game.Screen.statAssignmentScreen.statRaising;
					
					//reset
					statAssignmentComponents.saveButton.highlighted = false;
					
					if (availability) {
						statAssignmentComponents.saveButton.highlighted = true;
					}
					
					return availability;
				},
				clickAction: function() {			
					Game.Screen.statAssignmentScreen.statAssignment();
					Game.switchScreen(Game.Screen.playScreen);
				}				
			};
			
		statAssignmentComponents.instructionsDisplay = 
			{	
				textStyle: 'headingText01',
				x: (((interfaceObject.canvasTileWidth - 1) / 2) - 2)  * interfaceObject.tilePixelWidth,
				y: (((interfaceObject.canvasTileHeight - 1) / 2) - 2) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth * 5,
				height: interfaceObject.tilePixelWidth,
				content: [["Improve Skill"]]
			};	

		statAssignmentComponents.attackIncreaseButton = 
			{	
				backgroundStyle: 'menu01',
				roundedCorners: true,
				transparency: true,
				outline: true,
				roundedCorners: true,
				x: (((interfaceObject.canvasTileWidth - 1) / 2) - 2)  * interfaceObject.tilePixelWidth,
				y: (((interfaceObject.canvasTileHeight - 1) / 2) - 1) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth * 5,
				height: interfaceObject.tilePixelWidth,
				content: [["Attack"]],
				selected: false,
				clickAction: function() {	
					this.selected = true;		
					Game.Screen.statAssignmentScreen.statRaising = "attack";
					Game.Screen.statAssignmentScreen.render();
				}					
			};

		statAssignmentComponents.defenseIncreaseButton = 
			{	
				backgroundStyle: 'menu01',
				roundedCorners: true,
				transparency: true,
				outline: true,
				roundedCorners: true,
				x: (((interfaceObject.canvasTileWidth - 1) / 2) - 2)  * interfaceObject.tilePixelWidth,
				y: ((interfaceObject.canvasTileHeight - 1) / 2) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth * 5,
				height: interfaceObject.tilePixelWidth,
				content: [["Defense"]],
				selected: false,
				clickAction: function() {	
					this.selected = true;
					Game.Screen.statAssignmentScreen.statRaising = "defense";
					Game.Screen.statAssignmentScreen.render();
				}					
			};

		statAssignmentComponents.hpIncreaseButton = 
			{	
				backgroundStyle: 'menu01',
				roundedCorners: true,
				transparency: true,
				outline: true,
				roundedCorners: true,
				x: (((interfaceObject.canvasTileWidth - 1) / 2) - 2)  * interfaceObject.tilePixelWidth,
				y: (((interfaceObject.canvasTileHeight - 1) / 2) + 1) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth * 5,
				height: interfaceObject.tilePixelWidth,
				content: [["Health"]],
				selected: false,
				clickAction: function() {	
					this.selected = true;
					Game.Screen.statAssignmentScreen.statRaising = "health";
					Game.Screen.statAssignmentScreen.render();
				}					
			};

		statAssignmentComponents.attackCurrentValueDisplay = 
			{	
				textStyle: 'headingText01',
				imageBackground: interfaceObject.uiIcons.attackIcon,
				transparency: true,
				x: (((interfaceObject.canvasTileWidth - 1) / 2) + 1)  * interfaceObject.tilePixelWidth,
				y: (((interfaceObject.canvasTileHeight - 1) / 2) - 1) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				content: null
			};

		statAssignmentComponents.defenseCurrentValueDisplay = 
			{	
				textStyle: 'headingText01',
				imageBackground: interfaceObject.uiIcons.defenseIcon,
				transparency: true,
				x: (((interfaceObject.canvasTileWidth - 1) / 2) + 1)  * interfaceObject.tilePixelWidth,
				y: ((interfaceObject.canvasTileHeight - 1) / 2) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				content: null
			};

		statAssignmentComponents.hpCurrentValueDisplay = 
			{	
				textStyle: 'headingText01',
				imageBackground: interfaceObject.uiIcons.healthIcon,
				transparency: true,
				x: (((interfaceObject.canvasTileWidth - 1) / 2) + 1)  * interfaceObject.tilePixelWidth,
				y: (((interfaceObject.canvasTileHeight - 1) / 2) + 1) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				content: null
			};

		this.uiScreens.statAssignmentScreenUI = [statAssignmentComponents.screenBackground, statAssignmentComponents.saveButton, statAssignmentComponents.instructionsDisplay, statAssignmentComponents.attackIncreaseButton, statAssignmentComponents.defenseIncreaseButton, statAssignmentComponents.hpIncreaseButton, statAssignmentComponents.attackCurrentValueDisplay, statAssignmentComponents.defenseCurrentValueDisplay, statAssignmentComponents.hpCurrentValueDisplay];

		//map screen UI components
		this.uiComponents.mapScreen = {};	
		var mapComponents = this.uiComponents.mapScreen;

		mapComponents.closeButton = 
			{	
				backgroundStyle: 'menu01',
				roundedCorners: true,
				transparency: true,
				outline: true,
				content: [[interfaceObject.uiIcons.arrowIconLeft]],
				label: 'Back',
				//x: 0,
				//y: 0,
				x: interfaceObject.uiTileHorizontalMargin() * interfaceObject.tilePixelWidth,
				y: interfaceObject.uiTileVerticalMargin() * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				clickAction: function() {
					Game.SpecialEffects.clearCanvas();
					Game.switchScreen(Game.Screen.playScreen);
				}					
			};

		mapComponents.depthDisplay = 
			{	
				transparency: true,
				imageBackground: interfaceObject.uiIcons.stairsIcon,
				textStyle: 'headingText01',
				//x: (interfaceObject.canvasTileWidth * interfaceObject.tilePixelWidth) - interfaceObject.tilePixelWidth,
				//y: 0,
				x: (interfaceObject.uiTileHorizontalMargin() + interfaceObject.uiMenuScreenTileWidth() - 1 /*interfaceObject.uiHalfTilesWide() + ((interfaceObject.uiMenuScreenTileWidth() > 5) ? 3 : 2)*/) * interfaceObject.tilePixelWidth,				
				y: interfaceObject.uiTileVerticalMargin() * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				content: null,
				label: 'Depth',
			};
		this.uiScreens.mapScreenUI = [mapComponents.closeButton,mapComponents.depthDisplay];

		//player death screen UI components
		this.uiComponents.playerDeathScreen = {};	
		var playerDeathComponents = this.uiComponents.playerDeathScreen;
		
		playerDeathComponents.screenBackground = 
			{	
				screenBackground: tunnelBackgroundImage,
				noInset: true,
				x: (((interfaceObject.backCanvasTileWidth - 1) / 2) - 5) * interfaceObject.tilePixelWidth,
				y: (((interfaceObject.backCanvasTileHeight - 1) / 2) - 5) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth * 11,
				height: interfaceObject.tilePixelWidth * 11,
				content: null
			};
			
		playerDeathComponents.slainMessageDisplay = 
			{	
				textStyle: 'headingText01',
				x: (((interfaceObject.canvasTileWidth - 1) / 2) - 2)  * interfaceObject.tilePixelWidth,
				y: (((interfaceObject.canvasTileHeight - 1) / 2) - 1) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth * 5,
				height: interfaceObject.tilePixelWidth,
				content: [["You have died"]]
			};	
			
		playerDeathComponents.continueButton = 
			{	
				backgroundStyle: 'menu01',
				roundedCorners: true,
				transparency: true,
				outline: true,
				x: (((interfaceObject.canvasTileWidth - 1) / 2) - 2)  * interfaceObject.tilePixelWidth,
				y: ((interfaceObject.canvasTileHeight - 1) / 2) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth * 5,
				height: interfaceObject.tilePixelWidth,
				content: [[interfaceObject.uiIcons.arrowIconRight,"Continue"]],
				highlighted: true,
				clickAction: function() {
					Game.loadedEnvironment.playerResurrect();	
					Game.SpecialEffects.clearCanvas();
					Game.switchScreen(Game.Screen.playScreen);
				}					
			};
		
		playerDeathComponents.menuButton = 
			{	
				backgroundStyle: 'menu01',
				roundedCorners: true,
				transparency: true,
				outline: true,
				content: [[interfaceObject.uiIcons.menuIcon]],
				label: 'Menu',
				x: interfaceObject.uiTileHorizontalMargin() * interfaceObject.tilePixelWidth,
				y: interfaceObject.uiTileVerticalMargin() * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth, 
				height: interfaceObject.tilePixelWidth,
				clickAction: function() {
					Game.switchScreen(Game.Screen.menuScreen);
				}					
			};		
		
		this.uiScreens.playerDeathScreenUI = [playerDeathComponents.screenBackground, playerDeathComponents.menuButton, playerDeathComponents.slainMessageDisplay, playerDeathComponents.continueButton];


		//confirm screen UI components
		this.uiComponents.confirmScreen = {};	
		var confirmComponents = this.uiComponents.confirmScreen;

		confirmComponents.screenBackground = 
			{	
				screenBackground: tunnelBackgroundImage,
				noInset: true,
				x: (((interfaceObject.backCanvasTileWidth - 1) / 2) - 5) * interfaceObject.tilePixelWidth,
				y: (((interfaceObject.backCanvasTileHeight - 1) / 2) - 5) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth * 11,
				height: interfaceObject.tilePixelWidth * 11,
				content: null
			};
		
		confirmComponents.backButton = 
			{	
				backgroundStyle: 'menu01',
				roundedCorners: true,
				transparency: true,
				outline: true,
				content: [[interfaceObject.uiIcons.arrowIconLeft]],
				label: 'Back',
				x: interfaceObject.uiTileHorizontalMargin() * interfaceObject.tilePixelWidth,
				y: interfaceObject.uiTileVerticalMargin() * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth, 
				height: interfaceObject.tilePixelWidth,
				clickAction: function() {
					Game.switchScreen(Game.Screen.confirmScreen.returnScreen);
				}					
			};

		
		confirmComponents.confirmMessageDisplay = 
			{	
				textStyle: 'headingText01',
				x: (((interfaceObject.canvasTileWidth - 1) / 2) - 2)  * interfaceObject.tilePixelWidth,
				y: (((interfaceObject.canvasTileHeight - 1) / 2) - 1) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth * 5,
				height: interfaceObject.tilePixelWidth,
				content: null //FIXME? setting this in Screens confirmScreen render()
			};	
			
		confirmComponents.continueButton = 
			{	
				backgroundStyle: 'menu01',
				roundedCorners: true,
				transparency: true,
				outline: true,
				content: [[interfaceObject.uiIcons.checkmarkIcon,"Yes"]],
				label: 'This action cannot be undone.',
				x: (((interfaceObject.canvasTileWidth - 1) / 2) - 2)  * interfaceObject.tilePixelWidth,
				y: ((interfaceObject.canvasTileHeight - 1) / 2) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth * 5,
				height: interfaceObject.tilePixelWidth,
				highlighted: true,
				clickAction: function() {

					var confObject = Game.Screen.confirmScreen.confirmationCommandObject;
					var confMethod = Game.Screen.confirmScreen.confirmationCommandMethod;
					var confParameters = Game.Screen.confirmScreen.confirmationCommandParameters;
					
					confObject[confMethod](confParameters);
					
					Game.switchScreen(Game.Screen.confirmScreen.returnScreen);
				}					
			};

		confirmComponents.cancelButton = 
			{	
				backgroundStyle: 'menu01',
				roundedCorners: true,
				transparency: true,
				outline: true,
				content: [[interfaceObject.uiIcons.closeIcon,"Cancel"]],
				x: (((interfaceObject.canvasTileWidth - 1) / 2) - 2)  * interfaceObject.tilePixelWidth,
				y: (((interfaceObject.canvasTileHeight - 1) / 2) + 2) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth * 5,
				height: interfaceObject.tilePixelWidth,
				clickAction: function() {					
					Game.switchScreen(Game.Screen.confirmScreen.returnScreen);
				}					
			};

		this.uiScreens.confirmScreenUI = [confirmComponents.screenBackground, confirmComponents.backButton, confirmComponents.confirmMessageDisplay, confirmComponents.continueButton, confirmComponents.cancelButton];

		//new game screen UI components
		this.uiComponents.newGameScreen = {};	
		var newGameComponents = this.uiComponents.newGameScreen;

		newGameComponents.screenBackground = 
			{	
				screenBackground: tunnelBackgroundImage,
				noInset: true,
				x: (((interfaceObject.backCanvasTileWidth - 1) / 2) - 5) * interfaceObject.tilePixelWidth,
				y: (((interfaceObject.backCanvasTileHeight - 1) / 2) - 5) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth * 11,
				height: interfaceObject.tilePixelWidth * 11,
				content: null
			};
	
		newGameComponents.menuButton = 
			{	
				backgroundStyle: 'menu01',
				roundedCorners: true,
				transparency: true,
				outline: true,
				content: [[interfaceObject.uiIcons.arrowIconLeft]],
				label: 'Back',
				x: interfaceObject.uiTileHorizontalMargin() * interfaceObject.tilePixelWidth,
				y: interfaceObject.uiTileVerticalMargin() * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth, 
				height: interfaceObject.tilePixelWidth,
				clickAction: function() {
					Game.switchScreen(Game.Screen.menuScreen);
				}					
			};

		newGameComponents.difficultyMessageDisplay = 
			{	
				textStyle: 'headingText01',
				x: (((interfaceObject.canvasTileWidth - 1) / 2) - 2)  * interfaceObject.tilePixelWidth,
				y: (((interfaceObject.canvasTileHeight - 1) / 2) - 2) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth * 5,
				height: interfaceObject.tilePixelWidth,
				content: [["Choose Difficulty"]]
			};

		newGameComponents.easyButton = 
			{	
				backgroundStyle: 'menu01',
				roundedCorners: true,
				transparency: true,
				outline: true,
				roundedCorners: true,
				x: (((interfaceObject.canvasTileWidth - 1) / 2) - 2)  * interfaceObject.tilePixelWidth,
				y: (((interfaceObject.canvasTileHeight - 1) / 2) - 1) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth * 5,
				height: interfaceObject.tilePixelWidth,
				content: [[interfaceObject.uiIcons.attackIcon," Easy"]],
				selected: false,
				clickAction: function() {	
					this.selected = true;
					var newGameScreen = Game.Screen.newGameScreen;
					//newGameScreen.setDifficultySetting('easy');
					newGameScreen.difficultySelection = 1; //easy
					newGameScreen.render();
				}					
			};

		newGameComponents.mediumButton = 
			{	
				backgroundStyle: 'menu01',
				roundedCorners: true,
				transparency: true,
				outline: true,
				roundedCorners: true,
				x: (((interfaceObject.canvasTileWidth - 1) / 2) - 2)  * interfaceObject.tilePixelWidth,
				y: ((interfaceObject.canvasTileHeight - 1) / 2) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth * 5,
				height: interfaceObject.tilePixelWidth,
				content: [[interfaceObject.uiIcons.attackIcon,interfaceObject.uiIcons.attackIcon," Medium"]],
				selected: false,
				clickAction: function() {	
					this.selected = true;
					var newGameScreen = Game.Screen.newGameScreen;
					//newGameScreen.setDifficultySetting('medium');
					newGameScreen.difficultySelection = 2; //medium
					newGameScreen.render();
				}					
			};

		newGameComponents.hardButton = 
			{	
				backgroundStyle: 'menu01',
				roundedCorners: true,
				transparency: true,
				outline: true,
				roundedCorners: true,
				x: (((interfaceObject.canvasTileWidth - 1) / 2) - 2)  * interfaceObject.tilePixelWidth,
				y: (((interfaceObject.canvasTileHeight - 1) / 2) + 1) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth * 5,
				height: interfaceObject.tilePixelWidth,
				content: [[interfaceObject.uiIcons.attackIcon,interfaceObject.uiIcons.attackIcon,interfaceObject.uiIcons.attackIcon," Hard"]],
				selected: false,
				clickAction: function() {	
					this.selected = true;
					var newGameScreen = Game.Screen.newGameScreen;
					//newGameScreen.setDifficultySetting('hard');
					newGameScreen.difficultySelection = 3; //hard
					newGameScreen.render();
				}					
			};

		/*newGameComponents.nightmareButton = 
			{	
				backgroundStyle: 'menu01',
				roundedCorners: true,
				transparency: true,
				outline: true,
				roundedCorners: true,
				x: (((interfaceObject.canvasTileWidth - 1) / 2) - 2)  * interfaceObject.tilePixelWidth,
				y: (((interfaceObject.canvasTileHeight - 1) / 2) + 2) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth * 3,
				height: interfaceObject.tilePixelWidth,
				content: [["For the glory!"]],
				selected: false,
				clickAction: function() {	
					//Game.Screen.newGameScreen.clearSelected();
					this.selected = true;
					//Game.Screen.newGameScreen.setDifficultySetting('nightmare');
					var newGameScreen = Game.Screen.newGameScreen;
					newGameScreen.setDifficultySetting('nightmare');
					newGameScreen.difficultySelection = 4; //nightmare
					newGameScreen.render();
				}						
			};*/
		
		newGameComponents.beginButton = 
			{	
				backgroundStyle: 'menu01',
				roundedCorners: true,
				transparency: true,
				outline: true,
				roundedCorners: true,
				x: (((interfaceObject.canvasTileWidth - 1) / 2) - 2)  * interfaceObject.tilePixelWidth,
				y: (((interfaceObject.canvasTileHeight - 1) / 2) + 2) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth * 5,
				height: interfaceObject.tilePixelWidth,
				content: [[interfaceObject.uiIcons.arrowIconRight,"Play"]],
				highlighted: false,
				availabilityCheck: function() {
					//var availability = Game.Screen.newGameScreen.difficultySelected();
					var availability = Game.Screen.newGameScreen.difficultySelection;
					
					//reset
					newGameComponents.beginButton.highlighted = false;
					
					if (availability) {
						newGameComponents.beginButton.highlighted = true;
					}
					
					return availability;
				},
				clickAction: function() {
					Game.Screen.playScreen.difficultySetting = Game.Screen.newGameScreen.difficultySelection;
					Game.switchScreen(Game.Screen.playScreen);
				}					
			};
		
		this.uiScreens.newGameScreenUI = [newGameComponents.screenBackground, newGameComponents.menuButton, newGameComponents.difficultyMessageDisplay, newGameComponents.easyButton, newGameComponents.mediumButton, newGameComponents.hardButton, /*newGameComponents.nightmareButton, */newGameComponents.beginButton];

		
		//load game screen UI components
		this.uiComponents.loadGameScreen = {};	
		var loadGameComponents = this.uiComponents.loadGameScreen;

		loadGameComponents.screenBackground = 
			{	
				screenBackground: tunnelBackgroundImage,
				noInset: true,
				x: (((interfaceObject.backCanvasTileWidth - 1) / 2) - 5) * interfaceObject.tilePixelWidth,
				y: (((interfaceObject.backCanvasTileHeight - 1) / 2) - 5) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth * 11,
				height: interfaceObject.tilePixelWidth * 11,
				content: null
			};
			
		loadGameComponents.menuButton = 
			{	
				backgroundStyle: 'menu01',
				roundedCorners: true,
				transparency: true,
				outline: true,
				content: [[interfaceObject.uiIcons.arrowIconLeft]],
				label: 'Back',
				x: interfaceObject.uiTileHorizontalMargin() * interfaceObject.tilePixelWidth,
				y: interfaceObject.uiTileVerticalMargin() * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				clickAction: function() {
					Game.switchScreen(Game.Screen.menuScreen);
				}					
			};

		loadGameComponents.instructionsDisplay = 
			{	
				textStyle: 'headingText01',
				x: (interfaceObject.uiTileHorizontalMargin() + interfaceObject.uiHalfTilesWide() - 2) * interfaceObject.tilePixelWidth,
				y: interfaceObject.uiTileVerticalMargin() * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth * 5,
				height: interfaceObject.tilePixelWidth,
				content: [["Saved Games"]]
			};	

		loadGameComponents.loadGameButton = 
			{	
				backgroundStyle: 'menu01',
				roundedCorners: true,
				transparency: true,
				outline: true,
				content: [[interfaceObject.uiIcons.arrowIconRight,"Play"]],
				x: (interfaceObject.uiTileHorizontalMargin() + interfaceObject.uiHalfTilesWide() - 1) * interfaceObject.tilePixelWidth,
				y: (interfaceObject.uiTileVerticalMargin() + interfaceObject.uiMenuScreenTileHeight() - 1) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth * 3,
				height: interfaceObject.tilePixelWidth,
				highlighted: false,
				availabilityCheck: function() {
					var available = Game.Screen.loadGameScreen.selectedSavedGame;
					
					//reset
					loadGameComponents.loadGameButton.highlighted = false;
					
					if (available) {
						loadGameComponents.loadGameButton.highlighted = true;
					}
					
					return available;
				},
				clickAction: function() {
					Game.resumeGame(Game.Screen.loadGameScreen.selectedSavedGame);
				}					
			};

		loadGameComponents.deleteGameButton = 
			{	
				backgroundStyle: 'menu01',
				roundedCorners: true,
				transparency: true,
				outline: true,
				content: [[interfaceObject.uiIcons.trashIcon]],
				label: 'Delete',
				x: interfaceObject.uiTileHorizontalMargin() * interfaceObject.tilePixelWidth,
				y: (interfaceObject.uiTileVerticalMargin() + interfaceObject.uiMenuScreenTileHeight() - 1) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,				
				availabilityCheck: function() {
					return Game.Screen.loadGameScreen.selectedSavedGame;
				},
				clickAction: function() {	
					//set message to display 'Delete saved game'
					Game.Screen.confirmScreen.confirmationMessage = [['Delete game?']];
					
					//set command object						
					Game.Screen.confirmScreen.confirmationCommandObject = localStorage;
					
					//set command object method to execute
					Game.Screen.confirmScreen.confirmationCommandMethod = 'removeItem';
					
					//set parameters to pass into command
					Game.Screen.confirmScreen.confirmationCommandParameters = Game.Screen.loadGameScreen.selectedSavedGame;
					
					//set screen to return to after execution or cancelation
					Game.Screen.confirmScreen.returnScreen = Game.Screen.loadGameScreen;
					
					Game.switchScreen(Game.Screen.confirmScreen);
				}					
			};
		
		loadGameComponents.savedGameDisplay =
			{
				x: (interfaceObject.uiTileHorizontalMargin() + interfaceObject.uiHalfTilesWide() - 2) * interfaceObject.tilePixelWidth,
				y: (interfaceObject.uiTileVerticalMargin() + 1) * interfaceObject.tilePixelWidth,
				width: ((interfaceObject.uiMenuScreenTileWidth() > 5) ? 5 : 4) * interfaceObject.tilePixelWidth,// - 1,
				height: (interfaceObject.uiMenuScreenTileHeight() - 2) * interfaceObject.tilePixelWidth
			};

		loadGameComponents.savedGameScrollUpButton = 
			{
				backgroundStyle: 'menu01',
				roundedCorners: true,
				transparency: true,
				outline: true,
				content: [[interfaceObject.uiIcons.arrowIconUp]],
				label: ' ',
				x: (interfaceObject.uiTileHorizontalMargin() + interfaceObject.uiHalfTilesWide() + ((interfaceObject.uiMenuScreenTileWidth() > 5) ? 3 : 2)) * interfaceObject.tilePixelWidth,
				y: (interfaceObject.uiTileVerticalMargin() + 1) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				availabilityCheck: function() {					
					if (Game.Screen.loadGameScreen.firstSavedGameDisplayed > 0) {
						return true;
					} else {
						return false;
					}
				},
				clickAction: function() {
					var direction = 'up';
					Game.Screen.loadGameScreen.savedGameDisplayScroll(direction);
				}				
			};

		loadGameComponents.savedGameScrollDownButton = 
			{
				backgroundStyle: 'menu01',
				roundedCorners: true,
				transparency: true,
				outline: true,
				content: [[interfaceObject.uiIcons.arrowIconDown]],
				label: ' ',
				x: (interfaceObject.uiTileHorizontalMargin() + interfaceObject.uiHalfTilesWide() + ((interfaceObject.uiMenuScreenTileWidth() > 5) ? 3 : 2)) * interfaceObject.tilePixelWidth,
				y: (interfaceObject.uiTileVerticalMargin() + interfaceObject.uiMenuScreenTileHeight() - 2) * interfaceObject.tilePixelWidth,	
				width: interfaceObject.tilePixelWidth,
				height: interfaceObject.tilePixelWidth,
				availabilityCheck: function() {					
				
					var displayComponent = Game.loadedEnvironment.uiComponents.loadGameScreen.savedGameDisplay;
					var interfaceObject = Game.interfaceObject;
					var tilePixelWidth = interfaceObject.tilePixelWidth;
					var displaySlots = displayComponent.height / tilePixelWidth;
					var totalButtons = Game.Screen.loadGameScreen.savedGameButtons.length;
					var firstDisplayedGame = Game.Screen.loadGameScreen.firstSavedGameDisplayed;
										
					if (totalButtons > displaySlots && totalButtons > firstDisplayedGame + displaySlots) {
						return true;
					} else {
						return false;
					}
				},
				clickAction: function() {
					var direction = 'down';
					Game.Screen.loadGameScreen.savedGameDisplayScroll(direction);
				}
			};
			
		/*loadGameComponents.horizontalRuleTop = 
			{
				horizontalRule: 'bottom',
				x: (((interfaceObject.canvasTileWidth - 1) / 2) - 2)  * interfaceObject.tilePixelWidth,
				y: (((interfaceObject.canvasTileHeight - 1) / 2) - 2) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth * 5,
				height: 10//interfaceObject.tilePixelWidth,					
			};
			
		loadGameComponents.horizontalRuleBottom = 
			{
				horizontalRule: 'bottom',
				x: (((interfaceObject.canvasTileWidth - 1) / 2) - 2)  * interfaceObject.tilePixelWidth,
				y: (((interfaceObject.canvasTileHeight - 1) / 2) + 1) * interfaceObject.tilePixelWidth,
				width: interfaceObject.tilePixelWidth * 5,
				height: 10//interfaceObject.tilePixelWidth,					
			};*/

		this.uiScreens.loadGameScreenUI = [loadGameComponents.screenBackground, loadGameComponents.menuButton, loadGameComponents.instructionsDisplay, loadGameComponents.savedGameDisplay, loadGameComponents.savedGameScrollUpButton, loadGameComponents.savedGameScrollDownButton, loadGameComponents.loadGameButton, loadGameComponents.deleteGameButton/*, loadGameComponents.horizontalRuleTop, loadGameComponents.horizontalRuleBottom*/];		
		
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

Game.AgainstTheOoze.Mixins = {};

Game.AgainstTheOoze.Mixins.PlayerActor = {
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
    			//Game.switchScreen(Game.Screen.inventoryScreen);
				
				var item = this.map.getItemsAt(this.x, this.y)[0];
				Game.Screen.inventoryScreen.itemInventoryGroundSwap(item, this);
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
    haveHealingPotion: function() {
		for (var x = 0, y = this.inventory.length; x < y; x++) {
		
			if (this.inventory[x].name === 'Healing potion') {
				
				return true;							
			}
		}
		
		return false;
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

Game.AgainstTheOoze.PlayerTemplate = {
    templateType: 'PlayerTemplate',
    name: 'Redmurk',
    character: '@',
	spriteSheetX: 0, //multiple applied to Game.interfaceObject.tilePixelWidth to determine actual pixel coordinate on spritesheet
    spriteSheetY: 8, //5
    maxHp: 10,
    attackValue: 2,
    defenseValue: 1,
    sightRadius: 4,
    speed: 1200,
    mixins: [Game.AgainstTheOoze.Mixins.PlayerActor,
    		Game.Mixins.Attacker, Game.Mixins.Destructible,
    		Game.Mixins.Sight, Game.Mixins.Equipper,
    		Game.Mixins.ExperienceGainer, Game.Mixins.StatAssigner,
    		Game.Mixins.LevelChanger, Game.Mixins.InventoryCarrier]
}

Game.AgainstTheOoze.Mixins.SlimeActor = {
    name: 'SlimeActor',
    groupName: 'Actor'
}

Game.AgainstTheOoze.SlimeTemplate = {
    templateType: 'SlimeTemplate',
    name: 'Slime',
    character: 'S',
	spriteSheetX: 0,
    spriteSheetY: 12, //9
	maxHp: 5,
	attackValue: 1,
    defenseValue: 1,
	speed: 100,
	tasks: ['hunt', 'heal', 'wander'],
    mixins: [Game.AgainstTheOoze.Mixins.SlimeActor, 
    		Game.Mixins.TaskActor, Game.Mixins.Sight,
    		Game.Mixins.Destructible, Game.Mixins.Attacker,
    		Game.Mixins.InventoryCarrier]
}

Game.AgainstTheOoze.HealingPotionTemplate = {
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

Game.AgainstTheOoze.SmallSwordTemplate = {
	templateType: 'SmallSwordTemplate',
	name: 'Small sword',
	//rarity: 2,
	character: 'smallsword',
	spriteSheetX: 0,
    spriteSheetY: 3,	
	attackValue: 1,
	equippable: 'hand', //must match one of the .equipped property names in Game.Mixins.Equipper - needed for inventory equipping
	mixins: [Game.ItemMixins.Equippable]
}

Game.AgainstTheOoze.WoodenShieldTemplate = {
	templateType: 'WoodenShieldTemplate',
	name: 'Wooden shield',
	//rarity: 2,
	character: 'woodenshield',
	spriteSheetX: 0,
    spriteSheetY: 4,	
	defenseValue: 1,
	equippable: 'shieldhand',
	mixins: [Game.ItemMixins.Equippable]
}

Game.AgainstTheOoze.WoodenHelmTemplate = {
	templateType: 'WoodenHelmTemplate',
	name: 'Wooden helm',
	//rarity: 2,
	character: 'woodenhelm',
	spriteSheetX: 0,
    spriteSheetY: 16,	
	defenseValue: 1,
	equippable: 'head',
	mixins: [Game.ItemMixins.Equippable]
}

Game.AgainstTheOoze.WoodenArmorTemplate = {
	templateType: 'WoodenArmorTemplate',
	name: 'Wooden armor',
	//rarity: 2,
	character: 'woodenarmor',
	spriteSheetX: 0,
    spriteSheetY: 17,	
	defenseValue: 1,
	equippable: 'body',
	mixins: [Game.ItemMixins.Equippable]
}

Game.AgainstTheOoze.GreenAmuletTemplate = {
	templateType: 'GreenAmuletTemplate',
	name: 'Green amulet',
	//rarity: 2,
	character: 'greenamulet',
	spriteSheetX: 0,
    spriteSheetY: 18,	
	healthValue: 1,
	equippable: 'accessory',
	mixins: [Game.ItemMixins.Equippable]
}

Game.AgainstTheOoze.StairsDownTemplate = {
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

Game.AgainstTheOoze.StairsUpTemplate = {
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

Game.AgainstTheOoze.StairsCollapsedTemplate = {
	templateType: 'StairsCollapsedTemplate',
	character: 'stairscollapsed',
	spriteSheetX: 0,
    spriteSheetY: 7,
    x: null,
    y: null
}

Game.loadedEnvironment = Game.AgainstTheOoze;