import { AttachmentType } from "./attachment-type";

/**
 * A media attachment.
 */
export interface Attachment {
  /**
   * The type of attachment.
   */
  attachmentType: AttachmentType;

  /**
   * The URL of the attachment content.
   */
  url: string;
}