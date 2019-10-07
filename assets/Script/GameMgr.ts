import SceneMgr from "./SceneMgr";
import MissionMgr from "./MissionMgr";
import UI_Main from "./UI_Main";
import GameEventMgr from "./GameEventMgr";
import { EventMessage } from "./EventMessage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameMgr extends cc.Component 
{
    static instance:GameMgr = null;
    @property(SceneMgr)
    scene:SceneMgr = null;
    @property(MissionMgr)
    mission:MissionMgr=null;
    @property(UI_Main)
    ui:UI_Main = null;
    
onLoad()
{
    console.log("GameMgr load");
    cc.director.getPhysicsManager().enabled = true;
    cc.director.getCollisionManager().enabled = true;

    if(GameMgr.instance == null)
        GameMgr.instance = this;
}

    start()
    {
        // if(cc.sys.platform == cc.sys.EDITOR_CORE||cc.sys.EDITOR_PAGE)
        {
            this.node.on(cc.Node.EventType.MOUSE_DOWN,this.onTouchDown,this);
            this.node.on(cc.Node.EventType.MOUSE_UP,this.onTouchUp,this);
        }
        // else
        // {
        //     this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchDown,this);
        //     this.node.on(cc.Node.EventType.TOUCH_END,this.onTouchUp,this);
        // }       

        this.scene.init();
        this.mission.init();
        this.ui.init();
    }

    onTouchDown()
    {
        //GameEventMgr.emit(EventMessage.GE_Bind);
    }

    onTouchUp()
    {
        console.log("onTouchUp");
    }
}
