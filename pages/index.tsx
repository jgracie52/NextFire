import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'
import { firestore, postToJSON, fromMillis } from '../lib/firebase'
import { useState } from 'react'
import PostFeed from '../components/PostFeed'
import { Button, Text } from '@mantine/core'

const LIMIT = 10;

export async function getServerSideProps(context){
  const postsQuery = firestore
    .collectionGroup('posts')
    .where('published', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(LIMIT);

  const posts = (await (postsQuery.get())).docs.map(postToJSON);

  return{
    props: { posts }
  };
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    const cursor = typeof last.createdAt === 'number' ? fromMillis(last.createdAt) : last.createdAt;
    
    const query = firestore
    .collectionGroup('posts')
    .where('published', '==', true)
    .orderBy('createdAt', 'desc')
    .startAfter(cursor)
    .limit(LIMIT);

    const newPosts = (await query.get()).docs.map((doc) => doc.data());

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if(newPosts.length < LIMIT){
      setPostsEnd(true);
    }
  }

  return (
    <main className='main-post-div'>
      <PostFeed posts={posts} admin={false}></PostFeed>

      {!postsEnd && <Button radius="xl" sx={{ height: 30, marginTop: 15, alignSelf: 'center', justifySelf: 'center'}} onClick={getMorePosts} loading={loading}>Load More</Button>}

      {/* <Loader show={loading}></Loader> */}

      {postsEnd && <Text sx={{ height: 30, marginTop: 15, alignSelf: 'center', justifySelf: 'center'}}>You have reached the end!</Text>}
    </main>
  )
}
