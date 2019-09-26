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
    index: number = 0;

    public init(): void {
        this.camera.position = cc.Vec2.ZERO;
        this.line.active = false;
        this.LoadScene(0);
    }

    LoadScene(level: number): void {
        
    }
}
