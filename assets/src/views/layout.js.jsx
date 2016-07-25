import Config from '../config';
import RouteLink from './route-link';

var LayoutComponent = React.createClass({
	render: function () {
		return (
			<div>
				<nav className="mnav">
					<ul>
						<li className="brand">
							<a href="https://flynn.io">
								<img src={Config.IMAGE_PATHS['flynn.svg']} alt="Flynn" />
							</a>
						</li>

						<li className="spacer"></li>

						<li className={'item'+ (Config.isCurrentPath('/') ? ' active' : '')}>
							<RouteLink path="/">Releases</RouteLink>
						</li>

						<li className="item">
							<a href="https://flynn.io/docs">Docs</a>
						</li>
					</ul>
				</nav>

				<section className="content-container">
					<section className="content">
						{this.props.children}
					</section>
				</section>
			</div>
		);
	}
});

export default LayoutComponent;
