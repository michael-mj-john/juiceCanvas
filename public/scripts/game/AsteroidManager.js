// AsteroidManager.
// Used to spawn and despawn asteroids
// Nothing inherits from this
// Last modified by Eddie 5/7/22

import Manager from "../core/Managers/Manager.js";
import Asteroid from "./Asteroid.js";


export default class AsteroidManager extends Manager{

	// TODO: make singleton
	constructor() {
		if(AsteroidManager.__instance){
			return AsteroidManager.__instance;
		}
		
		super();
		
		AsteroidManager.__instance = this;

		//Instance Variables
		this.__instance = {};

		//Instance Variables
		this.__asteroids = new Array(); //holds asteroids

		//Gameplay Variables
		//Number of large asteroids at level start
		this.__levelStartRocks = 5;

		this.__resetTime = 0;
		this.__resetDelay = 4000; // level reset delay in milliseconds
	}

	levelStart() {

		for ( let i=0; i < this.__levelStartRocks; i++ ) {
			this.spawnAsteroid( 1, "large", Math.random() * 1000, Math.random() * 1000); 
		}

	}

	update() {
		
		if( this.asteroids.length === 0 ) {
			if( this.resetTime === 0 ) {
				this.resetTime = this.gameSession.timeManager.time + this.__resetDelay;
			}
			if( this.gameSession.timeManager.time >= this.resetTime ) {
				this.resetTime = 0;
				this.levelStart();
			}

		}

		for( let i = this.asteroids.length - 1; i >= 0; i-- ) {
			if( this.asteroids[i].update() != null ) {
				this.asteroids.splice(i,1);
			}
		}
	}
	

	// returns true if no asteroids are within 200 units of the center of the screen
	safeToSpawn(x, y) {

		x = this.gameSession.canvasWidth/2;
		y = this.gameSession.canvasHeight/2;

		let centerVec = new p5.Vector(x,y);

		// test each asteroid to see how far it is (x,y) from screen center
		for( let i = this.asteroids.length - 1; i >= 0; i-- ) {
			if( p5.Vector.dist(centerVec, this.asteroids[i].position)  < 200  ) {
				// not safe to spawn/respawn the ship just yet
				return false;
			}
		}

		// no asteroids failed the test, therefore spawning is safe
		return true;

	}
	
	// collide method is used by other entities to check collision with asteroids, e.g.
	// bullets and player ship. collide() is *not* called from inside this class
	collide( gameObject, destroyAsteroids ) {
		// This way handles the edge case of collision detection with multiple asteroids at once
		let collision = false;
		
		// since the array might be shortened, be sure to iterate it backwards
		for( let i = this.asteroids.length - 1; i >= 0; i-- ) {
			if(this.asteroids[i].collide(gameObject)){
				collision = true;
				if(destroyAsteroids){
					this.gameSession.juiceEventManager.addNew("asteroidHit", this.asteroids[i]);
					if( this.asteroids[i].nextType != "none") {
						this.spawnAsteroid(2, this.asteroids[i].nextType, this.asteroids[i].position.x, this.asteroids[i].position.y)
					}
					this.asteroids.splice(i,1);
				}
			}
		}
		return collision;
	}

	// create asteroids 
	// takes number of asteroids to spawn, what type (size) they are, and the x/y coordinates of the spawn point
	spawnAsteroid( asteroidCount, type, x, y ) {
		for( let i=0; i<asteroidCount; i++ ) {
			// if ship is alive, go for it. If this is a reset, make sure it's a safe spawn
			if( this.gameSession.shipManager.ship.shipAlive || this.safeToSpawn() ) {
				this.asteroids.push(new Asteroid(type, x, y));
			}
		}
	}

	render() {
		for( let i=0; i<this.asteroids.length; i++ ) {
			this.asteroids[i].render();
		}
	}

	//getters and setters
	get asteroids() {
		return this.__asteroids;
	}

	get resetTime() {
		return this.__resetTime;
	}

	set resetTime(resetTime) {
		this.__resetTime = resetTime;
	}

}

