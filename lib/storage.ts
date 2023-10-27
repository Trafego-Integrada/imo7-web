import {
    Region,
    AuthenticationDetailsProvider,
    ConfigFileAuthenticationDetailsProvider,
} from "oci-common";

const tenancy =
    "ocid1.tenancy.oc1..aaaaaaaagzw4a3rjpjyjgolo4vfmjsp2i6zjqykoz5233xdwqa7uxdkuueya";
const user =
    "ocid1.user.oc1..aaaaaaaah7aqzqud7lgm5hsvgjrbsnhhoyelomaynljdfim7lzik6ocbrmjq";
const fingerprint = "7f:2c:69:1e:a5:bc:29:cb:46:dc:b5:bb:75:62:f7:9a";
const passphrase = null; // optional parameter
const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDQ8vAGPleoR/Wo
xcni6TudB1N5n+qU4J0UmhTzKmTIriCMqcVvYBASi/wMqPl/ydBM2xU9ZI44Zqba
I3Y4wvOq12EsKgGdsOYppHAmZ0sw3qQo53DYb/fy+4cv48TxcgJ3jym4pukp5+yx
sQ82dDKHb7K9dkhWWUTZkbPhkuVI72IhEcQZKHGo8OTlALPh6FEN6KJnQPhbhb66
Q9ikVPzDaUVQvur845Y6oIUPNx+y60BilaGAg+IIYcuOq96DQ29NAb8w6NN2O1ta
NL8FZIbs43cdp1GlMJOIb1p/fmHfEe6AzhSxDGuxcLlaoty8oXMp4VXQtELIspD8
KP/VZ2fPAgMBAAECggEABRnWQ4DBkcxmeBCSlt9u7n4rM5yi/YFwy4eBPuD/nK7u
dWZ0VkNDpBeK8ZX+zxqkEZ21B30bxBTm6PSPZUid0sNrdt+6MjCuLzWFG2C4K9VW
gSXb0gWQSZNy7j2LgnYqVLUNvN8W/TD/zOQp8KMyGa8OTKR/lNtXCts7pIF6LRuw
XcW4o1DRftAMJPEWTKSnBsymmgGGuf4zhbljWcBfqfnxXlRoUGNqV5/RwuQP4bZL
7MPClA51hSyx8HwWngVDbtrUUKTmT7x59hkOlnN12l1H0dd6OsN4KsXaVT4K8IW+
2kMt6A6Mm3iY9OhgPY4W/NIYFiWqyKGrxmB8xIqqaQKBgQD14Q3fEhq8jPmGGq0y
pwcTYsdie0c248Xo30vYNaT+WKn0JvNhkXmaBRVbzCIiMUZ7szD/pZTnnW10s/Cj
GXftQMG5G47xO4L5HF2v+C6VBpq62Abs9BS+TBUgKbg4cgyoaNJyJkSjE0KK1dMI
MzJogYtmwm2rKt1TWcsEn8k+xQKBgQDZjLubUM2LgfrTGqhJHCa5H4mGqDaO8CzO
byMPrwL42RIwsixXU2XTDSbcbmofVWT33RqyYUqhGqOajZpA/wPnchNiFenEoLWF
3FzN0UlyTGvZjHLO9R37e5izpn1MqxiphCiVwwQhuaPdi8yMU1skjLpy7D9ul4UV
epWvWI+1gwKBgG3MjHc7DHl6ssryCrn94KkFiWgvCQQ3/t8ZKDNq8T0rtulyo2jE
n/rpnjoaFHwUaRdAU/c1qCMuJ/zfhewvqWBndJsG9XRAUSKRSj0UpSijhGE/qwgR
j1nTe/Oa7cs3EvP5q1CSSkBQj3yUM+MLic0lXG0NEhBH2gIorQJpoGLJAoGBAK4B
LbF+ANm7/iZJ5R6NAMADZJmrA/ByVDRNmkqaHhNydGU0rdivIPudQl7/haxIPjku
xYK15N5VE1S0PBQOpU3C5ZQHmPIn5OkLp8MLyeY9D+pytwWn8vJKGope+UuQcmps
BZY75JshA9tZTSNULMtgMGVpZxcK5GyYnw8gE9oHAoGAS9c6qotnkoqMXoR+BGGN
qou+roOfzHZAqZaEiAWPS3qAeKilxqEtKwnyBoB95lvKPrSPKuEK0oT4rE78GFCM
Ozh7cnyrpLx3Edl8tJjmkbwJydwrPJbWMZdLrqyGfOPVez2pzZCy4Atvi01etOrI
WXUVecJuLygidfCd3RJ4F+g=
-----END PRIVATE KEY-----`;
const region = Region.SA_SAOPAULO_1; // Change to appropriate region
export const providerStorage = new ConfigFileAuthenticationDetailsProvider();
