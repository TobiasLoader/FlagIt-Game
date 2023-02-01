var flagIt = function(processingInstance) {
with (processingInstance) {
size(400, 400);
frameRate(30);
// Flag It - Thanks so much for all the vote ups!

// LEADERBOARD - Post a spin-off of your highscore in the Tips and Thanks

// Sorry if you do not appear on the leaderboard yet, I have been very busy with studying recently...

/* 

1. Cameron : 14

2. Aelin FireHearth🍍#TRL : 14

3. joshua irizarry : 11

4. werto2 : 11

5. Billy Martin : 10

*/

// Note: when you are hovered over the Green or Red flag, you are safe from incoming blue blocks... However, you are not safe on the White flags...

// UPDATES:
/*
	disable mouse outside the canvas
	bigger player size
	different sized blue blocks
*/

var playerSize = 7;
var blockSize = 5;

var colours = {
	background : color(253, 253, 254),
	main : color(116, 185, 242),
	mainTrans : color(116, 185, 242,100),
	secondary : color(237, 128, 154)
};

var fonts = {
	title : createFont("Trebuchet MS"),   
	main : createFont("Avenir Next")
};

var startMs = millis();
var ms;
var s;

var w = width;
var h = height;
textAlign(CENTER,CENTER);

var scene = "LOADING";

var score = 0;
var highScore = 0;
var middleCheck = [];
var middleCheckAll = 0;
var play = false;
var lives = 3;

var transitionDown = 0;
var transitioningSecond = false;

var slideScene = 1;
var slideSceneNum = 5;
var hoverDot = false;
var hoveredDot = true;
var slide = false;
var xSlide = 0;
var ySlide = 242;
var maxSpeed = 60;

var clicked = "";
var buttonHover = "";
var buttonClicked = "";

var flagStartEndHover = false;

var startFlags = [];
startFlags.push({x:random(100,300),y:43});
var endFlags = [];
endFlags.push({x:random(100,300),y:360});
var middleFlags = [];
middleFlags.push({x:random(100,300),y:random(100,300)});

var animationBlocks = {
	L : [],
	R : [],
};

var messagesBad = [
	"Ouch !","Oupsy Daisy...","NOOO !","Arggh !","Bother.","Not again !","Well, you got more\nthan me !","But..."
	];
var messageToDisplay = {
	index: "",
	rotation: "",
	x: "",
	y : ""
};
var messageTime=0;

var speech = ["Hope you had\n(or will) have fun !","Thanks for playing!","Bye...","Why are you still\nclicking ?","","Oh, here we go\nagain..."];
var speechScene = 1;

// Credit to Chester Banks for the background pattern code

var textureRects = [];
for (var i = 5; i < width; i += 20){
	for(var j = -20; j < height+20; j += 20){
		textureRects.push({x: i, y: j, br: random(0, 10)});
	}
}

var time = function(){
	ms = millis()-startMs;
	s = ms/1000;
};

var displayMessage = function(fromMessages,messageNeedingDislayed){
	fill(colours.background);
	textFont(fonts.main,20);
	pushMatrix();
	translate(messageNeedingDislayed.x,messageNeedingDislayed.y);
	rotate(radians(messageNeedingDislayed.rotation));
	text(fromMessages[messageNeedingDislayed.index],0,0);
	popMatrix();
};
var speechBubble = function(){
	fill(colours.background);
	stroke(colours.secondary);
	strokeWeight(1);
	rect(160,200,200,115,5);
	triangle(163,315,140,310,160,297);
	noStroke();
	triangle(165,315,144,310,161,297);
	fill(140, 140, 140);
	textFont(fonts.main,20);
	text(speech[speechScene-1],263,259);
};

var collision = function(block){
	if (mouseX+playerSize > block.x && mouseX < block.x+block.size && mouseY+playerSize > block.y && mouseY < block.y+block.size){
		lives-=1;
		middleCheckAll=false;
		middleCheck=[]; 
		play=false;
		messageToDisplay.index = round(random(0,7));
		messageToDisplay.rotation = random(-10,10);
		messageToDisplay.x = mouseX;
		messageToDisplay.y = mouseY;
		messageTime=s;
	}
};

var transition = function(){
	noStroke();
	fill(colours.main);
	rect(0,0,w,transitionDown);
	stroke(colours.background);
	strokeWeight(2);
	for (var y=20; y<h; y+=80){
		for(var x=10;x<w; x+=40){
			line(x,transitionDown-y,x+20,transitionDown-y);
		}
	}
	strokeWeight(1);
};
var transitionFirst = function(transitionTo){
	if (transitionDown<h){
		transitionDown+=20-6*(transitionDown/h);
	} else {
		transitioningSecond = true;
		scene = transitionTo;
	}
	transition();
};
var transitionSecond = function(){
	if (transitioningSecond){
		if (transitionDown>0){
			transitionDown-=20-6*(transitionDown/h);
		} else {
			transitionDown = 0;
			clicked = "";
			transitioningSecond = false;   
		}
		transition();
	}
};
var transitionCodeForScene = function(currentScene,nextScene){
	if (clicked===currentScene){
		transitionFirst(nextScene);    
	}
};

var textShadow = function(TEXT,x,y,diff){
	fill(colours.mainTrans);
	text(TEXT,x-diff,y+diff);
	fill(colours.main);
};

var cornerLines = function(){
	stroke(colours.main);
	strokeWeight(1);
	for (var i=1;i<=2;i+=1){line(0,h/(i*16),w/(i*16),0);}
	for (var i=1;i<=2;i+=1){line(w,h/(i*16),w-w/(i*16),0);}
	for (var i=1;i<=2;i+=1){line(w,h-h/(i*16),w-w/(i*16),h);}
	for (var i=1;i<=2;i+=1){line(0,h-h/(i*16),w/(i*16),h);}
};
var backgroundPattern = function(){
	background(colours.background);
	noStroke();
	for(var i in textureRects){
		fill(0, 0, 0, textureRects[i].br);
		rect(textureRects[i].x, textureRects[i].y, 20, 20);
	}
	cornerLines();
};
var backgroundAnimation = function(animationBlocksExample,colour){
	fill(colour);
	noStroke();
	for (var i in animationBlocksExample){
		rect(animationBlocksExample[i].x,animationBlocksExample[i].y,animationBlocksExample[i].size,animationBlocksExample[i].size);
		animationBlocksExample[i].x += animationBlocksExample[i].speed;
		switch (animationBlocksExample){
			case animationBlocks.L : if (animationBlocksExample[i].x>w){
										animationBlocksExample[i].x = 0;
									} break;
			case animationBlocks.R : if (animationBlocksExample[i].x<0){
										animationBlocksExample[i].x = w;
									} break;
		}
		if (play&&!flagStartEndHover){
			collision(animationBlocksExample[i]);
		}
	}
};
var backgroundAnimationBoth = function(colour){
	backgroundAnimation(animationBlocks.L,colour);
	backgroundAnimation(animationBlocks.R,colour);
};
var addBlocks = function(){
	animationBlocks.L.push({x: random(-w,0), y: random(0,h), speed: random((score/2)+1, (score/2)+2), size: random(blockSize-1,blockSize+1)});
	animationBlocks.R.push({x: random(w,2*w), y: random(0,h), speed: random(-((score/2)+2), -((score/2)+1)), size: random(blockSize-1,blockSize+1)});
};
var initialiseBlocks = function(){
	animationBlocks.L = [];
	animationBlocks.R = [];
	for (var i = 0; i < height; i += 40){
		animationBlocks.L.push({x: random(-w,0), y: i, speed: random(1, 3), size: random(blockSize-1,blockSize+1)});
		animationBlocks.R.push({x: random(w,2*w), y: i-10, speed: random(-3, -1), size: random(blockSize-1,blockSize+1)});
	}
};
initialiseBlocks();

var exampleDots = function(x,y,dotNum,dotSize,extraSize,extraDist,relTimeBig){
	this.x = x;
	this.y = y;
	this.dotNum = dotNum;
	this.dotSize = dotSize;
	this.extraSize = extraSize;
	this.extraDist = extraDist;
	this.relTimeBig = relTimeBig;
};
var dots = {
	lineDots : new exampleDots(284,136,3,3,3,0,3),
	polygonDots : new exampleDots(w/2,2*h/3,9,7,4,5,3),
};
var dotsInLine = function(ex){
	noStroke();
	for (var i=0; i<ex.dotNum; i+=1){
		var X = ex.x+((ex.dotSize+ex.extraSize+ex.extraDist)*2*(((ex.dotNum-1)/2)-i));
		var expand = (ex.extraSize*sin(radians((millis()/ex.relTimeBig)+((360/ex.dotNum)*i))));
		ellipse(X,ex.y,ex.dotSize,ex.dotSize);
		ellipse(X,ex.y,ex.dotSize+expand,ex.dotSize+expand);
	}
};
var dotsInPolygon = function(ex){
	noStroke();
	for (var i=0; i<ex.dotNum; i+=1){
		var X = ex.x+((ex.dotSize+ex.extraSize+ex.extraDist)/4*ex.dotNum*cos(radians(i*(360/ex.dotNum))));
		var Y = ex.y+((ex.dotSize+ex.extraSize+ex.extraDist)/4*ex.dotNum*sin(radians(i*(360/ex.dotNum))));
		var expand = (ex.extraSize*sin(radians((millis()/ex.relTimeBig)+((360/ex.dotNum)*i))));
		ellipse(X,Y,ex.dotSize,ex.dotSize);
		ellipse(X,Y,ex.dotSize+expand,ex.dotSize+expand);
	}
};

var button = function(TEXT,X,Y,SIZE,TextSize){
	var letterNum = 0;
	for (var letter in TEXT){
		letterNum+=1;
	}
	if (!TextSize){
		TextSize = (SIZE/3)-(2*letterNum);
	}
	
	pushMatrix();
	translate(X,Y);
	if (dist(mouseX,mouseY,X,Y)<SIZE/2){
		buttonHover=TEXT;
		cursor(HAND);
		rotate(radians(10*sin(radians(millis()/2))));
	}
	textFont(fonts.main,TextSize);
	fill(colours.background);
	stroke(colours.main);
	ellipse(0,0,SIZE,SIZE);
	fill(colours.main);
	text(TEXT,0,0);
	popMatrix();
	
};

var Flag = function(x,y){
	this.x = x;
	this.y = y;
};
Flag.prototype.pole = function() {
	stroke(105,105,105);
	strokeWeight(2);
	line(this.x-6,this.y-9,this.x-6,this.y+11);
};
Flag.prototype.circle = function() {
	if ((play&&scene==="GO")||(scene==="HELP")){
		stroke(207, 207, 207);
	} else if (scene==="GO"){
		stroke(colours.background);
	}
	strokeWeight(1);
	ellipse(this.x,this.y,40,40);
};
var StartFlag = function(x,y){
	Flag.call(this,x,y);
};
StartFlag.prototype = Object.create(Flag.prototype);
StartFlag.prototype.draw = function(withPole,withCircle) {
	if (play){noFill();}
	else {fill(255, 255, 255);}
	if (withCircle){this.circle();}
	if (withPole){this.pole();}
	strokeWeight(1);
	fill(173, 207, 72);
	strokeWeight(1);
	rect(this.x-6,this.y-9,15,10);
};
var EndFlag = function(x,y){
	Flag.call(this,x,y);
};
EndFlag.prototype = Object.create(Flag.prototype);
EndFlag.prototype.draw = function(withPole,withCircle) {
	noFill();
	if (withCircle){this.circle();}
	if (withPole){this.pole();}
	fill(237, 128, 154);
	strokeWeight(1);
	rect(this.x-6,this.y-9,15,10);
};
var MiddleFlag = function(x,y){
	Flag.call(this,x,y);
};
MiddleFlag.prototype = Object.create(Flag.prototype);
MiddleFlag.prototype.draw = function(withPole,withCircle) {
	noFill();
	if (withCircle){this.circle();}
	if (withPole){this.pole();}
	fill(255, 255, 255);
	strokeWeight(1);
	rect(this.x-6,this.y-9,15,10);
};

var slideContent = function(X,Y,theScene){
	var startFlag = new StartFlag(266+X,Y);
	var middleFlag = new MiddleFlag(266+X,Y);
	var endFlag = new EndFlag(245+X,Y);
	rectMode(CENTER);
	textFont(fonts.title,21);
	stroke(colours.main);
	fill(colours.background);
	rect(200+X,Y,249,150,10);
	noFill();
	rectMode(LEFT);
	textFont(fonts.main,23);
	switch (theScene){
		case 1 : 
			fill(150, 150, 150);
			text("Hover Over :",170+X,Y);
			startFlag.draw(true,true);
			break;
		case 2 : 
			fill(150, 150, 150);
			text("You are :",170+X,Y);
			fill(colours.secondary);
			noStroke();
			rect(X+231,Y-7,20,20);
			break;
		case 3 : 
			fill(150, 150, 150);
			text("Avoid :",170+X,Y);
			fill(colours.main);
			noStroke();
			rect(X+231,Y-7,20,20);
			break;
		case 4 : 
			fill(150, 150, 150);
			text("Collect All :",170+X,Y);
			middleFlag.draw(true,true);
			break;
		case 5 : 
			fill(150, 150, 150);
			text("Reach :",170+X,Y);
			endFlag.draw(true,true);
			break;
	}
};
var slideDots = function(y,dotNum,size,coloursUsed) {
	stroke(coloursUsed[3]);
	strokeWeight(1);
	for ( var i=1; i<(dotNum+1); i+=1){
		fill(coloursUsed[0]);
		if (dist((width/2)-((((dotNum+1)*20)/2)*size)+(i*20*size),y-(10*(size-1)),mouseX,mouseY)<(10*size)/2){
			fill(coloursUsed[1]);
			hoverDot = i;
			cursor(HAND);
		}
		ellipse((width/2)-((((dotNum+1)*20)/2)*size)+(i*20*size),y-(10*(size-1)),(10*size),(10*size));
	}
	
	noStroke();
	fill(coloursUsed[2]);
	if (!slide){
		ellipse((width/2)-((((dotNum+1)*20)/2)*size)+(slideScene*20*size),y-(10*(size-1)),(10*size),(10*size)); 
	}
};
var sliding = function(){
	if (hoveredDot<slideScene && xSlide<width){
		if (xSlide<width/2){
			xSlide+=(maxSpeed*((2*xSlide)/width)+0.5);
		} else {
			xSlide+=(maxSpeed*(width/(2*xSlide))-(maxSpeed/3));
		}
		slideContent(-width+xSlide,ySlide,hoveredDot);
	}
	else if (hoveredDot>slideScene && xSlide>-width){
		if (xSlide>-width/2){
			xSlide-=(maxSpeed*((2*xSlide)/-width)+0.5);
		} else {
			xSlide-=(maxSpeed*(-width/(2*xSlide))-(maxSpeed/3));
		}
		slideContent(width+xSlide,ySlide,hoveredDot);
	}
	else {
		slideScene = hoveredDot;
		xSlide=0;
		hoveredDot = false;
		slide = false;
	}
};
var slider = function(sliderY,slideSceneNum,slideSize,colours,slide){
	slideDots(sliderY,slideSceneNum,slideSize,colours);
	if (slide){
		sliding();   
	}
};

var player = function(){
	fill(colours.secondary);
	strokeWeight(1);
	stroke(colours.background);
	rect(mouseX,mouseY,playerSize,playerSize);
};
var playerBig = function(){
	fill(colours.secondary);
	noStroke();
	rect(50,250,76,76,2);
	stroke(255, 255, 255);
	strokeWeight(6);
	point(74,279);
	point(102,279);
	noFill();
	strokeWeight(3);
	if (scene==="THANKS"){
		if (speechScene===1||speechScene===2||speechScene===3){
			arc(89,298,37,19,radians(30),radians(150));
		} else if (speechScene===4) {
			line(75,298,100,298);
		} else if (speechScene===6) {
			ellipse(92,303,16,8);
		}
	}
	
};

var reShuffle = function(theStart,theMiddles,theEnd){
	startFlags.push({x:random(100,300),y:43});
	endFlags.push({x:random(100,300),y:360});
	middleFlags.push({x:random(100,300),y:random(100,300)});
	middleCheckAll=false;
	middleCheck=[];
};
var hoverOverStart = function(theStart){
	if (dist(mouseX,mouseY,theStart.x,theStart.y)<(40/2)){
		cursor(HAND);
		play=true;
		flagStartEndHover=true;
	}
	if (!play){
		fill(colours.mainTrans);
		rect(0,0,w,h);    
		strokeWeight(2);
		stroke(255, 255, 255);
		noFill();
		arc(theStart.x+42,theStart.y+10,50,50,radians(62),radians(132));
		line(theStart.x+25,theStart.y+28,theStart.x+33,theStart.y+26);
		line(theStart.x+25,theStart.y+28,theStart.x+26,theStart.y+36);
		strokeWeight(1);
	} else {
		cursor("none");
	}
};
var hoverOverMiddles = function(theMiddles){
	for (var i in theMiddles){
		if (dist(theMiddles[i].x,theMiddles[i].y,mouseX,mouseY)<40/2){
			middleCheck[i] = 1;
		}
		if (middleCheck[i]){
			noFill();
			stroke(colours.secondary);
			ellipse(theMiddles[i].x,theMiddles[i].y,35,35);    
		}
	}
};
var hoverOverEnd = function(theEnd,theMiddles){
	if (dist(theEnd.x,theEnd.y,mouseX,mouseY)<40/2){
		middleCheckAll = 1;
		flagStartEndHover=true;
		for (var i in theMiddles){
			if (!middleCheck[i]){
				middleCheckAll = 0;
			}  
		}
	}
	if (middleCheckAll){
		score+=1;
		reShuffle();
		addBlocks();
		play = false;
	}
};

var loading = function(){
	fill(colours.main);
	dotsInPolygon(dots.polygonDots);
	textFont(fonts.title,35);
	text("LOADING",193,125);
	textShadow("LOADING",193,125,2);
	fill(colours.main);
	dotsInLine(dots.lineDots);
	if (s>1){
		transitionFirst("MENU");
	}
};
var menu = function(){
	var startFlag = new StartFlag(60,36);
	var middleFlag = new MiddleFlag(319,219);
	var endFlag = new EndFlag(144,387);

	score=0;
	fill(colours.main);
	textFont(fonts.title,67);
	text("FLAG IT ?",200,125);
	textShadow("FLAG IT ?",200,125,3);
	
	button("GO",200,300,100);
	button("HELP",90,270,75);
	button("THANKS",310,270,75);
	
	noFill();
	stroke(colours.main);
	arc(55,64,50,30,radians(200),radians(340));
	startFlag.draw(true,false);
	middleFlag.draw(true,false);
	endFlag.draw(true,false);
	
	if (buttonClicked){
		transitionCodeForScene(scene,buttonClicked);
	}
	transitionSecond();
};
var help = function(){
	fill(colours.main);
	textFont(fonts.title,60);
	text("HELP !",200,110);
	textShadow("HELP !",200,110,3);
	
	button("⇠",40,40,40,19);
	
	slideContent(xSlide,ySlide,slideScene);
	
	slider(369,slideSceneNum,1.6,[color(255, 255, 255),color(253, 254, 255),color(182, 212, 237),color(132, 184, 227)],slide);
	
	if (buttonClicked==="⇠"){
		transitionCodeForScene(scene,"MENU");
	}
	transitionSecond();
};
var thanks = function(){
	fill(colours.main);
	textFont(fonts.title,50);
	text("~ THANKS ~",200,118);
	textShadow("~ THANKS ~",200,118,3);
	
	button("⇠",40,40,40,19);
	
	playerBig();
	speechBubble();
	
	if (buttonClicked==="⇠"){
		transitionCodeForScene(scene,"MENU");
	}
	transitionSecond();
};
var go = function(){
	var theStart = new StartFlag(startFlags[score].x,startFlags[score].y);
	var theEnd = new EndFlag(endFlags[score].x,endFlags[score].y);
	var theMiddles = [];
	for (var i in middleFlags){
		theMiddles.push(new MiddleFlag(middleFlags[i].x,middleFlags[i].y));
	}
	
	hoverOverStart(theStart);
	if (play){
		hoverOverMiddles(theMiddles);
		hoverOverEnd(theEnd,theMiddles);
	}
	
	if (s>(messageTime+1)){
		messageToDisplay.index="";
	}
	
	if (!flagStartEndHover&&play){
		backgroundAnimationBoth(colours.main);
	}
	if (flagStartEndHover&&play){
		backgroundAnimationBoth(colours.mainTrans);
	}
	
	fill(colours.main);
	textFont(fonts.title,60);
	
	button("⇠",40,40,40,19);
	button(score,360,40,40,19);
	
	for (var i=0; i<lives; i+=1){
		fill(247, 247, 247);
		bezier(30+25*i, 363, 25+25*i, 355, 13+25*i, 366, 30+25*i, 379);
		bezier(30+25*i, 363, 35+25*i, 355, 47+25*i, 366, 30+25*i, 379);
	}
	
	theStart.draw(true,true);
	theEnd.draw(true,true);
	for (var i in theMiddles){
		theMiddles[i].draw(true,true);        
	}
	
	if (messageToDisplay.index!==""){
		displayMessage(messagesBad,messageToDisplay);
	}
		
	player();
	
	if (!lives){
		transitionFirst("GAME OVER");   
	}
	if (buttonClicked==="⇠"){
		transitionCodeForScene(scene,"MENU");
	}
	transitionSecond();
};
var gameOver = function(){
	if (score>highScore){
		highScore = score;
	}
	
	fill(colours.main);
	textFont(fonts.title,35);
	pushMatrix();
	translate(200,135);
	rotate(radians(-3));
	text("\" BETTER LUCK\nNEXT TIME \"",0,0);
	textShadow("\" BETTER LUCK\nNEXT TIME \"",0,0,2);
	popMatrix();
	
	textFont(fonts.main,32);
	text("SCORE : " +score,200,267);

	textFont(fonts.main,20);
	text("HIGH SCORE : " +highScore,200,301);
	noFill();
	stroke(colours.mainTrans);
	rect(100,232,200,100);
	
	button("⇠",40,40,40,19);
	
	play = false;
	lives = 3;
	startFlags = [];
	middleFlags = [];
	endFlags = [];
	
	if (buttonClicked==="⇠"){
		reShuffle();
		initialiseBlocks();
		transitionCodeForScene(scene,"MENU");
	}
	transitionSecond();
};
var whichScenes = function(theScene) {
	if (!play){
		backgroundAnimationBoth(colours.mainTrans);    
	}
	switch (theScene) {
		case "LOADING": loading(); break;
		case "MENU": menu(); break;
		case "HELP": help(); break;
		case "THANKS": thanks(); break;
		case "GO": go(); break;
		case "GAME OVER": gameOver(); break;
	}
};

draw = function() {
	cursor("");
	buttonHover = "";
	flagStartEndHover=false;
	hoverDot = false;
	time();
	backgroundPattern();
	whichScenes(scene);
};
mouseClicked = function(){
	if (transitionDown<=0){
		clicked = scene;
	}
	buttonClicked = buttonHover;
	if (scene==="HELP"){
		if (hoverDot&&!slide){
			hoveredDot = hoverDot;
			slide = true;
		}    
	}
	if (scene==="THANKS" && !buttonHover){
		if (speechScene<6){
			speechScene+=1;
		} else {
			speechScene=1;
		}
	}
};

mouseOut = function(){
	if (scene === "GO"){
		middleCheckAll=false;
		middleCheck=[];
		play=false;
	}
};
}};

var canvas = document.getElementById("flagit"); 
console.log(canvas);
var processingInstance = new Processing(canvas, flagIt); 