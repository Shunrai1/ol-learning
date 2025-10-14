/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-11-25
*/

<template>
    <div class="container">
        <h3>vue+openlayers: 加载Esri地图(多种形式)</h3>
        <p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
				<el-button type="primary" size="mini" @click="showmap('World_Imagery')">World_Imagery</el-button>
				<el-button type="primary" size="mini" @click="showmap('World_Street_Map')">World_Street</el-button>
				<el-button type="primary" size="mini" @click="showmap('World_Terrain_Base')">World_Terrain</el-button>
				<el-button type="primary" size="mini" @click="showmap('World_Physical_Map')">World_Physical</el-button>
		</h4>
        <div id="vue-openlayers" ></div>
    </div>
</template>

<script>
    import 'ol/ol.css'
    import {Map,View} from 'ol'
    import Tile from 'ol/layer/Tile'
    import XYZ from "ol/source/XYZ";
    import {useGeographic,fromLonLat,toLonLat,transform} from "ol/proj";

    export default {
        data() {
            return {
                map: null,
				source: new XYZ({
					crossOrigin:"anonymous", 
				}),
				textsource: new XYZ({
					crossOrigin:"anonymous", 
				}),
            }
        },
        methods: {
			showmap(x){
				 this.source.clear()
				 let url='https://server.arcgisonline.com/ArcGIS/rest/services/'+x+'/MapServer/tile/{z}/{y}/{x}'				
				 this.source.setUrl(url);
			},

            initMap() {
                // 地图实例
                this.map = new Map({
                    target: "vue-openlayers",
                    layers: [
                        new Tile({
                            source: this.source
                        }),
						new Tile({
						    source:new XYZ({
								crossOrigin:"anonymous", 
								url:'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}'
							}),
						}),
                    ],
                    view: new View({
                        projection: "EPSG:3857",
                        center: fromLonLat([-114.064839, 22.548857]), 
                        zoom: 3
                    })
                })
            },


        },
        mounted() {
            this.initMap();
			this.showmap('Ocean/World_Ocean_Base')
        }
    }
</script>
<style scoped>
    .container{
        width: 840px;
        height: 600px;
        margin: 50px auto;
        border: 1px solid #42B983;
    }
    #vue-openlayers {
        width: 800px;
        height: 430px;
        margin: 0 auto;
        border: 1px solid #42B983;
        position: relative;
    }
</style>
