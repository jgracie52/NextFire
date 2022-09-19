import styles from '../../styles/Admin.module.css';
import AuthCheck from '../../components/AuthCheck';
import { firestore, auth, serverTimestamp, storage, STATE_CHANGED } from '../../lib/firebase';
import ImageUploader from '../../components/ImageUploader';
import insertTextAtCursor from "insert-text-at-cursor";
import { _work } from "insert-at-the-caret";

import { useRef, useState } from 'react';
import { useRouter } from 'next/router';

import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Textarea, Button, Card, Group, Text, SegmentedControl, Image, Badge, ActionIcon, FileButton, Menu, Tooltip, TextInput, Grid } from '@mantine/core';
import FormRequirement from '../../components/FormRequirement';
import { CheckboxCard, CheckboxCardProps } from '../../components/CheckBoxCard';
import { IconHeading } from '@tabler/icons';
import { MdFormatBold, MdFormatItalic, MdCode, MdImage, MdLink, MdFormatListBulleted, MdFormatListNumbered, MdFormatQuote, MdBolt, MdMoreVert, MdHelpOutline,
MdTableChart, MdFormatStrikethrough, MdCheckBox } from "react-icons/md";
import remarkGfm from 'remark-gfm'

export default function AdminPostEdit({ props }) {
  return (
    <AuthCheck>
        <PostManager />
    </AuthCheck>
  )
}

function PostManager(){
  //const [preview, setPreview] = useState(false);
  const [segControl, setSegControl] = useState('edit');
  const [tip, setTip] = useState('title');

  const router = useRouter();
  const { slug } = router.query;

  const postRef = firestore.collection('users').doc(auth.currentUser.uid).collection('posts').doc(slug as string);
  const [post] = useDocumentData(postRef);

  return(
    <main className={styles.container}>
      {post && (
        <>
          <Card withBorder shadow="sm" radius="md">
            <Card.Section withBorder inheritPadding py="xs">
              <Group position="apart">
                <Text weight={500}>Edit Article</Text>
                <Group>
                <SegmentedControl
                  value={segControl}
                  onChange={setSegControl}
                  data={[
                    { label: 'Edit', value: 'edit' },
                    { label: 'Preview', value: 'prev' },
                  ]}
                />
                <Button variant='subtle' component='a' href={`/${post.username}/${post.slug}`}>Live view</Button>
                </Group>
              </Group>
            </Card.Section>
            <section>
              <PostForm postRef={postRef} defaultValues={post} preview={segControl} setTip={setTip}/>
            </section>
          </Card>

          <aside>
            {tip == 'title' ? 
            <>
              <h3>Writing a Great Title</h3>
              <ul>
                <li>
                Think of your post title as a super short (but compelling!) description — like an overview of the actual post in one short sentence.
                </li>
                <li>
                Use keywords where appropriate to help ensure people can find your post by search.
                </li>
              </ul>
            </> : 
            <>
              <h3>Editor Basics</h3>
                <ul>
                  <li>
                  Use Markdown to write your post
                  <details>
                    <summary>Commonly used syntax</summary>
                    <Grid>
                      <Grid.Col xs={6}>
                        Header
                      </Grid.Col>
                      <Grid.Col xs={6}>

                      </Grid.Col>
                      <Grid.Col xs={6}>

                      </Grid.Col>
                      <Grid.Col xs={6}>

                      </Grid.Col>
                      <Grid.Col xs={6}>

                      </Grid.Col>
                      <Grid.Col xs={6}>

                      </Grid.Col>
                      <Grid.Col xs={6}>

                      </Grid.Col>
                      <Grid.Col xs={6}>

                      </Grid.Col>
                    </Grid>
                  </details>
                  </li>
                  <li>
                  {"Embed rich content such as Tweets, YouTube videos, etc. Use the complete URL. See a list of supported embeds."}
                  </li>
                  <li>
                  {"In addition to images for the post\'s content, you can also drag and drop a cover image."}
                  </li>
                </ul>
            </>}
          </aside>
        </>
      )}
    </main>
  );
}

function PostForm({ defaultValues, postRef, preview, setTip }){
  const { register, handleSubmit, reset, watch, setValue, formState, formState: {errors} } = useForm({defaultValues, mode: 'onChange'});
  const { ref, ...textAreaRest } = register('content', {
    maxLength: { value: 30000, message: "Content is too long!" },
    minLength: { value: 10, message: "Content is too short!" },
    required: { value: true, message: "Content is required" },
  });

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const { isValid, isDirty } = formState;

  const updatePost = async ({ content, published, coverImageURL, title }) => {
    await postRef.update({
      content,
      published,
      coverImageURL,
      title,
      updatedAt: serverTimestamp()
     });

     reset({ content, published });

     toast.success('Post updated successfully!');
  }

  const publishedBox:CheckboxCardProps = {
    description: "Make the post public to all viewers",
    defaultChecked: false,
    checked:false,
    title: "Publish",
    register: register,
    registerTag: "published"
  }

  return(
    <form className={styles.articleForm} onSubmit={handleSubmit(updatePost)}>
      {preview == 'prev' && (
        // <div className='card'>
        //   <ReactMarkdown>{watch('content')}</ReactMarkdown>
        // </div>

        <Card shadow="sm" p="lg" radius="md" withBorder className="articleContentCard">
          <Card.Section>
            <Image
              src={defaultValues.coverImageURL || '/cover-placeholder-image.jpg'}
              height={160}
              alt="Cover image"
            />
          </Card.Section>

          <Group position="apart" mt="md" mb="xs">
            <Text weight={500} size={'xl'}>{defaultValues.title}</Text>
            <Text weight={100}>{defaultValues.slug}</Text>
          </Group>

          <ReactMarkdown remarkPlugins={[remarkGfm]}>{watch('content')}</ReactMarkdown>
        </Card>
      )}

      <div className={preview == 'prev' ? styles.hidden : styles.controls}>
          <ImageUploader defaultValue={defaultValues.coverImageURL} register={register('coverImageURL')} setValue={setValue}/>
          <TextInput
            placeholder="Your awesome title"
            variant="unstyled"
            withAsterisk
            className={styles.titleInput}
            {...register('title')}
            onFocus={() => setTip('title')}
          />
          <p>ID: {defaultValues.slug}</p>
          <ArticleToolbar textRef={textAreaRef}/>
          <Textarea
            placeholder="Your Awesome Article"
            autosize
            ref={(e) => {
              ref(e)
              textAreaRef.current = e // you can still assign to ref
            }}
            variant="unstyled"
            minRows={10}
            // {...register("content", {
            //   maxLength: { value: 30000, message: "Content is too long!" },
            //   minLength: { value: 10, message: "Content is too short!" },
            //   required: { value: true, message: "Content is required" },
            // })}
            {...textAreaRest}
            onFocus={() => setTip('content')}
          />
          {errors.content &&
        <FormRequirement meets={false} label={errors.content.message.toString()}/>}

        <Card.Section withBorder inheritPadding py="xs">
          <Group position="apart" mt="md" mb="xs">
            <fieldset>
              {/* <input className={styles.checkbox} name="published" type="checkbox" {...register("published")}></input>
              <label>Published</label> */}
              <CheckboxCard {...publishedBox}/>
            </fieldset>

            <Button type="submit" disabled={!isDirty || ! isValid}>
              Save Changes
            </Button>
          </Group>
        </Card.Section>
      </div>
    </form>
  );
}

function ArticleToolbar(textRef){
  const [uploading, setUploading] = useState(false);
  const [downloadURL, setDownloadURL] = useState(null);

  // Create firebase upload task
  const uploadFile = async (e:File) => {
    // Get the file
    const file = e;//Array.from((e.target as HTMLInputElement).files)[0];
    console.log(file);
    const extension = file.type.split('/')[1];

    // Makes reference to the storage bucket location
    const ref = storage.ref(`uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`);
    setUploading(true);

    // Starts the upload
    const task = ref.put(file);


    // Listen to updates on the upload task
    task.on(STATE_CHANGED, (snapshot) => {
        // Get downloadURL AFTER task resolves (Note: this is not a native Promise)
        task
            .then((d) => ref.getDownloadURL())
            .then((url) => {
            setDownloadURL(url);
            setUploading(false);
            })
            .finally(() => {
              handleImageControlClick(textRef, downloadURL);
            });

    });
}

  return(
    <>
      <div className={styles.toolbar}>
        <Tooltip label="Bold">
          <ActionIcon color="black" size="lg" onClick={() => handleBoldControlClick(textRef)}>
            <MdFormatBold size={34} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Italics">
          <ActionIcon color="black" size="lg" onClick={() => handleItalicControlClick(textRef)}>
            <MdFormatItalic size={34} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Link">
          <ActionIcon color="black" size="lg"  onClick={() => handleLinkControlClick(textRef)}>
            <MdLink size={34} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Numbered List">
          <ActionIcon color="black" size="lg" onClick={() => handleOrderedListControlClick(textRef)}>
            <MdFormatListNumbered size={34} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Bullet List">
          <ActionIcon color="black" size="lg" onClick={() => handleUnorderedListControlClick(textRef)}>
            <MdFormatListBulleted size={34} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Header">
          <ActionIcon color="black" size="lg" onClick={() => handleHeaderControlClick(textRef)}>
            <IconHeading size={34} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Quote">
          <ActionIcon color="black" size="lg" onClick={() => handleQuoteControlClick(textRef)}>
            <MdFormatQuote size={34} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Code">
          <ActionIcon color="black" size="lg" onClick={() => handleCodeControlClick(textRef)}>
            <MdCode size={34} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Embed">
          <ActionIcon color="black" size="lg" onClick={() => handleEmbedControlClick(textRef)}>
            <MdBolt size={34} />
          </ActionIcon>
        </Tooltip>
        <FileButton onChange={(e) => uploadFile(e as File)} multiple={false}>
          {(props) => <Tooltip label="Image"><ActionIcon {...props} color="black" size="lg" loading={uploading}>
                        <MdImage size={34} />
                      </ActionIcon></Tooltip>}
        </FileButton>
        <div></div>
        <Menu position='bottom-end'>
          <Menu.Target>
          <Tooltip label="More options">
            <ActionIcon color="black" size="lg">
              <MdMoreVert size={34} />
            </ActionIcon>
          </Tooltip>
          </Menu.Target>
          <Menu.Dropdown className="flex-row-child">
            <Tooltip label="Table">
              <ActionIcon color="black" size="lg" onClick={() => handleTableControlClick(textRef)}>
                <MdTableChart size={34} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Strikethrough">
              <ActionIcon color="black" size="lg" onClick={() => handleStrikethroughControlClick(textRef)}>
                <MdFormatStrikethrough size={34} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Checkbox" onClick={() => handleTaskControlClick(textRef)}>
              <ActionIcon color="black" size="lg">
                <MdCheckBox size={34} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Help">
              <ActionIcon color="black" size="lg">
                <MdHelpOutline size={34} />
              </ActionIcon>
            </Tooltip>
          </Menu.Dropdown>
        </Menu>
      </div>
    </>
  );
}

function getTextareaSelectedText(textarea) {
  return extractSelectedText(
    textarea.value,
    textarea.selectionStart,
    textarea.selectionEnd
  );
}

function extractSelectedText(string, selectionStart, selectionEnd) {
  return string.substring(selectionStart, selectionEnd);
}

function isSelectedBlank(textarea) {
  let text = textarea.value;
  let selectionStart = textarea.selectionStart;
  let selectionEnd = textarea.selectionEnd;
  let behindChar =
    text.substring(selectionStart - 1, selectionStart).trim() || "";
  let infrontChar = text.substring(selectionEnd, selectionEnd + 1).trim() || "";

  return !behindChar && !infrontChar ? true : false;
}

function setCaretPostion(textarea, position) {
  textarea.focus();
  textarea.selectionEnd = position;
}

function insertModifications(textarea, opts) {
  let modifications = _work(textarea, opts);
  let { value, selectionStart, selectionEnd } = modifications;
  console.log(modifications);
  textarea.value = value;
  textarea.selectionStart = selectionStart;
  textarea.selectionEnd = selectionEnd;
  textarea.focus();

  return modifications;
}

function prefixList(preceding) {
  var indentSpace = 4;
  var currentLine = preceding.substring(preceding.lastIndexOf("\n") + 1);
  var firstWord = currentLine.trim().split(" ")[0];
  var indentNumber =
    firstWord === "-" ||
    (firstWord.indexOf(".") === firstWord.length - 1 &&
      isNumeric(firstWord.substring(0, firstWord.length - 1)))
      ? Math.floor(currentLine.search(/\S|$/) / 4) * 4 + indentSpace
      : 0;
  return (
    "\n" +
    Array.apply(null, { length: indentNumber })
      .map(function() {
        return " ";
      })
      .join("")
  );
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function handleBoldControlClick(ref) {
  if (!ref) return;

  let textarea = ref.textRef.current;
  let selectedText = getTextareaSelectedText(textarea);

  if (isSelectedBlank(textarea) && !selectedText) {
    insertTextAtCursor(textarea, `**bold-placeholder-text**`);
    setCaretPostion(textarea, textarea.selectionEnd - 2);
    return;
  }

  insertModifications(textarea, {
    surround: "**"
  });
}

function handleStrikethroughControlClick(ref) {
  if (!ref) return;

  let textarea = ref.textRef.current;
  let selectedText = getTextareaSelectedText(textarea);

  if (isSelectedBlank(textarea) && !selectedText) {
    insertTextAtCursor(textarea, `~~strikethrough-placeholder-text~~`);
    setCaretPostion(textarea, textarea.selectionEnd - 2);
    return;
  }

  insertModifications(textarea, {
    surround: "~~"
  });
}

function handleTableControlClick(ref) {
  if (!ref) return;

  let textarea = ref.textRef.current;
  let selectedText = getTextareaSelectedText(textarea);

  if (isSelectedBlank(textarea) && !selectedText) {
    insertTextAtCursor(textarea, 
    `| Header     | Header               |\n| --------- | ------------------- |\n| Col        |                      |\n| Gol        |                      |`);
    setCaretPostion(textarea, textarea.selectionEnd - 2);
    return;
  }

}

function handleTaskControlClick(ref) {
  if (!ref) return;

  let textarea = ref.textRef.current;
  let selectedText = getTextareaSelectedText(textarea);

  if (isSelectedBlank(textarea) && !selectedText) {
    insertTextAtCursor(textarea, 
    `* [x] Completed Task\n* [] Uncompleted Task`);
    setCaretPostion(textarea, textarea.selectionEnd - 2);
    return;
  }

}

function handleImageControlClick(ref, url) {
  if (!ref) return;

  let textarea = ref.textRef.current;
  insertTextAtCursor(textarea, `![alt](${url})`);
  setCaretPostion(textarea, textarea.selectionEnd - 2);
  return;
}

function handleCodeControlClick(ref) {
  if (!ref) return;

  let textarea = ref.textRef.current;
  let selectedText = getTextareaSelectedText(textarea);

  if (isSelectedBlank(textarea) && !selectedText) {
    insertTextAtCursor(textarea, `\`\`\`\ncode-placeholder-text\n\`\`\``);
    setCaretPostion(textarea, textarea.selectionEnd - 2);
    return;
  }

  insertModifications(textarea, {
    surround: "\n```\n"
  });
}

function handleEmbedControlClick(ref) {
  if (!ref) return;

  let textarea = ref.textRef.current;
  let selectedText = getTextareaSelectedText(textarea);

  if (isSelectedBlank(textarea) && !selectedText) {
    insertTextAtCursor(textarea, `\{% embed-placeholder-text %\}`);
    setCaretPostion(textarea, textarea.selectionEnd - 2);
    return;
  }

  insertTextAtCursor(textarea, `\{% ${selectedText} %\}`);
}

function handleHeaderControlClick(ref) {
  if (!ref) return;

  let textarea = ref.textRef.current;
  let selectedText = getTextareaSelectedText(textarea);

  if (isSelectedBlank(textarea) && !selectedText) {
    insertTextAtCursor(textarea, `# header-placeholder-text`);
    setCaretPostion(textarea, textarea.selectionEnd - 2);
    return;
  }

  insertTextAtCursor(textarea, `#${selectedText}`);
}

function handleQuoteControlClick(ref) {
  if (!ref) return;

  let textarea = ref.textRef.current;
  let selectedText = getTextareaSelectedText(textarea);

  if (isSelectedBlank(textarea) && !selectedText) {
    insertTextAtCursor(textarea, `> quote-placeholder-text`);
    setCaretPostion(textarea, textarea.selectionEnd - 2);
    return;
  }

  insertTextAtCursor(textarea, `> ${selectedText}`);
}

function handleItalicControlClick(ref) {
  if (!ref) return;

  let textarea = ref.textRef.current;
  let selectedText = getTextareaSelectedText(textarea);

  if (isSelectedBlank(textarea) && !selectedText) {
    insertTextAtCursor(textarea, `*italic-placeholder-text*`);
    setCaretPostion(textarea, textarea.selectionEnd - 2);
    return;
  }

  insertModifications(textarea, {
    surround: "*"
  });
}

function handleLinkControlClick(ref) {
  if (!ref) return;

  let textarea = ref.textRef.current;
  let selectedText = getTextareaSelectedText(textarea);

  insertModifications(textarea, selectedText => `[${selectedText || "Text"}](URL)`);
}

function handleOrderedListControlClick(ref) {
  if (!ref) return;

  const prefix = prefixList;

  insertModifications(ref.textRef.current, {
    newLineChars: "1. ",
    prefix
  });
}

function handleUnorderedListControlClick(ref) {
  if (!ref) return;

  const prefix = prefixList;

  insertModifications(ref.textRef.current, {
    newLineChars: "- ",
    prefix
  });
}