
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-10-24
*/

<template>
    <div class="container">
        <h3>vue+openlayers: 地图上添加Echarts环形图</h3>
        <p>大剑师兰特, 还是大剑师兰特</p>
        <div id="vue-openlayers"></div>
    </div>
</template>

<script>
    import 'ol/ol.css';
    import {Map,View} from 'ol'
    import TileLayer from 'ol/layer/Tile'
    import OSM from 'ol/source/OSM'
    import EChartsLayer from 'ol-echarts'
	import { fromLonLat, toLonLat, transform } from "ol/proj";
    export default {
        data() {
            return {
                map: null,
                osmLayer: null,
            };
        },
        methods: {
            initMap() {
                this.osmLayer = new TileLayer({
                    source: new OSM(),
                });
                this.map = new Map({
                    target: "vue-openlayers",
                    layers: [
                        this.osmLayer,
                    ],
                    view: new View({
                        projection: "EPSG:3857",
                        center: fromLonLat([118.53, 33.44]),
                        zoom: 5
                    }),
                })

                // 以下为加载echarts代码
                let echartslayer = new EChartsLayer({
                    tooltip: {
                        trigger: "item",
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    color:['#45C2E0', '#FF0000','orange'],
                    series: [{
                            name: "北京",
                            type: "pie",
                            radius: ['25', '40'],
                            coordinates: [116.53, 39.44],
                            data: [{
                                    value: 335,
                                    name: "娱乐"
                                },
                                {
                                    value: 310,
                                    name: "教育"
                                },
                                {
                                    value: 234,
                                    name: "体育"
                                }
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: "rgba(255, 0, 0, 0.5)"
                                }
                            }
                        },
						{
						        name: "上海",
						        type: "pie",
						        radius: ['25', '40'],
						        coordinates: [121.46, 31.22],
						        data: [{
						                value: 335,
						                name: "娱乐"
						            },
						            {
						                value: 310,
						                name: "教育"
						            },
						            {
						                value: 234,
						                name: "体育"
						            }
						        ],
						        itemStyle: {
						            emphasis: {
						                shadowBlur: 10,
						                shadowOffsetX: 0,
						                shadowColor: "rgba(255, 0, 0, 0.5)"
						            }
						        }
						    }

                    ]
                });
                echartslayer.appendTo(this.map);
            },
        },
        mounted() {
            this.initMap();
        }
    }
</script>
<style scoped>
    .container {
        width: 840px;
        height: 570px;
        margin: 50px auto;
        border: 1px solid #42B983;
        position: relative;
    }

    #vue-openlayers {
        width: 800px;
        height: 450px;
        margin: 0 auto;
        border: 1px solid #42B983;
        position: relative;
    }
</style>
