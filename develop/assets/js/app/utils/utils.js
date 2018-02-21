(function(){

	var utils = {};


	/**
	 * template
	 * @return {[type]} [description]
	 */
	utils.template = function(){
	};


	/**
	 * 継承
	 * inherits
	 * @param  {Function} subClass
	 * @param  {Function} superClass
	 * @return {Function} subClass
	 */
  utils.inherits = function(subClass, superClass){
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = superClass;
    return subClass;
  };


	/*--------------------------------------------------------------------------
		exports
	--------------------------------------------------------------------------*/
	app.utils = utils;

}());
