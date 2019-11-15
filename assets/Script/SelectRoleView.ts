import GameMgr from "./GameMgr";
import RoleItem from "./RoleItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SelectRoleView extends cc.Component {

    @property(cc.Button)
    close: cc.Button = null;

    @property(cc.Node)
    scroll: cc.Node = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    itemPre: cc.Node = null;

    @property
    list:Array<cc.Node> = new Array<cc.Node>();

    Close()
    {
        if(this.node.active)this.node.active = false;                          
    }

    init()
    {
        var self = this;
        var rlist = GameMgr.instance.db.roles;

        if (self.list == null) 
            self.list = new Array<cc.Node>();
        else {
            self.list.forEach(item => {
                item.active = false;
            });
        }

        for (let i = 0; i < rlist.length; i++) {
            const r = rlist[i];
            if (i >= this.list.length) {
            var item = cc.instantiate(self.itemPre);
            item.parent = self.content;
            item.active = true;
            self.list.push(item);
            }
            self.list[i].getComponent(RoleItem).Init(r.id,r.lock,r.progress,r.select,r.sp);
        }
    } 
}
