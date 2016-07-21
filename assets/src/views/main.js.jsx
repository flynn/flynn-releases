var MainComponent = React.createClass({
	render: function () {
		var props = this.props;
		var state = this.state;
		return (
			<section>
				<h1>
					Flynn Releases

					{props.loading ? (
						<span id="loading" className="pull-right">
							<i className="fa fa-spinner fa-spin fa-fw"></i>
						</span>
					) : null}
				</h1>

				{props.error && !state.alertDismissed ? (
					<div className="alert alert-danger alert-dismissible" role="alert">
						<button type="button" className="close" data-dismiss="alert" onClick={this.__dismissAlert}>
							<span aria-hidden="true">&times;</span>
							<span className="sr-only">Close</span>
						</button>

						<p>{props.error}</p>
					</div>
				) : null}

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
												<td><strong>{x.version}</strong></td>
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
	},

	getInitialState: function () {
		return {
			alertDismissed: false
		};
	},

	__dismissAlert: function (e) {
		e.preventDefault();
		this.setState({
			alertDismissed: true
		});
	}
});

export default MainComponent;
