const React = require('react');
const _  = require('lodash');
const createClass = require('create-react-class');

function shadeColor2(color, percent) {
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

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
			//replace all <path with <path fill="COLOR"
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
		this.drawBadge(this.props)
	},

	drawFrame : function(){

	},
	drawIconSVG : function(){
		const icon = new Image();
		icon.src = `data:image/svg+xml;base64,${btoa(this.rawSVG)}`;
		icon.onload = ()=>this.ctx.drawImage(icon, 0, 0);

	},
	drawTitle : function(title){
		this.ctx.textAlign='center';
		this.ctx.font='30px Arial';
		this.ctx.fillText(title,150,120);
	},

	drawBadge : function(props){
		this.ctx.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
		//clear canvas
		//draw template, with modded color
		this.drawTitle(props.text);
		this.drawIconSVG();

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
