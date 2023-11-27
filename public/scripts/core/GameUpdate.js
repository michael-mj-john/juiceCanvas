import GameSession from "./GameSession.js";

/** GameUpdate
 * 
 *  Handles all updates from the main game logic
 *  Includes 
 * 
 */

export default class GameUpdate {

    constructor(){

        //singleton
        if(GameUpdate.__instance){
            return GameUpdate.__instance;
        }
        GameUpdate.__instance = this;
        this.__instance = this;

        //link to gameSession
        this.__gameSession = new GameSession();
        this.__p5 = this.__gameSession.p5;

    }

    update(){
        
        // All updates first
        this.gameSession.inputManager.update();
        this.gameSession.bulletManager.update();
        this.gameSession.asteroidManager.update();
        this.gameSession.shipManager.ship.update();
        this.gameSession.juiceEventManager.update();

    }

    render(){

        this.gameSession.bulletManager.render();
        this.gameSession.shipManager.ship.render();
        this.gameSession.asteroidManager.render();
        this.gameSession.particleManager.render();

    }

    keyIsDown(){
    }

    keyPressed() {
    }


    get instance(){
        return this.__instance;
    }

    set instance(instance){
        this.__instance = instance;
    }


    get gameSession(){
        return this.__gameSession;
    }

    set instance(gameSession){
        this.__gameSession = gameSession;
    }

 

}
