var Interface =  {
	canvasContainer: document.getElementById('canvas-container'),
	tilePixelWidth: 60, //single tile height/width //FIXME - hardcoded - move to redmurk.js?
	canvasTileWidth: null, //# of tiles wide
	canvasTileHeight: null,
	uiCanvas: null,
	uiIcons: {},
	init: function() {
		this.loadIcons();
		this.updateCanvasTileDimensions();
		window.addEventListener('resize', this.updateCanvasTileDimensions());	
    },
    loadIcons: function() {
    	var iconWidth = this.tilePixelWidth / 3;
    
    	var pauseIcon = new Image();
    	pauseIcon.src = 'interface/icons/icon-60x60-pause.svg';
    	pauseIcon.height = iconWidth;
    	pauseIcon.width = iconWidth; 	    	
    	this.uiIcons.pauseIcon = pauseIcon;
    	
    	var menuIcon = new Image();
    	menuIcon.src = 'interface/icons/icon-60x60-menu.svg';
    	menuIcon.height = iconWidth;
    	menuIcon.width = iconWidth; 	    	
    	this.uiIcons.menuIcon = menuIcon;
    	
    	var healIcon = new Image();
    	healIcon.src = 'interface/icons/icon-60x60-heal.svg';
    	healIcon.height = this.tilePixelWidth * .7;
    	healIcon.width = this.tilePixelWidth * .7; 	    	
    	this.uiIcons.healIcon = healIcon;
    	
    	/*var arrowIcon = new Image(); //FIXME - way to rotat single image?
    	arrowIcon.src = 'interface/icons/icon-60x60-arrow.svg';
    	arrowIcon.height = iconWidth;
    	arrowIcon.width = iconWidth; 	    	
    	this.uiIcons.arrowIcon = arrowIcon;*/
    	
    	var arrowIconUp = new Image();
    	arrowIconUp.src = 'interface/icons/icon-60x60-arrow-up.svg';
    	arrowIconUp.height = iconWidth;
    	arrowIconUp.width = iconWidth; 	    	
    	this.uiIcons.arrowIconUp = arrowIconUp;
    	
    	var arrowIconDown = new Image();
    	arrowIconDown.src = 'interface/icons/icon-60x60-arrow-down.svg';
    	arrowIconDown.height = iconWidth;
    	arrowIconDown.width = iconWidth; 	    	
    	this.uiIcons.arrowIconDown = arrowIconDown;
    	
    	var arrowIconLeft = new Image();
    	arrowIconLeft.src = 'interface/icons/icon-60x60-arrow-left.svg';
    	arrowIconLeft.height = iconWidth;
    	arrowIconLeft.width = iconWidth; 	    	
    	this.uiIcons.arrowIconLeft = arrowIconLeft;
    	
    	var arrowIconRight = new Image();
    	arrowIconRight.src = 'interface/icons/icon-60x60-arrow-right.svg';
    	arrowIconRight.height = iconWidth;
    	arrowIconRight.width = iconWidth; 	    	
    	this.uiIcons.arrowIconRight = arrowIconRight;
    	
    	var closeIcon = new Image();
    	closeIcon.src = 'interface/icons/icon-60x60-close.svg';
    	closeIcon.height = iconWidth;
    	closeIcon.width = iconWidth; 	    	
    	this.uiIcons.closeIcon = closeIcon;
    	
    	var plusIcon = new Image();
    	plusIcon.src = 'interface/icons/icon-60x60-plus.svg';
    	plusIcon.height = iconWidth;
    	plusIcon.width = iconWidth; 	    	
    	this.uiIcons.plusIcon = plusIcon;
    	
    	/*var minusIcon = new Image();
    	minusIcon.src = 'interface/icons/icon-60x60-minus.svg';
    	minusIcon.height = iconWidth;
    	minusIcon.width = iconWidth; 	    	
    	this.uiIcons.minusIcon = minusIcon;*/
    	
    	var arrowIconRightLeft = new Image();
    	arrowIconRightLeft.src = 'interface/icons/icon-60x60-arrow-right-left.svg';
    	arrowIconRightLeft.height = iconWidth;
    	arrowIconRightLeft.width = iconWidth; 	    	
    	this.uiIcons.arrowIconRightLeft = arrowIconRightLeft;
    	
    	var arrowIconUpDown = new Image();
    	arrowIconUpDown.src = 'interface/icons/icon-60x60-arrow-up-down.svg';
    	arrowIconUpDown.height = iconWidth;
    	arrowIconUpDown.width = iconWidth; 	    	
    	this.uiIcons.arrowIconUpDown = arrowIconUpDown;
    	
    	var compassIcon = new Image();
    	compassIcon.src = 'interface/icons/icon-60x60-compass.svg';
    	compassIcon.height = iconWidth;
    	compassIcon.width = iconWidth; 	    	
    	this.uiIcons.compassIcon = compassIcon;
    	
    	/*var healthIcon = new Image();
    	healthIcon.src = 'interface/icons/icon-60x60-health.svg';
    	healthIcon.height = iconWidth;
    	healthIcon.width = iconWidth; 	    	
    	this.uiIcons.healthIcon = healthIcon;*/
    	    	
    },
    updateCanvasTileDimensions: function() {

    	this.canvasTileWidth = this.canvasContainer.offsetWidth / this.tilePixelWidth;
    	this.canvasTileHeight = this.canvasContainer.offsetHeight / this.tilePixelWidth;

//console.log(this.canvasContainer.offsetWidth + ',' + this.canvasContainer.offsetHeight);
//console.log(this.canvasTileWidth + ',' + this.canvasTileHeight);
		
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
    clearCanvas: function() {
    	var ctx = this.uiCanvas.getContext("2d");
    	ctx.clearRect(0, 0, this.uiCanvas.width, this.uiCanvas.height);
    },
    drawUI: function(parameters) {

    	this.clearCanvas();
    	
    	var ctx = this.uiCanvas.getContext("2d");
    	
    	//parameters array defined in environment
    	for (var i = 0, j = parameters.length; i < j; i++) {	
    		
    		var componentParameters = parameters[i];
    		
    		var inset = 4;
		
			//off set component positioning and sizing to provide padding in between
			var componentX = componentParameters.x + inset;
			var componentY = componentParameters.y + inset;
			var componentWidth = componentParameters.width - (inset * 2);
			var componentHeight = componentParameters.height - (inset * 2);
			
			var componentBackgroundStyle = componentParameters.backgroundStyle;
			var componentRoundedCorners = componentParameters.roundedCorners;
			var componentTransparency = componentParameters.transparency;
			var componentIcon = componentParameters.icon;
			var componentText = componentParameters.text;
			
			//component styling & drawing				
			if (!componentTransparency) {
				componentTransparency = 1.0;
			} else {
				componentTransparency = 0.45;
			}
			
			if (componentBackgroundStyle === 'button01') {		
				var gradient1 = ctx.createLinearGradient(componentX,componentY,componentX,componentY+componentHeight);
				gradient1.addColorStop("0","#5f5f5f");
				gradient1.addColorStop("1.0","#454545");

				ctx.fillStyle = gradient1;
				ctx.strokeStyle = gradient1;
			
			} else if (componentBackgroundStyle === 'dark01') {
				ctx.fillStyle = "rgba(0, 0, 0, " + componentTransparency + ")";
				ctx.strokeStyle = "rgba(0, 0, 0, " + componentTransparency + ")";
				  
			} else if (componentBackgroundStyle === 'light01') {
				ctx.fillStyle = "rgba(160, 160, 160, " + componentTransparency + ")";
				ctx.strokeStyle = "rgba(160, 160, 160, " + componentTransparency + ")";
			}
			
			if (componentBackgroundStyle != 'none') {
				if (componentRoundedCorners) {
				
					var cornerRadius = 20;
					ctx.lineJoin = "round";
					ctx.lineWidth = 20; 

					ctx.strokeRect(componentX+(cornerRadius/2), componentY+(cornerRadius/2), componentWidth-cornerRadius, componentHeight-cornerRadius);	
					ctx.fillRect(componentX+(cornerRadius/2), componentY+(cornerRadius/2), componentWidth-cornerRadius, componentHeight-cornerRadius);
									
				} else {

					ctx.strokeRect(componentX, componentY, componentWidth, componentHeight);
					ctx.fillRect(componentX, componentY, componentWidth, componentHeight);
				}
			}
			
			if (componentIcon) {
				var iconX = componentX + (componentWidth / 2) - (componentIcon.width / 2);
				var iconY = componentY + (componentHeight / 2) - (componentIcon.height / 2);
			
				ctx.drawImage(componentIcon, iconX, iconY, componentIcon.width, componentIcon.height);					
			}
			
			if (componentText) {
		
				var fontSize = 12;
				
				ctx.fillStyle = "rgba(255, 255, 255, 1.0)";
				ctx.font = fontSize + "px sans-serif";

				var componentTextLength = componentText.length;
				var verticalSpacing = componentHeight / (componentTextLength + 1);
		
				for (var k = 0; k < componentTextLength; k++) {
					var componentTextX = componentX + (componentWidth / 2) - (ctx.measureText(componentText[k]).width / 2);
					var componentTextY = componentY + (verticalSpacing * (k + 1));
			
					ctx.fillText(componentText[k],componentTextX,componentTextY);
				}
			}
			
			//background image
			//var c=document.getElementById("myCanvas");
			//var ctx=c.getContext("2d");
			//var img=document.getElementById("lamp");
			//var pat=ctx.createPattern(img,"repeat");
			//ctx.rect(0,0,150,100);
			//ctx.fillStyle=pat;
			//ctx.fill();
			
    	}
    }
}