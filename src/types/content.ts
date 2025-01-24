export type TextStyle = "body" | "title" | "caption";
export type TextSize = "small" | "normal" | "large" | "extra_bold";
export type ContentType = "text" | "image" | "gif";

export interface BaseContent {
  id: string;
  _type: ContentType;
}

export interface TextContent extends BaseContent {
  _type: "text";
  textContent: string;
  textStyle: TextStyle;
  textSize: TextSize;
}

export interface ImageContent extends BaseContent {
  _type: "image" | "gif";
  imageUrl: string;
  imageWidth?: number;
  caption?: string;
  prompt?: string;
  alt?: string;
}

export type Content = TextContent | ImageContent;

export interface CardContent {
  id: string;
  title?: string;
  content: Content[];
}

export function isTextContent(content: Content): content is TextContent {
  return content._type === "text";
}

export function isImageContent(content: Content): content is ImageContent {
  return content._type === "image" || content._type === "gif";
}
