const keystone = require('keystone');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// Set locals
	locals.section = 'play';
	locals.filters = {
		slug: req.params.slug,
	};
	locals.data = {
		route: 'play/game',
		record: {},
	};

	// Load the current game
	view.on('init', function (next) {
		const q = keystone.list('Game').model.findOne({
			state: 'published',
			slug: locals.filters.slug,
		}).populate('author categories');

		q.exec(function (err, result) {
			locals.data.record = result;
			next(err);
		});

		console.log('3');
	});

	// Load other games
	// view.on('init', function (next) {
	//
	// 	const q = keystone.list('Game').model.find().where('state', 'published').sort('-publishedDate').populate('author').limit('4');
	//
	// 	q.exec(function (err, results) {
	// 		locals.data.records = results;
	// 		next(err);
	// 	});
	//
	// });

	// Render the view
	view.render('game');
};
