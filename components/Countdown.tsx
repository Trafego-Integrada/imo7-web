import { Text } from "@chakra-ui/react"
import { useEffect } from "react"

interface CountdownButtonProps {
    count: number
    setCount: (count: number) => void
}

export function Countdown({ count, setCount }: CountdownButtonProps) {
    useEffect(() => {
        if (count > 0) {
            setTimeout(() => setCount(count - 1), 1000)
        }
    }, [count, setCount])

    return (
        <Text>Resultado em {count} segundos</Text>
    )
}