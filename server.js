const express = require("express");

//////////// DATABASE //////////////////////////
const mongoose = require("mongoose");

if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

mongoose.connect(process.env.DATABASE_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Mongoose"));
///////////////////////////////////////////////

const ShortUrl = require("./models/shortUrl");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
	const shortUrls = await ShortUrl.find();
	res.render("index", { shortUrls: shortUrls });
});

app.post("/shortUrls", async (req, res) => {
	await ShortUrl.create({ full: req.body.fullUrl });
	res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
	const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
	if (shortUrl == null) return res.sendStatus(404);

	shortUrl.clicks++;
	shortUrl.save();
	res.redirect(shortUrl.full);
});

app.listen(process.env.PORT || 3000);
