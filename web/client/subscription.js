export default class Subscription {
  constructor(uri, onOpen, onDisconnect, onError) {
    this.reset()
    this.socket = new WebSocket(uri);
    this.socket.onopen = (event) => {
      onOpen && onOpen(event);
    };
    this.socket.onclose = (event) => {
      this.socket = null;
      onDisconnect && onDisconnect(event);
    };
    this.socket.onerror = (event) => {
      this.socket.close();
      onError && onError(event);
    };
    this.socket.onmessage = (event) => {
      this.handleMessage(event);
    }
  }

  subscribe(callback) {
    this.callbacks.push(callback)
  }

  unsubscribe(callback) {
    if (callback) {
      const index = this.callbacks.indexOf(callback)
      this.callbacks.splice(index, 1)
    } else {
      this.reset()
    }
  }

  close() {
    if (this.socket) this.socket.close()
  }

  reset() {
    this.callbacks = []
  }

  handleMessage(event) {
    const response = JSON.parse(event.data);
    for (var i = 0, l = this.callbacks.length; i < l; i++) {
      var callback = this.callbacks[i];
      if (typeof(callback) == 'function') {
        callback(response)
      }
    }
  }
}
