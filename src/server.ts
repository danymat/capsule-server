import { Session, User, UserDocument } from "./types";

let testDocument: UserDocument = {
  filename: "testDocument",
  uuid: "1111",
};

let testMaster: User = {
  uuid: "2222",
  username: "danymat",
  ephemeralIdentity: "1234",
  identityProof: "2345",
};

let session: Session = {
  uuid: "3333",
  master: testMaster,
  documents: [testDocument],
};

console.log(testDocument);
console.log(testMaster);
console.log(session);
