import State from "../../core/State.js";

/** Example of Gamestate
 * 
 *  1. Renders a background
 *  2. Takes poseLandmarks and renders a skeleton
 *  3. Loads relevant game items (charge pack, etc.)
 *  4. Goes through 4 poses
 *  5. Transition to game over
 * 
 * Alt: Game over on empty charge pack for 5 seconds
 */

export default class GameState extends State {

    constructor(){
        super("Game");
        //check 

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
        this.gameSession.bulletManager.update();
        this.gameSession.asteroidManager.update();
        this.gameSession.shipManager.ship.update();
        this.gameSession.juiceEventManager.update();

    }

    cleanup(){
        super.update();
    }

    get gameBackground(){
        return this.__gameBackground;
    }

}
