const baseUrl = process.env.VUE_APP_URL

export default {
    // traceview
    getMap: `${baseUrl}/traceview/getMap`,
    analyze: `${baseUrl}/traceview/analyze`,
    selector: `${baseUrl}/func/selector`,
    topic: `${baseUrl}/event/topic`,
}