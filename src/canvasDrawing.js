var imgStrings = {};

export function drawLine(context, x0, y0, x1, y1, color = "black", width = 1) {
    //	////console.log(x0, y0, x1, y1)
    context.strokeStyle = (color == undefined ? "black" : color);
    context.lineWidth = (width == undefined ? 1 : width);
    context.beginPath();
    context.stroke();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.stroke();
}
export function drawImage(ctx, img, x, y, width=undefined, height=undefined) {
	if(width == undefined){
		ctx.drawImage(img, x, y);
	} else {
		ctx.drawImage(img, x, y, width, height);
	}
}
export function loadImage(string){
	if(string == undefined){
		throw new Error("loadImage undefined");
	}
	if(imgStrings[string] == undefined){
		var im = new Image();
		im.src = require("" + string);
		imgStrings[string] = im;		
	}
}

export function drawImageStr(ctx, string, x, y, width=undefined, height=undefined) {
	if(string == undefined){
		return; 
	}
	if(imgStrings[string] != undefined){
		var im = imgStrings[string]; // already loaded
		drawImage(ctx, im, x , y, width, height);
	} else {
		var im = new Image();
	//	console.log([x,y]);
		im.src = require("" + string);
		imgStrings[string] = im;
		im.onload = function(){
			drawImage(ctx, im, x , y, width, height);
		}
	}
	
	


}
//draws a circle with the given coordinates and color
export function drawCircle(context, x, y, r, color = "black", width = 1) {
    //////console.log(x,y,r)
    context.strokeStyle = (color == undefined ? "black" : color);
    context.lineWidth = (width == undefined ? 1 : width);
    context.beginPath();
    context.arc(x, y, r, 0 * Math.PI, 2 * Math.PI);
    context.stroke();
    var p1 = { x: x, y: y };
    var p2 = { x: x, y: y };
}
//draws a circle with the given coordinates and color
export function drawRectangle(context, tlx, tly, brx, bry, color = "black", width = 1) {
    context.strokeStyle = (color == undefined ? "black" : color);
    context.lineWidth = (width == undefined ? 1 : width);
    context.beginPath();
    context.rect(tlx, tly, brx - tlx, bry - tly);
    context.stroke();
}

export function drawText(context, text_, x, y, width =undefined, color = "black", size = 20) {
    context.font = size + "px Arial";
	if(width == undefined){
		context.fillText(text_, x,y);
	} else{
		context.fillText(text_, x,y,width);
	}
}


