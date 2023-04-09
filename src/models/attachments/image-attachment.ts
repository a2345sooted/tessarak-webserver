import { Attachment } from "./attachment";
import { ImageMediaType } from "../images/image-media-type";

/**
 * An image attachment.
 */
export interface ImageAttachment extends Attachment {
  type: 'image';

  /**
   * Media type of the image.
   */
  mediaType: ImageMediaType;
}