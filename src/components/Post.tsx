import { Avatar, Flex, Typography } from 'antd'
import dayjs from 'dayjs'
import React from 'react'
import Box from './Box'
import { getFileTypeFromUrl } from '@/utils'
import Image from 'next/image'

const Post = ({ data }) => {
    const fileType = getFileTypeFromUrl(data?.media);
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
                        <div className="relative w-full h-[350px] rounded-md overflow-hidden">
                            <Image
                                src={data.media}
                                alt="post media"
                                fill
                                style={{ objectFit: "cover" }}
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

                    
                </div>
            </Box>
        </div>
    )
}

export default Post