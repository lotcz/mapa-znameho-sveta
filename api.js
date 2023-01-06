const cors = require("cors");
const express = require("express");
const fs = require("fs");

const path = 'src/resources.json';
const port = 88;

const corsOptions = {
	origin: "http://localhost:8081"
};

const upload = (req, res) => {
	console.log('saving...');
	req.pipe(fs.createWriteStream(path, {flags:'w'}));
	res.send("OK");
}

const router = express.Router();
router.post("/save-resources", upload);

const app = express();
app.use(cors(corsOptions));
app.use(express.raw());
app.use(router);

app.listen(port, () => {
	console.log(`Running at localhost:${port}`);
});
