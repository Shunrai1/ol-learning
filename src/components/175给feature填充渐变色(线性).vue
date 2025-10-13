/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-11-24
*/

<template>
    <div class="container">
        <h3>vue+openlayers: 解析json文件，给feature填充渐变色</h3>
        <p>文件来源：https://xiaozhuanlan.com/vue-openlayers</p>
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

    // 引用数据
    import geojsonObject from '@/assets/data/json/liaoning_province.json'
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
                    center: [122.8, 41.5], 
                    zoom: 6
                })
            }
        },
        methods: {
			getStyle(){
				const pixelRatio = DEVICE_PIXEL_RATIO;
				const canvas = document.createElement('canvas');
				const context = canvas.getContext('2d');
				const gradient = context.createLinearGradient(0, 0, 1024 * pixelRatio, 0);
				gradient.addColorStop(0, 'red');
				gradient.addColorStop(1 / 3, 'orange');
				gradient.addColorStop(2 / 3, 'yellow');
				gradient.addColorStop(1 , 'green');
		
				let style= new Style({
					fill:new Fill({
						color:gradient
					}),
					stroke:new Stroke({
                       width: 2,
                       color: "darkgreen",
					})
				})
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
