import GameEventMgr from "./GameEventMgr";
import { EventMessage } from "./EventMessage";

const { ccclass, property } = cc._decorator;

// 玩家角色类
@ccclass
export default class Player extends cc.Component {
    @property(cc.Node)
    oldParent: cc.Node = null;

    @property(cc.Vec2)
    force: cc.Vec2 = cc.Vec2.ZERO;

    @property(cc.RigidBody)
    rig: cc.RigidBody = null;

    // 当前id
    @property
    pillarid: number = 0;
    // 是否在悠荡
    @property
    isSmooth: boolean = false;
    // 质量
    @property
    gravity: number = 1;

    @property
    jump: boolean = false;

    @property(cc.Node)
    followTarget: cc.Node = null;

    onLoad() {
        this.oldParent = cc.find("Scene");
    }

    start() {
        GameEventMgr.register(EventMessage.GE_Jump, this.onJump, this);
    }

    onBindJoint(target: cc.Node): void {
        this.followTarget = target;
        var pos = target.parent.parent.convertToWorldSpaceAR(target.parent.position);
        this.node.lookAt(new cc.Vec3(pos.x,pos.y,0));
       // this.rig.type = cc.RigidBodyType.Static;
       this.node.getChildByName("tail").active  =true;
        this.isSmooth = true;
    }

    addRig(): void {
        var v = cc.Vec2.ZERO;
        //this.rig.type = cc.RigidBodyType.Dynamic;
        var wpos = this.followTarget.parent.convertToWorldSpaceAR(this.followTarget.position);
        var prig = this.followTarget.parent.getComponent(cc.RigidBody);
        if(prig)
        {
            prig.getLinearVelocityFromWorldPoint(wpos, v);
            this.rig.linearVelocity = v;
        } 
    }

    onDepatchJoint(): void {
        this.isSmooth = false;
        this.addRig();
    }

    onJump(): void {
        this.rig = this.node.getComponent<cc.RigidBody>(cc.RigidBody);
        this.rig.applyLinearImpulse(this.force, this.rig.getWorldCenter(), true);
        this.jump = true;
    }

    onBeginContact(context:any,selfCollider:cc.BoxCollider,other:cc.BoxCollider)
    {
        this.onDepatchJoint();
        this.followTarget.parent.active = false;
        this.node.getChildByName("tail").active  =false;
        console.log("碰撞" + other.name);
        if(other.name == "cube")// 到达终点
        {
            this.onFinish();
        }
    }

    onFinish()
    {

    }

    

    updatePos():void 
    {
        
        var lookPoint = this.followTarget.parent.parent.convertToWorldSpaceAR(this.followTarget.parent.position);
        this.node.lookAt(new cc.Vec3(lookPoint.x,lookPoint.y,0));
        var pos = this.followTarget.parent.convertToWorldSpaceAR(this.followTarget.position);
        this.node.position = this.node.parent.convertToNodeSpaceAR(pos);
        GameEventMgr.emit(EventMessage.GE_UpdateProgress,this.node.position);
    }

    update(dt)
    {
        if(this.isSmooth)
        {
            this.updatePos();
        }
    }
}