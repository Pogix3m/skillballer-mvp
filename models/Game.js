const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Game Model
 * ==========
 */

const Game = new keystone.List('Game', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
});

Game.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, ended, archived', default: 'draft', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	endDate: { type: Types.Date, index: true, dependsOn: { state: 'ended' } },
	image: { type: Types.CloudinaryImage },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 },
	},
	categories: { type: Types.Relationship, ref: 'GameCategory', many: true },
});

Game.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

Game.defaultColumns = 'title, state|20%, author|20%, publishedDate|10%, endDate|10%';
Game.register();
