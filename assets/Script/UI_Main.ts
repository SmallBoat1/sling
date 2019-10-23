import GameEventMgr from "./GameEventMgr";
import { EventMessage } from "./EventMessage";

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
    @property(cc.Node)
    Center:cc.Node = null;
    @property(cc.Node)
    LevelPro:cc.Node = null;

    @property(cc.ProgressBar)
    progress:cc.ProgressBar = null;
    @property(cc.Label)
    curLevelLabel:cc.Label = null;
    @property(cc.Label)
    nextLevelLabel:cc.Label = null;

    public init():void
    {
        this.Center.active = true;
        this.LevelPro.active = false;
    }


    public Openhome():void
    {

    }


    public openSetting():void
    {

    }

    public OnJump():void
    {
       GameEventMgr.emit(EventMessage.GE_Jump)
       this.startJump.active = false;
       this.Center.active = false;
       this.LevelPro.active = true;
       this.curLevelLabel.string = this.Curlevel.toString();
       this.nextLevelLabel.string = (this.Curlevel+1).toString();
    }

    updateProgress(pro:number):void
    {
        console.log("progress " + pro);
        this.progress.progress = pro;
    }

    start () 
    { 

        GameEventMgr.register(EventMessage.GE_UpdateProgress,this.updateProgress,this);
    }
}
