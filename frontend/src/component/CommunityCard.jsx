import React, { useState } from "react";
import { FaHeart, FaComment, FaReply, FaTimes } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App";
import { useSelector } from "react-redux";

export default function CommunityCard({ post }) {
  const { userData } = useSelector((state) => state.user);

  const [liked, setLiked] = useState(
    post.likes?.some((u) => u === userData._id || u._id === userData._id)
  );
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentList, setCommentList] = useState(post.comments || []);

  // ✅ Toggle Like
  const handleLike = async () => {
    try {
      const res = await axios.put(
        `${serverUrl}/api/content/post/toggle-like`,
        { postId: post._id },
        { withCredentials: true }
      );
      setLikeCount(res.data.likes.length);
      setLiked(res.data.likes.includes(userData._id));
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ Add Comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(
        `${serverUrl}/api/content/post/comment`,
        { postId: post._id, message: newComment },
        { withCredentials: true }
      );
      setCommentList(res.data.comments);
      setNewComment("");
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ Add Reply
  const handleAddReply = async (commentId, replyText) => {
    if (!replyText.trim()) return;
    try {
      const res = await axios.post(
        `${serverUrl}/api/content/post/reply`,
        { postId: post._id, commentId, message: replyText },
        { withCredentials: true }
      );
      setCommentList(res.data.comments);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-100 bg-slate-900/40 backdrop-blur-sm rounded-2xl p-5 shadow-lg border-2 border-slate-800/50 mb-[50px] relative hover:border-[#795d3f] transition-all">
      {/* Post Content */}
      <p className="text-base text-white">{post.content}</p>

      {/* Post Image */}
      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="w-90 h-80 object-cover rounded-xl mt-4 shadow-md border-2 border-slate-700/50"
        />
      )}

      {/* Footer */}
      <div className="flex justify-between items-center mt-4 text-slate-400 text-sm">
        <span className="italic text-slate-500">
          {new Date(post.createdAt).toDateString()}
        </span>
        <div className="flex gap-6">
          {/* Like Button */}
          <span
            className={`flex items-center gap-2 cursor-pointer transition ${
              liked ? "text-[#795d3f]" : "hover:text-[#795d3f]"
            }`}
            onClick={handleLike}
          >
            <FaHeart /> {likeCount}
          </span>

          {/* Comment Button */}
          <span
            className="flex items-center gap-2 hover:text-[#795d3f] cursor-pointer transition"
            onClick={() => setShowComments(!showComments)}
          >
            <FaComment /> {commentList.length}
          </span>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="absolute bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-md p-4 rounded-t-2xl border-t-2 border-slate-800/50 max-h-[50%] overflow-y-auto scrollbar-thin scrollbar-thumb-[#795d3f]/50 scrollbar-track-slate-900/50">
          <div className="flex items-center w-full justify-between py-[10px]">
            <h3 className="text-white font-semibold mb-2">Comments</h3>
            <button
              onClick={() => setShowComments(false)}
              className="text-slate-400 hover:text-[#795d3f] transition"
            >
              <FaTimes size={18} />
            </button>
          </div>

          {/* Show Comments */}
          <div className="space-y-4">
            {commentList.length > 0 ? (
              [...commentList].reverse().map((c) => (
                <div key={c._id} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                  {/* Author Info */}
                  <div className="flex items-center gap-2 mb-1">
                    <img
                      src={c.author?.photoUrl || "/default-avatar.png"}
                      alt="avatar"
                      className="w-6 h-6 rounded-full border-2 border-[#795d3f]/30"
                    />
                    <span className="text-sm font-semibold text-white">
                      {c.author?.username || "Unknown User"}
                    </span>
                  </div>

                  {/* Comment Text */}
                  <p className="text-slate-200 ml-8">{c.message}</p>

                  {/* Replies */}
                  {c.replies?.length > 0 && (
                    <div className="mt-2 ml-12 space-y-2">
                      {[...c.replies].reverse().map((r) => (
                        <div key={r._id} className="flex items-start gap-2">
                          <img
                            src={r.author?.photoUrl || "/default-avatar.png"}
                            alt="avatar"
                            className="w-5 h-5 rounded-full border border-[#795d3f]/30"
                          />
                          <div>
                            <span className="text-xs font-semibold text-slate-300">
                              {r.author?.username || "Unknown User"}
                            </span>
                            <p className="text-xs text-slate-200 bg-slate-700/50 p-2 rounded mt-1">
                              {r.message}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Input */}
                  <ReplyBox
                    onReply={(replyText) => handleAddReply(c._id, replyText)}
                  />
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-sm">No comments yet</p>
            )}
          </div>

          {/* New Comment */}
          <div className="flex gap-2 mt-3 items-center">
            <img
              src={userData?.photoUrl || "/default-avatar.png"}
              alt="avatar"
              className="w-8 h-8 rounded-full border-2 border-[#795d3f]/30"
            />
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#795d3f]/50 focus:border-[#795d3f]"
            />
            <button
              onClick={handleAddComment}
              className="px-4 py-2 bg-gradient-to-r from-[#795d3f] to-[#9b7653] rounded-lg text-white text-sm hover:from-[#8a6d4a] hover:to-[#a98561] transition-all"
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ✅ Reply Box
function ReplyBox({ onReply }) {
  const [replyText, setReplyText] = useState("");
  const [showReply, setShowReply] = useState(false);

  const handleReply = () => {
    if (!replyText.trim()) return;
    onReply(replyText);
    setReplyText("");
    setShowReply(false);
  };

  return (
    <div className="mt-2 ml-8">
      {!showReply ? (
        <button
          onClick={() => setShowReply(true)}
          className="text-[#795d3f] text-sm flex items-center gap-1 hover:text-[#8a6d4a] transition-colors"
        >
          <FaReply /> Reply
        </button>
      ) : (
        <div className="flex gap-2 mt-2 items-center">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="flex-1 px-3 py-1 rounded-lg bg-slate-700/50 border border-slate-600/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#795d3f]/50 focus:border-[#795d3f]"
          />
          <button
            onClick={handleReply}
            className="px-3 py-1 bg-gradient-to-r from-[#795d3f] to-[#9b7653] rounded-lg text-white text-sm hover:from-[#8a6d4a] hover:to-[#a98561] transition-all"
          >
            Post
          </button>
        </div>
      )}
    </div>
  );
}