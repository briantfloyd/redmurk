Game.Entity = function(properties) {
    properties = properties || {};
    Game.Glyph.call(this, properties);
    
    this.name = properties['name'] || '';
    this.x = properties['x'] || 0;
    this.y = properties['y'] || 0;
    this.map = null;
    this.attachedMixins = {};
    this.attachedMixinGroups = {};
    
    var mixins = properties['mixins'] || [];
console.log(mixins);    
    for (var i = 0; i < mixins.length; i++) {
    	for (var key in mixins[i]) {
    		if (key != 'init' && key != 'name' && !this.hasOwnProperty(key)) {
    			this[key] = mixins[i][key];
    		}
    	}
console.log(mixins[i]);
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