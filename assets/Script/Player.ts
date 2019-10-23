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
    @property
    moving: boolean = false;

    @property(cc.Node)
    followTarget: cc.Node = null;

    onLoad() {
        this.oldParent = cc.find("Scene");
    }

    start() {
        GameEventMgr.register(EventMessage.GE_Jump, this.onJump, this);
    }

    Init()
    {
        this.moving = false;
        this.jump = false;
        this.isSmooth = false;
        this.pillarid = 0;
        this.node.position = cc.v2(-212,-144);
        this.rig.enabledContactListener = true;
    }

    onBindJoint(target: cc.Node): void {
        this.followTarget = target;
        var pos = this.followTarget .parent.parent.convertToWorldSpaceAR(target.parent.position);
        this.node.lookAt(new cc.Vec3(pos.x,pos.y,0));
       //this.rig.type = cc.RigidBodyType.Static;
       this.node.getChildByName("tail").active  =true;
        this.isSmooth = true;
    }

    addRig(): void {
        var v = cc.Vec2.ZERO;
        //this.rig.type = cc.RigidBodyType.Dynamic;
        try {
            if(this.followTarget)
            {
                var wpos = this.followTarget.parent.convertToWorldSpaceAR(this.followTarget.position);
                var prig = this.followTarget.parent.getComponent(cc.RigidBody);
                if(prig)
                {
                    prig.getLinearVelocityFromWorldPoint(wpos, v);
                    this.rig.linearVelocity = v;
                    this.rig.linearDamping = 0.3;
                } 
            }
        } catch (error) {
            console.log(error);
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
        this.moving = true;
    }

    onBeginContact(context:any,selfCollider:cc.BoxCollider,other:cc.BoxCollider)
    {
        if(other.name == "StartPoint") return;
        this.rig.enabledContactListener = false;
        this.onDepatchJoint();
        if(this.followTarget) this.followTarget.parent.active = false;
        this.node.getChildByName("tail").active  =false;
        console.log("碰撞" + other.name);
        if(other.name == "cube")// 到达终点
        {
            this.onFinish(1);
        }
        else
        {
            this.onFinish(-1);
        }
    }

    onFinish(type:number)
    {
        GameEventMgr.emit(EventMessage.GE_Finish,type);
        this.moving = false;
    }

    updatePos():void 
    {
        var pos = this.followTarget.parent.convertToWorldSpaceAR(this.followTarget.position);
        this.node.position = this.node.parent.convertToNodeSpaceAR(pos);  
        var lookPoint = this.followTarget.parent.parent.convertToWorldSpaceAR(this.followTarget.parent.position);
        this.node.lookAt(new cc.Vec3(lookPoint.x,lookPoint.y,0));
    }

    lateUpdate()
    {
        if(this.isSmooth)
        {
            this.updatePos();
        }
    }


    // update(dt)
    // {
    //     if(this.isSmooth)
    //     {
    //         this.updatePos();
    //     }
    // }
}