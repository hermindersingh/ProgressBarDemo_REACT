(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"C:\\Harry-Australia_Caringbah\\temp\\Sample01\\app\\src\\BarComponent.jsx":[function(require,module,exports){
var ProgressBar = React.createClass({displayName: "ProgressBar",
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
				React.createElement("div", {onClick: this.barClick, className: "progressBar"}, 
					React.createElement("div", {className: "barBGOverFlow", style: {width : percentage}, id: "barBG"}), 
					React.createElement("div", {className: "barLabel"}, this.props.children)
				)
			)
		}
		else{
			return (
				React.createElement("div", {onClick: this.barClick, className: "progressBar"}, 
					React.createElement("div", {className: "barBG", style: {width : percentage}, id: "barBG"}), 
					React.createElement("div", {className: "barLabel"}, this.props.children)
				)
			)
		}
	},
	renderSelected: function() {
		var percentage = this.props.perc+'%';
		var isOverFlow = this.props.isOverFlow;
		if(isOverFlow){
			return (
				React.createElement("div", {className: "progressBarSel"}, 
					React.createElement("div", {className: "barBGOverFlow", style: {width : percentage}, id: "barBG"}), 
					React.createElement("div", {className: "barLabel"}, this.props.children)
				)
			)
		}
		else{
			return (
				React.createElement("div", {className: "progressBarSel"}, 
					React.createElement("div", {className: "barBG", style: {width : percentage}, id: "barBG"}), 
					React.createElement("div", {className: "barLabel"}, this.props.children)
				)
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

var CustomButton = React.createClass({displayName: "CustomButton",
	getInitialState: function(){
		return {editing:false}
	},
	
	btnClick: function(){
		//console.log("btnClick:"+this.props.index);
		this.props.clickHandler(this.props.children);
	},
	
	render: function() {
		return (
				React.createElement("div", {onClick: this.btnClick, className: "button"}, React.createElement("p", {className: "noselect"}, this.props.children))
		);
	}
});

var Board = React.createClass({displayName: "Board",
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
		xhr.open('GET','pagedata.json');
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
		return (React.createElement(ProgressBar, {clickHandler: this.barClicked, isOverFlow: this.state.arrIsOverFlow[i], perc: this.state.arrBarPerc[i], selVal: this.state.arrBarSel[i], key: i, index: i}, text, "(", this.state.arrBarPerc[i], "%)"));
	},
	eachButton: function(text,i){
		return (React.createElement(CustomButton, {clickHandler: this.buttonClicked, key: i, index: i}, text));
	},
	render: function() {
		return (
		React.createElement("div", {className: "board"}, 
			React.createElement("div", {className: "barHolder"}, 
			
				this.state.barsDisp.map(this.eachBar)
			
			), 
			React.createElement("div", {className: "buttonHolder"}, 
				
				
					this.state.cbuttons.map(this.eachButton)
				
				
			)
		));
	}
});

ReactDOM.render(React.createElement(Board, null),document.getElementById('container'));

},{}]},{},["C:\\Harry-Australia_Caringbah\\temp\\Sample01\\app\\src\\BarComponent.jsx"])

//# sourceMappingURL=bundle.js.map
