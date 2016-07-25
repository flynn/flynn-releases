import RouteLink from './route-link';

var MainComponent = React.createClass({
	render: function () {
		var props = this.props;
		return (
			<section>
				<header>
					<h1>
						Releases
					</h1>
				</header>

				<section>
					<table>
						<thead>
							<tr>
								<th>Channel</th>
								<th>Current Version</th>
							</tr>
						</thead>

						<tbody>
							{props.channels.map(function (channel) {
								return (
									<tr key={channel.name}>
										<td><a href={'#ch-'+channel.name}>{channel.name}</a></td>
										<td><strong><RouteLink path={'/'+ channel.name +'/'+ channel.version}>{channel.version}</RouteLink></strong></td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</section>

				{props.channels.map(function (channel) {
					return (
						<section key={channel.name} id={"ch-"+ channel.name}>
							<header>
								<h2>{channel.name} history</h2>
							</header>

							<table>
								<thead>
									<tr>
										<th>Version</th>
										<th>Changelog</th>
									</tr>
								</thead>
								<tbody>
									{channel.history.map(function (x) {
										return (
											<tr key={x.version}>
												<td><strong><RouteLink path={'/'+ channel.name +'/'+ x.version}>{x.version}</RouteLink></strong></td>
												<td dangerouslySetInnerHTML={{__html: markdown.toHTML(x.changelog)}}/>
											</tr>
										);
									})}
								</tbody>
							</table>
						</section>
					);
				})}
			</section>
		);
	}
});

export default MainComponent;
