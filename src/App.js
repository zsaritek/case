import React from "react";
import { useState, useEffect } from "react";
import { createUseStyles } from "react-jss";
import { useWebcamCapture } from "./useWebcamCapture";
import { FiDownload, FiShare2, FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi';

import slap from "./stickers/slap.png";
import heart from "./stickers/heart.png";
import ring from "./stickers/ring.png";
import reindeer from "./stickers/reindeer.png"
import santaHat from "./stickers/santaHat.png"

import backgroundImage from "./christmas.jpg";
import useSound from 'use-sound';
import christmas from "./christmas.mp3";

const useStyles = createUseStyles((theme) => ({
  "@global body": {
    background: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
    color: theme.palette.text,
    fontFamily: "sans-serif",
  },

  App: {
    padding: "20px",
    maxWidth: "800px",
    minHeight: "600px",
    margin: "auto",
    "& a": {
      color: theme.palette.text,
    },
  },
  Header: {
    textAlign: "center",
    fontFamily: "sans-serif",
    color: "white",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)"
  },
  HeaderContent: {
    color: "white",
    textAlign: "center",
    fontFamily: "sans-serif",
  },

  Main: {
    background: theme.palette.secondary,
    border: "10px solid black",
    borderRadius: "8px",
    overflow: "hidden",


    "& canvas": {
      width: "100%",
      height: "auto",
    },
    "& video": {
      display: "none",
    },
  },
  Stickers: {
    display: "flex",
    justifyContent: "center",
    "& button": {
      margin: "5px",
    },
    "& img": {
      height: "4rem",
    },
  },
  Gallery: {
    "& img": {
      height: "16rem",
    },
    "& h2": {
      marginBottom: "20px",
      color: "black",
    },
  },
  GalleryFlex: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    columnGap: "20px",
  },
  Picture: {
    margin: "35px",
    background: "black",
    padding: 4,
    position: "relative",
    display: "inline-block",
    "& h3": {
      padding: 8,
      textAlign: "center",
      width: "100%",
    },
    '& .button-container': {
      display: 'flex',
      width: '120px',
    },
    '& button': {
      marginRight: '10px',
      width: '40px',
    }
  },
  ShareButtons: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    position: 'absolute',
    top: '100%',
    left: 0,
    padding: '0px',
    borderRadius: '5px',
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  ShareButton: {
    marginBottom: '5px',
    border: 'none',
    cursor: 'pointer',
  },
}));

const stickers = [
  {
    url: slap,
    title: "SLAPPE!"
  },
  {
    url: heart,
    title: "LOVELY!"
  },
  {
    url: ring,
    title: "RING THE BELL!"
  },
  {
    url: reindeer,
    title: "REINDEER!"
  },
  {
    url: santaHat,
    title: "HO HO HOOOO!"
  },
].map(({ url, title }) => {
  const img = document.createElement("img");
  img.src = url;
  return { img, url, title };
});


function App(props) {
  // css classes from JSS hook
  const classes = useStyles(props);
  // currently active sticker
  const [sticker, setSticker] = useState();
  // title for the picture that will be captured
  const [title, setTitle] = useState('...');
  const [sharePlatform, setSharePlatform] = useState();
  const [selectedImageIndex, setSelectedImageIndex] = useState();
  const [play] = useSound(christmas)

  // webcam behavior hook
  const [
    handleVideoRef, // callback function to set ref for invisible video element
    handleCanvasRef, // callback function to set ref for main canvas element
    handleCapture, // callback function to trigger taking the picture
    pictures, // latest captured picture data object
  ] = useWebcamCapture(sticker?.img, title);

  const handleDownload = (dataUri, title) => {
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = `${title}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = (dataUri, title) => {
    console.log(`Sharing picture: ${title}, dataUri: ${dataUri}`);
    setSharePlatform(null);
  };

  useEffect(() => {
    play()
  }, [play])

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        // reset sticker and title
        setSticker()
        setTitle('...')
      }
    };
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  return (
    <div className={classes.App}>
      <header className={classes.Header}>
        <h1>Unleash Your Inner Sparkle: Snap, Stick, and Share!</h1>
        <p className={classes.HeaderContent}>
          Ready to level up your selfie game? You're in luck! Dive into our sticker wonderland and add some serious flair to your photos. Take your pick, snap a pic, and let's make your social media sparkle like never before.
        </p>
      </header>
      <main>
        <section className={classes.Gallery}>
          <label htmlFor="concept" style={{ color: 'black', fontWeight: 'bold' }}>Concept:</label>
          <input
            type="text"
            id="concept"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
          />
        </section>
        <br />
        <section className={classes.Stickers}>
          {
            stickers.map((sticker) => (
              <button onClick={() => {
                setSticker(sticker)
                setTitle(sticker.title)
              }
              }>
                <img src={sticker.url} alt="sticker" />
              </button>)
            )}
        </section>
        <br />
        <section className={classes.Main}>
          <video ref={handleVideoRef} />
          <canvas
            ref={handleCanvasRef}
            width={2}
            height={2}
            onClick={handleCapture}
          />
        </section>
        <br />
        <section className={classes.Gallery}>
          <div className={classes.GalleryFlex}>
            <h2>Gallery</h2>
          </div>

          <div className={classes.GalleryFlex}>
            {pictures &&
              pictures.map((picture, index) => (
                <div className={classes.Picture} key={index}>
                  <img src={picture.dataUri} alt={picture.title} />
                  <h3>{picture.title}</h3>
                  <div className="button-container">
                    <div className="dropdown">
                      <button
                        className="dropdown-toggle"
                        onClick={() => {
                          setSelectedImageIndex(index);
                          setSharePlatform(
                            (prev) => (prev === null ? "open" : null)
                          );
                        }}
                      >
                        <FiShare2 />
                      </button>
                      {sharePlatform && selectedImageIndex === index && (
                        <div className={classes.ShareButtons}>
                          <button
                            onClick={() => handleShare(
                              picture.dataUri,
                              `captured-${index}`,
                              "Facebook"
                            )
                            }
                          >
                            <FiFacebook />
                          </button>
                          <button
                            onClick={() =>
                              handleShare(
                                picture.dataUri,
                                `captured-${index}`,
                                "Instagram"
                              )
                            }
                          >
                            <FiInstagram />
                          </button>
                          <button
                            onClick={() =>
                              handleShare(
                                picture.dataUri,
                                `captured-${index}`,
                                "Twitter"
                              )
                            }
                          >
                            <FiTwitter />
                          </button>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() =>
                        handleDownload(picture.dataUri, `captured-${index}`)
                      }
                    >
                      <FiDownload />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
