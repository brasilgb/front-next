import { logoutAction } from '@/lib/actions'
import React from 'react'

function UserActions() {
    return (
        <div>
            <form action={logoutAction}>
                <button type="submit">
                    Sair
                </button>
            </form>
        </div>
    )
}

export default UserActions