/* JuiceEvent Manager
takes a juice event, uses factory pattern to instantiate the correct effect, 
manages updates and juice buffers

Created 6/15/22 by MJ

*/

import Manager from "./Manager.js";
import ScreenShakeEffector from "../Effects/ScreenShake/ScreenShakeEffector.js";
import ColorFlashEffector from "../Effects/ColorFlash/ColorFlashEffector.js";
import ParticleSystem2 from "../Effects/ParticleEffects/ParticleSystem2.js";
import TimeSlowEffector from "../Effects/TimeEffects/TimeSlowEffector.js";

export default class JuiceEventManager extends Manager {

	constructor() {

		// singleton constructor
		if (JuiceEventManager.__instance) {
            return JuiceEventManager.__instance;
        }
		
		super();
		
        JuiceEventManager.__instance = this;

        this.__effectors = new Array();
        // array of ints to hold number of effects currently in play. Avoids inappropriate stacking of 
        // certain effects. 
        this.__effectSemaphors = [];

        if( this.gameSession.verbose === true ) {
	        console.log("juice event Manager created successfully");
	    }

	}

	update() {

	    for(let i = this.effectors.length - 1; i >=0; i-- ){
            if(this.effectors[i].finished()){
                this.effectSemaphors[this.effectors[i].effectName] = false;
                this.effectors.splice(i, 1);
            }
            else{
                this.effectors[i].update();
            }
        }
    }

    render() {

	    for(let i = this.effectors.length - 1; i >=0; i-- ){
            this.effectors[i].render();
        }
    }


	//add new effect (push onto array)
	//interface is string, object. String is required, object is optional
	addNew(eventName, triggerObject) {

        // ensure that this event exists
        if( eventName in this.gameSession.juiceSettings.container) {
            for( let effectName in this.gameSession.juiceSettings.container[eventName] ) {
            	if( this.gameSession.juiceSettings.container[eventName][effectName].active === true ) {
    	        	let effectObject = this.newEventFactory(eventName,effectName,triggerObject);
            		this.effectors.push(effectObject);
            		this.effectSemaphors[effectName] = true;
            	}
            }
        }
        else {
            console.log("error: " + eventName + " event is not defined in juiceSettings");
        }

	}

	// factory function for various effect types
	// object is optionally passed in case its X/Y is important e.g. for particle effects
	newEventFactory(eventName, effectName, triggerObject) {

		switch(effectName) {
			case "shake":
				return new ScreenShakeEffector(eventName);
				break;
			case "colorFlash":
				return new ColorFlashEffector(eventName);
				break;
			case "particles":
				return new ParticleSystem2(eventName,triggerObject);
				break;
			case "timeSlow":
				console.log("slowed time");
				return new TimeSlowEffector(eventName);
				break;
			default:
				console.log("error creating effect: " + eventName + " " + effectName);
				return false;
		}
	}

	// getters/setters
	get effectors() {
		return this.__effectors;
	}

	set effectors(effectors) {
		this.__effectors = effectors;
	}

	get effectSemaphors () {
		return this.__effectSemaphors;
	}

	set effectSemaphors(effectSemaphor) {
		this.__effectSemaphors = effectSemaphors;
	}

}
