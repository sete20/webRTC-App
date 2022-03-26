'use strict';
class SocketServer{
	constructor(socket)
	{
        this.io = socket;
        this.users = [];
            this.status = '';
         
      }
      ioConfig() {
            this.io.use((socket, next) => {
                  socket['username'] = socket.handshake.query.username;
                  next();
            });
      }
      
      socketConnection()
      {
            this.ioConfig();
            this.io.on('connection', (socket) => {
                  this.users.push(socket.id);
                  console.log(this.users);
                  this.checkUserAuth(socket);
                  this.signalingServerSide(socket);
                  this.disconnect(socket);

            });
      }
      checkUserAuth(socket) {
            socket.on('login-server-side', (data) => {
                  if (this.users.includes(data.username)) {
                        socket.emit('login-client-side', {
                              type: "login",
                              success: false
                        });
                  } else {
                        this.users.push(data.username);
                        socket.username = data.username
                        socket.emit('login-client-side', {
                              type: "login",
                              success: true
                        });
                  }
            });
      }
      signalingServerSide(socket){
            socket.on('call-server-side', (data) => {
                  console.log(data.receiver, socket.username);
                  if ( socket.id != data.receiver) {
                        try {
                              socket.to(data.receiver).emit('reciver-client-side', {
                                    sender: socket.id,
                                    offer: data.offer,
                                    type: data.type,
                                    username:socket.username
                              });
                        } catch (e) {
                              console.log(e);
                        }//end catch and try
                  }
            });
      }

      disconnect(socket) {
            socket.on('disconnect', (data) => {
                  this.users.splice(socket.id);
                  this.users.splice(socket.username);
                  console.log(data, socket.id, this.users);
            });
      }


}
module.exports=SocketServer;
