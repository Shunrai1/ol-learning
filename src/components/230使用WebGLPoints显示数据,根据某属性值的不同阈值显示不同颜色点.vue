

/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-04-07
*/
<template>
    <div class="container">
        <h3>vue+openlayers: 使用WebGLPoints显示数据，根据某属性值的不同阈值显示不同颜色点</h3>
        <p>大剑师兰特, 还是大剑师兰特</p>
        <div id="vue-openlayers"></div>
    </div>
</template>

<script>
    import 'ol/ol.css';
    import {Map,View} from 'ol'
    import TileLayer from 'ol/layer/Tile'
    import VectorLayer from 'ol/layer/Vector'
    import VectorSource from 'ol/source/Vector'
    import XYZ from 'ol/source/XYZ'
    import Feature from 'ol/Feature'
    import {Point,LineString,Circle,Polygon} from "ol/geom"
    import Style from 'ol/style/Style'
	import GeoJSON from 'ol/format/GeoJSON'
    import WebGLPointsLayer from 'ol/layer/WebGLPoints';
    import geojsonObject from '@/assets/data/geojson/city.geojson'
    export default {
        data() {
            return {
                map: null,
                dataSource: new VectorSource({
					features: new GeoJSON().readFeatures(geojsonObject, {
						dataProjection: 'EPSG:4326',
						featureProjection: "EPSG:4326"
					}),
                }),
            };
        },

        methods: {

            // 设置vector样式
            featureStyle(feature){
            let style = {
                symbol: {
                    symbolType: 'image',
                    size: 2,
                     color: [
                            'interpolate',
                            ['linear'],
							['get', 'latitude'],
							-60,
							'#ff14c3',
							-20,
							'#ff621d',
							20,
							'#ffed02',
							60,
							'#00ff67',
                          ],
                }
				
            };

                return style
            },


            initMap() {
                let OSM_Layer = new TileLayer({
                    source: new XYZ({
					  url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
					  crossOrigin: "anonymous"
					})
                })
                let feature_Layer = new WebGLPointsLayer({
                    source: this.dataSource,
                    style: this.featureStyle()  //统一设置vector样式
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
        height: 450px;
        margin: 0 auto;
        border: 1px solid #42B983;
        position: relative;
    }
</style>
