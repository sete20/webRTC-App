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
                  this.handleWebRtcAnswer(socket);
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
                  console.log('singalning',data.receiver, socket.id);
                  if ( socket.id != data.receiver) {
                        try {
                              socket.to(data.receiver).emit('reciver-client-side', {
                                    sender: socket.id,
                                    offer: data.offer,
                                    type: data.type,
                                    username: socket.username,
                                    receiver: data.receiver
                              });
                        } catch (e) {
                              console.log(e);
                        }//end catch and try
                  }
            });
      }
       handleWebRtcAnswer (socket)  {
            socket.on('webrtc-handle-answer-server-side', (data) => {
                  console.log('asnwering',data.sender, socket.id);

                  socket.to(data.sender).emit('reciver-client-side', {
                        sender: socket.id,
                        answer: data.answer,
                        type: data.type,
                        username: socket.username,
                        receiver: socket.id
                  });
            });
      };

      handleWebRtcCandidater(socket) {
            socket.on('webrtc-handle-candidate-server-side', (data) => {
                  console.log('candidating', data.receiver, data.sender);
                  socket.to(data.receiver).emit('reciver-client-side', {
                        type: data.type,
                        candidate: data.candidate,
                        sender:data.sender
                  });
            });
      };
      disconnect(socket) {
            socket.on('disconnect', (data) => {
                  this.users.splice(socket.id);
                  this.users.splice(socket.username);
                  console.log(data, socket.id, this.users);
            });
      }


}
module.exports=SocketServer;
