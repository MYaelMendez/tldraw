export interface DNSProvider {
  addTxtRecord(host: string, name: string, value: string, ttl?: number): Promise<void>
  removeTxtRecord(host: string, name: string): Promise<void>
}

export interface NamecheapCredentials {
  apiUser: string
  apiKey: string
  clientIp: string
}

/**
 * DomainAgent is responsible for configuring DNS records used for AT Protocol
 * handle verification. In this minimal implementation, the agent accepts a DNS
 * provider which abstracts the underlying registrar API.
 */
export class DomainAgent {
  constructor(private provider: DNSProvider) {}

  /**
   * Ensure that the `_atproto` TXT record is set for the provided host.
   * @param host The domain to configure
   * @param did The DID to associate with the handle
   */
  async configureAtprotoRecord(host: string, did: string) {
    const recordName = '_atproto'
    await this.provider.removeTxtRecord(host, recordName)
    await this.provider.addTxtRecord(host, recordName, `did=${did}`, 60)
  }
}
