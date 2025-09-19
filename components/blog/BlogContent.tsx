"use client";

import React,{ useState } from "react";
import Image from "next/image";
import {
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdSlot } from "@/components/ads/AdSlot";
import type { BlogContentBlock } from "@/types/blog";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface BlogContentProps {
  blocks: BlogContentBlock[];
}

export function BlogContent({ blocks }: BlogContentProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [expandedFAQs, setExpandedFAQs] = useState<Set<number>>(new Set());
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const copyToClipboard = async (code: string, blockId: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(blockId);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {}
  };

  const toggleFAQ = (index: number) => {
    const newExpanded = new Set(expandedFAQs);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedFAQs(newExpanded);
  };

  // Helper function to safely render text content
  const renderTextContent = (content: any): string => {
    if (typeof content === "string") {
      return content;
    }
    if (typeof content === "object" && content !== null) {
      return JSON.stringify(content);
    }
    return String(content);
  };

  // Helper function to recursively render nested blocks
  const renderNestedBlocks = (items: any[]): JSX.Element[] => {
    return items.map((item, itemIndex) => {
      if (typeof item === "string") {
        return <span key={itemIndex}>{item}</span>;
      }

      if (typeof item === "object" && item.type) {
        return <div key={itemIndex}>{renderBlock(item, itemIndex)}</div>;
      }

      return <span key={itemIndex}>{renderTextContent(item)}</span>;
    });
  };
  console.log("blocks", blocks);

  const renderBlock = (block: BlogContentBlock, index: number) => {
    if (!block || typeof block !== "object") {
      return null;
    }

    // Insert ads after 2nd and 6th paragraphs
    const shouldShowAd =
      block.type === "paragraph" && (index === 2 || index === 6);

    switch (block.type) {
      case "heading": {
        const HeadingTag = `h${block.data.level}` as keyof JSX.IntrinsicElements;
        return (
          <React.Fragment key={block.id || index}>
            <HeadingTag
              className={`font-bold mb-4 ${
                block.data.level === 1
                  ? "text-3xl"
                  : block.data.level === 2
                  ? "text-2xl"
                  : block.data.level === 3
                  ? "text-xl"
                  : block.data.level === 4
                  ? "text-lg"
                  : "text-base"
              }`}
              dangerouslySetInnerHTML={{ __html: block.data.text }} // ✅ keeps <a> tags
            />
            {shouldShowAd && (
              <AdSlot slot="content-ad" format="horizontal" className="my-8" />
            )}
          </React.Fragment>
        );
      }
      
      case "paragraph":
        return (
          <React.Fragment key={block.id || index}>
            <p
              className="mb-6 leading-relaxed text-foreground/90"
              dangerouslySetInnerHTML={{ __html: block.data.text }} // ✅ keeps <a> tags
            />
            {shouldShowAd && (
              <AdSlot slot="content-ad" format="horizontal" className="my-8" />
            )}
          </React.Fragment>
        );
      
     
        case "list":
        let ListTag: any = "ul";
        let listClass = "";

        if (block.data.type === "ordered") {
          ListTag = "ol";
          listClass = "list-none list-inside space-y-4 mb-4 ml-4";
        } else if (block.data.type === "unordered") {
          ListTag = "ul";
          listClass = "list-disc list-inside space-y-4 mb-4 ml-4";
        } else if (block.data.type === "numbered") {
          ListTag = "ol";
          listClass = "list-none numbered space-y-4 mb-4 ml-4";
        }

        return (
          <ListTag 
            key={block.id || index}
            style={{ marginLeft: "1.5rem" }} // Adjust left margin for better alignment
          className={listClass}>
            {block.data.items?.map(
              (
                item: { title: string; paragraphs: { text: string }[] },
                index: number
              ) => (
                <li key={index} className="text-base leading-relaxed">
                  {/* Title */}
                  {item.title && (
                    <div className="flex items-center gap-2">
                      <span className="mb-1 font-semibold">{index + 1}.</span>

                      <p className="mb-1 font-semibolds">{item.title}</p>
                    </div>
                  )}

                  {/* Paragraphs */}
                  {item.paragraphs?.map((para, pIndex) => (
                    <p
                      key={pIndex}
                      className="mb-2"
                      dangerouslySetInnerHTML={{ __html: para.text }}
                    />
                  ))}
                </li>
              )
            )}
          </ListTag>
        );

      case "code":
        const blockId = `code-${block.id || index}`;
        return (
          <div key={block.id || index} className="mb-6">
            <div className="relative">
              <SyntaxHighlighter
                language={block.data.language || "javascript"}
                style={oneDark}
                customStyle={{
                  margin: 0,
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                }}
              >
                {renderTextContent(block.data.code)}
              </SyntaxHighlighter>
              <Button
                variant="ghost"
                size="sm"
                className="absolute w-8 h-8 p-0 top-2 right-2"
                onClick={() =>
                  copyToClipboard(renderTextContent(block.data.code), blockId)
                }
              >
                {copiedCode === blockId ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            {shouldShowAd && (
              <AdSlot slot="content-ad" format="horizontal" className="my-8" />
            )}
          </div>
        );

      case "image":
        return (
          <div key={block.id || index} className="mb-6">
            <div
              className="relative cursor-pointer group"
              onClick={() => setLightboxImage(block.data.url)}
            >
              <Image
                src={block.data.url || "/placeholder.svg"}
                alt={block.data.alt || ""}
                width={800}
                height={400}
                className="w-full h-auto transition-opacity rounded-lg group-hover:opacity-90"
              />
              {block.data.caption && (
                <p className="mt-2 text-sm italic text-center text-muted-foreground">
                  {renderTextContent(block.data.caption)}
                </p>
              )}
            </div>
            {shouldShowAd && (
              <AdSlot slot="content-ad" format="horizontal" className="my-8" />
            )}
          </div>
        );

      case "gallery":
        return (
          <div key={block.id || index} className="mb-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {block.data.images.map((image: any, imgIndex: number) => (
                <div
                  key={imgIndex}
                  className="relative cursor-pointer group aspect-square"
                  onClick={() => setLightboxImage(image.url)}
                >
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={image.alt || ""}
                    fill
                    className="object-cover transition-opacity rounded-lg group-hover:opacity-90"
                  />
                </div>
              ))}
            </div>
            {shouldShowAd && (
              <AdSlot slot="content-ad" format="horizontal" className="my-8" />
            )}
          </div>
        );

      case "table":
        return (
          <div key={block.id || index} className="mb-6 overflow-x-auto">
            <table className="w-full border border-collapse rounded-lg border-border">
              <thead>
                <tr className="bg-muted">
                  {block.data.headers.map(
                    (header: string, headerIndex: number) => (
                      <th
                        key={headerIndex}
                        className="p-3 font-semibold text-left border border-border"
                      >
                        {renderTextContent(header)}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {block.data.rows.map((row: any, rowIndex: number) => (
                  <tr key={rowIndex} className="hover:bg-muted/50">
                    {Object.values(row).map((cell: any, cellIndex: number) => (
                      <td key={cellIndex} className="p-3 border border-border">
                        {renderTextContent(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {shouldShowAd && (
              <AdSlot slot="content-ad" format="horizontal" className="my-8" />
            )}
          </div>
        );

      case "faq":
        return (
          <div key={block.id || index} className="mb-6 space-y-4">
            {block.data.items.map((faq: any, faqIndex: number) => {
              const isExpanded = expandedFAQs.has(faqIndex);
              return (
                <div key={faqIndex} className="border rounded-lg border-border">
                  <button
                    className="flex items-center justify-between w-full p-4 text-left transition-colors hover:bg-muted/50"
                    onClick={() => toggleFAQ(faqIndex)}
                  >
                    <span className="font-medium">
                      {renderTextContent(faq.question)}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 text-muted-foreground">
                      {renderTextContent(faq.answer)}
                    </div>
                  )}
                </div>
              );
            })}
            {shouldShowAd && (
              <AdSlot slot="content-ad" format="horizontal" className="my-8" />
            )}
          </div>
        );

      case "product":
        return (
          <div key={block.id || index} className="mb-6">
            <div className="p-6 border rounded-lg border-border bg-card">
              <div className="flex flex-col gap-6 md:flex-row">
                <div className="md:w-1/3">
                  <Image
                    src={block.data.image || "/placeholder.svg"}
                    alt={renderTextContent(block.data.title)}
                    width={300}
                    height={200}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
                <div className="space-y-4 md:w-2/3">
                  <h3 className="text-xl font-bold">
                    {renderTextContent(block.data.title)}
                  </h3>
                  <p className="text-muted-foreground">
                    {renderTextContent(block.data.description)}
                  </p>
                  <Button asChild>
                    <a
                      href={block.data.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {renderTextContent(block.data.buttonText) ||
                        "Check Price"}
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
            {shouldShowAd && (
              <AdSlot slot="content-ad" format="horizontal" className="my-8" />
            )}
          </div>
        );

      case "callout":
        const calloutStyles = {
          info:
            "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-100",
          warning:
            "bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-100",
          error:
            "bg-red-50 border-red-200 text-red-900 dark:bg-red-950 dark:border-red-800 dark:text-red-100",
          success:
            "bg-green-50 border-green-200 text-green-900 dark:bg-green-950 dark:border-green-800 dark:text-green-100",
        };

        return (
          <div key={block.id || index} className="mb-6">
            <div
              className={`border-l-4 p-4 rounded-r-lg ${
                calloutStyles[block.data.type as keyof typeof calloutStyles] ||
                calloutStyles.info
              }`}
            >
              {block.data.title && (
                <h4 className="mb-2 font-semibold">
                  {renderTextContent(block.data.title)}
                </h4>
              )}
              <p>{renderTextContent(block.data.content)}</p>
            </div>
            {shouldShowAd && (
              <AdSlot slot="content-ad" format="horizontal" className="my-8" />
            )}
          </div>
        );

      case "quote":
        return (
          <div key={block.id || index} className="mb-6">
            <blockquote className="pl-4 text-lg italic border-l-4 border-primary">
              <p>"{renderTextContent(block.data.text)}"</p>
              {block.data.author && (
                <cite className="block mt-2 text-sm not-italic text-muted-foreground">
                  — {renderTextContent(block.data.author)}
                </cite>
              )}
            </blockquote>
            {shouldShowAd && (
              <AdSlot slot="content-ad" format="horizontal" className="my-8" />
            )}
          </div>
        );

      case "embed":
        const getEmbedContent = () => {
          if (
            block.data.url.includes("youtube.com") ||
            block.data.url.includes("youtu.be")
          ) {
            const videoId = block.data.url.includes("youtu.be")
              ? block.data.url.split("/").pop()
              : new URL(block.data.url).searchParams.get("v");

            return (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                className="w-full rounded-lg aspect-video"
                allowFullScreen
                title="YouTube video"
              />
            );
          }

          if (
            block.data.url.includes("twitter.com") ||
            block.data.url.includes("x.com")
          ) {
            return (
              <div className="p-4 text-center border rounded-lg bg-card">
                <p className="mb-4 text-muted-foreground">Twitter/X Embed</p>
                <Button asChild variant="outline">
                  <a
                    href={block.data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Tweet
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            );
          }

          return (
            <div className="p-4 text-center border rounded-lg bg-card">
              <p className="mb-4 text-muted-foreground">External Content</p>
              <Button asChild variant="outline">
                <a
                  href={block.data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Content
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          );
        };

        return (
          <div key={block.id || index} className="mb-6">
            {getEmbedContent()}
            {shouldShowAd && (
              <AdSlot slot="content-ad" format="horizontal" className="my-8" />
            )}
          </div>
        );

      case "divider": {
        const styleMap = {
          solid: "border-solid",
          dashed: "border-dashed",
          dotted: "border-dotted",
          double: "border-double",
        };

        return (
          <div key={block.id || index} className="mb-6">
            <hr
              className={`border-border ${
                styleMap[block.data?.style] || "border-solid"
              } border-t-2`}
            />
            {shouldShowAd && (
              <AdSlot slot="content-ad" format="horizontal" className="my-8" />
            )}
          </div>
        );
      }

      default:
        return (
          <div
            key={block.id || index}
            className="p-4 mb-6 border border-yellow-200 rounded bg-yellow-50"
          >
            <p className="text-yellow-800">Unknown block type: {block.type}</p>
            <pre className="mt-2 overflow-auto text-xs text-yellow-600">
              {JSON.stringify(block, null, 2)}
            </pre>
          </div>
        );
    }
  };

  const safeBlocks = Array.isArray(blocks) ? blocks : [];

  return (
    <div className="prose prose-lg max-w-none dark:prose-invert">
      {safeBlocks.map((block, index) => renderBlock(block, index))}

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <Image
              src={lightboxImage || "/placeholder.svg"}
              alt=""
              width={1200}
              height={800}
              className="object-contain max-w-full max-h-full"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute text-white top-4 right-4 hover:bg-white/20"
              onClick={() => setLightboxImage(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
