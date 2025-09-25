import { SettingsContext } from '@/context/settings/settings-context'
import React, { useContext } from 'react'
import Box from './Box'
import { Avatar, Flex, Typography } from 'antd'
import dayjs from 'dayjs'

const Comment = ({ data }) => {
    const { settings: { theme } } = useContext(SettingsContext)
    console.log(data)
    return (
        <Box>
            <Flex gap={".5rem"} align='center'>
                {/* person image */}
                <Avatar size={30} src={data?.author?.image_url}/>

                {/* person comment */}
                <Flex
                    vertical
                    flex={1}
                    gap={".5rem"}
                    className={`rounded-lg !p-2 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-[#F4F6F8] text-black"
                        }`}
                >
                    {/* name and date */}
                    <Flex align="center" justify="space-between">
                        {/* name */}
                        <Typography.Text className="typoSubtitle2">
                            {data?.author?.first_name} {data?.author?.last_name}
                        </Typography.Text>

                        {/* date */}
                        <Typography.Text className="typoCaption" type="secondary" strong>
                            {dayjs(data?.created_at).format("DD MMM YYYY")}
                        </Typography.Text>
                    </Flex>

                    {/* comment text */}
                    <Typography.Text className="typoBody2">
                        {data?.comment}
                    </Typography.Text>
                </Flex>
            </Flex>
        </Box>
    )
}

export default Comment