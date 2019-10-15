// import Pillar from "./Pillar";
import GameEventMgr from "./GameEventMgr";
import { EventMessage } from "./EventMessage";
import Pillar from "./Pillar";
import Player from "./Player";
// import Player from "./Player";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SceneMgr extends cc.Component {
    @property(cc.Prefab)
    pillarPref: cc.Prefab = null;
    @property(cc.Node)
    Bg: cc.Node = null;
    @property(cc.Node)
    player: cc.Node = null;
    @property(cc.Node)
    camera: cc.Node = null;
    @property(cc.Node)
    test: cc.Node = null;
    @property(Array)
    pillarArray: Array<cc.Node> = new Array<cc.Node>(10);

    index: number = 0;

    offset:number = 0;
    lastPos:number = 0;

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getCollisionManager().enabled = true;
    }

    start() 
    {
        this.lastPos = this.player.parent.convertToWorldSpaceAR(this.player.position).x;
    }

    public init(): void {
        this.LoadScene(0);
    }

    onBindJoint(): void {
       
        // if (this.index >= this.pillarArray.length) {
        //     console.log("最后一个了");
        //     return;
        // }
        if(!this.test.getComponent(Pillar).beenSlinged)
        {
            this.test.getComponent(Pillar).BindJoint(this.player);
            this.player.getComponent(Player).onBindJoint(this.test.getComponent(Pillar).pos);
            this.index++;
        }
    }

    onDepatchJoint(): void {
        this.test.getComponent(Pillar).Release(this.player);
    }

    update(dt)
    {
        var pos = this.player.parent.convertToWorldSpaceAR(this.player.position);
        this.offset = pos.x - this.lastPos;
        this.lastPos = pos.x;
        this.camera.position.x += this.offset;
        //console.log("pos "  + pos);
    }

    LoadScene(level: number): void {
        console.log("LoadScene");   
        // for (let i = 0; i < 5; i++) {
        //     this.pillarArray.push(cc.instantiate(this.pillarPref));
        //     this.pillarArray[i].name = "pillar_" + i;
        //     this.pillarArray[i].parent = this.node;
        //     this.pillarArray[i].x = 0;
        //     this.pillarArray[i].x += 50 * i;
        //     this.pillarArray[i].active = true;
        //     this.pillarArray[i].getComponent(Pillar).Init(100);
        //     console.log(this.pillarArray[i].x, this.pillarArray[i].y);
        // }
    }
}
