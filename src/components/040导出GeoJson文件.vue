/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-04-21
*/

<template>
    <div class="container">
        <h3>vue+openlayers: 导出GeoJSON文件</h3>
        <p>文件来源：https://xiaozhuanlan.com/vue-openlayers</p>
		<h4>
			<el-button type="danger" size="mini" @click="exportJson">导出GeoJSON </el-button>
		</h4>
        <div id="vue-openlayers"></div>
    </div>
</template>
<script>
    import 'ol/ol.css'
    import {Map,View} from 'ol'
    import SourceVector from 'ol/source/Vector'
    import LayerVector from 'ol/layer/Vector'
    import {Tile} from 'ol/layer';
    import OSM from 'ol/source/OSM';
    const FileSaver = require('file-saver');	
	
    export default {
        name: 'exportgeojson',
        data() {
            return {
                map: null,
                source: new SourceVector({
                    wrapX: false
                }),
                view: new View({
                    projection: "EPSG:4326",
                    center: [8.2275, 6.8185], 
                    zoom: 3
                })
            }
        },
        methods: {
        exportJson() {				
			let feadata={ "type": "FeatureCollection",
				    "features": [
				      { "type": "Feature",
				        "geometry": {"type": "Point", "coordinates": [102.0, 0.5]},
				        "properties": {"prop0": "value0"}
				        },
				      { "type": "Feature",
				        "geometry": {
				          "type": "LineString",
				          "coordinates": [
				            [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
				            ]
				          },
				        "properties": {
				          "prop0": "value0",
				          "prop1": 0.0
				          }
				        },
				      { "type": "Feature",
				         "geometry": {
				           "type": "Polygon",
				           "coordinates": [
				             [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
				               [100.0, 1.0], [100.0, 0.0] ]
				             ]
				         },
				         "properties": {
				           "prop0": "value0",
				           "prop1": {"this": "that"}
				           }
				         }
				       ]
				     }
				
				const content = JSON.stringify(feadata);
				const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
				FileSaver.saveAs(blob, 'data.geojson');
				// 名字可以任意定
            },

            initMap() {
                this.map = new Map({
                    target: 'vue-openlayers',
                    layers: [
                        new Tile({
                            source: new OSM()
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


