import { toast } from 'vue3-toastify'

export const showSuccess = (message) => {

    toast.success(message, {

        autoClose: 2000,

        position: 'top-right'

    })

}

export const showError = (message) => {

    toast.error(message, {

        autoClose: 3000,

        position: 'top-right'

    })

}

export const showInfo = (message) => {

    toast.info(message, {

        autoClose: 2000,

        position: 'top-right'

    })

}