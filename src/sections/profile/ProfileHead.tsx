"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button, Flex, Image, Skeleton, Spin, Tabs, Typography } from "antd";
import { Icon } from "@iconify/react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { updateBanner } from "@/actions/user";
import toast from "react-hot-toast";
import Box from "@/components/Box";

const { Text } = Typography;

const TABS = [
  { label: "Profile", icon: "solar:user-id-bold" },
  { label: "Followers", icon: "ph:heart-fill" },
  { label: "Followings", icon: "fluent:people-20-filled" },
];

const ProfileHead = ({
  userId,
  data,
  isLoading,
  isError,
  selectedTab,
  setSelectedTab,
}) => {
  const [bannerPreview, setBannerPreview] = useState(false);
  const { user } = useUser();
  const inputRef = useRef(null);
  const [banner, setBanner] = useState(null);

  const { mutate, isPending } = useMutation({
    mutationFn: updateBanner,
    onSuccess: () => toast.success("Banner updated successfully!"),
    onError: () => toast.error("Something went wrong. Try again!"),
  });

  useEffect(() => {
    if (data?.data?.banner_url) setBanner(data.data.banner_url);
  }, [data]);

  const handleBannerChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("Image size is greater than 5 MB");
      return;
    }
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setBanner(reader.result);
        mutate({
          id: user?.id,
          banner: reader.result,
          prevBannerId: data?.data?.banner_id,
        });
      };
    }
  };

  if (isError) return <div>Error loading profile</div>;

  return (
    <div className="rounded-2xl overflow-hidden bg-white">
      {/* Banner */}
      <Spin spinning={isPending}>
        <div
          className="relative cursor-pointer group"
          onClick={() => setBannerPreview(true)}
        >
          {/* gradient overlay */}
          <div className="absolute bg-gradient-to-b from-black/10 to-black/40 z-10 pointer-events-none rounded-t-2xl" />

          <Image
            src={banner || "/images/banner.png"}
            alt="banner"
            preview={{
              mask: null,
              visible: bannerPreview,
              onVisibleChange: (visible) => setBannerPreview(visible),
            }}
            width={'100%'}
            className="w-full !h-50 !sm:h-50 !md:h-50 object-cover rounded-t-2xl"
          />

          {/* edit button */}
          {userId === user?.id && (
            <div
              className="absolute bottom-4 right-4 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                accept="image/*"
                ref={inputRef}
                type="file"
                hidden
                onChange={handleBannerChange}
              />
              <Button
                onClick={() => inputRef.current?.click()}
                type="primary"
                shape="circle"
                className="shadow-md"
                icon={<Icon icon="fluent:image-edit-20-filled" width="30px" />}
              />
            </div>
          )}
        </div>
      </Spin>

      {/* Profile section */}
      <Box>
        <div className="relative flex flex-col sm:flex-row justify-between sm:items-end gap-6 !px-6 !pb-1">
          {/* left: profile image + info */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 !-mt-14 !sm:-mt-20">
            <div className="!w-30 !h-30 !sm:w-28 !sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-lg !mx-auto !sm:mx-0">
              <Image
                src={data?.data?.image_url || "/images/placeholder-avatar.png"}
                alt="profile"
                preview={{ mask: null }}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-col items-center sm:items-start gap-1">
              {!isLoading ? (
                <>
                  <Text className="text-lg font-semibold">
                    {data?.data?.first_name} {data?.data?.last_name}
                  </Text>
                  <Text className="text-gray-500">@{data?.data?.username}</Text>
                </>
              ) : (
                <Skeleton
                  style={{ width: "9rem" }}
                  paragraph={{ rows: 2 }}
                  active
                />
              )}
            </div>
          </div>

          {/* right: tabs */}
          <div className="w-full sm:w-auto !-bottom-1">
            <Tabs
              centered
              defaultActiveKey={selectedTab}
              onChange={(key) => setSelectedTab(key)}
              items={TABS.map((tab, i) => ({
                key: String(i + 1),
                label: (
                  <Flex align="center" gap={8}>
                    <Icon icon={tab.icon} width="20px" />
                    <span className="font-medium">{tab.label}</span>
                  </Flex>
                ),
              }))}
            />
          </div>
        </div>
      </Box>
    </div>
  );
};

export default ProfileHead;
