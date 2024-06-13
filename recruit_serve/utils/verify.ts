export default class Verify {
    public static verifyObject(object: Object, verifyMap: Object) {
        const keys = Object.keys(verifyMap);
        let d, key;
        for (let i = 0; i < keys.length; i++) {
            key = keys[i];
            d = object[key]
            if (d === undefined || d === '' || d === null) {
                return verifyMap[key]
            }
        }
    }
}