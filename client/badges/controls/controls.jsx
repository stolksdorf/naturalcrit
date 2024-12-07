const React = require('react');
const _ = require('lodash');
const createClass = require('create-react-class');
const cx = require('classnames');
const Color = require('react-color');

const Controls = createClass({
	getDefaultProps: function () {
		return {
			data: {
				title: '',
				text: '',
				color: '#2b4486',
				rawSVG: '',
			},
			onChange: () => {},
		};
	},
	getInitialState: function () {
		return {
			hover: false,
		};
	},
	handleDrop: function (e) {
		e.preventDefault();
		const files = e.target.files || e.dataTransfer.files;
		const reader = new FileReader();
		reader.onload = (e) => {
			this.handleChange('rawSVG', e.target.result);
		};
		reader.readAsText(files[0]);
		this.setState({ hover: false });
	},
	handleHover: function (e, val) {
		e.preventDefault();
		this.setState({ hover: val });
	},
	handleChange: function (path, val) {
		this.props.onChange(_.set(this.props.data, path, val));
	},
	render: function () {
		return (
			<div className="controls">
				<div className="field">
					<label>Title</label>
					<input
						type="text"
						className="value"
						value={this.props.data.title}
						onChange={(e) => this.handleChange('title', e.target.value)}
					/>
				</div>
				<div className="field">
					<label>Text</label>
					<textarea
						type="text"
						className="value"
						rows={3}
						value={this.props.data.text}
						onChange={(e) => this.handleChange('text', e.target.value)}
					/>
				</div>
				<div className="field">
					<label>Color</label>
					<Color.SliderPicker
						className="value"
						disableAlpha={true}
						color={this.props.data.color}
						onChange={(colorObj) => this.handleChange('color', colorObj.hex)}
					/>
				</div>
				<div className="field svg">
					<label>SVG</label>
					<div className="value">
						<div
							className={cx('dropZone', { hover: this.state.hover })}
							onDragOver={(e) => this.handleHover(e, true)}
							onDragLeave={(e) => this.handleHover(e, false)}
							onDrop={this.handleDrop}>
							<i className="fa fa-arrow-down" />
							<p>Drop SVG here</p>
						</div>
						<input type="file" onChange={this.handleDrop} />
						<p>
							We suggest you download an icon from{' '}
							<a href="https://thenounproject.com/">The Noun Project</a>, then drag and drop it here.
						</p>
					</div>
				</div>
			</div>
		);
	},
});

module.exports = Controls;
