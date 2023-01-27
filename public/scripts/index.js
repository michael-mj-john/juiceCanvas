import GameSession from "./core/GameSession.js";
import GameState from "./game/states/GameState.js";
import LoadingState from "./game/states/LoadingState.js";
import ParticleSystem from "./core/Effects/ParticleEffects/ParticleSystem.js";
import ExplosionSystem from "./core/Effects/ParticleEffects/ExplosionSystem.js";

//import p5 from "./p5/p5.js";
//This is our global instance of P5. We will save it to our settings singleton for future access.

/**TODOS:
Fix resize windows

 */
//Instantiate our Game Session - this will be our parent for all game data.
let gameSession = new GameSession();

//Define how our P5 sketch will look. Treat this as the "Main".
var juiceteroids = function (p) {

	p.preload = function() {
		//Load any assets or libraries
	}

	p.setup = function () {
		//get width and height of div
		let canvasDiv = document.getElementById('canvas');
		//look for canvasDiv and get style to compute width
		let canvasStyle = canvasDiv.currentStyle || window.getComputedStyle(canvasDiv); 
		let canvasWidth = parseFloat(canvasStyle.width);
		let canvasPadding = parseFloat(canvasStyle.paddingLeft) + parseFloat(canvasStyle.paddingRight);
		let canvasBorder = parseFloat(canvasStyle.borderLeftWidth) + parseFloat(canvasStyle.borderRightWidth);

/* borrowed from sam, should test
		//Set canvas to browser size
		gameSession.canvasWidth = window.innerWidth;
		gameSession.canvasHeight = window.innerHeight;

		//instantiate canvas and indicate parent div
		var canvas = p.createCanvas(window.innerWidth, window.innerHeight);
		canvas.parent("canvas");
*/

		//look for height of canvas div, make juice div same 
		let juiceDiv = document.getElementById('juice-menu');
		let canvasEl = document.getElementById('defaultCanvas0');
		juiceDiv.style.height = canvasEl.style.height;

		//save canvas reference to gameSession
		gameSession.canvas = canvas;

		//Instantiate all relevant game states and add them to the session.
		let gameState = new GameState();
		gameSession.addStateToGame(gameState);

		//Library loading and camera initialization (TODO: Move to preload?)
		let loadingState = new LoadingState();
		gameSession.addStateToGame(loadingState);

		//Set initial game state as loading, call setup method
		gameSession.setCurrentState(loadingState);

		//Time scale management
		gameSession.timeManager.timeScale = 1;
		gameSession.timeManager.frameRate = 60;
		gameSession.timeManager.start();

		//P5 configurations
		p.frameRate(60);
		p.imageMode(p.CENTER);
	}

	//core update function of the game
	p.draw = function(){

		//Call managers and states to update each frame. 
		gameSession.timeManager.update();
		gameSession.currentState.update();

		// All updates first
		gameSession.bulletManager.update();
		gameSession.asteroidManager.update();
		gameSession.shipManager.ship.update();
		gameSession.juiceEventManager.update();

		//TODO: Move to individual classes and use an image
		p.background(p.color(gameSession.backgroundColor)); 
		gameSession.bulletManager.render();
		gameSession.shipManager.ship.render();
		gameSession.asteroidManager.render();
		gameSession.particleManager.render();
		gameSession.currentState.render();

		if( gameSession.flashColor != 0 ) {
			p.fill(gameSession.flashColor);
			p.rect(0,0, gameSession.canvasWidth, gameSession.canvasHeight);
		}

	//implement your controls inside of your specific state.
	p.mousePressed = function(){
		//call gameState code here as needed.
	}

    p.keyPressed = function(){
		//call gameState code here as needed.
	}

    p.keyReleased = function(){
		//call gameState code here as needed.
	}

    p.keyTyped = function(){
		//call gameState code here as needed.
	}

    p.keyIsDown = function(){
		//call gameState code here as needed.
	}

    p.mouseMoved = function(){
		//call gameState code here as needed.
	}

    p.mouseDragged = function(){
		//call gameState code here as needed.
	}

    p.mousePressed = function(){
		//call gameState code here as needed.
	}

    p.mouseReleased = function(){
		if(gameSession.currentState.mouseReleased){
			gameSession.currentState.mouseReleased();
		}
	}

    p.mouseClicked = function(){
		//call gameState code here as needed.
	}

    p.doubleClicked = function(){
		//call gameState code here as needed.
	}

    p.mouseWheel = function(){
		//call gameState code here as needed.
	}

    p.requestPointerLock = function(){
		//call gameState code here as needed.
	}

    p.exitPointerLock = function(){
		//call gameState code here as needed.
	}

		// *** CHEAT CODES/DEBUG FEATURES *** //

		// cheat code to switch eyeballs on and off
		if( p.key === 'g') {
            let eyeBallFlag = gameSession.juiceSettings.container.eyeBallsOnAsteroids.eyeBalls.active;
            eyeBallFlag = !eyeBallFlag;
			gameSession.juiceSettings.updateJuice("eyeBallsOnAsteroids", "eyeBalls", "active", eyeBallFlag);
		}
		
		// Test time scale effects on sounds
		if (p.key === 'i') {
			gameSession.timeManager.timeScale = 0.1;
		}
		if (p.key === 'o') {
			gameSession.timeManager.timeScale = 1;
		}
		if (p.key === 'p') {
			gameSession.timeManager.timeScale = 2;
		}

		//Test SoundObject switching on bullet sound with one alternate
		if (p.key === 'i') {
			gameSession.soundManager.changeBullet(1);
		}
		if (p.key === 'o') {
			gameSession.soundManager.changeBullet(0);
		}
	}

	p.windowResized = function () {
		let canvasDiv = document.getElementById('canvas');

		//look for canvasDiv and get style to compute width
		let canvasStyle = canvasDiv.currentStyle || window.getComputedStyle(canvasDiv); 
		let canvasWidth = parseFloat(canvasStyle.width);
		let canvasPadding = parseFloat(canvasStyle.paddingLeft) + parseFloat(canvasStyle.paddingRight);
		let canvasBorder = parseFloat(canvasStyle.borderLeftWidth) + parseFloat(canvasStyle.borderRightWidth);

		gameSession.canvasWidth = canvasWidth - canvasPadding - canvasBorder;
		gameSession.canvasHeight = (p.windowHeight) * 0.8; //MAGIC NUMBER: vertical ratio the canvas should be to the header/footer.

		//Rescale game to match window
		p.resizeCanvas(gameSession.canvasWidth, gameSession.canvasHeight);
		
		//look for height of canvas div, make juice div same 
		let juiceDiv = document.getElementById('juice-menu');
		let canvasEl = document.getElementById('defaultCanvas0');
		juiceDiv.style.height = canvasEl.style.height;

	}
}

//Instantiate P5 and attach it to our gameSession instance
gameSession.p5 = new p5(juiceteroids, 'canvas');
gameSession.shipManager.createShip();
  
// create gameplay managers for asteroids and bullets. Eventually intend to move this into GameSession once all the reference issues are sorted out. 
//var colorFlashManager = new ColorFlashManager();
var oldJetSmokeParticleSystem = new ParticleSystem(null, null, null, 10);
var explosionSystem = new ExplosionSystem("BulletExplosion", null, null, null, 20);
  
gameSession.asteroidManager.levelStart();

