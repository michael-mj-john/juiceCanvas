/* 
 * InputManager Class 
 * 
 * Game Input is aggregated to this class, creating a gameObject that includes the current state of various keys or buttons.
 *
 * All objects that wish to query input should use InputManager as their interface.
 * 
*/

import Manager from "./Manager.js";

export default class InputManager extends Manager {

    constructor() {
        super();

        if(InputManager.__instance = this) {
            this.__instance = {};
        }
        InputManager.__instance = this;
        this.__instance = {};

        //currently unused
        this.__inputObject = {};

        if( this.gameSession.verbose === true ) {
            console.log("input manager created successfully");
        }

    }

    update() {
        
        if(this.gameSession.p5.keyIsDown(37) || this.gameSession.p5.keyIsDown(65) ) {
            this.inputObject.left = true;
        }
        else {
            this.inputObject.left = false;
        }
        if(this.gameSession.p5.keyIsDown(39) || this.gameSession.p5.keyIsDown(68) ) {
            this.inputObject.right = true;           
        }
        else {
            this.inputObject.right = false;
        }
        if(this.gameSession.p5.keyIsDown(38) || this.gameSession.p5.keyIsDown(87) ) {
            this.inputObject.forward = true;            
        }
        else {
            this.inputObject.forward = false;
        }

    }

    keyInput( keyInputValue ) {
        if(keyInputValue === " " || keyInputValue === "Shift" ) {
             this.gameSession.shipManager.ship.fireBullet();
        }

    }


    get inputObject() {
        return this.__inputObject;
    }

    set inputObject(input) {
        this.__inputObject = input;
    }

    get instance() {
        return this.__instance;
    }

    set instance(instance) {
        this.__instance = instance;
    }

}