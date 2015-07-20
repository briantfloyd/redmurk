Game.Mixins = {};

Game.Mixins.Destructible = {
    name: 'Destructible',
    init: function(template) {
        this.maxHp = template['maxHp'] || 10;
        this.hp = template['hp'] || this.maxHp;
        this.defenseValue = template['defenseValue'] || 0;
    },
    takeDamage: function(attacker, damage) {
        this.hp -= damage;

		var newMessage = {
			type: 'attacked',
			sender: this,
			attacker: attacker,
			damage: damage
		};		
		Game.Messages.queue.push(newMessage);

        if (this.hp <= 0) {
        
            var newMessage = {
            	type: 'death',
            	sender: this,
            	attacker: attacker
            };
            Game.Messages.queue.push(newMessage);
                    
            this.map.removeEntity(this);
        }
    }
}

Game.Mixins.Attacker = {
    name: 'Attacker',
    groupName: 'Attacker',
    init: function(template) {
    	this.attackValue = template['attackValue'] || 1;
    },
    attack: function(target) {
        if (target.hasMixin('Destructible')) {
            var max = Math.max(0, this.attackValue - target.defenseValue);
			var damage = 1 + Math.floor(Math.random() * max);
            
            var newMessage = {
            	type: 'attacking',
            	sender: this,
            	target: target,
            	damage: damage
            };
            Game.Messages.queue.push(newMessage);
                        
            target.takeDamage(this, damage);
        }
    }
}

Game.Mixins.Sight = {
    name: 'Sight',
    groupName: 'Sight',
    init: function(template) {
        this.sightRadius = template['sightRadius'] || 3;
    },
}

Game.Mixins.WanderActor = {
    name: 'WanderActor',
    groupName: 'Actor',
    act: function() {
        var moveOffset = (Math.round(Math.random()) === 1) ? 1 : -1;
        if (Math.round(Math.random()) === 1) {
            this.tryMove(this.x + moveOffset, this.y);
        } else {
            this.tryMove(this.x, this.y + moveOffset);
        }
    }
};

