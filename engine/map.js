Game.Map = function(tiles) {
    this.tiles = tiles;
    this.width = tiles.length;
    this.height = tiles[0].length;
    this.depth = 0; //FIXME - also on playscreen - using here?
    this.entities = {};
    this.items = {};
    this.fov = [];
    this.explored = null;
    
    this.levelConnections = {};
    
    //this.scheduler = new ROT.Scheduler.Simple();
    //this.scheduler = new ROT.Scheduler.Speed();
    //this.engine = new ROT.Engine(this.scheduler); 
    
    this.setupFov();    
    this.setupExploredArray();
};

Game.Map.prototype.getTile = function(x, y) {
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

Game.Map.prototype.getEmptyFloorPositions = function() {
    var emptyFloorPositions = [];
    for (var i = 0, j = this.width; i < j; i++) {
    	for (var k = 0, l = this.height; k < l; k++) {
    		if (this.isEmptyFloor(i, k)) {
    			var emptyPositionCoordinates = {};
    			emptyPositionCoordinates.x = i;
    			emptyPositionCoordinates.y = k;
    			emptyFloorPositions.push(emptyPositionCoordinates);
    		}
    	}
    }
   
    if (emptyFloorPositions.length > 0) {
    	return emptyFloorPositions;
    }
    
    return false;
}

Game.Map.prototype.getRandomFloorPosition = function() {    
    var emptyFloorPositions = this.getEmptyFloorPositions();      

    if (emptyFloorPositions) {
    	var dice = Math.floor(Math.random() * emptyFloorPositions.length);
    	return emptyFloorPositions[dice];
    }
    
    return false; 
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

Game.Map.prototype.addItem = function(x, y, item) {
    var key = x + ',' + y;
    if (this.items[key]) {
        this.items[key].push(item);
    } else {
        this.items[key] = [item];
    }
};

Game.Map.prototype.setItemsAt = function(x, y, items) {
    var key = x + ',' + y;
    if (items.length === 0) {
        if (this.items[key]) {
            delete this.items[key];
        }
    } else {
        this.items[key] = items;
    }
};

Game.Map.prototype.addItemAtRandomPosition = function(item) {
    var position = this.getRandomFloorPosition();
    this.addItem(position.x, position.y, item);
};

Game.Map.prototype.getLevelConnectionAt = function(x, y) {
    return this.levelConnections[x + ',' + y];
};

Game.Map.prototype.addLevelConnection = function(x, y, levelConnection) {
    //save position
    levelConnection.x = x;
    levelConnection.y = y;

    var key = x + ',' + y;
    this.levelConnections[key] = levelConnection;
};

Game.Map.prototype.addLevelConnectionAtRandomPosition = function(levelConnection) {
	var levelConnectionPosition = null;
	var emptyFloorPositions = this.getEmptyFloorPositions();
	
	if (emptyFloorPositions) {
		
		while (emptyFloorPositions.length > 0) {
			var dice = Math.floor(Math.random() * emptyFloorPositions.length);
			var possiblePosition = emptyFloorPositions.splice(dice, 1);
			possiblePosition = possiblePosition[0];
			
			if (!this.levelConnections[possiblePosition.x + ',' + possiblePosition.y]) {
				levelConnectionPosition = possiblePosition;
				
				this.addLevelConnection(levelConnectionPosition.x, levelConnectionPosition.y, levelConnection);
	
				break;
			}
		}
	} 
	
	return levelConnectionPosition;
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

Game.Map.prototype.distantLevelConnectionPurge = function() {
	//removes level connections on levels two connections distant
	//FIXME - node depth to check hard coded - # of depth iterations should be parameter based

	//current node
	var startingLevel = this;
	
	for (var y in startingLevel.levelConnections) {
	
		//if has a connection with a level already created
		if (this.levelConnections[y].connectingLevel) {
			
			//one node distance
			var firstConnectedLevel = this.levelConnections[y].connectingLevel;
			
			//check each of that levels connections
			for (var j in firstConnectedLevel.levelConnections) {
				
				//if one of those connects to an already created level that is not the one it just came from
				if (firstConnectedLevel.levelConnections[j].connectingLevel && firstConnectedLevel.levelConnections[j].connectingLevel != startingLevel) {
					
					//two node distance
					var secondConnectedLevel = firstConnectedLevel.levelConnections[j].connectingLevel;
					
					//now sever any further away connections (except the one that brought us here)
					//note - any connected maps should be garbage collected after connection removed
					for (var l in secondConnectedLevel.levelConnections) {
						
						if (secondConnectedLevel.levelConnections[l].connectingLevel != firstConnectedLevel) {
							//cycle through entities of connected map and remove entities (don't want them retained in scheduler)						
							for (var m in secondConnectedLevel.levelConnections[l].entities) {
								console.log("level entity purge: " + secondConnectedLevel.levelConnections[l].entities[m].name);
								secondConnectedLevel.levelConnections[l].removeEntity(secondConnectedLevel.levelConnections[l].entities[m]);
							}
							//delete level connection
							delete secondConnectedLevel.levelConnections[l];							
						}
					}
				}
			}		
		}
	}
};