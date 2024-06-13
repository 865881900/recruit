export class PagingSearch<T> {
    // 第几页
    pageNumber: number
    // 每页多少条
    pageSize: number
    // 一共多少条
    pageCount: number
    // 开始时间
    startData: Date
    // 结束时间
    endData: Date

    // 数据
    data: Array<T>

    constructor(
        pageNumber: number,
        pageSize: number,
        startData?: Date,
        endData?: Date
    ) {
        this.pageNumber = (pageNumber - 1) * pageSize;
        this.pageSize = pageSize;
        startData && (this.startData = startData);
        endData && (this.endData = endData);
    }

}
