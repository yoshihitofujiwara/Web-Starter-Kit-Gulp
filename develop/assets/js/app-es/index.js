import Base from './class/Base';
import Child from './class/Child';
import utils from './utils/utils';


/*--------------------------------------------------------------------------
	test
--------------------------------------------------------------------------*/
jQuery(function($){
	var base = new Base('Base');
	var child = new Child('Child', 999);

	utils.template();


	console.log('-----------');
	base.setup();

	console.log('-----------');
	child.setup();
});
