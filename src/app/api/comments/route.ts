import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const post_slug = searchParams.get("post_slug");

    if (!post_slug) {
      return NextResponse.json({ error: "Missing post_slug parameter" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("blog_comments")
      .select("id, name, comment, created_at")
      .eq("post_slug", post_slug)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase fetch error:", error.message);
      return NextResponse.json({ comments: [], warning: error.message });
    }

    return NextResponse.json({ comments: data || [] });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal Server Error";
    console.error("Comments GET handler error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { post_slug, name, email, comment } = body;

    if (!post_slug || !name || !email || !comment) {
      return NextResponse.json(
        { error: "Please fill in all required fields (Name, Email, and Comment)." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("blog_comments")
      .insert([
        {
          post_slug: post_slug.trim(),
          name: name.trim(),
          email: email.trim().toLowerCase(),
          comment: comment.trim(),
        },
      ])
      .select("id, name, comment, created_at")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, comment: data });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal Server Error";
    console.error("Comments POST handler error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
