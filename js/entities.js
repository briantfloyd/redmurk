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
    init: function() {
        this.hp = 1;
    },
    takeDamage: function(attacker, damage) {
        this.hp -= damage;
        if (this.hp <= 0) {
            this.map.removeEntity(this);
        }
    }
}

Game.Mixins.SimpleAttacker = {
    name: 'SimpleAttacker',
    groupName: 'Attacker',
    attack: function(target) {
        if (target.hasMixin('Destructible')) {
            target.takeDamage(this, 1);
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
    mixins: [Game.Mixins.Moveable, Game.Mixins.PlayerActor,
    		Game.Mixins.SimpleAttacker, Game.Mixins.Destructible]
}

Game.Mixins.SlimeActor = {
    name: 'SlimeActor',
    groupName: 'Actor',
    act: function() { }
}

Game.SlimeTemplate = {
    character: 'S',
    mixins: [Game.Mixins.SlimeActor, Game.Mixins.Destructible]
}