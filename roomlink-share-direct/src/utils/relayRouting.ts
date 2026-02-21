/**
 * Relay Routing - Multi-hop encrypted routing for anonymous file transfer
 */

export interface RelayNode {
  address: string;
  endpoint: string;
  publicKey?: string;
}

export class RelayRouter {
  /**
   * Create encrypted onion-routed data
   * Each layer is encrypted with the next relay's public key
   */
  async createEncryptedPath(
    data: ArrayBuffer,
    receiverPublicKey: string,
    relayNodes: RelayNode[]
  ): Promise<ArrayBuffer> {
    let encrypted: ArrayBuffer | string = data;

    // Step 1: Encrypt with receiver's public key (innermost layer)
    encrypted = await this.encryptWithPublicKey(encrypted, receiverPublicKey);

    // Step 2: Add layers for each relay (reverse order - onion routing)
    for (let i = relayNodes.length - 1; i >= 0; i--) {
      const nextHop = i < relayNodes.length - 1 
        ? relayNodes[i + 1].endpoint 
        : 'destination';

      const layer = {
        nextHop,
        payload: encrypted
      };

      // Encrypt this layer with current relay's public key
      if (relayNodes[i].publicKey) {
        encrypted = await this.encryptWithPublicKey(
          JSON.stringify(layer),
          relayNodes[i].publicKey!
        );
      } else {
        // Fallback: use symmetric encryption if no public key
        encrypted = await this.encryptSymmetric(JSON.stringify(layer));
      }
    }

    return typeof encrypted === 'string' 
      ? new TextEncoder().encode(encrypted).buffer 
      : encrypted;
  }

  /**
   * Encrypt data with RSA public key
   */
  async encryptWithPublicKey(
    data: ArrayBuffer | string,
    publicKeyPem: string
  ): Promise<ArrayBuffer> {
    try {
      // Convert PEM to CryptoKey
      const publicKey = await this.importPublicKey(publicKeyPem);

      // Convert data to ArrayBuffer if string
      const dataBuffer = typeof data === 'string'
        ? new TextEncoder().encode(data)
        : new Uint8Array(data);

      // Encrypt with RSA-OAEP
      const encrypted = await crypto.subtle.encrypt(
        {
          name: 'RSA-OAEP'
        },
        publicKey,
        dataBuffer
      );

      return encrypted;
    } catch (error) {
      console.error('Encryption failed:', error);
      throw error;
    }
  }

  /**
   * Decrypt data with RSA private key
   */
  async decryptWithPrivateKey(
    encryptedData: ArrayBuffer,
    privateKeyPem: string
  ): Promise<ArrayBuffer> {
    try {
      const privateKey = await this.importPrivateKey(privateKeyPem);

      const decrypted = await crypto.subtle.decrypt(
        {
          name: 'RSA-OAEP'
        },
        privateKey,
        encryptedData
      );

      return decrypted;
    } catch (error) {
      console.error('Decryption failed:', error);
      throw error;
    }
  }

  /**
   * Generate RSA key pair for encryption
   */
  async generateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256'
      },
      true,
      ['encrypt', 'decrypt']
    );

    const publicKey = await this.exportPublicKey(keyPair.publicKey);
    const privateKey = await this.exportPrivateKey(keyPair.privateKey);

    return { publicKey, privateKey };
  }

  /**
   * Import public key from PEM format
   */
  private async importPublicKey(pem: string): Promise<CryptoKey> {
    const pemContents = pem
      .replace('-----BEGIN PUBLIC KEY-----', '')
      .replace('-----END PUBLIC KEY-----', '')
      .replace(/\s/g, '');
    
    const binaryDer = this.base64ToArrayBuffer(pemContents);

    return await crypto.subtle.importKey(
      'spki',
      binaryDer,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256'
      },
      true,
      ['encrypt']
    );
  }

  /**
   * Import private key from PEM format
   */
  private async importPrivateKey(pem: string): Promise<CryptoKey> {
    const pemContents = pem
      .replace('-----BEGIN PRIVATE KEY-----', '')
      .replace('-----END PRIVATE KEY-----', '')
      .replace(/\s/g, '');
    
    const binaryDer = this.base64ToArrayBuffer(pemContents);

    return await crypto.subtle.importKey(
      'pkcs8',
      binaryDer,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256'
      },
      true,
      ['decrypt']
    );
  }

  /**
   * Export public key to PEM format
   */
  private async exportPublicKey(key: CryptoKey): Promise<string> {
    const exported = await crypto.subtle.exportKey('spki', key);
    const exportedAsBase64 = this.arrayBufferToBase64(exported);
    return `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
  }

  /**
   * Export private key to PEM format
   */
  private async exportPrivateKey(key: CryptoKey): Promise<string> {
    const exported = await crypto.subtle.exportKey('pkcs8', key);
    const exportedAsBase64 = this.arrayBufferToBase64(exported);
    return `-----BEGIN PRIVATE KEY-----\n${exportedAsBase64}\n-----END PRIVATE KEY-----`;
  }

  /**
   * Symmetric encryption fallback (AES-GCM)
   */
  private async encryptSymmetric(data: string): Promise<string> {
    const key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(data);

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoded
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    return this.arrayBufferToBase64(combined.buffer);
  }

  /**
   * Helper: Convert ArrayBuffer to Base64
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  /**
   * Helper: Convert Base64 to ArrayBuffer
   */
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
}

/**
 * Connect to relay node via WebSocket
 */
export class RelayConnection {
  private ws: WebSocket | null = null;
  private messageHandlers: Map<string, (data: any) => void> = new Map();

  async connect(endpoint: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(endpoint);

      this.ws.onopen = () => {
        console.log(`Connected to relay: ${endpoint}`);
        resolve();
      };

      this.ws.onerror = (error) => {
        console.error(`Relay connection error: ${endpoint}`, error);
        reject(error);
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          const handler = this.messageHandlers.get(message.type);
          if (handler) {
            handler(message);
          }
        } catch (error) {
          console.error('Failed to parse relay message:', error);
        }
      };
    });
  }

  send(data: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      throw new Error('WebSocket not connected');
    }
  }

  on(type: string, handler: (data: any) => void): void {
    this.messageHandlers.set(type, handler);
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
