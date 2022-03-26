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
                        console.log(data.offer);
                        offerProcess(data.offer, data.username, data.sender, data.receiver);
                        break;
                  case "answer":
                        console.log('handleWebRtcAnswerServerSide => ', data);
                        answerProcess(data.answer, data.username, data.sender,data.receiver);
                        break;
                  case "candidate":
                        console.log('handleWebRtcCandidateServerSide => ', data);
                        candidateProcessing( data.sender, data.receiver);
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
            type: data.type
      
      });
}

const handleWebRtcAnswerServerSide = (data) => {
      socket.emit('webrtc-handle-answer-server-side',{
            type: data.type,
            answer: data.answer,
            sender: data.sender,
            username: data.username 
      });
};
const processIceCandidate = (data) => {
      socket.emit('webrtc-handle-candidate-server-side', {
            type: data.type,
            candidate: data.candidate,
            receiver: data.receiver
            ,sender: data.sender
      });
};

