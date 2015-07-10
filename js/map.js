Game.Map = function(tiles) {
    this.tiles = tiles;
    this.width = tiles.length;
    this.height = tiles[0].length;
    this.entities = [];
    this.scheduler = new ROT.Scheduler.Simple();
    this.engine = new ROT.Engine(this.scheduler);
};

Game.Map.prototype.getTile = function(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
        console.log('getTile() coordinates outside of map');
        return false;
    } else {
        return this.tiles[x][y];
    }
};

Game.Map.prototype.getEntityAt = function(x, y){
    var entitiesLength = this.entities.length;
    if (entitiesLength > 0) {
		for (var i = 0; i < this.entities.length; i++) {
			if (this.entities[i].x == x && this.entities[i].y == y) {
				return this.entities[i];
			}
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

Game.Map.prototype.removeEntity = function(entity) {
    for (var i = 0; i < this.entities.length; i++) {
        if (this.entities[i] == entity) {
            this.entities.splice(i, 1);
            break;
        }
    }
    if (entity.hasMixin('Actor')) {
        this.scheduler.remove(entity);
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
    } while(!this.isEmptyFloor(x, y));
    return {x: x, y: y};
}

Game.Map.prototype.isEmptyFloor = function(x, y) {
	if (this.getTile(x, y).walkable === false  || this.getEntityAt(x, y)) {
		return false;
	} 
	return true;
}