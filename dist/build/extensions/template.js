!function(a){function b(b,c){a.M.EventEmitter.call(this),this.dataSource=null,this._layout="",this._sections={},a.isUndefined(c)||self.setLayout(c),a.isObject(b)&&a.each(b,function(a,b){self.section(a,b)})}var c="1.0.0",d={compilers:{},rendered:{},types:{}};b.prototype=Object.create(a.M.EventEmitter.prototype),b.prototype.constructor=b,Object.defineProperty(b,"version",{value:c}),b.prototype.connect=function(b){return null!==this.dataSource&&this.disconnect(),this.dataSource=b,a.M.isEventEmitter(b)&&this.attachHardTo(b),this.emitEvent("connected"),this},b.prototype.disconnect=function(){return null!==this.dataSource?(this.emitEvent("before_disconnect"),a.M.isEventEmitter(this.dataSource)&&(this.dataSource.removeListener(this.id),this.dataSource.detach(this)),this.dataSource=null,this.emitEvent("disconnected"),!0):!1},b.prototype.getDataSource=function(){return this.dataSource},b.prototype.isConnected=function(){return null!==this.dataSource},b.prototype.setLayout=function(a){this._layout=a},b.prototype.getLayout=function(){return this._layout},b.prototype.section=function(a,b){this._sections[a]=b},b.prototype.currentDraw=function(){return a.M.currentID(this.id+"_draw",!1)},b.prototype.getDOMID=function(){return a.M.currentID(this.id+"_draw")},b.prototype.render=function(b,c){var d=this,e={};a.M.nextID(this.id+"_draw"),e.draw=this.currentDraw(),e.dom_id=this.getDOMID(),a.isObject(b)&&a.extend(e,b),a.isObject(c)||(c={}),a.each(this._sections,function(b,f){c.hasOwnProperty(f)||(a.isFunction(b)?e[f]=b(d,d.dataSource,e):e[f]=b)}),a.extend(e,c);var f="";return f=a.isFunction(this._layout)?this._layout(d,this.dataSource,e):this._layout.toString(),a.template(f)(e)},b.prototype.reDraw=function(a,b){var c=this.getDOM();if(c){var d=this.render(a,b);return this.emitEvent("redraw"),c.first().replaceWith(d),this.emitEvent("drawn",d),!0}return!1},b.prototype.getDOM=function(){return $("#"+this.getDOMID())},b.prototype.extend=function(){var b=new this.constructor;return b.setLayout(this._layout),a.each(this._sections,function(a,c){b.section(c,a)}),b},b.hasCompiler=function(b){return a.has(d.compilers,b)},b.compiler=function(b,c){return 0==arguments.length?Object.keys(d.compilers):a.isUndefined(c)?this.hasCompiler(b)?d.compilers[b]:null:void(d.compilers[b]=c)},b.compilers=function(){return Object.keys(d.compilers)},b.render=function(b,c){return this.hasCompiler(b)?a.M.callFunc(this,d.compilers[b],[c]):!1},b.hasRendered=function(b){return a.has(d.rendered,b)},b.rendered=function(b,c){return 0==arguments.length?Object.keys(d.rendered):a.isUndefined(c)?this.hasRendered(b)?d.rendered[b]:null:void(d.rendered[b]=c)},b.register=function(a,b,c){return d.types.hasOwnProperty(a)||(d.types[a]={_default:null,constructors:{}}),d.types[a].hasOwnProperty(b)?!1:(d.types[a].constructors[b]=c,d.types[a]._default||(d.types[a]._default=b),!0)},b.types=function(){return Object.keys(d.types)},b.hasType=function(a){return d.types.hasOwnProperty(a)},b.templates=function(b,c){return c?Object.keys(d.types[b].constructors):a.clone(d.types[b].constructors)},b.hasTemplate=function(a,b){return d.types.hasOwnProperty(a)&&d.types[a].constructors.hasOwnProperty(b)},b.defaultTemplate=function(b){if(!a.isEmpty(d.types[b].constructors)){if(d.types[b]._default&&this.hasTemplate(b,d.types[b]._default))return d.types[b]._default;var c=Object.keys(d.types[b].constructors)[0];return d.types[b]._default=c,new d.types[b].constructors[c]}return!1},b.templateInstance=function(a,b){if(arguments.length<2){var c=this.defaultTemplate(a);if(!1!==c)return new d.types[a].constructors[c]}else if(this.hasTemplate(a,b))return new d.types[a].constructors[b];throw new Error("Template with name isn't exists or invalid type")},b.extend=function(b,c){var d=this.templateInstance.apply(this,a.toArray(arguments));return d.extend()},a.M.isTemplateInstance=function(a){return a instanceof b},a.M.Template=b}(_);
//# sourceMappingURL=template.js.map