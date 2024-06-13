export class StatisticalData {
    constructor() {
        this.resetHttpRequestOneSum()
    }
    /**
     * 统计一分钟之内请求该请求的次数
     */
    httpRequestOneSum: number

    setHttpRequestOneSum() {
        this.httpRequestOneSum += 1;
    }

    resetHttpRequestOneSum() {
        this.httpRequestOneSum = 0
    }

    getHttpRequestOneSum():number{
        return this.httpRequestOneSum
    }
}

const statisticalData = new StatisticalData()

export function getStatisticalData() {
    return statisticalData
}