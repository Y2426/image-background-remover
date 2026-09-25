"use client";

/* eslint-disable @next/next/no-img-element */

import {
  ArrowLeftRight,
  Check,
  Download,
  ImagePlus,
  Loader2,
  RotateCcw,
  Upload,
} from "lucide-react";
import { ChangeEvent, DragEvent, useEffect, useMemo, useRef, useState } from "react";

type BackgroundMode = "transparent" | "white" | "black" | "custom";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const backgroundOptions: Array<{
  label: string;
  value: BackgroundMode;
  swatch: string;
}> = [
  { label: "Transparent", value: "transparent", swatch: "checkerboard" },
  { label: "White", value: "white", swatch: "#ffffff" },
  { label: "Black", value: "black", swatch: "#111111" },
  { label: "Custom", value: "custom", swatch: "custom" },
];

function validateFile(file: File) {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Unsupported file type. Please upload a JPG, PNG, or WEBP image.";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "This file is too large. Please upload an image under 5MB.";
  }

  return "";
}

function formatBytes(size: number) {
  return `${(size / 1024 / 1024).toFixed(2)} MB`;
}

export function BackgroundRemover() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compare, setCompare] = useState(50);
  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>("transparent");
  const [customColor, setCustomColor] = useState("#f4c95d");

  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [originalUrl, resultUrl]);

  const previewBackground = useMemo(() => {
    if (backgroundMode === "white") return "#ffffff";
    if (backgroundMode === "black") return "#111111";
    if (backgroundMode === "custom") return customColor;
    return undefined;
  }, [backgroundMode, customColor]);

  function resetResult() {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl("");
    setCompare(50);
  }

  function selectFile(nextFile: File) {
    const validationError = validateFile(nextFile);
    setError(validationError);

    if (validationError) {
      return;
    }

    if (originalUrl) URL.revokeObjectURL(originalUrl);
    resetResult();
    setFile(nextFile);
    setOriginalUrl(URL.createObjectURL(nextFile));
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0];
    if (nextFile) selectFile(nextFile);
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    const nextFile = event.dataTransfer.files?.[0];
    if (nextFile) selectFile(nextFile);
  }

  async function removeBackground() {
    if (!file || isProcessing) return;

    setError("");
    setIsProcessing(true);
    resetResult();

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/remove-background", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "We couldn't remove the background. Please try another image.");
      }

      const blob = await response.blob();
      setResultUrl(URL.createObjectURL(blob));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "We couldn't remove the background. Please try another image.");
    } finally {
      setIsProcessing(false);
    }
  }

  async function downloadResult() {
    if (!resultUrl) return;

    if (backgroundMode === "transparent") {
      const link = document.createElement("a");
      link.href = resultUrl;
      link.download = "background-removed.png";
      link.click();
      return;
    }

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = resultUrl;

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Could not prepare the download."));
    });

    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext("2d");

    if (!context) {
      setError("Could not prepare the download.");
      return;
    }

    context.fillStyle = previewBackground || "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0);

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `background-removed-${backgroundMode}.png`;
    link.click();
  }

  return (
    <section className="rounded-md border border-[var(--line)] bg-[var(--panel)] p-3 shadow-[var(--shadow)] sm:p-4">
      <div className="grid gap-4">
        <label
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`group flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-6 text-center transition ${
            isDragging
              ? "border-[var(--green)] bg-white"
              : "border-[var(--line)] bg-white/70 hover:border-[var(--green)] hover:bg-white"
          }`}
        >
          <input
            ref={inputRef}
            className="sr-only"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleInputChange}
          />
          <span className="grid size-16 place-items-center rounded-md bg-[var(--ink)] text-white transition group-hover:scale-105">
            <ImagePlus className="size-8" aria-hidden="true" />
          </span>
          <span className="mt-5 text-2xl font-black tracking-normal">
            Drop an image here
          </span>
          <span className="mt-2 max-w-sm text-sm leading-6 text-[var(--muted)]">
            Or click to upload a JPG, PNG, or WEBP image under 5MB.
          </span>
        </label>

        {file ? (
          <div className="flex flex-col gap-3 rounded-md border border-[var(--line)] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-black">{file.name}</p>
              <p className="text-sm text-[var(--muted)]">{formatBytes(file.size)}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-[var(--line)] bg-white px-4 py-3 text-sm font-black transition hover:bg-[var(--paper)]"
              >
                <Upload className="size-4" aria-hidden="true" />
                Change
              </button>
              <button
                type="button"
                onClick={removeBackground}
                disabled={isProcessing}
                className="inline-flex min-w-36 items-center justify-center gap-2 rounded-md bg-[var(--green)] px-4 py-3 text-sm font-black text-white transition hover:bg-[var(--green-dark)] disabled:opacity-70"
              >
                {isProcessing ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <SparkIcon />
                )}
                {isProcessing ? "Processing" : "Remove"}
              </button>
            </div>
          </div>
        ) : null}

        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-2">
          <PreviewPanel title="Original" emptyLabel="Upload an image to preview it">
            {originalUrl ? (
              <img src={originalUrl} alt="Original upload preview" className="max-h-80 w-full object-contain" />
            ) : null}
          </PreviewPanel>

          <PreviewPanel title="Result" emptyLabel="Your transparent PNG will appear here" checkerboard>
            {resultUrl ? (
              <div className="relative grid min-h-80 place-items-center overflow-hidden rounded-md">
                <div
                  className="absolute inset-0"
                  style={previewBackground ? { background: previewBackground } : undefined}
                />
                <img
                  src={resultUrl}
                  alt="Background removed preview"
                  className="relative z-10 max-h-80 w-full object-contain"
                />
              </div>
            ) : isProcessing ? (
              <div className="grid min-h-80 place-items-center text-center">
                <div>
                  <Loader2 className="mx-auto size-10 animate-spin text-[var(--green)]" aria-hidden="true" />
                  <p className="mt-4 text-sm font-black">Removing background...</p>
                </div>
              </div>
            ) : null}
          </PreviewPanel>
        </div>

        {originalUrl && resultUrl ? (
          <div className="rounded-md border border-[var(--line)] bg-white p-4">
            <div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <p className="font-black">Before / after comparison</p>
                <p className="text-sm text-[var(--muted)]">Drag the slider to inspect the edge.</p>
              </div>
              <ArrowLeftRight className="size-5 text-[var(--muted)]" aria-hidden="true" />
            </div>
            <div className="relative overflow-hidden rounded-md border border-[var(--line)] bg-[var(--paper)]">
              <div className="checkerboard grid min-h-80 place-items-center">
                <img src={resultUrl} alt="After background removal" className="max-h-80 w-full object-contain" />
              </div>
              <div className="absolute inset-y-0 left-0 overflow-hidden bg-white" style={{ width: `${compare}%` }}>
                <div className="grid h-full min-h-80 place-items-center" style={{ width: "min(88vw, 560px)" }}>
                  <img src={originalUrl} alt="Before background removal" className="max-h-80 w-full object-contain" />
                </div>
              </div>
              <div className="absolute inset-y-0" style={{ left: `${compare}%` }}>
                <div className="h-full w-1 -translate-x-1/2 bg-[var(--coral)] shadow-lg" />
              </div>
            </div>
            <input
              aria-label="Before after comparison"
              type="range"
              min="0"
              max="100"
              value={compare}
              onChange={(event) => setCompare(Number(event.target.value))}
              className="mt-4 w-full accent-[var(--coral)]"
            />
          </div>
        ) : null}

        {resultUrl ? (
          <div className="rounded-md border border-[var(--line)] bg-white p-4">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-black">Export background</p>
                <p className="text-sm text-[var(--muted)]">
                  Transparent PNG is the default. Solid backgrounds are composed in your browser.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setBackgroundMode("transparent");
                  setCustomColor("#f4c95d");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm font-black transition hover:bg-[var(--paper)]"
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                Reset
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-4">
              {backgroundOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setBackgroundMode(option.value)}
                  className={`flex h-14 items-center justify-between rounded-md border px-3 text-sm font-black transition ${
                    backgroundMode === option.value
                      ? "border-[var(--green)] bg-[#ecfff7]"
                      : "border-[var(--line)] bg-white hover:bg-[var(--paper)]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`size-6 rounded-sm border border-black/10 ${
                        option.swatch === "checkerboard" ? "checkerboard" : ""
                      }`}
                      style={
                        option.swatch !== "checkerboard" && option.swatch !== "custom"
                          ? { background: option.swatch }
                          : option.swatch === "custom"
                            ? { background: customColor }
                            : undefined
                      }
                    />
                    {option.label}
                  </span>
                  {backgroundMode === option.value ? <Check className="size-4" aria-hidden="true" /> : null}
                </button>
              ))}
            </div>

            {backgroundMode === "custom" ? (
              <div className="mt-4 flex items-center gap-3">
                <input
                  aria-label="Custom background color"
                  type="color"
                  value={customColor}
                  onChange={(event) => setCustomColor(event.target.value)}
                  className="h-11 w-16 rounded-md border border-[var(--line)] bg-white p-1"
                />
                <span className="text-sm font-semibold text-[var(--muted)]">{customColor.toUpperCase()}</span>
              </div>
            ) : null}

            <button
              type="button"
              onClick={downloadResult}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--ink)] px-5 py-4 text-base font-black text-white transition hover:bg-black sm:w-auto"
            >
              <Download className="size-5" aria-hidden="true" />
              Download PNG
            </button>
          </div>
        ) : null}

        <div className="rounded-md border border-[var(--line)] bg-white/80 p-4 text-sm leading-6 text-[var(--muted)]">
          <p className="font-black text-[var(--ink)]">Privacy</p>
          <p>Your images are processed in memory. We do not store uploaded or processed images.</p>
          <p>Files are sent securely to our background removal provider for processing.</p>
        </div>
      </div>
    </section>
  );
}

function PreviewPanel({
  title,
  emptyLabel,
  checkerboard = false,
  children,
}: {
  title: string;
  emptyLabel: string;
  checkerboard?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-[var(--line)] bg-white p-3">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-black">{title}</p>
      </div>
      <div
        className={`grid min-h-80 place-items-center overflow-hidden rounded-md border border-[var(--line)] ${
          checkerboard ? "checkerboard" : "bg-[var(--paper)]"
        }`}
      >
        {children || <p className="px-6 text-center text-sm font-semibold text-[var(--muted)]">{emptyLabel}</p>}
      </div>
    </div>
  );
}

function SparkIcon() {
  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2 14.9 8.9 22 12l-7.1 3.1L12 22l-2.9-6.9L2 12l7.1-3.1L12 2Z" />
    </svg>
  );
}
