type stringType = string | undefined | null;
export interface User {
    id: stringType,
    email: stringType,
    fname: stringType,
    lname: stringType,
    uname: stringType,
    password: stringType,
    subscribe: boolean | undefined | null
}
