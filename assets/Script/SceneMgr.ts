const { ccclass, property } = cc._decorator;

@ccclass
export default class SceneMgr extends cc.Component {
    @property(cc.Node)
    camera: cc.Node = null;

    @property(cc.Node)
    pillarRoot: cc.Node = null;

    @property(cc.Node)
    line: cc.Node = null;

    @property(cc.Prefab)
    pillarPref: cc.Prefab = null;

    @property(Array)
    pillarArray: Array<Node> = new Array<Node>();

    index: number = 0;

    public init(): void {
        this.camera.position = cc.Vec2.ZERO;
        this.line.active = false;
        this.LoadScene(0);
    }

    Rigist() {
        this.node.on(GameEvent.GE_BindJoint, this.onBindJoint, this);
    }

    onBindJoint(hero: cc.Node): void {

    }

    LoadScene(level: number): void {

    }
}
