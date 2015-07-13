Game.Mixins = {};

Game.Mixins.Moveable = {
    name: 'Moveable',
    tryMove: function(x, y, map) {
        var tile = map.getTile(x, y);
        var target = map.getEntityAt(x, y);
        
        if (target) {
        
            if (this.hasMixin('Attacker')) {
                this.attack(target);
                return true;
            } else {
                return false;
            }
            
        } else if (tile && tile.isWalkable) {
            this.x = x;
            this.y = y;
            return true;
        }
        return false;
    }
}

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

Game.Mixins.PlayerActor = {
    name: 'PlayerActor',
    groupName: 'Actor',
    act: function() {
        Game.refresh();
        this.map.engine.lock();        
    }
}

Game.PlayerTemplate = {
    character: '@',
    maxHp: 40,
    attackValue: 10,
    mixins: [Game.Mixins.Moveable, Game.Mixins.PlayerActor,
    		Game.Mixins.Attacker, Game.Mixins.Destructible]
}

Game.Mixins.SlimeActor = {
    name: 'SlimeActor',
    groupName: 'Actor',
    act: function() { }
}

Game.SlimeTemplate = {
    character: 'S',
	maxHp: 10,
    mixins: [Game.Mixins.SlimeActor, Game.Mixins.Destructible]
}