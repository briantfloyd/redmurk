/* Copyright (c) 2015, Brian T. Floyd. FreeBSD License. */
Game.MapGenerator = {
	map: null,
	mapWidth: null,
	mapHeight: null,
	mapBornSurvive: null,
	generatorType: null,
	generatorRandomize: null,
	floorTileTypes: null,
	wallTileTypes: null,
	regions: null,
	generateMap: function(parameters){   

		this.mapWidth = parameters.mapWidth; 
		this.mapHeight = parameters.mapHeight;
		this.mapBornSurvive = parameters.mapBornSurvive;
		this.generatorType = parameters.generatorType;
		this.generatorRandomize = parameters.generatorRandomize;
		this.generatorIterations = parameters.generatorIterations;	
		this.floorTileTypes = parameters.floorTileTypes;
		this.wallTileTypes = parameters.wallTileTypes;		
	
		var map = [];
	
		for (var x = 0; x < this.mapWidth; x++) {
			map.push([]);
			for (var y = 0; y < this.mapHeight; y++) {
				map[x].push(null);
			}
		}
		
		var generator; 
	
		switch (this.generatorType) {
			case 'cellular':
				//generator = new ROT.Map.Cellular(this.mapWidth, this.mapHeight);
				generator = new ROT.Map.Cellular(this.mapWidth, this.mapHeight, this.mapBornSurvive);
				break;		
			default:
				generator = new ROT.Map.Cellular(this.mapWidth, this.mapHeight);
		}

		generator.randomize(this.generatorRandomize);
		var totalIterations = this.generatorIterations;

		//smoothing map
		for (var i = 0; i < totalIterations - 1; i++) {
			generator.create();
		}
		//final smoothing pass then update
		var floorTileTypes = this.floorTileTypes;
		var wallTileTypes = this.wallTileTypes;
		
		generator.create(function(x,y,v) {
			var tileVersion, tileVersionTile;

			if (v === 1) {
				tileVersion = Math.floor(Math.random() * floorTileTypes.length);
				tileVersionTile = floorTileTypes[tileVersion];
				map[x][y] = tileVersionTile;
			
			} else {
				tileVersion = Math.floor(Math.random() * wallTileTypes.length);
				tileVersionTile = wallTileTypes[tileVersion];
				map[x][y] = tileVersionTile;
			}
		});
		
		//save map for reference by other methods
		this.map = map;

		//identify and fill smallest regions
		this.setupRegions();
		
		//fill edges
		this.fillEdges();
 
		return this.map;
	},
	reGenerateMap: function(mapData) {
		
		//var mapData = saveData.playScreen.map;
		
		this.mapWidth = mapData.width; 
		this.mapHeight = mapData.height;
		
		var map = [];
		var nextTileType;
		
		for (var x = 0; x < this.mapWidth; x++) {
			map.push([]);
			for (var y = 0; y < this.mapHeight; y++) {			
				//check and insert correct tile type
				nextTileType = mapData.tiles[x][y];				
				map[x].push(Game.loadedEnvironment.tiles[nextTileType]);
			}
		}
		
		//save map for reference by other methods
		this.map = map;
		
		return this.map;
	},
	fillEdges: function() {
		//FIXME? - consolidate repeated code, make edges look more natural
		var tileVersion, tileVersionTile, dice;
		
		var map = this.map;
		
		for (var a = 0; a < this.mapWidth; a++) {
			//top edge - all filled
			tileVersion = Math.floor(Math.random() * this.wallTileTypes.length);
			tileVersionTile = this.wallTileTypes[tileVersion];
			map[a][0] = tileVersionTile;
			
			tileVersion = Math.floor(Math.random() * this.wallTileTypes.length);
			tileVersionTile = this.wallTileTypes[tileVersion];
			map[a][1] = tileVersionTile;
			
			//one in from edge - 50/50 chance of being filled
			dice = Math.floor(Math.random() * 2);
			if (dice === 1) {
				tileVersion = Math.floor(Math.random() * this.wallTileTypes.length);
				tileVersionTile = this.wallTileTypes[tileVersion];
				map[a][2] = tileVersionTile;
			}
			
			//bottom edge
			tileVersion = Math.floor(Math.random() * this.wallTileTypes.length);
			tileVersionTile = this.wallTileTypes[tileVersion];
			map[a][this.mapHeight - 1] = tileVersionTile;
			
			tileVersion = Math.floor(Math.random() * this.wallTileTypes.length);
			tileVersionTile = this.wallTileTypes[tileVersion];
			map[a][this.mapHeight - 2] = tileVersionTile;
			
			dice = Math.floor(Math.random() * 2);
			if (dice === 1) {
				tileVersion = Math.floor(Math.random() * this.wallTileTypes.length);
				tileVersionTile = this.wallTileTypes[tileVersion];
				map[a][this.mapHeight - 3] = tileVersionTile;
			}			
		}

		for (var b = 0; b < this.mapHeight; b++) {
			//left edge
			tileVersion = Math.floor(Math.random() * this.wallTileTypes.length);
			tileVersionTile = this.wallTileTypes[tileVersion];
			map[0][b] = tileVersionTile;
			
			tileVersion = Math.floor(Math.random() * this.wallTileTypes.length);
			tileVersionTile = this.wallTileTypes[tileVersion];
			map[1][b] = tileVersionTile;
			
			dice = Math.floor(Math.random() * 2);
			if (dice === 1) {
				tileVersion = Math.floor(Math.random() * this.wallTileTypes.length);
				tileVersionTile = this.wallTileTypes[tileVersion];
				map[2][b] = tileVersionTile;
			}
			
			//right edge
			tileVersion = Math.floor(Math.random() * this.wallTileTypes.length);
			tileVersionTile = this.wallTileTypes[tileVersion];
			map[this.mapWidth - 1][b] = tileVersionTile;
			
			tileVersion = Math.floor(Math.random() * this.wallTileTypes.length);
			tileVersionTile = this.wallTileTypes[tileVersion];
			map[this.mapWidth - 2][b] = tileVersionTile;
			
			dice = Math.floor(Math.random() * 2);
			if (dice === 1) {
				tileVersion = Math.floor(Math.random() * this.wallTileTypes.length);
				tileVersionTile = this.wallTileTypes[tileVersion];
				map[this.mapWidth - 3][b] = tileVersionTile;
			}			
		}
 
		return map;	
	},
	canFillRegion: function(x, y) {
		if (x < 0 || y < 0 || x >= this.mapWidth || y >= this.mapHeight) {
			return false;
		}
		if (this.regions[x][y] != 0) {
			return false;
		}
		return this.map[x][y].walkable;
	},
	fillRegion: function(region, x, y) {
		var tilesFilled = 1;
		var tiles = [{x:x, y:y}];
		var tile;
		var neighbors;
		//update the region of the original tile
		this.regions[x][y] = region;
		//loop while we still have tiles to process
		while (tiles.length > 0) {
			tile = tiles.pop();
			//get the neighbors of the tile
			neighbors = Game.getNeighborPositions(tile.x, tile.y);
			//iterate through each neighbor, checking if we can use it to fill
			//and if so updating the region and adding it to our processing list.
			while (neighbors.length > 0) {
				tile = neighbors.pop();
				if (this.canFillRegion(tile.x, tile.y)) {
					this.regions[tile.x][tile.y] = region;
					tiles.push(tile);
					tilesFilled++;
				}
			}
		}
		return tilesFilled;
	},
	removeRegion: function(region) {
		for (var x = 0; x < this.mapWidth; x++) {
			for (var y = 0; y < this.mapHeight; y++) {
				if (this.regions[x][y] == region) {
					//clear the region and set the tile to a wall tile
					this.regions[x][y] = 0;

					var tileVersion = Math.floor(Math.random() * this.wallTileTypes.length);
					var tileVersionTile = this.wallTileTypes[tileVersion];
				
					this.map[x][y] = tileVersionTile;                
				}
			}
		}
	},
	setupRegions: function() {
		this.regions = [];
        for (var j = 0, width = this.mapWidth; j < width; j++) {
            this.regions[j] = [];
            //zeros represent walls - default value
            for (var k = 0, height = this.mapHeight; k < height; k++) {
                this.regions[j][k] = 0;
            }
        }

		var region = 1;
		var tilesFilled;
		var mostTiles = 0;
		var mostTilesRegion = null;
		
		//check every tile for flood fill starting point
		for (var x = 0; x < this.mapWidth; x++) {
			for (var y = 0; y < this.mapHeight; y++) {
	
				if (this.canFillRegion(x, y)) {
					tilesFilled = this.fillRegion(region, x, y);
					if (tilesFilled <= mostTiles) {
						this.removeRegion(region);
					} else {
						
						//remove prior biggest region
						this.removeRegion(mostTilesRegion);
						
						//update tracking of new biggest
						mostTiles = tilesFilled;
						mostTilesRegion = region;

						region++;
					}
				}
			}
		}
	}
};

Game.getNeighborPositions = function(x, y) {
    var tiles = [];

    for (var dX = -1; dX < 2; dX ++) {
        for (var dY = -1; dY < 2; dY++) {
            if (dX == 0 && dY == 0) {
                continue;
            }
            tiles.push({x: x + dX, y: y + dY});
        }
    }
    return tiles.randomize();
};