import { Icon } from '@iconify/react';
import { Button, Flex } from 'antd';
import React, { useState } from 'react'
import CommentInput from './CommentInput';
import Comment from './Comment';

const CommentSection = ({ comments, postId, queryId }) => {
    const [expended, setExpended] = useState(false);

    return (
        <Flex vertical gap={'1rem'}>
            <>
                {/* show more button */}
                {
                    comments?.length > 1 && (
                        <Button type='text' onClick={() => setExpended((prev) => !prev)}>
                            <Flex align='center' gap={'.5rem'} justify='center'>
                                <Icon icon="ic:outline-expand-more" />
                                Show more comments
                            </Flex>
                        </Button>
                    )
                }

                {/* Comments */}
                {
                    comments?.length > 0 && (
                        <Flex
                            vertical gap={'.5rem'}
                            className='commentsContainer'
                        >
                            {
                                !expended ? (
                                    <Comment
                                        data={comments[comments.length - 1]}
                                    />
                                ) : (
                                    comments.map((comment, index) => (
                                        <Comment
                                            key={index}
                                            data={comment}
                                        />
                                    ))
                                )
                            }
                        </Flex>
                    )
                }
            </>

            {/* Comment input */}
            <CommentInput setExpended={setExpended} queryId={queryId} postId={postId} />

        </Flex>
    )
}

export default CommentSection