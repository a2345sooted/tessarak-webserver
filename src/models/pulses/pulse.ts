import { PulseType } from "./pulse-type";

/**
 * A pulse is a message that can be sent directly to a user, to a group of users,
 * to a users feed, or a dimension (@see {@link Dimension}).
 */
export interface Pulse {
  /**
   * Unique identifier for the pulse.
   */
  id: string;

  /**
   * The type of the pulse (@see {@link PulseType}). This is used to process the
   * specific pulse data correctly.
   */
  type: PulseType;

  /**
   * When the pulse was published.
   */
  published: Date;

  /**
   * Who the pulse was published by.
   */
  author: string;
}