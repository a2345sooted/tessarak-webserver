import { Pulse } from "./pulse";
import { ImageMediaType } from "../images/image-media-type";

/**
 * A pulse that contains an image.
 */
export interface ImagePulse extends Pulse {
  type: 'image';

  /**
   * The URL to the image content.
   */
  url: string;

  /**
   * The name of the image.
   */
  name: string;

  /**
   * The width of the image in pixels.
   */
  width: number;

  /**
   * The height of the image in pixels.
   */
  height: number;

  /**
   * The media type of the image.
   */
  mediaType: ImageMediaType;
}