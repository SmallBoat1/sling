import GameEventMgr from "./GameEventMgr";
import { EventMessage } from "./EventMessage";
import GameMgr from "./GameMgr";
import LevelSelectView from "./LevelSelectView";
import SelectRoleView from "./SelectRoleView";

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
    @property(cc.Node)
    Name:cc.Node = null;

    @property(cc.ProgressBar)
    progress:cc.ProgressBar = null;
    @property(cc.Label)
    curLevelLabel:cc.Label = null;
    @property(cc.Label)
    nextLevelLabel:cc.Label = null;

    @property(cc.Node)
    play:cc.Node= null;
    @property(cc.Label)
    play_curlevel:cc.Label = null;
    @property(cc.Sprite)
    play_cicleFill:cc.Sprite= null;

    @property(LevelSelectView)
    levelView:LevelSelectView = null;

    @property(SelectRoleView)
    selectRoleView:SelectRoleView = null;

    @property(cc.Node)
    setingView:cc.Node = null;

    public init():void
    {
        this.Center.active = true;
        this.play.active  =true;
        this.LevelPro.active = false;
        this.startJump.active = true;
        this.Home.active = true;
        this.Setting.active = true;
        this.Name.active =true;
        this.play_curlevel.string = GameMgr.instance.db.loadCurlevel().toString();
        console.log("UI_Main init");
    }


    public Openhome():void
    {
        this.init();
        GameEventMgr.emit(EventMessage.GE_Home);
    }


    public openSetting():void
    {
        // TODO
       this.setingView.active = true;
    }

    public openlevel()
    {
        this.levelView.node.active = true;
        this.levelView.Init();
    }

    openRoleButton()
    {
        this.selectRoleView.node.active = true;
        this.selectRoleView.init();
    }

    onFinish(obj:any, type:number)
    {
        this.Home.active = true;
        this.Setting.active = true;
    }

    public OnJump():void
    {
       GameEventMgr.emit(EventMessage.GE_Jump)
       this.startJump.active = false;
       this.Center.active = false;
       this.play.active  =false;
       this.LevelPro.active = true;
       this.curLevelLabel.string = this.Curlevel.toString();
       this.nextLevelLabel.string = (this.Curlevel+1).toString();
       this.Home.active = false;
       this.Setting.active = false;
       this.Name.active =false;
    }

    updateProgress(context :any,pro:number):void
    {
        this.progress.progress = pro;
        
    }

    start () 
    { 
        GameEventMgr.register(EventMessage.GE_UpdateProgress,this.updateProgress,this);
        GameEventMgr.register(EventMessage.GE_Finish,this.onFinish,this);
        GameEventMgr.register(EventMessage.GE_SelectLevel,this.init,this);
    }
}
