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
			iconPath : '',
			color : '#333'
		};
	},
	rawSVG : '',
	handleDrop: function(e){
		e.preventDefault();
		const files = e.target.files || e.dataTransfer.files;
		const reader = new FileReader();
		reader.onload = (e)=>{
			//viewBox="0 0 100 125" -> viewBox="0 0 100 100"
			//replace all <path with <path style="fill:COLOR"
			this.rawSVG = e.target.result;
			this.drawBadge(this.props);
		}
		reader.readAsText(files[0]);
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
		setTimeout(()=>this.drawBadge(this.props), 500)
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
	readyIconSVG : function(color){
		return new Promise((resolve, reject)=>{
			if(!this.rawSVG) return resolve();
			const icon = new Image();
			const svg = _.reduce(['path', 'rect', 'polygon'], (acc, type)=>{
				return replaceAll(acc, `<${type}`, `<${type} style="fill:${color}"`);
			}, this.rawSVG);
			icon.src = `data:image/svg+xml;base64,${btoa(svg)}`;
			icon.onload = ()=>resolve(icon);
		});
	},
	drawSVG : function(props){
		return Promise.all([this.readyFrame(props.color), this.readyIconSVG(props.color)])
			.then(([frame, icon])=>{
				this.clearCanvas();
				if(frame) this.ctx.drawImage(frame, 0, 0);
				if(icon){
					console.log(icon.width, icon.height);
					this.ctx.drawImage(icon, 0, 0);
				}
			})
	},
	drawTitle : function(title){
		this.ctx.textAlign='center';
		this.ctx.font='30px Calluna';
		this.ctx.fillStyle = "#ffffff";
		this.ctx.fillText(title,150,230);
	},

	drawBadge : function(props){
		this.drawSVG(props)
			.then(()=>{
				this.drawTitle(props.text);
			})



		//draw text
		//draw icon, with modded color



	},

	render: function(){
		return <div className='badgeRender'>
			<div onDragOver={(e)=>e.preventDefault()} onDrop={this.handleDrop}>
				<canvas ref='canvas' width={300} height={300}/>
				<img ref='test' />
			</div>
		</div>
	}
});

module.exports = BadgeRender;
