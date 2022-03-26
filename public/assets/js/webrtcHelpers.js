
let Localstream;
let configuration = {
      "iceServers": [{
            "url": "stun:stun2.1.google.com:19302"
      }]
};
let connection = new webkitRTCPeerConnection(configuration, {
      //      optional :[{ RtpDataChannels:true}]
});

const getUserMedia = () => {
      navigator.getUserMedia(

            { audio: false, video: true },
            (stream) => {
                  Localstream = stream;
                  if ("srcObject" in local_video) {
                        local_video.srcObject = stream;
                        // webrtcOfferPeer(stream);

                  } else {
                        // Avoid using this in new browsers, as it is going away.
                        local_video.src = window.URL.createObjectURL(stream);
                  }
            },
            (err) => {
                  console.log(err);
            });    
};
const webrtcOfferPeer = (receiver) => {
      connection.addStream(Localstream);
      connection.createOffer().then((offer) => {
            connection.setLocalDescription(offer);
            callServerSide(
                  {
                        receiver: receiver,
                        offer: offer,
                        type: "offer"
                  }
            );
      }), (err) => {
            console.log('occurept error when creating offer', err);
            };
      }; 

const offerProcess = (offer, username, sender) => {
      // console.log(offer, username, sender);
      connection.setRemoteDescription(new RTCSessionDescription(offer)); 
      connection.createAnswer().then((answer) => {
            connection.setLocalDescription(answer);
            handleWebRtcAnswerServerSide({
                  type: "answer",
                  answer: answer,
                  sender: sender,
                  username: username
            }
            );
      });
}
const answerProcess = (answer, username, sender, receiver) => {
      connection.setRemoteDescription(new RTCSessionDescription(answer));
}
const candidateProcessing = (receiver,sender) => {
      connection.onicecandidate = (event) => {
            if (event.candidate == true) {
                processIceCandidate  ({
                        type: "candidate",
                        candidate: event.candidate,
                        receiver: receiver
                        ,sender:sender
                  });
            }
      };
}
