import React, {useState} from 'react'
import { Button, Input } from '@material-ui/core'
import {db, storage} from "./firebase"
import firebase from "firebase"
import "./PostUpload.css"

function PostUpload({username}) {
    const [caption, setCaption] = useState('');
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // progress function
                const progress = Math.round(
                    (snapshot.bytesTransferred/snapshot.totalBytes)*100
                );
                setProgress(progress);
            },
            (error) => {
                // Error function
                console.log(error);
                alert(error.message);
            },
            () => {
                // complete function
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    // post image in the database
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username: username
                    });

                    setProgress(0);
                    setCaption('');
                    setImage(null);
                });
            }
        )
    }

    return (
        <div className="postUpload">
            {/* progress bar */}
            {/* caption */}
            {/* filepicker */}
            {/* button */}
            <progress className="imageUpload__progress" value={progress} max="100" />
            <Input className="imageUpload__caption" type="text" placeholder="Enter a caption..." onChange={event => setCaption(event.target.value)}/>
            <Input className="imageUpload__file" type="file" onChange={handleChange} />
            <Button className="imageUpload__button" onClick={handleUpload}><strong>Upload</strong></Button>
        </div>
    )
}

export default PostUpload
