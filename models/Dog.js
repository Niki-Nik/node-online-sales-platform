const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
	photo: {
		type: String,
	},
	title: {
		type: String,
		required: true,
	},
	body: {
		type: String,
	},
	price: {
		type: Number,
		required: true,
	},
	phone: {
		type: Number,
		required: true,
	},
	email: {
		type: String,
		required: true,
	}
});

module.exports = mongoose.model("Dog", schema);
