/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-11-03
*/

<template>
    <div class="container">
        <h3>vue+openlayers: 3857坐标系下导出KML文件，自定义name和style</h3>
        <p>大剑师兰特, 还是大剑师兰特</p>
        <h4>
            <el-button type="primary" size="mini" @click="showPolygon()">根据坐标点显示多边形</el-button>
            <el-button type="danger" size="mini" @click="clearDraw()">清除图形</el-button>
            <el-button type="info" size="mini" @click="exportKML()">导出KML</el-button>
        </h4>
        <div id="vue-openlayers"></div>
    </div>
</template>

<script>
    import 'ol/ol.css';
    import {Map,View} from "ol";
    import OSM from "ol/source/OSM";
	import XYZ from 'ol/source/XYZ'
    import TileLayer from "ol/layer/Tile"
    import Feature from 'ol/Feature'
    import LayerVector from 'ol/layer/Vector'
    import SourceVector from 'ol/source/Vector'
    import {Point,LineString,Polygon} from "ol/geom"
    import Fill from 'ol/style/Fill'
    import Stroke from 'ol/style/Stroke'
    import Style from 'ol/style/Style'
    import Circle from 'ol/style/Circle'
    import KML from 'ol/format/KML';
    import {saveAs} from 'file-saver';
	import {useGeographic,fromLonLat,toLonLat,transform} from "ol/proj";

    export default {
        name: "exportKML",
        data() {
            return {
                map: null,
                osmLayer: null,
                source: new SourceVector({
                    wrapX: false,
                    features: [],
                }),
                polygonsData: [{
                        coord: [
                            [-72.16, 41.4134],
                            [-72.0176, 41.3896],
                            [-72.0643, 41.23],
                            [-72.2064, 41.2537],
                            [-72.16, 41.4134]
                        ],
                        name: 'polygon1',
                        color: ["yellow", "blue"]
                    }
                ],
            }
        },
        mounted() {
            this.initMap();
        },
        methods: {
            exportKML() {
                let features = this.source.getFeatures();
				    features.forEach(f => {  //导出KML必须将Geometry的坐标转化为4326
				        f.getGeometry().transform("EPSG:3857", "EPSG:4326");
				    });

                let kmlData = new KML().writeFeaturesNode(features);
                const str = new XMLSerializer().serializeToString(kmlData)

                saveAs(new Blob([str], {
                    type: 'text/plain;charset=utf-8'
                }), `export.kml`);
            },

            clearDraw() {
                this.source.clear()
            },

            featureStyle(x, y) {
                let style = new Style({
                    fill: new Fill({
                        color: x
                    }),
                    stroke: new Stroke({
                        width: 2,
                        color: y,
                    }),
                })
                return style
            },

            showPolygon() {
                this.clearDraw();
                let array = this.polygonsData;
                let features = [];
                for (let i = 0; i < array.length; i++) {
                    let coord = array[i].coord;
                    let x = array[i].color[0];
                    let y = array[i].color[1];
                    let z = array[i].name;
                    let f = new Feature({
                        geometry: new Polygon([coord]),
                    })
					f.getGeometry().transform("EPSG:4326","EPSG:3857");
                    f.setStyle(this.featureStyle(x, y));
                    f.setProperties({
                        name: z
                    });
                    features.push(f)
                }
                this.source.addFeatures(features)
            },

            initMap() {
                this.osmLayer = new TileLayer({
                    source: new XYZ({
			url:'http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=7'
			})
                })

                let vector = new LayerVector({
                    source: this.source,
                    style: new Style({
                        fill: new Fill({
                            color: 'transparent'
                        }),
                        stroke: new Stroke({
                            width: 2,
                            color: "blue",
                        }),
                    })

                });
                this.map = new Map({
                    layers: [this.osmLayer, vector],
                    view: new View({
                        center:fromLonLat([-72.60, 41.4134]) ,
                        zoom: 9,
                        projection: 'EPSG:3857',
                    }),
                    target: 'vue-openlayers'
                })
            }
        },

    }
</script>
<style scoped>
    .container {
        width: 840px;
        height: 570px;
        margin: 50px auto;
        border: 1px solid #42B983;
    }

    #vue-openlayers {
        width: 800px;
        height: 400px;
        margin: 0 auto;
        border: 1px solid #42B983;
    }
</style>

