import type { BaseParameters } from "../types.ts";

export type GoogleShoppingParameters = BaseParameters & {
  /**
   * Search Query
   * Parameter defines the query you want to search. You can use anything that you
   * would use in a regular Google Shopping search. e.g. `inurl:`, `site:`,
   * `intitle:`.
   */
  q: string;

  /**
   * Location
   * Parameter defines from where you want the search to originate. If several
   * locations match the location requested, we'll pick the most popular one. Head to
   * the [/locations.json API](https://serpapi.com/locations-api) if you need a more
   * precise control. location and uule parameters can't be used together. Avoid
   * utilizing location when setting the location outside the U.S. when using Google
   * Shopping API.
   */
  location?: string;

  /**
   * Encoded Location
   * Parameter is the Google encoded location you want to use for the search. uule
   * and location parameters can't be used together.
   */
  uule?: string;

  /**
   * Domain
   * Parameter defines the Google domain to use. It defaults to `google.com`. Head to
   * the [Google domains](https://serpapi.com/google-domains) for a full list of
   * supported Google domains.
   */
  google_domain?: string;

  /**
   * Country
   * Parameter defines the country to use for the Google search. It's a two-letter
   * country code. (e.g., `us` for the United States, `uk` for United Kingdom, or
   * `fr` for France) Head to the [Google
   * countries](https://serpapi.com/google-countries) for a full list of supported
   * Google countries.
   */
  gl?: string;

  /**
   * Language
   * Parameter defines the language to use for the Google Maps search. It's a
   * two-letter language code. (e.g., `en` for English, `es` for Spanish, or `fr` for
   * French) Head to the Google languages for a full list of supported [Google
   * languages](https://serpapi.com/google-languages).
   */
  hl?: string;

  /**
   * as_dt
   * Parameter controls whether to include or exclude results from the site named in
   * the as_sitesearch parameter.
   */
  as_dt?: string;

  /**
   * as_epq
   * Parameter identifies a phrase that all documents in the search results must
   * contain. You can also use the [phrase
   * search](https://developers.google.com/custom-search/docs/xml_results#PhraseSearchqt)
   * query term to search for a phrase.
   */
  as_epq?: string;

  /**
   * as_eq
   * Parameter identifies a word or phrase that should not appear in any documents in
   * the search results. You can also use the [exclude
   * query](https://developers.google.com/custom-search/docs/xml_results#Excludeqt)
   * term to ensure that a particular word or phrase will not appear in the documents
   * in a set of search results.
   */
  as_eq?: string;

  /**
   * as_lq
   * Parameter specifies that all search results should contain a link to a
   * particular URL. You can also use the
   * [link:](https://developers.google.com/custom-search/docs/xml_results#BackLinksqt)
   * query term for this type of query.
   */
  as_lq?: string;

  /**
   * as_nlo
   * Parameter specifies the starting value for a search range. Use as_nlo and as_nhi
   * to append an inclusive search range.
   */
  as_nlo?: string;

  /**
   * as_nhi
   * Parameter specifies the ending value for a search range. Use as_nlo and as_nhi
   * to append an inclusive search range.
   */
  as_nhi?: string;

  /**
   * as_oq
   * Parameter provides additional search terms to check for in a document, where
   * each document in the search results must contain at least one of the additional
   * search terms. You can also use the [Boolean
   * OR](https://developers.google.com/custom-search/docs/xml_results#BooleanOrqt)
   * query term for this type of query.
   */
  as_oq?: string;

  /**
   * as_q
   * Parameter provides search terms to check for in a document. This parameter is
   * also commonly used to allow users to specify additional terms to search for
   * within a set of search results.
   */
  as_q?: string;

  /**
   * as_qdr
   * Parameter requests search results from a specified time period (quick date
   * range). The following values are supported:
   * `d[number]`: requests results from the specified number of past days. Example
   * for the past 10 days: `as_qdr=d10`
   * `w[number]`: requests results from the specified number of past weeks.
   * `m[number]`: requests results from the specified number of past months.
   * `y[number]`: requests results from the specified number of past years. Example
   * for the past year: `as_qdr=y`
   */
  as_qdr?: string;

  /**
   * as_rq
   * Parameter specifies that all search results should be pages that are related to
   * the specified URL. The parameter value should be a URL. You can also use the
   * [related:](https://developers.google.com/custom-search/docs/xml_results#RelatedLinksqt)
   * query term for this type of query.
   */
  as_rq?: string;

  /**
   * as_sitesearch
   * Parameter allows you to specify that all search results should be pages from a
   * given site. By setting the as_dt parameter, you can also use it to exclude pages
   * from a given site from your search resutls.
   */
  as_sitesearch?: string;

  /**
   * Advanced Search Parameters
   * (to be searched) parameter defines advanced search parameters that aren't
   * possible in the regular query field.
   */
  tbs?: string;

  /**
   * Result Offset
   * Parameter defines the result offset. It skips the given number of results. It's
   * used for pagination. (e.g., `0` (default) is the first page of results, `60` is
   * the 2nd page of results, `120` is the 3rd page of results, etc.).
   */
  start?: number;

  /**
   * Number of Results
   * Parameter defines the maximum number of results to return. (e.g., `60` (default)
   * returns 60 results, `40` returns 40 results, and `100` (maximum) returns 100
   * results).
   * Any number greater than maximum number (`100`) will default to `100`.
   * Any number lesser than minimum number (`1`) will default to `60`.
   */
  num?: string;
};
