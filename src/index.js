const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const { ImageCompressor } = require("./services/image-compressor");

const app = express();
const port = 8080;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 5,
  },
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("public"));

app.set("views", path.resolve(__dirname, "./views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("It's working!");
});

app.get("/resize", (req, res) => {
  res.render("resize");
});

app.post("/resize", upload.array("images", 5), async (req, res) => {
  const files = req.files;
  const size = Number(req.body.size);

  const imageCompressor = new ImageCompressor();
  const outputFiles = await imageCompressor.resize(files, size);
  const images = outputFiles?.map((output) => {
    return {
      src: `data:image/jpeg;base64,${output.buffer.toString("base64")}`,
      filename: output.originalFile.originalname,
    };
  });
  res.render("resize-success", { images });
});

app.listen(port, () => console.log("Running on on port", port));
