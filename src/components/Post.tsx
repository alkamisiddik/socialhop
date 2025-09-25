import { Avatar, Flex, Typography } from 'antd'
import dayjs from 'dayjs'
import React from 'react'
import Box from './Box'
import { getFileTypeFromUrl } from '@/utils'
import Image from 'next/image'
import LikeButton from './LikeButton'
import CommentButton from './CommentButton'
import CommentSection from './CommentSection'

const Post = ({ data, queryId }) => {
    const fileType = getFileTypeFromUrl(data?.media);
    const postId = data?.id;
    const likes = data?.likes;

    return (
        <div className='rounded-xl overflow-hidden'>
            <Box>
                <div className='!p-[1rem] flex flex-col gap-2'>
                    {/* profile info */}
                    <Flex align='center' justify='space-between'>
                        {/* profile info */}
                        <Flex gap={'.5rem'} align='center'>
                            <Avatar
                                size={40}
                                src={data?.author?.image_url}
                            />

                            {/* name and post date */}
                            <Flex vertical>
                                <Typography>
                                    {data?.author?.first_name} {data?.author?.last_name}
                                </Typography>
                                <Typography.Text
                                    className='typeCaption'
                                    type='secondary'
                                    strong
                                >
                                    {dayjs(data?.created_at).format("DD MMM YYYY")}
                                </Typography.Text>
                            </Flex>
                        </Flex>
                    </Flex>

                    {/* Caption */}
                    <Typography.Text>
                        <div dangerouslySetInnerHTML={{
                            __html: (data?.postText)?.replace(/\n/g, "<br/>"),
                        }}
                        ></div>
                    </Typography.Text>


                    {/* Post Media */}
                    {fileType === "image" && data?.media && (
                        <div className="relative w-full h-[450px] rounded-md overflow-hidden">
                            <Image
                                src={data.media}
                                alt="post media"
                                fill
                            />
                        </div>
                    )}

                    {fileType === "video" && data?.media && (
                        <video
                            className="w-full h-[350px] rounded-md object-cover"
                            controls
                            src={data.media}
                        />
                    )}

                    {fileType === "unknown" && data?.media && (
                        <Typography.Text type="secondary">Unsupported file type</Typography.Text>
                    )}

                    {/* Actions */}
                    <Flex>
                        <LikeButton
                            postId={postId}
                            likes={likes}
                            queryId={queryId}
                        />

                        <CommentButton comments={data?.comments?.length} />
                    </Flex>

                    {/* Comment Sections */}

                    <CommentSection
                        comments={data?.comments}
                        postId={data?.id}
                        queryId={queryId}
                    />
                </div>
            </Box>
        </div>
    )
}

export default Post