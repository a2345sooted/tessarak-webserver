import { ImagePulse } from "../pulses/image-pulse";
import { VideoPulse } from "../pulses/video-pulse";
import { BeamPulse } from "../pulses/beam-pulse";
import { ListingPulse } from "../pulses/listing-pulse";

/**
 * A page of pulses in a dimension.
 */
export interface DimensionFeed {
  /**
   * Pulse items on this page.
   */
  items: Array<ImagePulse | VideoPulse | BeamPulse | ListingPulse>;

  /**
   * The URL to the next page of results.
   */
  next?: string;

  /**
   * The URL to the previous page of results.
   */
  previous?: string;
}