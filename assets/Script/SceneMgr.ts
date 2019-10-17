
import GameEventMgr from "./GameEventMgr";
import { EventMessage } from "./EventMessage";
import Pillar from "./Pillar";
import Player from "./Player";
import DBMgr from "./DBMgr";

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

    level:number = 0;

    index: number = 0;

    offset:number = 0;
    lastPos:number = 0;
    origPos:number = 0;

    totalDis:number = 1000;
    curDis:number = 0;
    progress:number = 0;
    finish:boolean  =false;

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getCollisionManager().enabled = true;
    }

    start() 
    {
        this.lastPos = this.player.parent.convertToWorldSpaceAR(this.player.position).x;
        this.origPos = this.player.position.x;
    }

    public init(): void {
        
        DBMgr.loadConfig();
        //this.loadLevel(0);
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
        if(this.player.getComponent(Player).jump && !this.finish)
        {
            var pos = this.player.parent.convertToWorldSpaceAR(this.player.position);
            this.offset = pos.x - this.lastPos;
            this.lastPos = pos.x;
            this.camera.position.x += this.offset;
            this.updateProgress();
        }
    }

    updateProgress():void 
    {
        this.curDis = this.player.position.x - this.origPos;
        this.progress = this.curDis/this.totalDis;
        GameEventMgr.emit(EventMessage.GE_UpdateProgress, this.progress);
    }

    loadHistory()
    {
        DBMgr.LoadAll(100);
    }

    /**
     * 加载关卡
     * @param level 
     */
    loadLevel(level: number): void {
        console.log("LoadScene" + level);
          
        
    }

    /**
     * 重置关卡
     */
    onResetLevel():void
    {

    }

    /**
     * 完成关卡
     */
    onFinishlevel(score1:number,score2:number):void
    {
        this.finish = true;
        DBMgr.Save(this.level,score1,score2);
    }
}
