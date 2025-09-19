// utils/cleanContent.ts
export const cleanContentBlocks = (blocks: any[]) => {
  return blocks.map((block) => {
    if (block.data?.text) {
      return {
        ...block,
        data: {
          ...block.data,
          text: stripHtml(block.data.text),
        },
      };
    }
    return block;
  });
};

function stripHtml(html: string): string {
  if (!html) return "";

  let cleaned = html;

  // 1. Remove <a> tags but keep inner text
  cleaned = cleaned.replace(/<a[^>]*>(.*?)<\/a>/gi, "$1");

  // 2. Remove attributes like class="...", href="...", etc.
  cleaned = cleaned.replace(/\s+\w+="[^"]*"/gi, "");

  // 3. Remove stray symbols like ">
  cleaned = cleaned.replace(/"\s*>/g, " ");

  // 4. Remove any remaining HTML tags
  cleaned = cleaned.replace(/<[^>]+>/g, "");

  // 5. Collapse multiple spaces/newlines
  return cleaned.replace(/\s+/g, " ").trim();
}
      