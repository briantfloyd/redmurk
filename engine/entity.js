Game.Entity = function(properties) {
    properties = properties || {};
    Game.Glyph.call(this, properties);
    
    this.name = properties['name'] || '';
    this.x = properties['x'] || 0;
    this.y = properties['y'] || 0;
    this.map = null;
    this.attachedMixins = {};
    this.attachedMixinGroups = {};
    this.speed = properties['speed'] || 1200;
    this.inventory = []; //FIXME? move into mixin?
	
    this.destinationCoordinates = null;
    this.pathCoordinates = [];
    	
	this.spriteSheetY = properties['spriteSheetY'] || 0;
	this.spriteSheetX = properties['spriteSheetX'] || 0;	
	
	var tilePixelWidth = Game.interfaceObject.tilePixelWidth;
	
	this.spriteSheetY *= tilePixelWidth; 
	this.spriteSheetX *= tilePixelWidth; 
	
	//update character to spritesheet coordinate mapping
	Game.display._options.tileMap[this.character] = [this.spriteSheetX, this.spriteSheetY];
	    
    var mixins = properties['mixins'] || [];
  
    for (var i = 0; i < mixins.length; i++) {
    	for (var key in mixins[i]) {
    		if (key != 'init' && key != 'name' && !this.hasOwnProperty(key)) {
    			this[key] = mixins[i][key];
    		}
    	}

    	this.attachedMixins[mixins[i].name] = true;
        if (mixins[i].groupName) {
            this.attachedMixinGroups[mixins[i].groupName] = true;
        }    	
    	if (mixins[i].init) {
    		mixins[i].init.call(this, properties);
    	}
    }
}

Game.Entity.extend(Game.Glyph);

Game.Entity.prototype.hasMixin = function(obj) {
    if (typeof obj === 'object') {
        return this.attachedMixins[obj.name];
    } else {
        return this.attachedMixins[obj] || this.attachedMixinGroups[obj];
    }
}

Game.Entity.prototype.tryMove = function(x, y) {
    var map = this.map;
    var tile = map.getTile(x, y);
    var target = map.getEntityAt(x, y);
	var tilePixelWidth = Game.interfaceObject.tilePixelWidth
	
	//compare old position to new to determine direction entity is facing
	if (x === this.x && y === this.y - 1) {
		this.spriteSheetX = 0;
	} else if (x === this.x + 1 && y === this.y - 1) {
		this.spriteSheetX = tilePixelWidth;//60;
	} else if (x === this.x + 1 && y === this.y) {
		this.spriteSheetX = tilePixelWidth * 2;//120;
	} else if (x === this.x + 1 && y === this.y + 1) {
		this.spriteSheetX = tilePixelWidth * 3;//180;
	} else if (x === this.x && y === this.y + 1) {
		this.spriteSheetX = tilePixelWidth * 4;//240;
	} else if (x === this.x - 1 && y === this.y + 1) {
		this.spriteSheetX = tilePixelWidth * 5;//300;
	} else if (x === this.x - 1 && y === this.y) {
		this.spriteSheetX = tilePixelWidth * 6;//360;
	} else if (x === this.x - 1 && y === this.y - 1){
		this.spriteSheetX = tilePixelWidth * 7;//420;
	}
	
	//update spriteSheetX to reflect new direction
	Game.display._options.tileMap[this.character] = [this.spriteSheetX, this.spriteSheetY];
	
 	if (target) {
        if (this.hasMixin('Attacker') && target != this) {
            this.attack(target);
            return true;
        } else {
            return false;
        }

    } else if (tile && tile.walkable) {        		
		var oldX = this.x;
		var oldY = this.y;
		
		this.x = x;
		this.y = y;
		
		this.map.updateEntityPosition(this, oldX, oldY);
			
        return true;
    } 
    return false;
};

Game.Entity.prototype.getSpeed = function() {
    return this.speed;
};


Game.Entity.prototype.findPath = function(sourceEntity, destX, destY) {
	
	var sourceEntity = sourceEntity;
	
	//reset
	this.pathCoordinates = [];
	
	var path = new ROT.Path.AStar(destX, destY, function(x, y) { 
		// If an entity is present at the tile, can't move there.
		var entity = sourceEntity.map.getEntityAt(x, y);
		if (entity && entity !== sourceEntity) { 
			return false;
		}
		//console.log(x + ',' + y);
		
		return sourceEntity.map.getTile(x, y).walkable;
	}, {topology: 8});

	// move to the second cell  in path that is passed in the callback (the first is the entity's strting point)
	//var count = 0;
	path.compute(sourceEntity.x, sourceEntity.y, function(x, y) {
		
		
		
		/*if (count == 1) {
			sourceEntity.tryMove(x, y);
		}
		count++;*/
		
		
		var coordinateObject = {};
		coordinateObject.x = x;
		coordinateObject.y = y;
		sourceEntity.pathCoordinates.push(coordinateObject);
		
	});
	
	//remove first coordinate in path - it's the entity's current coordinate
	sourceEntity.pathCoordinates.shift();


};