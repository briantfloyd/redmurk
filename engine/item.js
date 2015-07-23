Game.Item = function(properties) {
    properties = properties || {};

    Game.Glyph.call(this, properties);

    this.name = properties['name'] || '';
    
	this.spriteSheetY = properties['spriteSheetY'] || 0;
	this.spriteSheetX = properties['spriteSheetX'] || 0;
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
			entity.hp += this.healingValue;
			this.remainingConsumptions--;
		}
    }
};

Game.ItemMixins.Equippable = {
    name: 'Equippable',
    init: function(template) {
        this.attackValue = template['attackValue'] || 0;
        this.defenseValue = template['defenseValue'] || 0;
        this.wieldable = template['wieldable'] || false;
        this.wearable = template['wearable'] || false;
    }
};