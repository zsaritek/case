# My steps

### step 1 - running project
my node version is 

```
$ node --version
v18.17.0
```
So it was failing as ERR_OSSL_EVP_UNSUPPORTED, so I googled and found solution to include env variable  https://stackoverflow.com/questions/69719601/getting-error-digital-envelope-routines-reason-unsupported-code-err-oss

```
"scripts": {
    "start": "NODE_OPTIONS=--openssl-legacy-provider react-scripts start",
    "build": "NODE_OPTIONS=--openssl-legacy-provider react-scripts build",
    "test": "NODE_OPTIONS=--openssl-legacy-provider react-scripts test",
    "eject": "NODE_OPTIONS=--openssl-legacy-provider react-scripts eject"
  },
```

### step 2 multiple image capture

useWebcamCapture was returning only one captured image and that was rendered only one 
```
// webcam behavior hook
  const [
    handleVideoRef, // callback function to set ref for invisible video element
    handleCanvasRef, // callback function to set ref for main canvas element
    handleCapture, // callback function to trigger taking the picture
    picture, // latest captured picture data object
  ] = useWebcamCapture(sticker?.img, title);
...
 {picture && (
                <div className={classes.Picture}>
                  <img src={picture.dataUri} />
                  <h3>{picture.title}</h3>
                </div>
  )}
```

I changed useWebcamCapture to store multiple captured image and display them

```
at useWebcamCapture
setPictures(prevPictures => [...prevPictures, { dataUri: data, title }]);
...

at App
  const [
    handleVideoRef, // callback function to set ref for invisible video element
    handleCanvasRef, // callback function to set ref for main canvas element
    handleCapture, // callback function to trigger taking the picture
    pictures, // latest captured picture data object
  ] = useWebcamCapture(sticker?.img, title);
...
 {pictures && pictures.map((picture, index) =>
              (<div className={classes.Picture} key={index}>
                <img src={picture.dataUri} alt={picture.title} />
                <h3>{picture.title}</h3>
              </div>)
  )}
```
### step 3 multiple sticker 

- stickers are grouped under /src/stickers
- they are imported at App.js
- map is used to select from more than one sticker
```
 {
  stickers.map((sticker) => (
    <button onClick={() => setSticker(sticker)}>
      <img src={sticker.url} />
    </button>)
  )}
```
