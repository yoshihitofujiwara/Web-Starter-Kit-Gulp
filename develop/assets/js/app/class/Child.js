(function () {


  function Child(name, num){
    // super class call
    app.Base.call(this, name);

    this.name = name;
    this.num = num;
  }

  app.utils.inherits(Child, app.Base);
  var p = Child.prototype;


  /**
   * @override
   * setup
   * @return {[type]} [description]
   */
  p.setup = function() {
    console.log('child : ' + this.name);
  };







  /*--------------------------------------------------------------------------
    export
  --------------------------------------------------------------------------*/
  app.Child = Child;


}());
