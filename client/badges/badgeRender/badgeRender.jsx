const React = require('react');
const _  = require('lodash');
const createClass = require('create-react-class');

const BadgeTemplate = require('./badgeTemplate.js');

const replaceAll = (text, target, str)=>text.replace(new RegExp(target, 'g'), str);

const BadgeRender = createClass({
	getDefaultProps: function() {
		return {
			title: '',
			text: '',
			rawSVG : '',
			color : '#333'
		};
	},
	componentWillReceiveProps: function(nextProps) {
		this.drawBadge(nextProps);
	},

	shouldComponentUpdate: function(nextProps, nextState) {
		return false
	},

	componentDidMount: function() {
		this.ctx = this.refs.canvas.getContext('2d');
		this.drawBadge(this.props);
	},

	handleDownload : function(){

		const target = document.createElement('a');
		const name = (this.props.title ? _.snakeCase(this.props.title) : 'badge')
		target.download = `${name}.png`;
		target.href = this.refs.canvas.toDataURL("image/png").replace(/^data:image\/[^;]/, 'data:application/octet-stream');
		target.click();
	},

	clearCanvas : function(){
		this.ctx.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
	},

	readyFrame : function(color){
		return new Promise((resolve, reject)=>{
			const frame = new Image();
			frame.src = `data:image/svg+xml;base64,${btoa(BadgeTemplate(color))}`;
			frame.onload = ()=>resolve(frame);
		});
	},
	readyIconSVG : function(props){
		return new Promise((resolve, reject)=>{
			if(!props.rawSVG) return resolve();
			const icon = new Image();
			let svg = _.reduce(['path', 'rect', 'polygon'], (acc, type)=>{
				return replaceAll(acc, `<${type}`, `<${type} style="fill:${props.color}"`);
			}, props.rawSVG);
			//TODO: Remove all text nodes?
			svg = svg.replace(/<text.*<\/text>/, '');
			icon.onload = ()=>resolve(icon);
			icon.src = `data:image/svg+xml;base64,${btoa(svg)}`;
		});
	},
	drawSVG : function(props){
		return Promise.all([this.readyFrame(props.color), this.readyIconSVG(props)])
			.then(([frame, icon])=>{
				this.clearCanvas();
				if(frame) this.ctx.drawImage(frame, 0, 0);
				if(icon){
					const scale = 1.1
					const newWidth = icon.width * scale;
					const newHeight = icon.height * scale;
					this.ctx.drawImage(icon,
						150 - newWidth / 2, 120 - newWidth / 2,
						newWidth, newHeight);
				}
			})
	},
	drawTitle : function(title){
		this.ctx.textAlign='center';
		this.ctx.textBaseline="middle";
		this.ctx.fillStyle = "#ffffff";

		const trySize = (font)=>{
			this.ctx.font=`${font}px Calluna`;
			const length = this.ctx.measureText(title).width;
			if(length >= 230) return trySize(font-1);
			return font;
		};
		const finalSize = trySize(35);
		this.ctx.fillText(title,150,220);
	},
	drawText : function(text){
		this.ctx.textAlign='left';
		this.ctx.font='bold 18px Calluna';
		this.ctx.fillStyle = "#000";

		const lines = _.reduce(text.split(' '), (acc, word)=>{
			const currLine = _.last(acc);
			const length = this.ctx.measureText(`${currLine.join(' ')} ${word}`).width;
			if(length >= this.refs.canvas.width - 30){
				acc.push([word]);
			}else{
				currLine.push(word);
			}
			return acc;
		}, [[]]);
		_.each(lines, (line, index)=>{
			this.ctx.fillText(line.join(' '),15,330 + index*20);
		});
	},

	drawBadge : function(props){
		let height = (props.text ? 400 : 300);
		if(this.refs.canvas.height != height) this.refs.canvas.height = height;
		this.drawSVG(props)
			.then(()=>{
				this.drawTitle(props.title);
				this.drawText(props.text);
			})
	},

	render: function(){
		return <div className='badgeRender'>
			<canvas ref='canvas' width={300} height={300}/>
			<div>
				<button onClick={this.handleDownload}>
					<i className='fa fa-download' />
					Download
				</button>
			</div>
		</div>
	}
});

module.exports = BadgeRender;
