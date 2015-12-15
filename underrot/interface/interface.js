/* Copyright (c) 2015, Brian T. Floyd. FreeBSD License. */
var Interface =  {
	canvasContainer: document.getElementById('canvas-container'),
	tilePixelWidth: 60, //single tile height/width //FIXME - hardcoded - move to environment?
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
    
    	var pauseIcon = new Image();
    	pauseIcon.src = '../underrot/interface/icons/icon-60x60-pause.svg';   	
    	this.uiIcons.pauseIcon = pauseIcon;
    	
    	var menuIcon = new Image();
    	menuIcon.src = '../underrot/interface/icons/icon-60x60-menu.svg';    	
    	this.uiIcons.menuIcon = menuIcon;
    	
    	var healIcon = new Image();
    	healIcon.src = '../underrot/interface/icons/icon-60x60-heal.svg';	    	
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
    	checkmarkIcon.src = '../underrot/interface/icons/icon-60x60-checkmark.svg';    	
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
		
			//offset component positioning and sizing to provide padding in between
			var componentX = componentParameters.x + inset;
			var componentY = componentParameters.y + inset;
			var componentWidth = componentParameters.width - (inset * 2);
			var componentHeight = componentParameters.height - (inset * 2);
			
			var componentBackgroundStyle = componentParameters.backgroundStyle;
			var componentIconBackground = componentParameters.iconBackground;
			var componentTextStyle = componentParameters.textStyle;
			var componentRoundedCorners = componentParameters.roundedCorners;
			var componentTransparency = componentParameters.transparency;
			var componentContent = componentParameters.content;
			var componentLabel = componentParameters.label;
			
			
			//component styling & drawing				
			if (!componentTransparency) {
				componentTransparency = 1.0;
			} else {
				componentTransparency = 0.45;
			}
			
			//label resizing
			var labelSize = 12;
			var labelTopMargin = 5;
			
			if (componentLabel) {
				var labelAdjustment = labelSize + labelTopMargin;
				componentHeight = componentHeight - labelAdjustment;
				componentWidth = componentWidth - labelAdjustment;
				componentX = componentX + (labelAdjustment / 2); //only center horizontally, the vertical offset is needed to display the label itself				
			}	
			
			//component background fill
			if (componentBackgroundStyle === 'button01') {		
				var gradient1 = ctx.createLinearGradient(componentX,componentY,componentX,componentY+componentHeight);
				gradient1.addColorStop("0","#5f5f5f");
				gradient1.addColorStop("1.0","#454545");

				ctx.fillStyle = gradient1;
				//ctx.strokeStyle = gradient1;
			
			} else if (componentBackgroundStyle === 'dark01') {
				ctx.fillStyle = "rgba(0, 0, 0, " + componentTransparency + ")";
				//ctx.strokeStyle = "rgba(0, 0, 0, " + componentTransparency + ")";
				  
			} else if (componentBackgroundStyle === 'light01') {
				ctx.fillStyle = "rgba(160, 160, 160, " + componentTransparency + ")";
				//ctx.strokeStyle = "rgba(160, 160, 160, " + componentTransparency + ")";
			} else if (componentBackgroundStyle === 'icon01') {
				//...
			}
			
			if (componentBackgroundStyle != 'none') {
				
				if (componentIconBackground) {
					//draw icon squared and centered
					ctx.drawImage(componentIconBackground, componentX, componentY, componentWidth, componentHeight);
				
				} else if (componentRoundedCorners) {
				
					var cornerRadius = 10;
					//ctx.lineJoin = "round";
					//ctx.lineWidth = 20; 
					//ctx.strokeRect(componentX+(cornerRadius/2), componentY+(cornerRadius/2), componentWidth-cornerRadius, componentHeight-cornerRadius);	
					//ctx.fillRect(componentX+(cornerRadius/2), componentY+(cornerRadius/2), componentWidth-cornerRadius, componentHeight-cornerRadius);
					
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
					ctx.fill();
									
				} else {

					//ctx.strokeRect(componentX, componentY, componentWidth, componentHeight);
					ctx.fillRect(componentX, componentY, componentWidth, componentHeight);
				}
			}
		

			//default text styling
			var fontSize = 18;
			var fontWeight = 'normal';
			ctx.lineWidth = 2;
			ctx.fillStyle = "rgba(255, 255, 255, 1.0)";
			ctx.strokeStyle = "rgba(0, 0, 0, 1.0)";
			
			if (componentLabel) {
				
				ctx.font = "normal" + " " + labelSize + "px sans-serif";
				
				//label margin
				var labelLength = ctx.measureText(componentLabel).width;
				var labelMargin = (componentWidth - labelLength) / 2;
					
				
				//draw label
				ctx.strokeText(componentLabel,componentX + labelMargin,componentY + componentHeight + labelTopMargin + labelSize);//(fontSize / 2));
				ctx.fillText(componentLabel,componentX + labelMargin,componentY + componentHeight + labelTopMargin + labelSize);//(fontSize / 2));	//FIXME 	
			}
			
			if (componentContent) {

				var componentRowsTotal = componentContent.length;
				var verticalSpacing = componentHeight / (componentRowsTotal + 1);
				var iconWidth = Math.min((componentHeight / componentRowsTotal), componentWidth);
				iconWidth *= .6;	
				
				if (componentTextStyle === 'buttonText01') {
					//
				} else if (componentTextStyle === 'headingText01') {
					fontWeight = 'bold';
					fontSize = 24;
				} else if (componentTextStyle === 'headingText02') {
					fontWeight = 'bold';
				}
				
				
				fontSize = fontSize / componentRowsTotal;
				ctx.font = fontWeight + " " + fontSize + "px sans-serif"; //need to set for text width  measurement to work below
				

				var componentRowItemX, componentRowItemY, componentRowLength;
		
				for (var k = 0; k < componentRowsTotal; k++) {
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
					/*var lengthComparison = 1;
					if (componentWidth < rowContentLength) {
						lengthComparison = componentWidth / rowContentLength
						//fontSize = fontSize * lengthComparison;
						//ctx.font = fontSize + "px sans-serif";
						//iconWidth = iconWidth * lengthComparison;
					}*/
					
					//compare row content width to component width				
					//var rowMargin = (componentWidth - (rowContentLength * lengthComparison)) / 2;	
					var rowMargin = (componentWidth - rowContentLength) / 2;	
					componentRowItemX += rowMargin;
					
					//draw row's content
					for (var l = 0; l < componentRowLength; l++) {
						if (typeof componentContent[k][l] == 'string') {										
							ctx.strokeText(componentContent[k][l],componentRowItemX,componentRowItemY + (fontSize / 2));
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