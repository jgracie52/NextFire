import { Card, Group, Text, Image } from '@mantine/core';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// UI component for main post content
export default function PostContent({ post }) {
  const createdAt = typeof post?.createdAt === 'number' ? new Date(post.createdAt) : post.createdAt.toDate();

  return (
    // <div className="card">
    //   <h1>{post?.title}</h1>
    //   <span className="text-sm">
    //     Written by{' '}
    //     <Link href={`/${post.username}/`}>
    //       <a className="text-info">@{post.username}</a>
    //     </Link>{' '}
    //     on {createdAt.toISOString()}
    //   </span>
    //   <ReactMarkdown>{post?.content}</ReactMarkdown>
    // </div>

    <Card shadow="sm" p="lg" radius="md" withBorder className="articleContentCard">
      <Card.Section>
        <Image
          src={post?.coverImageURL || '/cover-placeholder-image.jpg'}
          height={160}
          alt="Cover image"
        />
      </Card.Section>

      <Group position="apart" mt="md" mb="xs">
        <Text weight={500} size={'xl'}>{post?.title}</Text>
        <Group>
          <Text>Written by</Text>
          <Text component='a' className="text-info" weight={100} href={`/${post.username}`}>@{post.username}</Text>
          <Text weight={100}>on {createdAt.toISOString()}</Text>
        </Group>
      </Group>

      <ReactMarkdown remarkPlugins={[remarkGfm]}>{post?.content}</ReactMarkdown>
    </Card>
  );
}
