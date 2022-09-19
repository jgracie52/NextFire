import styles from '../../styles/Admin.module.css';
import AuthCheck from '../../components/AuthCheck';
import PostFeed from '../../components/PostFeed';
import { UserContext } from '../../lib/context';
import { firestore, auth, serverTimestamp } from '../../lib/firebase';

import { useContext, useState } from 'react';
import { useRouter } from 'next/router';

import { useCollection } from 'react-firebase-hooks/firestore';
import kebabCase from 'lodash.kebabcase';
import toast from 'react-hot-toast';
import { Button, Modal, Grid, Center, Box, Text, Progress, Group, Input, TextInput, useMantineTheme } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons';
import { useInputState } from '@mantine/hooks';
import FormRequirement from '../../components/FormRequirement';


export default function AdminPostsPage({ }) {
  return (
    <main>
      <AuthCheck>
        <PostList></PostList>
      </AuthCheck>
    </main>
  )
}

function PostList(){
  const ref = firestore.collection('users').doc(auth.currentUser.uid).collection('posts');
  const query = ref.orderBy('createdAt');
  const [querySnapshot] = useCollection(query);
  const [newPost, newPostToggle] = useState(false);

  const posts = querySnapshot?.docs.map((doc) => doc.data());

  return(
    <>
      <Grid>
        <Grid.Col xs={10}>
          <h1>Manage your Posts</h1>
        </Grid.Col>
        <Grid.Col xs={2} sx={{display:'flex', justifyContent:'flex-end'}}>
          <Button radius="xl" sx={{ height: 30, alignSelf:'center', justifySelf:'flex-end' }} onClick={() => newPostToggle(true)}>
                      Create Post
          </Button>
        </Grid.Col>
      </Grid>
      <PostFeed posts={posts} admin={true}></PostFeed>
      <CreateNewPost display={newPost} setDisplay={newPostToggle}></CreateNewPost>
    </>
  );
}

function CreateNewPost({display, setDisplay}){
  const router = useRouter();
  const {username} = useContext(UserContext);
  const [title, setTitle] = useState('');
  const theme = useMantineTheme();

  // ensure slug is URL safe
  const slug = encodeURI(kebabCase(title));

  // Validate length
  const isValid = title.length > 3 && title.length < 100;

  // Create new post in firestore
  const createPost = async (e) => {
    e.preventDefault();
    const uid:string = auth.currentUser.uid;
    const ref = firestore.collection('users').doc(uid).collection('posts').doc(slug);

    // Tip: give all fields a default value here
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: '# hello world!',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };
    
    await ref.set(data);

    toast.success('Post Created');

    // Imperative navigation after doc is set
    router.push(`admin/${slug}`);
  }

  return(
    <Modal
        opened={display}
        onClose={() => setDisplay(false)}
        title="Create New Post"
        overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
        overlayOpacity={0.55}
        overlayBlur={3}
      >
          <form onSubmit={createPost}>
            <TitleCheck value={title} valueChanged={setTitle} slug={slug}></TitleCheck>
            <Group position="right" mt="md">
              <Button
                type='submit'
                disabled={!isValid}
                >
                  Create New Post
              </Button>
            </Group>
          </form>
    </Modal>
  );
}

export function TitleCheck({value, valueChanged, slug}) {
  return (
    <div>
      <TextInput
        value={value}
        onChange={(e) => valueChanged(e.target.value)}
        placeholder="Your Awesome Article"
        label="Article Title"
        required
      />

      <FormRequirement label="Has at least 3 characters" meets={value.length > 3} />
      <FormRequirement label="Has less than 100 characters" meets={value.length < 100} />
      <Text color={'black'} mt={5} size="sm">
              <Center inline>
                <strong>Slug:</strong>
                <Box ml={7}>{slug}</Box>
              </Center>
      </Text>
    </div>
  );
}