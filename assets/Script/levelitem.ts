import Level from "./Level";
import GameEventMgr from "./GameEventMgr";
import { EventMessage } from "./EventMessage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class levelItem extends cc.Component {

    @property(cc.Node)
    finish: cc.Node = null;
    @property(cc.Label)
    finishlevel: cc.Label = null;

    @property(cc.Node)
    playing: cc.Node = null;
    @property(cc.Label)
    playinglevel: cc.Label = null;

    @property(cc.Node)
    crown: cc.Node = null;
    @property(cc.Node)
    cup: cc.Node = null;

    data: Level = null;
    pass: boolean = false;
    getCrown: boolean = false;
    getcup: boolean = false;

    setData(data: Level, pass: boolean, crown: boolean, cup: boolean) {
        this.data = data;
        this.pass = pass;
        this.getCrown = crown;
        this.getcup = cup;
        this.init();
    }

    private init() {
        var self = this;
        self.finish.active = self.pass;
        self.playing.active = !self.pass;
        if(self.pass)
            self.finishlevel.string = self.data.id.toString();
        else          
            self.playinglevel.string = self.data.id.toString();

        self.crown.children[0].active = !self.getCrown;
        self.crown.children[1].active = self.getCrown;

        self.cup.children[0].active = !self.getcup;
        self.cup.children[1].active = self.getcup;
    }

    public onClick()
    {
        GameEventMgr.emit(EventMessage.GE_SelectLevel,this.data.id);
    }
}