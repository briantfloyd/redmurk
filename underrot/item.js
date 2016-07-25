/* Copyright (c) 2015, Brian T. Floyd. FreeBSD License. */
Game.Item = function(properties) {
    properties = properties || {};

    Game.Glyph.call(this, properties);

    this.templateType = properties['templateType'] || '';
    this.name = properties['name'] || '';
    //this.rarity = properties['rarity'] || '';
    
	this.spriteSheetY = properties['spriteSheetY'] || 0;
	this.spriteSheetX = properties['spriteSheetX'] || 0;
	
	var tilePixelWidth = Game.interfaceObject.tilePixelWidth;
	
	this.spriteSheetY *= tilePixelWidth; 
	this.spriteSheetX *= tilePixelWidth;

	//update character to spritesheet coordinate mapping
	Game.display._options.tileMap[this.character] = [this.spriteSheetX, this.spriteSheetY];
	
    this.attachedMixins = {};
    this.attachedMixinGroups = {}; //FIXME - probably don't need this for items
	
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
};

Game.Item.extend(Game.Glyph);

Game.ItemMixins = {};

Game.ItemMixins.HealingDose = {
    name: 'HealingDose',
    init: function(template) {
        this.healingValue = template['healingValue'] || 1;
        this.maxConsumptions = template['consumptions'] || 1;
        this.remainingConsumptions = this.maxConsumptions;
    },
    eat: function(entity) {
		if (this.remainingConsumptions > 0) {			
			entity.hp = Math.min(entity.hp + this.healingValue, entity.maxHp);
			this.remainingConsumptions--;
		}
    }
};

Game.ItemMixins.Equippable = {
    name: 'Equippable',
    init: function(template) {
        this.attackValue = template['attackValue'] || 0;
        this.defenseValue = template['defenseValue'] || 0; 
		this.healthValue = template['healthValue'] || 0;		
        this.equippable = template['equippable'] || false;
    }
};