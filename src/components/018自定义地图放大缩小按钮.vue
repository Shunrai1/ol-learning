/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复度过高（超过60%）地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-05-17
*/

<template>
    <div class="container">
        <h3>vue+openlayers: 禁用原有zoom控件，自定义地图放大缩小</h3>
        <p>大剑师兰特, 还是大剑师兰特</p>
        <div id="vue-openlayers" >
			<div class="zoomin" @click="zoomin()">+</div>
			<div class="zoomout" @click="zoomout()">-</div>
		</div>
		
    </div>
</template>

<script>
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import {fromLonLat} from 'ol/proj'
import * as control from 'ol/control';

    export default {
        name: 'Mapbox',
        data(){
            return {
                map:null,
            }
        },
        methods: {
            zoomin(){
				let czoom=this.map.getView().getZoom();
				this.map.getView().setZoom(czoom+1)			
			},
            zoomout(){
			let czoom=this.map.getView().getZoom();
			this.map.getView().setZoom(czoom-1)			
			},
            initMap() {
                this.map = new Map({
                  layers: [
                    new TileLayer({
                      source: new OSM(),
                    }),
                  ],
                  target: 'vue-openlayers',
                  view: new View({
                    center: fromLonLat([116, 39]),
                    projection:"EPSG:3857",
                    zoom: 2,
                  }),
				  controls: control.defaults({
				  	zoom: false,
				  	rotate: false,
				  	attribution: false
				  }).extend([]),
                });

            },
        },
        mounted() {
            this.initMap();         
        },

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
	#vue-openlayers .zoomin,#vue-openlayers .zoomout{
		width: 30px;
		height: 30px;
		line-height: 30px;	
		text-align: center;
		background: rgba(0,0,0,0.6);
		font-size: 20px;
		position: absolute;
		z-index: 2;
		border: 1px solid #000088;
		color: #fff;
		cursor: pointer;
	}
	#vue-openlayers .zoomout{
		bottom: 50px;
		right: 10px;
	}
	#vue-openlayers .zoomin{
		bottom: 80px;
		right: 10px;
	}	
</style>


