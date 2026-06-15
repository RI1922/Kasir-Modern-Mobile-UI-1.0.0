export const settingsService = {

    getSettings(){

        const data = localStorage.getItem(
            'store_settings'
        )

        return data
            ? JSON.parse(data)
            : {}

    }

}