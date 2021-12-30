import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { Session, User, UserDocument } from "./types";
import {
    JSONRPCResponse,
    JSONRPCServer,
} from "json-rpc-2.0";

const server = new JSONRPCServer();

let sessions = [];

server.addMethod("session/start", (params: any[]) => {
    if (params.length != 3) {
        console.log("err");
        return;
    }

    let master: User = {
        uuid: "1",
        username: "test",
        ephemeralIdentity: params[2],
        identityProof: params[3],
    };

    let document: UserDocument = {
        filename: params[1],
        uuid: "1",
    };

    let session: Session = {
        uuid: "1",
        master: master,
        documents: [document],
    };

    sessions.push(session)

    return "success"


});
server.addMethod("session/join", () => {
    return "hey";
});

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
