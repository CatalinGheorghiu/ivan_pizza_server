const yup = require("yup");

const createSchema = yup.object().shape({
	name: yup.string().strict("'Name' must be a string").required(),
	origin: yup.string().strict("'Origin' must be a string").required(),
	ingredients: yup.array().of(yup.string()).required(),
	img: yup.string().default(""),
	description: yup.string().required()
});

module.exports = createSchema;