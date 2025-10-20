/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-03-11 
*/
<template>
    <div class="container">
        <h3>vue+openlayers: 加载GPX数据，导出geojson文件</h3>
    <p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
		    <el-button type="primary" size="mini" @click='addGPX()'>加载gpx文件 </el-button>
		    <el-button type="danger" size="mini" @click='exportJson'>导出为geoJson文件 </el-button>
		</h4>
        <div id="vue-openlayers"></div>
    </div>
</template>

<script>
    import 'ol/ol.css'
    import {Map,View} from 'ol'
    import Tile from 'ol/layer/Tile'
    import XYZ from 'ol/source/XYZ';
    import VectorLayer from 'ol/layer/Vector'
    import VectorSource from 'ol/source/Vector'
    import Style from 'ol/style/Style'
    import Icon from 'ol/style/Icon'
    import Circle from 'ol/style/Circle'
    import Text from 'ol/style/Text'
    import Fill from 'ol/style/Fill'
    import Stroke from 'ol/style/Stroke'
    import GPX from 'ol/format/GPX';
    const FileSaver = require('file-saver');
	import gpx2GeoJSON from 'gpx2geojson'	
    export default {
        data() {
            return {
                map: null,
                source: new VectorSource(),
                geoData:{},
            }
        },
        methods: {

			exportJson() {		
				let res = JSON.stringify(this.geoData, null, ' ');
				const blob = new Blob([res], {
					type: 'text/plain;charset=utf-8'
				});
				FileSaver.saveAs(blob, 'my.geojson');
			},

            addGPX() {				
				fetch("data/fells_loop.gpx")
					.then((response) => response.text())
				    .then((gpxtext) => {						
						let feas= (new GPX()).readFeatures(gpxtext, {featureProjection: 'EPSG:3857'})
						this.source.addFeatures(feas)
						
						let resXML= new DOMParser().parseFromString(gpxtext, "text/xml")
						 this.geoData=gpx2GeoJSON.gpx(resXML)   
					});				
            },

            initMap() {
                let googleLayer = new Tile({
                    source: new XYZ({
						url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
						crossOrigin: "anonymous"
					}),
                })

                const style = {
                    'Point': new Style({
                        image: new Circle({
                            fill: new Fill({
                                color: '#ff0000',
                            }),
                            radius: 5,
                            stroke: new Stroke({
                                color: 'blue',
                                width: 1,
                            }),
                        }),
                    }),
                    'LineString': new Style({
                        stroke: new Stroke({
                            color: '#FFFF00',
                            width: 3,
                        }),
                    }),
                    'MultiLineString': new Style({
                        stroke: new Stroke({
                            color: 'blue',
                            width: 3,
                        }),
                    }),
                };

                const vectorLayer = new VectorLayer({
                    visible: true,
                    zIndex: 3,
                    source: this.source,
                    style: function(feature) {
                        return style[feature.getGeometry().getType()];
                    },
                });


                this.map = new Map({
                    target: "vue-openlayers",
                    layers: [googleLayer, vectorLayer],
                    view: new View({
                        center: [-7916041.528716288, 5228379.045749711],
                        zoom: 12,
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
        width: 840px;
        height: 620px;
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

