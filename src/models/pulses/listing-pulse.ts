import { Pulse } from "./pulse";
import { ImageAttachment } from "../attachments/image-attachment";
import { ListingPrice } from "../listing/listing-price";

/**
 * A pulse that contains a listing of something for sale.
 */
export interface ListingPulse extends Pulse {
  type: 'listing';

  /**
   * The title or tagline of the listing.
   */
  title: string;

  /**
   * A detailed description of the listing.
   */
  description: string;

  /**
   * A list of images associated with the listing.
   */
  attachments: Array<ImageAttachment>;

  /**
   * The pricing details for the listing.
   */
  price: ListingPrice;
}