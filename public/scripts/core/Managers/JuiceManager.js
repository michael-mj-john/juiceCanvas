/** Manages how we reference elements from the DOM (Juice Menu) to control
 * key game elements.
 * 
 * 1. Get all Juice HTML elements.
 * 2. Create Listeners for those Juice HTML elements.
 * 3. Provide hooks into different managers to change juice elements
 * 
 * TODOS:
 * Automated Testing
 */

import GameSession from "../GameSession.js";
import Manager from "./Manager.js";

export default class JuiceManager extends Manager {

    constructor() {
        super();

        //Collect Juice Menu HTML references and attach listeners        
        
        this.__invincibilityToggle = document.getElementById("invincibility");
        this.invincibilityToggle.addEventListener("change", this.invincibilityToggleFunction);
        this.invincibilityToggle.gameSession = this.gameSession;       
        
        this.__deathShakeType = document.getElementById("deathShakeSelect");
        this.deathShakeType.addEventListener("change", this.deathShakeTypeFunction);
        this.deathShakeType.gameSession = this.gameSession;

        this.__deathShakeIntensity = document.getElementById("deathShakeIntensity");
        this.deathShakeIntensity.addEventListener("change", this.deathShakeIntensityFunction);
        this.deathShakeIntensity.gameSession = this.gameSession;

        this.__deathShakeDuration = document.getElementById("deathShakeDuration");
        this.deathShakeDuration.addEventListener("change", this.deathShakeDurationFunction);
        this.deathShakeDuration.gameSession = this.gameSession;

/* temporarily removing to make room in the menu
        this.__bulletHitShakeToggle = document.getElementById("bulletHitShake");
        this.bulletHitShakeToggle.addEventListener("change", this.bulletHitShakeToggleFunction);
        this.bulletHitShakeToggle.gameSession = this.gameSession;
        
        this.__bulletHitShakeType = document.getElementById("bulletHitShakeSelect");
        this.bulletHitShakeType.addEventListener("change", this.bulletHitShakeTypeFunction);
        this.bulletHitShakeType.gameSession = this.gameSession;

        this.__bulletHitShakeIntensity = document.getElementById("bulletHitShakeIntensity");
        this.bulletHitShakeIntensity.addEventListener("change", this.bulletHitShakeIntensityFunction);
        this.bulletHitShakeIntensity.gameSession = this.gameSession;
*/

        this.__bulletHitFlashColor = document.getElementById("bulletHitFlashColor");
        this.bulletHitFlashColor.addEventListener("change", this.bulletHitFlashColorFunction);
        this.bulletHitFlashColor.gameSession = this.gameSession;

        this.__bulletHitFlashFade = document.getElementById("bulletHitFlashFade");
        this.bulletHitFlashFade.addEventListener("change", this.bulletHitFlashFadeFunction);
        this.bulletHitFlashFade.gameSession = this.gameSession;

// Asteroid Hit Particles
        this.__asteroidHitParticleType = document.getElementById("asteroidHitParticleType");
        this.asteroidHitParticleType.addEventListener("change", this.asteroidHitParticleTypeFunction);
        this.asteroidHitParticleType.gameSession = this.gameSession;
        
        this.__asteroidHitParticlePattern = document.getElementById("asteroidHitParticlePattern");
        this.asteroidHitParticlePattern.addEventListener("change", this.asteroidHitParticlePatternFunction);
        this.asteroidHitParticlePattern.gameSession = this.gameSession;

        this.__asteroidHitParticleCount = document.getElementById("asteroidHitParticleCount");
        this.asteroidHitParticleCount.addEventListener("change", this.asteroidHitParticleCountFunction);
        this.asteroidHitParticleCount.gameSession = this.gameSession;

        this.__asteroidHitParticleVelocity = document.getElementById("asteroidHitParticleVelocity");
        this.asteroidHitParticleVelocity.addEventListener("change", this.asteroidHitParticleVelocityFunction);
        this.asteroidHitParticleVelocity.gameSession = this.gameSession;

        this.__asteroidHitParticleVelocityRandom = document.getElementById("asteroidHitParticleVelocityRandom");
        this.asteroidHitParticleVelocityRandom.addEventListener("change", this.asteroidHitParticleVelocityRandomFunction);
        this.asteroidHitParticleVelocityRandom.gameSession = this.gameSession;

    }
    
     invincibilityToggleFunction() {
        let inputStatus = this.checked;
        this.gameSession.juiceSettings.updateJuice("cheats","ship","invincibility",inputStatus);
     }

     deathShakeTypeFunction() {
        let selected = this.value;
        if( selected === "none") {
            this.gameSession.juiceSettings.updateJuice("destroyShip","shake","active",false);
        }
        else {
            this.gameSession.juiceSettings.updateJuice("destroyShip","shake","form",selected);
        }
     }

     deathShakeIntensityFunction() {
        let range = this.value * .01;  // convert to a float between 0 and 1
        this.gameSession.juiceSettings.updateJuice("destroyShip","shake","intensity",range);
     }

     deathShakeDurationFunction() {
        let range = this.value * .01;  // convert to a float between 0 and 1
        this.gameSession.juiceSettings.updateJuice("destroyShip","shake","duration",range);
     }


     bulletHitShakeToggleFunction() {
        let inputStatus = this.checked;
        this.gameSession.juiceSettings.updateJuice("bulletHit","shake","active",inputStatus);
     }

     bulletHitShakeTypeFunction() {
        let selected = this.value;
        if( selected === "none" ) {
            this.gameSession.juiceSettings.updateJuice("bulletHit","shake","active",false);
        }
        else {
            this.gameSession.juiceSettings.updateJuice("bulletHit","shake","form",selected);
        }
     }

     bulletHitShakeIntensityFunction() {
        let range = this.value * .01;  // convert to a float between 0 and 1
        this.gameSession.juiceSettings.updateJuice("bulletHit","shake","intensity",range);
     }

     bulletHitFlashColorFunction() {
        let selected = this.value;
        if( selected === "none" ) {
            this.gameSession.juiceSettings.updateJuice("bulletHit","colorFlash","active",false);
        }
        else {
            this.gameSession.juiceSettings.updateJuice("bulletHit","colorFlash","active",true);
            this.gameSession.juiceSettings.updateJuice("bulletHit","colorFlash","color",selected);
        }
     }

    bulletHitFlashFadeFunction() {
        // convert to float between 0 and 1 but add one first to avoid divide-by-zero risk
        let range = (this.value + 1) * .001;
        range = range * 4; // 4 seconds is maximum
        this.gameSession.juiceSettings.updateJuice("bulletHit","colorFlash","duration",range);
     }

     asteroidHitParticleTypeFunction() {
        let selected = this.value;
        if( selected === "none" ) {
            this.gameSession.juiceSettings.updateJuice("asteroidHit","particles","active",false);
        }
        else {
            this.gameSession.juiceSettings.updateJuice("asteroidHit","particles","active",true);
            this.gameSession.juiceSettings.updateParticleSystem("asteroidHit","vectorParticle","shape",selected);
        }
     }

     asteroidHitParticlePatternFunction() {
        let selected = this.value;
        this.gameSession.juiceSettings.updateParticleSystem("asteroidHit","vectorParticle","pattern",selected);
     }

     asteroidHitParticleCountFunction() {
        let selected = parseInt(this.value);
        this.gameSession.juiceSettings.updateParticleSystem("asteroidHit","vectorParticle","count",selected);
     }

     asteroidHitParticleVelocityFunction() {
        let selected = parseInt(this.value);
        this.gameSession.juiceSettings.updateParticleSystem("asteroidHit","vectorParticle","initialVelocity",selected);
     }
    

     asteroidHitParticleVelocityRandomFunction() {
        let selected = this.checked;
        this.gameSession.juiceSettings.updateParticleSystem("asteroidHit","vectorParticle","initialVelocityRandom",selected);
     }

     asteroidHitParticleLifeFunction() {
        let selected = parseInt(this.value);
        this.gameSession.juiceSettings.updateParticleSystem("asteroidHit","vectorParticle","particleLife",selected)
     }

     asteroidHitParticleRotationSpeedFunction() {
        let selected = parseInt(this.value);
        this.gameSession.juiceSettings.updateParticleSystem("asteroidHit","vectorParticle","rotationSpeed",selected);
    }

    asteroidHitParticleRotationRandomFunction() {
        let selected = this.value;
        this.gameSession.juiceSettings.updateParticleSystem("asteroidHit","vectorParticle","rotation",selected);
    }



    /**Prints a simple alert when our example slider is changed.
     * range status can be checked with this.value
     * gameSession accessible through this.gameSession
     * 
     * this refers to the HTML element this function is attached to (See constructor of this class), not the Juice Manager class.
     */
    rangeExampleJuiceFunction(){
        let rangeExampleStatus = this.value + "";
        console.log("Range example - range is: " + rangeExampleStatus);
    }

    /**Prints a simple log when our select is changed.
     * selected value can ge checked with this.value
     * gameSession accessible through this.gameSession
     * 
     * this refers to the HTML element this function is attached to (See constructor of this class), not the Juice Manager class
     */
    selectExampleJuiceFunction(){
        let selectExampleStatus = this.value + "";
        console.log("Select example - selected is: " + selectExampleStatus);
    }

    get invincibilityToggle() {
        return this.__invincibilityToggle;
    }

    set invincibilityToggle(invincibilityToggle) {
        this.__invincibilityToggle = invincibilityToggle;
    }

    get deathShakeToggle() {
        return this.__deathShakeToggle;
    }

    get deathShakeType() {
        return this.__deathShakeType;
    }

    get deathShakeIntensity() {
        return this.__deathShakeIntensity;
    }

    get deathShakeDuration() {
        return this.__deathShakeDuration;
    }

    get bulletHitShakeToggle() {
        return this.__bulletHitShakeToggle;
    }

    get bulletHitShakeType() {
        return this.__bulletHitShakeType;
    }

    get bulletHitShakeIntensity() {
        return this.__bulletHitShakeIntensity;
    }

    get bulletHitFlashColor() {
        return this.__bulletHitFlashColor;
    }

    get bulletHitFlashFade() {
        return this.__bulletHitFlashFade;
    }

    get selectExample(){
        return this.__selectExample;
    }

    set selectExample(selectExample){
        this.__selectExample = selectExample;
    }

    get checkBoxExample(){
        return this.__checkBoxExample;
    }

    set checkBoxExample(checkBoxExample){
        this.__checkBoxExample = checkBoxExample;
    }

    get rangeExample(){
        return this.__rangeExample;
    }

    set rangeExample(rangeExample){
        this.__rangeExample = rangeExample;
    }

    get asteroidHitParticleType() {
        return this.__asteroidHitParticleType;
    }

    get asteroidHitParticleCount() {
        return this.__asteroidHitParticleCount;
    }

    get asteroidHitParticlePattern() {
        return this.__asteroidHitParticlePattern;
    }

    get asteroidHitParticleVelocity() {
        return this.__asteroidHitParticleVelocity;
    }

    get asteroidHitParticleVelocityRandom() {
        return this.__asteroidHitParticleVelocityRandom;
    }
    

}