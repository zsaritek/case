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

### step 4 cleanup

- removed unnecessary route(readme)
- removed switch(there is only one page)
- removed step names 


### step 5 default message for the sticker

- I defined default message for each sticker because Slappe could not be use for other stickers. 
```
const stickers = [
  {
    url: slap,
    title: "SLAPPE!"
  },
```

- Set default title for captured image is changed.
```const [title, setTitle] = useState('...');```

- When sticker selected, Title is set with setTitle.
``` 
{
  stickers.map((sticker) => (
    <button onClick={() => {
      setSticker(sticker)
      setTitle(sticker.title)
    }
}
```

### step 6 default message for the sticker

- handle *esc* keyboard to unselect sticker
```
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
```

- disable screen capture if no sticker is selected, check stickerImg at if check
```
  const onCapture = useCallback(
    (ev) => {
      if (stickerImg && canvasRef) {
        const data = canvasRef.toDataURL("image/png");
        setPictures(prevPictures => [...prevPictures, { dataUri: data, title }]);
      }
    },
    [canvasRef, title]
  );
```

### step 7 download and share

- I used react-icons
- added two button, *download* and *shared*  
- implemented handle function
- for shared, I left empty, only console.log

```
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
    setSharePlatform(null); // Close the dropdown after sharing
  };

  ...

   <button onClick={() => handleDownload(picture.dataUri, `captured-${index}`)}>
   <FiDownload /></button>
    
    <div className="dropdown">
      <button className="dropdown-toggle" onClick={() => {
        setSelectedImageIndex(index)
        setSharePlatform(prev => prev === null ? 'open' : null)
      }
      }>
        <FiShare2 />
      </button>
      {sharePlatform && selectedImageIndex === index && (
        <div className="dropdown-menu">
          <button onClick={() => handleShare(picture.dataUri, `captured-${index}`, 'Facebook')}>
            <FiFacebook />
          </button>
          <button onClick={() => handleShare(picture.dataUri, `captured-${index}`, 'Instagram')}>
            <FiInstagram />
          </button>
          <button onClick={() => handleShare(picture.dataUri, `captured-${index}`, 'Twitter')}>
            <FiTwitter />
          </button>
        </div>
      )}
    </div>
  </div>)
  )}
```
