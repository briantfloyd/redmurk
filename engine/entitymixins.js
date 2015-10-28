Game.Mixins = {};

Game.Mixins.Destructible = {
    name: 'Destructible',
    init: function(template) {
        this.maxHp = template['maxHp'] || 10;
        this.hp = template['hp'] || this.maxHp;
        this.defenseValue = template['defenseValue'] || 0;
        this.restHealTimer = 0;
    },
    getDefenseValue: function() {
        var modifier = 0;
        if (this.hasMixin(Game.Mixins.Equipper)) {
            for (var x in this.equipped) {
            	if (this.equipped[x]) {
            		modifier += this.equipped[x].defenseValue;
            	}
            }
        }
        return this.defenseValue + modifier;
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
            
            attacker.attackTarget = null;
 
            //attacker experience gain   
            if (attacker.experiencePoints) {
            	attacker.experienceGain(this);
            }
            
            //inventory drop            
            for (var x = 0, y = this.inventory.length; x < y; x++) {
            	this.map.addItem(this.x, this.y, this.inventory[x]);
            }            

            //deselect if necessary //FIXME - seems like this should be handled by the playScreen itself
            if (Game.Screen.playScreen.selectedEntity && Game.Screen.playScreen.selectedEntity === this) {
            	Game.Screen.playScreen.selectedEntity = null;
            }
            
            //remove dead entity        
            this.map.removeEntity(this);
            
            if (this === Game.Screen.playScreen.player) { //FIXME - player
            	Game.loadedEnvironment.playerDeath();
            }
            
        }
    },
    restHeal: function() {	   
    	if (this.hp < this.maxHp) {
			this.hp++;   		
    	}
    }
}

Game.Mixins.Attacker = {
    name: 'Attacker',
    groupName: 'Attacker',
    init: function(template) {
    	this.attackTarget = null;
    	this.attackValue = template['attackValue'] || 1;
    },
    getAttackValue: function() {
        var modifier = 0;
        if (this.hasMixin(Game.Mixins.Equipper)) {
             
            for (var x in this.equipped) {
            	if (this.equipped[x]) {
            		modifier += this.equipped[x].attackValue;
            	}
            }
        }
        return this.attackValue + modifier;
    },
    attack: function(target) {
        if (target.hasMixin('Destructible')) {
            var max = Math.max(0, this.getAttackValue() - target.getDefenseValue());
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
        
        //target auto defend
        if (target.hasMixin('Attacker') && target.attackTarget === null) {
        	target.attackTarget = this;
        }
        
    }
}

Game.Mixins.Sight = {
    name: 'Sight',
    groupName: 'Sight',
    init: function(template) {
        this.sightRadius = template['sightRadius'] || 3;
    },
    canSee: function(entity) {
		if (!entity) {
            return false;
        }

        var otherX = entity.x;
        var otherY = entity.y;

        //check square fov first for quicker exit
        if ((otherX - this.x) * (otherX - this.x) +
            (otherY - this.y) * (otherY - this.y) >
            this.sightRadius * this.sightRadius) {
            return false;
        }

        //lastly - compute FOV and check there
        var currentDepth = this.map.depth; //FIXME - depth
        var found = false;
        this.map.fov[currentDepth].compute( //FIXME - depth //More efficient alternative to computing FOV every turn?
            this.x, 
            this.y, 
            this.sightRadius, 
            function(x, y, radius, visibility) {
                if (x === otherX && y === otherY) {
                    found = true;
                }
            });
        return found;
    }
}

Game.Mixins.Equipper = {
    name: 'Equipper',
    init: function(template) {  
		this.equipped = {
			head: null,
			body: null,
			hand: null,
			shieldhand: null,
			accessory: null
		};
    }
};

Game.Mixins.InventoryCarrier = {
    name: 'InventoryCarrier',
    init: function(template) {  
		this.inventory = template['inventory'] || [];
    }
};

Game.Mixins.ExperienceGainer = {
    name: 'ExperienceGainer',
    init: function(template) {
        this.experiencePoints = 1;
        this.nextExperiencePointThreshold = 2;
    },
    experienceGain: function(entityDefeated) {
		//relative to difference between attacker and defender in .maxHp, .defenseValue, .attackValue
		var hpDifference = this.maxHp - entityDefeated.maxHp;
		hpDifference = Math.max(hpDifference, 1);
		
		var attackDifference = this.getAttackValue() - entityDefeated.getAttackValue();
		attackDifference = Math.max(attackDifference, 1);
		
		var defenseDifference = this.getDefenseValue() - entityDefeated.getDefenseValue();
		defenseDifference = Math.max(defenseDifference, 1);
		
		var pointsEarned = hpDifference + attackDifference + defenseDifference;
		this.experiencePoints = this.experiencePoints + pointsEarned
		
		//stat gain
		if (this.experiencePoints >= this.nextExperiencePointThreshold) {
			
			if (this.hasMixin('StatAssigner')) {
				this.statGainSelection();
			} else {
				//randomly assign attack/defense/maxHp gain
				var dice = Math.floor(Math.random() * 3);
			
				switch(dice) {
					case 0:
						this.attackValue++;
						break;
					case 1:
						this.defenseValue++;
						break;
					case 2:
						this.maxHp++;
						break;
				}
			}
			
			//raise next threshold
			this.nextExperiencePointThreshold = this.nextExperiencePointThreshold * 10; //FIXME - balance
		
		}
    }
};

Game.Mixins.StatAssigner = {
    name: 'StatAssigner',
    init: function(template) {
    },
    statGainSelection: function() {
		Game.switchScreen(Game.Screen.statAssignmentScreen);
    }
};

Game.Mixins.TaskActor = {
    name: 'TaskActor',
    groupName: 'Actor',
    init: function(template) {
        this.tasks = template['tasks'] || ['wander']; 
    },
    act: function() {	
        for (var i = 0; i < this.tasks.length; i++) {
            if (this.canDoTask(this.tasks[i])) {
                this[this.tasks[i]]();
                return;
            }
        }
    },
    canDoTask: function(task) {
        if (task === 'hunt') {     
			return this.map === Game.Screen.playScreen.player.map && this.hasMixin('Sight') && this.canSee(Game.Screen.playScreen.player); //FIXME - player
        } else if (task === 'heal') {
			return this.hp != this.maxHp; //returns true if need to heal
        } else if (task === 'wander') {
            return true;
        } else {
            throw new Error('Tried to perform undefined task ' + task);
        }
    },
    hunt: function() {
		var player = Game.Screen.playScreen.player; //FIXME - player

        // If we are adjacent to the player, then attack instead of hunting.
        var offsets = Math.abs(player.x - this.x) + 
            Math.abs(player.y - this.y);
        if (offsets === 1) {
            if (this.hasMixin('Attacker')) {
                this.attack(player);
                return;
            }
        }

        //pathfinding 
        this.destinationCoordinates = {};
        this.destinationCoordinates.x = player.x;
        this.destinationCoordinates.y = player.y;
        
        var sourceEntity = this;
        var destX = this.destinationCoordinates.x;
        var destY = this.destinationCoordinates.y;
        
        this.findPath(sourceEntity, destX, destY);
        
        if (this.pathCoordinates.length > 0) {
        	
        	var nextCoordinate = this.pathCoordinates.splice(0, 1);
        	var nextCoordinateX = nextCoordinate[0].x;
        	var nextCoordinateY = nextCoordinate[0].y;
        	
        	sourceEntity.tryMove(nextCoordinateX, nextCoordinateY);
        
        }  
    },
    heal: function() {
    	this.restHeal();
    },
    wander: function() {
        var moveOffset = (Math.round(Math.random()) === 1) ? 1 : -1;
        if (Math.round(Math.random()) === 1) {
            this.tryMove(this.x + moveOffset, this.y);
        } else {
            this.tryMove(this.x, this.y + moveOffset);
        }
    }
};

Game.Mixins.LevelChanger = {
    name: 'LevelChanger',
    init: function(template) {
    	this.justChangedLevels = true; //start with true in case entity has been spawned on level connection?
    },
    changeLevels: function(levelConnection) {		
		//FIXME? - NOTE - this only works if levelConnection.connectingLevel exists
		//would only work for non-player entities if all levels have been pre-generated
			
		this.justChangedLevels = true;
		
		//remove entity tracking from old map
		this.map.removeEntity(this);	

		//update entity position in new map
		if (levelConnection.connectingLevelX && levelConnection.connectingLevelY) { //levelConnection object has these properties
			this.x = levelConnection.connectingLevelX;
			this.y = levelConnection.connectingLevelY;
			
			//add entity to new map
			levelConnection.connectingLevel.addEntity(this);
		
		} else {
			levelConnection.addEntityAtRandomPosition(this); //otherwise was just map object passed in  //FIXME - this isn't clear - changeLevels() accepting level connection objects (in PlayerActor.act()), and ordinary maps from environment playerResurrect()
		}
    }
};