
import GameEventMgr from "./GameEventMgr";
import { EventMessage } from "./EventMessage";
import Pillar from "./Pillar";
import Player from "./Player";
import DBMgr from "./DBMgr";
import Level from "./Level";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SceneMgr extends cc.Component {
    // 预设
    @property(cc.Prefab)
    pillarPref: cc.Prefab = null;
    @property(cc.Prefab)
    wallPref: cc.Prefab = null;
  
    @property
    playersPref:Array<cc.Prefab> = cc.Prefab [10];

    // 节点
    @property(cc.Node)
    endPoint: cc.Node = null;
    @property(cc.Node)
    startPoint: cc.Node = null;
    @property(cc.Node)
    Bg: cc.Node = null;
    @property(cc.Node)
    player: cc.Node = null;
    @property(cc.Node)
    camera: cc.Node = null;
    @property(cc.Node)
    test: cc.Node = null;
    @property(Array)
    pillarArray: Array<cc.Node> = new Array<cc.Node>();
    @property(Array)
    wallArray: Array<cc.Node> = new Array<cc.Node>();
    
    @property(cc.Vec2)
    ar:cc.Vec2=cc.p(0,0);

    level: number = 0;

    index: number = 0;

    offset: number = 0;
    lastPos: number = 0;
    origPos: number = 0;

    totalDis: number = 1000;
    curDis: number = 0;
    progress: number = 0;
    finish: boolean = false;

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getCollisionManager().enabled = true;
    }

    start() {
        GameEventMgr.register(EventMessage.GE_Home, this.onResetLevel, this);
        this.lastPos = this.player.parent.convertToWorldSpaceAR(this.player.position).x;
        this.origPos = this.player.position.x;
    }

    public init(): void {

        DBMgr.loadConfig();
        this.loadLevel(this.level);
        this.player.getComponent(Player).Init();
        this.finish = false;
        this.offset = 0;
        this.curDis = 0;
        this.progress = 0;
        this.index = 0;
        this.totalDis = this.endPoint.position.x - this.startPoint.position.x;
        console.log(this.totalDis);
        this.origPos = this.player.position.x;
    }

    InitPillars()
    {
        this.test.getComponent(Pillar).Reset();
        for (let i = 0; i < this.pillarArray.length; i++) {
           this.pillarArray[i].getComponent(Pillar).Reset(); 
        }
    }

    onBindJoint(): void {

        // if (this.index >= this.pillarArray.length) {
        //     console.log("最后一个了");
        //     return;
        // }
        if (!this.test.getComponent(Pillar).beenSlinged) {
            this.test.getComponent(Pillar).BindJoint(this.player);
            this.player.getComponent(Player).onBindJoint(this.test.getComponent(Pillar).pos);
            this.index++;
        }
    }

    onDepatchJoint(): void {
        this.test.getComponent(Pillar).Release(this.player);
    }


    lateUpdate() {
            this.updateCamera();
            this.updateProgress();
    }

    updateCamera()
    {
        var worldpos = this.player.convertToWorldSpaceAR(this.ar);
        var pos_ = this.camera.parent.convertToNodeSpaceAR(worldpos);
        let pos = cc.v2(pos_.x,this.camera.y);
        this.camera.position = pos;
    }

    updateProgress(): void {
        if (this.player.getComponent(Player).jump 
        && !this.finish && this.player.getComponent(Player).moving)
        {
            this.curDis = this.player.position.x - this.origPos;
            console.log("curDis " + this.curDis + " totalDis " +this.totalDis);
            this.progress = this.curDis / this.totalDis;
            GameEventMgr.emit(EventMessage.GE_UpdateProgress, this.progress);
        } 
    }

    loadHistory() {
        DBMgr.LoadAll(100);
    }

    /**
     * 加载关卡
     * @param level 
     */
    loadLevel(level: number): void {
        console.log("LoadScene" + level);
        if (DBMgr.Levels.length <= level) {

            return;
        }
        var lc = DBMgr.Levels[level];
        this.totalDis = lc.lenght;
        this.Bg.getComponent(cc.Sprite).name = lc.bg;
        if(lc.pillars!=null && lc.pillars.length > 0) this.LoadPillar(lc.pillars);
        if(lc.walls!=null && lc.walls.length > 0) this.LoadWall(lc.walls);
        this.endPoint.position = lc.endPointPos;
    }

    LoadPillar(plist: Array<cc.Vec2>) {
        this.pillarArray = new Array<cc.Node>();
        for (let i = 0; i < plist.length; i++) {
            var p = cc.instantiate(this.pillarPref);
            this.pillarArray.push(p);
        }
    }

    LoadWall(wlist: Array<cc.Vec2>) {
        this.wallArray = new Array<cc.Node>();
        for (let i = 0; i < wlist.length; i++) {
            var w = cc.instantiate(this.wallPref);
            this.wallArray.push(w);
        }
    }

    /**
     * 重置关卡
     */
    onResetLevel(): void {
        this.init();
        this.InitPillars();
    }

    /**
     * 完成关卡
     */
    onFinishlevel(score1: number, score2: number): void {
        this.finish = true;
        DBMgr.Save(this.level, score1, score2);
    }
}
