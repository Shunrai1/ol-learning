/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-03-08
*/

<template>
    <div class="container">
        <h3>vue+openlayers: 加载Mapbox地图</h3>
        <p>文件来源：https://xiaozhuanlan.com/vue-openlayers</p>
        <div id="vue-openlayers" ></div>
    </div>
</template>

<script>
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import OSM from 'ol/source/OSM';
import TileJSON from 'ol/source/TileJSON';
import TileLayer from 'ol/layer/Tile';

    export default {
        name: 'Mapbox',
        data: function(){
            return {
				map:null
            }
        },
		methods: {
			initMap() {
				let key="pk.eyJ1IjoiY3VjbGlmZSIsImEiOiJja2dseDlsdGwwMTNoMnpvMGtyMHl1OWUxIn0.LFwWGsFwZS-RXqKB8FEkuA";
				this.map = new Map({
				  layers: [
					new TileLayer({
					  source: new TileJSON({
						url:
						  'https://api.tiles.mapbox.com/v4/mapbox.natural-earth-hypso-bathy.json?secure&access_token='+key,
						crossOrigin: 'anonymous',
					  }),
					}),

				  ],
				  target: 'vue-openlayers',
				  view: new View({
					center: [116, 39],
					 projection:"EPSG:4326",
					zoom: 5,
				  }),
				});
			},


		},
		mounted() {
			this.initMap();
		}
    }
</script>

<style scoped>
    .container{
        width: 840px;
        height: 520px;
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

