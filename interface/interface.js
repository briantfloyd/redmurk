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
    drawUI: function(parameters) {

    	var ctx = this.uiCanvas.getContext("2d");
    	
    	//clear UI canvas
    	ctx.clearRect(0, 0, this.uiCanvas.width, this.uiCanvas.height);
    	
    	//parameters array defined in environment
    	for (var i = 0, j = parameters.length; i < j; i++) {	
    		
    		var componentParameters = parameters[i];
    		
    		var inset = 4;
		
			//off set component positioning and sizing to provide padding in between
			var componentX = componentParameters.x + inset;
			var componentY = componentParameters.y + inset;
			var componentWidth = componentParameters.width - (inset * 2);
			var componentHeight = componentParameters.height - (inset * 2);
			var componentType = componentParameters.type;
			var componentFont = componentParameters.font;
			
			//component type styling & drawing
			if (componentType === 'message display'){
				//ctx.globalAlpha = 0.5 //opacity for images
				ctx.fillStyle = "rgba(0, 0, 0, 0.45)"; //ctx.fillStyle = "#000000";
				ctx.fillRect(componentX,componentY,componentWidth,componentHeight);
			
				var displayText = componentParameters.text;
			
				ctx.fillStyle = "rgba(255, 255, 255, 1.0)";
				ctx.font = "italic 12px sans-serif";

				if (displayText) {
					var displayTextLength = displayText.length;
					var verticalSpacing = componentHeight / (displayTextLength + 1);
				
					for (var k = 0; k < displayTextLength; k++) {
						var displayTextX = componentX + (componentWidth / 2) - (ctx.measureText(displayText[k]).width / 2);
						var displayTextY = componentY + (verticalSpacing * (k + 1));
					
						ctx.fillText(displayText[k],displayTextX,displayTextY);
					}
				}		
			
			} else if (componentType === 'stats display'){
				/*icon: {
					health: Game.interfaceObject.uiIcons.healthIcon,
					attack: Game.interfaceObject.uiIcons.attackIcon,
					defense: Game.interfaceObject.uiIcons.defenseIcon,
				},*/					
				
				ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
				ctx.fillRect(componentX,componentY,componentWidth,componentHeight);
			
				var displayText = componentParameters.text;
			
				ctx.fillStyle = "rgba(255, 255, 255, 1.0)";
				ctx.font = "bold 16px sans-serif";

				if (displayText) {
					var displayTextLength = displayText.length;
					var verticalSpacing = componentHeight / (displayTextLength + 1);
				
					for (var k = 0; k < displayTextLength; k++) {
						var displayTextX = componentX + (componentWidth / 2) - (ctx.measureText(displayText[k]).width / 2);
						var displayTextY = componentY + (verticalSpacing * (k + 1));
					
						ctx.fillText(displayText[k],displayTextX,displayTextY);
					
						/*
						if (componentParameters.icon
					
						var componentIcon = componentParameters.icon;
					
						var iconX = componentX + (componentWidth / 2) - (this.uiIcons.pauseIcon.width / 2);
						var iconY = componentY + (componentHeight / 2) - (this.uiIcons.pauseIcon.height / 2);
				
						ctx.drawImage(componentIcon, iconX, iconY, componentIcon.width, componentIcon.height);
					
						*/	
					}
				}						
			} else if (componentType === 'button'){
				
				//button rect fill/stroke
				var gradient1 = ctx.createLinearGradient(componentX,componentY,componentX,componentY+componentHeight);
				gradient1.addColorStop("0","#5f5f5f");
				gradient1.addColorStop("1.0","#454545");

				ctx.fillStyle = gradient1;
				ctx.strokeStyle = gradient1;
				//ctx.fillStyle = "rgba(69, 69, 69, 0.75)";
				//ctx.strokeStyle = "rgba(69, 69, 69, 0.75)";
				
				var cornerRadius = 20;
				ctx.lineJoin = "round";
				ctx.lineWidth = 20; 
				
				ctx.strokeRect(componentX+(cornerRadius/2), componentY+(cornerRadius/2), componentWidth-cornerRadius, componentHeight-cornerRadius);
				ctx.fillRect(componentX+(cornerRadius/2), componentY+(cornerRadius/2), componentWidth-cornerRadius, componentHeight-cornerRadius);
	
				
				if (!componentParameters.icon) {
					//button text
					var gradient2 = ctx.createLinearGradient(componentX,componentY,componentX,componentY+componentHeight);
					gradient2.addColorStop("0","#000000");
					gradient2.addColorStop("1.0","#e6e6e6");
				
					ctx.strokeStyle = gradient2;
					ctx.lineWidth = 3; 
						
					var buttonText = componentParameters.text[0];
					var fontSize = 12;
					var buttonTextX = componentX + (componentWidth / 2) - (ctx.measureText(buttonText).width / 2);
					var buttonTextY = componentY + (componentHeight / 2); //FIXME - need more precise vertical centering
				
					ctx.fillStyle = "rgba(255, 255, 255, 1.0)";
					ctx.font = fontSize + "px sans-serif";
				
					ctx.strokeText(buttonText,buttonTextX,buttonTextY);
					ctx.fillText(buttonText,buttonTextX,buttonTextY);
				
				} else {
					//button icon
					var componentIcon = componentParameters.icon;
					
					var iconX = componentX + (componentWidth / 2) - (componentIcon.width / 2);
					var iconY = componentY + (componentHeight / 2) - (componentIcon.height / 2);
				
					ctx.drawImage(componentIcon, iconX, iconY, componentIcon.width, componentIcon.height);	
				}

				//FIXME - if button, then onclick() property action //listener?
				
				
			} else if (componentType === 'inventory display'){
				var cornerRadius = 20;
				//ctx.lineJoin = "round";
				//ctx.lineWidth = 20; 
				
				ctx.fillStyle = "rgba(255, 255, 255, 0.45)"; //ctx.fillStyle = "#000000";
				//ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";

				//ctx.strokeRect(componentX+(cornerRadius/2), componentY+(cornerRadius/2), componentWidth-cornerRadius, componentHeight-cornerRadius);
				//ctx.fillRect(componentX+(cornerRadius/2), componentY+(cornerRadius/2), componentWidth-cornerRadius, componentHeight-cornerRadius);
				
				ctx.fillRect(componentX, componentY, componentWidth, componentHeight);
				
				/*
				
				var c=document.getElementById("myCanvas");
				var ctx=c.getContext("2d");
				var img=document.getElementById("lamp");
				var pat=ctx.createPattern(img,"repeat");
				ctx.rect(0,0,150,100);
				ctx.fillStyle=pat;
				ctx.fill();

				*/
			
			}
    	}
    }
}