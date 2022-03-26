var copy_button = document.querySelector("#personal_code");
copy_button.addEventListener('click', () => {
      navigator.clipboard && navigator.clipboard.writeText(socket.id);
});



const loginProcess = (data) => {
      if (data.success === false) { alert('username is not correct try diffren one') }
      else {
            getUserMedia();
      }
};
var call_button = document.querySelector("#call-btn");
var username_input = document.querySelector("#username-input");
call_button.addEventListener('click', () => {
      if (username_input.value.length > 0) { 
            var receiver = username_input.value;
            webrtcOfferPeer(receiver); 
      }
});
