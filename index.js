require('babel-core/register');
const checker = require('./checker').default;

try {
	checker();
} catch (err) {
	console.log(err.message);
	process.exit(1);
}
