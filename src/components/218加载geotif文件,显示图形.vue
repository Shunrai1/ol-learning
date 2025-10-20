
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
        <h3>vue+openlayers: 加载geotiff文件，显示图形</h3>
    <p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
		    <el-button type="warning" size="mini" @click='loadTif()'>加载geotiff文件 </el-button>
		</h4>
        <div id="vue-openlayers"></div>
    </div>
</template>

<script>
    import 'ol/ol.css'
    import {Map,View} from 'ol'
    import Tile from 'ol/layer/WebGLTile'
    import XYZ from 'ol/source/XYZ';
    import VectorLayer from 'ol/layer/Vector'
    import VectorSource from 'ol/source/Vector'
    import GeoTIFF from 'ol/source/GeoTIFF.js';
	import { fromLonLat } from 'ol/proj'
    export default {
        data() {
            return {
                map: null,
                source: new VectorSource(),
            }
        },
        methods: {
             loadTif(){
				 const source = new GeoTIFF({
				   sources: [
				     {
				       url: 'data/no-overviews.tif',
				     },
				   ],
				 });

				 const tifLayer = new Tile({				 
				     source: source,			 
				 });
				 this.map.addLayer(tifLayer)
			 },

            initMap() {
                let googleLayer = new Tile({
                    source: new XYZ({
						url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
						crossOrigin: "anonymous"
					}),
                })

                this.map = new Map({
                    target: "vue-openlayers",
					projection: "EPSG:3857",
                    layers: [googleLayer],
                    view: new View({
                        center:fromLonLat([4.32,23.6]) ,
                        zoom: 6,
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
        height: 430px;
        margin: 0 auto;
        border: 1px solid #42B983;
        position: relative;
    }
</style>

