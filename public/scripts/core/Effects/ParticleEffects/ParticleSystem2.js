/* 
ParticleSystem2 (to be renamed later)

Instantiates a particle system based on a game event's definition in JuiceSettings.js

***FOR NOW a system can only have one particle definition (but multiple particles obv)***

The hierarchy is:
 Event -> System -> Effect -> Particle

Particle systems will eventually include multiple objects, also data-driven

*/


import GameSession from "../../GameSession.js";
import VectorParticleEffect from "./VectorParticleEffect.js";


export default class ParticleSystem2 {


	constructor( eventName, triggerObject ) {

        this.__gameSession = new GameSession();

        // these two fields are needed for updates in the juiceEventManager
        this.__effectName = "particles";
        this.__active = this.__gameSession.juiceSettings.container[eventName].particles.active; // do we need this? shouldn't it just be 'true'?

        this.__particleEffects = new Array();

		this.__definition = this.__gameSession.juiceSettings.particleSystems[eventName]; // this is an object that contains all the relevant parameters
		this.__triggerObject = triggerObject;

		this.__effectParameters = this.__gameSession.juiceSettings.particleSystems[eventName];

		this.initiateSystem(this.effectParameters, triggerObject);

	}

	finished() {
		if( this.particleEffects.length <= 0 ) { 
			return true;
		}
		else {
			return false;
		}
	}

	// for the moment because a system can have only one effect, this is pretty redundant and simple
	initiateSystem(eventName, triggerObject) {
        console.log("we will make a", eventName);

       	let particleEffectObject = this.particleEffectFactory(eventName,triggerObject);
   		this.particleEffects.push(particleEffectObject);

  	}


	update() {

		for(let i = this.particleEffects.length - 1; i >=0; i-- ){
            if(this.particleEffects[i].finished()){
                this.particleEffects.splice(i, 1);
            }
            else{
                this.particleEffects[i].update();
            }
        }

	}

	render() {
		for(let i = this.particleEffects.length - 1; i >=0; i-- ){
            this.particleEffects[i].render();
        }
	}


	// named as a factory to accommodate a future world of more than just vector particles. For now it's a bit of false advertising
	particleEffectFactory() {

		// pass a single object to the effect, it returns an array of particles single particle
		return new VectorParticleEffect(this.effectParameters, this.triggerObject);

	}



	get particleEffects() {
		return this.__particleEffects;
	}

	get effectName () {
		return "particles";
	}

	get active() {
		return this.__active;
	}

	get definition () {
		return this.__definition;
	}

	get triggerObject() {
		return this.__triggerObject;
	}

	get effectParameters() {
		return this.__effectParameters;
	}


}