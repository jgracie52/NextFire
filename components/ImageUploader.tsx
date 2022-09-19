import { ActionIcon, Button, CopyButton, FileButton, Tooltip, Image, Group } from '@mantine/core';
import { IconCheck, IconCopy } from '@tabler/icons';
import { Dispatch, useState } from 'react';
import { FormState } from 'react-hook-form';
import { auth, storage, STATE_CHANGED } from '../lib/firebase';
import Loader from './Loader';

// Uploads images to Firebase Storage
export default function ImageUploader({defaultValue, register, setValue}){
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [downloadURL, setDownloadURL] = useState(defaultValue);
 
    // Create firebase upload task
    const uploadFile = async (e:File) => {
        // Remove current file 
        setDownloadURL(null);

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
            const pct = (((snapshot.bytesTransferred as number) / (snapshot.totalBytes as number)) * 100).toFixed(0);
            setProgress(Number(pct));

            // Get downloadURL AFTER task resolves (Note: this is not a native Promise)
            task
                .then((d) => ref.getDownloadURL())
                .then((url) => {
                setDownloadURL(url);
                setValue('coverImageURL', url, { shouldValidate: true, shouldDirty: true })
                setUploading(false);
                });

        });
    }
    
    return(
        <div className='box img-uploader'>
            {!downloadURL && <FileButton
                        {...register}
                        onChange={(e) => uploadFile(e)}
                        accept="image/x-png,image/gif,image/jpeg"
                    >{(props) => <Button {...props} loading={uploading}>Upload Cover image</Button>}</FileButton>}
            {/* <Loader show={uploading} /> */}
            {uploading && <h3>{progress}%</h3>}

            {/* {downloadURL && <code className="upload-snippet">{`![alt](${downloadURL})`}
                <CopyButton value={`![alt](${downloadURL})`} timeout={2000}>
                {({ copied, copy }) => (
                    <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                    <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
                        {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                    </ActionIcon>
                    </Tooltip>
                )}
                </CopyButton></code>} */}
            
            {downloadURL && 
            <>
            <Group position="apart" mt="md" mb="xs">
                <Image src={downloadURL}  width={100}/>

                <FileButton
                        onChange={(e) => uploadFile(e)}
                        accept="image/x-png,image/gif,image/jpeg"
                    >{(props) => <Button {...props} variant="default" loading={uploading}>Change</Button>}
                </FileButton>
                <Button variant="subtle" loading={uploading} onClick={() => {setDownloadURL(null); setValue('coverImageURL', null, { shouldValidate: true, shouldDirty: true })}}>Remove</Button>
            </Group>
            </>
            }
        </div>
    );
}