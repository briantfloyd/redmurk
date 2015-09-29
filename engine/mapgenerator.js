Game.MapGenerator = {
	generateMap: function(parameters){   
	
		var mapWidth = parameters.mapWidth; 
		var mapHeight = parameters.mapHeight;
		var mapBornSurvive = parameters.mapBornSurvive;
		var generatorType = parameters.generatorType;
		var generatorRandomize = parameters.generatorRandomize;
		var generatorIterations = parameters.generatorIterations;	
		var floorTileTypes = parameters.floorTileTypes;
		var wallTileTypes = parameters.wallTileTypes;
	
		var map = [];
	
		for (var x = 0; x < mapWidth; x++) {
			map.push([]);
			for (var y = 0; y < mapHeight; y++) {
				map[x].push(null);
			}
		}
		
		var generator; 
	
		switch (generatorType) {
			case 'cellular':
				//generator = new ROT.Map.Cellular(mapWidth, mapHeight);
				generator = new ROT.Map.Cellular(mapWidth, mapHeight, mapBornSurvive);
				break;		
			default:
				generator = new ROT.Map.Cellular(mapWidth, mapHeight);
		}

		generator.randomize(generatorRandomize);
		var totalIterations = generatorIterations;

		//smoothing map
		for (var i = 0; i < totalIterations - 1; i++) {
			generator.create();
		}
		//final smoothing pass then update
		var environment = Game.loadedEnvironment;
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
		
		//fill edges
		map = this.fillEdges(map, mapWidth, mapHeight, wallTileTypes);
 
		return map;
	},
	fillEdges: function(map, mapWidth, mapHeight, wallTileTypes) {
		//FIXME? - consolidate repeated code
		var tileVersion, tileVersionTile, dice;
		
		for (var a = 0; a < mapWidth; a++) {
			//top edge - all filled
			tileVersion = Math.floor(Math.random() * wallTileTypes.length);
			tileVersionTile = wallTileTypes[tileVersion];
			map[a][0] = tileVersionTile;
			
			tileVersion = Math.floor(Math.random() * wallTileTypes.length);
			tileVersionTile = wallTileTypes[tileVersion];
			map[a][1] = tileVersionTile;
			
			//one in from edge - 50/50 chance of being filled
			dice = Math.floor(Math.random() * 2);
			if (dice === 1) {
				tileVersion = Math.floor(Math.random() * wallTileTypes.length);
				tileVersionTile = wallTileTypes[tileVersion];
				map[a][2] = tileVersionTile;
			}
			
			//bottom edge
			tileVersion = Math.floor(Math.random() * wallTileTypes.length);
			tileVersionTile = wallTileTypes[tileVersion];
			map[a][mapHeight - 1] = tileVersionTile;
			
			tileVersion = Math.floor(Math.random() * wallTileTypes.length);
			tileVersionTile = wallTileTypes[tileVersion];
			map[a][mapHeight - 2] = tileVersionTile;
			
			dice = Math.floor(Math.random() * 2);
			if (dice === 1) {
				tileVersion = Math.floor(Math.random() * wallTileTypes.length);
				tileVersionTile = wallTileTypes[tileVersion];
				map[a][mapHeight - 3] = tileVersionTile;
			}
			
		}

		for (var b = 0; b < mapHeight; b++) {
			//left edge
			tileVersion = Math.floor(Math.random() * wallTileTypes.length);
			tileVersionTile = wallTileTypes[tileVersion];
			map[0][b] = tileVersionTile;
			
			tileVersion = Math.floor(Math.random() * wallTileTypes.length);
			tileVersionTile = wallTileTypes[tileVersion];
			map[1][b] = tileVersionTile;
			
			dice = Math.floor(Math.random() * 2);
			if (dice === 1) {
				tileVersion = Math.floor(Math.random() * wallTileTypes.length);
				tileVersionTile = wallTileTypes[tileVersion];
				map[2][b] = tileVersionTile;
			}
			
			//right edge
			tileVersion = Math.floor(Math.random() * wallTileTypes.length);
			tileVersionTile = wallTileTypes[tileVersion];
			map[mapWidth - 1][b] = tileVersionTile;
			
			tileVersion = Math.floor(Math.random() * wallTileTypes.length);
			tileVersionTile = wallTileTypes[tileVersion];
			map[mapWidth - 2][b] = tileVersionTile;
			
			dice = Math.floor(Math.random() * 2);
			if (dice === 1) {
				tileVersion = Math.floor(Math.random() * wallTileTypes.length);
				tileVersionTile = wallTileTypes[tileVersion];
				map[mapWidth - 3][b] = tileVersionTile;
			}
			
		}

 
		return map;	
	}
};

