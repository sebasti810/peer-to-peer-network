# peer to peer network

## Solution for Web3 - Build a Peer-to-Peer Network

For this project, you need to create a distrubuted peer-to-peer network in the build-a-peer-to-peer-network folder. You are started with some boilerplate code and files, you should not need to change any of the boilerplate code. The node-1 folder represents a node on your network. The files in it will be cloned and used to run all the other nodes on the network. You only need to change the index.js file in there.

To build the project, use the imported WebSocket and WebSocketServer variables to create a Web Socket server in the index.js file that listens for incoming socket connections and creates a socket connection to all the other nodes on the network.

To test if your nodes are connecting to each other, run node clone-node.js to clone your node-1. It will use the next available folder number, and the PORT in its .env file will correspond to that. e.g. The first time you clone a node, it will create a node-2 folder with 4002 set as the PORT. After that, go into each of your node-x folders in their own terminal and run node index.js to start each of the servers. If you want to make changes to your node after that, you can run node delete-nodes.js to delete all the nodes except node-1, then make your changes to node-1, and clone it again.

When you think you are done, run at least three nodes that all connect to each other.

User Stories:

[x] Your index.js should create a web socket server listening on the port in its .env file

[x] When a web socket server starts, it should attempt to open a socket connection to all the addresses in the known-peers.json array. Use the predefined knownPeers variable

[x] Whenever a socket connection to a server is established, it should send a message that is a stringified JSON object of { type: 'HANDSHAKE', data: <array> } to it. data should be an array of addresses that your server is connected to, including the server's own address

[x] When a server receives the above message, it should attempt to open a socket connection to all the addresses in the data array that it is not already connected to

[x] You should keep track of all the addresses a server is connected to. You can use the predefined connectedAddresses array

[x] When a socket disconnects, you should remove it from your connectedAddresses array

[x] You should keep track of the servers you are attempting to make a connection to so you don't try to make more than one connection to the same server. You can use the predefined attemptingToConnectToAddress variable. Be sure to remove an address after you establish a connection or fail to connect

[x] A server should never attempt to create a socket connection to its own address

[x] You should clone your node-1 folder at least two times

[x] All of your nodes should have the exact same code, with the exception of the .env file

[x] You should have at least three nodes running, that use ports 4001, 4002, and 4003

[x] All of your nodes should have an open socket connection to all other nodes

[x] Bonus: The add-transaction.js file is completed so that when you run node add-transaction.js from a node-x folder, it sends { type: 'TRANSACTION', data: <transaction_object> } to your server. Make it so when a server receives this message, it uses the imported writeTransactions function to add it to its local transaction pool (transactions.json) and sends the same message to all the other servers, where they do the same thing. You may need to get creative to stop infinite loops of messages.
