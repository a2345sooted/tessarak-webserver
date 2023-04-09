/**
 * A curated list of pulses that are grouped together. These can be by a user,
 * by a group of users, by a topic, or many other criteria set forth in dimension
 * resolvers.
 */
export interface Dimension {
  /**
   * Unique identifier for the dimension.
   */
  id: string;

  /**
   * The name of the dimension.
   */
  name: string;

  /**
   * A brief description of the dimension.
   */
  description: string;

  /**
   * Href to the first page of pulses in the dimension.
   */
  first: string;

  /**
   * Href to the last page of pulses in the dimension.
   */
  last: string;
}