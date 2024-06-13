export class GiveLike {

    private giveLikeId: number;
    private datetime: string;
    private userName: string;
    private clockInfoId: string;
    private userImg: string;


    public setUserImg(userImg: string): void {
        this.userImg = userImg;
    };

    public getUserImg(): string {
        return this.userImg;
    };

    public setClockInfoId(clockInfoId: string): void {
        this.clockInfoId = clockInfoId;
    };

    public getClockInfoId(): string {
        return this.clockInfoId;
    };

    public setUserName(userName: string): void {
        this.userName = userName;
    };

    public getUserName(): string {
        return this.userName;
    };

    public setDatetime(datetime: string): void {
        this.datetime = datetime;
    };

    public getDatetime(): string {
        return this.datetime;
    };

    public setGiveLikeId(giveLikeId: number): void {
        this.giveLikeId = giveLikeId;
    };

    public getGiveLikeId(): number {
        return this.giveLikeId;
    };
}
