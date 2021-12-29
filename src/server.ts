import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { Session, User, UserDocument } from "./types";
import {
    isJSONRPCResponse,
    JSONRPCClient,
    JSONRPCResponse,
    JSONRPCServer,
    JSONRPCServerAndClient,
} from "json-rpc-2.0";

// TODO: Remove this

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

const server = new JSONRPCServer();

server.addMethod("echo", (text) => text);
server.addMethod("log", (message) => console.log(message));

const app = express();
app.use(bodyParser.json());

app.post("/json-rpc", (req, res) => {
    const jsonRPCRequest = req.body;
    // server.receive takes a JSON-RPC request and returns a promise of a JSON-RPC response.
    // It can also receive an array of requests, in which case it may return an array of responses.
    // Alternatively, you can use server.receiveJSON, which takes JSON string as is (in this case req.body).
    server.receive(jsonRPCRequest).then((jsonRPCResponse) => {
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
