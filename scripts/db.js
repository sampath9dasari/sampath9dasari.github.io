/* Database mysql
 * Team pclubGU
 * The MIT License
 */
module.exports.db = function(opt) {
	var opt = require('mysql');
	var conn  = opt.createPool({
	  host     : 'localhost',
	  user     : 'root',
	  password : 'akhil'
	});
	return opt;
}
