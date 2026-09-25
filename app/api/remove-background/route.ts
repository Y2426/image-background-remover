import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function jsonError(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.REMOVE_BG_API_KEY;

  if (!apiKey) {
    return jsonError("Background removal is not configured yet.", 500);
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return jsonError("Invalid form data.", 400);
  }

  const image = formData.get("image");

  if (!(image instanceof File)) {
    return jsonError("Please upload an image.", 400);
  }

  if (image.size > MAX_FILE_SIZE) {
    return jsonError("This file is too large. Please upload an image under 5MB.", 413);
  }

  if (!ALLOWED_TYPES.has(image.type)) {
    return jsonError("Unsupported file type. Please upload a JPG, PNG, or WEBP image.", 415);
  }

  const upstreamForm = new FormData();
  upstreamForm.append("image_file", image, image.name || "upload");
  upstreamForm.append("size", "auto");
  upstreamForm.append("format", "png");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
      },
      body: upstreamForm,
      signal: controller.signal,
    });

    if (!response.ok) {
      const detail = await response.text();
      const message =
        response.status === 402
          ? "Background removal quota is exhausted."
          : detail || "We couldn't remove the background. Please try another image.";

      return jsonError(message, response.status);
    }

    return new NextResponse(response.body, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message =
      error instanceof DOMException && error.name === "AbortError"
        ? "Background removal timed out. Please try again."
        : "Network error. Please try again.";

    return jsonError(message, 504);
  } finally {
    clearTimeout(timeout);
  }
}
