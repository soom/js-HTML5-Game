(function(list){  
	var jsbase,base;
	  var scripts = document.getElementsByTagName('SCRIPT');
	  for(var i=0,len=scripts.length;i<len;i++){
	    var src = scripts[i].src;
	    if(src){
	      var idx = src.lastIndexOf("/load.js");
	      if(idx>=0){
	        base = src.substring(0, idx);
	        base = base.substring(0, base.lastIndexOf('/')) + '/';
	        jsbase = base + 'js/';
	        break;
	      }
	    }
	  }
	  if(!base)
	    throw 'base path not found.';
	
  var s = [];
           
  for(var i=0,len=list.length;i<len;i++){
    s.push('<script charset="utf-8" type="text/javascript" src="'+jsbase+list[i]+'"></script>');
  }
  document.write(s.join(''));
})([
'function.js',
'event.js',
'Progress.js',
'read.js'
]);