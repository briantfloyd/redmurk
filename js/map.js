Game.Map = function(tiles, player) {
    this.tiles = tiles;
    this.width = tiles.length;
    this.height = tiles[0].length;
    this.entities = [];
    this.scheduler = new ROT.Scheduler.Simple();
    this.engine = new ROT.Engine(this.scheduler);

    this.addEntityAtRandomPosition(player);
    /*for (var i = 0; i < 1000; i++) {
        this.addEntityAtRandomPosition(new Game.Entity(Game.FungusTemplate));
    }*/   
};

Game.Map.prototype.getTile = function(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
        console.log('getTile() coordinates outside of map');
        return false;
    } else {
        return this.tiles[x][y];
    }
};

Game.Map.prototype.getRandomFloorPosition = function() {
    var x, y;
    do {
        x = Math.floor(Math.random() * this.width);
        y = Math.floor(Math.random() * this.width);
    } while(this.getTile(x, y) != Game.Tile.floorTile);
    return {x: x, y: y};
};

Game.Map.prototype.getEntityAt = function(x, y){
    for (var i = 0; i < this.entities.length; i++) {
        if (this.entities[i].x == x && this.entities[i].y == y) {
            return this.entities[i];
        }
    }
    return false;
};

Game.Map.prototype.addEntity = function(entity) {
    if (entity.x < 0 || entity.x >= this.width ||
        entity.y < 0 || entity.y >= this.height) {
        throw new Error('Adding entity out of bounds.');
    }
    entity.map = this;
    this.entities.push(entity);
    if (entity.hasMixin('Actor')) {
       this.scheduler.add(entity, true);
    }
}

Game.Map.prototype.addEntityAtRandomPosition = function(entity) {
    var position = this.getRandomFloorPosition();
    entity.x = position.x;
    entity.y = position.y;
    this.addEntity(entity);
}

Game.Map.prototype.getRandomFloorPosition = function() {
    var x, y;
    do {
        x = Math.floor(Math.random() * this.width);
        y = Math.floor(Math.random() * this.height);
    } while(this.getTile(x, y) != Game.Tile.floorTile ||
            this.getEntityAt(x, y));
    return {x: x, y: y};
}