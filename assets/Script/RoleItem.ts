import GameEventMgr from "./GameEventMgr";
import { EventMessage } from "./EventMessage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RoleItem extends cc.Component 
{
    @property(cc.Node)
    ulockGround:cc.Node = null;
    @property(cc.Toggle)
    select:cc.Toggle = null;
    
    @property(cc.Sprite)
    icon:cc.Sprite = null;

    @property(cc.ProgressBar)
    progress:cc.ProgressBar = null;

    @property(cc.Node)
    lock:cc.Node = null;

    id:number= 0;

    Init(id:number,unlock:boolean,progress:number,select:boolean,sp:string)
    {
        var self = this;
        self.id = id;
        self.ulockGround.active = unlock;
        self.lock.active = !unlock;
        self.progress.node.active = !unlock;

        self.select.isChecked = select;
        cc.loader.loadRes("icon/character_0" + id,cc.SpriteFrame,function (erro:Error,frame:cc.SpriteFrame) {
            if(erro)
            {
                return;
            }
            self.icon.spriteFrame = frame;
        });
    }

    onSelect()
    {
        var self = this;
        GameEventMgr.emit(EventMessage.GE_SelectRole,self.id);
    }
}