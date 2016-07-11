app.factory('chatSocket', ['socketFactory', function(socketFactory) {
	return socketFactory({
		ioSocket: io.connect('127.0.0.1:4000')
	});
}])