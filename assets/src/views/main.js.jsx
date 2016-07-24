import RouteLink from './route-link';

var MainComponent = React.createClass({
	render: function () {
		var props = this.props;
		return (
			<section>
				<h1>
					Flynn Releases
				</h1>

				<table id="channels" className="table">
					<thead>
						<tr>
							<th>Channel</th>
							<th>Current Version</th>
						</tr>
					</thead>

					<tbody>
						{props.channels.map(function (channel) {
							return (
								<tr>
									<td>{channel.name}</td>
									<td><strong>{channel.version}</strong></td>
								</tr>
							);
						})}
					</tbody>
				</table>

				{props.channels.map(function (channel) {
					return (
						<div>
							<h2>{channel.name} history</h2>

							<table className="table">
								<thead>
									<tr>
										<th>Version</th>
										<th>Changelog</th>
									</tr>
								</thead>
								<tbody>
									{channel.history.map(function (x) {
										return (
											<tr>
												<td><strong><RouteLink path={'/'+ channel.name +'/'+ x.version}>{x.version}</RouteLink></strong></td>
												<td dangerouslySetInnerHTML={{__html: markdown.toHTML(x.changelog)}}/>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					);
				})}
			</section>
		);
	}
});

export default MainComponent;
