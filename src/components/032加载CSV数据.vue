/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-05-07
*/
<template>
	<div class="container">
		<h3>vue+openlayers: 加载CSV数据，显示各个点</h3>
		<p>文件来源：https://xiaozhuanlan.com/vue-openlayers</p>
		<h4>
			<el-button type="success" size="mini" @click="showPoints()">显示csv点</el-button>
		</h4>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
    import Tile from 'ol/layer/Tile'
    import XYZ from "ol/source/XYZ";
	import VectorLayer from 'ol/layer/Vector'
	import VectorSource from 'ol/source/Vector'
	import Feature from 'ol/Feature'
	import {Point, LineString, Circle, Polygon} from "ol/geom"
	import Style from 'ol/style/Style'
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import CircleStyle from 'ol/style/Circle'
    import {csv} from "d3-fetch";
	
	export default {
		data() {
			return {
				map: null,
				dataSource: new VectorSource({ wrapX: false }), 
			}
		},
		methods: {
			showPoints(){
				csv("/data/csv-data.csv").then((data) => {

				  let pointFeatures=[];
				  for(let i=0;i<data.length;i++){					  
					  let lat=data[i].latitude;
					  let lon=data[i].longitude;
					  let pointFeature= new Feature({
					      geometry: new Point([lon,lat]),                
					  })
					 pointFeatures.push(pointFeature) 
				  }
				  console.log(pointFeatures)
				  this.dataSource.addFeatures(pointFeatures)
				});
				
			},
			
			featureStyle(){
			            let style=new Style({
			                      fill:new Fill({
			                          color:"#00f"
			                      }),
			                      stroke:new Stroke({
			                          width:2,
			                          color:"#0f0",
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
				let OSMlayer=new Tile({
                            source: new XYZ({
                                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
								tileSize: 512,
                            })
                        });
				 let feature_Layer=new VectorLayer({
					 source:this.dataSource,
					 style:this.featureStyle() //统一设置vector样式
				 });	
				 
				this.map = new Map({
					target: "vue-openlayers",
					layers: [OSMlayer,feature_Layer],
					view: new View({
					projection: "EPSG:4326",
					center: [-96.6458333, 28.9783333],
					zoom: 2
					
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
		height: 590px;
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


