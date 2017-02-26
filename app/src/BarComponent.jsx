var ProgressBar = React.createClass({
	getInitialState: function(){
		//return {isBarSel:false}
		//Make the first bar selected by default
		if(this.props.index==0)
		{
			this.props.selVal = true;
		}
		return {}
	},
	barClick: function(){
		//console.log("barClick:"+this.props.selVal);
		this.props.clickHandler(this.props.index);
		//this.setState({isBarSel:true});
	},
	renderNormal: function() {
		var percentage = this.props.perc+'%';
		var isOverFlow = this.props.isOverFlow;
		if(isOverFlow){
			return (
				<div onClick={this.barClick} className="progressBar">
					<div className="barBGOverFlow" style={{width : percentage}} id="barBG"></div>
					<div className="barLabel">{this.props.children}</div>
				</div>
			)
		}
		else{
			return (
				<div onClick={this.barClick} className="progressBar">
					<div className="barBG" style={{width : percentage}} id="barBG"></div>
					<div className="barLabel">{this.props.children}</div>
				</div>
			)
		}
	},
	renderSelected: function() {
		var percentage = this.props.perc+'%';
		var isOverFlow = this.props.isOverFlow;
		if(isOverFlow){
			return (
				<div className="progressBarSel">
					<div className="barBGOverFlow" style={{width : percentage}} id="barBG"></div>
					<div className="barLabel">{this.props.children}</div>
				</div>
			)
		}
		else{
			return (
				<div className="progressBarSel">
					<div className="barBG" style={{width : percentage}} id="barBG"></div>
					<div className="barLabel">{this.props.children}</div>
				</div>
			)
		}
	},
	render: function() {
		if(this.props.selVal)
		{
			return this.renderSelected();
		}
		else
		{
			return this.renderNormal();
		}
	}
});

var CustomButton = React.createClass({
	getInitialState: function(){
		return {editing:false}
	},
	
	btnClick: function(){
		//console.log("btnClick:"+this.props.index);
		this.props.clickHandler(this.props.children);
	},
	
	render: function() {
		return (
				<div onClick={this.btnClick} className="button"><p className="noselect">{this.props.children}</p></div>
		);
	}
});

var Board = React.createClass({
	getInitialState: function(){
		return {
			bars:[],
			barsDisp:[],
			arrBarSel:[],
			arrBarPerc:[],
			arrIsOverFlow:[],
			cbuttons:[],
			blimit:0
		}
	},  
	componentDidMount: function() {
		console.log("componentDidMount--->");
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = () => {
			//console.log("onreadystatechange");
			if(xhr.readyState==4 && xhr.status==200){
				//console.log("done");
				console.log(JSON.parse(xhr.responseText));
				this.state.bars = JSON.parse(xhr.responseText).bars;
				this.state.barsDisp = JSON.parse(xhr.responseText).bars;
				this.state.cbuttons = JSON.parse(xhr.responseText).buttons;
				this.state.blimit = JSON.parse(xhr.responseText).limit;					
				var i;
				var tempArrSel=[];
				var tempArrBarPerc=[];
				var tempIsOverFlow=[];
				
				for (i = 0; i < this.state.bars.length; i++) {
					tempArrSel.push(false);
					
					if(this.state.bars[i]>this.state.blimit){
						tempIsOverFlow.push(true);
						this.state.barsDisp[i] = this.state.blimit;
					}
					else{
						tempIsOverFlow.push(false);
					}
					tempArrBarPerc.push(Math.round((this.state.barsDisp[i]/this.state.blimit)*10000)/100);
				}
				//Make the first bar selected by default
				tempArrSel[0] = true;
				//console.log("tempArrSel:: "+tempArrSel);
				this.state.arrBarSel=tempArrSel;
				this.state.arrBarPerc=tempArrBarPerc;
				this.state.arrIsOverFlow=tempIsOverFlow;
				this.setState(this.state);
			}
			
		};
		xhr.open('GET','json/compdata.json');
		xhr.send();
	  },
	buttonClicked:function(text){
		//console.log("buttonClicked:: "+text);
		var arrBars = this.state.bars;
		var arrBarsDisp = this.state.barsDisp;
		var arrSel = this.state.arrBarSel;
		var arrBarPerc = this.state.arrBarPerc;
		var i;
		for (i = 0; i < arrBars.length; i++) {
			if(arrSel[i]==true)
			{
				arrBars[i]+=text;					
				
				if(arrBars[i]<0)
				{
					arrBars[i] = 0;
				}
				arrBarsDisp[i]=arrBars[i];
				
				if(arrBars[i]>this.state.blimit){
					this.state.arrIsOverFlow[i] = true;
					arrBarsDisp[i] = this.state.blimit;
				}
				else{
					this.state.arrIsOverFlow[i] = false;
				}
				
				arrBarPerc[i] = Math.round((arrBarsDisp[i]/this.state.blimit)*10000)/100;
			}
		}
		this.setState({bars:arrBars,barsDisp:arrBarsDisp});
		//this.setState({barsDisp:arrBarsDisp});
	},
	barClicked:function(index){
		//console.log("barClicked:: "+index);
		var arrSel = this.state.arrBarSel;			
		var i;
		for (i = 0; i < arrSel.length; i++) {
			arrSel[i]=false;
		}
		arrSel[index]=true;
		this.setState({arrBarSel:arrSel});
	},
	eachBar: function(text,i){
		return (<ProgressBar clickHandler={this.barClicked} isOverFlow={this.state.arrIsOverFlow[i]} perc={this.state.arrBarPerc[i]} selVal={this.state.arrBarSel[i]} key={i} index={i}>{text}({this.state.arrBarPerc[i]}%)</ProgressBar>);
	},
	eachButton: function(text,i){
		return (<CustomButton clickHandler={this.buttonClicked} key={i} index={i}>{text}</CustomButton>);
	},
	render: function() {
		return (
		<div className="board">
			<div className="barHolder">
			{
				this.state.barsDisp.map(this.eachBar)
			}
			</div>
			<div className="buttonHolder">
				
				{
					this.state.cbuttons.map(this.eachButton)
				}
				
			</div>
		</div>);
	}
});

ReactDOM.render(<Board></Board>,document.getElementById('container'));