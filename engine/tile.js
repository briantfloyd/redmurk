Game.Tile = function(properties) {
	properties = properties || {};
	Game.Glyph.call(this, properties);
	this.walkable = properties['walkable'] || false;
	this.blocksLight = (properties['blocksLight'] !== undefined) ? properties['blocksLight'] : false;
	this.spriteSheetY = properties['spriteSheetY'] || 0;
	this.spriteSheetX = properties['spriteSheetX'] || 0;
	this.tileType = properties['tileType'] || null;

	var tilePixelWidth = Game.interfaceObject.tilePixelWidth;
	
	this.spriteSheetY *= tilePixelWidth; 
	this.spriteSheetX *= tilePixelWidth;

	//update character to spritesheet coordinate mapping
	Game.display._options.tileMap[this.character] = [this.spriteSheetX, this.spriteSheetY];	
};

Game.Tile.extend(Game.Glyph);