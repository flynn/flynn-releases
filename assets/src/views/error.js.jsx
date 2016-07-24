var ErrorComponent = React.createClass({
	render: function () {
		return (
			<div className="container" style={{marginTop: '1rem'}}>
				<div className="alert alert-danger" role="alert">
					<p>{this.props.error}</p>
				</div>
			</div>
		);
	}
});

export default ErrorComponent;
