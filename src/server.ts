import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { Session, User, UserDocument } from "./types";
import {
    JSONRPCResponse,
    JSONRPCServer,
} from "json-rpc-2.0";
import { Server } from "socket.io";

const app = express();
app.use(bodyParser.json());

// Creates the websocket
const _server = require('http').Server(app)
const io: Server = require('socket.io')(_server)


// Act as a temporary database
let sessions = [];
let documents = [];

// Creates the json-rpc handling
const server = new JSONRPCServer();

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

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    if (Object.keys(socket.data).length === 0) {
        console.log()
        return
    }
    server.receive(JSON.parse(socket.data.toString())).then((jsonRPCResponse: JSONRPCResponse) => { return socket.emit("hey", jsonRPCResponse) })
})



_server.listen(80);

