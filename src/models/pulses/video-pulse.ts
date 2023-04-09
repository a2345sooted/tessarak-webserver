import { Pulse } from "./pulse";

/**
 * A pulse that contains a video.
 */
export interface VideoPulse extends Pulse {
  type: 'video';

  /**
   * The URL to the video content.
   */
  url: string;

  /**
   * The name of the video.
   */
  name: string;

  /**
   * The duration of the video in ISO 8601 format ex. 'PT2M30S' would be a video
   * length of 2 minutes and 30 seconds.
   */
  duration: string;
}