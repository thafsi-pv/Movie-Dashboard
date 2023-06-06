const express = require("express");
const movieModel = require("../Models/movieModel");
const genreModel = require("../Models/genreModel");
const multer = require("multer");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = file.originalname.split(".").pop();
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + extension);
  },
});

const upload = multer({
  storage: storage,
});

router.get("/", async (req, res) => {
  try {
    const movieList = await movieModel
      .find({})
      .populate("genre")
      .sort({ createdAt: "desc" });
    res.json(movieList);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/", upload.single("movie_img"), async (req, res) => {
  try {
    console.log(req.file);
    let imgn = "";
    if (req.body.id != 0 && req.file == undefined) {
      const data = await movieModel.findById(req.body.id);
      imgn = data.imageName;
    }
    const movie = {
      imageName:
        req.body.id != 0 && req.file == undefined ? imgn : req.file.filename,
      movieName: req.body.movieName,
      rating: req.body.rating,
      genre: req.body.genre.split(","),
    };

    if (req.body.id != 0) {
      const resmovie = await movieModel.findByIdAndUpdate(req.body.id, {
        ...movie,
      });
      res.json(resmovie);
    } else {
      const movieList = await movieModel.create(movie);
      res.json(movieList);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/movieById", async (req, res) => {
  try {
    const movie = await movieModel.findById(req.body.id);
    res.json(movie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/", async (req, res) => {
  try {
    console.log(
      "🚀 ~ file: Movie.js:67 ~ router.delete ~ req.body.id:",
      req.body.id
    );
    const data = await movieModel.findByIdAndDelete(req.body.id);
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
