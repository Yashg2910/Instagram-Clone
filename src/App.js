import React, {useState, useEffect} from 'react';
import './App.css';
import Post from "./Post";
import {db, auth} from "./firebase";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import PostUpload from "./PostUpload";
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const [posts, setPosts] = useState([]);

  const [modalStyle] = useState(getModalStyle);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  // SignUp credentials.
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      
      if(authUser){

        //when logged in
        console.log(authUser);
        setUser(authUser);

      }else{
        //when logged out
        setUser(null);  
      }
    })

    return () => {
      // perform cleanup actions
      unsubscribe();
    }
  }, [user, username]);

  // useeffect runs a piece of code based on certain condition
  useEffect(()=> {
    // this is where the code runs
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      // everytime change happends, this code is fired
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, [posts]);

  const signUp = (event) => {
    event.preventDefault();
    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser)=> {
      authUser.user.updateProfile({
        displayName: username,
      })
    })
    .catch((error) => alert(error.message));

    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();
    auth
    .signInWithEmailAndPassword(email, password)
    .catch((error)=> alert(error.message));

    setOpenSignIn(false);
  }
  return (
    <div className="app">

    <Modal
      open={open}
      onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerLogo"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="Instagram Logo"
              />
            </center>
              <Input
                placeholder="username"
                type="text"
                value = {username}
                onChange = { (e) => setUsername(e.target.value)} 
              />

              <Input
                placeholder="email"
                type="text"
                value = {email}
                onChange = { (e) => setEmail(e.target.value)} 
              />

              <Input
                placeholder="password"
                type="password"
                value = {password}
                onChange = { (e) => setPassword(e.target.value)} 
              />
              <Button type="submit" onClick={signUp}>SignUp</Button>
          </form>
        </div>
    </Modal>

    <Modal
      open={openSignIn}
      onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerLogo"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="Instagram Logo"
              />
            </center>

              <Input
                placeholder="email"
                type="text"
                value = {email}
                onChange = { (e) => setEmail(e.target.value)} 
              />

              <Input
                placeholder="password"
                type="password"
                value = {password}
                onChange = { (e) => setPassword(e.target.value)} 
              />
              <Button type="submit" onClick={signIn}>Login</Button>
          </form>
        </div>
    </Modal>

      {/* Header */}
      <div className="app__header">
        <img
          className="app__headerLogo"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="Instagram Logo"
        />
        
        {
          user ? (<h5>Welcome! <strong>{user.displayName}</strong></h5>):(<img
            className="app__mylogo"
            src="./logoyash.png"
            alt="Made By Yash"
          />)
        }
        {
          user ? (
            
            <Button className="app__logoutButton" onClick={() => auth.signOut()}>Log Out</Button>
          ): (
            <div className="app__loginContainer">
              <Button className="app__loginButton" onClick={() => setOpenSignIn(true)}>Log In</Button>
              <Button className="app__signupButton" onClick={() => setOpen(true)}>Sign Up</Button>
            </div>
          )
        }
        
      </div>

      {/* Posts */}
      {/* Posts */}

      <div className="app__posts">
        <div className="app__postsLeft">
          {
            posts.map(({id, post}) => (
              <Post key={id} postId={id} username={post.username} user={user} caption = {post.caption} imageUrl = {post.imageUrl} />
            ))
          }
        </div>
        <div className="app__postsRight">
          <InstagramEmbed
            url='https://www.instagram.com/p/CD1e-TIFJya/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
          />
        </div>
        
      </div>

      {user?.displayName ? (<PostUpload username={user.displayName}/>): (<p>Please Login/Sign Up to upload Posts. :)</p>)}
    </div>
  );
}

export default App;
