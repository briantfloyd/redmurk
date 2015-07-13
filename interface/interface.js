var Interface =  {
	canvasContainer: document.getElementById('canvas-container'),
	tilePixelWidth: 60, //single tile height/width
	canvasTileWidth: null, //# of tiles wide
	canvasTileHeight: null,
	uiCanvas: null,
	uiParameters: null,
	init: function() {
		this.updateCanvasTileDimensions();
		window.addEventListener('resize', this.updateCanvasTileDimensions());	
    },
    updateCanvasTileDimensions: function() {
    	this.canvasTileWidth = this.canvasContainer.offsetWidth / this.tilePixelWidth;
    	this.canvasTileHeight = this.canvasContainer.offsetHeight / this.tilePixelWidth;
		
		if (this.uiCanvas !== null) {
			this.uiCanvas.width = this.canvasTileWidth * this.tilePixelWidth;
			this.uiCanvas.height = this.canvasTileHeight * this.tilePixelWidth;		
		}
		
console.log(this.canvasContainer.offsetHeight + ',' + this.canvasContainer.offsetWidth);
console.log('interface.updateCanvasTileDimensions: ' + this.canvasTileHeight + ',' + this.canvasTileWidth);    	
    	//console.log(this.canvasContainer.offsetWidth + 'x' + this.canvasContainer.offsetHeight);
    	//console.log(this.canvasTileWidth + 'x' + this.canvasTileHeight);
    },
    buildUI: function(uiParameters) {
    	this.uiParameters = uiParameters;
    	this.uiCanvas = document.createElement('canvas');
    	this.uiCanvas.id = 'ui';
		this.uiCanvas.width = this.canvasTileWidth * this.tilePixelWidth;
		this.uiCanvas.height = this.canvasTileHeight * this.tilePixelWidth;
    	this.canvasContainer.appendChild(this.uiCanvas);
    },
    drawUI: function() {

    	var ctx = this.uiCanvas.getContext("2d");
    	
    	for (var i = 0, j = this.uiParameters.length; i < j; i++) {	
    		
    		var componentParameters = this.uiParameters[i];
		
			var componentX = componentParameters.x;
			var componentY = componentParameters.y;
			var componentWidth = componentParameters.width;
			var componentHeight = componentParameters.height;
			
			if (componentParameters.type === 'display'){
				//ctx.globalAlpha = 0.5 //opacity for images
				ctx.fillStyle = "rgba(0, 0, 0, 0.45)"; //ctx.fillStyle = "#000000";
				ctx.fillRect(componentX,componentY,componentWidth,componentHeight);
				
			} else if (componentParameters.type === 'button'){
				ctx.fillStyle = "#333333";
				ctx.fillRect(componentX,componentY,componentWidth,componentHeight);
				
				var buttonText = componentParameters.text;
				var fontSize = 12;
				var buttonTextX = componentX + (componentWidth / 2) - (ctx.measureText(buttonText).width / 2);
				var buttonTextY = componentY + (componentHeight / 2);// - (ctx.measureText(buttonText).height / 2);
				
				ctx.fillStyle = "rgba(1 , 1, 1, 1.0)";
				ctx.font = fontSize + "px sans-serif";
				ctx.fillText(buttonText,buttonTextX,buttonTextY);
				
				//if button, then onclick() property action //listener?
			}
			
    	}

    }
}