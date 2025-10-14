
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-12-05
*/

<template>
    <div class="container">
        <h3>vue+openlayers: 使用D3实现地图区块呈现不同颜色的效果</h3>
        <p>大剑师兰特, 还是大剑师兰特</p>
        <div id="vue-openlayers"></div>
    </div>
</template>

<script>
    import 'ol/ol.css'
    import {Map,View} from 'ol'
    import SourceVector from 'ol/source/Vector'
    import LayerVector from 'ol/layer/Vector'
    import GeoJSON from 'ol/format/GeoJSON'
    import {Tile} from 'ol/layer';
    import XYZ from "ol/source/XYZ";
    import Style from 'ol/style/Style'
    import Fill from 'ol/style/Fill'
    import Stroke from 'ol/style/Stroke'
	import { fromLonLat } from 'ol/proj'
    import * as d3 from "d3";
    // 引用数据
    import geojsonObject from '@/assets/data/json/us-states.json'
    export default {
        name: 'VectorJSON',
        data() {
            return {
                map: null,
                source: new SourceVector({
                    features: new GeoJSON().readFeatures(geojsonObject, {
                        dataProjection: 'EPSG:4326',
                        featureProjection: "EPSG:3857"
                    }),

                }),
                view: new View({
                    projection: "EPSG:3857",
                    center: fromLonLat([122.8, 41.5]), 
                    zoom: 6
                })
            }
        },
        methods: {
           getStyle(){
			     let colors = d3.schemeCategory10;
			     let stroke = new Stroke({ color: 'yellow', width: 1 });
			     let randomIndex = Math.floor( Math.random() * 9 );
			     let fill = new Fill({ color: colors[randomIndex] });
			     let style = new Style({ stroke: stroke, fill: fill }); 
			     return style;  
		   },

            initMap() {
                this.map = new Map({
                    target: 'vue-openlayers',
                    layers: [
                        new Tile({
                            source: new XYZ({
                            url: 'http://{a-c}.tile.openstreetmap.de/{z}/{x}/{y}.png'
                            }),
                        }),
                        new LayerVector({
                            source: this.source,
                            style: this.getStyle
                        }),

                    ],
                    view: this.view
                })

            }
        },
        mounted() {
            this.initMap()
        }
    }
</script>

<style scoped>
    .container {
        width: 840px;
        height: 550px;
        margin: 50px auto;
        border: 1px solid #42B983;
    }

    #vue-openlayers {
        width: 800px;
        height: 420px;
        margin: 0 auto;
        border: 1px solid #42B983;
        position: relative;
    }
</style>

