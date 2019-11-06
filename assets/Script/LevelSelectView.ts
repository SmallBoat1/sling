import levelItem from "./levelitem";
import GameMgr from "./GameMgr";
import GameEventMgr from "./GameEventMgr";
import { EventMessage } from "./EventMessage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LevelSelectView extends cc.Component {
    @property(cc.Prefab)
    item: cc.Prefab = null;
    @property(cc.Node)
    content: cc.Node = null;

    itemlist:Array<cc.Node>;

    Close()
    {
        if(this.node.active)this.node.active = false;                          
    }

    start()
    {
        GameEventMgr.register(EventMessage.GE_SelectLevel,this.Close,this);
    }

    Init() {

        var lc = GameMgr.instance.db.Levels;
        var lr = GameMgr.instance.db.LevelRecard;

        if (this.itemlist == null) this.itemlist = new Array<cc.Node>();
        else {
            this.itemlist.forEach(item => {
                item.active = false;
            });
        }

        for (let i = 0; i < lc.length; i++) {
            const l = lc[i];
            if (i >= this.itemlist.length) {
                var item = cc.instantiate(this.item);
                item.parent = this.content;
                this.itemlist.push(item);
            }
            this.itemlist[i].active = true;
            let r = i >= lr.length ? null : lr[i];
            var it = this.itemlist[i];
            it.getComponent(levelItem).setData(l, r != null, r == null ? false : r.score1 == 1, r == null ? false : r.score1 == 1);
        }
    }
}