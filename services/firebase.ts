import admin from "firebase-admin";

const app = !admin.apps.length
    ? admin.initializeApp({
          credential: admin.credential.cert({
              type: "service_account",
              project_id: "patriota",
              private_key_id: "9785a93581ea1c0729aa3871746f3dc5e3b42b54",
              private_key:
                  "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDU+ZxsHMkml0vW\nmH5ePauzGYw0VNld4y28JpkK91NiZp7mRmo1ndadRIj82VaUY/ATmd4ItCjN7a32\nEgYJDTWuwXbkP6QR1QLcKT9HTfj8ESeedbhYxhQDj9er5v66fFSfzz1rVRyNztwl\nzdjHn1tH/nwvJbiMMbircxZAEFMz/dm2vM0/GIAexmaMGA+dHYvC+icPGzByGhWL\niSSJQZcMqLT2MQJ+3uvCaIl0CWHqMVUeEc6A5G1jkrO7R8cfYJBWQbMK2EUPckEI\nrK/LjfAdRyUk8eksRe5L3gtVyQSKesLAgSMdL2+760fzDTwyOG207Z3lstRgB7uN\nARX4usg9AgMBAAECggEAK09tk4DRGTN4XTYasLCK67ucywGcSJ8L7HDO+69rOh4T\nX1HfhHLKM6Y902mhVUDzkBDg2dVFXQdiMqHcr1eL3LOEKYuVoni2ga4zq5z8LsqQ\nS4W2DPuPE2BbpB4wHB1vmiYrX9npmh8AnwF6/bF2/y+N8oqRupTb8KXRVwra2L3+\nOdtDsgO7bbSHP53cknEicKTG6xtnAVZyGKGSFVeY1ZadV0Y9KKjRKdwECziCUCji\npbvOzlHxOghMHtfaFonWepaBLm7HZ8tnva8WBbjyHcJ6RxpGxozsBe6rw7z1swpS\nJ14VzFFiZsBzzS1oEWy3pHmx9Onx9L7P0FP+vTTgQwKBgQD3QA+f6uPfaELX2wNU\n7B/7o9gskuQ/Spv56LS78xLHf3hEkjxtfY5w6rJmVg0q5Ak3fDoBihr+bwyY9k6P\nrJ820JMbh9MrDvLcZziiCfBwWBg4K8cx/9WjDUaszHfZDH0p/QCnwTxeFB/drONZ\nbhmJZCmxCiRa8EKbVXpsDUr54wKBgQDcgwmKKGSBfareR2nWjB2w+OTsYP16WH6D\nObpM2fTMSFP8TAeg4zIxDNamNb639Qw9C5YKN5dbMLGW5qpi+gM+aTSzInqwXSmg\ne3tNCsVjcYnbh9Eonyqpe9VjshKvp9N8+aBnLr+k097/QICz/L3XEU3Lex9lCJss\nbkYOE/lPXwKBgQCf+wZhHhYlxwuBKcglGce0Bhbo+H7RaRA1itnuxt/+z77c95Y7\n7kLNUz7tsn5Ao15HVY0e0+KVgPswuiapFjPKvviAlskPElQYQn3FcxLtTkMVjVYN\nRxFPuFZjlsVxXoBaO8dBxGmwIetgfu54PiIt4O6NDBfr84vVgGB/K7a4qwKBgCep\nujGLimhwPie1GKhqk3ydiC+sUmuLN1ZLL+Na4NlNuS2MT2L0+rYv5PwIdsGH5iek\nydwUm7jfTVIjM0qSRbsYGU6PSRon57DiBQ+afF6isXU3PLvdxUKu73b7NLk7qqK0\nE9H7aqUvJtEqvPui3lKs3h1XjBIUNjULsLYfiZxpAoGAEnRSu9KkmdcGIPOdWR0m\nHudTESfBCOpizmXxb6DkME/O1PYGgFFIb8X9qMdLr0JiQk4zadi64tsY7kjMT45k\n6ZowBr9SraIA5hqHsnTJVYgCE1IkiOoXH1VKm9CuRdyGeCPzhbOx8jGPjVclBe1P\nkXSLpWxb4ITT92ou/CVY1Ow=\n-----END PRIVATE KEY-----\n",
              client_email:
                  "firebase-adminsdk-57or2@patriota.iam.gserviceaccount.com",
              client_id: "107986877175774790204",
              auth_uri: "https://accounts.google.com/o/oauth2/auth",
              token_uri: "https://oauth2.googleapis.com/token",
              auth_provider_x509_cert_url:
                  "https://www.googleapis.com/oauth2/v1/certs",
              client_x509_cert_url:
                  "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-57or2%40patriota.iam.gserviceaccount.com",
          }),
          storageBucket: "patriota.appspot.com",
      })
    : admin.app();

// Cloud storage
export const bucket = app.storage().bucket();
