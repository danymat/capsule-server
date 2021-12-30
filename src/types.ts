import { v4 as uuidv4 } from 'uuid';

class UserDocument {
    filename: string;
    uuid: string;

    constructor(filename: string) {
        this.filename = filename
        this.uuid = uuidv4()
    }
};

class User {
    uuid: string;
    username: string;
    ephemeralIdentity: string;
    identityProof: string;

    constructor(ephemeralIdentity: string, identityProof: string) {
        this.ephemeralIdentity = ephemeralIdentity
        this.identityProof = identityProof
        this.uuid = uuidv4()
        this.username = "test"
    }
};

class Session {
    uuid: string;
    master: User;
    documents: UserDocument[] = [];
    users: User[] = [];

    constructor(master: User) {
        this.master = master
        this.users.push(master)
        this.uuid = uuidv4()
    }

    addDocument(d: UserDocument) {
        this.documents.push(d)
    }

    addUser(user: User) {
        this.users.push(user)
    }

    getUsersIdentities() {
        let res = []
        this.users.forEach(u => { res.push([u.ephemeralIdentity, u.identityProof]) })
        return res
    }
};

export { User }
export { Session }
export { UserDocument }
