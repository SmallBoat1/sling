import GameEventMgr from "./GameEventMgr";
import { EventMessage } from "./EventMessage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Pillar extends cc.Component {

    @property(cc.Node)
    point:cc.Node = null;
    @property(cc.RigidBody)
    rig: cc.RigidBody = null;

    @property
    maxDis:number = 0;
    @property
    beenSlinged :boolean = false;

    onLoad()
    {
        this.point.active = false;
       
        //this.node.on("bindJoint",this.BindJoint,this);
    }

    start()
    {
        //GameEventMgr.register(EventMessage.GE_Bind,this.BindJoint,this);
    }

    BindJoint(joint:cc.RevoluteJoint):void
    {
        if(!joint)
        {
            console.log("joint is null");
            return;
        }
        if(this.beenSlinged) return;
        var pos = this.node.position;
        var delta = joint.node.position.sub(pos).mag();
        if(delta > this.maxDis) return;
        joint.connectedBody = this.rig;
        this.beenSlinged = true;
        this.point.active = true;
    }

    public Init(dis:number):void
    {
        this.maxDis = dis;
        this.beenSlinged = false;
    }
}