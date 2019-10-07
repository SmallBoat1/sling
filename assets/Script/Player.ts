import GameEventMgr from "./GameEventMgr";
import { EventMessage } from "./EventMessage";

const {ccclass, property} = cc._decorator;

// 玩家角色类
@ccclass
export default class Player extends cc.Component {
    @property(cc.Node)
    oldParent :cc.Node = null;

    @property(cc.Vec2)
    force:cc.Vec2 = cc.Vec2.ZERO;

    @property(cc.RigidBody)
    rig:cc.RigidBody = null;

    // 当前id
    @property
    pillarid: number = 0;
    // 是否在悠荡
    @property 
    isSmooth:boolean = false;
    // 质量
    @property
    gravity:number = 1;

    @property
    jump:boolean=false;

    onLoad () {
        this.oldParent = this.node.parent;
    }

    start()
    {
        GameEventMgr.register(EventMessage.GE_Jump,this.onJump,this.node);
    }

    onBindJoint(parent:cc.Node):void
    {

        // this.node.setParent(parent);
        // this.node.setRotation(0,0,0,0);
        // this.rig.gravityScale = 0;
        // this.isSmooth = true;
    }

    addRig():void
    {
        this.isSmooth = false;
        this. rig.gravityScale =this.gravity;
        this.rig.type = cc.RigidBodyType.Dynamic;
        this.rig.bullet = true;
        this.rig.awake = true;
    }

    onDepatchJoint():void
    {
        if(!this.isSmooth) return;
        this.isSmooth = false;
        this.node.setParent(this.oldParent);
        this.addRig();
    }

    onJump():void
    {
        this.rig = this.node.getComponent<cc.RigidBody>(cc.RigidBody);
        this.rig .applyLinearImpulse(this.force,this.rig.getWorldCenter(),true);
        this.jump = true;    
    }

    // update (dt) {
    //     //this.node.x+=1;
    // }
}