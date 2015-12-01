require('babel-core/register');
const checker = require('./checker').default;

try {
	checker();
} catch (err) {
	console.log(err);
	process.exit(1);
}
