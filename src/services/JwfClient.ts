import { ClientConfig, createClient, SanityClient } from '@sanity/client';
import * as imageUrlBuilder from '@sanity/image-url';
import { Image } from '../types/Image';
import { QueryParams } from "@sanity/client";

export class JwfClient {
  client: SanityClient | null;

  constructor() {
    this.client = null;
    this.init();
  }

  // Initialize Sanity client
  async init() {
    const config = this.loadConfig();
    this.client = createClient(config);
  }

  loadConfig(): ClientConfig {
    return {
      projectId: 'yixpgvrk',
      dataset: 'production',
      useCdn: true,
      apiVersion: '2023-05-03',
    };
  }

  // Method that queries the Sanity
  query(query: string, params?: QueryParams) {
    if (!this.client) throw new Error('Sanity client is not initialized');
    return this.client.fetch(query, params);
  }

  // Method that retrieves the url of an image
  urlForImage(source: Image) {
    if (!this.client) throw new Error('Sanity client is not initialized');
    return imageUrlBuilder(this.client).image(source);
  }
}
