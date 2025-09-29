import React from "react";
import css from "@/styles/ProfileView.module.css";
import { useUser } from "@clerk/nextjs";
import Posts from "@/components/Posts";
import PostGenerator from "@/components/PostGenerator";
import FollowButton from "./FollowButton";
import FollowInfoBox from "./FollowInfoBox";
const ProfileBody = ({ userId }) => {
  const { user: currentUser } = useUser();
  const isCurrentUser = currentUser?.id === userId;

  return (
    <div className="flex gap-4 justify-end w-full max-[824px]:flex-col">
      <div className="w-[40%] max-[824px]:w-full">
        <div className="w-full flex flex-col gap-4 sticky top-0 z-[1]">
          {!isCurrentUser && <FollowButton id={userId} />}

          {/* start from here */}
          <FollowInfoBox id={userId} />
          <FriendsSuggestion />
        </div>
      </div>
      <div className="w-[60%] flex flex-col gap-4 overflow-scroll max-[824px]:w-full">
        {isCurrentUser && <PostGenerator />}
        <Posts id={userId} />
      </div>
    </div>
  );
};

export default ProfileBody;