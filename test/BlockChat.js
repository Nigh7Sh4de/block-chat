const Key = require('node-rsa')
const { expect } = require('chai')

const BlockChat = require('../src/BlockChat')
const Message = require('../src/models/Message')

describe('BlockChat:', () => {
  describe('get messages for:', () => {
    it('can return all messages for a given PK', () => {
      const secret = '-----BEGIN RSA PRIVATE KEY-----\nMIIBPAIBAAJBAMLxTeyJ6xbcMjnj54QV8ovSdtMM/rjaHogBU1vdOOFlwnD31vu8\nvBKfJe7aYN+y4Y5pL18WZkFcGEVd7YoN0FMCAwEAAQJBAIXob9id3Ij1dOLjNHM9\nCEEXr1vGP2sHGZXfIz2lNp9MrgmYa8tp+qqFcgawrrKJFmKCQGlaby2OeZCJFDlT\nW6ECIQDp9JNDuHdde6yrzPTHKxRJWOLXOAupWOojJSdVpxOpmwIhANVPq7T2bGET\n2OsXLeRi+OpfH9reBWDL1+xraM1CRpupAiEAqQcH4pSCwOqajSEt9Duek4OBmEao\nvjg8KRotugdVAGMCIQCaO6Lxk4PFpW4gfYAHNLC59dG4lPPai0kyfm8mipc3EQIg\nYegOxRiP/UEFDpfT21OxVSjNh2PFNtnAYfMGIE74fw4=\n-----END RSA PRIVATE KEY-----'
      const public = '-----BEGIN PUBLIC KEY-----\nMFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMLxTeyJ6xbcMjnj54QV8ovSdtMM/rja\nHogBU1vdOOFlwnD31vu8vBKfJe7aYN+y4Y5pL18WZkFcGEVd7YoN0FMCAwEAAQ==\n-----END PUBLIC KEY-----'
      const signature = new Key(secret).sign(public)
      const text = 'some message text'
      const message = new Message({
        text,
        to: public,
        signature,
      })
      const chat = new BlockChat([ message ])

      const result = chat.get(public, signature)

      expect(result).to.members([ message ])
    })

    it('will not return messages if public key is invalid', () => {
      const public = 'some invalid key'
      const result = new BlockChat().get(public)

      expect(result).to.be.false
    })

    it('will not return messages if signature is inavlid', () => {
      const public = '-----BEGIN PUBLIC KEY-----\nMFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMLxTeyJ6xbcMjnj54QV8ovSdtMM/rja\nHogBU1vdOOFlwnD31vu8vBKfJe7aYN+y4Y5pL18WZkFcGEVd7YoN0FMCAwEAAQ==\n-----END PUBLIC KEY-----'
      const signature = 'some signature'
      const text = 'some message text'
      const message = new Message({
        text,
        to: public,
        signature,
      })
      const chat = new BlockChat([ message ])

      const result = chat.get(public, signature)

      expect(result).to.be.false
    })
  })

  describe('add message:', () => {
    it('can add a valid message', () => {
      const secret = '-----BEGIN RSA PRIVATE KEY-----\nMIIBPAIBAAJBAMLxTeyJ6xbcMjnj54QV8ovSdtMM/rjaHogBU1vdOOFlwnD31vu8\nvBKfJe7aYN+y4Y5pL18WZkFcGEVd7YoN0FMCAwEAAQJBAIXob9id3Ij1dOLjNHM9\nCEEXr1vGP2sHGZXfIz2lNp9MrgmYa8tp+qqFcgawrrKJFmKCQGlaby2OeZCJFDlT\nW6ECIQDp9JNDuHdde6yrzPTHKxRJWOLXOAupWOojJSdVpxOpmwIhANVPq7T2bGET\n2OsXLeRi+OpfH9reBWDL1+xraM1CRpupAiEAqQcH4pSCwOqajSEt9Duek4OBmEao\nvjg8KRotugdVAGMCIQCaO6Lxk4PFpW4gfYAHNLC59dG4lPPai0kyfm8mipc3EQIg\nYegOxRiP/UEFDpfT21OxVSjNh2PFNtnAYfMGIE74fw4=\n-----END RSA PRIVATE KEY-----'
      const public = '-----BEGIN PUBLIC KEY-----\nMFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMLxTeyJ6xbcMjnj54QV8ovSdtMM/rja\nHogBU1vdOOFlwnD31vu8vBKfJe7aYN+y4Y5pL18WZkFcGEVd7YoN0FMCAwEAAQ==\n-----END PUBLIC KEY-----'
      const text = 'some message text'
      const message1 = new Message({
        text,
        to: public,
      })
      const chat = new BlockChat([ message1 ])
      
      const prevHash = message1.getHash()
      const prevSignature = new Key(secret).sign(prevHash)
      const message2 = new Message({
        prevHash,
        prevSignature,
        text,
        to: public,
      })

      const result = chat.add(message2)

      expect(result).to.be.true
      expect(chat.list).to.members([ message1, message2 ])
    })

    it('will fail an incomplete message', () => {
      const public = '-----BEGIN PUBLIC KEY-----\nMFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMLxTeyJ6xbcMjnj54QV8ovSdtMM/rja\nHogBU1vdOOFlwnD31vu8vBKfJe7aYN+y4Y5pL18WZkFcGEVd7YoN0FMCAwEAAQ==\n-----END PUBLIC KEY-----'
      const text = 'some message text'
      const message1 = new Message({
        text, 
        to: public,
      })
      const chat = new BlockChat([ message1 ])
      
      const message2 = new Message()

      const result = chat.add(message2)

      expect(result).to.be.false
      expect(chat.list).to.not.include(message2)
    })

    it('will fail a message with no predecessor', () => {
      const secret = '-----BEGIN RSA PRIVATE KEY-----\nMIIBPAIBAAJBAMLxTeyJ6xbcMjnj54QV8ovSdtMM/rjaHogBU1vdOOFlwnD31vu8\nvBKfJe7aYN+y4Y5pL18WZkFcGEVd7YoN0FMCAwEAAQJBAIXob9id3Ij1dOLjNHM9\nCEEXr1vGP2sHGZXfIz2lNp9MrgmYa8tp+qqFcgawrrKJFmKCQGlaby2OeZCJFDlT\nW6ECIQDp9JNDuHdde6yrzPTHKxRJWOLXOAupWOojJSdVpxOpmwIhANVPq7T2bGET\n2OsXLeRi+OpfH9reBWDL1+xraM1CRpupAiEAqQcH4pSCwOqajSEt9Duek4OBmEao\nvjg8KRotugdVAGMCIQCaO6Lxk4PFpW4gfYAHNLC59dG4lPPai0kyfm8mipc3EQIg\nYegOxRiP/UEFDpfT21OxVSjNh2PFNtnAYfMGIE74fw4=\n-----END RSA PRIVATE KEY-----'
      const public = '-----BEGIN PUBLIC KEY-----\nMFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMLxTeyJ6xbcMjnj54QV8ovSdtMM/rja\nHogBU1vdOOFlwnD31vu8vBKfJe7aYN+y4Y5pL18WZkFcGEVd7YoN0FMCAwEAAQ==\n-----END PUBLIC KEY-----'
      const text = 'some message text'
      const chat = new BlockChat()
      
      const prevHash = 'invalid previous hash'
      const prevSignature = new Key(secret).sign(prevHash)
      const message2 = new Message({
        prevHash,
        prevSignature,
        text,
        to: public,
      })

      const result = chat.add(message2)

      expect(result).to.be.false
      expect(chat.list).to.be.empty
    })

    it('will fail a double spend', () => {
      const secret = '-----BEGIN RSA PRIVATE KEY-----\nMIIBPAIBAAJBAMLxTeyJ6xbcMjnj54QV8ovSdtMM/rjaHogBU1vdOOFlwnD31vu8\nvBKfJe7aYN+y4Y5pL18WZkFcGEVd7YoN0FMCAwEAAQJBAIXob9id3Ij1dOLjNHM9\nCEEXr1vGP2sHGZXfIz2lNp9MrgmYa8tp+qqFcgawrrKJFmKCQGlaby2OeZCJFDlT\nW6ECIQDp9JNDuHdde6yrzPTHKxRJWOLXOAupWOojJSdVpxOpmwIhANVPq7T2bGET\n2OsXLeRi+OpfH9reBWDL1+xraM1CRpupAiEAqQcH4pSCwOqajSEt9Duek4OBmEao\nvjg8KRotugdVAGMCIQCaO6Lxk4PFpW4gfYAHNLC59dG4lPPai0kyfm8mipc3EQIg\nYegOxRiP/UEFDpfT21OxVSjNh2PFNtnAYfMGIE74fw4=\n-----END RSA PRIVATE KEY-----'
      const public = '-----BEGIN PUBLIC KEY-----\nMFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMLxTeyJ6xbcMjnj54QV8ovSdtMM/rja\nHogBU1vdOOFlwnD31vu8vBKfJe7aYN+y4Y5pL18WZkFcGEVd7YoN0FMCAwEAAQ==\n-----END PUBLIC KEY-----'
      const text = 'some message text'

      const message1 = new Message({
        text,
        to: public,
      })
      
      const prevHash1 = message1.getHash()
      const prevSignature2 = new Key(secret).sign(prevHash1)
      const message2 = new Message({
        text,
        to: public,
        prevHash: prevHash1,
        prevSignature: prevSignature2,
      })

      const chat = new BlockChat([ message1, message2 ])
      
      const prevHash2 = message2.getHash()
      const signature3 = new Key(secret).sign(prevHash2)
      const message3 = new Message({
        text,
        to: public,
        hash: prevHash2,
        signature: signature3,
      })

      const result = chat.add(message3)

      expect(result).to.be.false
      expect(chat.list).to.not.contain(message3)
    })

    it('will fail with an invalid signature', () => {
      const secret = '-----BEGIN RSA PRIVATE KEY-----\nMIIBPAIBAAJBAMLxTeyJ6xbcMjnj54QV8ovSdtMM/rjaHogBU1vdOOFlwnD31vu8\nvBKfJe7aYN+y4Y5pL18WZkFcGEVd7YoN0FMCAwEAAQJBAIXob9id3Ij1dOLjNHM9\nCEEXr1vGP2sHGZXfIz2lNp9MrgmYa8tp+qqFcgawrrKJFmKCQGlaby2OeZCJFDlT\nW6ECIQDp9JNDuHdde6yrzPTHKxRJWOLXOAupWOojJSdVpxOpmwIhANVPq7T2bGET\n2OsXLeRi+OpfH9reBWDL1+xraM1CRpupAiEAqQcH4pSCwOqajSEt9Duek4OBmEao\nvjg8KRotugdVAGMCIQCaO6Lxk4PFpW4gfYAHNLC59dG4lPPai0kyfm8mipc3EQIg\nYegOxRiP/UEFDpfT21OxVSjNh2PFNtnAYfMGIE74fw4=\n-----END RSA PRIVATE KEY-----'
      const public = '-----BEGIN PUBLIC KEY-----\nMFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMLxTeyJ6xbcMjnj54QV8ovSdtMM/rja\nHogBU1vdOOFlwnD31vu8vBKfJe7aYN+y4Y5pL18WZkFcGEVd7YoN0FMCAwEAAQ==\n-----END PUBLIC KEY-----'
      const text = 'some message text'
      const message1 = new Message({
        text,
        to: public,
      })
      const chat = new BlockChat([ message1 ])
      
      const prevSignature = new Key(secret).sign('hash')
      const message2 = new Message({
        text,
        to: public,
        prevHash: message1.getHash(),
        prevSignature,
      })

      const result = chat.add(message2)

      expect(result).to.be.false
      expect(chat.list).to.not.contain(message2)
    })
  })
})