import SceneMgr from "./SceneMgr";
import MissionMgr from "./MissionMgr";
import UI_Main from "./UI_Main";
import GameEventMgr from "./GameEventMgr";
import { EventMessage } from "./EventMessage";
import DBMgr from "./DBMgr";
import Level from "./Level";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameMgr extends cc.Component 
{
    public static instance:GameMgr = null;
    @property(SceneMgr)
    scene:SceneMgr = null;
    @property(MissionMgr)
    mission:MissionMgr=null;
    @property(UI_Main)
    ui:UI_Main = null;
    @property (DBMgr)
    db:DBMgr = null;
    
onLoad()
{  
    if(GameMgr.instance == null)
        GameMgr.instance = this;
    console.log("GameMgr load");
    cc.director.getPhysicsManager().enabled = true;
    // cc.director.getPhysicsManager().enabledAccumulator = true;
    cc.director.getCollisionManager().enabled = true;
    cc.director.getCollisionManager().enabledDebugDraw = true;
    cc.director.getCollisionManager().enabledDrawBoundingBox = true;
}

    start()
    {
        // if(cc.sys.platform == cc.sys.EDITOR_CORE||cc.sys.EDITOR_PAGE)
        // {
            // this.node.on(cc.Node.EventType.MOUSE_DOWN,this.onTouchDown,this);
            // this.node.on(cc.Node.EventType.MOUSE_UP,this.onTouchUp,this);
        // }
        // else
        // {
            this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchDown,this);
            this.node.on(cc.Node.EventType.TOUCH_END,this.onTouchUp,this);
        // }       
        this.db.loadCurlevel();
        this.db.loadConfig();
    }

    Init()
    {
        console.log('Init');
        this.scene.init();
        this.mission.init();
        this.ui.init();
    }

    update(dt)
    {
        if(this.db.loadend)
        {
            this.Init();
            this.db.loadend = false;
        }
    }

    onTouchDown()
    {
        this.scene.onBindJoint();
    }

    onTouchUp()
    {
        this.scene.onDepatchJoint();
    }
}
