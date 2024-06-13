export class ClockInfo {
    private clockInfoId: number;
    private scenicId: number;
    private userId: string;
    private clockTime: string;
    private clockImageList: string;
    private clockText: string;
    private userName: string;
    private userImg: string;
    private clockImageLists:Array<string>;
    private canvasImg:string;
    constructor(userId: string){
        this.userId = userId
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
    public setClockText(clockText: string): void {
        this.clockText = clockText;
    };

    public getClockText(): string {
        return this.clockText;
    };

    public setClockImageList(clockImageList: string): void {
        this.clockImageList = clockImageList;
    };

    public getClockImageList(): string {
        return this.clockImageList;
    };

    public setCLockTime(clockTime: string): void {
        this.clockTime = clockTime;
    };

    public getClockTime(): string {
        return this.clockTime;
    };

    public setUserId(userId: string): void {
        this.userId = userId;
    };

    public getUserId(): string {
        return this.userId;
    };

    public setScenicId(scenicId: number): void {
        this.scenicId = scenicId;
    };

    public getScenicId(): number {
        return this.scenicId;
    };

    public setClockInfoId(clockInfoId: number): void {
        this.clockInfoId = clockInfoId;
    };

    public getClockInfoId(): number {
        return this.clockInfoId;
    };

    public setClockImageLists(clockImageLists: Array<string>): void {
        this.clockImageLists = clockImageLists;
    };

    public getClockImageLists():Array<string> {
        return this.clockImageLists;
    };

    public setCanvasImg(canvasImg:string):void{
        this.canvasImg = canvasImg;
    };

    public getCanvasImg():string{
        return this.canvasImg;
    };
}
