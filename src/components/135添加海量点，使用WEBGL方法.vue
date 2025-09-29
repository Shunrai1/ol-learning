/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-09-28
*/
<template>
    <div class="container">
        <h3>vue+openlayers: 添加海量点，使用WebGLPoints方式</h3>
        <p>大剑师兰特, 还是大剑师兰特</p>
        <h4>
            <el-button type="primary" size="mini" @click="showPoint()">显示点</el-button>
            <el-button type="primary" size="mini" @click="clearLayer()">清除图层</el-button>
        </h4>
        <div id="vue-openlayers"></div>
    </div>
</template>

<script>
    import 'ol/ol.css';
    import {Map,View} from 'ol'
    import TileLayer from 'ol/layer/Tile'
    import VectorLayer from 'ol/layer/Vector'
    import VectorSource from 'ol/source/Vector'
    import OSM from 'ol/source/OSM'
    import Feature from 'ol/Feature'
    import {Point,LineString,Circle,Polygon} from "ol/geom"
    import Style from 'ol/style/Style'
    // import Fill from 'ol/style/Fill'
    // import Stroke from 'ol/style/Stroke'
    // import CircleStyle from 'ol/style/Circle'
	import WebGLPointsLayer from 'ol/layer/WebGLPoints';

    export default {
        data() {
            return {
                map: null,
                dataSource: new VectorSource({
                    wrapX: false
                }),
            };
        },

        methods: {

            // 设置vector样式
            featureStyle() {
			let style = {
				symbol: {
					symbolType: 'image',
					size: 2,
					color: '#ff0000'
				}
			};

                return style
            },
            // 清除vector数据源
            clearLayer() {
                this.dataSource.clear();
            },

            showPoint() {
                for (let i = 0; i < 20000; i++) {
                    let a = Math.floor(Math.random() * 360) - 180;
                    let b = Math.floor(Math.random() * 180) - 90;
                    let pointFeature = new Feature({
                        geometry: new Point([a, b]),
                    })
                    this.dataSource.addFeature(pointFeature)
                }

            },

    
            initMap() {
                let OSM_Layer = new TileLayer({
                    source: new OSM()
                })
                let feature_Layer = new WebGLPointsLayer({
                    source: this.dataSource,
                    style: this.featureStyle() //统一设置vector样式
                })

                this.map = new Map({
                    target: "vue-openlayers",
                    layers: [
                        OSM_Layer,
                        feature_Layer
                    ],
                    view: new View({
                        projection: "EPSG:4326",
                        center: [90, 0],
                        zoom: 1
                    }),
                })

            },
        },
        mounted() {
            this.initMap()
        }
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
        position: relative;
    }
</style>

