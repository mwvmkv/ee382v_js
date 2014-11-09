

var PIN_JS_AST_Parser = function (code) {
	// Options for the acorn parser when generating the AST		
	this.acorn_options = new Object;
	// Whether to include location information
	this.acorn_options['loc'] = true;
	// Description of the source input
	this.acorn_options['source'] = null;
	// Initial line number for source info
	this.acorn_options['line'] = 1;
	// Builder object for custom data format
	this.acorn_options['builder'] = null;
	// Parse the source code
	this.ast = acorn.parse(code,this.acorn_options);
	PIN_JS_ORIGINAL_SRC = code;
};

PIN_JS_AST_Parser.prototype.walkTree = function () {
	
	this.visitors = new Object();

	function printLoc(start,finish) {
		console.log(PIN_JS_ORIGINAL_SRC.slice(start,finish));
	};
	
	this.visitors['Program'] = function(node) {
		//console.log(node);
	};
	
	this.visitors['Expression'] = function(node) {
		//console.log("Found an expression: ");
		//console.log(node);
	};

	this.visitors['VariableDeclaration'] = function(node) {
		printLoc(node.start,node.end);
	};

	acorn.walk.simple(this.ast,this.visitors);

};
