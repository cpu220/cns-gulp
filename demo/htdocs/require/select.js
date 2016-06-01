define(function(request,exports,module){
  var A=function(object){
    this.name=object.name;
  }
  A.prototype.getName=function(){
    return this.name;
  }

  module.exports=A;
})
