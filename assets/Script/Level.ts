export default class Level {

    constructor(){}

    parse(json:any) {
        this.id = json.id;
        this.count = json.count;
        this.lenght = json.lenght;
        this.endPointPos = json.endPointPos;
        this.pillars = json.pillars;
        this.walls = json.walls;
        this.bg = json.bg;
    }


    // 关卡Id
    public id: number = 1;
    // 柱子总数
    public count: number = 1;
    // 关卡长度
    public lenght: number = 1;
    // 终点位置
    public endPointPos: cc.Vec2 = cc.Vec2.ZERO;
    // 柱子位置
    public pillars: Array<cc.Vec2> = new Array<cc.Vec2>();
    // 下面的墙的位置
    public walls: Array<cc.Vec2> = new Array<cc.Vec2>();
    // 关卡背景
    public bg: cc.Color = cc.Color.GRAY;
}