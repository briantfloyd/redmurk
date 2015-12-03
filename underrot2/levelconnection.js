/* Copyright (c) 2015, Brian T. Floyd. FreeBSD License. */
Game.LevelConnection = function(properties) {
    properties = properties || {};

    Game.Glyph.call(this, properties);

    //this.name = properties['name'] || '';
    
	this.spriteSheetY = properties['spriteSheetY'] || 0;
	this.spriteSheetX = properties['spriteSheetX'] || 0;
	
	var tilePixelWidth = Game.interfaceObject.tilePixelWidth;
	
	this.spriteSheetY *= tilePixelWidth; 
	this.spriteSheetX *= tilePixelWidth;

	//update character to spritesheet coordinate mapping
	Game.display._options.tileMap[this.character] = [this.spriteSheetX, this.spriteSheetY];
	
	this.direction = properties['direction'] || null;
	this.templateType = properties['templateType'] || null;
	
	//this.level = properties['level'] || null;
	
	this.connectingLevel = properties['connectingLevel'] || null; //assigned on changeLevels()
	this.connectingLevelX = properties['connectingLevelX'] || null;
	this.connectingLevelY = properties['connectingLevelY'] || null;
	
	this.x = properties['x'] || null;
	this.y = properties['y'] || null;
		
};

Game.LevelConnection.extend(Game.Glyph);