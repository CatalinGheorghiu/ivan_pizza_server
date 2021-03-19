const yup = require("yup");

const updateValidation = yup.object().shape({
	name: yup.string().strict("'Name' must be a string"),
	origin: yup.string().strict("'Origin' must be a string"),
	ingredients: yup.array().of(yup.string()),
	img: yup.string().url(),
	description: yup.string().strict("'Description must be a string'")
});

module.exports = updateValidation;