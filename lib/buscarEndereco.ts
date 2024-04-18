import axios from 'axios'

export const buscarEndereco = async (cep: any) => {
    const TRAFEGOINTEGRADA_API_URL = process.env.TRAFEGOINTEGRADA_API_URL!
    const TRAFEGOINTEGRADA_API = process.env.TRAFEGOINTEGRADA_API!

    const { data } = await axios.get(
        `${TRAFEGOINTEGRADA_API_URL}/v1/cep/` + cep.replace('-', '') + '.json',
        {
            headers: {
                Referer: TRAFEGOINTEGRADA_API,
            },
        },
    )
    return data
}
