import GameSession from "./GameSession.js";

/** GameUpdate
 * 
 *  Handles all updates from the main game logic
 * 
 */

export default class GameUpdate {

    constructor(){
 
        this.__shipThrusting = 0; 
        this.__shipRotating = 0; // potential values 0, 1, -1

    }

    setup(){
        super.setup();  

    }

    render(){
        super.render();

        this.gameSession.bulletManager.render();
        this.gameSession.shipManager.ship.render();
        this.gameSession.asteroidManager.render();
        this.gameSession.particleManager.render();

    }

    update(){
        super.update();
        
        // All updates first
        this.gameSession.inputManager.update();
        this.gameSession.bulletManager.update();
        this.gameSession.asteroidManager.update();
        this.gameSession.shipManager.ship.update();
        this.gameSession.juiceEventManager.update();

    }

    keyIsDown(){
        console.log("input detected");
    }

    keyPressed() {
        console.log("key in gamestate");
    }

    cleanup(){
        super.update();
    }

    get gameBackground(){
        return this.__gameBackground;
    }

    get shipThrusting() {
        return this.__shipThrusting;
    }

}
