
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
      console.log(receiver, Localstream);
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
            console.log(offer);
            console.log('occurept error when creating offer', err);
            };
      }; 

const offerProcess = (offer, username) => {
      connection.setRemoteDescription(new RTCSessionDescription(offer)); 

}