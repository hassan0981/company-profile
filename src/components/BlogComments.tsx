"use client";

import { useEffect, useState, FormEvent } from "react";

interface CommentItem {
  id: string | number;
  name: string;
  comment: string;
  created_at: string;
}

interface BlogCommentsProps {
  postSlug: string;
  postTitle?: string;
}

export default function BlogComments({ postSlug }: BlogCommentsProps) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    let isSubscribed = true;
    async function loadComments() {
      try {
        setLoading(true);
        const res = await fetch(`/api/comments?post_slug=${encodeURIComponent(postSlug)}`);
        const json = await res.json();
        if (isSubscribed && json.comments) {
          setComments(json.comments);
        }
      } catch (err) {
        console.error("Failed to load comments:", err);
      } finally {
        if (isSubscribed) setLoading(false);
      }
    }
    if (postSlug) {
      loadComments();
    }
    return () => {
      isSubscribed = false;
    };
  }, [postSlug]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!name.trim() || !email.trim() || !commentText.trim()) {
      setStatusMessage({ type: "error", text: "Please fill in all fields (Name, Email, and Comment)." });
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_slug: postSlug,
          name: name.trim(),
          email: email.trim(),
          comment: commentText.trim(),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to submit comment.");
      }

      setStatusMessage({
        type: "success",
        text: "Thank you! Your comment has been posted successfully.",
      });

      if (json.comment) {
        setComments((prev) => [json.comment, ...prev]);
      } else {
        setComments((prev) => [
          {
            id: Date.now(),
            name: name.trim(),
            comment: commentText.trim(),
            created_at: new Date().toISOString(),
          },
          ...prev,
        ]);
      }

      setName("");
      setEmail("");
      setCommentText("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setStatusMessage({ type: "error", text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recently";
    }
  };

  return (
    <section className="mt-16 pt-12 border-t border-neutral-100">
      <div className="max-w-[850px]">
        {/* Section Heading */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-100">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#206cbb] mb-1 block">
              COMMUNITY THOUGHTS
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
              Comments ({comments.length})
            </h3>
          </div>
        </div>

        {/* Comment Form */}
        <div className="bg-neutral-50 border border-neutral-200/70 rounded-2xl p-6 sm:p-8 mb-12 shadow-sm">
          <h4 className="text-lg font-bold text-black mb-2">Leave a Reply</h4>
          <p className="text-xs text-neutral-500 mb-6 font-light">
            Your email address will not be published. Required fields are marked *
          </p>

          {statusMessage && (
            <div
              className={`p-4 rounded-xl text-sm font-medium mb-6 flex items-center gap-3 ${
                statusMessage.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-rose-50 text-rose-800 border border-rose-200"
              }`}
            >
              <span>{statusMessage.type === "success" ? "✓" : "⚠️"}</span>
              <span>{statusMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#206cbb]/30 focus:border-[#206cbb] transition-all text-black placeholder:text-neutral-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#206cbb]/30 focus:border-[#206cbb] transition-all text-black placeholder:text-neutral-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                Comment *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Share your thoughts, feedback, or questions about this article..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#206cbb]/30 focus:border-[#206cbb] transition-all text-black placeholder:text-neutral-400 leading-relaxed resize-y"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3.5 bg-gradient-to-r from-[#206cbb] to-[#3c9e90] text-white font-extrabold text-sm rounded-xl hover:shadow-lg hover:shadow-[#206cbb]/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer inline-flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Posting Comment...
                  </>
                ) : (
                  "Post Comment"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-8 text-neutral-400 text-sm font-medium animate-pulse">
              Loading comments...
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-10 px-6 bg-neutral-50/50 rounded-2xl border border-dashed border-neutral-200">
              <span className="text-3xl mb-2 block">💬</span>
              <h5 className="text-base font-bold text-neutral-700 mb-1">No comments yet</h5>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto font-light">
                Be the first to share your thoughts or start a discussion on this article!
              </p>
            </div>
          ) : (
            comments.map((item) => {
              const initial = item.name ? item.name.charAt(0).toUpperCase() : "U";
              return (
                <div
                  key={item.id}
                  className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex gap-4"
                >
                  <div className="flex-shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-[#206cbb] to-[#3c9e90] text-white font-extrabold flex items-center justify-center text-base shadow-sm select-none">
                    {initial}
                  </div>

                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-sm font-extrabold text-black">{item.name}</h5>
                      <span className="text-[11px] text-neutral-400 font-medium">
                        {formatDate(item.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-700 leading-relaxed font-normal whitespace-pre-line">
                      {item.comment}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
