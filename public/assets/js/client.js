var name = null;
var local_video = document.querySelector("#local-video");
var url_string = window.location.href;
var url = new URL(url_string);
var username = url.searchParams.get("username");
let ip_address = '127.0.0.1';
let socket_port = '3000';
var socket = io('ws://' + ip_address + ':' + socket_port,
      { query: { username: username } }
);
socket.on('connect', function () {

      if (username != null && username.length > 0) {
            socket.emit('login-server-side', {
                  type: "login",
                  username: username
            });
      }
      socket.on('login-client-side', (data) => {
            loginProcess(data);
      });

      socket.on('reciver-client-side', (data) => {
            switch (data.type) {
                  case "offer":
                        console.log(data);
                        offerProcess(data.offer,data.username);
                        break;
                  
                  default:
                        break;
            }
      });
      
});
const callServerSide = (data) => {
      // console.log(data);
      socket.emit('call-server-side', {
            receiver:data.receiver,
            offer: data.offer,
            type:data.type});
}

