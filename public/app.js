const ws = new WebSocket(location.origin.replace(/^http/, 'ws'));
let peer;

navigator.mediaDevices.getUserMedia({ audio: true, video: false })
  .then(stream => {
    peer = new SimplePeer({ initiator: location.hash === '#1', trickle: false, stream });

    peer.on('signal', data => {
      ws.send(JSON.stringify(data));
    });

    peer.on('stream', remoteStream => {
      const audio = new Audio();
      audio.srcObject = remoteStream;
      audio.play();
    });
  })
  .catch(err => console.error('Error accessing media devices.', err));

ws.onmessage = msg => {
  const data = JSON.parse(msg.data);
  peer.signal(data);
};
