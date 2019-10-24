import Player from "./Player";

// import GameEventMgr from "./GameEventMgr";
// import { EventMessage } from "./EventMessage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Pillar extends cc.Component {
    @property(cc.Node)
    point:cc.Node = null;
    @property(cc.RigidBody)
    rig: cc.RigidBody = null;
    @property(cc.Node)
    line:cc.Node = null;
    @property(cc.Node)
    pos:cc.Node = null;

    @property
    startPos:number = 0;
    @property
    beenSlinged :boolean = false;

    onLoad()
    {
        this.point.active = false; 
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
        }  
    }

    Release(player:cc.Node):void
    { 
        player.getComponent(Player).onDepatchJoint();
        this.line.active = false;
    }

    public Init(pos:number):void
    {
        this.startPos = pos;
        this.beenSlinged = false;
        this.line.active = false;
    }

    public Reset():void
    {
        this.beenSlinged = false;
        this.line.active = false;
        this.point.active = false;
    }
}