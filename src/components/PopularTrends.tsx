import { getPopularTrends } from '@/actions/post';
import { QueryClient } from '@tanstack/react-query'
import { Alert, Avatar, Flex, Typography } from 'antd'
import React from 'react'
import Iconify from './Iconify';

const PopularTrends = async () => {
  const queryClient = new QueryClient();
  try {
    const { data } = await queryClient.fetchQuery({
      queryKey: ['trends'],
      queryFn: getPopularTrends,
      staleTime: 1000 * 60 * 60 * 24,
    })
    console.log(data);
    return (
      <div className='relative rounded-2xl bg-[var(--primary-low)] !px-4 !py-6'>
        <div className="absolute top-0 right-0 w-40 h-60 bg-[url('/images/hashtag.png')] bg-no-repeat opacity-50 z-0" />

        {/* head */}

        <div className='flex flex-col gap-8 w-full h-full z-[1] relative'>
          <Flex vertical>
            <Typography className='typeSubTitle2'>TOP TRENDING</Typography>
            <Typography className='typoH4'># Popular Trends</Typography>
          </Flex>

          <Flex vertical gap={15}>
            {data.map((trend, i) => (
              <Flex key={i} gap={'1rem'} align='center'>
                {/* trend icon */}
                <Avatar
                  style={{ background: "#FF990047" }}
                  icon={
                    <Iconify
                      icon="mingcute:hashtag-fill"
                      color="var(--primary)"
                      width="18px"
                    />
                  }
                />
                {/* trend info */}
                <Flex vertical>
                  <Typography
                    className="typoSubtitle1"
                    style={{ fontWeight: "bold" }}
                  >
                    {trend.name}
                  </Typography>
                  <Typography
                    className="typoCaption"
                    style={{ fontWeight: "bold", color: "gray" }}
                  >
                    {trend?._count?.name} Posts
                  </Typography>
                </Flex>
              </Flex>
            ))}
          </Flex>
        </div>
      </div>
    );
  } catch (err) {
    return (
      <Alert
        message="Error"
        description="Unable to fetch popular trends"
        type="error"
        showIcon
      />
    );
  }
};

export default PopularTrends;