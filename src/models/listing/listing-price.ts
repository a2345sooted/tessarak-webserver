/**
 * Pricing details for a listing.
 */
export interface ListingPrice {
  /**
   * The price of the listing.
   */
  price: number;

  /**
   * The currency the price is in.
   */
  currency: string;
}