var Interface =  {
	canvasContainer: document.getElementById('canvas-container'),
	tilePixelWidth: 60,
	canvasTileWidth: null,
	canvasTileHeight: null,
	init: function() {
		this.updateCanvasTileDimensions();
		window.addEventListener('resize', this.updateCanvasTileDimensions());	
    },
    updateCanvasTileDimensions: function() {
    	this.canvasTileWidth = this.canvasContainer.offsetWidth / this.tilePixelWidth;
    	this.canvasTileHeight = this.canvasContainer.offsetHeight / this.tilePixelWidth;
    	
    	//console.log(this.canvasContainer.offsetWidth + 'x' + this.canvasContainer.offsetHeight);
    	//console.log(this.canvasTileWidth + 'x' + this.canvasTileHeight);
    }
}