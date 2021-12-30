import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { Session, User, UserDocument } from "./types";
import {
    JSONRPCResponse,
    JSONRPCServer,
} from "json-rpc-2.0";

const server = new JSONRPCServer();

// Act as a temporary database
let sessions = [];
let documents = [];

server.addMethod("session/start", (params: any[]) => {
    if (params.length != 3) {
        console.log("err");
        return;
    }


    let document: UserDocument = new UserDocument(params[0])
    let master: User = new User(params[1], params[2])
    let session: Session = new Session(master)
    session.addDocument(document)

    sessions.push(session)
    documents.push(document)

    return "success"


});

server.addMethod("session/join", (params: any[]) => {
    if (params.length != 3) {
        console.log("err")
        return
    }

    const document = documents.find((d: UserDocument) => d.filename == params[0]);
    if (!document) {
        console.log("No document found..")
        return
    }

    let session: Session = sessions.find((s: Session) => s.documents.find((d: UserDocument) => d.filename == document.filename))
    if (!session) {
        console.log("No session found for document ", document.filename)
        return
    }

    let newUser: User = new User(params[1], params[2])

    let userIdentities = session.getUsersIdentities()
    session.addUser(newUser)

    return userIdentities

});

server.addMethod('test/sessions', () => sessions)

const app = express();
app.use(bodyParser.json());

app.post("/json-rpc", (req: Request, res: Response) => {
    const jsonRPCRequest = req.body;
    server.receive(jsonRPCRequest).then((jsonRPCResponse: JSONRPCResponse) => {
        if (jsonRPCResponse) {
            res.json(jsonRPCResponse);
        } else {
            // If response is absent, it was a JSON-RPC notification method.
            // Respond with no content status (204).
            res.sendStatus(204);
        }
    });
});

app.listen(80);
