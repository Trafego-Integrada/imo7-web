import { useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { validadeUserPermissions } from '@/utils/validadeUserPermissions'

type UseCanParams = {
    permissoes?: string[]
    cargos?: string[]
}
export function useCan({ permissoes = [], cargos = [] }: UseCanParams) {
    const { user, isAuthenticated }: any = useContext(AuthContext)
    if (!isAuthenticated) {
        return false
    }

    const userHasValidPermissions = validadeUserPermissions({
        user,
        permissoes,
        cargos,
    })

    return userHasValidPermissions
}
