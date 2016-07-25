import IMAGE_PATHS from './image-paths';
import History from 'marbles/history';

var history = new History();
var Config = {
	history: history,
	isCurrentPath: function (path) {
		return history.path === path.replace(/^\//, '');
	},
	IMAGE_PATHS: IMAGE_PATHS
};

export default Config;
