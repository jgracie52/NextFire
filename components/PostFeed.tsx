import { Grid } from '@mantine/core';
import Link from 'next/link';
import { ArticleCard, ArticleCardProps } from './ArticleCard';

export default function PostFeed({ posts, admin }) {
  return (
    <> 
      <Grid>
        {posts ? posts.map((post) => <Grid.Col xs={4}><PostItem post={post} admin={admin} /></Grid.Col>) : null}
      </Grid>
    </>
    );
}

function PostItem({ post, admin = false}) {
  // Naive method to calc word count and read time
  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  const articleCardProps:ArticleCardProps = {
    image: post.coverImageURL,
    link: `/${admin ? 'admin' : post.username}/${post.slug}`,
    description: post.content,
    title: post.title,
    rating: 'Test',
    author:{
      name: post.username,
      image: null
    }
  };

  return (
    // <div className="card">
    //   <Link href={`/${post.username}`}>
    //     <a>
    //       <strong>By @{post.username}</strong>
    //     </a>
    //   </Link>

    //   <Link href={`/${post.username}/${post.slug}`}>
    //     <h2>
    //       <a>{post.title}</a>
    //     </h2>
    //   </Link>

    //   <footer>
    //     <span>
    //       {wordCount} words. {minutesToRead} min read
    //     </span>
    //     <span className="push-left">💗 {post.heartCount || 0} Hearts</span>
    //   </footer>

    //   {/* If admin view, show extra controls for user */}
    //   {admin && (
    //     <>
    //       <Link href={`/admin/${post.slug}`}>
    //         <h3>
    //           <button className="btn-blue">Edit</button>
    //         </h3>
    //       </Link>

    //       {post.published ? <p className="text-success">Live</p> : <p className="text-danger">Unpublished</p>}
    //     </>
    //   )}
    // </div>
    <>
      <ArticleCard {...articleCardProps}/>
    </>
  );
}