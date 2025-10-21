
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2024-07-09
*/

<template>
    <div class="container">
        <h3>vue+openlayers: 根据半径、起始角度、中心点绘制弧线</h3>
        <p>大剑师兰特, 还是大剑师兰特</p>
        <h4>
            <el-button type="primary" size="mini" @click="arcline()">绘制弧线</el-button>
            <el-button type="danger" size="mini" @click="clearSource()">清除图层</el-button>
        </h4>
        <div id="vue-openlayers"></div>
    </div>
</template>

<script>
    import 'ol/ol.css';
    import Map from 'ol/Map'
    import View from 'ol/View'
    import TileLayer from 'ol/layer/Tile'
    import VectorSource from 'ol/source/Vector'
    import VectorLayer from 'ol/layer/Vector'
    import XYZ from 'ol/source/XYZ'
    import {transform,fromLonLat,toLonLat} from 'ol/proj';
    import * as turf from '@turf/turf'
    import GeoJSON from 'ol/format/GeoJSON'
    import {Fill,Stroke,Style,Circle,Icon,Image} from 'ol/style'

    export default {
        data() {
            return {
                map: null,
                turfSource: new VectorSource({
                    wrapX: false
                }),

            };
        },

        methods: {
            show(geojsonData) {
                let features = new GeoJSON().readFeatures(geojsonData, {
                    dataProjection: 'EPSG:4326', //数据投影格式
                    featureProjection: "EPSG:3857" //feature投影格式
                })

                this.turfSource.addFeatures(features)
            },

            clearSource() {
                this.turfSource.clear();
            },
            arcline() {
                var center = [-75, 40];
				var radius = 50;
                var bearing1 = 15;
                var bearing2 = 60;
                var lineArc = turf.lineArc(center,radius, bearing1, bearing2);
                this.show(lineArc)
            },

            initMap() {
                let gaode_Layer = new TileLayer({
                    source: new XYZ({
                        url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=en&size=1&scl=1&style=7'
                    })
                })
                let turfLayer = new VectorLayer({
                    source: this.turfSource,
                    style: new Style({
                            fill: new Fill({
                                color: 'rgba(255,0,0,0.2)'
                            }),
                            stroke: new Stroke({
                                width: 2,
                                color: "blue",
                            }),
                        }),

                })

                this.map = new Map({
                    target: "vue-openlayers",
                    layers: [
                        gaode_Layer,
                        turfLayer
                    ],
                    view: new View({
                        projection: "EPSG:3857",
                        center: fromLonLat([-75, 40]),
                        zoom: 8
                    }),
                })

            },
        },
        mounted() {
            this.initMap();
        }
    }
</script>
<style scoped>
    .container {
        width: 960px;
        height: 660px;
        margin: 50px auto;
        border: 1px solid #42B983;
    }
    #vue-openlayers {
        width: 930px;
        height: 490px;
        margin: 0 auto;
        border: 1px solid #42B983;
        position: relative;
    }
</style>

