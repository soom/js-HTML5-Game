$(function(){
	var Progress = G.use('base',{
		tran:['translate',5,0],
		_value:100,
		GAMEOVER:false,
		initUI:function(){
			
			G.use('Line',{
				lineColor:'rgba(0,255,0,0.3)',
				points:[100,35, 420,35],
				lineWidth:15,
				lineCap : 'round',
				name:'bgline',
				parent: this
			});
			G.use('Line',{
				lineColor:'rgba(255,0,0,0.9)',
				points:[100,35, 420,35],
				lineWidth:7,
				lineCap : 'round',
				name:'redLine',
				parent: this
			});

			G.use('Text',{
				start:{x:0,y:0},
				size:{w:40,h:18},
				fillStyle:'rgba(100,20,100,0.8)',
				font:'12px свт╡',
				tran:['translate',430,30],
				Text:'100%',
				name:'text',
				parent: this
			});


		},
		setValue:function(v){
			if(v >= 0 && v < 100){
				this._value = v;
				this.del(true);
				this.get('redLine').points[2] = 3.2 * v + 100;
				if(v == 0)this.get('redLine').lineWidth = 0;
				this.get('text').Text = parseInt(v) + '%';
				this.draw(true);
			} else {
				v<=0 && (this.GAMEOVER = true);
			}
		},
		getValue:function(){
			return this._value;
		}
	});
	
	G.reg('Progress',Progress);
});