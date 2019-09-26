import SceneMgr from "./SceneMgr";
import MissionMgr from "./MissionMgr";
import UI_Main from "./UI_Main";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameMgr extends cc.Component 
{
    @property(SceneMgr)
    scene:SceneMgr = null;
    @property(MissionMgr)
    mission:MissionMgr=null;
    @property(UI_Main)
    ui:UI_Main = null;
    
    start()
    {
        this.scene.init();
    }
}
