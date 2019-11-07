import Player from "./Player";

// import GameEventMgr from "./GameEventMgr";
// import { EventMessage } from "./EventMessage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Pillar extends cc.Component {
    @property(cc.Node)
    point:cc.Node = null;
    @property(cc.Node)
    opoint:cc.Node = null;
    // @property(cc.RigidBody)
    // rig: cc.RigidBody = null;
    @property(cc.Node)
    line:cc.Node = null;
    @property(cc.Node)
    pos:cc.Node = null;
    @property(cc.Node)
    zhuzi:cc.Node = null;

    @property
    startPos:number = 0;
    @property
    beenSlinged :boolean = false;

    onLoad()
    {
        this.point.active = false; 
        this.opoint.active = true;
        this.Reset();
    }

    BindJoint(player:cc.Node):void
    {
        if(!player)
        {
            console.log("player is null");
            return;
        }

        // if(this.startPos > this.node.position.x)
        // {
        //     return;
        // }

        if(!this.beenSlinged)
        {
            console.log("binding" +this.beenSlinged);
            var pos = this.node.position;
            var worldpos = player.parent.convertToWorldSpaceAR(player.position);
            var delta =worldpos.sub( this.node.parent.convertToWorldSpaceAR(pos)).mag();
            this.line.height = delta;
            this.pos.position = cc.v2(0, -delta);
            let angleV =this.node.parent.convertToNodeSpaceAR(worldpos).sub(pos);
            var angle = angleV.angle(cc.Vec2.UP.negSelf()) * 180 /Math.PI * -1;
            this.line.angle = angle;
            this.line.active = true;
            this.beenSlinged = true;
            this.point.active = true;
            this.opoint.active = false;
        }  
    }

    Release(player:cc.Node):void
    { 
        player.getComponent(Player).onDepatchJoint();
        this.line.active = false;
    }

    public Init(pos:cc.Vec2):void
    {
        //this.startPos = pos;
        this.node.setPosition(pos);
        this.InitRig();
        this.beenSlinged = false;
        this.line.active = false;
    }

    InitRig()
    {
        var rig =  this.node.addComponent(cc.RigidBody);
        rig.type = cc.RigidBodyType.Kinematic;
        rig.gravityScale = 0;
        rig.awake = true;
        
        var box = this.node.addComponent(cc.PhysicsBoxCollider);
        box.tag = 1;
        box.size = cc.size(1,1);
        box.apply();
        var rig_zhu = this.zhuzi.addComponent(cc.RigidBody);
        rig_zhu.type = cc.RigidBodyType.Kinematic;
        rig_zhu.awake = true;
        var box_zhu = this.zhuzi.addComponent(cc.PhysicsBoxCollider);
        box_zhu.tag=0;
        box_zhu.sensor = false;
        box_zhu.size = cc.size(50,700);
        box_zhu.offset = cc.v2(0,350);
        box_zhu.apply();
        rig_zhu.enabledContactListener = true;
        
        this.line.getComponent(cc.RevoluteJoint).connectedBody = rig;

        console.log(" box " + box_zhu.size.height + " y " + box_zhu.offset.y);
    }

    public Reset():void
    {
        this.beenSlinged = false;
        this.line.active = false;
        this.point.active = false;
        this.opoint.active = true;
    }
}