export class UserInfo {
    private _password: string
    private _userName: string
    private _name: string
    private _userInfoID: string

    get userInfoID(): string {
        return this._userInfoID;
    }

    set userInfoID(value: string) {
        this._userInfoID = value;
    }

    constructor(password?: string, userName?: string, name?: string) {
        this._password = password;
        this._userName = userName;
        this._name = name;
    }

    get password(): string {
        return this._password;
    }

    set password(value: string) {
        this._password = value;
    }

    get userName(): string {
        return this._userName;
    }

    set userName(value: string) {
        this._userName = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }
}