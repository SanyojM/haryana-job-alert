import { Block, PartialBlock } from "@blocknote/core";
import { PostTemplate } from "@/pages/admin/posts/new";

// This function converts your JSON template into an array of BlockNote blocks
export function parseTemplateToBlocks(template: PostTemplate): PartialBlock[] {
  const blocks: PartialBlock[] = [];

  // Parse Placeholders
  if (template.structure.placeholders) {
    blocks.push({
      type: "heading",
      props: { level: 2 },
      content: [{ type: "text", text: "Key Information", styles: {} }],
    });
    template.structure.placeholders.forEach(p => {
      blocks.push({
        type: "paragraph",
        content: [
          { type: "text", text: `${p.label}: `, styles: { bold: true } },
          { type: "text", text: `[Enter ${p.label} here]`, styles: { "textColor": "gray", "backgroundColor": "gray/10" } },
        ],
      });
    });
  }

  // Parse Blocks
  if (template.structure.blocks) {
    template.structure.blocks.forEach(b => {
      blocks.push({
        type: "heading",
        props: { level: 2 },
        content: [{ type: "text", text: b.label, styles: {} }],
      });

      if (b.type === 'link_group' && b.fields) {
        const listItems = b.fields.map((field: any) => ({
          type: "bulletListItem" as const, // Corrected type
          content: [
            { type: "text", text: `${field.label}: `, styles: { bold: true } },
            { type: "link", content: "Click to Add Link", href: "https://" },
          ]
        }));
        blocks.push(...listItems); // Add list items directly
      } else if (b.type === 'richtext') {
        blocks.push({ type: "paragraph", content: b.helpText || "Start writing..." });
      }
    });
  }

  return blocks;
}