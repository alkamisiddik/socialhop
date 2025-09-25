import { updatePostLike } from '@/actions/post';
import { updateQueryCacheLikes } from '@/utils';
import { HappyProvider } from '@ant-design/happy-work-theme';
import { useUser } from '@clerk/nextjs'
import { Icon } from '@iconify/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Flex, Typography } from 'antd';
import React, { useEffect, useState } from 'react'

const LikeButton = ({ postId, likes, queryId }) => {
    const { user } = useUser();
    const [isLikes, setIsLikes] = useState(false);
    const queryCLient = useQueryClient()

    useEffect(() => {
        setIsLikes(likes?.some((like) => like?.authorId == user?.id));
    }, [user, likes])

    const actionType = isLikes ? 'unlike' : 'like'
    const { mutate } = useMutation({
        mutationFn: (props) => updatePostLike(props),
        onMutate: async () => {
            // cancel any ongoing refetch
            await queryCLient.cancelQueries(['posts', queryId])
            // snapshot the previous value
            const previousPosts = queryCLient.getQueriesData(['posts', queryId])

            queryCLient.setQueriesData(['posts', queryId], (old) => {
                return {
                    ...old,
                    pages: old.pages.map((page) => {
                        return {
                            ...page,
                            data: page.data.map((post) => {
                                if (post.id === postId) {
                                    return {
                                        ...post,
                                        likes: updateQueryCacheLikes(
                                            post.likes,
                                            postId,
                                            user?.id,
                                            actionType
                                        )
                                    }
                                } else {
                                    return post
                                }
                            })
                        }
                    })

                }
            });

            return { previousPosts };
        },
        onError: (err, variable, context) => {
            queryCLient.setQueriesData(['posts', queryId], context?.previousPosts)
        },
        onSettled: () => {
            queryCLient.invalidateQueries(['posts']);
        }
    })


    return (
        <HappyProvider>
            <Button
                size='small'
                style={{ background: "transparent", border: 'none', boxShadow: 'none' }}
                onClick={() => mutate({ postId, actionType })}
            >
                <Flex gap={".5rem"} align='center'>
                    <Icon icon="ph:heart-fill" width={'22px'}
                        style={{ color: isLikes ? "var(--primary)" : "gray" }}
                    />

                    <Typography.Text>
                        {likes?.length === 0 ? 'Like' : `${likes?.length} Likes`}
                    </Typography.Text>
                </Flex>
            </Button>

            
        </HappyProvider>
    )
}

export default LikeButton