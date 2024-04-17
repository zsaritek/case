import { useState } from "react";
import { createUseStyles } from "react-jss";
import { useWebcamCapture } from "./useWebcamCapture";
// import logo from './logo.svg'
import slap from "./stickers/slap.png";
import heart from "./stickers/heart.png";
import sleepy from "./stickers/sleepy.png";
import selfie from "./stickers/selfie.png";
import hungry from "./stickers/hungry.png";
import girin from "./stickers/girin.png";
import friends from "./stickers/friends.png";
import brain from "./stickers/brain.png";

const useStyles = createUseStyles((theme) => ({
  "@global body": {
    background: theme.palette.background,
    color: theme.palette.text,
    fontFamily: "sans-serif",
  },

  App: {
    padding: "20px",
    background: theme.palette.primary,
    maxWidth: "800px",
    minHeight: "600px",
    margin: "auto",
    "& a": {
      color: theme.palette.text,
    },
  },
  Header: {
    "&  h1": {
      fontFamily: "sans-serif",
      cursor: "pointer",
      fontSize: "4rem",
    },
  },
  Main: {
    background: theme.palette.secondary,

    "& canvas": {
      width: "100%",
      height: "auto",
    },
    "& video": {
      display: "none",
    },
  },
  Stickers: {
    "& img": {
      height: "4rem",
    },
  },
  Gallery: {
    "& img": {
      height: "16rem",
    },
  },
  Picture: {
    background: "black",
    padding: 4,
    position: "relative",
    display: "inline-block",
    "& h3": {
      padding: 8,
      textAlign: "center",
      width: "100%",
    },
  },
}));

const stickers = [slap, heart, sleepy, selfie, hungry, girin, friends, brain, selfie].map((url) => {
  const img = document.createElement("img");
  img.src = url;
  return { img, url };
});

function App(props) {
  // css classes from JSS hook
  const classes = useStyles(props);
  // currently active sticker
  const [sticker, setSticker] = useState();
  // title for the picture that will be captured
  const [title, setTitle] = useState("SLAPPE!");

  // webcam behavior hook
  const [
    handleVideoRef, // callback function to set ref for invisible video element
    handleCanvasRef, // callback function to set ref for main canvas element
    handleCapture, // callback function to trigger taking the picture
    pictures, // latest captured picture data object
  ] = useWebcamCapture(sticker?.img, title);

  return (
    <div className={classes.App}>
      <header className={classes.Header}>
        <h1>SlapSticker</h1>
        <p>
          Have you ever said something so dumb, you just wanted to slap
          yourself? Well now you can!
        </p>
      </header>
      <main>
        <section className={classes.Gallery}>
          Message:
          <input
            type="text"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
          />
        </section>
        <section className={classes.Stickers}>
          {
            stickers.map((sticker) => (
              <button onClick={() => setSticker(sticker)}>
                <img src={sticker.url} alt="sticker" />
              </button>)
            )}
        </section>
        <section className={classes.Main}>
          <video ref={handleVideoRef} />
          <canvas
            ref={handleCanvasRef}
            width={2}
            height={2}
            onClick={handleCapture}
          />
        </section>
        <section className={classes.Gallery}>
          Cherish this moment forever
          <br />
          {pictures && pictures.map((picture, index) =>
          (<div className={classes.Picture} key={index}>
            <img src={picture.dataUri} alt={picture.title} />
            <h3>{picture.title}</h3>
          </div>)
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
