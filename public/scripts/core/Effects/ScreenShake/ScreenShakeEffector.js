/*

ScreenShakeEffector

    Set up as a generic screen shaker. Takes name of event, and looks up appropriate
    shake parameters from juiceSettings. 

    Supports sinusoidal, random and Perlin noise as shake functions.

    Formula and parameters are set up in constructor. 

    last modified by MJ 6/4/22

    TODO: Separating frequency from amplitude would be nice. 

*/

import GameSession from "../../GameSession.js";

export default class ScreenShakeEffector {

/* NEED TO COMPLETELY REWRITE THIS. SELECT A VECTOR, THEN DO THE EFFECT AS AMPLITUDE (POSITIVE OR NEGATIVE) ALONG THAT VECTOR. ALLOWS FOR MUCH MORE INTERESTING FX */

    constructor(eventName) {
        this.__gameSession = new GameSession();

        //construct this effector object using the juiceSettings object        
        this.__active = this.gameSession.juiceSettings.container[eventName].shake.active;
        this.__xAxis = this.gameSession.juiceSettings.container[eventName].shake.xAxis; // boolean
        this.__yAxis = this.gameSession.juiceSettings.container[eventName].shake.yAxis; // boolean
        this.__frequency = this.gameSession.juiceSettings.container[eventName].shake.frequency // cycles/second
        this.__intensity = this.gameSession.juiceSettings.container[eventName].shake.intensity; // float 0.0 - 1.0
        this.__duration = this.gameSession.juiceSettings.container[eventName].shake.duration * 1000; //convert to milliseconds
        this.__form = this.gameSession.juiceSettings.container[eventName].shake.form; // string
        this.__fade = this.gameSession.juiceSettings.container[eventName].shake.fade; // string, typically "linear" or "exponential"

        this.__intensity = this.__intensity * 50; // changes it from a 0.0 to 0.1 scale to an actual pixel offset value

        // this determines the axis of shake effect. If the effect is only in X or only in Y, it will normalize to a simple linear shake. 
        // however if both are in play, it will create a randomized (normalized) vector allowing the shake effect to operate along that vector.
        let shakeX = 0;
        let shakeY = 0;
        if( this.xAxis === true ) {
            shakeX = Math.random() - 0.5;
        }
        if( this.yAxis === true ) {
            shakeY = Math.random() - 0.5;
        }
        this.__shakeVector = this.gameSession.p5.createVector(shakeX,shakeY);
        this.shakeVector.normalize(); // might be redundant

        this.__startTime = this.gameSession.timeManager.unscaledTime;
        this.__timeScaler = this.frequency; // INCOMPLETE. NEED TO CONCENTRATE DAMMIT
        this.__currentIntensity = this.__intensity;

    }

    finished(){
        if( (this.gameSession.timeManager.unscaledTime - this.startTime) >= this.duration) {
            return "screenShake";
        }
        else {
            return false;
        }
    }

    update(){

            // screen shake can either just end, or fade out (fading out amplitude). Fading usually looks better.
            this.shakeFader();

            let offset;

            offset = this.computeShake();

            console.log("offset value: ", offset);
            console.log("translation vector x",this.shakeVector.x);

            // unfortunately static function calls don't work in this app...
            let tempVec = this.gameSession.p5.createVector(this.shakeVector.x, this.shakeVector.y);
            console.log("temp Vec x", tempVec.x);
            tempVec.setMag(offset);
            console.log("scaled temp Vec x", tempVec.x)
            this.gameSession.p5.translate(tempVec.x, tempVec.y);
            
    }

    //empty render function intentionally
    render() {
        
    }


    computeShake() {
    
        switch(this.form) {  
            case "sine":
                return this.sineShake();
                break;
            case "random":
                return this.randomShake();
                break;
            case "noise":
                return this.noiseShake();
                break;
            default:
                return this.randomShake();
        }

    }

    shakeFader() {
        
        // linear fade reduces amplitude in linear fashion over time
        if( this.fade === "linear" ) {
            let proportion = 1 - ((this.gameSession.timeManager.time - this.startTime ) / this.duration);
            this.currentIntensity = this.intensity * proportion;            
        }

        // exponential currently uses power of 4 for the formula (Math.pow(timeElapsed, 4))
        if( this.fade === "exponential" ) { 
            let timeElapsed = (this.gameSession.timeManager.time - this.startTime) / this.duration;
            let proportion = timeElapsed * timeElapsed;
            proportion = Math.pow(timeElapsed, 4);
            this.currentIntensity *=  1 - proportion;
        }

    }

    // uses a sin function to generate magnitudes to be applied to the shake vector
    sineShake() {

        let offsetValue;
        let angle = 2 * Math.PI;
        let timeStamp = (this.gameSession.timeManager.time - this.startTime) //* 1000; //milliseconds since effect started
        timeStamp = timeStamp * this.frequency;

        let position = this.gameSession.p5.radians(timeStamp);

        offsetValue = this.gameSession.p5.sin(position) * this.currentIntensity;

        return offsetValue;
    }

    randomShake () {
        
        // frequency is once per frame
        // let freq = 60 / 

        // only allow random or noise to fire if frequency has expired

        return this.gameSession.p5.random(-this.intensity * this.intensityMultiplier, this.intensity * this.intensityMultiplier) * this.currentIntensity;
    }

    noiseShake() {
        // use p5's built in function to return Perlin noise
        // uses time function to animate the noise
        return this.gameSession.p5.noise(this.gameSession.timeManager.time) * this.currentIntensity * this.intensityMultiplier;
    }   

    get gameSession(){
        return this.__gameSession;
    }

    get active() {
        return this.__active;
    }

    get shakeVector() {
        return this.__shakeVector;
    }

    get xRandomizer() {
        return this.__xRandomizer;
    }

    get yRandomizer() {
        return this.__yRandomizer;
    }

    get intensity() {
        return this.__intensity;
    }

    get frequency() {
        return this.__frequency;
    }

    get intensityMultiplier() {
        return this.__intensityMultiplier;
    }

    get initialDirection() {
        return this.__initialDirection;
    }

    get duration(){
        return this.__duration;
    }

    get form() {
        return this.__form;
    }

    get fade() {
        return this.__fade;
    }

    get startTime() {
        return this.__startTime;
    }

    get currentIntensity() {
        return this.__currentIntensity;
    }

    set currentIntensity(currentIntensity){
        this.__currentIntensity = currentIntensity;
    }

    get xAxis() {
        return this.__xAxis;
    }

    get yAxis() {
        return this.__yAxis;
    }

}