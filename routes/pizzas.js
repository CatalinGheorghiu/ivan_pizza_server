const validation = require("../middlewares/validationMiddleware");
const createSchema = require("../validations/createValidation");
const {cloudinary} = require("../utils/cloudinary");

const pizzaRoutes = (app, fs) => {
	const dataPath = "./data/db.json";
	// GET all the pizzas
	app.get("/pizzas", (req, res) => {
		//Read the json file
		fs.readFile(dataPath, "utf8", (err, data) => {
			//If there error
			if (err) throw err;
			//Send the data
			res.status(200).send(JSON.parse(data));
		});
	});
	
	//Read single data
	app.get("/pizzas/:id", (req, res) => {
		//Read the json file
		fs.readFile(dataPath, "utf8", (err, data) => {
			//If error
			if (err) throw err;
			//Get all the pizzas and parse it
			const pizzas = JSON.parse(data);
			//Get the id
			const pizzaID = +req.params["id"];
			//Check if the pizza with the required id exists
			const found = pizzas.find(pizza => pizza.id === pizzaID);
			
			
			//If the data with the id exists
			if (found) {
				//Send the data
				res.status(200).send(found);
			} else {
				//Send message
				res.status(400).send({message: `The pizza with the id ${pizzaID} was not found`});
			}
		});
	});
	
	// //Create data
	app.post("/pizzas", validation(createSchema), (req, res) => {
		let uploadedResponse;
		fs.readFile(dataPath, "utf8", async (err, data) => {
			try {
				//Get the img string
				const fileStr = req.body.img;
				if (fileStr !== "") {
					uploadedResponse = await cloudinary.uploader.upload(fileStr, {
						upload_preset: "ivan_pizza"
					});
				}
				// console.log(uploadedResponse);
				
				//Create ID
				const pizzas = JSON.parse(data);
				const getIDMax = (cod) => pizzas.reduce((a, c) => (+a[cod] < +c[cod] ? c : a));
				const maxID = getIDMax("id");
				const newPizzaID = parseInt(maxID.id) + 1;
				
				//Create the pizza
				const pizza = {
					id: newPizzaID,
					name: req.body.name,
					origin: req.body.origin,
					ingredients: req.body.ingredients,
					img: uploadedResponse ? uploadedResponse.secure_url : "",
					description: req.body.description,
					canBeDeleted: true
				};
				console.log(pizza);
				//Add the new pizza to array
				pizzas.push(pizza);
				
				// Write the new data in the json file
				fs.writeFile(dataPath, JSON.stringify(pizzas, null, 2), (err) => {
					if (err) return console.log(err);
				});
				// console.log(pizzas);
			} catch (e) {
				console.log(e);
			}
			
		});
		res.status(201).send({message: "New Pizza Added"});
	});
	
	
	// //Update data
	app.patch("/pizzas/:id", (req, res) => {
		let uploadedResponse;
		const id = req.params.id;
		fs.readFile(dataPath, "utf8", async (err, data) => {
			try {
				//Get all the pizzas and parse it
				const pizzas = JSON.parse(data);
				//Get the ID from the para,
				const pizzaID = +req.params["id"];
				//Check if the pizza with the required id exists
				const found = pizzas.some(pizza => pizza.id === pizzaID);
				const currentPizza = pizzas.filter(pizza => pizza.id === pizzaID);
				const newDetails = req.body;
				
				let newPizza;
				const public_id = currentPizza[0].img.split(/[.\/]/).slice(9, 11).join("/");
				
				const fileStr = req.body.img;
				console.log(fileStr);
				console.log(currentPizza);
				console.log(public_id);
				if (fileStr !== "") {
					uploadedResponse = await cloudinary.uploader.upload(fileStr, {
						upload_preset: "ivan_pizza"
					});
					if (public_id) {
						await cloudinary.uploader.destroy(public_id);
					}
				}
				
				if (found) {
					newPizza = pizzas.map(pizza => pizza.id === pizzaID
						? {
							...pizza,
							id: pizzaID,
							name: newDetails.name ? newDetails.name : pizza.name,
							origin: newDetails.origin ? req.body.origin : pizza.origin,
							ingredients: newDetails.ingredients ? req.body.ingredients : pizza.ingredients,
							img: uploadedResponse ? uploadedResponse.secure_url : "",
							description: newDetails.description ? req.body.description : pizza.description,
							canBeDeleted: true
						}
						: pizza
					);
					
					
					fs.writeFile(dataPath, JSON.stringify(newPizza, null, 2), (err) => {
						if (err) return console.log(err);
					});
					res.status(200).send({message: `Successfully edited pizza with the id ${id}!`});
					
				} else {
					res.status(400).send({message: `The pizza with the id ${pizzaID} does not exist`});
				}
			} catch (e) {
				console.log(e);
			}
		});
	});
	
	//
	// //Delete data
	app.delete("/pizzas/:id", (req, res) => {
		fs.readFile(dataPath, "utf8", async (err, data) => {
			try {
				//Get all the pizzas and parse it
				const pizzas = JSON.parse(data);
				//Get the ID from the param
				const pizzaID = +req.params["id"];
				//Check if the pizza with the required id exists
				const found = pizzas.some(pizza => pizza.id === pizzaID && pizza.canBeDeleted === true);
				const toDelete = pizzas.find(pizza => pizza.id === pizzaID);
				// console.log(toDelete);
				const public_id = toDelete.img.split(/[.\/]/).slice(9, 11).join("/");
				
				if (toDelete.img !== "") {
					await cloudinary.uploader.destroy(public_id);
				}
				
				if (found) {
					
					const newArray = pizzas
					//Delete the pizza from the array
					.map(pizza => pizza.id === pizzaID ? delete {...pizza} : pizza)
					//Filter the array
					.filter(pizza => pizza !== true);
					
					// res.send(newArray);
					//Write the new data into the JSON file
					fs.writeFile(dataPath, JSON.stringify(newArray, null, 2), (err) => {
						if (err) return console.log(err);
					});
					
					//Send OK status if the pizza was successfully deleted
					res.status(200).send({
						message: `Item has been deleted!`
					});
					
				} else {
					//Send a bad request
					
					if (toDelete?.canBeDeleted === false) {
						res.status(400).send({message: `The pizza with the id ${pizzaID} can't be deleted`});
					} else {
						res.status(400).send({message: `The pizza with the id ${pizzaID} does not exist`});
						
					}
				}
				
				
			} catch (e) {
				console.log(e);
			}
		});
	});
};


module.exports = pizzaRoutes;