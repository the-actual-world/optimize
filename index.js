// Import the required modules
const express = require("express");
const sharp = require("sharp");
const multer = require("multer");
const sizeOf = require("buffer-image-size");

const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

function getMinimumValue(value, min) {
  return value < min ? min : value;
}

function getMaximumValue(value, max) {
  return value > max ? max : value;
}

app.get("/", (req, res) => {
  res.send(`
    <html>
      <body>
        <form action="/avatar" method="post" enctype="multipart/form-data">
          <input type="file" name="image" />
          <button type="submit">Optimize</button>
        </form>
      </body>
    </html>
  `);
});

app.post("/avatar", upload.single("image"), async (req, res) => {
  try {
    const imageBuffer = req.file.buffer;

    const { width: currentImageWidth, height: currentImageHeight } =
      sizeOf(imageBuffer);

    const newWidth = getMinimumValue(
      getMaximumValue(currentImageWidth, currentImageHeight),
      500
    );

    const optimizedImage = await sharp(imageBuffer)
      .resize({
        width: newWidth,
        height: newWidth,
        fit: "cover",
      })
      .webp({ quality: 75 })
      .toBuffer();

    res.set("Content-Type", "image/webp");
    res.set("Content-Length", optimizedImage.length);

    res.send(optimizedImage);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});

app.listen(8080, () => {
  console.log("App is listening on port 8080");
});
