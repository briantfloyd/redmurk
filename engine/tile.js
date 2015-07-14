Game.Tile = function(properties) {
	properties = properties || {};
	Game.Glyph.call(this, properties);
	this.walkable = properties['walkable'] || false;
	this.blocksLight = (properties['blocksLight'] !== undefined) ? properties['blocksLight'] : false;
};

Game.Tile.extend(Game.Glyph);

Game.Tile.floorTile = new Game.Tile({
	character: '.',
	walkable: true
});

Game.Tile.wallTile = new Game.Tile({
	character: '#',
	walkable: false,
	blocksLight: true
});

Game.Tile.stairsUpTile = new Game.Tile({
    character: '<',
    walkable: true
});

Game.Tile.stairsDownTile = new Game.Tile({
    character: '>',
    walkable: true
});

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