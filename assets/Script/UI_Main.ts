// import GameEventMgr from "./GameEventMgr";
// import { EventMessage } from "./EventMessage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UI_Main extends cc.Component {

    @property(cc.Node)
    startJump: cc.Node = null;
    @property(cc.Node)
    Home: cc.Node = null;
    @property(cc.Node)
    Setting: cc.Node = null;
    @property(cc.Node)
    Player: cc.Node = null;
    @property(cc.Node)
    Vip: cc.Node = null;
    @property(cc.Node)
    Levels: cc.Node = null;
    @property(cc.Node)
    DayMission: cc.Node = null;
    @property
    Curlevel: number = 1;

    public init():void
    {
        
    }


    public Openhome():void
    {

    }

    public OnJump():void
    {
       // GameEventMgr.emit(EventMessage.GE_Jump)
        this.startJump.active = false;
    }

    // onLoad () {}

    // start () {    }

    // update (dt) {}
}
