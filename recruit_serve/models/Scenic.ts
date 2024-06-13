export class Scenic {
    private scenicId: number;
    private scenicName: string;
    private scenicImg: string;
    private x: number;
    private y: number;
    private scenicContext: string;
    private gray: boolean;

    /**
     *
     * @param scenicId 景点的ID
     * @param scenicName 景点的名称
     * @param scenicImg 景点的背景图
     * @param x  景点在地图的X坐标
     * @param y  景点在地图的Y坐标
     * @param 景点的详情介绍
     */
    constructor(scenicId: number, scenicName?: string, scenicImg?: string, x?: number, y?: number, scenicContext?: string,) {
        this.scenicId = scenicId;
        this.scenicName = scenicName;
        this.scenicImg = scenicImg;
        this.y = y;
        this.x = x;
        this.scenicContext = scenicContext;
    }
    public setScenicContext(scenicContext: string): void {
        this.scenicContext = scenicContext;
    };

    public getScenicContext(): string {
        return this.scenicContext;
    };

    public setY(y: number): void {
        this.y = y;
    };

    public getY(): number {
        return this.y;
    };

    public setX(x: number): void {
        this.x = x;
    };

    public getX(): number {
        return this.x;
    };


    public setScenicImg(scenicImg: string): void {
        this.scenicImg = scenicImg;
    };

    public getScenicImg(): string {
        return this.scenicImg;
    };

    public setScenicName(scenicName: string): void {
        this.scenicName = scenicName;
    };

    public getScenicName(): string {
        return this.scenicName;
    };

    public setScenicId(scenicId: number): void {
        this.scenicId = scenicId;
    };

    public getScenicId(): number {
        return this.scenicId;
    };
    public setGray(gray:boolean):void{
        this.gray = gray;
    };

    public getGray():boolean{
        return this.gray;
    };

}
