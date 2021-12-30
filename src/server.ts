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

    let master: User = new User(params[2], params[3])
    let document: UserDocument = new UserDocument(params[1])
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

    const document = documents.find((d: UserDocument) => d.filename == params[1]);
    if (!document) {
        console.log("No document found..")
        return
    }

    let session: Session = sessions.find((s: Session) => s.documents.find((d: UserDocument) => d.filename == document.filename))
    if (!session) {
        console.log("No session found for document ", document.filename)
        return
    }

    let newUser: User = new User(params[2], params[3])

    session.addUser(newUser)

    return "success"

});

server.addMethod('test/sessions', () => sessions)

const app = express();
app.use(bodyParser.json());

app.post("/json-rpc", (req: Request, res: Response) => {
    const jsonRPCRequest = req.body;
    // server.receive takes a JSON-RPC request and returns a promise of a JSON-RPC response.
    // It can also receive an array of requests, in which case it may return an array of responses.
    // Alternatively, you can use server.receiveJSON, which takes JSON string as is (in this case req.body).
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
