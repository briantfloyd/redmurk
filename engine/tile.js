Game.Tile = function(properties) {
	properties = properties || {};
	Game.Glyph.call(this, properties);
	this.walkable = properties['walkable'] || false;
	this.blocksLight = (properties['blocksLight'] !== undefined) ? properties['blocksLight'] : false;
	this.spriteSheetY = properties['spriteSheetY'] || 0;
	this.spriteSheetX = properties['spriteSheetX'] || 0;
};

Game.Tile.extend(Game.Glyph);

/*Game.getNeighborPositions = function(x, y) {
    var tiles = [];

    for (var dX = -1; dX < 2; dX ++) {
        for (var dY = -1; dY < 2; dY++) {
            if (dX == 0 && dY == 0) {
                continue;
            }
            tiles.push({x: x + dX, y: y + dY});
        }
    }
    return tiles.randomize();
}*/