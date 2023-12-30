import React, { useCallback, useState } from 'react'
import { useDropzone, FileWithPath } from 'react-dropzone'
import { Button } from '../ui/button'

type FileUploderProps = {
    fieldChange: (FILES: File[]) => void,
    mediaUrl: string
}

const FileUploder = ({ fieldChange, mediaUrl }: FileUploderProps) => {
    const [fileUrl, setFileUrl] = useState<string>(mediaUrl);
    const [file, setFile] = useState<File[]>([]);
    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        console.log(acceptedFiles, "accept file");

        setFile(acceptedFiles);
        fieldChange(acceptedFiles);
        setFileUrl(URL.createObjectURL(acceptedFiles[0]))
    }, [file])
    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'image/*': ['.png', '.jpeg', '.jpg', '.svg'] } })

    return (
        <div className='flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer' {...getRootProps()}>
            <input {...getInputProps()} className='cursor-pointer' />
            {
                fileUrl ?
                    <>
                        <div className='flex flex-1 justify-center w-full p-5 lg:p-10'>
                            <img src={fileUrl} alt="image" className='file_uploader-img' />

                        </div>
                        <p className='file_uploader-label'>Click or Drage Photo to replace </p>
                    </>
                    :
                    <div className='file_uploader-box '>
                        <img src="/assets/icons/file-upload.svg" alt="upload file" width={96} height={77} />
                        <h3 className='base-light text-light-2 mb-2 mt-6'>Drag Photo here </h3>
                        <p className='text-light-4 small-reguler mb-6'>SVG,PNG,JPG</p>
                        <Button className='shad-button_dark_4' type='button'>Select from your device</Button>
                    </div>
            }
        </div>
    )
}

export default FileUploder