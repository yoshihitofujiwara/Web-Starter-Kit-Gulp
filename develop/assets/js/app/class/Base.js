(function () {


	function Base(name){
		this.name = name;
	}

	var p = Base.prototype;


  /**
   * setup
   * @return {[type]} [description]
   */
  p.setup = function() {
    console.log('super : ' + this.name);
  };


  /**
   * update
   * @return {[type]} [description]
   */
  p.update = function() {
  };



	/*--------------------------------------------------------------------------
		export
	--------------------------------------------------------------------------*/
	app.Base = Base;


}());
