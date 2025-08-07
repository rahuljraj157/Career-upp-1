import React, { useState, lazy, Suspense, useEffect } from "react";
import { BiComment, BiLike, BiSolidLike } from "react-icons/bi";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import {
  MdOutlineDeleteOutline,
  MdOutlineReportProblem,
  MdDeleteSweep,
} from "react-icons/md";
import { Link } from "react-router-dom";
import { Spinner } from "@material-tailwind/react";
import moment from "moment";
import { useSelector } from "react-redux";
import RootState from "../../../Redux/rootstate/rootState";
import CommentForm from "../comment/CommentForm";
import {
  deleteTheComment,
  deleteThePost,
  likeAndDislikePost,
  saveAndUnsavePost,
} from "../../../api/postsApiService";
import { confirmationBox } from "../../../utils/alerts";
const ReportBox = lazy(() => import("../modal/ReportModal"));
export type PostType = {
  _id: string;
  company: {
    _id: string;
    name: string;
    email: string;
    phone: number;
    role: string;
    password: string;
    isBlocked: boolean;
    verify: boolean;
    profileImage: string;
    savedPosts: string[]; // Array of ObjectIds, use string
    followers: string[]; // Array of ObjectIds, use string
    followingCompanies: string[]; // Array of ObjectIds, use string
    createdOn: string; // ISO date as string
    __v: number;
    headline: string;
    location: string;
    isAdmin: boolean;
  };
  description: string;
  media: string[]; // Array of media URLs or filenames
  likes: string[]; // Array of ObjectIds
  comments: string[]; // Array of ObjectIds
  isDeleted: boolean;
  createdAt: string; // ISO date as string
  reports: string[]; // Array of ObjectIds
  updatedAt: string; // ISO date as string
  __v: number;
};

interface PostCardProps {
  posts: any;
  showAllposts: boolean;
  userData: any;
  setUpdateUI: (data: any) => void;
}

const PostCards: React.FC<PostCardProps> = ({
  posts,
  showAllposts,
  userData,
  setUpdateUI,
}) => {
  const user = useSelector((state: RootState) => state.user.userCred);
  const [showAll, setShowAll] = useState<{ [postId: string]: boolean }>({});
  const [comments, setShowComments] = useState<any>([]);
  const [postdata, setPosts] = useState<PostType[]>(posts);

  const [showReportModal, setReportModal] = useState<boolean>(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  console.log("posts in PostCards:", posts, 12345678);

  const openReportModal = (postId: string) => {
    setReportModal(true);
    setSelectedPostId(postId);
  };

  const closeReportModal = () => {
    setReportModal(false);
  };
  useEffect(() => {
  setPosts(posts);
}, [posts]);


  // const filteredPosts = showAllposts
  //   ? postdata
  //   : postdata.filter(
  //       (post: any) => post?.user?._id || post?.company?._id === user?.userId
  //     );

  // Function to toggle showAll state for a specific post
  const toggleShowAll = (postId: string) => {
    setShowAll((prevShowAll) => ({
      ...prevShowAll,
      [postId]: !prevShowAll[postId],
    }));
  };

  // const likeAndDislike = (postId : string) => {
  //   likeAndDislikePost(postId)
  //   .then((success) => {
  //     if(success){
  //       setUpdateUI((prev : boolean)=> !prev);
  //     }
  //   })
  // }
  const likeAndDislike = (postId: string) => {
    likeAndDislikePost(postId)
      .then((updatedPost) => {
        console.log(updatedPost, "updated post from like and dislike", 888888);
        if (updatedPost) {
          setPosts((prevPosts) =>
            prevPosts.map((postdata) =>
              postdata._id === updatedPost._id ? updatedPost : postdata
            )
          );
        }
      })
      .catch((err) => console.log(err));
  };
  // inside PostCards
  console.log(
    "posts in PostCards:",
    posts,
    "showAllposts:",
    showAllposts,
    4545454545
  );

  useEffect(()=>{
    console.log(postdata, "postdata in PostCards useEffect", 900);
  })

  const saveAndUnsave = (postId: string) => {
    saveAndUnsavePost(postId).then((success) => {
      if (success) {
        setUpdateUI((prev: boolean) => !prev);
      }
    });
  };

  const deletePost = (postId: string) => {
    confirmationBox(
      "Are you sure you want to delete this post?",
      "Delete",
      () => {
        deleteThePost(postId).then((success) => {
          if (success) {
            setUpdateUI((prev: boolean) => !prev);
          }
        });
      }
    );
  };

  const deleteComment = (commentId: string) => {
    confirmationBox(
      "Are you sure you want to delete this comment?",
      "Delete",
      () => {
        deleteTheComment(commentId).then((success) => {
          if (success) {
            setUpdateUI((prev: boolean) => !prev);
          }
        });
      }
    );
  };

  return (
    <>
      {postdata?.length > 0 ? (
        postdata
          ?.slice()
          ?.reverse()
          ?.map((post: any) => {
            const isShowAll = showAll[post?._id];
            return (
              <div
                className="mb-2 mt-2 bg-primary p-4 rounded-xl"
                key={post?._id}
              >
                <div className="flex gap-3 items-center mb-2 ">
                  {user?.userId === post?.user?._id ? (
                    <Link to={`/account`}>
                      <img
                        src={
                          post?.user?.profileImage ||
                          post?.company?.profileImage
                        }
                        alt="profile"
                        className="w-14 h-14 object-cover rounded-full"
                      />
                    </Link>
                  ) : (
                    <Link
                      to={`/account/${post?.user?._id || post?.company?._id}`}
                    >
                      <img
                        src={
                          post?.user?.profileImage ||
                          post?.company?.profileImage
                        }
                        alt="profile"
                        className="w-14 h-14 object-cover rounded-full"
                      />
                    </Link>
                  )}

                  <div className="w-full flex justify-between">
                    <div className="">
                      {user?.userId === post?.user?._id ? (
                        <Link
                          to={`/account/${
                            post?.user?._id || post?.company?._id
                          }`}
                        >
                          <p className="font-medium text-lg text-ascent-1">
                            {post?.user?.name || post?.company?.name}
                          </p>
                        </Link>
                      ) : (
                        <Link
                          to={
                            `/account/${post?.user?._id}` ||
                            `/account/${post?.company?._id}`
                          }
                        >
                          <p className="font-medium text-lg text-ascent-1">
                            {post?.user?.name || post?.company?.name}
                          </p>
                        </Link>
                      )}
                      <span className="text-ascent-2">
                        {post?.user?.headline || post?.company?.headline}
                      </span>
                    </div>
                    <span className="text-ascent-2">
                      {moment(post?.createdAt).fromNow()}
                    </span>
                  </div>
                </div>

                <div className="max-w-full overflow-hidden overflow-ellipsis">
                  <p className="text-ascent-2">
                    {isShowAll
                      ? post?.description
                      : post?.description?.slice(0, 300)}
                    {post?.description?.length > 301 && (
                      <span
                        onClick={() => toggleShowAll(post._id)}
                        className="text-blue ml-2 font-medium cursor-pointer"
                      >
                        {isShowAll ? "Show less" : "Show more"}
                      </span>
                    )}
                  </p>

                  {post?.media && (
                    <img
                      src={post?.media ?? "Not Found"}
                      className="w-full mt-2 rounded-lg"
                    />
                  )}
                </div>

                <div className="mt-4 flex justify-between items-center px-3 py-2 text-ascent-2 text-base border-t border-[#66666645]">
                  <p className="flex gap-2 items-center text-base cursor-pointer">
                    {post?.likes?.includes(user?.userId) ? (
                      <span onClick={() => likeAndDislike(post?._id)}>
                        <BiSolidLike size={20} className="text-blue" />
                      </span>
                    ) : (
                      <span onClick={() => likeAndDislike(post?._id)}>
                        <BiLike size={20} className="text-blue" />
                      </span>
                    )}
                    {post?.likes?.length}
                  </p>

                  <p
                    onClick={() => {
                      setShowComments(comments === post._id ? null : post?._id);
                      // getComments(post?._id)
                    }}
                    className="flex gap-2 items-center text-base cursor-pointer"
                  >
                    <BiComment size={20} />
                    {post?.comments?.length}
                  </p>

                  {user?.userId === post?.user?._id && (
                    <div
                      onClick={() => deletePost(post?._id)}
                      className="flex gap-1 items-center text-base text-ascent-1 cursor-pointer"
                    >
                      <MdOutlineDeleteOutline size={20} />
                    </div>
                  )}

                  <p className="flex gap-2 items-center text-base cursor-pointer">
                    {userData?.savedPosts?.some(
                      (saved: any) =>
                        saved?.postId?._id &&
                        post?._id &&
                        saved.postId._id.toString() === post._id.toString()
                    ) ? (
                      <span onClick={() => saveAndUnsave(post?._id)}>
                        <FaBookmark size={20} />
                      </span>
                    ) : (
                      <span onClick={() => saveAndUnsave(post?._id)}>
                        <FaRegBookmark size={20} />
                      </span>
                    )}
                  </p>

                  <p
                    onClick={() => openReportModal(post?._id)}
                    className="flex gap-2 items-center text-base cursor-pointer hover:text-[#e5d463]"
                  >
                    <MdOutlineReportProblem size={20} />
                  </p>
                </div>

                {comments === post?._id && (
                  <div className="w-full mt-4 border-t  border-[#66666645] pt-4">
                    <CommentForm
                      setUpdateUI={setUpdateUI}
                      userData={userData}
                      id={post?._id}
                    />

                    {post?.comments?.length > 0 ? (
                      post?.comments?.map((comment: any) => {
                        return (
                          <div
                            className="w-full py-2 px-2 border border-gray-400 bg-gray-100 rounded mb-2 mt-2"
                            key={comment._id}
                          >
                            <div className="flex gap-3 items-center mb-1">
                              <Link to="">
                                <img
                                  src={
                                    comment?.userId?.profileImage ||
                                    comment?.companyId?.profileImage
                                  }
                                  alt=""
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              </Link>
                              <div>
                                <Link to="">
                                  <p className="font-medium text-base text-ascent-1">
                                    {comment?.userId?.name ||
                                      comment?.companyId?.profileImage}
                                  </p>
                                </Link>
                                <span className="text-ascent-2 text-sm">
                                  {moment(comment?.createdAt).fromNow()}
                                </span>
                              </div>
                            </div>

                            <div className="ml-12">
                              <p className="text-ascent-2">{comment?.text}</p>

                              {post?.user?._id === user?.userId && (
                                <div className="mt-2 flex gap-6">
                                  <span
                                    title="Delete this Comment"
                                    onClick={() => deleteComment(comment?._id)}
                                    className="text-blue hover:bg-[#3b509c2b] px-2 cursor-pointer"
                                  >
                                    <MdDeleteSweep size={22} />
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <span className="flex text-sm py-4 text-ascent-2 text-center">
                        No Comments yet, be the first to Comment
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })
      ) : (
        <div className="flex w-full items-center justify-center">
          <p className="text-lg text-ascent-2">No posts Available</p>
        </div>
      )}

      <Suspense fallback={<Spinner />}>
        <ReportBox
          visible={showReportModal}
          closeReportModal={closeReportModal}
          postId={selectedPostId}
        />
      </Suspense>
    </>
  );
};

export default PostCards;
