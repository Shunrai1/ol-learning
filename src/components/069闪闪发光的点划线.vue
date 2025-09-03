/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-03-14
*/

<template>
    <div class="container">
        <h3>vue+openlayers：闪闪发光的点划线</h3>
        <p>文件来源：https://xiaozhuanlan.com/vue-openlayers</p>
        <div id="vue-openlayers" class="map-x"></div>
    </div>
</template>
<script>
    import 'ol/ol.css'
    import {Map,View} from 'ol'
    import Tile from 'ol/layer/Tile'
    import {OSM } from 'ol/source'
	import VectorLayer from 'ol/layer/Vector'
	import VectorSource from 'ol/source/Vector'
	import Feature from 'ol/Feature'
	import {Point, LineString, Circle, Polygon} from "ol/geom"
	import Style from 'ol/style/Style'
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import CircleStyle from 'ol/style/Circle'
	import { fromLonLat, toLonLat, transform } from "ol/proj"

    export default {
        name: 'zoom',
        data() {
            return {
                map: null,
                lineSource: new VectorSource({ wrapX: false }), 
				status:false,
				vectorlayer:null,
				lineData:[
				      [116,39],
				      [117.005, 39],
				],
            }
        },
        methods: {

            timer() { 
               return setInterval(()=>{ 
				   this.status=!this.status
                   this.showLine(this.status)
              },200) 
            } ,

			showLine(x){
				this.lineSource.clear();
				let lineFeature= new Feature({
					geometry: new LineString(this.lineData),		
				})
				lineFeature.setStyle(this.featureStyle(x));			
				this.lineSource.addFeature(lineFeature)
			
			},

			featureStyle(x){
				let style=new Style({
			              fill:new Fill({
			                  color:"#00f"
			              }),
			              stroke:new Stroke({
			                  width:10,
			                  color:x?"#f00":"#0f0",
							  lineDash:x?[30,20]:[20,30],
							  lineDashOffset:x?20:10
			              }),
			              image: new CircleStyle({  //点样式
			                radius: 10, 
			                fill: new Fill({
			                  color: '#ff0000'
			                })
			              }),				
				})
				return style			
			},
			
            initMap() {
                this.map = new Map({
                    target: 'vue-openlayers',
                    layers: [
                        new Tile({
                            source: new OSM()
                        }),
						new VectorLayer({
							source:this.lineSource
						})
                    ],
                    view: new View({
                        projection: "EPSG:4326",
						center:[116,39],
						// center:transform([114.064839, 22.548857], "EPSG:4326", "EPSG:3857"),
                        zoom: 15
                    }),
                 
                })
				 console.log(this.map.getView().getCenter()) //显示3857中心坐标点的值
            }
        },
        mounted() {
            this.initMap();         
            this.timer();
        },
        destroyed() { 
          clearInterval(this.timer()) ;
        } 
    }
</script>

<style scoped>
    .container{
        width: 840px;
        height: 520px;
        margin: 0 auto;
        border: 1px solid #42B983;
    }
    #vue-openlayers {
        width: 800px;
        height: 400px;
        margin: 0 auto;
        border: 1px solid #42B983;
    }
</style>
