const crypto = require('crypto');

function decodeBase32(encoded) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = '';
  for (let i = 0; i < encoded.length; i++) {
    const val = alphabet.indexOf(encoded.charAt(i).toUpperCase());
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, '0');
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.substr(i, 8), 2));
  }
  return Buffer.from(bytes);
}

function generateTOTP(secretBase32) {
  const secret = decodeBase32(secretBase32);
  const epoch = Math.floor(Date.now() / 1000);
  const time = Buffer.alloc(8);
  
  // Calculate time steps (30 seconds)
  let count = Math.floor(epoch / 30);
  for (let i = 7; i >= 0; i--) {
    time[i] = count & 0xff;
    count >>= 8;
  }
  
  const hmac = crypto.createHmac('sha1', secret);
  hmac.update(time);
  const hash = hmac.digest();
  
  const offset = hash[hash.length - 1] & 0x0f;
  const binary =
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff);
    
  let otp = (binary % 1000000).toString();
  return otp.padStart(6, '0');
}

const secret = 'QC62FQKXT2DQTO43LMWH5A44UKVPQ7LK5Y6HVHRQ3XTIKLDTB6HA';
console.log('TOTP Code:', generateTOTP(secret));
