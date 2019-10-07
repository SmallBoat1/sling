// import Pillar from "./Pillar";
import GameEventMgr from "./GameEventMgr";
import { EventMessage } from "./EventMessage";
import Pillar from "./Pillar";
import Player from "./Player";
// import Player from "./Player";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SceneMgr extends cc.Component {
    @property(cc.Node)
    pillarRoot: cc.Node = null;

    @property(cc.Node)
    line: cc.Node = null;

    @property(cc.Prefab)
    pillarPref: cc.Prefab = null;
    @property(cc.Node)
    Bg: cc.Node = null;
    @property(cc.Node)
    player:cc.Node = null;
    @property(Array)
    pillarArray: Array<cc.Node> = new Array<cc.Node>(10);

    index: number = 0;

    onLoad()
    {  
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getCollisionManager().enabled = true;      
        var follow = cc.follow(this.player,cc.rect(0,0,cc.view.getVisibleSize().width,cc.view.getVisibleSize().height));
        this.node.runAction(follow);
    }

    start()
    { 
        GameEventMgr.register(EventMessage.GE_Bind,this.onBindJoint,this.node);
        GameEventMgr.register(EventMessage.GE_Release,this.onDepatchJoint,this.node);
    }

    public init(): void {
        this.line.active = false;
        this.LoadScene(0);
    }

    onBindJoint(): void {
        this.line.active = true;
        if(this.index >= this.pillarArray.length)
        {
            console.log("最后一个了");
            return;
        }
        this.line.getComponent<cc.RevoluteJoint>(cc.RevoluteJoint).connectedBody =
        this.pillarArray[this.index].getComponent<Pillar>(Pillar).rig;
        this.pillarArray[this.index].getComponent<Pillar>(Pillar).point.active = true;
        this.player.getComponent(Player).onBindJoint(this.line);
        this.index++;
    }

    onDepatchJoint():void
    {
        this.line.getComponent<cc.RevoluteJoint>(cc.RevoluteJoint).connectedBody = null;
        this.player.getComponent(Player).onDepatchJoint();
    }

    LoadScene(level: number): void 
    { 
        console.log("LoadScene");
        // this. pillarArray.push(cc.instantiate(this.pillarPref));
        // this.pillarArray[0].name = "pillar_"+0;
        // this.pillarArray[0].parent = this.pillarRoot;
        // this.pillarArray[0].anchorX  = 0;   
        // this.pillarArray[0].active = true;    
    //    for (let i = 0; i < 1; i++) {

    //     this. pillarArray.push(cc.instantiate(this.pillarPref));
    //     this.pillarArray[i].name = "pillar_"+i;
    //     this.pillarArray[i].parent = this.pillarRoot;
    //     this.pillarArray[i].anchorX += 10*i;   
    //     this.pillarArray[i].active = true;    
    //     //console.log(this.pillarArray[i].anchorX,this.pillarArray[i].anchorY);
    //    }
    }
}
