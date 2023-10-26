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

app.get("/", (req, res) => {
  res.send(`
    <html>
      <body>
        <form action="/optimize" method="post" enctype="multipart/form-data">
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

    const optimizedImage = await sharp(imageBuffer)
      .resize({
        width: getMinimumValue(currentImageWidth, 500),
        height: getMinimumValue(currentImageHeight, 500),
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
