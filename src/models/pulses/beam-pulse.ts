import { Pulse } from "./pulse";

/**
 * A basic pulse similar to a tweet.
 */
export interface BeamPulse extends Pulse {
  type: 'beam';
}