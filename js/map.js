Game.Map = function(tiles) {
    this.tiles = tiles;
    this.width = tiles.length;
    this.height = tiles[0].length;
};

Game.Map.prototype.getTile = function(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
        console.log('getTile() coordinates outside of map');
    } else {
        return this.tiles[x][y];
    }
};