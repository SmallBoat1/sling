
export default class DBMgr {

    LevelRecard = {};

    public LoadAll(levelCount:number) {
        for (let i = 1; i <= levelCount; i++) {
          let r =  cc.sys.localStorage.getItem("level_" + i);
          if(r== null) break;
          this.LevelRecard[i] = r;
        }
    }

    public Save(level:number,score1:number,score2:number)
    {
        cc.sys.localStorage.setItem("level_"+level,JSON.stringify(["score1",score1]));
    }

}
