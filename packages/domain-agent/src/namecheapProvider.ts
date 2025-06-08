import axios from 'axios'
import { DNSProvider, NamecheapCredentials } from './index'

export class NamecheapProvider implements DNSProvider {
  constructor(private creds: NamecheapCredentials) {}

  private async request(command: string, params: Record<string, string>) {
    const base = 'https://api.namecheap.com/xml.response'
    const res = await axios.get(base, {
      params: {
        ApiUser: this.creds.apiUser,
        ApiKey: this.creds.apiKey,
        UserName: this.creds.apiUser,
        ClientIp: this.creds.clientIp,
        Command: command,
        ...params,
      },
    })
    if (res.status !== 200) throw new Error('Request failed')
    return res.data
  }

  async addTxtRecord(host: string, name: string, value: string, ttl = 60) {
    await this.request('namecheap.domains.dns.setHosts', {
      SLD: host.split('.')[0],
      TLD: host.split('.').slice(1).join('.'),
      [`HostName1`]: name,
      [`RecordType1`]: 'TXT',
      [`Address1`]: value,
      [`TTL1`]: ttl.toString(),
    })
  }

  async removeTxtRecord(host: string, name: string) {
    // Placeholder: would fetch existing records and remove matching one
    // For brevity, this is left unimplemented
  }
}
