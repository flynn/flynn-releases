import HTTP from 'marbles/http';
import JSONMiddleware from 'marbles/http/middleware/serialize_json';
import MainComponent from 'views/main';

var $appContainer = document.getElementById("app-container");
var render = function (state) {
	ReactDOM.render(
		React.createElement(MainComponent, state),
		$appContainer
	);
};

render({
	channels: [],
	loading: true
});

HTTP({
	method: 'GET',
	url: '/api/channels',
	middleware: [JSONMiddleware]
}).then(function (args) {
	render({
		channels: args[0],
		loading: false
	});
}).catch(function () {
	render({
		channels: [],
		loading: false,
		error: 'GET /api/channels Error!'
	});
});
