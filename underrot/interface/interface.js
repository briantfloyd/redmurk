/* Copyright (c) 2015, Brian T. Floyd. FreeBSD License. */
var Interface =  {
	canvasContainer: document.getElementById('canvas-container'),
	backCanvasContainer: document.getElementById('back-canvas-container'),
	tilePixelWidth: 60, //single tile height/width //FIXME - hardcoded - move to environment?
	canvasTileWidth: null, //# of tiles wide
	canvasTileHeight: null,
	backCanvasTileHeight: null,
	backCanvasTileWidth: null,
	uiMaxTilesWide: 11, //FIXME - hardcoded - move to environment?
	uiHalfTilesWide: function() {
		var halfWidth = ((this.canvasTileWidth - 1) / 2);
		if (this.canvasTileWidth > this.uiMaxTilesWide) {
			halfWidth = (this.uiMaxTilesWide - 1) / 2;
		}
		return halfWidth;
	},
	uiHalfTilesHigh: function() {
		var halfHeight = ((this.canvasTileHeight - 1) / 2);
		if (this.canvasTileHeight > this.uiMaxTilesWide) {
			halfHeight = (this.uiMaxTilesWide - 1) / 2;
		}
		return halfHeight;
	},
	uiTileHorizontalMargin: function() {
		var margin = 0;
		if (this.canvasTileWidth > this.uiMaxTilesWide) {
			margin = (this.canvasTileWidth - this.uiMaxTilesWide) / 2;
		} 
		return margin;
	}, 
	uiTileVerticalMargin: function() {
		var margin = 0;
		if (this.canvasTileHeight > this.uiMaxTilesWide) {
			margin = (this.canvasTileHeight - this.uiMaxTilesWide) / 2;
		} 
		return margin;
	},
	uiMenuScreenTileWidth: function() {
		var width = Math.min(this.canvasTileWidth, this.uiMaxTilesWide);
		return width;
	},
	uiMenuScreenTileHeight: function() {
		var height = Math.min(this.canvasTileHeight, this.uiMaxTilesWide);
		return height;
	},
	uiCanvas: null,
	uiBackCanvas: null,
	uiIcons: {},
	init: function() {
		this.loadIcons();
		this.updateCanvasTileDimensions();
		window.addEventListener('resize', this.updateCanvasTileDimensions());	
    },
    loadIcons: function() {
    
    	var pauseIcon = new Image();
    	pauseIcon.src = '../underrot/interface/icons/icon-60x60-pause.svg';   	
    	this.uiIcons.pauseIcon = pauseIcon;
    	
    	var menuIcon = new Image();
    	menuIcon.src = '../underrot/interface/icons/icon-60x60-menu.svg';    	
    	this.uiIcons.menuIcon = menuIcon;
    	
    	var healIcon = new Image();
    	healIcon.src = '../underrot/interface/icons/icon-60x60-heal-white.svg';	    	
    	this.uiIcons.healIcon = healIcon;
    	
    	/*var arrowIcon = new Image(); //FIXME - way to rotat single image?
    	arrowIcon.src = '../underrot/interface/icons/icon-60x60-arrow.svg';    	
    	this.uiIcons.arrowIcon = arrowIcon;*/
    	
    	var arrowIconUp = new Image();
    	arrowIconUp.src = '../underrot/interface/icons/icon-60x60-arrow-up.svg';    	
    	this.uiIcons.arrowIconUp = arrowIconUp;
    	
    	var arrowIconDown = new Image();
    	arrowIconDown.src = '../underrot/interface/icons/icon-60x60-arrow-down.svg';	    	
    	this.uiIcons.arrowIconDown = arrowIconDown;
    	
    	var arrowIconLeft = new Image();
    	arrowIconLeft.src = '../underrot/interface/icons/icon-60x60-arrow-left.svg';    	
    	this.uiIcons.arrowIconLeft = arrowIconLeft;
    	
    	var arrowIconRight = new Image();
    	arrowIconRight.src = '../underrot/interface/icons/icon-60x60-arrow-right.svg';	    	
    	this.uiIcons.arrowIconRight = arrowIconRight;
    	
    	var checkmarkIcon = new Image();
    	checkmarkIcon.src = '../underrot/interface/icons/icon-60x60-checkmark-white.svg';    	
    	this.uiIcons.checkmarkIcon = checkmarkIcon;
    	
    	var closeIcon = new Image();
    	closeIcon.src = '../underrot/interface/icons/icon-60x60-close.svg';	    	
    	this.uiIcons.closeIcon = closeIcon;
    	
    	var trashIcon = new Image();
    	trashIcon.src = '../underrot/interface/icons/icon-60x60-trash.svg'; 	    	
    	this.uiIcons.trashIcon = trashIcon;
    	
    	var plusIcon = new Image();
    	plusIcon.src = '../underrot/interface/icons/icon-60x60-plus.svg';	    	
    	this.uiIcons.plusIcon = plusIcon;
    	
    	var minusIcon = new Image();
    	minusIcon.src = '../underrot/interface/icons/icon-60x60-minus.svg';	    	
    	this.uiIcons.minusIcon = minusIcon;
    	
    	var arrowIconRightLeft = new Image();
    	arrowIconRightLeft.src = '../underrot/interface/icons/icon-60x60-arrow-right-left.svg';	    	
    	this.uiIcons.arrowIconRightLeft = arrowIconRightLeft;
    	
    	var arrowIconUpDown = new Image();
    	arrowIconUpDown.src = '../underrot/interface/icons/icon-60x60-arrow-up-down.svg'; 	    	
    	this.uiIcons.arrowIconUpDown = arrowIconUpDown;
    	
    	var compassIcon = new Image();
    	compassIcon.src = '../underrot/interface/icons/icon-60x60-compass.svg';	    	
    	this.uiIcons.compassIcon = compassIcon;
    	
    	var healthIcon = new Image();
    	healthIcon.src = '../underrot/interface/icons/icon-60x60-health.svg';	    	
    	this.uiIcons.healthIcon = healthIcon;
		
		var attackIcon = new Image();
    	attackIcon.src = '../underrot/interface/icons/icon-60x60-attack.svg';	    	
    	this.uiIcons.attackIcon = attackIcon;
		
		var defenseIcon = new Image();
    	defenseIcon.src = '../underrot/interface/icons/icon-60x60-defense.svg';	    	
    	this.uiIcons.defenseIcon = defenseIcon;
    	
    	var stairsIcon = new Image();
    	stairsIcon.src = '../underrot/interface/icons/icon-60x60-stairs.svg'; 	    	
    	this.uiIcons.stairsIcon = stairsIcon;
    	
    	var trophyIcon = new Image();
    	trophyIcon.src = '../underrot/interface/icons/icon-60x60-trophy.svg'; 	    	
    	this.uiIcons.trophyIcon = trophyIcon;
    	
    	var newGameIcon = new Image();
    	newGameIcon.src = '../underrot/interface/icons/icon-60x60-new-game.svg'; 	    	
    	this.uiIcons.newGameIcon = newGameIcon;
    	
    	var loadGameIcon = new Image();
    	loadGameIcon.src = '../underrot/interface/icons/icon-60x60-load-game.svg'; 	    	
    	this.uiIcons.loadGameIcon = loadGameIcon;
    	    	
    },
    updateCanvasTileDimensions: function() {

    	this.canvasTileWidth = this.canvasContainer.offsetWidth / this.tilePixelWidth;
    	this.canvasTileHeight = this.canvasContainer.offsetHeight / this.tilePixelWidth;
		
		this.backCanvasTileWidth = this.backCanvasContainer.offsetWidth / this.tilePixelWidth;
    	this.backCanvasTileHeight = this.backCanvasContainer.offsetHeight / this.tilePixelWidth;

//console.log(this.canvasContainer.offsetWidth + ',' + this.canvasContainer.offsetHeight);
//console.log(this.canvasTileWidth + ',' + this.canvasTileHeight);
		
		if (this.uiCanvas !== null) {
			this.uiCanvas.width = this.canvasTileWidth * this.tilePixelWidth;
			this.uiCanvas.height = this.canvasTileHeight * this.tilePixelWidth;		
		}

		if (this.uiBackCanvas !== null) {
			this.uiBackCanvas.width = this.backCanvasTileWidth * this.tilePixelWidth;
			this.uiBackCanvas.height = this.backCanvasTileHeight * this.tilePixelWidth;		
		}		
    },
    createUICanvas: function() {
    	this.uiCanvas = document.createElement('canvas');
    	this.uiCanvas.id = 'ui';
		this.uiCanvas.width = this.canvasTileWidth * this.tilePixelWidth;
		this.uiCanvas.height = this.canvasTileHeight * this.tilePixelWidth;
    	this.canvasContainer.appendChild(this.uiCanvas);
    },
    createUIBackCanvas: function() {
    	this.uiBackCanvas = document.createElement('canvas');
    	this.uiBackCanvas.id = 'uiBack';
		this.uiBackCanvas.width = this.backCanvasTileWidth * this.tilePixelWidth;
		this.uiBackCanvas.height = this.backCanvasTileHeight * this.tilePixelWidth;
    	this.backCanvasContainer.appendChild(this.uiBackCanvas);
    },
    clearCanvas: function() {
    	var ctx = this.uiCanvas.getContext("2d");
    	ctx.clearRect(0, 0, this.uiCanvas.width, this.uiCanvas.height);
		
		var ctx2 = this.uiBackCanvas.getContext("2d");
    	ctx2.clearRect(0, 0, this.uiBackCanvas.width, this.uiBackCanvas.height);
    },
    drawUI: function(parameters) {

    	//this.clearCanvas();
    	
    	var ctx = this.uiCanvas.getContext("2d");
		var ctx2 = this.uiBackCanvas.getContext("2d");
    	
    	//parameters array defined in environment
    	for (var i = 0, j = parameters.length; i < j; i++) {	
    		
    		var componentParameters = parameters[i];
  			
			//components considered available by default
   			var componentAvailable = true;
   			
   			//then check if component availability is conditional
   			if (componentParameters.availabilityCheck) {
   				componentAvailable = componentParameters.availabilityCheck();			
   			}
		
   			//selectable/selected check
   			var componentSelected = false;
   			
   			//if (componentParameters.selected) {
   			if (componentParameters.hasOwnProperty('selected')) {
   				componentSelected = componentParameters.selected;
   			}
  			
   			//inset resizing
			var inset = 4;
			
			if (componentParameters.noInset){
				inset = 0;
			}
		
			//offset component positioning and sizing to provide padding in between
			var componentX = componentParameters.x + inset;
			var componentY = componentParameters.y + inset;
			var componentWidth = componentParameters.width - (inset * 2);
			var componentHeight = componentParameters.height - (inset * 2);
			
			//label resizing
			var componentLabel = componentParameters.label;
			var labelSize = 12;
			var labelTopMargin = 5;
			
			if (componentLabel) {
				var labelAdjustment = labelSize + labelTopMargin;
				componentHeight = componentHeight - labelAdjustment;
				componentWidth = componentWidth - labelAdjustment;
				componentX = componentX + (labelAdjustment / 2); //only center horizontally, the vertical offset is needed to display the label itself				
			}				
			
			//component styling & drawing
			var componentBackgroundStyle = componentParameters.backgroundStyle;
			var componentImageBackground = componentParameters.imageBackground;
			var componentScreenBackground = componentParameters.screenBackground;
			var componentHorizontalRule = componentParameters.horizontalRule;
			var componentTextStyle = componentParameters.textStyle;
			var componentRoundedCorners = componentParameters.roundedCorners;
			var componentTransparency = componentParameters.transparency;
			var componentContent = componentParameters.content;			
			var componentOutline = componentParameters.outline;
			var componentHighlighted = componentParameters.highlighted;
			var componentClickHighlight = componentParameters.clickHighlight;
					
			if (!componentTransparency) {
				componentTransparency = 1.0;

			} else {
				//componentTransparency = 0.45;
				componentTransparency = 0.30;
						
				if (componentAvailable) {
					componentTransparency = 0.60;
				}
				if (componentSelected) {
					componentTransparency = 0.60;//0.90;
				}
			}

			if (componentRoundedCorners) {
				
				var cornerRadius = 10;

				ctx.beginPath();
				ctx.moveTo(componentX, componentY + cornerRadius);
				ctx.quadraticCurveTo(componentX, componentY, componentX + cornerRadius, componentY);
				ctx.lineTo(componentX + componentWidth - cornerRadius, componentY);
				ctx.quadraticCurveTo(componentX + componentWidth, componentY, componentX + componentWidth, componentY + cornerRadius);
				ctx.lineTo(componentX + componentWidth, componentY + componentHeight - cornerRadius);
				ctx.quadraticCurveTo(componentX + componentWidth, componentY + componentHeight, componentX + componentWidth - cornerRadius, componentY + componentHeight);
				ctx.lineTo(componentX + cornerRadius, componentY + componentHeight);
				ctx.quadraticCurveTo(componentX, componentY + componentHeight, componentX, componentY + componentHeight - cornerRadius);
				ctx.lineTo(componentX, componentY + cornerRadius);
			}/* else {
	console.log(componentContent);		
				console.log(componentX);
				console.log(componentY);
				console.log(componentWidth);
				console.log(componentHeight);
				ctx.rect(componentX, componentY, componentWidth, componentHeight);
			}*/	
			
			if (componentImageBackground) {
				ctx.globalAlpha = componentTransparency;
				ctx.drawImage(componentImageBackground, componentX, componentY, componentWidth, componentHeight);
				ctx.globalAlpha = 1.0; //reset back
				
			}
			
			if (componentScreenBackground) {
				ctx2.globalAlpha = componentTransparency;
				ctx2.drawImage(componentScreenBackground, componentX, componentY, componentWidth, componentHeight);
				ctx2.globalAlpha = 1.0; //reset back
				
			}
			
			if (componentHorizontalRule) {
				//ctx.globalAlpha = componentTransparency;
				ctx.fillStyle = "rgba(128, 128, 128, " + componentTransparency + ")";
				
				if (componentHorizontalRule === 'bottom') {
					ctx.fillRect(componentX, componentY + this.tilePixelWidth - 10, componentWidth, 2);
				} /*else if (componentHorizontalRule === 'top') {
					ctx.fillRect(componentX, componentY + this.tilePixelWidth - 10, componentWidth, 2);
				}*/
				
				//ctx.globalAlpha = 1.0; //reset back
				
			}
			
			
			//component background fill
			if (componentBackgroundStyle) {	
				if (componentBackgroundStyle === 'hud01') {
					ctx.fillStyle = "rgba(128, 128, 128, " + componentTransparency + ")";	
			  
				} else if (componentBackgroundStyle === 'heal01') {
					if (componentAvailable) {
						ctx.fillStyle = "rgba(255, 0, 0, " + componentTransparency + ")";
					} else {
						ctx.fillStyle = "rgba(128, 128, 128, " + componentTransparency + ")";
					}
				} else if (componentBackgroundStyle === 'menu01') {
					if (componentClickHighlight) {
						ctx.fillStyle = "rgba(51, 204, 51, " + componentTransparency + ")";
					} else if (componentHighlighted) {
						ctx.fillStyle = "rgba(0, 255, 0, " + componentTransparency + ")";
					} else if (componentSelected) {	
						ctx.fillStyle = "rgba(64, 64, 64, " + componentTransparency + ")";		
					} else {
						ctx.fillStyle = "rgba(0, 0, 0, " + componentTransparency + ")";
					}
				}
				
				//else if (componentBackgroundStyle === 'button01') {		
					//var gradient1 = ctx.createLinearGradient(componentX,componentY,componentX,componentY+componentHeight);
					//gradient1.addColorStop("0","#5f5f5f");
					//gradient1.addColorStop("1.0","#454545");
					//ctx.fillStyle = gradient1;
			
				//} else if (componentBackgroundStyle === 'light01') {
					//ctx.fillStyle = "rgba(160, 160, 160, " + componentTransparency + ")";
				//}
				
				ctx.fill();
			}

			if (componentOutline) { 
				//if (componentAvailable) { //no outline if component not available
					
					if (componentSelected) {
						ctx.strokeStyle = "rgb(255, 255, 255)";
					} else {
						var outlineGradient1 = ctx.createLinearGradient(componentX,componentY,componentX+(componentWidth / 4),componentY+componentHeight);
						outlineGradient1.addColorStop("0","#808080");
						outlineGradient1.addColorStop("1.0","#ffffff");
						ctx.strokeStyle = outlineGradient1;
					}
					ctx.lineWidth = .3;//.1;
					ctx.stroke();
				//}
			}
		
			//default text styling
			var fontSize = 18;
			var fontWeight = 'normal';
			ctx.lineWidth = 2;
			
			//gray out labels and icons if component not available
			var labelAndIconTransparency = componentTransparency;
			
			if (componentAvailable) {
				labelAndIconTransparency = 1.0;
			}
			
			ctx.fillStyle = "rgba(255, 255, 255, " + labelAndIconTransparency + ")";
			//ctx.strokeStyle = "rgba(0, 0, 0, " + labelAndIconTransparency + ")";
			ctx.globalAlpha = labelAndIconTransparency; //reset back to 1.0 below

			//highlight component if selected
			if (componentSelected) {
				//ctx.strokeStyle = "rgba(102, 255, 102, " + labelAndIconTransparency + ")";
			}

			//label
			if (componentLabel) {
				
				ctx.font = "normal" + " " + labelSize + "px sans-serif";
				
				//label margin
				var labelLength = ctx.measureText(componentLabel).width;
				var labelMargin = (componentWidth - labelLength) / 2;				
				
				//draw label
				//ctx.strokeText(componentLabel,componentX + labelMargin,componentY + componentHeight + labelTopMargin + labelSize);//(fontSize / 2));
				ctx.fillText(componentLabel,componentX + labelMargin,componentY + componentHeight + labelTopMargin + labelSize);//(fontSize / 2));	//FIXME 	
			}
			
			//content
			if (componentContent) {

				var componentRowsTotal = componentContent.length;
				var verticalSpacing = componentHeight / (componentRowsTotal + 1);
				var iconWidth = Math.min((componentHeight / componentRowsTotal), componentWidth);
				iconWidth *= .6;	

				/*if (componentTextStyle === 'savedGameButtonText01') {
					fontWeight = 'bold';
					//fontSize = 16;
				} else */if (componentTextStyle === 'headingText01') {
					fontWeight = 'bold';
					fontSize = 24;
				} else if (componentTextStyle === 'headingText02') {
					fontWeight = 'bold';
				}
				
				//fontSize = fontSize / componentRowsTotal;
				if (componentRowsTotal > 1) {
					fontSize = fontSize * Math.pow(.75, componentRowsTotal);
				}
				//ctx.font = fontWeight + " " + fontSize + "px sans-serif"; //need to set for text width  measurement to work below
				
				var componentRowItemX, componentRowItemY, componentRowLength;
		
				for (var k = 0; k < componentRowsTotal; k++) {
				
					//FIXME - hack solution for bolding first row of saved game button text	
					if (componentTextStyle === 'savedGameButtonText01') {
						if (k === 0) {
							fontWeight = 'bold';
							fontSize = 14;
						} else {
							fontWeight = 'italic';
							fontSize = 12;
						}
					}
					
					ctx.font = fontWeight + " " + fontSize + "px sans-serif"; //need to set for text width  measurement to work below
			
					componentRowItemX = componentX;
					componentRowItemY = componentY + (verticalSpacing * (k + 1));			
					componentRowLength = componentContent[k].length; //number of array items representing the row

					//calculate length of row's content
					var rowContentLength = 0;
					for (var m = 0; m < componentRowLength; m++) {
						if (typeof componentContent[k][m] == 'string') {			
							rowContentLength += ctx.measureText(componentContent[k][m]).width;
						} else if (typeof componentContent[k][m] == 'object') {
							rowContentLength += iconWidth;
						}
					}
	
					//now further update fontSize based on initial size length comparison, reduce if necessary to fit
					//var lengthComparison = 1;
					//if (componentWidth < rowContentLength) {
						//lengthComparison = componentWidth / rowContentLength
						//fontSize = fontSize * lengthComparison;
						//ctx.font = fontSize + "px sans-serif";
						//iconWidth = iconWidth * lengthComparison;
					//}
					
					//compare row content width to component width				
					//var rowMargin = (componentWidth - (rowContentLength * lengthComparison)) / 2;	
					var rowMargin = (componentWidth - rowContentLength) / 2;	
					componentRowItemX += rowMargin;
					
					//draw row's content
					for (var l = 0; l < componentRowLength; l++) {
						if (typeof componentContent[k][l] == 'string') {										
							//ctx.strokeText(componentContent[k][l],componentRowItemX,componentRowItemY + (fontSize / 2));
							ctx.fillText(componentContent[k][l],componentRowItemX,componentRowItemY + (fontSize / 2));	//FIXME 
							componentRowItemX += ctx.measureText(componentContent[k][l]).width;	
					
						} else if (typeof componentContent[k][l] == 'object') { //FIXME - add second condition to  confirm it is an icon object
							ctx.drawImage(componentContent[k][l], componentRowItemX, componentRowItemY - (iconWidth / 2), iconWidth, iconWidth);							
							componentRowItemX += iconWidth;
						}
						componentRowItemX += fontSize / 4; //6; //FIXME //spacing
					}
				}
			}
			
			ctx.globalAlpha = 1.0; //reset back
			
	
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