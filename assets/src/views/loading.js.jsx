var LoadingComponent = React.createClass({
	render: function () {
		return (
			<div style={{
				display: 'table',
				height: '100%',
				width: '100%'
			}}>
				<div style={{
					display: 'table-cell',
					textAlign: 'center',
					verticalAlign: 'middle'
				}}>
					<span id="loading">
						<i className="fa fa-spinner fa-spin fa-fw"></i>
					</span>
				</div>
			</div>
		);
	}
});

export default LoadingComponent;
