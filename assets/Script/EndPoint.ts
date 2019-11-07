const {ccclass, property} = cc._decorator;

@ccclass
export default class EndPoint extends cc.Component 
{
    @property(cc.Node)
    cubeLeft:cc.Node = null;
    @property(cc.Node)
    cubeRight:cc.Node = null;
    @property(cc.Node)
    cubebottom:cc.Node = null;
    @property(cc.Node)
    cup:cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    setPoint (pos:cc.Vec2) 
    {
        this.removeBox();

        this.node.setPosition(pos);

        this.bindBox(this.cubeLeft,90,110,0,0);
        this.bindBox(this.cubeRight,90,110,0,0);
        this.bindBox(this.cubebottom,300,16,0,0);
        this.bindBox(this.cup,144,130,0,0);
    }

    removeBox()
    {
        this.cubeLeft.removeComponent(cc.PhysicsBoxCollider);
        this.cubeLeft.removeComponent(cc.RigidBody);

        this.cubeRight.removeComponent(cc.PhysicsBoxCollider);
        this.cubeRight.removeComponent(cc.RigidBody);

        this.cubebottom.removeComponent(cc.PhysicsBoxCollider);
        this.cubebottom.removeComponent(cc.RigidBody);

        this.cup.removeComponent(cc.PhysicsBoxCollider);
        this.cup.removeComponent(cc.RigidBody);
    }

    bindBox(node:cc.Node,width:number,height:number,x:number,y:number)
    {
        var rig = node.addComponent(cc.RigidBody);
        rig.type   = cc.RigidBodyType.Static;
        rig.awake = true;
        var box = node.addComponent(cc.PhysicsBoxCollider);
        box.tag = 2;
        box.restitution = 0.2;
        box.size = cc.size(width,height);
        box.offset = cc.v2(x,y);
        box.apply();
    }

    // update (dt) {}
}
