<template>
    <Card>
        <p slot="title">实时数据：</p>
        <div ref="chart" style="width: 100%; height: 500px;"></div>
    </Card>
</template>
<script>
    import mqtt from 'mqtt'
    import echarts from 'echarts'
    import {baseUrl} from '@/api/url'
    export default {
        data () {
            return {
                chart: null,
                option: {
                    grid: {
                        left: '2%',
                        right: '5%',
                        bottom: '3%',
                        containLabel: true
                    },
                    legend: {
                        padding: [1, 1],
                        data: []
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            animation: false
                        }
                    },
                    xAxis: {
                        type: 'time',
                        splitLine: {
                            show: false
                        }
                    },
                    yAxis: {
                        type: 'value',
                        boundaryGap: ['5%', '5%'],
                        splitLine: {
                            show: false
                        },
                        scale: true
                    },
                    dataZoom: [{
                        type: 'inside',
                        xAxisIndex: 0
                    }],
                    series: []
                },
                data: [],
                realtime: {
                    'set1': {data: []}
                }
            }
        },
        mounted() {
            this.chart = echarts.init(this.$refs.chart)
            this.connect(baseUrl + '/mqtt', 'sub/neucloud/websocket')
        },
        methods: {
            connect(brokerUrl, topic) {
                let client = mqtt.connect(brokerUrl)
                client.on('connect', () => {
                    client.subscribe(topic)
                })
                client.on('message', (topic, message) => {
                    // console.log('Received Message: ' + message.toString())
                    const {
                        datapoint: key,
                        deviceId,
                        timeStamp,
                        value
                    } = JSON.parse(message.toString())
                    if (!this.realtime[key]) return
                    const ts = timeStamp
                    const val = isNaN(value) ? value : parseFloat(parseFloat(value).toFixed(4))
                    this.pushDataInRealTimeKey({
                        key,
                        data: [ts, val]
                    })
                })
                this.client = client
            },
            pushDataInRealTimeKey(payload) {
                const { key, data } = payload
                if (this.realtime[key].data.length >= 100) {
                    this.realtime[key].data.shift()
                }
                this.realtime[key].data = [...this.realtime[key].data, data]
                this.init()
            },
            init() {
                this.data = Object.keys(this.realtime).map(key => {
                    const { data } = this.realtime[key]
                    return {
                        type: 'line',
                        showSymbol: false,
                        name: `${key}`,
                        data
                    }
                })
                this.option.series = this.data
                this.data.forEach(item => {
                    this.option.legend.data.push(item.name)
                })
                this.chart.setOption(this.option, true)
            }
        },
        beforeDestroy () {
            this.chart && this.chart.dispose()
            this.client && this.client.end()
        }
    }
</script>
<style lang="less" scoped>

</style>
