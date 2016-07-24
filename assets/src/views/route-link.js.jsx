import { extend } from 'marbles/utils';
import { pathWithParams } from 'marbles/history';
import Config from '../config';

var RouteLink = React.createClass({
	getInitialState: function () {
		return {
			href: null
		};
	},

	getDefaultProps: function () {
		return {
			className: null,
			path: ""
		};
	},

	componentWillMount: function () {
		this.__setHrefFromPath(this.props.path, this.props.params);
	},

	componentWillReceiveProps: function (props) {
		this.__setHrefFromPath(props.path, props.params);
	},

	handleClick: function (e) {
		if (e.ctrlKey || e.metaKey || e.shiftKey) {
			return;
		}
		e.preventDefault();
		var options = {};
		if (this.props.params) {
			options.params = this.props.params;
		}
		Config.history.navigate(this.props.path, options);
	},

	__setHrefFromPath: function (path, params) {
		path = pathWithParams(path, params || [{}]);
		this.setState({ href: path });
	},

	render: function () {
		var props = extend({}, this.props);
		props.href = this.state.href;
		props.onClick = this.handleClick;
		delete props.children;
		delete props.path;
		delete props.params;
		return React.createElement('a', props, this.props.children);
	}
});

export default RouteLink;
