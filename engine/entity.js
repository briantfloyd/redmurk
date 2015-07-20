Game.Entity = function(properties) {
    properties = properties || {};
    Game.Glyph.call(this, properties);
    
    this.name = properties['name'] || '';
    this.x = properties['x'] || 0;
    this.y = properties['y'] || 0;
    this.map = null;
    this.attachedMixins = {};
    this.attachedMixinGroups = {};
	
	this.spriteSheetY = properties['spriteSheetY'] || 0;
	this.spriteSheetX = properties['spriteSheetX'] || 0;
	
	this.directionFacing = 'south';
    
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

Game.Entity.prototype.tryMove = function(x, y, map) {
    //var map = this.map;
    var tile = map.getTile(x, y);
    var target = map.getEntityAt(x, y);
 	
//console.log(this.character);

	var direction;
	if (x === this.x && y === this.y - 1) {
		direction = 'north';
		Game.display._options.tileMap[this.character] = [0, this.spriteSheetY];
	} else if (x === this.x + 1 && y === this.y - 1) {
		direction = 'northeast';
		Game.display._options.tileMap[this.character] = [60, this.spriteSheetY];
	} else if (x === this.x + 1 && y === this.y) {
		direction = 'east';
		Game.display._options.tileMap[this.character] = [120, this.spriteSheetY];
	} else if (x === this.x + 1 && y === this.y + 1) {
		direction = 'southeast';
		Game.display._options.tileMap[this.character] = [180, this.spriteSheetY];
	} else if (x === this.x && y === this.y + 1) {
		direction = 'south';
		Game.display._options.tileMap[this.character] = [240, this.spriteSheetY];
	} else if (x === this.x - 1 && y === this.y + 1) {
		direction = 'southwest';
		Game.display._options.tileMap[this.character] = [300, this.spriteSheetY];
	} else if (x === this.x - 1 && y === this.y) {
		direction = 'west';
		Game.display._options.tileMap[this.character] = [360, this.spriteSheetY];
	} else if (x === this.x - 1 && y === this.y - 1){
		direction = 'northwest';
		Game.display._options.tileMap[this.character] = [420, this.spriteSheetY];
	}
	
	this.directionFacing = direction;

	
 	if (target) {

        if (this.hasMixin('Attacker')) {
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
