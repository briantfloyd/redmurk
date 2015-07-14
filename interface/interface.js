var Interface =  {
	canvasContainer: document.getElementById('canvas-container'),
	tilePixelWidth: 60, //single tile height/width
	canvasTileWidth: null, //# of tiles wide
	canvasTileHeight: null,
	uiCanvas: null,
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
    },
    createUICanvas: function() {
    	this.uiCanvas = document.createElement('canvas');
    	this.uiCanvas.id = 'ui';
		this.uiCanvas.width = this.canvasTileWidth * this.tilePixelWidth;
		this.uiCanvas.height = this.canvasTileHeight * this.tilePixelWidth;
    	this.canvasContainer.appendChild(this.uiCanvas);
    },
    drawUI: function(parameters) {

    	var ctx = this.uiCanvas.getContext("2d");
    	
    	for (var i = 0, j = parameters.length; i < j; i++) {	
    		
    		var componentParameters = parameters[i]();
		
			var componentX = componentParameters.x;
			var componentY = componentParameters.y;
			var componentWidth = componentParameters.width;
			var componentHeight = componentParameters.height;
			
			if (componentParameters.type === 'display'){
				//ctx.globalAlpha = 0.5 //opacity for images
				ctx.fillStyle = "rgba(0, 0, 0, 0.45)"; //ctx.fillStyle = "#000000";
				ctx.fillRect(componentX,componentY,componentWidth,componentHeight);
			
				var displayText = componentParameters.text;
				var fontSize = 12;
			
				ctx.fillStyle = "rgba(255, 255, 255, 1.0)";
				ctx.font = fontSize + "px sans-serif";
				
				var displayTextLength = displayText.length;
				var verticalSpacing = componentHeight / (displayTextLength + 1);
				
				for (var k = 0; k < displayTextLength; k++) {
					var displayTextX = componentX + (componentWidth / 2) - (ctx.measureText(displayText[k]).width / 2);
					var displayTextY = componentY + (verticalSpacing * (k + 1));
					
					ctx.fillText(displayText[k],displayTextX,displayTextY);
				}		
						
			} else if (componentParameters.type === 'button'){
				ctx.fillStyle = "#333333";
				ctx.fillRect(componentX,componentY,componentWidth,componentHeight);
				
				var buttonText = componentParameters.text[0];
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