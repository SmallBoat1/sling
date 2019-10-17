import Level from "./Level";
import Recard from "./Recard";

export default class DBMgr {

    public static LevelRecard = {};
    private static readonly configFile:string = "json/levels.json";
    public static Levels:Array<Level> = new Array<Level>();

    public static loadConfig() 
    {
        cc.loader.loadRes(this.configFile,function(error: Error, resource: any){
            //if(resource)
            console.log(resource.count);
        });
    }

    public static LoadAll(levelCount:number) {
        for (let i = 1; i <= levelCount; i++) {
          let rs =  cc.sys.localStorage.getItem("level_" + i);
          if(rs== null) break;
          var r = JSON.parse(rs);
          this.LevelRecard[i] = r;
        }
    }

    public static Save(level:number,score1:number,score2:number)
    {
        let rs =  cc.sys.localStorage.getItem("level_" + level);
        if(rs == null)
        {
            var r = new Recard(level,score1,score2);
            cc.sys.localStorage.setItem("level_"+level,JSON.stringify(r));
        }
        else
        {
            let r:Recard = JSON.parse(rs);
            if(score1 > r.score1)r.score1 = score1;
            if(score2 > r.score2) r.score2 = score2;
            cc.sys.localStorage.setItem("level_"+level,JSON.stringify(r));
        }
    }
}