const socket = io('https://helpservicechat.herokuapp.com/');

socket.on('DANH_SACH_ONLINE', arrUserInfo => {
  arrUserInfo.forEach(user => {
    const { name, peerId } = user;
    $('#ulUser').append(`<li id="${peerId}">${name}</li>`);
  });


  socket.on('NGUOI_DUNG_MOI', user => {
    const { name, peerId } = user;
    $('#ulUser').append(`<li id="${peerId}">${name}</li>`);
  });

  socket.on('USER_DISCONNECTED', peerId => {
    $(`#${peerId}`).remove();
  });
});

function openStream() {
  const config = { audio: true, video: true };
  return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
  const video = document.getElementById(idVideoTag);
  video.srcObject = stream;
  video.play();
}

const peer = new Peer();

peer.on('open', id => {
  $("#peer-id").append(id);

  $('#login').click(() => {
    const username = $('#user-name').val();
    socket.emit('USER_NAME', { name: username, peerId: id });
  });
});

//Caller
$("#connect").click(() => {
  const id = $('#another-id').val();

  openStream().then(stream => {
    playStream('localStream', stream);

    var call = peer.call(id, stream);
    call.on('stream', remoteStream => playStream('remoteStream', remoteStream))
  })
});

//Callee
peer.on('call', call => {
  openStream()
    .then(stream => {
      call.answer(stream); // Answer the call with an A/V stream.
      playStream('localStream', stream)
      call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});

$('#ulUser').on('click', 'li', function () {
  const id = $(this).attr('id');

  openStream().then(stream => {
    playStream('localStream', stream);

    var call = peer.call(id, stream);
    call.on('stream', remoteStream => playStream('remoteStream', remoteStream))
  });
});
