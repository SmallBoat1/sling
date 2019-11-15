import Level from "./Level";
import Recard from "./Recard";
import GameEventMgr from "./GameEventMgr";
import { EventMessage } from "./EventMessage";
import Role from "./Role";
const { ccclass, property } = cc._decorator;

@ccclass
export default class DBMgr extends cc.Component {

    @property
    public LevelRecard: Array<Recard> = new Array<Recard>();
    @property
    private readonly configFile: string = "levels";
    @property
    private readonly roleFiles:string= "roles";
    @property(Array)
    public Levels: Array<Level> = new Array<Level>();

    @property(Array)
    public roles: Array<Role> = new Array<Role>();

    @property
    loadend:boolean = false;

    public loadConfig() {
        var self = this;
        let onComplate  =  function (error: Error, levelConfigs: cc.JsonAsset[], urls: string[]) {
            if (error) return;
            if (levelConfigs.length == 0) {
                console.log("没有关卡配置");
                return;
            }
            for (let i = 0; i < levelConfigs.length; i++) {
                const element = levelConfigs[i];
                var level = new Level();
                level = element.json;
                self.Levels.push(level);
                console.log(level);
            }
            self.LoadRecard();
            self.loadend = true;
        };
        cc.loader.loadResDir(this.configFile,onComplate);
    }

    public loadRoleConfig(loaded:Function)
    {
        var self = this;
        let onComplate  =  function (error: Error, roleConfigs: cc.JsonAsset[], urls: string[]) {
            if (error) return;
            if (roleConfigs.length == 0) {
                console.log("没有角色配置");
                return;
            }
            for (let i = 0; i < roleConfigs.length; i++) {
                const element = roleConfigs[i];
                var role = new Role();
                role = element.json;
                self.roles.push(role);
                console.log(role);
            }
            self.loadRoleProgress();
            loaded();
        };
        cc.loader.loadResDir(this.roleFiles,onComplate);
    }

    loadRoleProgress()
    {
        var self = this;
        for (let i = 1; i <= self.roles.length; i++) {
            let rs = cc.sys.localStorage.getItem("role_" +self.roles[i].id);
            if (rs == null) break;
            
            self.roles[i].progress = rs;
            self.roles[i].lock =  rs >= 1;
            console.log("role " + rs);
        }
    }

    public SaveCurlevel(level :number)
    {
        cc.sys.localStorage.setItem("curLevel",level);
    }

    public loadCurlevel() {
        let rs = cc.sys.localStorage.getItem("curLevel");
        if (rs == null) return 1;
        return rs;
    }

    public LoadRecard() {
        console.log("LoadRecard");
        this.LevelRecard = new Array<Recard>();
        for (let i = 1; i <= this.Levels.length; i++) {
            let rs = cc.sys.localStorage.getItem("level_" + i);
            if (rs == null) break;
            var r = JSON.parse(rs);
            this.LevelRecard[i -1] = r;
            console.log("LoadRecard " + rs);
        }
        
    }

    public Save(level: number, score1: number, score2: number) {
        console.log("level " + level + " score1 " + score1);
        let rs = cc.sys.localStorage.getItem("level_" + level);
        if (rs == null) {
            var r = new Recard(level, score1, score2);
            cc.sys.localStorage.setItem("level_" + level, JSON.stringify(r));
            this.LevelRecard.push(r);
        }
        else {
            let r: Recard = JSON.parse(rs);
            if (score1 > r.score1) r.score1 = score1;
            if (score2 > r.score2) r.score2 = score2;
            cc.sys.localStorage.setItem("level_" + level, JSON.stringify(r));
            this.LevelRecard[level] = r;
        }
    }
}