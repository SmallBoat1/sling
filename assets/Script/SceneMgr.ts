
import GameEventMgr from "./GameEventMgr";
import { EventMessage } from "./EventMessage";
import Pillar from "./Pillar";
import Player from "./Player";
import DBMgr from "./DBMgr";
import Level from "./Level";
import GameMgr from "./GameMgr";

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
    @property(cc.Sprite)
    Bg: cc.Sprite = null;
    @property(cc.Node)
    player: cc.Node = null;
    @property(cc.Node)
    camera: cc.Node = null;
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
    totalDis: number = 0;
    curDis: number = 0;
    progress: number = 0;
    finish: boolean = false;

    onLoad() {
        var self = this;
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getCollisionManager().enabled = true;
       
    }

    start() {
        var self = this;
        GameEventMgr.register(EventMessage.GE_Home, this.onResetLevel, this);
        this.lastPos = this.player.parent.convertToWorldSpaceAR(this.player.position).x;
        this.origPos = this.player.position.x;
    }

    selectLevel(level :number)
    {
        console.log("selectLevel " + level);
        this.level = level;
        this.onResetLevel();
    }

    public init(): void 
    {
        var self = this;
        console.log("init "  + self.level);
        if(self.level == 0) self.level = GameMgr.instance.db.loadCurlevel();
        self.loadLevel(self.level);
        self.player.getComponent(Player).Init();
        self.finish = false;
        self.offset = 0;
        self.curDis = 0;
        self.progress = 0;
        self.index = 0;
       
        self.origPos = self.player.position.x;
    }

    InitPillars()
    {
        var self = this;
        for (let i = 0; i < self.pillarArray.length; i++) {
            self.pillarArray[i].getComponent(Pillar).Reset(); 
        }
    }

    onBindJoint(): void {
        var self = this;
        if (self.index >= self.pillarArray.length) {
            console.log("最后一个了");
            return;
        }
        var p = self.pillarArray[self.index];
        if(!p)return;

        if (!p.getComponent(Pillar).beenSlinged) {
            p.getComponent(Pillar).BindJoint(self.player);
            self.player.getComponent(Player).onBindJoint(p.getComponent(Pillar).pos);
        }
    }

    onDepatchJoint(): void {
        var self = this;
        if(self.index >=self.pillarArray.length )return;
        self.pillarArray[self.index].getComponent(Pillar).Release(self.player);
        self.index++;
    }


    lateUpdate() {
        var self = this;
        self.updateCamera();
        self.updateProgress();
    }

    updateCamera()
    {
        var self = this;
        var worldpos = self.player.convertToWorldSpaceAR(self.ar);
        var pos_ = self.camera.parent.convertToNodeSpaceAR(worldpos);
        let pos = cc.v2(pos_.x,self.camera.y);
        self.camera.position = pos;
    }

    updateProgress(): void {
        if (this.player.getComponent(Player).jump 
        && !this.finish && this.player.getComponent(Player).moving)
        {
            this.curDis = this.player.position.x - this.origPos;
            //console.log("curDis " + this.curDis + " totalDis " +this.totalDis);
            this.progress = this.curDis / this.totalDis;
            GameEventMgr.emit(EventMessage.GE_UpdateProgress, this.progress);
        } 
    }

    loadHistory() {
        GameMgr.instance.db.LoadRecard();
    }

    /**
     * 加载关卡
     * @param level 
     */
    loadLevel(level: number): void {
        var self = this;
        if (GameMgr.instance.db.Levels.length < level) {
            return;
        }
        console.log("LoadScene" + level);
        var lc = GameMgr.instance.db.Levels[level-1];
        this.totalDis = lc.lenght;
        console.log(this.totalDis);
        this.LoadPillar(lc.pillars);
        this.LoadWall(lc.walls);
        this.endPoint.position = lc.endPointPos;
        // this.Bg.node.color = lc.bg;
    }

    LoadPillar(plist: Array<cc.Vec2>) {
        if(plist == null || plist.length == 0) return;
        if(this.pillarArray!=null && this.pillarArray.length > 0)
        {
            for (let i = 0; i < this.pillarArray.length; i++) {
                const p = this.pillarArray[i];
                p.destroy();
            }
        }
        this.pillarArray = new Array<cc.Node>();
        for (let i = 0; i < plist.length; i++) {
            var p = cc.instantiate(this.pillarPref);
            p.parent = this.node;
            p.active = true;
            p.getComponent(Pillar).Init(plist[i]);
            console.log("LoadPillar " + i + " pos " + plist[i].toString());
            this.pillarArray.push(p);
        }
    }

    LoadWall(wlist: Array<cc.Vec2>) {
        if(wlist == null || wlist.length == 0) return;
        console.log("LoadWall");
        if(this.wallArray!=null && this.wallArray.length > 0)
        {
            for (let i = 0; i < this.wallArray.length; i++) {
                const p = this.wallArray[i];
                p.destroy();
            }
        }
        this.wallArray = new Array<cc.Node>();
        for (let i = 0; i < wlist.length; i++) {
            var w = cc.instantiate(this.wallPref);
            w.parent = this.node;
            w.active = true;
            w.setPosition(wlist[i]) ; 
            this.SetBox(w);
            this.wallArray.push(w);
        }
    }

    SetBox(wall:cc.Node)
    {
        var rig = wall.addComponent(cc.RigidBody);
        rig.type = cc.RigidBodyType.Kinematic;
        var box = wall.addComponent(cc.PhysicsBoxCollider);
        box.tag = 5;
        box.restitution = 0.2;
        box.size = cc.size(50,600);
        box.offset = cc.v2(0,300);
        box.apply();
        console.log(" box " + box.size.height + " y " + box.offset.y);
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
        GameMgr.instance.db.Save(this.level, score1, score2);
    }
}
