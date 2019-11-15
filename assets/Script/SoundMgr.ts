
const { ccclass, property } = cc._decorator;

@ccclass
export default class SoundMgr extends cc.Component 
{

    path:string = "/sound/";
    @property
    Volume:number = 0;

    @property(cc.AudioSource)
    audio:cc.AudioSource = null;

    public SetVolume(v:number)
    {
        var self = this;
        self.Volume = v;
        self.audio.volume = self.Volume;
    }

    public Play(name:string)
    {
        var self = this;
        cc.loader.loadRes(self.path+name);
    }
}