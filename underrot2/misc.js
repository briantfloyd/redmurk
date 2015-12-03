/* Copyright (c) 2015, Brian T. Floyd. FreeBSD License. */
/*
//Build array of objects with the following properties
//-img - image object with src set to corresponding tilesheet
//-tile - tile object this art is for - to reference back and assign master spritesheet Y value

//Define tiles and corresponding individual tile sheets, push into array and pass into master sprite sheet assembler

//Example:
var spriteSheets = [];

this.tiles.floorTile = new Game.Tile({
	character: '.',
	spriteSheetSource: 'environment/art/tilesheet-60x60-floor-dirt-01.png',
	masterSpriteSheetY: null
});

var floorTileSpriteSheetImage = new Image();
floorTileSpriteSheetImage.src = this.tiles.floorTile.spriteSheetSource;	
spriteSheets.push({
			image: floorTileSpriteSheetImage,
			tile: this.tiles.floorTile
		});
		
//Repeat above as needed for additional tiles

SpriteSheetAssembler(spriteSheets);
*/

SpriteSheetAssembler = function(spriteSheetArray) {

	var spriteSheetsToLoad = spriteSheetArray.length + 1;

	//build combined sprite sheet
	var spriteSheetCanvas = document.createElement('canvas');
	var ctx=spriteSheetCanvas.getContext("2d");

	var nextSheetY = 0;
	var nextImage = [];
	//var environment = this;

	for (var i = 0, j = spriteSheetArray.length; i < j; i++) {		
		//now draw each of the sprite sheets to the canvas, remembering positioning
		nextImage[i] = spriteSheetArray[i].image;

		nextImage[i].tile = spriteSheetArray[i].tile;
			
		//NOTE: onload step could be removed by pre-defining height/width property values on spriteSheet objects
		
		nextImage[i].onload = function() {

			//FIXME? - Need to update canvas dimensions as well?
			
			ctx.drawImage(this, 0, nextSheetY, this.width, this.height);	
		
			this.tile.masterSpriteSheetY = nextSheetY; //for tileMap coordinate assignment
		
			nextSheetY += this.height;
			
			spriteSheetsToLoad--;

			if (spriteSheetsToLoad === 0) {					
				var masterSpriteSheetImage = new Image();
			
				masterSpriteSheetImage.src = spriteSheetCanvas.toDataURL();
							
				Game.display._options.tileSet = masterSpriteSheetImage;	
				
				Game.display._options.tileMap[this.tiles.floorTile.character] = [0, this.tiles.floorTile.masterSpriteSheetY];
				Game.display._options.tileMap[this.tiles.wallTile.character] = [0, this.tiles.wallTile.masterSpriteSheetY];
			}
		};
	}	
};