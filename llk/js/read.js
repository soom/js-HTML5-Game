$(function(){
	
	var loadImg = 0;
	for(var i=1;i<=20;i++){
		var img = $('<img id="img'+(i-1)+'" style="display:none" />');
		img.load(ready);
		img.attr('src',"image/"+i+".png");
		img.appendTo('body');
	}
	function ready(){
		loadImg++;
		if(loadImg!=20) return;
		
		get2D('view');
		
		var BG = G.use('base',{
			tran:['translate',0,0],
			initUI:function(){
				var boxArr = [
					{ start:{x:0,y:0}, size:{w:500,h:20},Arg:[250,0,250,20] },
					{ start:{x:0,y:15}, size:{w:20,h:520},Arg:[0,250,20,250] },
					{ start:{x:480,y:15}, size:{w:480,h:520},Arg:[20,250,0,250] },
					{ start:{x:0,y:530}, size:{w:500,h:550},Arg:[250,20,250,0] },
				];
				
				for(var i in boxArr){
					G.use('Box',$.extend({
						GradientType:'Linear',
						GradientArg:boxArr[i].Arg,
						GradientColor:[[1, 'rgba(60,60,60,0.4)'],[0, 'rgba(255,255,255,0)']],
						parent: this
					},boxArr[i]));
				}
				
				G.use('Line',{
					lineColor:'rgba(100,20,100,0.8)',
					points:[30,50, 465,50],
					lineCap : 'round',
					parent: this
				});

				G.use('Text',{
					start:{x:5,y:5},
					size:{w:60,h:22},
					fillStyle:'rgba(100,20,100,0.8)',
					font:'18px 幼圆',
					Text:'连连看',
					tran:['translate',25,25],
					parent: this
				});
			}
			});
		
		BG.draw();


		var box = G.use('base',{
				tran:['translate',30,60],
				bgColor:'rgba(200,200,200,0.2)',
				PositionData:{x:30,y:60,w:435,h:410},
				mouseoverObj : null,
				focusObj : undefined,
				eventEnable:false,
				ImgLength : 20,
				EventDirect : function(event,fn1,fn2,fn3,flag){
					if(!this.eventEnable) return;
					var obj = {x:event.x - 15,y:event.y - 13};
					if(obj.x > 0 && obj.y > 0 &&obj.x%41 < 35 && obj.y%41 < 35){
						var thisBox = this.get('Box' + parseInt(obj.y/41) +  parseInt(obj.x/41));
						if(thisBox && !thisBox.hidden){
							this.resetFlag = false;
							event.type = fn3;
							thisBox[fn3] && thisBox[fn3](event);
							if(this[flag] != thisBox){
								event.type = fn1;
								thisBox[fn1](event);
								event.type = fn2;
								this[flag] && this[flag][fn2](event);
							}
							!this.resetFlag  && (this[flag] = thisBox);
							return ;
						}
					}
					event.type = fn2;
					this[flag] && this[flag][fn2](event);
					this[flag] = null;
				},
				mousemove : function (e){
					this.EventDirect(e,'mouseover','mouseout','mousemove','mouseoverObj');
				},
				click : function(e){
					this.EventDirect(e,'focus','blur','click','focusObj');
				},
				blur : function(e){
					this.focusObj && this.focusObj.blur();
				},
				
				focusList:[],
				
				chk:function(isInit){
					var d1,d2, data = [],f="",searchIndex = -1,tmpList = [];
					if(!isInit){
						this.focusList[0].hidden = true;
						this.focusList[1].hidden = true;
						d1 = {x:this.focusList[0].x,y:this.focusList[0].y},d2 = {x:this.focusList[1].x,y:this.focusList[1].y}
					}
					for(var i=-1;i<=10;i++){
						var item = [];
						item.push({x:i+1,y:0,hidden:true})
						for(j=1;j<=10;j++){
							if(i == -1 || i == 10){
								item.push({x:i+1,y:j,hidden:true});
							} else {
								item.push({x:i+1,y:j,hidden:this.child[i*10+j].hidden});
							}
						}
						item.push({x:i+1,y:11,hidden:true})
						data.push(item);
					}
					
					if( !isInit ){
						search();
						var r=[],t;
						if(searchIndex!=-1){
							t = tmpList[searchIndex];
							while( t.length!=1 ){
								r.push(t[t.length-1]);
								t = tmpList[t[0]];
							}
							r.push(t[0]);
							r.push(d1);
							this.drawLine(r);
							console.log( chkNext.call(this) );
							
							var _flag = false;
							for(var i=1;i<=10;i++){
								for(var j=1;j<=10;j++)
								if(!data[i][j].hidden){
									_flag=true;
									break;
								}
							}
							if(!_flag){
								Progress.GAMEOVER = true;
								box.eventEnable = false;
								Progress.youWin = true;
								alert('YOU WIN!');
							}
						} else {
							this.focusList[0].hidden = false;
							this.focusList[1].hidden = false;
							this.focusList[0].DisplayBorder(false);
							this.focusList[1].DisplayBorder(false);
							this.reset();
						}
					} else {
						var t = chkNext.call(this,isInit);
						if(!t){
							if(isInit === true)
								this.randomData();
							else if(t === 1) {
							
								this.reflash();
								
							}
						}
					}
					
					function search(){
						d1.x > d2.x ?(f+="m"):d1.x != d2.x?(f+="t"):1;
						d1.y > d2.y ? (f+="r"):d1.y != d2.y?(f+="l"):1;
						
						var sList = f;
						$(['t','r','m','l']).each(function(){
							if(sList.indexOf(this)==-1) sList+=this;
						});					
						function s(b,len){
							b = b ? b[b.length-1] : d1;
							var _List = sList.split('');
							while(_List.length!=0){
								var c = _List.shift();
								switch(c){
									case 't':
										for(var i = b.y - 1 ; i>=0 && getData(b.x,i).hidden; i--){
											push( getData(b.x,i),len );
											if( isOk(getData(b.x,i)) ){
												searchIndex = tmpList.length - 1;
											}
										}
										break;
									case 'r' :
										for(var i = b.x + 1 ; i<=11 && getData(i,b.y).hidden; i++){
											push( getData(i,b.y),len );
											if( isOk(getData(i,b.y)) ){
												searchIndex = tmpList.length - 1;
											}
										}
										break;
									case 'm' :
										for(var i = b.y + 1 ; i<=11 && getData(b.x,i).hidden; i++ ){
											push( getData(b.x,i),len );
											if( isOk(getData(b.x,i)) ){
												searchIndex = tmpList.length - 1;
											}
										}
										break;
									case 'l' :
										for(var i = b.x - 1 ; i>=0 && getData(i,b.y).hidden; i--){
											push( getData(i,b.y),len );
											if( isOk(getData(i,b.y)) ){
												searchIndex = tmpList.length - 1;
											}
										}
										break;
								}
							}
						}
						s();
						for(var i=0,len = tmpList.length;i<len && searchIndex == -1;i++){
							s(tmpList[i],i);
						}
						for(var i = len,len = tmpList.length;i<len && searchIndex == -1;i++){
							s(tmpList[i],i);
						}
					}
					
					function chkNext(isInit){
						var notHiddenData =[];
						searchIndex = -1 ;
						for(var i = 1;i<this.child.length && searchIndex == -1 ;i++){
							if( !this.child[i].hidden ){
								notHiddenData.push(this.child[i]);
							}
						}

						var tmpArr = [];
						for(var i=0;i<this.ImgLength && searchIndex == -1 ;i++){
							tmpArr = [];
							for(var j=0;j<notHiddenData.length;j++){
								if(notHiddenData[j].value == i){
									tmpArr.push(notHiddenData[j]);
								}
							}
							if(tmpArr.length>1){
								for(var m = 0;m < tmpArr.length-1 && searchIndex == -1 ; m++){
									for(var n=m+1;n < tmpArr.length && searchIndex == -1 ;n++){
										d1 = {x:tmpArr[m].x,y:tmpArr[m].y};
										d2 = {x:tmpArr[n].x,y:tmpArr[n].y};
										data[tmpArr[m].x][tmpArr[m].y].hidden = true;
										data[tmpArr[n].x][tmpArr[n].y].hidden = true;
										searchIndex = -1 ;
										f = "";
										tmpList = [];
										search();
										data[tmpArr[m].x][tmpArr[m].y].hidden = false;
										data[tmpArr[n].x][tmpArr[n].y].hidden = false;
										if( searchIndex !=-1  ){
											this.NextData = [tmpArr[m],tmpArr[n]];
											if(isInit === 1){
												for(var j=0;j<notHiddenData.length;j++){
													notHiddenData[j].del(1);
													notHiddenData[j].draw(1);
												}
											}
											return true;
										}
									}
								}
							}
						}
						if(isInit === 1){
							this.reflash(1);
						} else {
							if(isInit === undefined){
								if(TipCount == 0){
									alert('GAME OVER!!');
									box.eventEnable = false;
								} else {
									action.get('text').showTip(1);
								}
							}
						}
						return false;
					}		
										
					function isOk(d){
						return d.x == d2.x && d.y == d2.y;
					}
					function getData(x,y){
						return data[x][y];
					}
					function push(data,len){
						var pushData = len !== undefined ? [len,data] : [data];
						tmpList.push(pushData);
					}
					
				},
				
				//重排
				reflash: function (){	
						var notHiddenData =[];
						for(var i = 1;i<this.child.length;i++){
							if( !this.child[i].hidden ){
								notHiddenData.push(this.child[i]);
							}
						}
						for(var i=notHiddenData.length-1;i>=0;i--) {
							var r = Math.floor(Math.random(i));
							var temV = notHiddenData[i].value
							notHiddenData[i].value = notHiddenData[r].value;
							notHiddenData[r].value = temV;
						}
						this.chk(1);
				},

				
				reset : function(){
					this.focusList = [];
					this.focusObj = null;
					this.resetFlag = true;
				},
				drawLine : function(r){
					var p = [];
					var self = this;
					$.each(r,function(){
						var y =  3 + (this.y) *41 + 20;
						if( this.y==0 ) y +=16;
						if( this.y==11 ) y -=16;
						p.push( y );
						var x = 29 +(this.x)*41 + 20 ;
						if( this.x==0 ) x +=20;
						if( this.x==11 ) x -=12;
						p.push(x );
					});
					var line = G.use('base',{
							initUI:function(){
								G.use('Line',{
									lineColor:'blur',
									points:p,
									lineWidth:3,
									lineCap : 'round',
									name:'redLine',
									parent : this
								});
							},
							bgColor:this.bgColor,
						})
					line.draw(1);
					ProgressValue += 3;
					box.eventEnable = false;
					setTimeout(function(){
						self.focusList[0].del(1);
						self.focusList[1].del(1);
						box.eventEnable = true;
						self.reset();
						line.del(1);
						line = null;
					},300);
				},
				focusBox : function(b){
					if(this.focusList.length==1){
						if(this.focusList[0] == b ){
							b.DisplayBorder(false);
							this.reset();
							return;
						}
						this.focusList[1] = this.focusList[0];
					}
					this.focusList[0] = b;
					if(this.focusList.length==2){
						if(this.focusList[0].value == this.focusList[1].value){
							this.chk();
						} else {
							this.focusList[0].DisplayBorder(false);
							this.focusList[1].DisplayBorder(false);
							this.reset();
						}
					}
				},
				randomData : function(){
					var tmp =[],v =  parseInt(Math.random()* this.ImgLength);
					for(var i=0;i<=99;i++){
						if(!(i%2)) v =  parseInt(Math.random()* this.ImgLength)
						tmp[i]=v;
					}
					for(i=0;i<200;i++){
						var t=[];
						while(t.length!=2){
							var r = parseInt(Math.random()*100);
							if(r!=t[0] || !t.length)t.push(r);
						}
						var tItem = tmp[t[0]];
						tmp[t[0]] = tmp[t[1]];
						tmp[t[1]] = tItem;
					}
					for(i=1;i<=100;i++)
						this.child[i].value = tmp[i-1];
					
					this.chk(true);
				},
				initUI:function(){
					
					this.bind('mousemove',G.bind(this.mousemove,this));
					this.bind('click',G.bind(this.click,this));
					
					G.use('Box',{
						size:{w:435,h:430},
						fillStyle : this.bgColor,
						parent:this,
						loadEvent:true
					});
					
					for(var i=0;i<10;i++){
						for(var j=0;j<10;j++){
							(function(_i,_j){
								G.use('Box',{
									size:{w:35,h:35},
									name:'Box'+_i+''+_j,
									radius:2,
									x:_i+1,
									y:_j+1,
									hidden:false,
									PositionData : { x:this.PositionData.x+ 15 + _j*41,y:this.PositionData.y+13+_i*41,w:35,h:35 },
									tran:['translate',15 + _j*41,13+_i*41],
									fillStyle:'rgba(100,100,100,0.4)',
									bgColor : this.bgColor,
									ShowBorder : false,
									DisplayBorder : function(b){
										if(this.hidden == false){
											this.ShowBorder = b;
											this.del(1);
											this.draw(1);
										}
									},
									focus : function(){
										//this.DisplayBorder(true);
										//this.parent.focusBox(this);
									},
									blur : function(){
										if(this.parent.focusList.length == 1 ){
											this.DisplayBorder(false);
											this.parent.reset();
										}
									},
									click : function(){
										this.DisplayBorder(true);
										this.parent.focusBox(this);
									},
									mouseover : function(e){
										//console.log('mouseover ' + e.type +' name:' + this.name);
										G.view.css({cursor: 'pointer'});
									},
									mouseout : function(e){
										//console.log('mouseout ' + e.type +' name:' + this.name);
										G.view.css({cursor: ''});
									},
									initUI : function(){
										
										/*
											G.use('Text',{
												start:{x:12,y:12},
												size:{w:35,h:35},
												fillStyle:'rgba(100,20,100,0.8)',
												font:'12px 幼圆',
												Text:this.value,
												name:'text',
												parent: this
											});
										*/
											G.use('Img',{
												start:{x:12,y:12},
												size:{w:35,h:35},
												value:this.value,
												name:'Img',
												parent: this
											});
											
									},
									draw : function(b){	
										if(this.ShowBorder && this.child.length == 1){
											G.use('roundBox',{
												size:{w:37,h:37},
												tran:['translate',-1,-1],
												bgColor:'rgba(200,200,200,0.2)',
												parent:this
											});
										} else if(this.child.length == 2 && !this.ShowBorder){
											this.child[1].del(1);
											delete this.child[1];
											this.child = [this.child[0]];
										}
										this.get('Img').value = this.value;
										G.cls['Box'].prototype.draw.apply(this,arguments);
									},
									del : function(){
										G.cls['Box'].prototype.del.apply(this,arguments);
									},
									parent:this
								});
							}).call(this,i,j);
							
						}
					}
					this.randomData();
				}
			});
			
		box.draw();
		
		var TipCount = 5;
		
		var action = G.use('base',{
			tran:['translate',20,495],
			PositionData:{x:20,y:495,w:480,h:40},
			bgColor:'#fff',
			mousemove : function (e){
				G.EventDirect.call(this,e,'mouseover','mouseout','mousemove','mouseoverObj');
			},
			click:function(e){
				G.EventDirect.call(this,e,'focus','blur','click','focusObj');
			},
			initUI:function(){
				
				this.bind('mousemove',G.bind(this.mousemove,this));
				this.bind('click',G.bind(this.click,this));
				
				G.use('Button',{
					tran:['translate',20,5],
					PositionData:{x:20,y:5,w:70,h:25},
					click:function(){
						Progress.youWin = false;
						if(!this.oneClick){
							box.eventEnable = true;
							this.oneClick = true;
							this.del(1);
							this.get('text').start.x = 12;
							this.get('text').Text = '重新开始';
							this.draw(1);
							t();
						} else {
							for(var i=1;i<=100;i++){
								box.child[i].hidden = false;
								box.child[i].ShowBorder = false;
							}
							box.eventEnable = true;
							box.randomData();
							box.reflash(1);
							ProgressValue = 100;
							if( Progress.GAMEOVER ){
								Progress.GAMEOVER = false;
								t();
							}
							TipCount = 5;
							this.parent.get('text').del(1);
							this.parent.get('text').Text = '剩余提示'+TipCount+'次';
							this.parent.get('text').draw(1);
						}
					},
					initUI:function(){
						G.use('Text',{
							start:{x:22,y:8},
							size:{w:50,h:20},
							fillStyle:'rgba(100,20,100,0.9)',
							font:'12px 幼圆',
							Text:'开始',
							name:'text',
							parent: this
						});
					},
					parent:this
				});
				
				G.use('Button',{
					tran:['translate',110,5],
					PositionData:{x:110,y:5,w:70,h:25},
					click:function(){
						if( !box.eventEnable ) return;
						if(TipCount>0){
							box.reflash(1);
							this.parent.get('text').showTip(true);
						} else {
							var Text = this.parent.get('text');
							Text.del(1);
							Text.fillStyle = 'red';
							Text.tran = ['translate',259,13],
							Text.Text = '提示已经用完！';
							Text.draw(1);
						}
					},
					initUI:function(){
						G.use('Text',{
							start:{x:22,y:8},
							size:{w:50,h:20},
							fillStyle:'rgba(100,20,100,0.9)',
							font:'12px 幼圆',
							Text:'重排',
							name:'text',
							parent: this
						});
					},
					parent:this
				});
				
				G.use('Text',{
					start:{x:1,y:1},
					size:{w:80,h:18},
					tran:['translate',269,13],
					PositionData:{x:0,y:0,w:40,h:18},
					fillStyle:'rgba(0,0,0,0.8)',
					font:'14px 幼圆',
					Text:'剩余提示'+TipCount+'次',
					name:'text',
					parent: this,
					showTip:function(noShow){
						if( box.NextData[0].ShowBorder && box.NextData[0].ShowBorder) return;
						TipCount--;
						if(TipCount>=0){
							var Text = this;
							Text.del(1);
							Text.Text = '剩余提示'+TipCount+'次';
							Text.draw(1);
							if(!noShow){
								box.NextData[0].DisplayBorder(true);
								box.NextData[1].DisplayBorder(true);
							}
						} else {
							var Text = this;
							Text.del(1);
							Text.fillStyle = 'red';
							Text.tran = ['translate',259,13],
							Text.Text = '提示已经用完！';
							Text.draw(1);
						}
					}
				});
				
				G.use('Button',{
					tran:['translate',360,5],
					PositionData:{x:360,y:5,w:70,h:25},
					click : function(e){
						if( !box.eventEnable ) return;
						this.parent.get('text').showTip();
					},
					initUI:function(){
						G.use('Text',{
							start:{x:22,y:8},
							size:{w:50,h:20},
							fillStyle:'rgba(100,20,100,0.9)',
							font:'12px 幼圆',
							Text:'提示',
							name:'text',
							parent: this
						});
					},
					parent:this
				});
			}
		});
		action.draw();
		
		var Progress = G.use('Progress');
		Progress.draw();
		
		var ProgressValue = 100;
		var t = function(){
			setTimeout(function(){
				ProgressValue -=0.3;
				Progress.setValue(ProgressValue);
				if(!Progress.GAMEOVER)
					t();
				else {
					!Progress.youWin && alert('GAME OVER!!');
					box.eventEnable = false;
				}
			},200)
		}
	}
})