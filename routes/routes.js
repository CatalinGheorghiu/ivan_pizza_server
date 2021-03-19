const pizzaRoutes = require("./pizzas");
const upload = require("./upload");

const appRouter = (app, fs) => {
	app.get("/", (req, res) => {
		res.send("Welcome to the development api-server");
	});
	// Run pizza route module
	pizzaRoutes(app, fs);
	upload(app);
};


module.exports = appRouter;