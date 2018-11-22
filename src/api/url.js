export const baseUrl = process.env.devUrl

const clientId = process.env.clientId
const config = {
    parame: `/oauth/authorize?response_type=token&client_id=${clientId}&scope=user_info&redirect_uri=${window.location.protocol}//${window.location.host}`
}
export const loginUaaConfig = {
    host: process.env.uaaHost,
    parame: config.parame
}
