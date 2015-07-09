Game.Mixins = {};

Game.Mixins.Moveable = {
    name: 'Moveable',
    tryMove: function(x, y, map) {
        var tile = map.getTile(x, y);
        var target = map.getEntityAt(x, y);
        
        if (target) {
        	return false;
        } else if (tile && tile.isWalkable) {
            this.x = x;
            this.y = y;
            return true;
        }
        return false;
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
    mixins: [Game.Mixins.Moveable, Game.Mixins.PlayerActor]
}

Game.Mixins.FungusActor = {
    name: 'FungusActor',
    groupName: 'Actor',
    act: function() { }
}

Game.FungusTemplate = {
    character: 'F',
    mixins: [Game.Mixins.FungusActor]
}