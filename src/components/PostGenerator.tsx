'use client'
import React, { useState } from 'react'
import Box from './Box'
import { Avatar, Button, Flex, Image, Input, Typography } from 'antd'
import { useClerk } from '@clerk/nextjs'
import { Icon } from '@iconify/react'
import toast from 'react-hot-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPost } from '@/actions/post'

const PostGenerator = () => {
    const { user } = useClerk();
    const [postText, setPostText] = useState("");
    const imgInputRef = React.useRef(null);
    const videoInputRef = React.useRef(null);
    const [fileType, setFileType] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const queryClient = useQueryClient();
    const {mutate: execute, isPending} = useMutation({
        mutationFn: (data) => createPost(data),
        onSuccess: () => {
            handleSuccess();
            queryClient.invalidateQueries("posts")
        },
        onError: () => showError("Something went wrong! Try Again"),
    })

    const handleSuccess = () => {
        setSelectedFile(null);
        setFileType(null);
        setPostText("");
        toast.success("Post created successfully");
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 5 * 1024 * 1024) { // 5MB limit
            alert("File size should be less than 5MB");
            e.target.value = null; // Clear the input
            return;
        }

        if (file && file.type.startsWith("image/") || file.type.startsWith("video/")) {
            setFileType(file.type.split("/")[0]);
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => {
                setSelectedFile(reader.result);
            }
        }
    }

    const handleRemoveFile = () => {
        setFileType(null);
        setSelectedFile(null);
        if (imgInputRef.current) imgInputRef.current.value = null;
        if (videoInputRef.current) videoInputRef.current.value = null;
    }

    const showError = (message = "Something went wrong! Try Again") => {
        console.log("Error: ", message);
        toast.error(message)
    }
    
    const submitPost = () => {
        if (postText === "" || !postText.trim() && !selectedFile) {
            showError("Post cannot be empty");
            return;
        }

        execute({ postText, media: selectedFile });
    }

    return (
        <>
            <Box className='rounded-2xl !p-[1.5rem] overflow-hidden position-relative' style={{ boxShadow: "var(--box-shadow)" }}>
                <Flex vertical gap={'1rem'} align='flex-start'>
                    <Flex style={{ width: "100%" }} gap={"1rem"} align='center'>
                        <Avatar src={user?.imageUrl}
                            style={{
                                width: "2.6rem",
                                height: "2.6rem",
                                boxShadow: "var(--avatar-shadow)"
                            }}
                        />

                        <Input.TextArea
                            placeholder='Share what your are thinging...'
                            style={{ height: 80, resize: "none", flex: 1 }}
                            value={postText}
                            onChange={(e) => setPostText(e.target.value)}
                        />
                    </Flex>

                    {fileType && (
                        <div className="relative w-full rounded-md overflow-hidden">
                            {/* remove button wrapper */}
                            <div className="absolute top-3 right-3 z-20">
                                <Button
                                    type="default"
                                    shape="circle"
                                    size="small"
                                    danger
                                    onClick={handleRemoveFile}
                                    className="flex items-center justify-center"
                                >
                                    <Icon icon="material-symbols:close" width="16" />
                                </Button>
                            </div>

                            {fileType === "image" && (
                                <Image
                                    src={selectedFile}
                                    alt="Preview of Post"
                                    className="w-full h-[350px] rounded-md object-fit-cover"
                                    width={'100%'}
                                    height={350}
                                />
                            )}

                            {fileType === "video" && (
                                <video
                                    className="w-full h-[350px] rounded-md object-cover"
                                    controls
                                    src={selectedFile}
                                />
                            )}
                        </div>
                    )}


                    <Flex
                        className='w-full'
                        align='center'
                        justify='space-between'>
                        <Button type='text' style={{ background: 'borderColor' }}
                            onClick={() => imgInputRef.current.click()}>
                            <Flex
                                align='center'
                                gap={"0.5rem"}>
                                <Icon icon={"solar:camera-linear"} width={"1.2rem"} color='var(--primary)' />
                                <Typography className='typoSubtitle2'>Image</Typography>
                            </Flex>
                        </Button>

                        <Button type='text' style={{ background: 'borderColor' }}
                            onClick={() => videoInputRef.current.click()}>
                            <Flex
                                align='center'
                                gap={"0.5rem"}>
                                <Icon icon={"gridicons:video"} width={"1.2rem"} color='var(--primary)' />
                                <Typography className='typoSubtitle2'>Video</Typography>
                            </Flex>
                        </Button>

                        <Button type='primary' style={{ marginLeft: 'auto' }}
                            onClick={submitPost}
                        >
                            <Flex align='center' gap={"0.5rem"}>
                                <Icon icon={"iconamoon:send-fill"} width={"1.2rem"} />
                                <Typography className='typoSubtitle2' style={{ color: "#fff" }}>Post</Typography>
                            </Flex>
                        </Button    >
                    </Flex>
                </Flex>
            </Box>

            {/* Buttons to accept the images */}
            <input
                type="file"
                accept="image/*"
                multiple={false}
                style={{ display: 'none' }}
                ref={imgInputRef}
                onChange={(e) => handleFileChange(e)}
            />

            {/* Buttons to accept the videos */}
            <input
                type="file"
                accept="video/*"
                multiple={false}
                style={{ display: 'none' }}
                ref={videoInputRef}
                onChange={(e) => handleFileChange(e)}
            />
        </>
    )
}
export default PostGenerator;