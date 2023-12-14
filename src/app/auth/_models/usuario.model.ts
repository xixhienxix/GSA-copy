export interface IUser{
    cn: string,
    departmentnumber: string,
    displayname: string,
    dn: string,
    gecos: string,
    gidnumber: number,
    givenname: string,
    has_keytab: boolean,
    has_password: boolean,
    homedirectory: string,
    initials: string,
    ipauniqueid: string,
    ipauserauthtype: string,
    krbcanonicalname: string,
    krblastpwdchange: {
      __datetime__: string
    },
    krbpasswordexpiration: {
      __datetime__: string
    },
    krbprincipalname: string,
    loginshell: string,
    mail: string,
    managerof_group: [],
    memberof_group: [],
    nsaccountlock: boolean,
    preserved: boolean,
    sn: string,
    uid: string,
    uidnumber: number,
    users_owned: [],
    ou: string
}

