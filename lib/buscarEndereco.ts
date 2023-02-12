import axios from "axios";

export const buscarEndereco = async (cep) => {
    const { data } = await axios.get(
        "https://trafegointegrada.api.findcep.com/v1/cep/" +
            cep.replace("-", "") +
            ".json",
        {
            headers: {
                Referer: "trafegointegrada",
            },
        }
    );
    return data;
};
