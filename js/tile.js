Game.Tile = function(glyph) {
    this.glyph = glyph;
};

Game.Tile.floorTile = new Game.Tile(new Game.Glyph('.'));
Game.Tile.wallTile = new Game.Tile(new Game.Glyph('#', 'goldenrod'));
