Game.Tile = function(properties) {
	properties = properties || {};
	Game.Glyph.call(this, properties);
	this.isWalkable = properties['isWalkable'] || false;
};

Game.Tile.extend(Game.Glyph);

Game.Tile.floorTile = new Game.Tile({
	character: '.',
	isWalkable: true
});

Game.Tile.wallTile = new Game.Tile({
	character: '#',
	isWalkable: true
});