export type UserDocument = {
  filename: string;
  uuid: string;
};

export type User = {
  uuid: string;
  username: string;
  ephemeralIdentity: string;
  identityProof: string;
};

export type Session = {
  uuid: string;
  master: User;
  documents: UserDocument[];
};
