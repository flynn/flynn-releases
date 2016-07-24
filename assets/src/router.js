import Router from 'marbles/router';
import LoadingComponent from 'views/loading';
import MainComponent from 'views/main';
import ReleaseComponent from 'views/release';
import NotFoundComponent from 'views/404';
import ErrorComponent from 'views/error';

var MainRouter = Router.createClass({
	routes: [
		{ path: '/', handler: 'mainHandler' },
		{ path: '/:channel/:version', handler: 'releaseHandler' }
	],

	willInitialize: function (options) {
		options.context.listen(function () {
			this.history.loadURL();
		}.bind(this));
	},

	beforeHandler: function (event) {
		this.context.render(LoadingComponent, {});
		if (this.context.data.loading) {
			event.abort();
		} else if (this.context.data.error) {
			event.abort();
			this.errorHandler();
		}
	},

	mainHandler: function () {
		this.context.render(MainComponent, this.context.data);
	},

	releaseHandler: function (params) {
		var p = params[0];
		var channel = this.context.data.channels.find(function (ch) {
			return ch.name === p.channel;
		});
		if (!channel) {
			return this.notFoundHandler();
		}
		var release = channel.history.find(function (x) {
			return x.version === p.version;
		});
		if (!release) {
			return this.notFoundHandler();
		}
		this.context.render(ReleaseComponent, {
			channel: channel,
			release: release
		});
	},

	notFoundHandler: function () {
		this.context.render(NotFoundComponent, {});
	},

	errorHandler: function () {
		this.context.render(ErrorComponent, this.context.data);
	}
});

export default MainRouter;
