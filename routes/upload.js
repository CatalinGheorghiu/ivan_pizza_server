const {cloudinary} = require("../utils/cloudinary");
const upload = (app) => {
	
	app.get("/images", async (req, res) => {
		const {resources} = await cloudinary.search.expression("folder:dev_setup").sort_by("public_id", "desc").max_results(30).execute();
		const publicIDs = resources.map(file => file.public_id);
		res.status(200).send(publicIDs);
	});
	
	app.post("/upload", async (req, res) => {
		try {
			const fileStr = req.body.data;
			// const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
			// 	upload_preset: "dev_setup"
			// });
			// console.log(uploadedResponse);
			console.log(fileStr);
			// console.log(fileStr);
			res.json({msg: "YAYAYAYA"});
		} catch (err) {
			res.status(500).send({message: err});
		}
	});
};

module.exports = upload;