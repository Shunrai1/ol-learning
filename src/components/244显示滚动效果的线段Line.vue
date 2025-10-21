/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-05-26
*/
<template>
    <div class="container">
                <h3>vue+openlayers: 显示滚动效果的线段Line </h3>
                <p>大剑师兰特，还是大剑师兰特</p>
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
    import XYZ from 'ol/source/XYZ' 
    import Fill from 'ol/style/Fill'
	import {LineString} from 'ol/geom'
	import Feature from 'ol/Feature'
    import Stroke from 'ol/style/Stroke'
    import Style from 'ol/style/Style'
    import Circle from 'ol/style/Circle'
    import { fromLonLat }  from 'ol/proj'

    export default {
        name: 'VectorJSON',
        data() {
            return {
                map: null,
                source: new SourceVector({
                    wrapX: false
                }),
				lineData:[  
					fromLonLat([0, 51]),  
                    fromLonLat([1, 52]) 
					],
            }
        },
        methods: {
            drawLine(){
				let featureLine = new Feature({
				  geometry: new LineString(this.lineData),
				  dashOffset: 0
				});
				let outlineStroke = new Style({
				  stroke: new Stroke({
				    color: 'red',
				    width: 7,
				  })
				});
				function getAnimationStrokeStyle() {
				  return new Style({
				    stroke: new Stroke({
				      color: [204, 204, 255, 1],
				      width: 4,
				      lineDash: [2, 7],
				      lineDashOffset: featureLine.get('dashOffset')
				    })
				  });
				}
				
				function getStyle() {
				  return [outlineStroke, getAnimationStrokeStyle()];
				}
				
				featureLine.setStyle(getStyle);
				setInterval(function () {
				  let offset = featureLine.get('dashOffset');
				  offset = offset == 8 ? 0 : offset+1;
				  featureLine.set('dashOffset', offset);
				}, 100);
				
				this.source.addFeature(featureLine);
				
			},

            initMap() {
                this.map = new Map({
                    target: 'vue-openlayers',
                    layers: [
                        new Tile({
                            source: new XYZ({
                url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
                })
                        }),
                        new LayerVector({
                            source: this.source,
                        }),
                    ],
                    view: new View({
                    projection: "EPSG:3857",
                    center: fromLonLat([0,51]),
                    zoom: 6
                })
                })

            }
        },
        mounted() {
            this.initMap();
			this.drawLine()
        }
    }
</script>

<style scoped>
    .container {
        width: 1000px;
        height: 600px;
        margin: 50px auto;
        border: 1px solid #42B983;
    }

    #vue-openlayers {
        width: 980px;
        height: 480px;
        margin: 0 auto;
        border: 1px solid #42B983;
        position: relative;
    }
</style>
