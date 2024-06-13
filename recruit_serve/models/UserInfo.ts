export class UserInfo {
    private openId: string;
    private sessionId: string;
    private userName: string;
    private userImg: string;

    constructor(openId: string, sessionId?: string, userName?: string, userImg?: string,) {
        this.openId = openId;
        this.sessionId = sessionId;
        this.userName = userName;
        this.userImg = userImg;
    }

    public setUserImg(userImg: string): void {
        this.userImg = userImg;
    };

    public getUserImg(): string {
        return this.userImg;
    };

    public setUserName(userName: string): void {
        this.userName = userName;
    };

    public getUserName(): string {
        return this.userName;
    };

    public setSessionId(sessionId: string): void {
        this.sessionId = sessionId;
    };

    public getSessionId(): string {
        return this.sessionId;
    };


    public setOpenId(openId: string): void {
        this.openId = openId;
    };

    public getOpenId(): string {
        return this.openId;
    };

}
