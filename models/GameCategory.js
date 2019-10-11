const keystone = require('keystone');

/**
 * GameCategory Model
 * ==================
 */

const GameCategory = new keystone.List('GameCategory', {
	autokey: { from: 'name', path: 'key', unique: true },
});

GameCategory.add({
	name: { type: String, required: true },
});

GameCategory.relationship({ ref: 'Game', path: 'games', refPath: 'categories' });

GameCategory.register();
