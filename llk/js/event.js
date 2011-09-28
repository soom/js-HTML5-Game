G.Event={
	init:function(sthis){
		var offset = sthis.offset();
		 sthis[0].onmousemove = function(e){
			var eventObj = {x:e.pageX-offset.left,y:e.pageY-offset.top,type:'mousemove'};
			G.fire(eventObj);
		}
		sthis[0].onclick = function(e){
			var eventObj = {x:e.pageX-offset.left,y:e.pageY-offset.top,type:'click'};
			G.fire(eventObj);
		}
		sthis[0].onmousedown = function(e){
			var eventObj = {x:e.pageX-offset.left,y:e.pageY-offset.top,type:'mousedown'};
			G.fire(eventObj);
		}
		sthis[0].onmouseup = function(e){
			var eventObj = {x:e.pageX-offset.left,y:e.pageY-offset.top,type:'mouseup'};
			G.fire(eventObj);
		}
	}
}