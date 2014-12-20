APP = {
	call: function(func, callback){
		try{
			window[func]();
			// APP[func]();
			callback();
		} catch(err){
			// console.log("fail");
			// console.log(err.message);
			// console.log(err.type);
			// console.log(err.stack);
		}
	}
}