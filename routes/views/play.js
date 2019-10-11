const keystone = require('keystone');
const async = require('async');
const _helpers = require('../helpers');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// Init locals
	locals.section = 'play';
	locals.filters = {
		category: req.params.category,
	};
	locals.data = {
		categories: [],
		records: [], // main list
		route: 'play', // used in pagination
	};

	// Load all categories
	view.on('init', function (next) {
		keystone.list('GameCategory').model.find().sort('name').exec(function (err, results) {
			if (err || !results.length) {
				return next(err);
			}

			locals.data.categories = results;

			// Load the counts for each category
			async.each(locals.data.categories, function (category, next) {

				keystone.list('Game').model.count().where('categories').in([category.id]).exec(function (err, count) {
					category.gameCount = count;
					next(err);
				});

			}, function (err) {
				next(err);
			});
		});
	});

	// Load the current category filter
	view.on('init', function (next) {

		if (req.params.category) {
			keystone.list('GameCategory').model.findOne({ key: locals.filters.category }).exec(function (err, result) {
				locals.data.category = result;
				next(err);
			});
		} else {
			next();
		}
	});

	// Load the games
	view.on('init', function (next) {

		const q = keystone.list('Game').paginate({
			page: req.query.page || 1,
			..._helpers.pages,
			filters: {
				state: 'published',
			},
		})
			.sort('-publishedDate')
			.populate('author categories');

		if (locals.data.category) {
			q.where('categories').in([locals.data.category]);
		}

		q.exec(function (err, results) {
			locals.data.records = results;
			next(err);
		});
	});

	// Render the view
	view.render('play');
};
