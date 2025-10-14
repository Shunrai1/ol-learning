<!-- module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.geojson$/,
          loader: 'json-loader'
        }
      ]
    }
  }
} -->
<!-- npm install json-loader -->



/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-11-29
*/

<template>
    <div class="container">
        <h3>vue+openlayers: 给每个feature添加渐变色，非整体的</h3>
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
	import {DEVICE_PIXEL_RATIO} from 'ol/has'
    import {Tile} from 'ol/layer';
	import XYZ from "ol/source/XYZ";
	import Style from 'ol/style/Style'
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import { fromLatLng, toLatLng } from 'ol/proj'

    // 引用数据
    import geojsonObject from '@/assets/data/geojson/mydata.geojson'
    export default {
        name: 'VectorJSON',
        data() {
            return {
                map: null,
                source: new SourceVector({
                    features: new GeoJSON().readFeatures(geojsonObject, {
                        dataProjection: 'EPSG:4326',
                        featureProjection: "EPSG:4326"
                    }),
                }),
                view: new View({
                    projection: "EPSG:4326",
                    center: [18.697,25.829], 
                    zoom: 2
                })
            }
        },
        methods: {
			setstyle(){
                const style = new Style({
                           renderer(coordinates, state) {
							   console.log(coordinates)
                               const pointsX = coordinates[0].map((obj) => obj[0]);
                               const pointsY = coordinates[0].map((obj) => obj[1]);							  
                               const start= [Math.min(...pointsX), Math.min(...pointsY)];
                               const end= [Math.max(...pointsX), Math.max(...pointsY)];
                               const ctx = state.context;
                               const grad = ctx.createLinearGradient(start[0], start[1], start[0], end[1]);
                               grad.addColorStop(0, '#ff0000');
                               grad.addColorStop(0.25, '#66FFFF');
                               grad.addColorStop(0.5, '#ff00FF');
                               grad.addColorStop(0.75, '#66FF00');
                               grad.addColorStop(1, '#0000FF');
                               ctx.beginPath();
                               ctx.fillStyle = grad;
                               ctx.moveTo(coordinates[0][0][0], coordinates[0][0][1]);
                               for (let i = 0; i < coordinates[0].length; i++) {
                                   ctx.lineTo(coordinates[0][i][0], coordinates[0][i][1]);
                               }
                               ctx.fill();
                           },
                       });
                       return style;
			},

            initMap() {
                this.map = new Map({
                    target: 'vue-openlayers',
                    layers: [
                        new Tile({
                            source: new XYZ({
                            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/tile/{z}/{y}/{x}'
                            }),
                        }),
                        new LayerVector({
                            source: this.source,
							style: this.setstyle
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
        height: 580px;
        margin: 50px auto;
        border: 1px solid #42B983;
    }

    #vue-openlayers {
        width: 800px;
        height: 460px;
        margin: 0 auto;
        border: 1px solid #42B983;
        position: relative;
    }
</style>
