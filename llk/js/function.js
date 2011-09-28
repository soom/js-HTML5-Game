var G={},Cxt;
function get2D(id){
	var sthis = $('#'+id);
	 Cxt =sthis[0].getContext('2d');
	 G.view = sthis;
	 G.Event.init(sthis);
	 Cxt.textBaseline = "top";
} 
(function(){
	function create(){
		  var clazz = (function() {
			this.init.apply(this, arguments);
		  });

		  if (arguments.length === 0)
			return clazz;

		  var absObj, base, type, ags = $.makeArray( arguments );

		  if (typeof ags[0] === 'string') {
			type = ags[0];
			base = ags[1];
			ags.shift();
		  } else base = ags[0];
		  
		  ags.shift();

		  if (base)
			base = base.prototype;
		  
		  if (base) {
			function Bridge(){};
			Bridge.prototype = base;
			clazz.prototype = absObj = new Bridge();
		  }

		  if (type) {
			absObj.type = type;
			Util.ns(type, clazz);
		  }
		  
		  for(var i=0,len=ags.length;i<len;i++)
			absObj = $.extend(absObj, typeof ags[i] === 'function' ? ags[i]( base ):ags[i]);
		  
		  absObj.constructor = clazz;
		  return clazz;
	}
	G = {
		cls :{},
		
		obj : [],
		
		zIndex : 0,
		
		uID:0,
		
		tranList:{length:0},
		
		_registers:{click:{},enter:{},out:{},mousemove:{}},
		
        bind : function(fn, scope){
          return function() {
              return fn.apply(scope, arguments);
          };
        },
		extend : function(target, src, override){
          if(!target)
            target = {};
          if(src){
            for(var i in src)
                if(target[i]===undefined || override)
                    target[i] = src[i];
          }
          return target;
        },
		
		fire:function(eventObj){
			var eventList = this._registers;
			for(var key in eventList){
				if(eventObj.type == key){
					for(var uID in eventList[key]){
						var request = G.isInside(eventObj,eventList[key][uID]);
						if(request.state){
							eventList[key][uID].halder(request.returnValue);
						} else {
							if(eventObj.type == 'click'){
								eventList[key][uID].src.blur && eventList[key][uID].src.blur();
							}
						}
					}
				}
			}
		},
		
		isInside : function(eventObj,srcobj){
			var tmp = G.extend({},eventObj),Position = srcobj.src.PositionData;
			tmp.x -= Position.x;
			tmp.y -= Position.y;
			if(tmp.x >= 0 && tmp.x <= Position.w && tmp.y >=0 && tmp.y <= Position.h){
				return {state : true , returnValue : tmp}
			} else {
				return {state:false}
			}
		},
		
		radiusPath:function(start,size,radius){
			Cxt.beginPath();
			Cxt.moveTo( start.x+radius,start.y );
			Cxt.lineTo( start.x+size.w-radius,start.y );
			Cxt.arc( start.x+size.w-radius,start.y+radius, radius, 3*Math.PI/2,2*Math.PI, false);
			Cxt.lineTo( start.x+size.w,start.y+size.h-radius);
			Cxt.arc( start.x+size.w-radius,start.y+size.h-radius, radius, 0, Math.PI/2, false);
			Cxt.lineTo( start.x+radius,start.y+size.h );
			Cxt.arc( start.x+radius,start.y+size.h-radius, radius, Math.PI/2, Math.PI, false);
			Cxt.lineTo( start.x,start.y+radius);
			Cxt.arc( start.x+radius,start.y+radius, radius,Math.PI, 3*Math.PI/2, false);
			Cxt.closePath();
		},
		
		EventDirect : function(event,fn1,fn2,fn3,flag){
			var obj = {x:event.x,y:event.y},self = this,isfind = false;
			$(this.child).each(function(){
				var tmp = G.extend({},obj),Position = this.PositionData;
				tmp.x -= Position.x;
				tmp.y -= Position.y;
				if(tmp.x >= 0 && tmp.x <= Position.w && tmp.y >=0 && tmp.y <= Position.h){
					isfind = true;
					self.resetFlag = false;
					event.type = fn3;
					this[fn3] && this[fn3](event);
					if(self[flag] != this){
						event.type = fn1;
						this[fn1] && this[fn1](event);
						event.type = fn2;
						self[flag] && self[flag][fn2] &&  self[flag][fn2](event);
					}
					!self.resetFlag  && (self[flag] = this);
					return ;
				} 
			});
			if(!isfind) {
				event.type = fn2;
				self[flag] && self[flag][fn2] &&  self[flag][fn2](event);
				self[flag] = null;
			}
		},
		
		reg: function(reg,cls){
			this.cls[reg] = cls;
		},
		use: function(cls,opt){
			var fn = this.cls[cls];
			if( fn ){
				
				if(typeof fn == 'object') return fn;
				
				opt.uID = this.uID++;
				
				var obj = new fn(opt);

				if(!obj.parent && obj.notTopObj== false){
					this.obj.push(obj);
					obj.zIndex = this.zIndex++;
				}
				return obj;
			}
		},
		tran:function(obj,notUser){
			var tranlist = {};
			obj.tran && ( this.tranList[obj.uID] = obj.tran , this.tranList.length++ );
			if(!notUser){	
				//tranlist = this.tranList;
				tranlist = $.extend(true,{},this.tranList);
			} else {
				if( obj.tran )
					tranlist = Object.prototype.toString.apply( obj.tran[0] ) == "[object Array]" ? obj.tran :[obj.tran];
			}	
			
			var tmp = obj.parent;
			if(tmp && this.tranList[tmp.uID] != tmp.tran){
				while(tmp.tran){
					tranlist[tmp.uID] = tmp.tran;
					if(tmp.parent) { 
						tmp = tmp.parent;
					} else {
						break;
					}
				}
			}
			
			for(var i in tranlist){
				if(i == 'length') continue;
				var arr = tranlist[i];
				if( Object.prototype.toString.apply( arr[0] ) == "[object Array]"){ 
					for(var j in arr){
						var _arr = arr[j];
						_arr = _arr.slice(1,_arr.length);
						Cxt[arr[j][0]].apply(Cxt,_arr);
					}
				} else {
					arr = arr.slice(1,arr.length);
					Cxt[tranlist[i][0]].apply(Cxt,arr);
				}
			}
			
		},
		restore:function(obj){
			this.tranList.length--;
			delete this.tranList[obj.uID];
		},
		setCfg:function(obj,arrName){
			for(var i in arrName){
				Cxt[arrName[i]] = obj[arrName[i]];
			}
		},
		getCfg:function(arrName){
			var arr = {};
			for(var i in arrName){
				arr[arrName[i]] = Cxt[arrName[i]];
			}
			return arr;
		},
		ReturnToRoll:function(arrVal){
			for(var i in arrVal){
				Cxt[i] = arrVal[i];
			}
		},		
		//画线
		lineColor: '#000000',
		
		line :function G(x1,y1,x2,y2){
				var tmp = Cxt.fillStyle;
				Cxt.strokeStyle = this.lineColor;
				if(arguments.length > 3) {
					Cxt.beginPath();
					Cxt.moveTo(x1,y1);
					Cxt.lineTo(x2,y2);
					Cxt.closePath();
					Cxt.stroke();
				} else {
					Cxt.beginPath();
					Cxt.moveTo(0,0);
					Cxt.lineTo(x1,y1);
					Cxt.closePath();
					Cxt.stroke();
				}
				Cxt.strokeStyle = tmp;
		}
	}
	var base = create();
	
	base.prototype = {
		child : [] ,
		
		bgColor :'#ffffff',
		
		zIndex : 1,
		
		name : 'base',
		
		bind:function(type,fn){
			G._registers[type][this.uID]={src:this,halder:fn}
		},
		unbind:function(type){
			return delete G._registers[type][this.uID];
		},
		
		init : function(opt){
			this.child = [];
			opt && $.extend(this, opt);
			if( this.parent) { 
				this.parent.child.push(this);
				this.zIndex = this.parent.child.length;
			}
			this.initUI();
		},
		
		get :function(name){
			var t = [];
			$(this.child).each(function(){
				if(this.name == name) 
					t.push(this);
			});
			return t.length == 1 ? t[0] :(t.length == 0 ? null : t); 
		},
		
		tran:null,
		hidden : true,
		
		draw : function(notUser){
			var self = this;
			this.hidden = false;
			Cxt.save(); G.tran(this,notUser);
					//console.log('draw save,%s,%o',this.uID,this);
			this.drawUI();
			$(this.child).each(function(){
				this.draw(true);
			});
			Cxt.restore();G.restore(this,notUser);
					//console.log('draw restore,%s,%o',this.uID,this);
			
			 if( !notUser ){
				  //层级关系重绘
				  if(!this.parent){
					 var List = G.obj;
					 $(List).each(function(i){
						this != self && this.zIndex > self.zIndex && (this.del(true),this.draw(true));
						this == self && delete List[i];
					 });
				 } else {
					this.parent.del(1);
					this.parent.draw();
				 }
			 }
			
		},
		del : function (notUser){
			var i,self=this;	
			
			this.hidden = true;
			
			Cxt.save();G.tran(this,notUser);
			//console.log('del save,%s,%o',this.uID,this);
					
			$(this.child).each(function(){
				this.del(true);
			});
			this.delUI();
			
			Cxt.restore();G.restore(this,notUser);
			//console.log('del restore,%s,%o',this.uID,this);
						
			if(this.parent && !notUser){
				$(this.parent.child).each(function(index){
					if(this === self) {i = index;return false;}
				});
				var t =this.parent.child;
				t = t.slice(0, i).concat(t.slice(i + 1, t.length))
				this.parent.child = t ;
			}

			 if( !notUser ){
				  //层级关系重绘
				  if(!this.parent){
					 var List = G.obj;
					 $(List).each(function(i){
						this != self && this.zIndex > self.zIndex && (this.del(true),this.draw(true));
						this == self && delete List[i];
					 });
				 } else {
					this.parent.del(1);
					this.parent.draw();
				 }
			 }
			 
			 
		},
		drawUI : $.noop,
		initUI : $.noop,
		delUI :$.noop
	};
	
	G.reg('base',base);
	
	var line = create(base,{
		lineColor : '#000000',
		lineWidth : 1,
		parent : null,
		start : {x:0,y:0},
		end : {x:0,y:0},
		lineCap :'butt',
		Name:'line',
		drawUI : function(){
		
			
			this.strokeStyle = this.lineColor;
			
			var tmp = G.getCfg(['strokeStyle','lineWidth','lineCap','lineJoin']);
			G.setCfg(this,['strokeStyle','lineWidth','lineCap','lineJoin']);
			
			Cxt.beginPath();
			if(!this.points) {
				Cxt.moveTo(this.start.x,this.start.y);
				Cxt.lineTo(this.end.x,this.end.y);
			} else {
				Cxt.moveTo(this.points[0],this.points[1]);
				for(var i = 1; i< this.points.length / 2 ; i++){
					Cxt.lineTo(this.points[i*2],this.points[i*2+1]);
				}
			}
			Cxt.stroke();
			G.ReturnToRoll(tmp);
			Cxt.closePath();
			
		},
		delUI : function(){
		
			var tmp = Cxt.strokeStyle,width = Cxt.lineWidth,Cap = Cxt.lineCap,lineJoin = Cxt.lineJoin;
			Cxt.beginPath();
			Cxt.strokeStyle = this.parent.bgColor;
			Cxt.lineWidth = this.lineWidth + 2;
			Cxt.lineCap = this.lineCap;
			Cxt.lineJoin = this.lineJoin;
			
			if(!this.points) {
				Cxt.moveTo(this.start.x,this.start.y);
				Cxt.lineTo(this.end.x,this.end.y);
			} else {
				Cxt.moveTo(this.points[0],this.points[1]);
				for(var i = 1; i< this.points.length / 2 ; i++){
					Cxt.lineTo(this.points[i*2],this.points[i*2+1]);
				}
			}	
			Cxt.strokeStyle = '#ffffff';
			Cxt.stroke();
			Cxt.strokeStyle = this.parent.bgColor;
			Cxt.stroke();
			Cxt.strokeStyle = tmp;
			Cxt.lineWidth = width;
			Cxt.lineCap = Cap;
			Cxt.lineJoin = lineJoin;
			Cxt.closePath();
		
		}
	});
	G.reg('Line',line);
	
	var Box = create(base,{
		start : {x:0,y:0},
		size : {w:0,h:0},
		fillStyle : '#fffff',
		lineJoin:'round',
		GradientType:null,
		GradientArg:null,
		GradientColor:null,
		radius : 0,
		name:'Box',
		shadowBlur:0,
		shadowColor:"rgba(0, 0, 0, 0)",
		shadowOffsetX:0,
		shadowOffsetY:0,
		initUI:function(){
			var self = this;
			if(this.GradientArg){
				this.GradientArg = $.map(this.GradientArg,function(item,i){
					return i%2 == 0 ? item + self.start.x : item + self.start.y;
				});
			}
			if(this.GradientType){
				var self = this;
				switch( this.GradientType ){
					case 'Linear':
						this.fillStyle = Cxt.createLinearGradient.apply(Cxt,this.GradientArg);
						break;
					case 'Radial':
						this.fillStyle = Cxt.createRadialGradient.apply(Cxt,this.GradientArg);
						break;
				}
				$(this.GradientColor).each(function(){
					self.fillStyle.addColorStop.apply(self.fillStyle,this);
				});
			}
		},
		drawUI : function(){
			var tmp = G.getCfg(['fillStyle','shadowBlur','shadowColor','shadowOffsetX','shadowOffsetY']);
			G.setCfg(this,['fillStyle','shadowBlur','shadowColor','shadowOffsetX','shadowOffsetY']);
			Cxt.clearRect(this.start.x,this.start.y,this.size.w,this.size.h);
			if(!this.radius){
				Cxt.fillRect(this.start.x,this.start.y,this.size.w,this.size.h);
				if(this.shadowBlur!=0){
					Cxt.shadowBlur = 0;
					Cxt.fillStyle = '#fff';
					Cxt.fillRect(this.start.x,this.start.y,this.size.w,this.size.h);
					Cxt.fillStyle = this.fillStyle;
					Cxt.fillRect(this.start.x,this.start.y,this.size.w,this.size.h);
				}
			} else {
				G.radiusPath(this.start,this.size,this.radius);
				Cxt.fill();
				if(this.shadowBlur!=0){
					Cxt.fillStyle = '#fff';
					Cxt.shadowBlur = 0;
					Cxt.fill();
					Cxt.fillStyle = this.fillStyle;
					Cxt.fill();
				}
			}
			G.ReturnToRoll(tmp);
		},
		delUI : function(){
			var tmp = G.getCfg(['fillStyle','shadowBlur','shadowColor','shadowOffsetX','shadowOffsetY']);
			G.setCfg(this,['fillStyle','shadowBlur','shadowColor','shadowOffsetX','shadowOffsetY']);
			Cxt.fillStyle = this.parent.bgColor;
			Cxt.shadowBlur = 0;
			Cxt.clearRect(this.start.x - this.shadowBlur-2,this.start.y  - this.shadowBlur-2,this.size.w + this.shadowBlur + 6,this.size.h + this.shadowBlur+ 6);
			Cxt.fillRect(this.start.x - this.shadowBlur-2,this.start.y  - this.shadowBlur-2,this.size.w + this.shadowBlur + 6,this.size.h + this.shadowBlur+ 6);
			G.ReturnToRoll(tmp);
			
		}
	});
	G.reg('Box',Box);
	
	var Text = create(Box,{
		font : '12px 宋体',
		fillStyle : 'rgb(0,255,0)',
		start:{x:0,y:0},
		name:'Text',
		drawUI:function(){
			var tmp = G.getCfg(['font','fillStyle']);
			G.setCfg(this,['font','fillStyle']);
			Cxt.fillText(this.Text,this.start.x,this.start.y);
			G.ReturnToRoll(tmp);
		},
		delUI : function(){
			var tmp = G.getCfg(['font','fillStyle']);
			G.setCfg($.extend({},this,{fillStyle: this.parent.bgColor}),['font','fillStyle']);
			Cxt.clearRect(0,0,this.size.w,this.size.h);
			Cxt.fillRect(0,0,this.size.w,this.size.h);
			G.ReturnToRoll(tmp);
		}
	});
	G.reg('Text',Text);
	
	var roBox = create(base,{
		name:'roBox',
		initUI:function(){
			var darr = [270,342,54,126,198]
			,self = this
			,size={w:40,h:18};
	
			$(darr).each(function(){
				G.use('Box',{
					size:size,
					start:{x:-18,y:-18},
					d:this,
					tran:[['translate',self.tranXY[0],self.tranXY[1]],['rotate',this * Math.PI/180]],
					GradientType:'Linear',
					GradientArg:[100,-1,100,45],
					GradientColor:[[0.5, 'rgba(255,0,255,0.4)'],[0, 'rgba(255,255,255,0)']],
					parent:self
				});
			});
		}
	});
	G.reg('roBox',roBox);
	
	var roundBox = create(base,{
		lineJoin:'round',
		lineColor:'blur',
		initUI:function(){
			G.use('base',{
				strokeStyle:this.lineColor
				,lineWidth:0.7
				,lineJoin:this.lineJoin
				,lineCap :'butt'
				,drawUI:function(){
					var tmp = G.getCfg(['strokeStyle','lineWidth','lineCap','lineJoin']);
					G.setCfg(this,['strokeStyle','lineWidth','lineCap','lineJoin']);
					G.radiusPath({x:0,y:0},this.parent.size,1);
					Cxt.stroke();
					G.ReturnToRoll(tmp);
				}
				,delUI:function(){
						var tmp = G.getCfg(['strokeStyle','lineWidth','lineCap','lineJoin']);
						G.setCfg(this,['strokeStyle','lineWidth','lineCap','lineJoin']);
						Cxt.lineWidth +=2;
						G.radiusPath({x:0,y:0},this.parent.size,1);
						Cxt.strokeStyle = '#ffffff';
						Cxt.stroke();
						Cxt.strokeStyle = this.parent.bgColor;
						Cxt.stroke();
						G.ReturnToRoll(tmp);
				}
				,parent:this
			});
		}
	});
	G.reg('roundBox',roundBox);
	
	var img = create(base,{
		drawUI:function(){
			var img = new Image(),self = this;
			Cxt.drawImage($('#img'+this.value)[0],0,0);
	
		},
		delUI:function(){
			var tmp = G.getCfg(['fillStyle']);
			Cxt.fillStyle =  this.parent.bgColor;
			Cxt.clearRect(0,0,this.size.w,this.size.h);
			Cxt.fillRect(0,0,this.size.w,this.size.h);
			G.ReturnToRoll(tmp);
		}
	});
	G.reg('Img',img);
	
	var Button = create(Box,{
		radius:5,
		shadowBlur:3,
		shadowColor:"red",
		shadowOffsetX:0,
		shadowOffsetY:0,
		bgColor:'#fff',
		size:{w:70,h:25},
		fillStyle:'rgba(100,100,100,0.4)',
		mousemove : function(e){
		},
		mouseover:function(e){
			this.fillStyle = 'rgba(100,100,100,0.8)';
			this.del(1);
			this.draw(1);
			G.view.css({cursor: 'pointer'});
		},
		mouseout : function(e){
			this.fillStyle = 'rgba(100,100,100,0.4)';
			this.del(1);
			this.draw(1);
			G.view.css({cursor: ''});
		}
	});
	G.reg('Button',Button);
})();