var NotFoundComponent = React.createClass({
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
					Not Found
				</div>
			</div>
		);
	}
});

export default NotFoundComponent;
