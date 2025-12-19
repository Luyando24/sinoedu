# Cloudflare + Vercel Setup Guide

Using Cloudflare in front of Vercel is an excellent strategy to resolve SSL issues (`ERR_SSL_PROTOCOL_ERROR`) and improve accessibility in regions with strict firewalls (like China) or routing issues (like your experience in Zambia).

## Why this helps
1.  **SSL Termination**: Cloudflare handles the secure connection with the visitor. If Vercel's direct connection is failing due to routing or handshake issues, Cloudflare often bridges this gap.
2.  **Global Network**: Cloudflare's edge network is vast and often has better peering with local ISPs than Vercel's direct IPs.
3.  **China Access**: While not a guaranteed fix for the Great Firewall, Cloudflare is generally more resilient than direct hosting IPs.

## Step-by-Step Configuration

### 1. Cloudflare Setup
1.  Create a Cloudflare account and click **"Add a Site"**.
2.  Enter your domain name.
3.  Select the **Free Plan**.
4.  Cloudflare will scan your DNS records.
5.  Cloudflare will provide you with two Nameservers (e.g., `bob.ns.cloudflare.com`, `alice.ns.cloudflare.com`).

### 2. Hostinger (Domain Registrar) Configuration
1.  Log in to Hostinger.
2.  Go to your Domain management settings.
3.  Find the **Nameservers** section.
4.  Select **"Change Nameservers"**.
5.  Choose **"Use custom nameservers"**.
6.  Enter the two nameservers provided by Cloudflare.
7.  Save. *Note: This can take up to 24 hours to propagate globally, but often happens within minutes.*

### 3. Cloudflare DNS Configuration (Pointing to Vercel)
In your Cloudflare dashboard, go to the **DNS** tab. Ensure you have the following records:

| Type | Name | Content | Proxy Status |
|------|------|---------|--------------|
| A | @ | 76.76.21.21 | Proxied (Orange Cloud) |
| CNAME | www | cname.vercel-dns.com | Proxied (Orange Cloud) |

*If you have other records (like MX for email), keep them as they are.*

### 4. CRITICAL: SSL/TLS Settings
**This is the most important step.** If you miss this, your site will get a "Too many redirects" error.

1.  In Cloudflare, go to the **SSL/TLS** tab.
2.  Set the encryption mode to **Full (Strict)**.
    *   **Why?** Vercel already serves an SSL certificate. "Full (Strict)" tells Cloudflare to trust Vercel's certificate. If you use "Flexible", Cloudflare tries to talk to Vercel over HTTP, and Vercel redirects back to HTTPS, creating an infinite loop.

### 5. Vercel Configuration
1.  Go to your Vercel Project Settings > Domains.
2.  You don't need to change anything if you are just switching DNS providers, but ensure your domain is listed there.
3.  Vercel might show an "Invalid Configuration" warning because it detects Cloudflare proxying. This is normal and can usually be ignored if the site is loading correctly.

## Troubleshooting the "Blocked" Status

*   **Zambia**: The `ERR_SSL_PROTOCOL_ERROR` was likely a handshake failure between your local ISP and Vercel's IP. Cloudflare usually fixes this because your ISP definitely has a stable connection to Cloudflare.
*   **China**: Access in China is inconsistent.
    *   *Friend 1 (Can access)*: Might be using an ISP that has good routing to Vercel, or the specific Vercel IP wasn't blocked yet.
    *   *Friend 2 (Cannot access)*: Likely encountering SNI blocking or DNS poisoning.
    *   **Cloudflare Impact**: Cloudflare improves the odds of working in China, but it is not a 100% guarantee against the Great Firewall. For guaranteed China access, a self-hosted solution (like the Docker setup we prepared) on a server with a clean IP is the most robust long-term solution.
