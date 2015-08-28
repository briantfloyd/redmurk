Game.Map = function(tiles) {
    this.tiles = tiles;
    this.width = tiles.length;
    this.height = tiles[0].length;
    this.depth = 0;
    this.entities = {};
    this.items = {};
    //this.scheduler = new ROT.Scheduler.Simple();
    this.scheduler = new ROT.Scheduler.Speed();
    this.engine = new ROT.Engine(this.scheduler);
    this.fov = [];
    this.setupFov();
    this.explored = null;
    this.setupExploredArray();
};

Game.Map.prototype.getTile = function(x, y) {
//console.log(x + ',' + y);
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
        return false;
    } else {    
        return this.tiles[x][y];
    }
};

Game.Map.prototype.getEntityAt = function(x, y){    
    return this.entities[x + ',' + y];
};

/*Game.Map.prototype.getEntitiesWithinRadius = function(centerX, centerY, radius) {
    results = [];
    var leftX = centerX - radius;
    var rightX = centerX + radius;
    var topY = centerY - radius;
    var bottomY = centerY + radius;

    for (var key in this.entities) {
    	var entity = this.entities[key];
        if (this.entities[i].x >= leftX &&
            this.entities[i].x <= rightX && 
            this.entities[i].y >= topY &&
            this.entities[i].y <= bottomY) {
            results.push(entity);
        }
    }
    return results;
}*/

Game.Map.prototype.addEntity = function(entity) {
    entity.map = this;
    this.updateEntityPosition(entity);

    if (entity.hasMixin('Actor')) {
       this.scheduler.add(entity, true);
    }  
}

Game.Map.prototype.addEngineProcessActor = function(actor) {
    actor.map = this;

    if (actor.hasMixin('Actor')) {
       this.scheduler.add(actor, true);
    }  
}

Game.Map.prototype.removeEntity = function(entity) {
    var key = entity.x + ',' + entity.y;
    if (this.entities[key] == entity) {
        delete this.entities[key];
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

Game.Map.prototype.setupFov = function() {
    var map = this;

    for (var z = 0; z <= this.depth; z++) { //FIXME - depth
        // We have to put the following code in it's own scope to prevent the depth variable from being hoisted out of the loop.
        (function() {
            // For each depth, we need to create a callback which figures out if light can pass through a given tile.
            var depth = z; //FIXME - depth
            map.fov.push(
                new ROT.FOV.DiscreteShadowcasting(function(x, y) {
                    return !map.getTile(x, y).blocksLight;
                }, {topology: 8}));
        })();
    }
}

Game.Map.prototype.setupExploredArray = function() {
	this.explored = new Array(this.width);
	for (var x = 0; x < this.width; x++) {
		this.explored[x] = new Array(this.height);
		for (var y = 0; y < this.height; y++) {
			this.explored[x][y] = false;
		}
	}
};

Game.Map.prototype.setExplored = function(x, y, state) {
    if (this.getTile(x, y)) {
        this.explored[x][y] = state;
    }
};

Game.Map.prototype.isExplored = function(x, y) {
    if (this.getTile(x, y)) {
        return this.explored[x][y];
    } else {
        return false;
    }
};

Game.Map.prototype.updateEntityPosition = function(entity, oldX, oldY) {
    if (typeof oldX === 'number') {
        var oldKey = oldX + ',' + oldY;
        if (this.entities[oldKey] == entity) {
            delete this.entities[oldKey];
        }
    }

    if (entity.x < 0 || entity.x >= this.width ||
        entity.y < 0 || entity.y >= this.height) {
        throw new Error("Entity's position is out of bounds.");
    }

    var key = entity.x + ',' + entity.y;
    if (this.entities[key]) {
        throw new Error('Tried to add an entity at an occupied position.');
    }
    // Add the entity to the table of entities
    this.entities[key] = entity;
};

Game.Map.prototype.getItemsAt = function(x, y) {
    return this.items[x + ',' + y];
};

/*Game.Map.prototype.setItemsAt = function(x, y, items) {
    // If our items array is empty, then delete the key from the table.
    var key = x + ',' + y;
    if (items.length === 0) {
        if (this.items[key]) {
            delete this.items[key];
        }
    } else {
        // Simply update the items at that key
        this.items[key] = items;
    }
};*/

Game.Map.prototype.addItem = function(x, y, item) {
    var key = x + ',' + y;
    if (this.items[key]) {
        this.items[key].push(item);
    } else {
        this.items[key] = [item];
    }
};

Game.Map.prototype.addItemAtRandomPosition = function(item) {
    var position = this.getRandomFloorPosition();
    this.addItem(position.x, position.y, item);
};

Game.Map.prototype.inRange = function(entity1, entity2, range) {
    
    var xDifference = Math.abs(Math.abs(entity1.x) - Math.abs(entity2.x));
    var yDifference = Math.abs(Math.abs(entity1.y) - Math.abs(entity2.y));
    
    if (xDifference <= range && yDifference <= range) {
    	return true;
    } else {
    	return false;
    }
};

