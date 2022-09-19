import { auth, firestore, googleAuthProvider } from "../lib/firebase";
import { useContext, useEffect, useState, useCallback } from "react";
import { DiscordIcon, TwitterIcon } from '@mantine/ds';
import { UserContext } from "../lib/context";
import debounce from 'lodash.debounce';
import {
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Button,
  Image
} from '@mantine/core';
import { FacebookButton, GoogleButton } from "../components/SocialButtons";
import { ThemeContext, withTheme } from "@emotion/react";

export default function Page({ }) {
  const { user, username } = useContext(UserContext)

  return (
    <main>
        {
          user ?
            !username ? <UsernameForm></UsernameForm> : <SignOutButton></SignOutButton>
            :
            <SignInButton></SignInButton>
        }
    </main>
  )
}

function SignInButton(){
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  }
  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
      >
        Welcome back!
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Do not have an account yet?{' '}
        <Text size="sm" gradient={{ from: 'red', to: 'pink', deg: 45 }} variant="gradient">
          Create account
        </Text>
      </Text>

      <Paper withBorder className="sign-in-container" shadow="md" p={30} mt={30} radius="md">
        <Button className="signin-btn" variant="default" color="gray" onClick={signInWithGoogle}><Image src='/google.png' width={30}/> Continue with Google</Button>
           <Button className="signin-btn"
              sx={(theme) => ({
                backgroundColor: '#4a6ea8',
                color: '#fff',
                '&:hover': {
                  backgroundColor: theme.fn.darken('#4267B2', 0.1),
                },
              })}
              ><Image src='/facebook.svg' width={30} /> Signin with Facebook</Button>
              <Button className="signin-btn"
              component="a"
              variant="default"
            ><TwitterIcon size={25} color="#00ACEE" /> Follow with Twitter</Button>
            <Button className="signin-btn"
            sx={(theme) => ({
              backgroundColor: theme.colorScheme === 'dark' ? '#5865F2' : '#5865F2',
              '&:hover': {
                backgroundColor:
                  theme.colorScheme === 'dark'
                    ? theme.fn.lighten('#5865F2', 0.05)
                    : theme.fn.darken('#5865F2', 0.05),
              },
            })}
          ><DiscordIcon size={25} /> Join with Discord</Button>
      </Paper>
  </Container>
  );
}

function SignOutButton(){
  return (<button onClick={() => auth.signOut()}>Sign Out</button>);
}

function UsernameForm(){
  const [formValue, setFormValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const {user, username} = useContext(UserContext);

  const onSubmit = async (e) => {
    e.preventDefault();

    // Create refs for both docs
    const userDoc = firestore.doc(`users/${user.uid}`);
    const usernameDoc = firestore.doc(`username/${formValue}`);

    // Commit both docs together as a batch write
    const batch = firestore.batch();
    batch.set(userDoc, {username: formValue, photoURL: user.photoURL, displayName: user.displayName});
    batch.set(usernameDoc, {uid: user.uid })

    await batch.commit();
  };

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  const onChange = (e) => {
    // Force value to match required format
    const val:string = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set value if less than 3 or matches regex
    if(val.length < 3){
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  // Hit database to validate the username
  const checkUsername = useCallback(debounce(async (username:string) => {
    if(username.length >= 3){
      const ref = firestore.doc(`usernames/${username}`);
      const {exists} = await ref.get();
      console.log('Firestore read executed!');
      setIsValid(!exists);
      setLoading(false);
    }
  }, 500), []);

  return(
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input name="username" placeholder="username" value={formValue} onChange={onChange}></input>
          <UsernameMessage username={formValue} loading={loading} isValid={isValid}></UsernameMessage>
          <button className="btn-green" type="submit" disabled={!isValid}>
            Choose
          </button>

          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  );
}
 
function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}