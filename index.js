const app = require("./src/app");

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server start on -> http://localhost:${PORT}`);
});

console.log("test");

console.log("지은");
