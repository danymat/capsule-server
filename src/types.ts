export class UserDocument {
    filename: string;
    uuid: string;

    constructor(filename: string) {
        this.filename = filename
        this.uuid = "1"
    }
};

export class User {
    uuid: string;
    username: string;
    ephemeralIdentity: string;
    identityProof: string;

    constructor(ephemeralIdentity: string, identityProof: string) {
        this.ephemeralIdentity = ephemeralIdentity
        this.identityProof = identityProof
        this.uuid = "1"
        this.username = "test"
    }
};

export class Session {
    uuid: string;
    master: User;
    documents: UserDocument[] = [];
    users: User[] = [];

    constructor(master: User) {
        this.master = master
    }

    addDocument(d: UserDocument) {
        this.documents.push(d)
    }

    addUser(user: User) {
        this.users.push(user)
    }
};
