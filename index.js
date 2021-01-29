const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config");
const database = require("./database");
const Dog = require("./models/dog");
const User = require("./models/user");

const app = express();

database().then(info => {
	console.log(`Connecrted to ${info.host}:${info.port}/${info.name}`);
}).catch(() => {
	console.log("Unable to connect to database");
	process.exit(1);
})

app.set("view engine", "ejs");

const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get("/", function (req, res) {
	Dog.find({}).then(dogs => {
		User.find({}).then(users => {
			res.render("index", { dogs, users });
		});
	});
});

app.get("/admin", function (req, res) {
	Dog.find({}).then(dogs => {
		res.render("admin", { dogs: dogs });
	});
});

app.get("/admin/add", urlencodedParser, function (req, res) {
	res.render("add");
});
app.post("/admin/add", urlencodedParser, function (req, res) {
	const { photo, title, body, price, phone, email } = req.body;
	Dog.create({
		photo: photo,
		title: title,
		body: body,
		price: price,
		phone: phone,
		email: email,
	}).then(dog => console.log(dog._id)).catch(console.log("ОШИБКА!!!!!"));
	res.redirect("/");
});

app.get("/admin/edit/:id", function (req, res) {
	const id = req.params.id.trim().replace(/ +(?= )/g, "");
	Dog.findById(id).then(dog => {
		res.render("edit", { dog });
	});
});
app.post("/admin/edit/:id", urlencodedParser, function (req, res) {
	const { title, body, price, phone, email, dogId } = req.body;
	const id = req.params.id.trim().replace(/ +(?= )/g, "");
	Dog.findByIdAndUpdate(id, {
		title: title,
		body: body,
		price: price,
		phone: phone,
		email: email,
	}, { new: true }, function (err, dog) {
		if (err) console.log(err);
		console.log("Обновленый объект", dog);
	});
	res.redirect("/");
});

app.get("/admin/:id", function (req, res) {
	res.render("delete");
});
app.post("/admin/:id", function (req, res) {
	const id = req.params.id.trim().replace(/ +(?= )/g, "");
	Dog.findByIdAndDelete(id, function (err, doc) {
		if (err) return console.log(err);
		console.log("Удалена продажа ", doc);
	});
	res.redirect("/");
});

app.get("/register", function (req, res) {
	res.render("register");
});
app.post("/register", urlencodedParser, function (req, res) {
	const { login, password } = req.body;
	User.create({
		login: login,
		password: password,
	}).then(user => console.log(`Пользователь создан: ${user}`));
	res.redirect("/");
});

app.get("/send/:id", function (req, res) {
	const id = req.params.id.trim().replace(/ +(?= )/g, "");
	Dog.findById(id).then(dog => {
		res.render("send", { dog });
	});
});
app.post("/send/:id", urlencodedParser, function (req, res) {
	res.redirect("/");
});

app.listen(config.PORT, config.HOST_NAME, function () {
	console.log(`Сервер запущен на http://${config.HOST_NAME}:${config.PORT}/`);
});
