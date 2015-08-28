Game.SpecialEffects =  {
	canvasContainer: document.getElementById('canvas-container'),
	tilePixelWidth: 60, //single tile height/width //FIXME - hardcoded //Game.interfaceObject.tilePixelWidth - not yet available
	canvasTileWidth: null, //# of tiles wide
	canvasTileHeight: null,
	specialEffectsCanvas: null,
	init: function() {
		this.updateCanvasTileDimensions();
		window.addEventListener('resize', this.updateCanvasTileDimensions());
		
		this.createSpecialEffectsCanvas();
    },
    updateCanvasTileDimensions: function() { //FIXME - centralize? also used by interface
    	this.canvasTileWidth = this.canvasContainer.offsetWidth / this.tilePixelWidth;
    	this.canvasTileHeight = this.canvasContainer.offsetHeight / this.tilePixelWidth;
		
		if (this.specialEffectsCanvas !== null) {
			this.specialEffectsCanvas.width = this.canvasTileWidth * this.tilePixelWidth;
			this.specialEffectsCanvas.height = this.canvasTileHeight * this.tilePixelWidth;		
		}
    },
    createSpecialEffectsCanvas: function() {
    	this.specialEffectsCanvas = document.createElement('canvas');
    	this.specialEffectsCanvas.id = 'specialeffects';
		this.specialEffectsCanvas.width = this.canvasTileWidth * this.tilePixelWidth;
		this.specialEffectsCanvas.height = this.canvasTileHeight * this.tilePixelWidth;
    	this.canvasContainer.appendChild(this.specialEffectsCanvas);
    },
    drawSpecialEffects: function(parameters) {

    	//var ctx = this.specialEffectsCanvas.getContext("2d");
    	
    	//ctx.globalAlpha = 0.5 //opacity for images
		//ctx.fillStyle = "rgba(0, 0, 0, 0.45)"; //ctx.fillStyle = "#000000";
		//ctx.fillRect(componentX,componentY,componentWidth,componentHeight);
    	//ctx.fillStyle = "rgba(255, 255, 255, 1.0)";
		//ctx.font = fontSize + "px sans-serif";
    	//ctx.drawImage(componentIcon, iconX, iconY, componentIcon.width, componentIcon.height);

    }
}